/* eslint-disable no-console */
import { io } from 'socket.io-client';
import { normalSamples } from './samples';

const sessionId = '1705494197799';
const socket = io('http://138.2.58.168:4040/', {
  reconnectionAttempts: 3,
  transports: ['websocket'],
  autoConnect: true,
  auth: {
    userId: 'perf-user',
    username: 'perf-user',
    clientId: 'perf-client',
    sessionId,
  },
});

const emitSamples = () => {
  try {
    console.log('Total messages: ', normalSamples.length);
    for (const sample of normalSamples) {
      socket.emit('message', sample, () => {});
    }
  } catch (error) {
    console.log('error', error);
  }
};

emitSamples();
