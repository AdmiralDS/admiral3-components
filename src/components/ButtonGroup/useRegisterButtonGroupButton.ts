import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import type { ButtonGroupContextValue } from './ButtonGroupContext';

export const useRegisterButtonGroupButton = (
  buttonGroup: ButtonGroupContextValue | null,
  disabled: boolean,
  skeleton: boolean,
) => {
  const id = useRef(Symbol('button-group-button')).current;
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const stateRef = useRef({ disabled, skeleton });
  const [unmanaged, setUnmanaged] = useState(false);
  const registerButton = buttonGroup?.registerButton;
  const updateButton = buttonGroup?.updateButton;
  stateRef.current = { disabled, skeleton };

  useEffect(() => {
    if (!registerButton) return;

    const unregister = registerButton({ id, ref: buttonRef, ...stateRef.current });
    setUnmanaged(!unregister);

    return unregister;
  }, [registerButton, id]);

  useLayoutEffect(() => {
    updateButton?.(id, { disabled, skeleton });
  }, [disabled, id, skeleton, updateButton]);

  const tabIndex = !buttonGroup || unmanaged ? undefined : buttonGroup.focusableButtonId === id ? 0 : -1;

  return { buttonRef, tabIndex };
};
