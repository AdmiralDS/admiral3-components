import type { ForwardedRef } from 'react';

type PossibleRef<T> = ForwardedRef<T> | undefined;

export function refSetter<T>(...refs: PossibleRef<T>[]): (instance: T | null) => void {
  return (instance) => {
    refs.forEach((ref) => {
      if (!ref) return;

      if (typeof ref === 'function') {
        ref(instance);
      } else {
        ref.current = instance;
      }
    });
  };
}
