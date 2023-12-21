import { makeAutoObservable, runInAction } from 'mobx';
import { ModuleIdentifier, getViewModel, viewModel } from 'src/reactive';
import { ChatModel } from 'src/models/ChatModel';
import type { AppError, Message } from 'src/lib/types';
import type { Conversation } from 'src/lib/conversation/types';
import { mId as authMId } from './AuthenticationViewModel';
import type { AuthenticationViewModel } from './AuthenticationViewModel';

export const mId = new ModuleIdentifier('chat');
const authHandler = getViewModel<AuthenticationViewModel>(authMId);

const defaultCId = '1';

@viewModel(mId)
export class ChatViewModel {
  listMessages: Message[] = [];
  currentConversation: Conversation | undefined;
  chatModel: ChatModel;
  isDisconnect = false;
  authViewModel: AuthenticationViewModel;
  error?: AppError;

  constructor() {
    this.chatModel = new ChatModel();
    this.authViewModel = authHandler;
    makeAutoObservable(this);
  }

  init = async () => {
    if (authHandler.isAuthenticated) {
      await this.joinDefaultConversation();
      if (!this.currentConversation) return;
      this.setupReceivingMessage(this.currentConversation.id);
    }
    this.chatModel.onDisconnect(() => {
      this.isDisconnect = true;
    });
    this.chatModel.onReconnect(() => {
      this.isDisconnect = false;
    });
  };

  joinDefaultConversation = async () => {
    await this.joinConversation(defaultCId);
    this.currentConversation = {
      id: defaultCId,
      members: [],
    };
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
      this.listMessages = [...this.listMessages, res.data];
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
