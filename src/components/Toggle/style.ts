import styled from 'styled-components';

import { TOGGLE_DIMENSION_PARAMETERS } from './constants';
import type { StyledToggleProps } from './types';
import { durationShort4, easingAccelerateStandard, hoverPressLeaveTransition } from '../../theme/animation';
import { cssToken } from '../../theme/cssToken';
import { NativeInput, SelectionControlLabelContent } from '../_internal/InputAtoms';

const backgroundRest = cssToken(
  '--admiral-color-neutral-base-invisible-rest',
  (theme) => theme.color.neutral.base.invisible.rest,
);
const backgroundHover = cssToken(
  '--admiral-color-neutral-base-invisible-hover',
  (theme) => theme.color.neutral.base.invisible.hover,
);
const backgroundPress = cssToken(
  '--admiral-color-neutral-base-invisible-press',
  (theme) => theme.color.neutral.base.invisible.press,
);
const backgroundDisabled = cssToken(
  '--admiral-color-neutral-base-opacity-rest',
  (theme) => theme.color.neutral.base.opacity.rest,
);
const borderRest = cssToken('--admiral-color-neutral-stroke-2-rest', (theme) => theme.color.neutral.stroke._2.rest);
const borderHover = cssToken('--admiral-color-neutral-stroke-1-rest', (theme) => theme.color.neutral.stroke._1.rest);
const selectedRest = cssToken('--admiral-color-primary-base-1-rest', (theme) => theme.color.primary.base._1.rest);
const selectedHover = cssToken('--admiral-color-primary-base-1-hover', (theme) => theme.color.primary.base._1.hover);
const selectedPress = cssToken('--admiral-color-primary-base-1-press', (theme) => theme.color.primary.base._1.press);
const selectedDisabled = cssToken(
  '--admiral-color-primary-base-1-disable',
  (theme) => theme.color.primary.base._1.disable,
);
const thumbActive = cssToken(
  '--admiral-color-neutral-text-static-white-1',
  (theme) => theme.color.neutral.text.staticWhite._1,
);
const thumbInactive = cssToken('--admiral-color-neutral-text-2-rest', (theme) => theme.color.neutral.text._2.rest);
const thumbDisabled = cssToken(
  '--admiral-color-neutral-text-disable-rest',
  (theme) => theme.color.neutral.text.disable.rest,
);
const thumbDisabledActive = cssToken(
  '--admiral-color-neutral-base-1-rest',
  (theme) => theme.color.neutral.base._1.rest,
);
const focusColor = cssToken('--admiral-color-primary-stroke-1-rest', (theme) => theme.color.primary.stroke._1.rest);
const textColor = cssToken('--admiral-color-neutral-text-1-rest', (theme) => theme.color.neutral.text._1.rest);
const textDisabled = cssToken(
  '--admiral-color-neutral-text-disable-rest',
  (theme) => theme.color.neutral.text.disable.rest,
);
const sliderTransition = `${durationShort4} ${easingAccelerateStandard}`;

export const StyledToggle = styled.label<StyledToggleProps>`
  position: relative;
  display: inline-flex;
  box-sizing: border-box;
  width: ${({ $width }) => ($width == null ? 'fit-content' : typeof $width === 'number' ? `${$width}px` : $width)};
  min-width: 0;
  align-items: flex-start;
  flex-direction: ${({ $labelPosition }) => ($labelPosition === 'left' ? 'row-reverse' : 'row')};
  justify-content: ${({ $labelPosition }) => ($labelPosition === 'left' ? 'space-between' : 'flex-start')};
  gap: ${TOGGLE_DIMENSION_PARAMETERS.m.gap}px;
  color: ${({ $disabled }) => ($disabled ? textDisabled : textColor)};
  cursor: ${({ $disabled, $readOnly }) => ($disabled ? 'not-allowed' : $readOnly ? 'default' : 'pointer')};
  ${TOGGLE_DIMENSION_PARAMETERS.m.typography}

  &[data-dimension='s'] {
    gap: ${TOGGLE_DIMENSION_PARAMETERS.s.gap}px;
    ${TOGGLE_DIMENSION_PARAMETERS.s.typography}
  }
  &[data-dimension='xs'] {
    gap: ${TOGGLE_DIMENSION_PARAMETERS.xs.gap}px;
    ${TOGGLE_DIMENSION_PARAMETERS.xs.typography}
  }
`;

