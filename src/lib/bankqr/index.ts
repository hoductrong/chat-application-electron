import { makeBankQrParserWorker } from './initWorker';
import { makeBankQrParserMain } from './bankqr';

type InitialEnvironment = 'main' | 'web-worker';

export const makeBankQrParser = (env: InitialEnvironment) => {
  switch (env) {
    case 'main':
      return makeBankQrParserMain();
    case 'web-worker':
      return makeBankQrParserWorker();
    default:
      throw new Error(`Unknown environment: ${env}`);
  }
};
