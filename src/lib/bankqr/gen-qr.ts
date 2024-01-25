import { makeGenQrCode as makeGenQrCodeWasm } from '../qrGenerator/wasm';
import { makeGenQrCode as makeGenQrCodeTs } from '../qrGenerator/ts';
import type { GenQrCodeFunc } from '../types';

let genQrCodeAwaitedWasm: GenQrCodeFunc;
let genQrCodeAwaitedTs: GenQrCodeFunc;

export const makeGenQrFromRaw = (initializer: 'wasm' | 'ts') => {
  if (initializer === 'wasm') {
    return genQrCodeFromRawWasm;
  } else {
    return genQrCodeFromRawTs;
  }
};

async function genQrCodeFromRawWasm(
  raw: string,
  options?: {
    scale?: number;
    border?: number;
  },
): Promise<Uint8Array> {
  const { scale = 4, border = 3 } = options ?? {};
  if (!genQrCodeAwaitedWasm) {
    genQrCodeAwaitedWasm = await makeGenQrCodeWasm();
  }

  const res = await genQrCodeAwaitedWasm(raw, scale, border);

  return res;
}

async function genQrCodeFromRawTs(
  raw: string,
  options?: {
    scale?: number;
    border?: number;
  },
): Promise<Uint8Array> {
  const { scale = 4, border = 4 } = options ?? {};
  if (!genQrCodeAwaitedTs) {
    genQrCodeAwaitedTs = await makeGenQrCodeTs();
  }

  const res = await genQrCodeAwaitedTs(raw, scale, border);

  return res;
}
