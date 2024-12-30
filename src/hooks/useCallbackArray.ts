import { useMemo, useRef } from "react";
import { range } from 'lodash';

export function useCallbackArray<T extends (...args: any[]) => any>(
  count: number,
  callback: (index: number, ...args: Parameters<T>) => ReturnType<T>
): T[] {
  const callbackRef = useRef(callback);

  // Update the ref with the latest callback on every render
  callbackRef.current = callback;

  const memoCallbacks = useMemo(() => {
    return range(count).map((index) => {
      return ((...args: Parameters<T>) => {
        return callbackRef.current(index, ...args);
      }) as T;
    });
  }, [count]);

  return memoCallbacks;
}
