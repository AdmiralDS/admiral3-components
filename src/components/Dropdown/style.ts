import { zIndex } from '@admiral-ds/admiral3-tokens';
import styled from 'styled-components';

import { DROPDOWN_OFFSET } from './constants';
import type { DropdownLayout } from './types';
import { cssToken } from '../../theme/cssToken';
import { FloatingPortal } from '../_internal/FloatingPortal';

const backgroundColor = cssToken(
  '--admiral-color-neutral-base-elevated-rest',
  (theme) => theme.color.neutral.base.elevated.rest,
);
const borderRadius = cssToken('--admiral-radius-medium', (theme) => theme.radius.medium);
const boxShadow = cssToken('--admiral-shadow-shadow08', (theme) => theme.shadow.shadow08);

export const StyledPortal = styled(FloatingPortal)<{ $position: DropdownLayout['position'] }>`
  display: flex;
  flex-direction: ${({ $position }) => ($position === 'top' ? 'column-reverse' : 'column')};
  flex-wrap: nowrap;
  z-index: var(--admiral-z-index-dropdown, ${zIndex.dropdown});
`;

export const FakeTarget = styled.div`
  pointer-events: none;
  width: 100%;
  height: 100%;
  flex: 0 0 auto;
`;

export const DropdownContainer = styled.div<{ $layout: DropdownLayout }>`
  box-sizing: border-box;
  position: relative;
  pointer-events: initial;
  flex: 0 0 auto;
  align-self: ${({ $layout }) => $layout.alignSelf};
  width: max-content;
  margin: ${({ $layout }) => ($layout.position === 'top' ? `0 0 ${DROPDOWN_OFFSET}px` : `${DROPDOWN_OFFSET}px 0 0`)};
  transform: translate(${({ $layout }) => `${$layout.translateX}px, ${$layout.translateY}px`});
  opacity: 0;
  background-color: ${backgroundColor};
  border-radius: ${borderRadius};
  box-shadow: ${boxShadow};
`;
