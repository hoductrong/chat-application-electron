import { ModuleIdentifier, viewModel } from 'src/reactive';
import type { AuthenticateInfo, User } from 'src/lib/types';
import { AppError } from 'src/lib/types';
import type { AuthenticateModel } from 'src/models/AuthenticateModel';
import { authenticateModel } from 'src/models/AuthenticateModel';
import { generateUid } from 'src/lib/utils/uid';
import { logger } from 'src/lib/logger';
import { socketManager } from 'src/lib/socket/SocketManager';
import { getSessionId } from 'src/lib/utils/session';
import { getClientId, initNewClientId } from 'src/lib/utils/clientId';
import { makeAutoObservable } from 'mobx';

export const mId = new ModuleIdentifier('authentication');

@viewModel(mId)
export class AuthenticationViewModel {
  currentUser: User | null = null;
  authenticateModel: AuthenticateModel;

  constructor() {
    this.authenticateModel = authenticateModel;
    makeAutoObservable(this);
  }

  init = () => {
    this.getCurrentUser();
    this.autoAuthenticate();
    this.handleError();
  };

  createClientIdIfNotExist = () => {
    const clientId = getClientId();
    if (!clientId) {
      return initNewClientId();
    }
    return clientId;
  };

  getCurrentUser = () => {
    if (!this.isAuthenticated) {
      return null;
    }

    this.currentUser = this.authenticateModel.fetchCurrentUser();

    return this.currentUser;
  };

  get isAuthenticated() {
    const sessionId = getSessionId();
    return !!sessionId;
  }

  handleError = () => {
    socketManager.onError((error: any) => {
      logger.error('Socket error', error);
      if (error?.data?.status === AppError.UNAUTHORIZED) {
        this.currentUser = null;
        this.authenticateModel.clearUserInfo();
        this.authenticateModel.clearSessionId();
        socketManager.disconnect();
      }
    });
  };

  autoAuthenticate = () => {
    const sessionId = this.authenticateModel.getSessionId();

    if (!sessionId) {
      return;
    }

    this.authenticateModel.autoAuthenticate(sessionId);
  };

  startAuthenticate = async (username: string) => {
    const id = generateUid();
    try {
      const auth: AuthenticateInfo = {
        userId: id,
        username,
        clientId: this.createClientIdIfNotExist(),
      };
      await this.authenticateModel.startAuthenticate(auth);
      this.authenticateModel.saveUserInfo({
        id,
        name: username,
      });
      this.getCurrentUser();
    } catch (error) {
      logger.error(error);
    }
  };
}
