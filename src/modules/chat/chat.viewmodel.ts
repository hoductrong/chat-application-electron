import { makeAutoObservable, runInAction } from 'mobx';
import { chatModel, type ChatModel } from 'src/modules/chat/chat.model';
import type { AppError, Message } from 'src/lib/types';
import type { Conversation } from 'src/lib/conversation/types';
import {
  authHandler,
  type AuthenticationViewModel,
} from '../auth/authentication.viewmodel';
import { useState } from 'react';

const defaultCId = '1';
export class ChatViewModel {
  listMessages: Message[] = [];
  currentConversation: Conversation | undefined;
  chatModel: ChatModel;
  authViewModel: AuthenticationViewModel;
  error?: AppError;

  constructor() {
    this.chatModel = chatModel;
    this.authViewModel = authHandler;
    makeAutoObservable(this);
  }

  joinDefaultConversation = async () => {
    await this.joinConversation(defaultCId);
    this.currentConversation = {
      id: defaultCId,
      members: [],
    };

    return this.currentConversation;
  };

  setupReceivingMessage = (conversationId: string) => {
    this.chatModel.onMessage(async (data) => {
      if (data.conversationId !== conversationId) return;

      if (this.isMessageExisted(data)) return;

      runInAction(() => {
        this.listMessages = [...this.listMessages, data];
      });
    });
  };

  isMessageExisted = (message: Message) => {
    return this.listMessages.some((msg) => msg.id === message.id);
  };

  sendMessage = async ({ to, message }: { to: string; message: string }) => {
    const res = await this.chatModel.sendMessage({
      conversationId: to,
      createdAt: Date.now(),
      message,
      senderId: this.authViewModel.currentUser?.id ?? '',
      senderName: this.authViewModel.currentUser?.name ?? '',
    });

    if (res.error) {
      return {
        error: res.error,
      };
    }

    if (res.data) {
      const newListMessages = [...this.listMessages, res.data];
      runInAction(() => {
        this.listMessages = newListMessages;
      });
    }
  };

  joinConversation = async (conversationId: string) => {
    const res = await this.chatModel.joinConversation({
      conversationId,
      userId: this.authViewModel.currentUser?.id ?? '',
    });
    if (res.data) {
      this.currentConversation = res.data;
      this.setupReceivingMessage(conversationId);
      return;
    }

    this.error = res.error;
  };
}

export const chatHandler = new ChatViewModel();

export const useChatHandler = () => {
  const [store] = useState<ChatViewModel>(chatHandler);

  return store;
};
