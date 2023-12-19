import { getItemLocalStorage, setItemLocalStorage } from './localStorage';

export const setSessionId = (sessionId: string) => {
  setItemLocalStorage('sessionId', sessionId);
};

export const getSessionId = () => {
  return getItemLocalStorage('sessionId');
};

export const clearSessionId = () => {
  window.localStorage.removeItem('sessionId');
};
