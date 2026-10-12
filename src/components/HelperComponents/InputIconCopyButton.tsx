import { forwardRef, useEffect, useMemo, useRef, useState, type RefObject } from 'react';

import { DocumentsCopyOutline } from '@admiral-ds/admiral3-icons';

import { refSetter } from '../../utils/refSetter';
import { InputIconButton, type InputIconButtonProps } from '../_internal/InputAtoms';
import { Tooltip, useTooltip } from '../Tooltip';

export interface InputIconCopyButtonProps extends InputIconButtonProps {
  /** Ref поля, текущее значение которого нужно скопировать. */
  inputRef: RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
}

/** Кнопка копирования значения Input или TextArea с подсказкой о результате. */
export const InputIconCopyButton = forwardRef<HTMLButtonElement, InputIconCopyButtonProps>(
  ({ inputRef, onClick, children, 'aria-describedby': ariaDescribedBy, ...props }, ref) => {
    const { targetProps, tooltipProps, isVisible } = useTooltip<HTMLButtonElement>();
    const buttonRef = useMemo(() => refSetter(targetProps.ref, ref), [targetProps.ref, ref]);
    const [message, setMessage] = useState('Копировать текст');
    const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const mounted = useRef(false);

    useEffect(() => {
      mounted.current = true;
      return () => {
        mounted.current = false;
        clearTimeout(timer.current);
      };
    }, []);

    const handleCopy: InputIconButtonProps['onClick'] = async (event) => {
      onClick?.(event);
      if (event.defaultPrevented) return;
      const input = inputRef.current;
      if (!input || input.disabled || !input.value) return;
      try {
        await navigator.clipboard.writeText(input.value);
        if (!mounted.current) return;
        setMessage('Скопировано');
      } catch {
        if (!mounted.current) return;
        setMessage('Не удалось скопировать текст');
      }
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setMessage('Копировать текст'), 2000);
    };

    return (
      <>
        <InputIconButton
          aria-label="Копировать текст"
          {...props}
          ref={buttonRef}
          aria-describedby={[ariaDescribedBy, targetProps['aria-describedby']].filter(Boolean).join(' ') || undefined}
          onClick={handleCopy}
        >
          {children ?? <DocumentsCopyOutline aria-hidden />}
        </InputIconButton>
        {isVisible && <Tooltip {...tooltipProps}>{message}</Tooltip>}
      </>
    );
  },
);

InputIconCopyButton.displayName = 'InputIconCopyButton';
