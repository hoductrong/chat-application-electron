import { socketManager } from 'src/lib/socket/SocketManager';
import type { AuthenticateInfo, User } from 'src/lib/types';
import {
  getItemLocalStorage,
  setItemLocalStorage,
} from 'src/lib/utils/localStorage';
import { safeParse } from 'src/lib/utils/safeParse';
import { clearSessionId, getSessionId } from 'src/lib/utils/session';

export class AuthenticateModel {
  fetchCurrentUser(): User | null {
    const unparsedUser = getItemLocalStorage('user');
    if (!unparsedUser) {
      return null;
    }
    const user = safeParse<User>(unparsedUser);
    if (!user?.id || !user?.name) {
      return null;
    }

    if (user.id === undefined || user.name === undefined) {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
    };
  }

  async startAuthenticate(auth: AuthenticateInfo) {
    socketManager.setAuthenticateInfo(auth);

    await socketManager.connect();

    if (socketManager.isConnected) {
      setItemLocalStorage('user', {
        id: auth.userId,
        name: auth.username,
      });
    }
  }

  autoAuthenticate(sessionId: string) {
    socketManager.setAuthenticateInfo({
      sessionId,
    });

    socketManager.connect();
  }

  getSessionId() {
    return getSessionId();
  }

  clearSessionId() {
    return clearSessionId();
  }

  saveUserInfo(user: User) {
    if (!user) {
      return;
    }
    setItemLocalStorage('user', user);
  }

  clearUserInfo() {
    window.localStorage.removeItem('user');
  }
}

export const authenticateModel = new AuthenticateModel();
