import type { ComponentRef, ComponentType } from 'react';
import { forwardRef, useCallback } from 'react';

import { Hint } from './Hint';
import type { WithHintProps } from './types';
import { HINT_DELAY, useHint } from './useHint';
import { hasSlotContent } from '../../utils/hasSlotContent';
import { refSetter } from '../../utils/refSetter';

/**
 * Добавляет компоненту стандартное поведение Hint.
 *
 * Оборачиваемый компонент должен принимать ref и передавать его корневому HTML-элементу.
 */
export function withHint<T extends object>(Component: ComponentType<T>) {
  type TargetElement = Extract<ComponentRef<typeof Component>, HTMLElement>;

  const ComponentWithHint = forwardRef<TargetElement, T & WithHintProps>(
    (
      {
        renderContent,
        triggerMode = 'hover',
        withDelay = false,
        hintRef,
        hintTargetElement,
        hintPosition,
        hintStyles,
        closeButtonProps,
        ...componentProps
      },
      ref,
    ) => {
      const { isVisible, triggerProps, hintProps } = useHint<TargetElement>({
        triggerMode,
        delay: withDelay ? HINT_DELAY : 0,
        targetElement: hintTargetElement,
      });
      const targetHookRef = triggerProps.ref;
      const hintHookRef = hintProps.ref;

      const mergedTargetRef = useCallback(
        (element: TargetElement | null) => refSetter(ref, targetHookRef)(element),
        [ref, targetHookRef],
      );
      const mergedHintRef = useCallback(
        (element: HTMLDivElement | null) => refSetter(hintRef, hintHookRef)(element),
        [hintHookRef, hintRef],
      );
      const content = renderContent();
      const hasContent = hasSlotContent(content);
      const sourceProps = componentProps as Record<string, unknown>;
      const mergeIds = (current: unknown, added: unknown) =>
        [current, added].filter((value): value is string => typeof value === 'string' && value.length > 0).join(' ') ||
        undefined;
      const triggerId = (sourceProps.id as string | undefined) ?? (hasContent ? triggerProps.id : undefined);
      const wrappedComponentProps = {
        ...componentProps,
        ref: mergedTargetRef,
        id: triggerId,
        'aria-describedby': mergeIds(sourceProps['aria-describedby'], hasContent && triggerProps['aria-describedby']),
        'aria-controls': mergeIds(sourceProps['aria-controls'], hasContent && triggerProps['aria-controls']),
        'aria-expanded': hasContent
          ? (triggerProps['aria-expanded'] ?? sourceProps['aria-expanded'])
          : sourceProps['aria-expanded'],
        'aria-haspopup': hasContent
          ? (triggerProps['aria-haspopup'] ?? sourceProps['aria-haspopup'])
          : sourceProps['aria-haspopup'],
      } as T;

      return (
        <>
          <Component {...wrappedComponentProps} />
          {isVisible && hasContent && (
            <Hint
              {...hintProps}
              ref={mergedHintRef}
              aria-labelledby={hintProps['aria-labelledby'] ? triggerId : undefined}
              hintPosition={hintPosition}
              hintStyles={hintStyles}
              closeButtonProps={closeButtonProps}
            >
              {content}
            </Hint>
          )}
        </>
      );
    },
  );

  return ComponentWithHint;
}
