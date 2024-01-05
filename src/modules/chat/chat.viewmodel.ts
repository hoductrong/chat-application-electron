import { makeAutoObservable, runInAction, toJS } from 'mobx';
import { chatModel, type ChatModel } from 'src/modules/chat/chat.model';
import type { AppError, Message } from 'src/lib/types';
import type { Conversation } from 'src/lib/conversation/types';
import {
  authHandler,
  type AuthenticationViewModel,
} from '../auth/authentication.viewmodel';
import { useState } from 'react';
import { makeBankQrParser } from 'src/lib/bankqr';

const defaultCId = '1';
const parseBankQr = makeBankQrParser('web-worker');

export class ChatViewModel {
  listMessagesMap: Record<string, Message[]> = {};
  currentConversation: Conversation | undefined;
  chatModel: ChatModel;
  authViewModel: AuthenticationViewModel;
  error?: AppError;

  constructor() {
    this.chatModel = chatModel;
    this.authViewModel = authHandler;
    makeAutoObservable(this);
  }

  get listMessages() {
    return this.listMessagesMap[this.currentConversation?.id ?? ''] ?? [];
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

      const svgString = await parseBankQr(data.id, toJS(data));
      if (svgString.data) {
        performance.mark('start-parse-svg');
        const svg = ChatViewModel.stringToHTMLElement(svgString.data);
        data.bankQrCode = svg;
        performance.mark('end-parse-svg');
      }

      runInAction(() => {
        const messages = this.listMessagesMap[conversationId] ?? [];
        this.listMessagesMap = {
          ...this.listMessagesMap,
          [conversationId]: [...messages, data],
        };
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
      const data = toJS(res.data);

      const svgString = await parseBankQr(res.data.id, data);

      if (svgString.data) {
        const svg = ChatViewModel.stringToHTMLElement(svgString.data);
        res.data.bankQrCode = svg;
      }
      runInAction(() => {
        const currentConversationId = this.currentConversation?.id ?? '';
        this.listMessagesMap = {
          ...this.listMessagesMap,
          [currentConversationId]: newListMessages,
        };
      });
    }
  };

  static stringToHTMLElement(html: string) {
    const svg = new DOMParser().parseFromString(html, 'image/svg+xml');

    return svg.documentElement;
  }

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
