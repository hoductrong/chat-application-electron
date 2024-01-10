import { logger } from '../logger';
import type {
  BankQrWorkerResponse,
  BankQrWorkerRequest,
  BankAccount,
} from './constants';
import { genQrCodeFromRaw } from './gen-qr';
import { convertToQrData, parseMessage } from './message-parser';

function respond(
  id: number,
  data:
    | {
        qrData: string;
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
    console.log('Start parsing', data.id);
    const parsedMessage = parseMessage(data.message);
    if (!parsedMessage) {
      respond(data.id, undefined, undefined);
      return;
    }
    const rawData = convertToQrData(parsedMessage);
    const qrData = await genQrCodeFromRaw(rawData);
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
