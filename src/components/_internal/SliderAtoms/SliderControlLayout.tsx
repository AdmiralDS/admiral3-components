import { SliderControlRow, SliderIcon } from './style';
import type { SliderControlLayoutProps } from './types';
import { hasSlotContent } from '../../../utils/hasSlotContent';

/** Раскладка управления без верхней подписи и без управления значением. */
export const SliderControlLayout = ({ dimension, iconStart, iconEnd, children }: SliderControlLayoutProps) => (
  <SliderControlRow $dimension={dimension}>
    {hasSlotContent(iconStart) && (
      <SliderIcon $dimension={dimension} aria-hidden="true">
        {iconStart}
      </SliderIcon>
    )}
    {children}
    {hasSlotContent(iconEnd) && (
      <SliderIcon $dimension={dimension} aria-hidden="true">
        {iconEnd}
      </SliderIcon>
    )}
  </SliderControlRow>
);
