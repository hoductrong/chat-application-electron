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

type ChunkArrayReturnType<T> = Array<{
  id: number;
  data: T[];
}>;
export const chunkArray = <T>(
  arr: T[],
  size: number,
): ChunkArrayReturnType<T> => {
  return arr.reduce((acc, _, i) => {
    if (i % size === 0) {
      acc.push({
        id: Math.floor(i / size),
        data: arr.slice(i, i + size),
      });
    }
    return acc;
  }, [] as ChunkArrayReturnType<T>);
};

export function getScrollbarWidth() {
  // Creating invisible container
  const outer = document.createElement('div');
  outer.style.visibility = 'hidden';
  outer.style.overflow = 'scroll'; // forcing scrollbar to appear
  document.body.appendChild(outer);

  // Creating inner element and placing it in the container
  const inner = document.createElement('div');
  outer.appendChild(inner);

  // Calculating difference between container's full width and the child width
  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;

  // Removing temporary elements from the DOM
  outer.parentNode?.removeChild(outer);

  return scrollbarWidth;
}
