import { makeBankQrParser } from 'src/lib/bankqr';
import { markEnd, markStart, measure } from 'src/lib/performance';
import type { Message } from 'src/lib/types';

const samples: Message[] = [];

for (let i = 0; i < 1000; i++) {
  samples.push({
    conversationId: '1',
    id: i + 1,
    createdAt: i,
    message: 'bidv ho duc trong 0999283498',
    senderId: '1',
    senderName: '1',
  });
}

const parseBankQr = makeBankQrParser('web-worker');

export async function perfBankQrParser() {
  for (const sample of samples) {
    // markStart(`parse-svg-${sample.id}`);
    parseBankQr(sample.id, sample);
    // markEnd(`parse-svg-${sample.id}`);
    // measure(`parse-svg-${sample.id}`);
  }
}
