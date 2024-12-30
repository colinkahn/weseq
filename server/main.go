package main

import (
	"encoding/json"
	"log"
	"net/http"
	"sync"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

type MessageType string

const (
	MessageTypeUpdate MessageType = "update"
	MessageTypeSync   MessageType = "sync"
)

type Message[M MessageType, T any] struct {
	Type    M `json:"type"`
	Content T `json:"content"`
}

type Client struct {
	conn *websocket.Conn
	id   string
}

type Hub struct {
	clients    map[*Client]bool
	broadcast  chan BroadcastMessage
	register   chan *Client
	unregister chan *Client
	mu         sync.RWMutex
}

type BroadcastMessage struct {
	message Message[MessageType, json.RawMessage]
	sender  *Client
}

func newHub() *Hub {
	return &Hub{
		clients:    make(map[*Client]bool),
		broadcast:  make(chan BroadcastMessage),
		register:   make(chan *Client),
		unregister: make(chan *Client),
	}
}

func (h *Hub) run() {
	for {
		select {
		case client := <-h.register:
			h.mu.Lock()
			h.clients[client] = true
			h.mu.Unlock()

		case client := <-h.unregister:
			h.mu.Lock()
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				client.conn.Close()
			}
			h.mu.Unlock()

		case broadcastMsg := <-h.broadcast:
			h.mu.RLock()
			for client := range h.clients {
				// Don't send sync message back to the sender
				if client == broadcastMsg.sender {
					continue
				}

				// Create a sync message from the update
				syncMsg := Message[MessageType, json.RawMessage]{
					Type:    MessageTypeSync,
					Content: broadcastMsg.message.Content,
				}

				syncBytes, err := json.Marshal(syncMsg)
				if err != nil {
					log.Printf("Error marshaling sync message: %v", err)
					continue
				}

				if err := client.conn.WriteMessage(websocket.TextMessage, syncBytes); err != nil {
					log.Printf("Error broadcasting to client: %v", err)
					client.conn.Close()
					delete(h.clients, client)
				}
			}
			h.mu.RUnlock()
		}
	}
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true // Note: In production, implement proper origin checks
	},
}

func handleWebSocket(hub *Hub, c *gin.Context) {
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Printf("Failed to upgrade connection: %v", err)
		return
	}

	client := &Client{conn: conn, id: c.Query("clientId")}
	hub.register <- client

	defer func() {
		hub.unregister <- client
	}()

	for {
		_, p, err := conn.ReadMessage()
		if err != nil {
			log.Printf("Error reading message: %v", err)
			break
		}

		var message Message[MessageType, json.RawMessage]

		if err := json.Unmarshal(p, &message); err != nil {
			log.Printf("Error parsing message type: %v", err)
			continue
		}

		switch message.Type {
		case MessageTypeUpdate:
			// Broadcast the update message to all other clients
			hub.broadcast <- BroadcastMessage{
				message: message,
				sender:  client,
			}

		default:
			log.Printf("Unknown message type: %s", message.Type)
		}
	}
}

func main() {
	hub := newHub()
	go hub.run()

	r := gin.Default()
	r.GET("/ws", func(c *gin.Context) {
		handleWebSocket(hub, c)
	})

	if err := r.Run(":8080"); err != nil {
		log.Fatal(err)
	}
}
