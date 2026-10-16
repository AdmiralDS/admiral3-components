import styled, { css } from 'styled-components';
import type { RuleSet } from 'styled-components';

import {
  SLIDER_DIMENSION_PARAMETERS,
  SLIDER_TRACK_HEIGHT,
  SLIDER_THUMB_BORDER_WIDTH,
  SLIDER_FOCUS_OUTLINE_WIDTH,
  SLIDER_VERTICAL_GAP,
} from './constants';
import type { SliderAtomDimension, SliderThumbAppearance, SliderTrackStyleProps } from './types';
import { hoverPressLeaveTransition } from '../../../theme/animation';
import { cssToken } from '../../../theme/cssToken';

const primary = cssToken('--admiral-color-primary-stroke-1-rest', (theme) => theme.color.primary.stroke._1.rest);
const primaryHover = cssToken('--admiral-color-primary-stroke-1-hover', (theme) => theme.color.primary.stroke._1.hover);
const primaryPress = cssToken('--admiral-color-primary-stroke-1-press', (theme) => theme.color.primary.stroke._1.press);
const focusColor = cssToken('--admiral-color-primary-base-1-disable', (theme) => theme.color.primary.base._1.disable);
const subtle = cssToken(
  '--admiral-color-neutral-stroke-subtle-rest',
  (theme) => theme.color.neutral.stroke.subtle.rest,
);
const base = cssToken('--admiral-color-neutral-base-1-rest', (theme) => theme.color.neutral.base._1.rest);
const text = cssToken('--admiral-color-neutral-text-1-rest', (theme) => theme.color.neutral.text._1.rest);
const label = cssToken('--admiral-color-neutral-text-2-rest', (theme) => theme.color.neutral.text._2.rest);
const disabledText = cssToken(
  '--admiral-color-neutral-text-disable-rest',
  (theme) => theme.color.neutral.text.disable.rest,
);
const shadow = cssToken('--admiral-shadow-shadow02', (theme) => theme.shadow.shadow02);

