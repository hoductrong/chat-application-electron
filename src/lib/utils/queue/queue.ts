import PQueue from './p-queue';

export const createNewQueue = () => {
  const queue = new PQueue({
    concurrency: 1000,
  });

  return queue;
};
