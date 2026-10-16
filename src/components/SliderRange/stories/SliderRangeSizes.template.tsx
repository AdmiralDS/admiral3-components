import { SliderRange, type SliderRangeProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';
import { SLIDER_RANGE_DIMENSIONS } from '../constants';
import { Samples, Sample } from './SliderRangeStories.style';

export const SliderRangeSizesTemplate = (args: SliderRangeProps) => (
  <StoryDemoContainer $direction="column" $gap="24px">
    <StoryDemoDescription>
      Размерный ряд слайдера диапазона: M, S и XS. По умолчанию используется M.
    </StoryDemoDescription>
    <Samples>
      {SLIDER_RANGE_DIMENSIONS.map((dimension) => (
        <Sample key={dimension}>
          <StoryDemoDescription>{dimension.toUpperCase()}</StoryDemoDescription>
          <SliderRange {...args} dimension={dimension} />
        </Sample>
      ))}
    </Samples>
  </StoryDemoContainer>
);
