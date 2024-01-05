import { makeGenQrCode } from '../qrGenerator/wasm';
// import { makeGenQrCode } from '../qrGenerator/ts';

let genQrCodeAwaited: (data: string) => Promise<string>;

export async function genQrCodeFromRaw(raw: string): Promise<string> {
  if (!genQrCodeAwaited) {
    genQrCodeAwaited = await makeGenQrCode();
  }

  const res = await genQrCodeAwaited(raw);

  return res;
}
