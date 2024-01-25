import { makeBankQrParser } from 'src/lib/bankqr';
import type { Message } from 'src/lib/types';

const samples: Message[] = [];

for (let i = 0; i < 1000; i++) {
  samples.push({
    conversationId: '1',
    id: i + 1,
    createdAt: i,
    message: 'bidv ho duc trong 0999283498' + createLongString(10000),
    senderId: '1',
    senderName: '1',
  });
}

const parseBankQr = makeBankQrParser('web-worker');

function createLongString(length: number) {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += 'a';
  }
  return result;
}

export async function perfBankQrParser() {
  for (const sample of samples) {
    // markStart(`parse-svg-${sample.id}`);
    parseBankQr(sample.id, sample);
    // markEnd(`parse-svg-${sample.id}`);
    // measure(`parse-svg-${sample.id}`);
  }
}
