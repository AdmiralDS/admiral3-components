import { Input, type InputProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription, StoryDemoItem } from '../../stories/StoryContainers';

export const InputAffixesTemplate = ({ prefix, suffix, ...args }: InputProps) => {
  return (
    <StoryDemoContainer $direction="column" $gap="16px">
      <StoryDemoDescription>
        Компонент для ввода текста с префиксом или суффиксом для контекстного отображения типа вводимой информации.
        Можно одновременно включать и префикс и суффикс.
      </StoryDemoDescription>
      <StoryDemoDescription>
        При изменении ширины компонента – меняется ширина части для ввода текста. Размеры полей Prefix и Suffix зависят
        от количества знаков в этих полях.
      </StoryDemoDescription>
      <StoryDemoDescription>
        Опционально можно отключать дивайдеры (Divider) в определенных сценариях.
      </StoryDemoDescription>
      <StoryDemoItem>
        <StoryDemoDescription>Prefix</StoryDemoDescription>
        <Input {...args} aria-label="Поле с префиксом" prefix={prefix} />
      </StoryDemoItem>
      <StoryDemoItem>
        <StoryDemoDescription>Suffix</StoryDemoDescription>
        <Input {...args} aria-label="Поле с суффиксом" suffix={suffix} />
      </StoryDemoItem>
      <StoryDemoItem>
        <StoryDemoDescription>Prefix и suffix</StoryDemoDescription>
        <Input {...args} aria-label="Поле с префиксом и суффиксом" prefix={prefix} suffix={suffix} />
      </StoryDemoItem>
    </StoryDemoContainer>
  );
};
