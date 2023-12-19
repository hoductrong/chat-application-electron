import { v4 as uuidv4 } from 'uuid';
import { setItemLocalStorage } from './localStorage';

export const generateClientId = () => {
  return uuidv4();
};

export const initNewClientId = (): string => {
  const clientId = generateClientId();

  setItemLocalStorage('cId', clientId);

  return clientId;
};

export const getClientId = (): string | null => {
  const clientId = localStorage.getItem('cId');

  if (!clientId) {
    return null;
  }

  return clientId;
};
