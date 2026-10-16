import { SliderRange, Button, type SliderRangeProps } from '@admiral-ds/admiral3-components';

import { Samples, Sample } from './SliderRangeStories.style';
import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

export const SliderRangeKeyboardTemplate = (args: SliderRangeProps) => (
  <StoryDemoContainer $direction="column" $gap="24px">
    <StoryDemoDescription>
      Tab и Shift+Tab переводят фокус между ползунками. Стрелки меняют значение на шаг, Home и End перемещают к
      допустимым границам без пересечения второго ползунка. Нижние подписи выбираются указателем и не входят в порядок
      Tab. После верхнего ползунка следующий Tab переводит фокус за пределы компонента.
    </StoryDemoDescription>
    <Samples>
      <Sample>
        <Button>До слайдера</Button>
        <SliderRange {...args} />
        <Button>После слайдера</Button>
      </Sample>
    </Samples>
  </StoryDemoContainer>
);
