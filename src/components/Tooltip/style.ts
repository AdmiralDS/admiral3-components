import { zIndex } from '@admiral-ds/admiral3-tokens';
import styled from 'styled-components';

import { TOOLTIP_DIMENSION_PARAMETERS, TOOLTIP_OFFSET } from './constants';
import type { StyledPortalProps, StyledTooltipProps, StyledTooltipWrapperProps } from './types';
import { cssToken } from '../../theme/cssToken';
import { FloatingPortal } from '../_internal/FloatingPortal';

const backgroundColor = cssToken(
  '--admiral-color-neutral-base-inverted-rest',
  (theme) => theme.color.neutral.base.inverted.rest,
);
const textColor = cssToken(
  '--admiral-color-neutral-text-inverted-rest',
  (theme) => theme.color.neutral.text.inverted.rest,
);
const borderRadius = cssToken('--admiral-radius-small', (theme) => theme.radius.small);
const boxShadow = cssToken('--admiral-shadow-shadow04', (theme) => theme.shadow.shadow04);

export const TooltipWrapper = styled.div<StyledTooltipWrapperProps>`
  box-sizing: border-box;
  position: relative;
  opacity: 0;
  transition-delay: 200ms;
  transition-property: opacity;
  width: max-content;
  min-width: max-content;
  pointer-events: initial;
  align-self: ${({ $alignSelf }) => $alignSelf};
  margin: ${({ $margin }) => $margin};

  /* Прозрачный мостик заполняет зазор между якорем и TooltipContainer,
     чтобы при переводе указателя через этот зазор Tooltip не закрывался. */
  &::before {
    content: '';
    position: absolute;
    ${({ $anchorSide }) =>
      $anchorSide === 'top' || $anchorSide === 'bottom' ? 'left: 0; width: 100%;' : 'top: 0; height: 100%;'}
    ${({ $anchorSide }) => `${$anchorSide}: -${TOOLTIP_OFFSET}px;`}
    ${({ $anchorSide }) =>
      $anchorSide === 'top' || $anchorSide === 'bottom'
        ? `height: ${TOOLTIP_OFFSET}px;`
        : `width: ${TOOLTIP_OFFSET}px;`}
  }
`;

export const TooltipContainer = styled.div.attrs<StyledTooltipProps & { 'data-dimension': string }>((props) => ({
  'data-dimension': props.$dimension,
}))<StyledTooltipProps>`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  min-height: ${({ $dimension }) => TOOLTIP_DIMENSION_PARAMETERS[$dimension].minHeight}px;
  max-width: min(488px, calc(100vw - 16px));
  padding: ${({ $dimension }) => TOOLTIP_DIMENSION_PARAMETERS[$dimension].padding};
  ${({ $dimension }) => TOOLTIP_DIMENSION_PARAMETERS[$dimension].typography}
  border-radius: ${borderRadius};
  background-color: ${backgroundColor};
  box-shadow: ${boxShadow};
  color: ${textColor};
  overflow-wrap: anywhere;
  ${({ $cssMixin }) => $cssMixin}
`;

export const FakeTarget = styled.div`
  /* Занимает rect настоящего target внутри portal-контейнера. Flex-направление
     размещает Tooltip до или после этой области, не перемещая сам target в DOM. */
  pointer-events: none;
  height: 100%;
  width: 100%;
  flex: 0 0 auto;
`;

export const StyledPortal = styled(FloatingPortal)<StyledPortalProps>`
  display: flex;
  flex-wrap: nowrap;
  ${({ $flexDirection }) => ($flexDirection ? `flex-direction: ${$flexDirection};` : '')}
  z-index: var(--admiral-z-index-tooltip, ${zIndex.tooltip});
`;
