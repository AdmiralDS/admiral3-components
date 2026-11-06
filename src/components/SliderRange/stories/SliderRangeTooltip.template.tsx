import { SliderRange, type SliderRangeProps } from '@admiral-ds/admiral3-components';

import { Samples, Sample } from './SliderRangeStories.style';
import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

export const SliderRangeTooltipTemplate = (args: SliderRangeProps) => (
  <StoryDemoContainer $direction="column" $gap="24px">
    <StoryDemoDescription>
      В Hover и Press можно включить Tooltip со значением соответствующего ползунка. Наведите указатель на любой
      ползунок или удерживайте его. После изменения значения с клавиатуры подсказка видна в течение двух секунд.
    </StoryDemoDescription>
    <Samples>
      <Sample>
        <SliderRange {...args} showTooltip />
      </Sample>
    </Samples>
  </StoryDemoContainer>
);