export const Control = styled.span`
  position: relative;
  box-sizing: border-box;
  flex: 0 0 auto;
  width: ${TOGGLE_DIMENSION_PARAMETERS.m.width}px;
  height: ${TOGGLE_DIMENSION_PARAMETERS.m.height}px;
  margin-block: ${TOGGLE_DIMENSION_PARAMETERS.m.controlMarginBlock}px;
  border: 1px solid ${borderRest};
  border-radius: 1000px;
  background: ${backgroundRest};
  transition:
    background-color ${hoverPressLeaveTransition},
    border-color ${hoverPressLeaveTransition};

  ${StyledToggle}[data-dimension='s'] & {
    width: ${TOGGLE_DIMENSION_PARAMETERS.s.width}px;
    height: ${TOGGLE_DIMENSION_PARAMETERS.s.height}px;
    margin-block: ${TOGGLE_DIMENSION_PARAMETERS.s.controlMarginBlock}px;
  }

  ${StyledToggle}[data-dimension='xs'] & {
    width: ${TOGGLE_DIMENSION_PARAMETERS.xs.width}px;
    height: ${TOGGLE_DIMENSION_PARAMETERS.xs.height}px;
    margin-block: ${TOGGLE_DIMENSION_PARAMETERS.xs.controlMarginBlock}px;
  }

  ${NativeInput}:hover + & {
    border-color: ${borderHover};
    background: ${backgroundHover};
  }
  ${NativeInput}:active + & {
    background: ${backgroundPress};
  }
  ${NativeInput}:checked + & {
    border-color: ${selectedRest};
    background: ${selectedRest};
  }
  ${NativeInput}:checked:hover + & {
    border-color: ${selectedHover};
    background: ${selectedHover};
  }
  ${NativeInput}:checked:active + & {
    border-color: ${selectedPress};
    background: ${selectedPress};
  }
  ${NativeInput}:disabled + &, ${NativeInput}[readonly] + & {
    border-color: ${borderHover};
    background: ${backgroundDisabled};
  }
  ${NativeInput}:disabled:checked + &, ${NativeInput}[readonly]:checked + & {
    border-color: ${selectedDisabled};
    background: ${selectedDisabled};
  }
  ${NativeInput}:focus-visible + & {
    outline: 2px solid ${focusColor};
    outline-offset: 2px;
  }
`;

export const Thumb = styled.span`
  position: absolute;
  top: 50%;
  left: ${TOGGLE_DIMENSION_PARAMETERS.m.thumbOffsetInline}px;
  width: ${TOGGLE_DIMENSION_PARAMETERS.m.thumbSize}px;
  height: ${TOGGLE_DIMENSION_PARAMETERS.m.thumbSize}px;
  border-radius: 50%;
  background: ${thumbInactive};
  transform: translateY(-50%);
  transition:
    transform ${sliderTransition},
    background-color ${sliderTransition};

  ${StyledToggle}[data-dimension='s'] &, ${StyledToggle}[data-dimension='xs'] & {
    left: ${TOGGLE_DIMENSION_PARAMETERS.s.thumbOffsetInline}px;
    width: ${TOGGLE_DIMENSION_PARAMETERS.s.thumbSize}px;
    height: ${TOGGLE_DIMENSION_PARAMETERS.s.thumbSize}px;
  }

  ${NativeInput}:checked + ${Control} & {
    transform: translate(16px, -50%);
    background: ${thumbActive};
  }
  ${StyledToggle}[data-dimension='s'] ${NativeInput}:checked + ${Control} &,
  ${StyledToggle}[data-dimension='xs'] ${NativeInput}:checked + ${Control} & {
    transform: translate(12px, -50%);
  }

  ${NativeInput}:is(:disabled, [readonly]) + ${Control} & {
    background: ${thumbDisabled};
  }

  ${NativeInput}:is(:disabled, [readonly]):checked + ${Control} & {
    background: ${thumbDisabledActive};
  }
`;

export const LabelContent = styled(SelectionControlLabelContent)`
  flex: 1 1 auto;

  && {
    margin-block: 0;
  }
`;
