import { AppError } from '../types';

type SocketErrorConstructor = {
  code: number;
  message: string;
};

export class SocketError extends Error {
  code: AppError;
  constructor(parameters: SocketErrorConstructor) {
    super(parameters?.message);
    this.code = parameters?.code || AppError.UNKNOWN;
  }
}
