import { Input, type InputProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription, StoryDemoItem } from '../../stories/StoryContainers';

export const InputClearIconTemplate = (args: InputProps) => (
  <StoryDemoContainer $direction="column" $gap="16px">
    <StoryDemoDescription>
      Иконка очистки поля является опциональной. В случае её применения она появляется при наличии хотя бы одного знака,
      введённого пользователем. Если поле не заполнено или все знаки удалены, то иконка очистки не видна. Обработчик
      onClear вызывается после очистки, а clearButtonProps позволяет локализовать доступное имя и передать безопасные
      атрибуты кнопки.
    </StoryDemoDescription>
    <StoryDemoItem>
      <Input {...args} clearButtonProps={{ 'aria-label': 'Очистить значение поля' }} />
    </StoryDemoItem>
  </StoryDemoContainer>
);
