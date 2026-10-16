import { css } from 'styled-components';

import { SLIDER_DIMENSION_PARAMETERS, SLIDER_SEGMENT_GAP, SLIDER_TRACK_HEIGHT } from './constants';
import type { SliderTrackStyleProps } from './types';
import { cssToken } from '../../../theme/cssToken';

const subtle = cssToken(
  '--admiral-color-neutral-stroke-subtle-rest',
  (theme) => theme.color.neutral.stroke.subtle.rest,
);

/** Каждый промежуток прозрачен и центрирован на соответствующей позиции шага. */
export const segmentedTrackStyles = css<SliderTrackStyleProps>`
  ${({ $dimension, $segmentPositions }) => {
    const thumbSize = SLIDER_DIMENSION_PARAMETERS[$dimension].thumbSize;
    const positions = $segmentPositions && $segmentPositions.length > 1 ? $segmentPositions : [0, 1];
    const segments = positions.slice(0, -1).map((start, index) => {
      const end = positions[index + 1];
      const startStop = index === 0 ? css`0%` : css`calc(${start * 100}% + ${SLIDER_SEGMENT_GAP / 2}px)`;
      const endStop =
        index === positions.length - 2 ? css`100%` : css`calc(${end * 100}% - ${SLIDER_SEGMENT_GAP / 2}px)`;
      // Заливка движется внутри сегмента, а его границы и прозрачные промежутки остаются постоянными.
      const fillStop = css`clamp(${startStop}, var(--slider-fill-stop), ${endStop})`;
      return css`
        /* Прозрачный разделитель перед сегментом: по половине gap с каждой стороны отметки. */
        ${index > 0
          ? css`, transparent calc(${start * 100}% - ${SLIDER_SEGMENT_GAP / 2}px), transparent ${startStop},`
          : ''}
        /* Выбранная часть сегмента: синий от его начала до позиции заливки. */
        var(--slider-fill) ${startStop},
        var(--slider-fill) ${fillStop},
        /* Оставшаяся часть: серый от позиции заливки до конца сегмента, без плавного перехода. */
        ${subtle} ${fillStop},
        ${subtle} ${endStop}
      `;
    });
    return css`
      background:
        /* Круглый внешний конец левого крайнего отрезка («мёртвой» зоны). */
        radial-gradient(
            circle,
            var(--slider-track-start-color) ${SLIDER_TRACK_HEIGHT / 2}px,
            transparent ${SLIDER_TRACK_HEIGHT / 2}px
          )
          left center / ${SLIDER_TRACK_HEIGHT}px ${SLIDER_TRACK_HEIGHT}px no-repeat,
        /* Круглый внешний конец правого крайнего отрезка. */
        radial-gradient(
            circle,
            var(--slider-track-end-color) ${SLIDER_TRACK_HEIGHT / 2}px,
            transparent ${SLIDER_TRACK_HEIGHT / 2}px
          )
          right center / ${SLIDER_TRACK_HEIGHT}px ${SLIDER_TRACK_HEIGHT}px no-repeat,
        /* Прямой участок левой «мёртвой» зоны, соединяющий круглый конец с основной шкалой. */
        linear-gradient(var(--slider-track-start-color), var(--slider-track-start-color)) left
          ${SLIDER_TRACK_HEIGHT / 2}px center / var(--slider-thumb-radius) ${SLIDER_TRACK_HEIGHT}px no-repeat,
        /* Такой же прямой участок справа; цвет крайних отрезков задаётся переменными start/end-color. */
        linear-gradient(var(--slider-track-end-color), var(--slider-track-end-color)) right ${SLIDER_TRACK_HEIGHT / 2}px
          center / var(--slider-thumb-radius) ${SLIDER_TRACK_HEIGHT}px no-repeat,
        /* Основная область между центрами крайних положений thumb: сегменты по marks, их заливка и разрывы. */
        linear-gradient(to right, ${segments}) center / calc(100% - ${thumbSize}px) ${SLIDER_TRACK_HEIGHT}px no-repeat;
    `;
  }}
`;
