import { afterEach, describe, expect, it, vi } from 'vitest';

import { clearNativeTextInput } from './clearNativeTextInput';

describe('clearNativeTextInput', () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it.each(['input', 'textarea'] as const)(
    'clears and focuses a native %s and dispatches a bubbling input event',
    (tagName) => {
      const control = document.createElement(tagName);
      const parent = document.createElement('div');
      const onInput = vi.fn();

      control.value = 'Value';
      parent.appendChild(control);
      parent.addEventListener('input', onInput);
      document.body.appendChild(parent);

      clearNativeTextInput(control);

      expect(control.value).toBe('');
      expect(onInput).toHaveBeenCalledOnce();
      expect(control).toHaveFocus();
    },
  );
});