export const SliderContainer = styled.div<{ $dimension: SliderAtomDimension }>`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: ${SLIDER_VERTICAL_GAP}px;
  width: 100%;
  min-width: 0;
  color: ${text};
  ${({ $dimension }) => SLIDER_DIMENSION_PARAMETERS[$dimension].typography}
  &[data-disabled] {
    color: ${disabledText};
    cursor: not-allowed;
  }
`;
export const SliderTextRow = styled.div<{ $dimension: SliderAtomDimension; $hasStart: boolean; $hasEnd: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: ${({ $dimension }) => SLIDER_DIMENSION_PARAMETERS[$dimension].gap}px;
  padding-inline-start: ${({ $dimension, $hasStart }) =>
    $hasStart
      ? SLIDER_DIMENSION_PARAMETERS[$dimension].controlSize + SLIDER_DIMENSION_PARAMETERS[$dimension].gap
      : 0}px;
  padding-inline-end: ${({ $dimension, $hasEnd }) =>
    $hasEnd ? SLIDER_DIMENSION_PARAMETERS[$dimension].controlSize + SLIDER_DIMENSION_PARAMETERS[$dimension].gap : 0}px;
`;
export const SliderLabel = styled.label`
  min-width: 0;
  overflow-wrap: anywhere;
  color: ${label};
  [data-disabled] & {
    color: ${disabledText};
  }
`;
export const SliderValue = styled.span`
  flex-shrink: 0;
`;
export const SliderControlRow = styled.div<{ $dimension: SliderAtomDimension }>`
  display: flex;
  align-items: center;
  gap: ${({ $dimension }) => SLIDER_DIMENSION_PARAMETERS[$dimension].gap}px;
`;
export const SliderIcon = styled.span<{ $dimension: SliderAtomDimension }>`
  display: flex;
  flex: 0 0 ${({ $dimension }) => SLIDER_DIMENSION_PARAMETERS[$dimension].controlSize}px;
  width: ${({ $dimension }) => SLIDER_DIMENSION_PARAMETERS[$dimension].controlSize}px;
  height: ${({ $dimension }) => SLIDER_DIMENSION_PARAMETERS[$dimension].controlSize}px;
  color: ${label};
  pointer-events: none;
  & > svg {
    width: 100%;
    height: 100%;
  }
  [data-disabled] & {
    color: ${disabledText};
  }
`;
export const SliderBaseContainer = styled.div<{ $dimension: SliderAtomDimension }>`
  --slider-thumb-radius: ${({ $dimension }) => SLIDER_DIMENSION_PARAMETERS[$dimension].thumbSize / 2}px;
  position: relative;
  flex: 1;
  min-width: 0;
  /* Края дорожки за центрами Min/Max остаются внутри общей ширины компонента. */
  margin-inline: var(--slider-thumb-radius);
  height: ${({ $dimension }) => SLIDER_DIMENSION_PARAMETERS[$dimension].controlSize}px;
  cursor: pointer;
  touch-action: none;
  user-select: none;
  [data-disabled] & {
    cursor: not-allowed;
  }
`;
const nativeTrackStyles = css<{ $dimension: SliderAtomDimension }>`
  height: ${SLIDER_TRACK_HEIGHT}px;
  /* Крайние отрезки не участвуют в расчёте позиции и распределении отметок. */
  background:
    radial-gradient(
        circle,
        var(--slider-track-start-color) ${SLIDER_TRACK_HEIGHT / 2}px,
        transparent ${SLIDER_TRACK_HEIGHT / 2}px
      )
      left center / ${SLIDER_TRACK_HEIGHT}px ${SLIDER_TRACK_HEIGHT}px no-repeat,
    radial-gradient(
        circle,
        var(--slider-track-end-color) ${SLIDER_TRACK_HEIGHT / 2}px,
        transparent ${SLIDER_TRACK_HEIGHT / 2}px
      )
      right center / ${SLIDER_TRACK_HEIGHT}px ${SLIDER_TRACK_HEIGHT}px no-repeat,
    linear-gradient(var(--slider-track-start-color), var(--slider-track-start-color)) left ${SLIDER_TRACK_HEIGHT / 2}px
      center / var(--slider-thumb-radius) ${SLIDER_TRACK_HEIGHT}px no-repeat,
    linear-gradient(var(--slider-track-end-color), var(--slider-track-end-color)) right ${SLIDER_TRACK_HEIGHT / 2}px
      center / var(--slider-thumb-radius) ${SLIDER_TRACK_HEIGHT}px no-repeat,
    linear-gradient(to right, var(--slider-fill) var(--slider-fill-stop), ${subtle} var(--slider-fill-stop)) center /
      calc(100% - ${({ $dimension }) => SLIDER_DIMENSION_PARAMETERS[$dimension].thumbSize}px) ${SLIDER_TRACK_HEIGHT}px
      no-repeat;
`;
const thumbStyles = css<{ $dimension: SliderAtomDimension; $appearance: SliderThumbAppearance }>`
  box-sizing: border-box;
  width: ${({ $dimension }) => SLIDER_DIMENSION_PARAMETERS[$dimension].thumbSize}px;
  height: ${({ $dimension }) => SLIDER_DIMENSION_PARAMETERS[$dimension].thumbSize}px;
  border-radius: 50%;
  border: ${({ $appearance }) => ($appearance === 'stroke' ? SLIDER_THUMB_BORDER_WIDTH : 0)}px solid ${primary};
  background: ${({ $appearance }) => ($appearance === 'stroke' ? base : primary)};
  box-shadow: ${shadow};
  cursor: inherit;
  transition:
    background-color ${hoverPressLeaveTransition},
    border-color ${hoverPressLeaveTransition},
    border-width ${hoverPressLeaveTransition};
`;
const hoverThumbStyles = css<{ $appearance: SliderThumbAppearance }>`
  border-color: ${primaryHover};
  background: ${({ $appearance }) => ($appearance === 'stroke' ? base : primaryHover)};
`;
const pressedThumbStyles = css<{ $dimension: SliderAtomDimension; $appearance: SliderThumbAppearance }>`
  border-width: ${({ $dimension, $appearance }) =>
    $appearance === 'stroke' ? SLIDER_DIMENSION_PARAMETERS[$dimension].thumbBorderWidthPress : 0}px;
  border-color: ${primaryHover};
  background: ${({ $appearance }) => ($appearance === 'stroke' ? base : primaryPress)};
`;
const disabledThumbStyles = css<{ $appearance: SliderThumbAppearance }>`
  border-color: ${subtle};
  background: ${({ $appearance }) => ($appearance === 'stroke' ? base : subtle)};
  box-shadow: none;
`;
const focusThumbStyles = css`
  outline: ${SLIDER_FOCUS_OUTLINE_WIDTH}px solid ${focusColor};
  outline-offset: 0;
`;

export const NativeSliderInput = styled.input<{
  $dimension: SliderAtomDimension;
  $appearance: SliderThumbAppearance;
  $segmentPositions?: readonly number[];
  $trackStyles?: RuleSet<SliderTrackStyleProps>;
  $hideTrack?: boolean;
  $thumbOnly?: boolean;
}>`
  --slider-fill: ${primary};
  --slider-subtle: ${subtle};
  appearance: none;
  box-sizing: border-box;
  position: absolute;
  inset-block: 0;
  left: ${({ $dimension }) => -SLIDER_DIMENSION_PARAMETERS[$dimension].thumbSize / 2}px;
  width: calc(100% + ${({ $dimension }) => SLIDER_DIMENSION_PARAMETERS[$dimension].thumbSize}px);
  height: 100%;
  margin: 0;
  padding: 0;
  border: 0;
  outline: none;
  background: transparent;
  cursor: inherit;
  touch-action: none;
  pointer-events: ${({ $thumbOnly }) => ($thumbOnly ? 'none' : 'auto')};

  &:disabled {
    --slider-fill: ${subtle};
  }

  &::-webkit-slider-runnable-track {
    ${nativeTrackStyles}
    ${({ $trackStyles }) => $trackStyles}
    ${({ $hideTrack }) =>
      $hideTrack &&
      css`
        background: transparent;
      `}
  }
  &::-moz-range-track {
    ${nativeTrackStyles}
    ${({ $trackStyles }) => $trackStyles}
    ${({ $hideTrack }) =>
      $hideTrack &&
      css`
        background: transparent;
      `}
  }
  &::-moz-range-progress {
    background: transparent;
  }
  &::-webkit-slider-thumb {
    appearance: none;
    margin-top: ${({ $dimension }) => (SLIDER_TRACK_HEIGHT - SLIDER_DIMENSION_PARAMETERS[$dimension].thumbSize) / 2}px;
    ${thumbStyles}
    pointer-events: auto;
  }
  &::-moz-range-thumb {
    ${thumbStyles}
    pointer-events: auto;
  }
  &[data-thumb-hovered]:not(:disabled)::-webkit-slider-thumb {
    ${hoverThumbStyles}
  }
  &[data-thumb-hovered]:not(:disabled)::-moz-range-thumb {
    ${hoverThumbStyles}
  }
  &[data-pressed]:not(:disabled)::-webkit-slider-thumb {
    ${pressedThumbStyles}
  }
  &[data-pressed]:not(:disabled)::-moz-range-thumb {
    ${pressedThumbStyles}
  }
  &:focus-visible::-webkit-slider-thumb {
    ${focusThumbStyles}
  }
  &:focus-visible::-moz-range-thumb {
    ${focusThumbStyles}
  }
  &:disabled::-webkit-slider-thumb {
    ${disabledThumbStyles}
  }
  &:disabled::-moz-range-thumb {
    ${disabledThumbStyles}
  }
  @media (prefers-reduced-motion: reduce) {
    &::-webkit-slider-thumb {
      transition: none;
    }
    &::-moz-range-thumb {
      transition: none;
    }
  }
`;

/** Невидимый DOM-якорь Tooltip, совпадающий с положением нативного ползунка. */
export const SliderTooltipAnchor = styled.span<{ $dimension: SliderAtomDimension }>`
  position: absolute;
  left: var(--slider-position);
  top: 50%;
  transform: translate(-50%, -50%);
  width: ${({ $dimension }) => SLIDER_DIMENSION_PARAMETERS[$dimension].thumbSize}px;
  height: ${({ $dimension }) => SLIDER_DIMENSION_PARAMETERS[$dimension].thumbSize}px;
  pointer-events: none;
`;

/** Подпись шкалы с нативным поведением кнопки и унаследованной типографикой. */
export const SliderMarkButton = styled.button`
  appearance: none;
  border: 0;
  background: none;
  padding: 0;
  margin: 0;
  font: inherit;
  color: inherit;
  cursor: inherit;
  &:enabled {
    cursor: pointer;
  }
  &:disabled {
    cursor: not-allowed;
  }
`;
