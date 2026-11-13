import { textStyles } from '@admiral-ds/admiral3-tokens';
import styled, { css } from 'styled-components';

import {
  STEPPER_CONNECTOR_WIDTH,
  STEPPER_DIMENSION_PARAMETERS,
  STEPPER_MOBILE_PADDING,
  STEPPER_REDO_DASH_GAP,
  STEPPER_REDO_DASH_LENGTH,
} from './constants';
import type { StyledStepProps, StyledStepperProps } from './types';
import { hoverPressLeaveTransition } from '../../theme/animation';
import { cssToken } from '../../theme/cssToken';

const text = cssToken('--admiral-color-neutral-text-1-rest', (theme) => theme.color.neutral.text._1.rest);
const secondaryText = cssToken('--admiral-color-neutral-text-2-rest', (theme) => theme.color.neutral.text._2.rest);
const disabledText = cssToken(
  '--admiral-color-neutral-text-disable-rest',
  (theme) => theme.color.neutral.text.disable.rest,
);
const primary = cssToken('--admiral-color-primary-base-1-rest', (theme) => theme.color.primary.base._1.rest);
const primaryDisabled = cssToken(
  '--admiral-color-primary-base-1-disable',
  (theme) => theme.color.primary.base._1.disable,
);
const neutralDisabled = cssToken(
  '--admiral-color-neutral-base-inverted-disable',
  (theme) => theme.color.neutral.base.inverted.disable,
);
const inverted = cssToken(
  '--admiral-color-neutral-base-inverted-rest',
  (theme) => theme.color.neutral.base.inverted.rest,
);
const invertedText = cssToken(
  '--admiral-color-neutral-text-inverted-rest',
  (theme) => theme.color.neutral.text.inverted.rest,
);
const white = cssToken(
  '--admiral-color-neutral-text-static-white-1',
  (theme) => theme.color.neutral.text.staticWhite._1,
);
const nextBackground = cssToken(
  '--admiral-color-neutral-base-opacity-rest',
  (theme) => theme.color.neutral.base.opacity.rest,
);
const track = cssToken('--admiral-color-neutral-stroke-1-rest', (theme) => theme.color.neutral.stroke._1.rest);
const primaryStroke = cssToken('--admiral-color-primary-stroke-1-rest', (theme) => theme.color.primary.stroke._1.rest);
const neutralStroke = cssToken(
  '--admiral-color-neutral-stroke-hardest-rest',
  (theme) => theme.color.neutral.stroke.hardest.rest,
);
const error = cssToken('--admiral-color-error-stroke-1-rest', (theme) => theme.color.error.stroke._1.rest);
const warning = cssToken('--admiral-color-warning-stroke-1-rest', (theme) => theme.color.warning.stroke._1.rest);
const errorBase = cssToken('--admiral-color-error-base-1-rest', (theme) => theme.color.error.base._1.rest);
const warningBase = cssToken('--admiral-color-warning-base-1-rest', (theme) => theme.color.warning.base._1.rest);
const errorText = cssToken('--admiral-color-error-text-1-rest', (theme) => theme.color.error.text._1.rest);
const warningText = cssToken('--admiral-color-warning-text-1-rest', (theme) => theme.color.warning.text._1.rest);
const primaryHover = cssToken('--admiral-color-primary-stroke-1-hover', (theme) => theme.color.primary.stroke._1.hover);
const primaryPress = cssToken('--admiral-color-primary-stroke-1-press', (theme) => theme.color.primary.stroke._1.press);
const primaryBaseHover = cssToken('--admiral-color-primary-base-1-hover', (theme) => theme.color.primary.base._1.hover);
const primaryBasePress = cssToken('--admiral-color-primary-base-1-press', (theme) => theme.color.primary.base._1.press);
const neutralHover = cssToken(
  '--admiral-color-neutral-base-inverted-hover',
  (theme) => theme.color.neutral.base.inverted.hover,
);
const neutralPress = cssToken(
  '--admiral-color-neutral-base-inverted-press',
  (theme) => theme.color.neutral.base.inverted.press,
);
const errorHover = cssToken('--admiral-color-error-stroke-1-hover', (theme) => theme.color.error.stroke._1.hover);
const errorPress = cssToken('--admiral-color-error-stroke-1-press', (theme) => theme.color.error.stroke._1.press);
const errorBaseHover = cssToken('--admiral-color-error-base-1-hover', (theme) => theme.color.error.base._1.hover);
const errorBasePress = cssToken('--admiral-color-error-base-1-press', (theme) => theme.color.error.base._1.press);
const warningBaseHover = cssToken('--admiral-color-warning-base-1-hover', (theme) => theme.color.warning.base._1.hover);
const warningBasePress = cssToken('--admiral-color-warning-base-1-press', (theme) => theme.color.warning.base._1.press);

