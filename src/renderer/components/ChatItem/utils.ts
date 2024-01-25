import { BankKey } from 'src/lib/bankqr/constants';
import bidv from 'src/assets/png/card_bidv.png';
import techcombank from 'src/assets/png/card_techcombank.png';
import vietcombank from 'src/assets/png/card_vietcombank.png';
import vpbank from 'src/assets/png/card_vpbank.png';

export const buildSrcUrl = (blob?: Blob) => {
  if (!blob) {
    return undefined;
  }

  return URL.createObjectURL(blob);
};

export const cardBgMap: Partial<Record<BankKey, any>> = {
  [BankKey.BIDV]: bidv,
  [BankKey.TECHCOMBANK]: techcombank,
  [BankKey.VIETCOMBANK]: vietcombank,
  [BankKey.VPBANK]: vpbank,
};
