import { forwardRef, useCallback, useMemo, useState } from 'react';

import { HINT_POSITION_CONFIG } from './constants';
import { HintCloseButton } from './HintCloseButton';
import { FakeTarget, HintContent, HintWrapper, HintContainer, StyledPortal } from './style';
import type { HintProps } from './types';
import { getMobileHintDirection, stretchToViewportWidth } from './utils';
import { hasSlotContent } from '../../utils/hasSlotContent';
import { refSetter } from '../../utils/refSetter';
import type { FloatingUpdateContext } from '../_internal/FloatingPortal';
import { getFloatingDirection, useFloating } from '../_internal/FloatingPortal';
import { TOOLTIP_LAYOUTS } from '../Tooltip/constants';

/** Подсказка, которая позиционируется относительно targetElement. Управление видимостью вынесено в useHint. */
export const Hint = forwardRef<HTMLDivElement, HintProps>(
  (
    { children, targetElement, hintPosition, hintStyles, showCloseIcon = false, onClose, closeButtonProps, ...props },
    ref,
  ) => {
    const [floatingPortal, setFloatingPortal] = useState<HTMLDivElement | null>(null);
    const [hintElement, setHintElement] = useState<HTMLDivElement | null>(null);
    const [direction, setDirection] = useState<keyof typeof TOOLTIP_LAYOUTS>('bottom');
    const emptyContent = !hasSlotContent(children);
    const mergedRef = useMemo(() => refSetter(ref, setHintElement), [ref]);

    const updateHint = useCallback(
      ({ floatingElement, floatingPortal, targetRect }: FloatingUpdateContext) => {
        if (!targetElement) return;
        const mobileDirection = getMobileHintDirection(targetElement, targetRect, floatingElement);
        const nextDirection =
          mobileDirection ??
          getFloatingDirection(targetElement, targetRect, floatingElement, hintPosition, HINT_POSITION_CONFIG);
        const nextLayout = TOOLTIP_LAYOUTS[nextDirection];

        if (nextLayout.fullWidth) stretchToViewportWidth(floatingPortal);
        floatingElement.style.opacity = '1';
        setDirection(nextDirection);
      },
      [hintPosition, targetElement],
    );

    const layout = TOOLTIP_LAYOUTS[direction];
    useFloating({
      targetElement: emptyContent ? null : targetElement,
      floatingPortal,
      floatingElement: hintElement,
      onUpdate: updateHint,
    });

    return emptyContent || !targetElement ? null : (
      <StyledPortal targetElement={targetElement} ref={setFloatingPortal} $flexDirection={layout.flexDirection}>
        <FakeTarget />
        <HintWrapper
          ref={mergedRef}
          $margin={layout.margin}
          $anchorSide={layout.anchorSide}
          $alignSelf={layout.alignSelf}
        >
          <HintContainer
            role="tooltip"
            $cssMixin={hintStyles?.cssMixin}
            className={hintStyles?.className}
            style={hintStyles?.style}
            {...props}
          >
            <HintContent $showCloseIcon={showCloseIcon}>{children}</HintContent>
            {showCloseIcon && (
              <HintCloseButton
                {...closeButtonProps}
                onClick={(event) => {
                  event.stopPropagation();
                  onClose?.();
                }}
              />
            )}
          </HintContainer>
        </HintWrapper>
      </StyledPortal>
    );
  },
);

Hint.displayName = 'Hint';
