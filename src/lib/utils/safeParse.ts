import type { DeepUndefinable } from 'ts-essentials';

export function safeParse<T>(value: string): DeepUndefinable<T> | null {
  try {
    const res = JSON.parse(value);
    return res as DeepUndefinable<T>;
  } catch (error: unknown) {
    return null;
  }
}
