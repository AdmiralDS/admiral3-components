import type { ForwardedRef, RefCallback } from 'react';

type PossibleRef<T> = ForwardedRef<T> | undefined;

export function refSetter<T>(...refs: PossibleRef<T>[]): RefCallback<T> {
  return (instance) => {
    const cleanups = refs.map((ref) => {
      if (!ref) return;

      if (typeof ref === 'function') {
        const cleanup = ref(instance);

        return typeof cleanup === 'function' ? cleanup : () => ref(null);
      }

      ref.current = instance;

      return () => {
        ref.current = null;
      };
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup?.());
    };
  };
}
