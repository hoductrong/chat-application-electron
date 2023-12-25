import { useEffect, useState, useRef, useCallback } from 'react';

export default function useLoading<F extends (...args: any) => Promise<any>>(
  func: F,
  deps?: readonly any[],
): [F, boolean, Error | undefined] {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<undefined | Error>(undefined);
  const isMountedRef = useRef(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  const depsList = deps || [func];
  const wrappedFunc = useCallback(async (...args: any) => {
    setLoading(true);
    let ret;
    try {
      ret = await func(...args);
    } catch (e: any) {
      setError(e);
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
    return ret;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, depsList);
  return [wrappedFunc as any, loading, error];
}
