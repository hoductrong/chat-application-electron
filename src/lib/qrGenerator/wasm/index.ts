import type { GenQrCodeFunc } from 'src/lib/types';
import GenQrModule from './gencpp';

export const makeGenQrCode = async (): Promise<GenQrCodeFunc> => {
  const wasmModule = await GenQrModule();
  const genQrCode = wasmModule.genQrCode;
  return async (
    data: string,
    scale: number,
    border: number,
  ): Promise<Uint8Array> => {
    const buffer = (await genQrCode(data, scale, border)) as Uint8Array;

    return buffer;
  };
};

export const genQrCodeSvg = async (
  data: string,
  scale: number,
  border: number,
): Promise<string> => {
  const wasmModule = await GenQrModule();
  const func = wasmModule.genQrCodeSvg;
  return func(data, scale, border);
};
