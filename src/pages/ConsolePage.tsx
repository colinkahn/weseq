import React from 'react';
import { useMessageQueue, OutgoingMessage } from 'hooks/useMessageQueue';
import { MessageTypeUpdate } from 'generated/types';

const ConsolePage: React.FC = () => {
  const { queue, websocket } = useMessageQueue('ws://localhost:8080/ws');
  const message: OutgoingMessage = {
   type: 'update',
   content: { column: 'foo' }
  };
  return <>
    <button onClick={() => websocket.sendMessage(JSON.stringify(message))}>Echo</button>
    <pre>{JSON.stringify(queue)}</pre>
  </>;
}

export default ConsolePage;
