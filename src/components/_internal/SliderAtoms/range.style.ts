import styled from 'styled-components';

import { SLIDER_TRACK_HEIGHT } from './constants';
import { SliderBaseContainer } from './style';
import { cssToken } from '../../../theme/cssToken';

const primary = cssToken('--admiral-color-primary-stroke-1-rest', (theme) => theme.color.primary.stroke._1.rest);
const subtle = cssToken(
  '--admiral-color-neutral-stroke-subtle-rest',
  (theme) => theme.color.neutral.stroke.subtle.rest,
);

export const SliderRangeTrack = styled.div`
  position: absolute;
  inset-inline: calc(-1 * var(--slider-thumb-radius));
  top: calc(50% - ${SLIDER_TRACK_HEIGHT / 2}px);
  height: ${SLIDER_TRACK_HEIGHT}px;
  border-radius: ${SLIDER_TRACK_HEIGHT / 2}px;
  /* Внешние отрезки также передают нажатия обработчику общего контейнера. */
  pointer-events: auto;
  background: linear-gradient(
    to right,
    ${subtle} var(--slider-lower-position),
    ${primary} var(--slider-lower-position),
    ${primary} var(--slider-upper-position),
    ${subtle} var(--slider-upper-position)
  );
  [data-disabled] & {
    background: ${subtle};
  }
`;

export const SliderRangeContainer = styled(SliderBaseContainer)<{ $activeThumb: 'lower' | 'upper' }>`
  flex: 1 0 auto;
  & > input {
    z-index: 1;
  }
  & > input[data-bound=${({ $activeThumb }) => $activeThumb}] {
    z-index: 2;
  }
`;
