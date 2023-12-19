import {
  ModuleIdentifier,
  ViewModelClass,
  getViewModel,
  viewModel,
} from 'src/reactive';
import { ChatModel } from 'src/models/ChatModel';
import type { AppError, Message } from 'src/lib/types';
import type { Conversation } from 'src/lib/conversation/types';
import { mId as authMId } from './AuthenticationViewModel';
import type { AuthenticationViewModel } from './AuthenticationViewModel';

export const mId = new ModuleIdentifier('chat');
const authHandler = getViewModel<AuthenticationViewModel>(authMId);

const defaultCId = '1';

@viewModel(mId)
export class ChatViewModel extends ViewModelClass {
  listMessages: Message[] = [];
  currentConversation: Conversation | undefined;
  chatModel: ChatModel;
  authViewModel: AuthenticationViewModel;
  error?: AppError;

  constructor() {
    super();
    this.chatModel = new ChatModel();
    this.authViewModel = authHandler;
  }

  async joinDefaultConversation() {
    await this.joinConversation(defaultCId);
    this.currentConversation = {
      id: defaultCId,
      members: [],
    };
  }

  setupReceivingMessage(conversationId: string) {
    this.chatModel.onMessage(async (data) => {
      if (data.conversationId !== conversationId) return;

      if (this.isMessageExisted(data)) return;

      this.listMessages.push(data);
      this.triggerRender();
    });
  }

  isMessageExisted(message: Message) {
    return this.listMessages.some((msg) => msg.id === message.id);
  }

  async sendMessage({ to, message }: { to: string; message: string }) {
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
      this.listMessages.push(res.data);
      this.triggerRender();
    }
  }

  async joinConversation(conversationId: string) {
    const res = await this.chatModel.joinConversation({
      conversationId,
      userId: this.authViewModel.currentUser?.id ?? '',
    });
    if (res.data) {
      this.currentConversation = res.data;
      this.setupReceivingMessage(conversationId);
      this.triggerRender();
      return;
    }

    this.error = res.error;
    this.triggerRender();
  }
}
