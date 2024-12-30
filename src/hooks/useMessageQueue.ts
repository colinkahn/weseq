import { useCallback, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { Message, MessageTypeUpdate } from '../generated/types';

export interface MessageQueue<T> {
  readonly messages: T[];
}

export function useMessageQueue<T>(url: string) {
  const [queue, setQueue] = useState<MessageQueue<Message<T>>>({ messages: [] });

  const clearQueue = useCallback(() => setQueue({ messages: [] }), [setQueue]);

  const websocket = useWebSocket<Message<T>>(url, {
    onMessage: (event) => {
      try {
        const message = JSON.parse(event.data);
        setQueue(current => ({
          messages: [...current.messages, message]
        }));
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    },
    shouldReconnect: (closeEvent) => true,
  });

  const sendMessage = useCallback((message: Message<T>) => {
    websocket.sendMessage(JSON.stringify(message));
  }, [websocket]);

  return {
    queue,
    clearQueue,
    sendMessage,
    websocket
  };
};

export function createOutgoingMessage<T>(content: T): Message<T> {
  return {
    type: MessageTypeUpdate,
    content,
  };
};
