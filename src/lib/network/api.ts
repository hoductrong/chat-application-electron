import { SocketError } from '../socket/SocketError';
import type { Message, SocketResponse } from '../types';
import { socketManager } from '../socket/SocketManager';
import type { DeepUndefinable } from 'ts-essentials';
import type { Conversation } from '../conversation/types';

type FetchOptions = {
  body: string | object;
};

export async function request(url: string, options: FetchOptions) {
  if (!socketManager.isConnected && !socketManager.isConnecting) {
    await socketManager.connect();
  }

  const { body } = options;
  const res = await socketManager.send(url, body);

  return res;
}

function makeRequestSocket<T>(
  url: string,
  onSuccess?: (data: DeepUndefinable<T>) => T,
) {
  return async (options: FetchOptions): Promise<SocketResponse<T>> => {
    const res = await socketManager.send(url, options.body);
    if (res?.success) {
      if (typeof onSuccess !== 'function') {
        return {
          data: res?.data,
          success: true,
        };
      }

      const parsedData = onSuccess(res?.data);
      return {
        data: parsedData,
        success: true,
      };
    } else {
      const error = new SocketError(res);
      return {
        message: error.message,
        code: error.code,
        success: false,
      };
    }
  };
}

export const requestSendMessage = makeRequestSocket<Message>(
  'message',
  (data) => {
    const { id, senderName, message, conversationId, createdAt, senderId } =
      data || {};
    return {
      id: typeof id === 'number' ? id : 0,
      senderName: typeof senderName === 'string' ? senderName : '',
      message: typeof message === 'string' ? message : '',
      conversationId: typeof conversationId === 'string' ? conversationId : '',
      createdAt: typeof createdAt === 'number' ? createdAt : 0,
      senderId: typeof senderId === 'string' ? senderId : '',
    };
  },
);

export const requestConversationAction = makeRequestSocket<Conversation>(
  'conversation',
  (data) => {
    const { id, members } = data || {};
    return {
      id: typeof id === 'string' ? id : '',
      members: Array.isArray(members)
        ? members.map((mem) => {
            const { userId } = mem || {};
            return {
              userId: typeof userId === 'string' ? userId : '',
            };
          })
        : [],
    };
  },
);

export const requestAuthenticate =
  makeRequestSocket<Record<string, never>>('authenticate');
