import { animation } from '@admiral-ds/admiral3-tokens';
import styled from 'styled-components';

import { CHECK_BOX_DIMENSION_PARAMETERS } from './constants';
import type { StyledCheckBoxProps } from './types';
import { cssToken } from '../../theme/cssToken';
import { NativeInput } from '../_internal/InputAtoms';

const backgroundRest = cssToken('--admiral-color-neutral-base-1-rest', (theme) => theme.color.neutral.base._1.rest);
const backgroundHover = cssToken('--admiral-color-neutral-base-1-hover', (theme) => theme.color.neutral.base._1.hover);
const backgroundPress = cssToken('--admiral-color-neutral-base-1-press', (theme) => theme.color.neutral.base._1.press);
const backgroundDisabled = cssToken(
  '--admiral-color-neutral-base-opacity-rest',
  (theme) => theme.color.neutral.base.opacity.rest,
);
const borderRest = cssToken('--admiral-color-neutral-stroke-2-rest', (theme) => theme.color.neutral.stroke._2.rest);
const borderDisabled = cssToken('--admiral-color-neutral-stroke-1-rest', (theme) => theme.color.neutral.stroke._1.rest);
const selectedRest = cssToken('--admiral-color-primary-base-1-rest', (theme) => theme.color.primary.base._1.rest);
const selectedHover = cssToken('--admiral-color-primary-base-1-hover', (theme) => theme.color.primary.base._1.hover);
const selectedPress = cssToken('--admiral-color-primary-base-1-press', (theme) => theme.color.primary.base._1.press);
const selectedDisabled = cssToken(
  '--admiral-color-primary-base-1-disable',
  (theme) => theme.color.primary.base._1.disable,
);
const errorColor = cssToken('--admiral-color-error-stroke-1-rest', (theme) => theme.color.error.stroke._1.rest);
const focusColor = cssToken('--admiral-color-primary-stroke-1-rest', (theme) => theme.color.primary.stroke._1.rest);
const textColor = cssToken('--admiral-color-neutral-text-1-rest', (theme) => theme.color.neutral.text._1.rest);
const textDisabled = cssToken(
  '--admiral-color-neutral-text-disable-rest',
  (theme) => theme.color.neutral.text.disable.rest,
);
const iconColor = cssToken(
  '--admiral-color-neutral-text-static-white-1',
  (theme) => theme.color.neutral.text.staticWhite._1,
);
const borderRadius = cssToken('--admiral-radius-by-base-4-small', (theme) => theme.radius.byBase['4'].small);
const transitionDuration = `var(--admiral-animation-motion-duration-short-2, ${animation.motion.duration.short_2}ms)`;
const transitionEasing = `var(--admiral-animation-motion-easing-linear, cubic-bezier(${animation.motion.easing.linear.join(
  ', ',
)}))`;

// TODO При разработке CheckBoxGroup рассмотреть возможность отказа от fieldset[data-dimension], fieldset:disabled стилизации

export const StyledCheckBox = styled.label.attrs<
  StyledCheckBoxProps & {
    'data-dimension': string;
  }
>((props) => ({
  'data-dimension': props.$dimension,
}))<StyledCheckBoxProps>`
  display: flex;
  align-items: flex-start;
  position: relative;
  box-sizing: border-box;
  width: fit-content;
  color: ${({ $disabled }) => ($disabled ? textDisabled : textColor)};
  cursor: ${({ $disabled, $readOnly }) => ($disabled ? 'not-allowed' : $readOnly ? 'default' : 'pointer')};
  gap: ${CHECK_BOX_DIMENSION_PARAMETERS.m.gap}px;
  ${CHECK_BOX_DIMENSION_PARAMETERS.m.typography}

  &[data-dimension='s'],
  fieldset[data-dimension='s'] & {
    gap: ${CHECK_BOX_DIMENSION_PARAMETERS.s.gap}px;
    ${CHECK_BOX_DIMENSION_PARAMETERS.s.typography}
  }

  &[data-dimension='xs'],
  fieldset[data-dimension='xs'] & {
    gap: ${CHECK_BOX_DIMENSION_PARAMETERS.xs.gap}px;
    ${CHECK_BOX_DIMENSION_PARAMETERS.xs.typography}
  }

  fieldset:disabled & {
    color: ${textDisabled};
    cursor: not-allowed;
  }
`;

export const Control = styled.span<{ $error: boolean }>`
  position: relative;
  box-sizing: border-box;
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${({ $error }) => ($error ? errorColor : borderRest)};
  border-radius: ${borderRadius};
  background: ${backgroundRest};
  color: ${iconColor};
  transition:
    background-color ${transitionDuration} ${transitionEasing},
    border-color ${transitionDuration} ${transitionEasing};
  pointer-events: none;
  width: ${CHECK_BOX_DIMENSION_PARAMETERS.m.controlSize}px;
  height: ${CHECK_BOX_DIMENSION_PARAMETERS.m.controlSize}px;
  margin-block: ${CHECK_BOX_DIMENSION_PARAMETERS.m.controlMarginBlock}px;

  ${StyledCheckBox}[data-dimension='s'] &,
  fieldset[data-dimension='s'] & {
    width: ${CHECK_BOX_DIMENSION_PARAMETERS.s.controlSize}px;
    height: ${CHECK_BOX_DIMENSION_PARAMETERS.s.controlSize}px;
    margin-block: ${CHECK_BOX_DIMENSION_PARAMETERS.s.controlMarginBlock}px;
  }

  ${StyledCheckBox}[data-dimension='xs'] &,
  fieldset[data-dimension='xs'] & {
    width: ${CHECK_BOX_DIMENSION_PARAMETERS.xs.controlSize}px;
    height: ${CHECK_BOX_DIMENSION_PARAMETERS.xs.controlSize}px;
    margin-block: ${CHECK_BOX_DIMENSION_PARAMETERS.xs.controlMarginBlock}px;
  }

  > svg {
    display: none;
    flex: 0 0 auto;
    overflow: visible;
  }

  ${NativeInput}:checked + &,
  ${NativeInput}:indeterminate + & {
    border-color: transparent;
    background: ${selectedRest};

    > svg {
      display: block;
    }
  }

  ${NativeInput}:not(:disabled):not([data-read-only]):hover + & {
    background: ${backgroundHover};
  }

  ${NativeInput}:not(:disabled):not([data-read-only]):is(:checked, :indeterminate):hover + & {
    background: ${selectedHover};
  }

  ${NativeInput}:not(:disabled):not([data-read-only]):active + & {
    background: ${backgroundPress};
  }

  ${NativeInput}:not(:disabled):not([data-read-only]):is(:checked, :indeterminate):active + & {
    background: ${selectedPress};
  }

  ${NativeInput}:is(:disabled, [data-read-only]) + & {
    border-color: ${borderDisabled};
    background: ${backgroundDisabled};
  }

  ${NativeInput}:is(:disabled, [data-read-only]):is(:checked, :indeterminate) + & {
    border-color: transparent;
    background: ${selectedDisabled};
  }

  ${NativeInput}:focus-visible + & {
    outline: 2px solid ${focusColor};
    outline-offset: 2px;
  }
`;
