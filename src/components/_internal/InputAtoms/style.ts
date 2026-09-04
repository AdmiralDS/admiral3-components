import styled, { css } from 'styled-components';

import { BASE_INPUT_DIMENSION_PARAMETERS } from './constants';
import type { BaseInputAppearance, InputIconProps, StyledBaseInputContainerProps } from './types';
import { hoverPressLeaveTransition } from '../../../theme/animation';
import { cssToken } from '../../../theme/cssToken';
import { Divider } from '../../Divider';

const textDisabled = cssToken(
  '--admiral-color-neutral-text-disable-rest',
  (theme) => theme.color.neutral.text.disable.rest,
);

const backgroundBase = cssToken('--admiral-color-neutral-base-1-rest', (theme) => theme.color.neutral.base._1.rest);
const backgroundOpacity = cssToken(
  '--admiral-color-neutral-base-opacity-rest',
  (theme) => theme.color.neutral.base.opacity.rest,
);
const borderRest = cssToken('--admiral-color-neutral-stroke-2-rest', (theme) => theme.color.neutral.stroke._2.rest);
const borderHover = cssToken('--admiral-color-neutral-stroke-2-hover', (theme) => theme.color.neutral.stroke._2.hover);
const borderFocus = cssToken('--admiral-color-neutral-stroke-2-focus', (theme) => theme.color.neutral.stroke._2.focus);
const iconFocus = cssToken('--admiral-color-primary-stroke-1-rest', (theme) => theme.color.primary.stroke._1.rest);
const borderErrorRest = cssToken('--admiral-color-error-stroke-1-rest', (theme) => theme.color.error.stroke._1.rest);
const borderErrorHover = cssToken('--admiral-color-error-stroke-1-hover', (theme) => theme.color.error.stroke._1.hover);
const borderSuccessRest = cssToken(
  '--admiral-color-success-stroke-1-rest',
  (theme) => theme.color.success.stroke._1.rest,
);
const borderSuccessHover = cssToken(
  '--admiral-color-success-stroke-1-hover',
  (theme) => theme.color.success.stroke._1.hover,
);
const textRest = cssToken('--admiral-color-neutral-text-1-rest', (theme) => theme.color.neutral.text._1.rest);
const placeholderRest = cssToken('--admiral-color-neutral-text-3-rest', (theme) => theme.color.neutral.text._3.rest);
const secondaryTextRest = cssToken('--admiral-color-neutral-text-2-rest', (theme) => theme.color.neutral.text._2.rest);
const secondaryTextHover = cssToken(
  '--admiral-color-neutral-text-2-hover',
  (theme) => theme.color.neutral.text._2.hover,
);
const secondaryTextPress = cssToken(
  '--admiral-color-neutral-text-2-press',
  (theme) => theme.color.neutral.text._2.press,
);
const baseInputBorderRadius = cssToken('--admiral-radius-medium', (theme) => theme.radius.medium);

const backgroundByAppearance: Record<BaseInputAppearance, ReturnType<typeof cssToken>> = {
  standard: backgroundBase,
  flat: backgroundOpacity,
  ghost: backgroundBase,
};

const baseInputDimensionStyles = Object.entries(BASE_INPUT_DIMENSION_PARAMETERS).map(
  ([dimension, parameters]) => css`
    &[data-dimension='${dimension}'] {
      --admiral-input-icon-size: ${parameters.iconSize}px;
      --admiral-input-divider-length: ${parameters.dividerLength}px;
      --admiral-input-layout-gap: ${parameters.gap}px;
      --admiral-input-padding-block: ${parameters.paddingBlock}px;
      --admiral-input-padding-inline: ${parameters.paddingInline}px;

      height: ${parameters.containerHeight}px;
      ${parameters.typography}
    }
  `,
);

export const StyledBaseInputContainer = styled.div<StyledBaseInputContainerProps>`
  --admiral-input-text-color: ${textRest};
  --admiral-input-placeholder-color: ${placeholderRest};
  --admiral-input-additional-color: ${secondaryTextRest};

  position: relative;
  box-sizing: border-box;
  display: inline-flex;
  width: 100%;
  min-width: 0;
  align-items: center;
  gap: var(--admiral-input-layout-gap);
  overflow: hidden;
  border-radius: ${baseInputBorderRadius};
  background: ${({ $appearance }) => backgroundByAppearance[$appearance]};
  color: var(--admiral-input-text-color);
  cursor: default;
  transition: background-color ${hoverPressLeaveTransition};

  ${baseInputDimensionStyles}

  // Паддинги прокидываются на дочерние компоненты для обеспечения корректной обработки крусора и клика
  > :first-child {
    padding-inline-start: var(--admiral-input-padding-inline);
  }
  // Берется предпоследний элемент, т.к.последним элементов является StyledBaseInputBorder с абсолютным позиционированием на весь компонент
  > :nth-last-child(2) {
    padding-inline-end: var(--admiral-input-padding-inline);
  }

  &[data-appearance='flat']:not([data-disabled]):not([data-read-only]):has(> input:focus) {
    background: ${backgroundBase};
  }

  &[data-disabled],
  &[data-read-only] {
    background: ${backgroundOpacity};
  }

  &[data-disabled] {
    --admiral-input-text-color: ${textDisabled};
    --admiral-input-placeholder-color: ${textDisabled};
    --admiral-input-additional-color: ${textDisabled};

    cursor: not-allowed;
  }

  &[data-disabled] > input {
    cursor: not-allowed;
  }
`;

