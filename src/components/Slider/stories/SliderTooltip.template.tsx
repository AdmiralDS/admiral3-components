import { Slider, type SliderProps } from '@admiral-ds/admiral3-components';

import { Samples, Sample } from './SliderStories.style';
import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

export const SliderTooltipTemplate = (args: SliderProps) => (
  <StoryDemoContainer $direction="column" $gap="24px">
    <StoryDemoDescription>
      В состояниях Hover и Press можно включить Tooltip с текущим значением. Наведите указатель на ползунок или
      удерживайте его. После изменения значения с клавиатуры подсказка видна в течение двух секунд.
    </StoryDemoDescription>
    <Samples>
      <Sample>
        <Slider {...args} showTooltip />
      </Sample>
    </Samples>
  </StoryDemoContainer>
);
