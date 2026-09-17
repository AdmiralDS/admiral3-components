import type { CSSProperties } from 'react';

import { zIndex } from '@admiral-ds/admiral3-tokens';
import styled from 'styled-components';

import { TOOLTIP_DIMENSION_PARAMETERS, TOOLTIP_WRAPPER_PADDING } from './constants';
import type { StyledTooltipProps } from './types';
import { cssToken } from '../../theme/cssToken';
import { PositionedPortal } from '../_internal/PositionedPortal';

const backgroundColor = cssToken(
  '--admiral-color-neutral-base-inverted-rest',
  (theme) => theme.color.neutral.base.inverted.rest,
);
const textColor = cssToken(
  '--admiral-color-neutral-text-inverted-rest',
  (theme) => theme.color.neutral.text.inverted.rest,
);
const borderRadius = cssToken('--admiral-radius-medium', (theme) => theme.radius.medium);
const boxShadow = cssToken('--admiral-shadow-shadow04', (theme) => theme.shadow.shadow04);

export const TooltipWrapper = styled.div`
  box-sizing: border-box;
  opacity: 0;
  transition-delay: 200ms;
  transition-property: opacity;
  align-self: center;
  width: max-content;
  min-width: max-content;
  pointer-events: initial;
  padding: ${TOOLTIP_WRAPPER_PADDING}px;
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
  overflow-wrap: break-word;
`;

export const FakeTarget = styled.div`
  pointer-events: none;
  height: 100%;
  width: 100%;
  flex: 0 0 auto;
`;

export const StyledPortal = styled(PositionedPortal)<{ $flexDirection?: CSSProperties['flexDirection'] }>`
  display: flex;
  flex-wrap: nowrap;
  ${({ $flexDirection }) => ($flexDirection ? `flex-direction: ${$flexDirection};` : '')}
  z-index: var(--admiral-z-index-tooltip, ${zIndex.tooltip});
`;
