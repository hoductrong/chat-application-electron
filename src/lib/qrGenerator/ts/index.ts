import type { GenQrCodeFunc } from 'src/lib/types';
import { genQrImage } from './gen';

export const makeGenQrCode = async (): Promise<GenQrCodeFunc> => {
  return (data: string, scale: number, border: number): Promise<Uint8Array> =>
    genQrImage(data, scale, border);
};
