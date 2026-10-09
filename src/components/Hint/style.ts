import { zIndex } from '@admiral-ds/admiral3-tokens';
import styled from 'styled-components';

import { HINT_DIMENSION_PARAMETERS } from './constants';
import type { StyledHintProps, StyledHintWrapperProps, StyledPortalProps } from './types';
import { FloatingPortal } from '../_internal/FloatingPortal';
import { TOOLTIP_OFFSET } from '../Tooltip/constants';

export const StyledHint = styled.div.attrs<StyledHintProps & { 'data-dimension': string }>((props) => ({
  'data-dimension': props.$dimension,
}))<StyledHintProps>`
  box-sizing: border-box;
  display: inline-flex;
  min-height: ${({ $dimension }) => HINT_DIMENSION_PARAMETERS[$dimension].minHeight}px;
  align-items: center;
`;

export const HintWrapper = styled.div<StyledHintWrapperProps>`
  box-sizing: border-box;
  position: relative;
  width: max-content;
  min-width: max-content;
  opacity: 0;
  pointer-events: initial;
  transition-delay: 200ms;
  transition-property: opacity;
  align-self: ${({ $alignSelf }) => $alignSelf};
  margin: ${({ $margin }) => $margin};

  /* Мостик сохраняет hover при переходе указателя через отступ между target и Hint. */
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

export const FakeTarget = styled.div`
  pointer-events: none;
  height: 100%;
  width: 100%;
  flex: 0 0 auto;
`;

export const StyledPortal = styled(FloatingPortal)<StyledPortalProps>`
  display: flex;
  flex-wrap: nowrap;
  ${({ $flexDirection }) => ($flexDirection ? `flex-direction: ${$flexDirection};` : '')}
  z-index: var(--admiral-z-index-hint, ${zIndex.tooltip});
`;
