import styled from 'styled-components';

import type { StyledButtonGroupProps } from './types';
import { cssToken } from '../../theme/cssToken';

const buttonGroupBorderRadius = cssToken('--admiral-radius-medium', (theme) => theme.radius.medium);

export const StyledButtonGroup = styled.div<StyledButtonGroupProps>`
  box-sizing: border-box;
  display: inline-flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: ${({ $appearance }) => ($appearance === 'outline' ? 0 : 1)}px;
  white-space: nowrap;

  &[data-appearance='outline'] > button:not(:first-child) {
    margin-left: -1px;
  }

  & > button {
    border-radius: 0;
  }

  & > button:first-child {
    border-radius: ${buttonGroupBorderRadius} 0 0 ${buttonGroupBorderRadius};
  }

  & > button:last-child {
    border-radius: 0 ${buttonGroupBorderRadius} ${buttonGroupBorderRadius} 0;
  }

  & > button:only-child {
    border-radius: ${buttonGroupBorderRadius};
  }

  & > button:focus-visible {
    z-index: 1;
  }
`;
