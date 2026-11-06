import { SliderRange, type SliderRangeProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';
import { SLIDER_THUMB_APPEARANCES } from '../constants';
import { Samples, Sample } from './SliderRangeStories.style';

export const SliderRangeAppearancesTemplate = (args: SliderRangeProps) => (
  <StoryDemoContainer $direction="column" $gap="24px">
    <StoryDemoDescription>Оба ползунка Handle могут быть двух типов: Stroke и Filled.</StoryDemoDescription>
    <Samples>
      {SLIDER_THUMB_APPEARANCES.map((thumbAppearance) => (
        <Sample key={thumbAppearance}>
          <StoryDemoDescription>{thumbAppearance}</StoryDemoDescription>
          <SliderRange {...args} thumbAppearance={thumbAppearance} />
        </Sample>
      ))}
    </Samples>
  </StoryDemoContainer>
);
