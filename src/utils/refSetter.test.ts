import { createRef } from 'react';

import { describe, expect, it, vi } from 'vitest';

import { refSetter } from './refSetter';

describe('refSetter', () => {
  it('assigns the same instance to object and callback refs', () => {
    const objectRef = createRef<HTMLDivElement>();
    const callbackRef = vi.fn();
    const element = document.createElement('div');

    refSetter(objectRef, callbackRef)(element);

    expect(objectRef.current).toBe(element);
    expect(callbackRef).toHaveBeenCalledWith(element);
  });

  it('clears refs and ignores missing refs', () => {
    const objectRef = createRef<HTMLDivElement>();
    const callbackRef = vi.fn();
    const setRefs = refSetter(objectRef, undefined, callbackRef);

    setRefs(null);

    expect(objectRef.current).toBeNull();
    expect(callbackRef).toHaveBeenCalledWith(null);
  });
});
