import log from 'electron-log';

export const initializeLogger = () => {
  log.initialize({ preload: true });
  log.transports.file.level = 'info';
};

export const logger = log;
