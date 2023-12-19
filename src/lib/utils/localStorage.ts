import { logger } from '../logger';

export function setItemLocalStorage<T>(key: string, value: T) {
  let tempValue = '';
  if (typeof value === 'object') {
    tempValue = JSON.stringify(value);
  } else {
    tempValue = String(value);
  }
  window.localStorage.setItem(key, tempValue);
}

export const getItemLocalStorage = (key: string) => {
  try {
    const res = window.localStorage.getItem(key);
    return res;
  } catch (error: unknown) {
    logger.error(`getItemLocalStorage failed: ${error}`);
    return null;
  }
};
