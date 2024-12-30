package types

type MessageType string

const (
	MessageTypeUpdate MessageType = "update"
	MessageTypeSync   MessageType = "sync"
)

type Message[T any] struct {
  Type    MessageType `json:"type"`
	Content T           `json:"content"`
}
