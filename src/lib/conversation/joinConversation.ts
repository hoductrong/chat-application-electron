import { logger } from '../logger';
import { requestConversationAction } from '../network/api';
import type { AppError, ConversationAction } from '../types';
import type { Conversation } from './types';

export const conversationAction = async (
  action: ConversationAction,
): Promise<{ data?: Conversation; error?: AppError }> => {
  const res = await requestConversationAction({
    body: action,
  });

  if (!res?.success) {
    logger.error('Send message failed, received data: ', res);
    return {
      error: res.code,
    };
  }

  return {
    data: res.data,
  };
};
