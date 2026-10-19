import { textStyles, zIndex } from '@admiral-ds/admiral3-tokens';
import styled from 'styled-components';

import {
  HINT_CONTENT_PADDING,
  HINT_CLOSE_BUTTON_POSITION,
  HINT_CONTENT_PADDING_WITH_CLOSE,
  HINT_MAX_HEIGHT,
  HINT_OFFSET,
  HINT_PADDING,
} from './constants';
import type { StyledHintContentProps, StyledHintProps, StyledHintWrapperProps, StyledPortalProps } from './types';
import { cssToken } from '../../theme/cssToken';
import { FloatingPortal } from '../_internal/FloatingPortal';
import { CloseIconPlacementButton } from '../_internal/IconPlacement';

const backgroundColor = cssToken(
  '--admiral-color-neutral-base-elevated-rest',
  (theme) => theme.color.neutral.base.elevated.rest,
);
const textColor = cssToken('--admiral-color-neutral-text-1-rest', (theme) => theme.color.neutral.text._1.rest);
const borderRadius = cssToken('--admiral-radius-medium', (theme) => theme.radius.medium);
const boxShadow = cssToken('--admiral-shadow-shadow08', (theme) => theme.shadow.shadow08);

export const HintWrapper = styled.div<StyledHintWrapperProps>`
  box-sizing: border-box;
  position: relative;
  pointer-events: initial;
  opacity: 0;
  transition-delay: 200ms;
  transition-property: opacity;
  width: max-content;
  min-width: max-content;
  align-self: ${({ $alignSelf }) => $alignSelf};
  margin: ${({ $margin }) => $margin};

  /* Мостик сохраняет hover при переходе указателя через отступ между target и Hint. */
  &::before {
    content: '';
    position: absolute;
    ${({ $anchorSide }) =>
      $anchorSide === 'top' || $anchorSide === 'bottom' ? 'left: 0; width: 100%;' : 'top: 0; height: 100%;'}
    ${({ $anchorSide }) => `${$anchorSide}: -${HINT_OFFSET}px;`}
    ${({ $anchorSide }) =>
      $anchorSide === 'top' || $anchorSide === 'bottom' ? `height: ${HINT_OFFSET}px;` : `width: ${HINT_OFFSET}px;`}
  }
`;

export const HintContainer = styled.div<StyledHintProps>`
  box-sizing: border-box;
  position: relative;
  display: inline-flex;
  max-width: calc(100vw - 32px);
  max-height: ${HINT_MAX_HEIGHT}px;
  padding: ${HINT_PADDING};
  border-radius: ${borderRadius};
  background-color: ${backgroundColor};
  box-shadow: ${boxShadow};
  color: ${textColor};
  ${textStyles.body.body2Long}
  overflow-wrap: anywhere;
  ${({ $cssMixin }) => $cssMixin}
`;

export const HintContent = styled.div<StyledHintContentProps>`
  box-sizing: border-box;
  flex: 1 1 auto;
  min-width: 0;
  min-height: 0;
  /* Внутренние 4px защищают focus-ring контента от обрезания scroll-областью;
     scrollbar при этом начинается на 4px выше визуального содержимого. */
  padding: ${({ $showCloseIcon }) => ($showCloseIcon ? HINT_CONTENT_PADDING_WITH_CLOSE : HINT_CONTENT_PADDING)};
  // TODO: возможно, нативный браузерный скроллбар следует заменить на библиотечный Scrollbar.
  overflow: auto;
`;

export const HintCloseButton = styled(CloseIconPlacementButton)`
  position: absolute;
  top: ${HINT_CLOSE_BUTTON_POSITION.top}px;
  right: ${HINT_CLOSE_BUTTON_POSITION.right}px;
`;

export const FakeTarget = styled.div`
  pointer-events: none;
  height: 100%;
  width: 100%;
  flex: 0 0 auto;
`;

export const StyledPortal = styled(FloatingPortal)<StyledPortalProps>`
  display: flex;
  ${({ $flexDirection }) => ($flexDirection ? `flex-direction: ${$flexDirection};` : '')}
  z-index: var(--admiral-z-index-hint, ${zIndex.tooltip});
`;