export const baseInputEditableStyles = css`
  box-sizing: border-box;
  flex: 1 1 auto;
  min-width: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: var(--admiral-input-padding-block) 0;
  border: 0;
  border-radius: 0;
  outline: 0;
  appearance: none;
  background: transparent;
  color: inherit;
  font: inherit;
  line-height: inherit;
  cursor: text;

  &::placeholder {
    color: var(--admiral-input-placeholder-color);
    opacity: 1;
  }

  &:disabled {
    -webkit-text-fill-color: var(--admiral-input-text-color);
  }
`;

export const NativeInput = styled.input`
  ${baseInputEditableStyles}
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &::-ms-clear {
    display: none;
  }
`;

export const StyledBaseInputBorder = styled.span.attrs({
  'aria-hidden': true,
  'data-role': 'input-border',
})`
  position: absolute;
  inset: 0;
  box-sizing: border-box;
  border: 1px solid transparent;
  border-radius: inherit;
  pointer-events: none;
  transition: border-color ${hoverPressLeaveTransition};

  ${StyledBaseInputContainer}[data-appearance='standard'] & {
    border-color: ${borderRest};
  }

  ${StyledBaseInputContainer}:not([data-disabled]):not([data-read-only]):hover & {
    border-color: ${borderHover};
  }

  ${StyledBaseInputContainer}:not([data-disabled]):not([data-read-only]) > input:focus ~ & {
    border-width: 2px;
    border-color: ${borderFocus};
  }

  ${StyledBaseInputContainer}:not([data-disabled]):not([data-read-only]):has(:focus-visible) & {
    border-width: 2px;
    border-color: ${borderFocus};
  }

  ${StyledBaseInputContainer}[data-status='error'] & {
    border-color: ${borderErrorRest};
  }

  ${StyledBaseInputContainer}[data-status='error']:not([data-disabled]):not([data-read-only]):hover & {
    border-color: ${borderErrorHover};
  }

  ${StyledBaseInputContainer}[data-status='error']:not([data-disabled]):not([data-read-only]) > input:focus ~ & {
    border-width: 2px;
    border-color: ${borderErrorRest};
  }

  ${StyledBaseInputContainer}[data-status='error']:not([data-disabled]):not([data-read-only]):has(:focus-visible) & {
    border-width: 2px;
    border-color: ${borderErrorRest};
  }

  ${StyledBaseInputContainer}[data-status='success'] & {
    border-color: ${borderSuccessRest};
  }

  ${StyledBaseInputContainer}[data-status='success']:not([data-disabled]):not([data-read-only]):hover & {
    border-color: ${borderSuccessHover};
  }

  ${StyledBaseInputContainer}[data-status='success']:not([data-disabled]):not([data-read-only]) > input:focus ~ & {
    border-width: 2px;
    border-color: ${borderSuccessRest};
  }

  ${StyledBaseInputContainer}[data-status='success']:not([data-disabled]):not([data-read-only]):has(:focus-visible) & {
    border-width: 2px;
    border-color: ${borderSuccessRest};
  }

  ${StyledBaseInputContainer}[data-disabled] &,
  ${StyledBaseInputContainer}[data-read-only] & {
    border-width: 1px;
    border-color: transparent;
  }
`;

export const StyledIconPanel = styled.span`
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  gap: var(--admiral-input-layout-gap);
  color: var(--admiral-input-additional-color);
`;

export const StyledAffix = styled.span`
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 4px;
  color: var(--admiral-input-additional-color);
  white-space: nowrap;

  &[data-disabled] {
    cursor: not-allowed;
  }
`;

export const StyledInputDivider = styled(Divider).attrs({
  appearance: 'default',
  decorative: true,
  dimension: 's',
  length: 'var(--admiral-input-divider-length)',
  orientation: 'vertical',
})`
  flex: 0 0 auto;
`;

const inputIconStyles = css`
  box-sizing: border-box;
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: var(--admiral-input-icon-size);
  height: var(--admiral-input-icon-size);
  color: inherit;
  transition: color ${hoverPressLeaveTransition};
  cursor: pointer;

  &:hover {
    color: ${secondaryTextHover};
  }

  &:active {
    color: ${secondaryTextPress};
  }

  &:disabled,
  &[data-disabled] {
    color: ${textDisabled};
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid ${iconFocus};
    outline-offset: 2px;
  }

  > svg {
    display: block;
    width: 100%;
    height: 100%;
  }
`;

export const InputIcon = styled.span
  .withConfig({ shouldForwardProp: (prop) => prop !== 'disabled' })
  .attrs<InputIconProps>(({ disabled }) => ({ 'data-disabled': disabled ? '' : undefined }))<InputIconProps>`
  ${inputIconStyles}
`;

export const StyledInputIconButton = styled.button.attrs({ type: 'button' })`
  ${inputIconStyles}
  margin: 0;
  padding: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: inherit;
`;
