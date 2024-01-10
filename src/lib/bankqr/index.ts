import { makeBankQrParserWorker } from './initWorker';
import { makeBankQrParserMain } from './bankqr';
import type { Message } from '../types';
import type { BankQrWorkerResponse } from './constants';

type InitialEnvironment = 'main' | 'web-worker';

export const makeBankQrParser = (
  env: InitialEnvironment,
): ((
  id: number,
  message: Message,
  options?:
    | {
        signal?: AbortSignal | undefined;
      }
    | undefined,
) => Promise<BankQrWorkerResponse>) => {
  switch (env) {
    case 'main':
      return makeBankQrParserMain();
    case 'web-worker':
      return makeBankQrParserWorker();
    default:
      throw new Error(`Unknown environment: ${env}`);
  }
};
