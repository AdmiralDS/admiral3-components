import { SliderRange, type SliderRangeProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription, StoryDemoItem } from '../../stories/StoryContainers';

export const SliderRangeStoryPlaygroundTemplate = (args: SliderRangeProps) => (
  <StoryDemoContainer $direction="column">
    <StoryDemoDescription>
      Слайдер с двумя ползунками позволяет выбирать диапазон внутри допустимых значений. Доступное имя каждого ползунка
      задаётся через aria-label или aria-labelledby в lowerNativeSliderProps и upperNativeSliderProps; label —
      визуальная подпись.
    </StoryDemoDescription>
    <StoryDemoItem>
      <SliderRange {...args} />
    </StoryDemoItem>
  </StoryDemoContainer>
);
