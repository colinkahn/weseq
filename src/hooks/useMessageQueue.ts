import { useCallback, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { MessageType, Message, MessageTypeUpdate } from '../generated/types';

export type IncomingMessage = Message<'sync', any>;

export type OutgoingMessage = Message<'update', any>;

export interface MessageQueue {
  readonly messages: IncomingMessage[];
}

export const useMessageQueue = (url: string) => {
  const [queue, setQueue] = useState<MessageQueue>({ messages: [] });

  const clearQueue = useCallback(() => setQueue({ messages: [] }), [setQueue]);

  const websocket = useWebSocket<IncomingMessage>(url, {
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

  const sendMessage = useCallback((message: OutgoingMessage) => {
    websocket.sendMessage(JSON.stringify(message));
  }, [websocket]);

  return {
    queue,
    clearQueue,
    sendMessage,
    websocket
  };
};
