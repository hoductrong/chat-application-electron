import { socketManager } from '../socket/SocketManager';
import type { Message } from '../types';
import { createNewQueue } from '../utils/queue/queue';

export const receiveMessageQueue = createNewQueue();

export const handleRequest = (handler: (msg: Message) => void) => {
  socketManager.onMessage((data) => {
    receiveMessageQueue.add(async () => {
      await handler(data);
    });
  });
};
