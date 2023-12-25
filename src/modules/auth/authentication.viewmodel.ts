import type { AuthenticateInfo, User } from 'src/lib/types';
import { AppError } from 'src/lib/types';
import type { AuthenticateModel } from 'src/modules/auth/authenticate.model';
import { generateUid } from 'src/lib/utils/uid';
import { logger } from 'src/lib/logger';
import { socketManager } from 'src/lib/socket/SocketManager';
import { getClientId, initNewClientId } from 'src/lib/utils/clientId';
import { makeAutoObservable } from 'mobx';
import { authenticateModel } from './authenticate.model';
import { useState } from 'react';

export class AuthenticationViewModel {
  authenticateModel: AuthenticateModel;
  sessionId: string | null = null;
  error: AppError = AppError.NO_ERROR;

  constructor() {
    this.authenticateModel = authenticateModel;
    makeAutoObservable(this);
    this.sessionId = this.authenticateModel.getSessionId();
  }

  get currentUser(): User | null {
    return this.authenticateModel.fetchCurrentUser();
  }

  init = () => {
    this.addErrorHandlerListener();
  };

  createClientIdIfNotExist = () => {
    const clientId = getClientId();
    if (!clientId) {
      return initNewClientId();
    }
    return clientId;
  };

  clearUserInfo = () => {
    this.authenticateModel.clearUserInfo();
  };

  clearSessionId = () => {
    this.authenticateModel.clearSessionId();
    this.sessionId = null;
  };

  addErrorHandlerListener = () => {
    const handler = (error: any) => {
      logger.info('Socket error', JSON.stringify(error, null, 2));
      if (error?.data?.status === AppError.UNAUTHORIZED) {
        this.clearUserInfo();
        this.clearSessionId();

        socketManager.disconnect();
      }
    };
    socketManager.onError(handler);

    return () => {
      socketManager.offError(handler);
    };
  };

  autoAuthenticate = async (sessionId: string) => {
    if (!sessionId) {
      return;
    }

    await this.authenticateModel.autoAuthenticate(sessionId);
  };

  startAuthenticate = async (
    username: string,
  ): Promise<{ error: AppError }> => {
    const id = generateUid();
    try {
      this.error = AppError.NO_ERROR;
      const auth: AuthenticateInfo = {
        userId: id,
        username,
        clientId: this.createClientIdIfNotExist(),
      };
      const { error } = await this.authenticateModel.startAuthenticate(auth);

      if (error) {
        this.error = error;
        return {
          error,
        };
      }

      this.authenticateModel.saveUserInfo({
        id,
        name: username,
      });

      this.sessionId = this.authenticateModel.getSessionId();

      return {
        error: AppError.NO_ERROR,
      };
    } catch (error: any) {
      logger.error(error);
      this.error =
        typeof error === 'number'
          ? error
          : (error?.code as AppError) ?? AppError.UNKNOWN;
      return {
        error: error?.code ?? AppError.UNKNOWN,
      };
    }
  };
}

export const authHandler = new AuthenticationViewModel();
export const useAuthHandler = () => {
  const [store] = useState<AuthenticationViewModel>(authHandler);

  return store;
};

export const authViewModel = authHandler;
