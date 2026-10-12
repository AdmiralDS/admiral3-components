import type { ComponentPropsWithoutRef } from 'react';
import { forwardRef } from 'react';

import { zIndex } from '@admiral-ds/admiral3-tokens';
import { createPortal } from 'react-dom';
import styled from 'styled-components';

const FloatingPortalContainer = styled.div`
  pointer-events: none;
  position: fixed;
  overflow: visible;
  // TODO добавить z-index в состав темы
  z-index: var(--admiral-z-index-fixed, ${zIndex.fixed});
`;

export interface FloatingPortalProps extends ComponentPropsWithoutRef<'div'> {
  /** Элемент, по документу которого определяется контейнер портала по умолчанию. */
  targetElement: Element | null;

  /** Контейнер, внутри которого будет отрисован портал. По умолчанию используется body документа targetElement */
  container?: HTMLElement | null;
}

/**
 * Создаёт fixed-контейнер портала в документе targetElement или в явно переданном container.
 * Компонент не вычисляет координаты. Для синхронизации контейнера с targetElement
 * можно использовать useFloating.
 *
 * При фиксированном позиционировании элемент позиционируется относительно исходного
 * содержащего блока (окна браузера).
 * Исключение, когда один из его предков имеет свойство transform, perspective, или filter,
 * установленное на что-то иное, кроме none, в этом случае этот предок ведет
 * себя как содержащий блок. Тогда top, right, bottom и left элемента рассчитываются относительно этого содержащего блока.
 * Если у такого предка кроме transform задано свойство overflow: hidden, то элемент будет обрезаться по его краям.
 *
 * В связи с вышеописанным в качестве контейнера для портала рекомендуется выбирать элемент, у предков которого нет свойств
 * transform, perspective, или filter отличных от none. Также рекомендуется размещать контейнер портала в самом низу dom-дерева,
 * чтобы избежать возможных конфликтов стилей.
 */
export const FloatingPortal = forwardRef<HTMLDivElement, FloatingPortalProps>(
  ({ targetElement, container, ...props }, ref) => {
    const portalRoot = container ?? targetElement?.ownerDocument.body;

    if (!portalRoot) return null;

    return createPortal(<FloatingPortalContainer {...props} ref={ref} />, portalRoot);
  },
);

FloatingPortal.displayName = 'FloatingPortal';
