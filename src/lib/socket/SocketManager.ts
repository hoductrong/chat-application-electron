import type { Socket as SocketIO } from 'socket.io-client';
import { io } from 'socket.io-client';
import { SOCKET_SERVER_URL } from 'src/constants';
import { logger } from '../logger';
import {
  type SocketResponse,
  type Message,
  type Socket,
  AppError,
} from '../types';
import { SocketError } from './SocketError';
import { env } from 'src/main/utils';
import { setSessionId } from '../utils/session';

const TWENTY_SECONDS = 20000;

type SocketIncomingMessage = SocketResponse<Message>;

type MessageRequestHandler = {
  handleRequest(request: SocketIncomingMessage): void;
};

export class SocketManager extends EventTarget {
  #socket!: Socket;
  #messageRequestHandlers = new Set<MessageRequestHandler>();
  #incomingRequestQueue = new Array<SocketIncomingMessage>();
  isConnected = false;
  isConnecting = false;

  constructor() {
    super();
    this.#socket = io(SOCKET_SERVER_URL, {
      reconnectionAttempts: 3,
      timeout: TWENTY_SECONDS,
      reconnection: true,
      transports: ['websocket'],
      upgrade: false,
      autoConnect: false,
    });

    if (env !== 'production') {
      this.listenAllMessage();
      this.logReconnect();
    }
  }

  setAuthenticateInfo(authInfo: Record<string, string>) {
    this.#socket.auth = authInfo;
  }

  connect() {
    return new Promise<void>((resolve, reject) => {
      try {
        if (this.isConnected) {
          return;
        }

        this.onSession((data) => {
          setSessionId(data.sessionId);
          resolve();
        });

        this.isConnecting = true;
        this.#socket.connect();
        this.retryWhenError();
        this.isConnecting = false;
        this.isConnected = true;
      } catch (error) {
        reject(error);
      }
    });
  }

  retryWhenError() {
    this.onDisconnect(async (reason) => {
      logger.info('Socket is disconnected');
      if (reason === 'io server disconnect') {
        // the disconnection was initiated by the server, you need to reconnect manually
        logger.info('Reconnecting...');
        this.isConnected = false;
        await this.connect();
      }
    });
  }

  onDisconnect(callback: (reason: SocketIO.DisconnectReason) => void) {
    this.#socket.on('disconnect', callback);
  }

  onReconnect(callback: () => void) {
    this.#socket.io.on('reconnect', callback);
  }

  disconnect() {
    if (!this.isConnected) {
      return;
    }

    this.#socket.disconnect();
    this.isConnected = false;
  }

  async send(event: string, ...args: any[]) {
    if (this.isConnecting) {
      logger.info('Socket is connecting. Emit event is ignored');
      return;
    }
    if (!this.isConnected) {
      logger.info('Socket is not connected. Emit event is ignored');
      return;
    }

    const res = await this.#socket.emitWithAck(event, ...args);

    if (typeof res.success !== 'boolean') {
      logger.error(
        'SocketManager: got invalid response from server, ' +
          `response: ${res}`,
      );

      return {
        success: false,
        message: 'Invalid response from server',
        code: AppError.UNKNOWN,
      };
    }

    return res;
  }

  // private handleRequest(req: SocketIncomingMessage): void {
  //   if (this.#messageRequestHandlers.size === 0) {
  //     this.#incomingRequestQueue.push(req);
  //     return;
  //   }

  //   for (const handlers of this.#messageRequestHandlers) {
  //     try {
  //       handlers.handleRequest(req);
  //     } catch (error) {
  //       logger.warn(
  //         'SocketManager: got exception while handling incoming request, ' +
  //           `error: ${error}`,
  //       );
  //     }
  //   }
  // }

  // handleQueuedRequests() {
  //   for (const req of this.#incomingRequestQueue) {
  //     this.handleRequest(req);
  //   }
  //   this.#incomingRequestQueue = [];
  // }

  listenAllMessage() {
    window.localStorage.debug = '*';
    this.#socket.onAny((event, ...args) => {
      logger.info(`Dev: receive message from server: ${event}, ${args}`);
    });
  }

  onMessage(
    onSuccess: (msg: Message) => void,
    onFailed?: (error: Error) => void,
  ) {
    this.#socket.on(
      'message',
      (
        data: SocketResponse<Message>,
        ack: (data: { success: true }) => void,
      ) => {
        ack({ success: true });
        if (data.success) {
          onSuccess(data.data);
          logger.info('Receive message from server: ', data);
        } else {
          onFailed?.(new SocketError(data));
          logger.error('Receive message failed, received data: ', data);
        }
        // this.handleRequest(data);
      },
    );
  }

  onSession(
    onSuccess: (msg: {
      userId: string;
      sessionId: string;
      username: string;
    }) => void,
    onFailed?: (error: Error) => void,
  ) {
    this.#socket.on(
      'session',
      (
        data: SocketResponse<{
          userId: string;
          sessionId: string;
          username: string;
        }>,
      ) => {
        if (data.success) {
          onSuccess(data.data);
          logger.info('Receive session from server: ', data);
        } else {
          onFailed?.(new SocketError(data));
          logger.error('Receive session failed, received data: ', data);
        }
      },
    );
  }

  onError(callback: (error: Error) => void) {
    this.#socket.on('connect_error', callback);
  }

  // registerRequestHandler(handler: MessageRequestHandler) {
  //   this.#messageRequestHandlers.add(handler);
  //   this.handleQueuedRequests();
  // }

  // unregisterRequestHandler(handler: MessageRequestHandler) {
  //   this.#messageRequestHandlers.delete(handler);
  // }

  logReconnect() {
    this.#socket.io.on('reconnect', () => {
      logger.info('Socket is reconnected');
    });
  }
}

export const socketManager = new SocketManager();
