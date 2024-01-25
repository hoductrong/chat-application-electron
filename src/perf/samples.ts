import type { Message } from 'src/lib/types';
import { faker } from '@faker-js/faker';

export const normalSamples: Message[] = [];

const banks = ['bidv', 'vpbank', 'techcombank'];

for (let i = 0; i < 10000; i++) {
  const randomBank = banks[Math.floor(Math.random() * banks.length)];
  const randomNumbers = Math.floor(
    Math.random() * (999999999 - 100000000) + 100000000,
  ).toString();
  const message = `${createLongString(20)} ${randomBank} ${randomNumbers}`;

  const sample: Message = {
    senderName: 'perf-user',
    message: message,
    conversationId: '1',
    createdAt: 1,
    senderId: 'perf-user',
    id: i + 1,
  };

  normalSamples.push(sample);
}

function createLongString(length: number) {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += faker.word.adjective() + ' ';
  }
  return result;
}

export const longTextSamples: Message[] = [];
