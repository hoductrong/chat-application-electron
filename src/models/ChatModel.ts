import { conversationAction } from 'src/lib/conversation/joinConversation';
import { handleRequest } from 'src/lib/message/receiveMessage';
import { sendMessage } from 'src/lib/message/sendMessage';
import type { Message, MessageWithoutId } from 'src/lib/types';

export class ChatModel {
  async sendMessage(msg: MessageWithoutId) {
    return sendMessage(msg);
  }

  onMessage(cb: (data: Message) => void) {
    handleRequest(cb);
  }

  async joinConversation({
    conversationId,
    userId,
  }: {
    conversationId: string;
    userId: string;
  }) {
    const res = await conversationAction({
      action: 'join',
      conversation: conversationId,
      userId,
    });

    return res;
  }
}

export const chatModel = new ChatModel();
