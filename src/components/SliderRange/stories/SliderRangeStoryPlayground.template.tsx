import { SliderRange, type SliderRangeProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription, StoryDemoItem } from '../../stories/StoryContainers';

export const SliderRangeStoryPlaygroundTemplate = (args: SliderRangeProps) => (
  <StoryDemoContainer $direction="column">
    <StoryDemoDescription>
      Слайдер с двумя ползунками позволяет выбирать диапазон внутри допустимых значений. Доступное имя каждого ползунка
      задаётся через aria-label или aria-labelledby в lowerNativeSliderProps и upperNativeSliderProps; label —
      визуальная подпись. При перетаскивании через соседа ползунок продолжает движение и меняет роль lower/upper;
      onChange всегда получает упорядоченный интервал. AllowSwap=false запрещает обмен: ползунок останавливается на
      соседнем, совпадение границ разрешено. По умолчанию allowSwap=true. Клавиатура ограничивает значение соседней
      границей.
    </StoryDemoDescription>
    <StoryDemoItem>
      <SliderRange {...args} />
    </StoryDemoItem>
  </StoryDemoContainer>
);
