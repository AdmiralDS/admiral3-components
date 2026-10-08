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

  it('runs callback cleanup without calling the callback with null', () => {
    const callbackCleanup = vi.fn();
    const callbackRef = vi.fn(() => callbackCleanup);
    const element = document.createElement('div');

    const cleanup = refSetter<HTMLDivElement>(callbackRef)(element);

    expect(callbackCleanup).not.toHaveBeenCalled();

    if (typeof cleanup === 'function') cleanup();

    expect(callbackCleanup).toHaveBeenCalledTimes(1);
    expect(callbackRef).toHaveBeenCalledTimes(1);
    expect(callbackRef).toHaveBeenCalledWith(element);
  });

  it('cleans up mixed refs using each ref cleanup contract', () => {
    const objectRef = createRef<HTMLDivElement>();
    const callbackCleanup = vi.fn();
    const callbackWithCleanup = vi.fn(() => callbackCleanup);
    const callbackWithoutCleanup = vi.fn();
    const element = document.createElement('div');

    const cleanup = refSetter(objectRef, callbackWithCleanup, undefined, callbackWithoutCleanup)(element);

    expect(objectRef.current).toBe(element);
    expect(callbackWithoutCleanup).toHaveBeenCalledWith(element);

    if (typeof cleanup === 'function') cleanup();

    expect(objectRef.current).toBeNull();
    expect(callbackCleanup).toHaveBeenCalledTimes(1);
    expect(callbackWithCleanup).toHaveBeenCalledTimes(1);
    expect(callbackWithCleanup).toHaveBeenCalledWith(element);
    expect(callbackWithoutCleanup).toHaveBeenCalledTimes(2);
    expect(callbackWithoutCleanup).toHaveBeenLastCalledWith(null);
  });
});
