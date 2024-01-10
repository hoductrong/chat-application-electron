import type { Message } from '../types';
import { createNewQueue } from '../utils/queue/queue';
import type { BankQrWorkerRequest, BankQrWorkerResponse } from './constants';

const workerQueue = createNewQueue();

export function makeBankQrParserWorker() {
  // @ts-expect-error: Let's ignore a compile error like this unreachable code
  const worker = new Worker(new URL('./bankqrWorker', import.meta.url));

  const responseMap = new Map<
    number,
    (response: BankQrWorkerResponse) => void
  >();

  worker.onmessage = (event: MessageEvent<BankQrWorkerResponse>) => {
    const { data } = event;
    const { id } = data;
    const responseHandler = responseMap.get(id);
    if (!responseHandler) return;
    responseHandler(data);
  };

  return async (
    id: number,
    message: Message,
    options?: { signal?: AbortSignal },
  ): Promise<BankQrWorkerResponse> => {
    const request: BankQrWorkerRequest = {
      message,
      id,
    };

    try {
      const queue = await workerQueue.add(
        async ({ signal }) => {
          return new Promise<BankQrWorkerResponse>((resolve, reject) => {
            signal?.addEventListener('abort', () => {
              console.log('Abort');
              reject(new DOMException('Aborted', 'AbortError'));
            });

            responseMap.set(id, (response) => {
              responseMap.delete(id);
              resolve(response);
            });
            worker.postMessage(request);
          });
        },
        { signal: options?.signal, id },
      );

      return queue as BankQrWorkerResponse;
      // return new Promise<BankQrWorkerResponse>((resolve) => {
      //   markStart(`bankqrWorker-${id}`);
      //   responseMap.set(id, (response) => {
      //     responseMap.delete(id);
      //     resolve(response);
      //     markEnd(`bankqrWorker-${id}`);
      //     // measure(`bankqrWorker-${id}`);
      //   });
      //   worker.postMessage(request);
      // });
    } catch (error: unknown) {
      return {
        id,
        data: undefined,
        error: (error as Error).message,
      };
    }
  };
}