export const HiddenText = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
`;

export const StyledStepper = styled.div<StyledStepperProps>`
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  &:focus-visible {
    outline: 2px solid ${primaryStroke};
    outline-offset: 2px;
  }
  ${({ $mobile }) =>
    $mobile &&
    css`
      overflow-x: auto;
      scrollbar-width: none;
      &::-webkit-scrollbar {
        display: none;
      }
      padding-inline: ${STEPPER_MOBILE_PADDING}px;
      /* Место для внешней рамки фокуса внутри прокручиваемой области. */
      padding-block: 4px;
      scroll-padding-inline: ${STEPPER_MOBILE_PADDING}px;
    `}
`;

export const StepList = styled.ol<StyledStepperProps & { $stepWidth?: number }>`
  display: flex;
  flex-direction: ${({ $orientation }) => ($orientation === 'vertical' ? 'column' : 'row')};
  margin: 0;
  padding: 0;
  list-style: none;
  width: ${({ $mobile }) => ($mobile ? 'max-content' : '100%')};
  min-width: 100%;

  > li {
    box-sizing: border-box;
    min-width: 0;
    display: flex;
    flex: ${({ $orientation, $stepWidth }) =>
      $orientation === 'horizontal' && $stepWidth ? `0 0 ${$stepWidth}px` : '1 1 0'};
    width: ${({ $stepWidth }) => ($stepWidth ? `${$stepWidth}px` : undefined)};
    &[hidden] {
      display: none;
    }
  }
`;

export const StepTrack = styled.span`
  display: flex;
  align-items: center;
  min-width: 0;
`;

export const Indicator = styled.span`
  box-sizing: border-box;
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  border-radius: ${cssToken('--admiral-radius-round', (theme) => theme.radius.round)};
  transition: color ${hoverPressLeaveTransition};
  > svg {
    width: 100%;
    height: 100%;
  }
`;

export const Connector = styled.span`
  box-sizing: border-box;
  flex: 1 1 auto;
  min-width: 0;
  border: 0 solid ${track};
  transition:
    border-color ${hoverPressLeaveTransition},
    color ${hoverPressLeaveTransition};
`;

export const StepText = styled.span`
  display: flex;
  flex-direction: column;
  min-width: 0;
  gap: 2px;
`;

export const StepLabel = styled.span`
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const StepDescription = styled.span<{ $lineClamp: number }>`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: ${({ $lineClamp }) => $lineClamp};
  overflow: hidden;
  overflow-wrap: anywhere;
`;

