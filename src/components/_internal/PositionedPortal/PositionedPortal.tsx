import type { ComponentPropsWithoutRef } from 'react';
import { forwardRef, useEffect, useMemo, useRef } from 'react';

import { zIndex } from '@admiral-ds/admiral3-tokens';
import { createPortal } from 'react-dom';
import styled from 'styled-components';

import { observeRect } from '../../../utils/observeRect';
import { refSetter } from '../../../utils/refSetter';

const PositionedPortalContainer = styled.div`
  pointer-events: none;
  position: fixed;
  overflow: visible;
  // TODO добавить z-index в состав темы
  z-index: var(--admiral-z-index-fixed, ${zIndex.fixed});
`;

export interface PositionedPortalProps extends ComponentPropsWithoutRef<'div'> {
  /** Элемент, относительно которого позиционируется портал */
  targetElement: Element | null;

  /** Контейнер, внутри которого будет отрисован портал. По умолчанию используется body документа targetElement */
  container?: HTMLElement | null;

  /** Отрисовка портала на всю ширину контейнера */
  fullContainerWidth?: boolean;
}

/**
 * При фиксированном позиционировании (как у PositionedPortalContainer) элемент позиционируется
 * всегда относительно исходного содержащего блока (окна браузера).
 * Исключение, когда один из его предков имеет свойство transform, perspective, или filter,
 * установленное на что-то иное, кроме none, в этом случае этот предок ведет
 * себя как содержащий блок. Тогда top, right, bottom и left элемента рассчитываются относительно этого содержащего блока.
 * Если у такого предка кроме transform задано свойство overflow: hidden, то элемент будет обрезаться по его краям.
 *
 * В связи с вышеописанным в качестве контейнера для портала рекомендуется выбирать элемент, у предков которого нет свойств
 * transform, perspective, или filter отличных от none. Также рекомендуется размещать контейнер портала в самом низу dom-дерева,
 * чтобы избежать возможных конфликтов стилей.
 */
export const PositionedPortal = forwardRef<HTMLDivElement, PositionedPortalProps>(
  ({ targetElement, container, fullContainerWidth, ...props }, ref) => {
    const portalContainerRef = useRef<HTMLDivElement>(null);
    const mergedRef = useMemo(() => refSetter(portalContainerRef, ref), [ref]);

    useEffect(() => {
      const node = portalContainerRef.current;
      const targetNode = targetElement;
      if (node && targetNode) {
        const observer = observeRect(targetNode, (rect) => {
          const { x, y, height, width } = rect;
          const { style } = node;
          style.top = `${y}px`;
          style.left = fullContainerWidth ? '0px' : `${x}px`;
          style.height = `${height}px`;
          style.width = fullContainerWidth ? '100%' : `${width}px`;
        });
        observer.observe();
        return () => {
          observer.unobserve();
        };
      }
    }, [targetElement, fullContainerWidth]);

    const portalRoot =
      container ?? targetElement?.ownerDocument.body ?? (typeof document === 'undefined' ? null : document.body);

    if (!portalRoot) return null;

    return createPortal(<PositionedPortalContainer {...props} ref={mergedRef} />, portalRoot);
  },
);

PositionedPortal.displayName = 'PositionedPortal';
