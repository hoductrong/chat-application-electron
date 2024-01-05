import { doBasicDemo } from './gen';

export const makeGenQrCode = async () => {
  return (data: string): Promise<string> => doBasicDemo(data);
};