export const StepSegment = styled.button<StyledStepProps>`
  &[hidden] {
    display: none;
  }
  box-sizing: border-box;
  appearance: none;
  position: relative;
  display: flex;
  flex: 1 1 auto;
  flex-direction: ${({ $orientation }) => ($orientation === 'horizontal' ? 'column' : 'row')};
  min-width: 0;
  width: 100%;
  padding: 0;
  margin: 0;
  border: 0;
  background: transparent;
  color: ${text};
  text-align: start;
  gap: ${({ $dimension, $orientation }) =>
    STEPPER_DIMENSION_PARAMETERS[$dimension][$orientation === 'horizontal' ? 'gap' : 'verticalGap']}px;

  ${StepTrack} {
    flex-direction: ${({ $orientation }) => ($orientation === 'horizontal' ? 'row' : 'column')};
    align-self: stretch;
    gap: ${({ $dimension, $orientation }) =>
      $orientation === 'horizontal' ? STEPPER_DIMENSION_PARAMETERS[$dimension].trackGap : 4}px;
    padding: ${({ $dimension, $orientation }) =>
      $orientation === 'horizontal' ? `0 ${STEPPER_DIMENSION_PARAMETERS[$dimension].trackGap}px 0 0` : '0 0 4px'};
  }

  ${Indicator} {
    width: ${({ $dimension }) => STEPPER_DIMENSION_PARAMETERS[$dimension].indicator}px;
    height: ${({ $dimension }) => STEPPER_DIMENSION_PARAMETERS[$dimension].indicator}px;
    ${({ $dimension }) => ($dimension === 'm' ? textStyles.subtitle.subtitle3 : textStyles.subtitle.subtitle4)}
    color: ${secondaryText};
    background: ${nextBackground};
  }

  ${Connector} {
    ${({ $orientation }) =>
      $orientation === 'horizontal'
        ? css`
            border-top-width: ${STEPPER_CONNECTOR_WIDTH}px;
          `
        : css`
            border-left-width: ${STEPPER_CONNECTOR_WIDTH}px;
            min-height: 16px;
          `}
  }

  ${StepText} {
    flex: 1 1 auto;
    ${({ $orientation }) =>
      $orientation === 'horizontal'
        ? css`
            width: 100%;
            padding-inline-end: 16px;
            box-sizing: border-box;
          `
        : css`
            padding-bottom: 24px;
          `}
  }

  ${StepLabel} {
    ${({ $dimension }) => ($dimension === 'm' ? textStyles.subtitle.subtitle2 : textStyles.subtitle.subtitle3)}
  }

  ${StepDescription} {
    ${({ $dimension }) => ($dimension === 'm' ? textStyles.body.body1Short : textStyles.body.body2Short)}
  }

  &[data-state='active'] ${Indicator} {
    background: ${({ $colorMode }) => ($colorMode === 'colored' ? primary : inverted)};
    color: ${({ $colorMode }) => ($colorMode === 'colored' ? white : invertedText)};
  }

  &[data-state='completed'] {
    ${StepTrack} {
      ${({ $dimension, $orientation, $colorMode }) =>
        $dimension === 'm' &&
        $orientation === 'horizontal' &&
        $colorMode === 'colored' &&
        css`
          gap: 8px;
        `}
    }
    ${Indicator} {
      background: ${({ $colorMode }) => ($colorMode === 'colored' ? white : invertedText)};
      color: ${({ $colorMode }) => ($colorMode === 'colored' ? primary : inverted)};
    }
    ${Connector} {
      border-color: ${({ $colorMode }) => ($colorMode === 'colored' ? primaryStroke : neutralStroke)};
    }
    &[data-step-action]:hover {
      ${Indicator} {
        color: ${({ $colorMode }) => ($colorMode === 'colored' ? primaryBaseHover : neutralHover)};
      }
      ${Connector} {
        border-color: ${({ $colorMode }) => ($colorMode === 'colored' ? primaryHover : neutralHover)};
      }
    }
    &[data-step-action]:active {
      ${Indicator} {
        color: ${({ $colorMode }) => ($colorMode === 'colored' ? primaryBasePress : neutralPress)};
      }
      ${Connector} {
        border-color: ${({ $colorMode }) => ($colorMode === 'colored' ? primaryPress : neutralPress)};
      }
    }
  }

  &[data-state='error'],
  &[data-state='warning'] {
    ${Indicator} {
      background: ${white};
    }
  }
  &[data-state='error'] {
    ${Indicator} {
      color: ${errorBase};
    }
    ${Connector} {
      border-color: ${({ $dimension, $orientation }) =>
        $dimension === 'm' && $orientation === 'vertical' ? errorText : error};
      color: ${({ $dimension, $orientation }) =>
        $dimension === 'm' && $orientation === 'vertical' ? errorText : error};
    }
    &[data-step-action]:hover {
      ${Indicator} {
        color: ${errorBaseHover};
      }
      ${Connector} {
        border-color: ${errorHover};
        color: ${errorHover};
      }
    }
    &[data-step-action]:active {
      ${Indicator} {
        color: ${errorBasePress};
      }
      ${Connector} {
        border-color: ${errorPress};
        color: ${errorPress};
      }
    }
  }
  &[data-state='warning'] {
    ${Indicator} {
      color: ${warningBase};
    }
    ${Connector} {
      border-color: ${({ $dimension, $orientation }) =>
        $dimension === 'm' && $orientation === 'vertical' ? warningText : warning};
      color: ${({ $dimension, $orientation }) =>
        $dimension === 'm' && $orientation === 'vertical' ? warningText : warning};
    }
    &[data-step-action]:hover {
      ${Indicator} {
        color: ${warningBaseHover};
      }
      ${Connector} {
        border-color: ${warning};
        color: ${warning};
      }
    }
    &[data-step-action]:active {
      ${Indicator} {
        color: ${warningBasePress};
      }
      ${Connector} {
        border-color: ${warning};
        color: ${warning};
      }
    }
  }
  &[data-state='disabled'] {
    color: ${disabledText};
    cursor: not-allowed;
    ${Indicator} {
      color: ${({ $colorMode }) => ($colorMode === 'colored' ? primaryDisabled : neutralDisabled)};
      background: ${invertedText};
    }
    ${Connector} {
      border-color: ${({ $colorMode }) => ($colorMode === 'colored' ? primaryDisabled : track)};
    }
  }
  &[data-redo] ${Connector} {
    border-width: 0;
    ${({ $orientation }) =>
      $orientation === 'horizontal'
        ? css`
            height: ${STEPPER_CONNECTOR_WIDTH}px;
          `
        : css`
            width: ${STEPPER_CONNECTOR_WIDTH}px;
          `}
    background-image: repeating-linear-gradient(
      ${({ $orientation }) => ($orientation === 'horizontal' ? 'to right' : 'to bottom')},
      currentColor 0 ${STEPPER_REDO_DASH_LENGTH}px,
      transparent ${STEPPER_REDO_DASH_LENGTH}px ${STEPPER_REDO_DASH_LENGTH + STEPPER_REDO_DASH_GAP}px
    );
  }
  &[data-redo][data-state='active'] ${Connector} {
    color: ${({ $colorMode }) => ($colorMode === 'colored' ? primaryStroke : neutralStroke)};
  }
  &[data-state='completed'] ${StepTrack}, &[data-state='disabled'] ${StepTrack} {
    ${({ $orientation, $colorMode }) =>
      $orientation === 'horizontal' &&
      $colorMode === 'neutral' &&
      css`
        padding-inline-end: 8px;
      `}
  }
  &[data-hide-line] ${Connector} {
    visibility: hidden;
  }

  &[data-step-action] {
    cursor: pointer;
    &:focus-visible {
      outline: none;
      ${Indicator} {
        outline: 2px solid ${primaryStroke};
        outline-offset: 2px;
      }
    }
  }

  @media (prefers-reduced-motion: reduce) {
    ${Indicator}, ${Connector} {
      transition: none;
    }
  }
  @media (forced-colors: active) {
    ${Indicator} {
      border: 1px solid CanvasText;
    }
    &:focus-visible ${Indicator} {
      outline-color: Highlight;
    }
    &[data-redo] ${Connector} {
      background-image: none;
      border-color: CanvasText;
      border-style: dashed;
      ${({ $orientation }) =>
        $orientation === 'horizontal'
          ? css`
              border-top-width: ${STEPPER_CONNECTOR_WIDTH}px;
            `
          : css`
              border-left-width: ${STEPPER_CONNECTOR_WIDTH}px;
            `}
    }
  }
`;
