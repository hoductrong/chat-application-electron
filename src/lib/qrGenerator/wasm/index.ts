import GenQrModule from './gen';

export const makeGenQrCode = async () => {
  const wasmModule = await GenQrModule();
  const func = wasmModule.cwrap('genQrCode', 'string', ['string']);
  return (data: string): Promise<string> => func(data);
};
