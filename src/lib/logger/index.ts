import log from 'electron-log';

export const initializeLogger = () => {
  log.initialize({ preload: true });
  log.transports.file.level = false;
};

export const logger = log;
