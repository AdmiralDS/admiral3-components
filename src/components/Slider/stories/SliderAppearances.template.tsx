import { Slider, type SliderProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';
import { SLIDER_THUMB_APPEARANCES } from '../constants';
import { Samples, Sample } from './SliderStories.style';

export const SliderAppearancesTemplate = (args: SliderProps) => (
  <StoryDemoContainer $direction="column" $gap="24px">
    <StoryDemoDescription>Ползунок Handle может быть двух типов: Stroke и Filled.</StoryDemoDescription>
    <Samples>
      {SLIDER_THUMB_APPEARANCES.map((thumbAppearance) => (
        <Sample key={thumbAppearance}>
          <StoryDemoDescription>{thumbAppearance}</StoryDemoDescription>
          <Slider {...args} thumbAppearance={thumbAppearance} />
        </Sample>
      ))}
    </Samples>
  </StoryDemoContainer>
);
