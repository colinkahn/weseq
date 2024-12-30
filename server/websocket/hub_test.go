package websocket

import (
    "encoding/json"
    "testing"
    "github.com/colinkahn/weseq/types"
)

type MockClient[T any] struct {
    id          string
    receivedMsg chan types.Message[T]
    closed      bool
}

func NewMockClient[T any](id string) *MockClient[T] {
    return &MockClient[T]{
        id:          id,
        receivedMsg: make(chan types.Message[T], 10),
        closed:      false,
    }
}

func (m *MockClient[T]) Equal(other Client[T]) bool {
    o, ok := other.(*MockClient[T])
    if !ok {
        return false
    }

    return m.id == o.id;
}

func (m *MockClient[T]) Send(msg types.Message[T]) error {
    m.receivedMsg <- msg
    return nil
}

func (m *MockClient[T]) Close() error {
    m.closed = true
    return nil
}

func TestHub(t *testing.T) {
    tests := []struct {
        name           string
        setupClients   []string
        senderID       string
        message        types.Message[json.RawMessage]
        wantReceivers []string
        wantClosed    []string
    }{
        {
            name:         "broadcast to multiple clients",
            setupClients: []string{"client1", "client2", "client3"},
            senderID:     "client1",
            message: types.Message[json.RawMessage]{
                Type:    types.MessageTypeUpdate,
                Content: json.RawMessage(`{"key":"value"}`),
            },
            wantReceivers: []string{"client2", "client3"},
            wantClosed:    nil,
        },
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            hub := NewHub[json.RawMessage]()
            go hub.Run()

            defer hub.Stop()

            clients := make(map[string]*MockClient[json.RawMessage])

            for _, id := range tt.setupClients {
                client := NewMockClient[json.RawMessage](id)
                clients[id] = client
                hub.RegisterClient(client)
            }

            if len(tt.wantReceivers) > 0 {
                sender := clients[tt.senderID]

                hub.Broadcast(tt.message, sender)

                for _, id := range tt.wantReceivers {
                    select {
                    case msg := <-clients[id].receivedMsg:
                        if msg.Type != types.MessageTypeSync {
                            t.Errorf("client %s received wrong message type: got %v, want sync",
                                id, msg.Type)
                        }
                    default:
                        t.Errorf("client %s did not receive message", id)
                    }
                }
            }

            for _, id := range tt.wantClosed {
                if !clients[id].closed {
                    t.Errorf("client %s was not closed", id)
                }
            }
        })
    }
}
