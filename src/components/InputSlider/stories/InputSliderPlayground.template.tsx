import { InputSlider, type InputSliderProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription, StoryDemoItem } from '../../stories/StoryContainers';

export const InputSliderPlaygroundTemplate = (args: InputSliderProps) => (
  <StoryDemoContainer $direction="column" $gap="24px">
    <StoryDemoDescription>
      Value хранит числовую строку без форматирования или пустую строку. ParseValue преобразует текст в число,
      formatValue задаёт отображение. На blur число за диапазоном приводится к min/max, а при marks — к ближайшей
      допустимой отметке. Step относится к выбору через Slider. Пустое поле сохраняет пустую строку и прежнюю позицию
      ползунка. OnValueChange получает исходную строку или пустую строку при очистке. Нативные события видимого поля
      доступны через inputProps и содержат отображаемый текст. Name и form задаются на уровне InputSlider: скрытое поле
      отправляет исходное значение без форматирования. Невалидный текст блокирует submit; прямой FormData в этом случае
      содержит пустую строку, поскольку сам не запускает проверку формы.
    </StoryDemoDescription>
    <StoryDemoItem>
      <InputSlider {...args} inputProps={{ 'aria-label': 'Сумма', ...args.inputProps }} />
    </StoryDemoItem>
  </StoryDemoContainer>
);
