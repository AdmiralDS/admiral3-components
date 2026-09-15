import { Input, type InputProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription, StoryDemoItem } from '../../stories/StoryContainers';

export const InputAffixesAccessibilityTemplate = (args: InputProps) => (
  <StoryDemoContainer $direction="column" $gap="16px">
    <StoryDemoDescription>
      Значимую единицу измерения необходимо явно связать с нативным полем через id и aria-describedby. Если аффикс
      используется только для оформления и не добавляет смысла, скройте его от скринридера с помощью aria-hidden.
    </StoryDemoDescription>
    <StoryDemoItem>
      <StoryDemoDescription>Значимый suffix «кг» входит в доступное описание поля</StoryDemoDescription>
      <Input {...args} aria-describedby="weight-unit" aria-label="Вес" suffix={<span id="weight-unit">кг</span>} />
    </StoryDemoItem>
    <StoryDemoItem>
      <StoryDemoDescription>Декоративный suffix исключён из accessibility tree</StoryDemoDescription>
      <Input {...args} aria-label="Приблизительное значение" suffix={<span aria-hidden="true">≈</span>} />
    </StoryDemoItem>
  </StoryDemoContainer>
);
