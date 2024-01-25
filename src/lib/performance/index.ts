import { logger } from '../logger';

export function markStart(name: string) {
  performance.mark(`${name}-start`);
}

export function markEnd(name: string) {
  performance.mark(`${name}-end`);
}

type MeasureOptions = {
  start?: string;
  end?: string;
  logLevel?: 'log' | 'warn' | 'error' | 'off';
};
export function measure(name: string, options?: MeasureOptions) {
  const { end, start, logLevel } = options ?? {};
  const startName = start ?? `${name}-start`;
  const endName = end ?? `${name}-end`;

  const result = performance.measure(`${name}-duration`, startName, endName);
  if (logLevel !== 'off') {
    // eslint-disable-next-line no-console
    logger[logLevel ?? 'info'](`${name}-duration`, result);
  }

  return result;
}
