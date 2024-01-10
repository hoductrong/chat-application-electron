import { logger } from '../logger';
import type { Message } from '../types';
import { createNewQueue } from '../utils/queue/queue';
import type { BankQrWorkerResponse } from './constants';
import { genQrCodeFromRaw } from './gen-qr';
import { convertToQrData, parseMessage } from './message-parser';

const queue = createNewQueue();

export function makeBankQrParserMain() {
  return async (
    id: number,
    message: Message,
  ): Promise<BankQrWorkerResponse> => {
    try {
      const result = await queue.add(async ({ signal }) => {
        return new Promise<BankQrWorkerResponse>((resolve, reject) => {
          signal?.addEventListener('abort', () => {
            reject(new DOMException('Aborted', 'AbortError'));
          });

          const parsedMessage = parseMessage(message);
          if (!parsedMessage) {
            return {
              id,
              data: undefined,
              error: undefined,
            };
          }
          const rawData = convertToQrData(parsedMessage);
          genQrCodeFromRaw(rawData).then((qrData) => {
            resolve({
              id,
              data: {
                bank: parsedMessage,
                qrData,
              },
              error: undefined,
            });
          });
        });
      });

      return result as BankQrWorkerResponse;
    } catch (error: any) {
      logger.log('bankqr: error', error);
      return {
        id,
        data: undefined,
        error: error?.stack ?? error?.message,
      };
    }
  };
}
