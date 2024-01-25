import { logger } from '../logger';
import { markEnd, markStart, measure } from '../performance';
import type {
  BankQrWorkerResponse,
  BankQrWorkerRequest,
  BankAccount,
} from './constants';
import { makeGenQrFromRaw } from './gen-qr';
import { convertToQrData, parseMessage } from './message-parser';

const genQrCodeFromRawWasm = makeGenQrFromRaw('wasm');
function respond(
  id: number,
  data:
    | {
        qrData: Uint8Array;
        bank: BankAccount;
      }
    | undefined,
  error: Error | undefined,
) {
  const res: BankQrWorkerResponse = {
    id,
    data,
    error: error?.stack ?? error?.message,
  };

  postMessage(res);
}

onmessage = async (event: MessageEvent<BankQrWorkerRequest>) => {
  const { data } = event || {};
  try {
    const parsedMessage = parseMessage(data.message);
    if (!parsedMessage) {
      respond(data.id, undefined, undefined);
      return;
    }
    const rawData = convertToQrData(parsedMessage);

    markStart(`genQrCodeFromRawWasm-${data.id}`);
    const qrData = await genQrCodeFromRawWasm(rawData);
    markEnd(`genQrCodeFromRawWasm-${data.id}`);
    measure(`genQrCodeFromRawWasm-${data.id}`, {
      logLevel: 'off',
    });

    respond(
      data.id,
      {
        qrData,
        bank: parsedMessage,
      },
      undefined,
    );
  } catch (error: any) {
    logger.log('bankqrWorker: error', error);
    respond(data?.id, undefined, error);
  }
};
