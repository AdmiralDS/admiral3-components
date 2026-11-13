import { SliderRange, type SliderRangeProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription, StoryDemoItem } from '../../stories/StoryContainers';

export const SliderRangeStoryPlaygroundTemplate = (args: SliderRangeProps) => (
  <StoryDemoContainer $direction="column">
    <StoryDemoDescription>
      Слайдер с двумя ползунками позволяет выбирать диапазон внутри допустимых значений. Доступное имя каждого ползунка
      задаётся через aria-label или aria-labelledby в lowerNativeSliderProps и upperNativeSliderProps; label —
      визуальная подпись. При перетаскивании через соседа ползунок продолжает движение и меняет роль lower/upper;
      onChange всегда получает упорядоченный интервал. AllowSwap=false запрещает обмен: ползунок останавливается на
      соседнем. По умолчанию allowSwap=true, minValueDistance=0 — совпадение границ разрешено. Если minValueDistance
      больше нуля, при отпускании активный ползунок отступает от соседа: нижний влево, верхний вправо. Во время drag
      зазор не ограничивается. Если у края активному ползунку не хватает места, недостающий зазор восстанавливается
      сдвигом соседа. Клавиатура учитывает minValueDistance сразу.
    </StoryDemoDescription>
    <StoryDemoItem>
      <SliderRange {...args} />
    </StoryDemoItem>
  </StoryDemoContainer>
);
