import { SliderRange, type SliderRangeProps } from '@admiral-ds/admiral3-components';

import { Samples, Sample } from './SliderRangeStories.style';
import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

export const SliderRangeFormattingTemplate = (args: SliderRangeProps) => (
  <StoryDemoContainer $direction="column" $gap="24px">
    <StoryDemoDescription>
      renderValue форматирует каждую границу выбранного интервала и содержимое Tooltip. renderMarks форматирует подписи
      min/max. Обе функции возвращают ReactNode. null скрывает соответствующую строку; при renderValue=null Tooltip
      сохраняет числовое значение.
    </StoryDemoDescription>
    <Samples>
      <Sample>
        <StoryDemoDescription>Форматирование значений и границ</StoryDemoDescription>
        <SliderRange
          {...args}
          showTooltip
          renderValue={(value) => <strong>{value} ₽</strong>}
          renderMarks={(value) => <span>{value} ₽</span>}
        />
      </Sample>
      <Sample>
        <StoryDemoDescription>Без верхнего значения, с числовыми Tooltip</StoryDemoDescription>
        <SliderRange {...args} showTooltip renderValue={null} />
      </Sample>
    </Samples>
  </StoryDemoContainer>
);
