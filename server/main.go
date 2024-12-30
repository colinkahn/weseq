package main

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/colinkahn/weseq/types"
	ws "github.com/colinkahn/weseq/websocket"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

type WebSocketClient struct {
    conn *websocket.Conn
}

func (c *WebSocketClient) Send(msg types.Message[json.RawMessage]) error {
    msgBytes, err := json.Marshal(msg)
    if err != nil {
        return err
    }
    return c.conn.WriteMessage(websocket.TextMessage, msgBytes)
}

func (c *WebSocketClient) Equal(other ws.Client[json.RawMessage]) bool {
    o, ok := other.(*WebSocketClient)
    if !ok {
        return false
    }

    return c == o
}

func (c *WebSocketClient) Close() error {
    return c.conn.Close()
}

var upgrader = websocket.Upgrader{
    ReadBufferSize:  1024,
    WriteBufferSize: 1024,
    CheckOrigin: func(r *http.Request) bool {
        return true
    },
}

func handleWebSocket(hub *ws.Hub[json.RawMessage], c *gin.Context) {
    conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
    if err != nil {
        log.Printf("Failed to upgrade connection: %v", err)
        return
    }

    client := &WebSocketClient{conn: conn}

    hub.RegisterClient(client)

    defer hub.UnregisterClient(client)

    for {
        _, p, err := conn.ReadMessage()
        if err != nil {
            log.Printf("Error reading message: %v", err)
            break
        }

        var message types.Message[json.RawMessage]
        if err := json.Unmarshal(p, &message); err != nil {
            log.Printf("Error parsing message: %v", err)
            continue
        }

        switch message.Type {
        case types.MessageTypeUpdate:
          hub.Broadcast(message, client)

        default:
            log.Printf("Unknown message type: %s", message.Type)
        }
    }
}

func main() {
    hub := ws.NewHub[json.RawMessage]()
    go hub.Run()

    r := gin.Default()
    r.GET("/ws", func(c *gin.Context) {
        handleWebSocket(hub, c)
    })

    if err := r.Run(":8080"); err != nil {
        log.Fatal(err)
    }
}
