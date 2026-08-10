import { animation } from '@admiral-ds/admiral3-tokens';
import styled from 'styled-components';

import { RADIO_BUTTON_DIMENSION_PARAMETERS } from './constants';
import type { StyledRadioButtonProps } from './types';
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

// TODO При разработке RadioGroup рассмотреть возможность отказа от fieldset[data-dimension], fieldset:disabled стилизации

export const StyledRadioButton = styled.label<StyledRadioButtonProps>`
  display: flex;
  align-items: flex-start;
  position: relative;
  box-sizing: border-box;
  width: fit-content;
  color: ${({ $disabled }) => ($disabled ? textDisabled : textColor)};
  cursor: ${({ $disabled, $readOnly }) => ($disabled ? 'not-allowed' : $readOnly ? 'default' : 'pointer')};
  gap: ${RADIO_BUTTON_DIMENSION_PARAMETERS.m.gap}px;
  ${RADIO_BUTTON_DIMENSION_PARAMETERS.m.typography}

  &[data-dimension='s'],
  fieldset[data-dimension='s'] & {
    gap: ${RADIO_BUTTON_DIMENSION_PARAMETERS.s.gap}px;
    ${RADIO_BUTTON_DIMENSION_PARAMETERS.s.typography}
  }

  &[data-dimension='xs'],
  fieldset[data-dimension='xs'] & {
    gap: ${RADIO_BUTTON_DIMENSION_PARAMETERS.xs.gap}px;
    ${RADIO_BUTTON_DIMENSION_PARAMETERS.xs.typography}
  }

  fieldset:disabled & {
    color: ${textDisabled};
    cursor: not-allowed;
  }
`;

export const Control = styled.span<{ $error: boolean }>`
  box-sizing: border-box;
  flex: 0 0 auto;
  border-radius: 50%;
  transition:
    background-color ${animation.motion.duration.short_2}ms cubic-bezier(${animation.motion.easing.linear.join(', ')}),
    box-shadow ${animation.motion.duration.short_2}ms cubic-bezier(${animation.motion.easing.linear.join(', ')});
  pointer-events: none;
  width: ${RADIO_BUTTON_DIMENSION_PARAMETERS.m.controlSize}px;
  height: ${RADIO_BUTTON_DIMENSION_PARAMETERS.m.controlSize}px;
  margin-block: ${RADIO_BUTTON_DIMENSION_PARAMETERS.m.controlMarginBlock}px;
  --admiral-radio-button-checked-border-width: ${RADIO_BUTTON_DIMENSION_PARAMETERS.m.checkedBorderWidth}px;

  ${StyledRadioButton}[data-dimension='s'] &,
  fieldset[data-dimension='s'] & {
    width: ${RADIO_BUTTON_DIMENSION_PARAMETERS.s.controlSize}px;
    height: ${RADIO_BUTTON_DIMENSION_PARAMETERS.s.controlSize}px;
    margin-block: ${RADIO_BUTTON_DIMENSION_PARAMETERS.s.controlMarginBlock}px;
    --admiral-radio-button-checked-border-width: ${RADIO_BUTTON_DIMENSION_PARAMETERS.s.checkedBorderWidth}px;
  }

  ${StyledRadioButton}[data-dimension='xs'] &,
  fieldset[data-dimension='xs'] & {
    width: ${RADIO_BUTTON_DIMENSION_PARAMETERS.xs.controlSize}px;
    height: ${RADIO_BUTTON_DIMENSION_PARAMETERS.xs.controlSize}px;
    margin-block: ${RADIO_BUTTON_DIMENSION_PARAMETERS.xs.controlMarginBlock}px;
    --admiral-radio-button-checked-border-width: ${RADIO_BUTTON_DIMENSION_PARAMETERS.xs.checkedBorderWidth}px;
  }

  ${NativeInput} + & {
    background-color: ${backgroundRest};
    box-shadow: inset 0 0 0 1px ${({ $error }) => ($error ? errorColor : borderRest)};
  }

  ${NativeInput}:hover + & {
    background-color: ${backgroundHover};
  }

  ${NativeInput}:active + & {
    background-color: ${backgroundPress};
  }

  ${NativeInput}:checked + & {
    background-color: ${backgroundRest};
    box-shadow: inset 0 0 0 var(--admiral-radio-button-checked-border-width) ${selectedRest};
  }

  ${NativeInput}:checked:hover + & {
    background-color: ${backgroundRest};
    box-shadow: inset 0 0 0 var(--admiral-radio-button-checked-border-width) ${selectedHover};
  }

  ${NativeInput}:checked:active + & {
    background-color: ${backgroundRest};
    box-shadow: inset 0 0 0 var(--admiral-radio-button-checked-border-width) ${selectedPress};
  }

  ${NativeInput}:disabled + &,
  ${NativeInput}[readonly] + & {
    background-color: ${backgroundDisabled};
    box-shadow: inset 0 0 0 1px ${borderDisabled};
  }

  ${NativeInput}:disabled:checked + &, ${NativeInput}[readonly]:checked + & {
    background-color: ${backgroundRest};
    box-shadow: inset 0 0 0 var(--admiral-radio-button-checked-border-width) ${selectedDisabled};
  }

  ${NativeInput}:focus-visible + & {
    outline: 2px solid ${focusColor};
    outline-offset: 2px;
  }
`;
