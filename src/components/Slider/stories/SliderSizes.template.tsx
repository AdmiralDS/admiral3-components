import { Slider, type SliderProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';
import { SLIDER_DIMENSIONS } from '../constants';
import { Samples, Sample } from './SliderStories.style';

export const SliderSizesTemplate = (args: SliderProps) => (
  <StoryDemoContainer $direction="column" $gap="24px">
    <StoryDemoDescription>Размерный ряд слайдера: M, S и XS. По умолчанию используется M.</StoryDemoDescription>
    <Samples>
      {SLIDER_DIMENSIONS.map((dimension) => (
        <Sample key={dimension}>
          <StoryDemoDescription>{dimension.toUpperCase()}</StoryDemoDescription>
          <Slider {...args} dimension={dimension} />
        </Sample>
      ))}
    </Samples>
  </StoryDemoContainer>
);
