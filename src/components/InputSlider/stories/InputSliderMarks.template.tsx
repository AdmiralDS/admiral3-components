import { InputSlider, type InputSliderProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription, StoryDemoItem } from '../../stories/StoryContainers';

export const InputSliderMarksTemplate = (args: InputSliderProps) => (
  <StoryDemoContainer $direction="column" $gap="24px">
    <StoryDemoDescription>
      Marks задаёт допустимые значения поля и слайдера. Во время ввода ползунок показывает ближайшую отметку; на blur
      число в поле и исходное значение приводятся к ней. При равном расстоянии выбирается большая отметка. Пустое поле
      остаётся пустым, ползунок сохраняет позицию. До нормализации число вне отметок блокирует submit. Подписи можно
      форматировать независимо; на них можно нажимать.
    </StoryDemoDescription>
    <StoryDemoItem>
      <InputSlider
        {...args}
        min={0}
        max={150}
        marks={[0, 50, 100, 150]}
        defaultValue="50"
        inputProps={{ ...args.inputProps, 'aria-label': 'Сумма вклада', suffix: '₽' }}
        sliderProps={{ renderMarks: (value) => `${value} ₽`, renderValue: (value) => `${value} ₽` }}
      />
    </StoryDemoItem>
  </StoryDemoContainer>
);
