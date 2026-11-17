import { InputSliderRange, type InputSliderRangeProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription, StoryDemoItem } from '../../stories/StoryContainers';

export const InputSliderRangePlaygroundTemplate = (args: InputSliderRangeProps) => (
  <StoryDemoContainer $direction="column" $gap="24px">
    <StoryDemoDescription>
      <code>value</code> хранит пару числовых строк без форматирования. FormatValue и parseValue связывают их с текстом
      двух полей одинаковой ширины. Валидный ввод сразу обновляет ползунок. На blur число приводится к min/max и
      соседней границе с учётом minValueDistance. Step задаёт шаг слайдера; ручной ввод сохраняет точность.
    </StoryDemoDescription>
    <StoryDemoDescription>
      По умолчанию minValueDistance равен step, значение 0 разрешает совпадение границ. Во время drag зазор не
      ограничивается. При пересечении ползунки меняют роли; при отпускании нижний отступает влево, верхний вправо, если
      зазор слишком мал. Сосед обычно остаётся на месте; если у края активному ползунку не хватает места, сдвигается
      сосед. SliderProps.allowSwap=false запрещает обмен.
    </StoryDemoDescription>
    <StoryDemoDescription>
      Стрелки меняют значение на step, Home и End выбирают допустимые края с учётом соседа и зазора сразу. Обмена с
      клавиатуры нет. Tab и Shift+Tab сохраняют порядок DOM-ползунков: после обмена первым может оказаться верхний.
      Основной ref относится к div; lowerNativeInputRef и upperNativeInputRef — к полям, lowerNativeSliderRef и
      upperNativeSliderRef — к текущим логическим границам и следуют обмену ролей.
    </StoryDemoDescription>
    <StoryDemoDescription>
      LowerName и upperName задают два отдельных поля формы; onValueChange передаёт пару исходных строк. События в
      lowerInputProps и upperInputProps содержат отображаемый текст. Невалидный ввод блокирует submit; прямой FormData
      содержит для него пустую строку. Очистка сохраняет пустое значение и последнюю позицию ползунка; required делает
      обязательными оба поля. Для выбора без полей используйте{' '}
      <a href="./?path=/docs/components-sliderrange--docs" target="_top">
        SliderRange
      </a>
      .
    </StoryDemoDescription>
    <StoryDemoItem>
      <InputSliderRange
        {...args}
        lowerInputProps={{ prefix: 'От', 'aria-label': 'От', ...args.lowerInputProps }}
        upperInputProps={{ prefix: 'До', 'aria-label': 'До', ...args.upperInputProps }}
      />
    </StoryDemoItem>
  </StoryDemoContainer>
);
