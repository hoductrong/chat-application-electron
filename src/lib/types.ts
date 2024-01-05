import type { Socket as SocketIO } from 'socket.io-client';

export type SuccessResponse<T> = {
  success: true;
  data: T;
};

export type ErrorResponse = {
  success: false;
  code: AppError;
  message: string;
};

export type ServerToClientEvents = {
  message: (data: SuccessResponse<Message>) => void;
};

export type SocketResponse<T> = SuccessResponse<T> | ErrorResponse;

export type ClientToServerEvents = {
  message: (
    data: Message,
    cb: (message: SocketResponse<object>) => void,
  ) => void;
  conversation: (
    data: { action: 'join' | 'leave'; conversation: string | string[] },
    cb: (message: SocketResponse<object>) => void,
  ) => void;
};

export type Message = {
  id: number;
  senderName: string;
  message: string;
  conversationId: string;
  createdAt: number;
  senderId: string;
  bankQrCode?: HTMLElement;
};

export type MessageWithoutId = Omit<Message, 'id'>;

export type ConversationAction = {
  action: 'join' | 'leave';
  conversation: string;
  userId: string;
};

export type User = {
  id: string;
  name: string;
};

export type AuthenticateInfo = {
  userId: string;
  username: string;
  clientId: string;
};

export type Socket = SocketIO;

export enum AppError {
  CONNECT_TIMEOUT = -3,
  DISCONNECTED = -2,
  UNKNOWN = -1,
  NO_ERROR = 0,
  UNAUTHORIZED = 401,
}
