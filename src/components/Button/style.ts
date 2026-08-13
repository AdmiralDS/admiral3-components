import styled from 'styled-components';

import { buttonAppearanceMixin } from './appearanceMixin/index';
import { BUTTON_GAP } from './constants';
import { buttonDimensionMixin } from './dimensionMixin';
import type { ButtonDimension, StyledButtonProps } from './types';
import { hoverPressLeaveTransition } from '../../theme/animation';
import { cssToken } from '../../theme/cssToken';
import { skeletonAnimationMixin } from '../Skeleton';

export const SpinnerContainer = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

export const ButtonContent = styled.div<{ $dimension: ButtonDimension }>`
  vertical-align: top;
  display: inline-flex;
  gap: ${({ $dimension }) => BUTTON_GAP[$dimension]}px;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
  max-width: 100%;

  > * {
    display: inline-block;
    flex: 0 1 auto;
    white-space: nowrap;
  }
  > ${SpinnerContainer}, svg {
    flex: 0 0 auto;
  }
`;

// TODO Кажется styled.attrs применяет Partial<StyledButtonProps> под капотом,
// так как ts не подсвечивает ошибку, если не передан обязательный параметр.
// Подумать, в чем дело, может data-атрибуты вынести на уровень компонента?
export const StyledButton = styled.button.attrs<
  StyledButtonProps & {
    'data-appearance': string;
    'data-dimension': string;
  }
>((props) => ({
  'data-appearance': [props.$colorConfig ? 'custom' : props.$appearance, props.$inactive ? 'disabled' : undefined]
    .filter((val) => val !== undefined)
    .join(' '),
  'data-color-mode': String(props.$colorMode),
  'data-dimension': String(props.$dimension),
}))<StyledButtonProps>`
  position: relative;
  box-sizing: border-box;
  display: inline-block;
  white-space: nowrap;
  vertical-align: middle;
  appearance: none;
  border: none;
  overflow: hidden;
  transition: background-color ${hoverPressLeaveTransition};
  border-radius: ${(p) =>
    p.$skeleton ? 0 : cssToken('--admiral-radius-by-base-4-medium', (theme) => theme.radius.byBase['4'].medium)};

  cursor: pointer;
  ${(p) => p.disabled && 'cursor: not-allowed;'}
  ${(p) => p.$loading && 'cursor: progress;'}
  ${(p) => p.$skeleton && 'cursor: default;'}

  ${({ $skeleton }) => ($skeleton ? skeletonAnimationMixin : '')};

  ${ButtonContent} {
    ${(p) => ((p.$loading && !p.$loadingPosition) || p.$skeleton ? 'visibility: hidden;' : '')}
  }

  ${buttonAppearanceMixin}
  ${buttonDimensionMixin}

  &:focus-visible {
    outline-offset: 2px;
    outline: 2px solid
      ${cssToken('--admiral-color-primary-stroke-1-rest', (theme) => theme.color.primary.stroke._1.rest)};
  }
`;
