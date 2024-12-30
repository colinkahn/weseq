// hub.go
package websocket

import (
    "sync"
    "log"
    "github.com/colinkahn/weseq/types"
)

type Client[T any] interface {
    Send(types.Message[T]) error
    Close() error
    Equal(Client[T]) bool
}

type Hub[T any] struct {
    clients    map[Client[T]]bool
    broadcast  chan broadcastMessage[T]
    register   chan Client[T]
    unregister chan Client[T]
    stop       chan struct{}
    mu         sync.RWMutex
}

type broadcastMessage[T any] struct {
    message types.Message[T]
    sender  Client[T]
}

func NewHub[T any]() *Hub[T] {
    h := &Hub[T]{
        clients:    make(map[Client[T]]bool),
        broadcast:  make(chan broadcastMessage[T]),
        register:   make(chan Client[T]),
        unregister: make(chan Client[T]),
        stop:       make(chan struct{}),
    }
    return h
}

func (h *Hub[T]) Run() {
    for {
        select {
        case client := <-h.register:
            h.mu.Lock()
            h.clients[client] = true
            log.Print("Registered client")
            h.mu.Unlock()

        case client := <-h.unregister:
            h.mu.Lock()
            if _, ok := h.clients[client]; ok {
                delete(h.clients, client)
                client.Close()
                log.Print("Unregistered client")
            }
            h.mu.Unlock()

        case bm := <-h.broadcast:
            h.mu.RLock()
            log.Print("Broadcasting from client")
            syncMsg := types.Message[T]{
                Type:    types.MessageTypeSync,
                Content: bm.message.Content,
            }

            for client := range h.clients {
                log.Print("Checking client")
                if !client.Equal(bm.sender) {
                    log.Print("Sending to client")
                    if err := client.Send(syncMsg); err != nil {
                        client.Close()
                        delete(h.clients, client)
                    }
                }
            }
            h.mu.RUnlock()
        case <-h.stop:
          return
        }
    }
}

func (h *Hub[T]) RegisterClient(client Client[T]) {
    h.register <- client
}

func (h *Hub[T]) UnregisterClient(client Client[T]) {
    h.unregister <- client
}

func (h *Hub[T]) Broadcast(msg types.Message[T], sender Client[T]) {
    h.broadcast <- broadcastMessage[T]{message: msg, sender: sender}
}

func (h *Hub[T]) Stop() {
    close(h.stop)
}
