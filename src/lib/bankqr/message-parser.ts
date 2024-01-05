import type { Message } from '../types';
import type { BankKey, BankAccountMessage } from './constants';
import { banksObject } from './constants';
import { QRPay } from './qr-pay';

const bankNumberRegex = /\b\d{8,14}\b/g;
const keywordMap: Map<string, BankKey> = new Map();

const keywords = Object.values(banksObject).reduce((acc, bank) => {
  const bankKeywords = bank.keywords
    ? [
        ...bank.keywords.split(',').map((e) => e.trim().toLowerCase()),
        bank.shortName.toLowerCase(),
      ]
    : [bank.shortName];

  bankKeywords.forEach((keyword) => {
    keywordMap.set(keyword, bank.key);
  });

  return [...acc, ...bankKeywords];
}, [] as string[]);
const keywordsRegex = new RegExp('\\b(' + keywords.join('|') + ')\\b', 'gi');

export const parseMessage = (msg: Message): BankAccountMessage | undefined => {
  const bankName = getBankName(msg.message);
  if (!bankName) return;

  const [bankNumber] = msg.message.match(bankNumberRegex) ?? [];

  if (!bankNumber) return;

  return {
    bankNumber,
    bankName,
  };
};

export const convertToQrData = (msg: BankAccountMessage): string => {
  const qrPay = QRPay.initVietQR({
    bankBin: banksObject[msg.bankName].bin,
    bankNumber: msg.bankNumber,
  });

  return qrPay.build();
};

export const getBankName = (message: string): BankKey | undefined => {
  let bankName: BankKey | undefined;
  const [match] = message.match(keywordsRegex) || [];
  if (match) {
    bankName = keywordMap.get(match.toLowerCase());
  }

  return bankName;
};
