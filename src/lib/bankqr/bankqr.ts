import { logger } from '../logger';
import { markEnd, markStart, measure } from '../performance';
import type { Message } from '../types';
import { createNewQueue } from '../utils/queue/queue';
import type { BankQrWorkerResponse } from './constants';
import { makeGenQrFromRaw } from './gen-qr';
import { convertToQrData, parseMessage } from './message-parser';

const queue = createNewQueue();

const genQrCodeFromRawWasm = makeGenQrFromRaw('wasm');
// const genQrCodeFromRawTs = makeGenQrFromRaw('ts');

export function makeBankQrParserMain() {
  return async (
    id: number,
    message: Message,
    options?: { signal?: AbortSignal },
  ): Promise<BankQrWorkerResponse> => {
    try {
      const result = await queue.add(
        async ({ signal }) => {
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
            markStart(`genQrCodeFromRawWasm-${id}`);
            genQrCodeFromRawWasm(rawData).then((qrData) => {
              markEnd(`genQrCodeFromRawWasm-${id}`);
              measure(`genQrCodeFromRawWasm-${id}`, {
                logLevel: 'off',
              });

              resolve({
                id,
                data: {
                  bank: parsedMessage,
                  qrData,
                },
                error: undefined,
              });
            });

            // markStart(`genQrCodeFromRawTs-${id}`);
            // genQrCodeFromRawTs(rawData).then((qrData) => {
            //   markEnd(`genQrCodeFromRawTs-${id}`);
            //   measure(`genQrCodeFromRawTs-${id}`, {
            //     logLevel: 'off',
            //   });
            //   resolve({
            //     id,
            //     data: {
            //       bank: parsedMessage,
            //       qrData,
            //     },
            //     error: undefined,
            //   });
            // });
          });
        },
        { signal: options?.signal, id },
      );

      return result as BankQrWorkerResponse;
    } catch (error: any) {
      logger.log('bankqr: error', id);
      return {
        id,
        data: undefined,
        error: error?.stack ?? error?.message,
      };
    }
  };
}
