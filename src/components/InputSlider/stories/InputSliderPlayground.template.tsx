import { InputSlider, type InputSliderProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription, StoryDemoItem } from '../../stories/StoryContainers';

export const InputSliderPlaygroundTemplate = (args: InputSliderProps) => (
  <StoryDemoContainer $direction="column" $gap="24px">
    <StoryDemoDescription>
      <code>value</code> хранит числовую строку без форматирования или пустую строку. <code>parseValue</code>
      преобразует текст в конечное число, <code>formatValue</code> задаёт отображение. Дополнение вроде «руб» может
      входить в отображаемый текст; произвольный текст без числового значения не считается допустимым. Валидный ручной
      ввод сразу обновляет положение ползунка.
    </StoryDemoDescription>
    <StoryDemoDescription>
      На blur число за диапазоном приводится к min/max, а при marks — к ближайшей допустимой отметке. Step задаёт шаг
      выбора через Slider, ручной ввод сохраняет точность. Пустое поле хранит пустую строку, ползунок сохраняет прежнюю
      позицию. Required запрещает отправку пустого поля.
    </StoryDemoDescription>
    <StoryDemoDescription>
      Стрелки изменяют значение ползунка на step, а при marks выбирают соседнюю отметку. Home и End выбирают крайние
      допустимые значения; Tab и Shift+Tab перемещают фокус между полем и ползунком. Основной ref относится к
      div-обёртке, nativeInputRef — к текстовому полю, nativeSliderRef — к ползунку.
    </StoryDemoDescription>
    <StoryDemoDescription>
      OnValueChange передаёт исходную строку. Нативные события в inputProps содержат отображаемый текст. Name и form
      задаются на уровне InputSlider: только скрытое поле отправляет исходное значение. Невалидный текст блокирует
      submit; прямой FormData содержит для него пустую строку и сам не запускает проверку. Для выбора без ручного ввода
      используйте{' '}
      <a href="./?path=/docs/components-slider--docs" target="_top">
        Slider
      </a>
      .
    </StoryDemoDescription>
    <StoryDemoItem>
      <InputSlider {...args} inputProps={{ 'aria-label': 'Сумма', ...args.inputProps }} />
    </StoryDemoItem>
  </StoryDemoContainer>
);
