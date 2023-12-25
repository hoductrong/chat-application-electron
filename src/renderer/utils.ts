import { AppError } from 'src/lib/types';

export const formatErrorMessage = (error: AppError): string => {
  if (!error) return '';

  switch (error) {
    case AppError.UNAUTHORIZED:
      return 'You are not authorized to perform this action';
    case AppError.UNKNOWN:
      return 'Something went wrong';
    case AppError.DISCONNECTED:
      return 'You are disconnected from server';
    case AppError.CONNECT_TIMEOUT:
      return 'Connect timeout';
    default:
      return '';
  }
};
