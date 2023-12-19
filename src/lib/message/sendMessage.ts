import { logger } from '../logger';
import { requestSendMessage } from '../network/api';
import type { AppError, Message, MessageWithoutId } from '../types';

export const sendMessage = async (
  messageInfo: MessageWithoutId,
): Promise<{
  data?: Message;
  error?: AppError;
}> => {
  const res = await requestSendMessage({
    body: messageInfo,
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
