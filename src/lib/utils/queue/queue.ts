import PQueue from './p-queue';

type CreateNewQueueOptions = {
  concurrency: number;
};

export const createNewQueue = (options?: CreateNewQueueOptions) => {
  const { concurrency = 1 } = options || {};
  const queue = new PQueue({
    concurrency,
  });

  return queue;
};
