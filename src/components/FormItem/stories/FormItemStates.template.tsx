import { FormItem, Input, type FormItemProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription, StoryDemoItem } from '../../stories/StoryContainers';

export const FormItemStatesTemplate = (args: FormItemProps) => (
  <StoryDemoContainer $direction="column" $gap="16px">
    <StoryDemoItem>
      <StoryDemoDescription>Обычное поле</StoryDemoDescription>
      <FormItem {...args} htmlFor="form-item-state-default">
        <Input id="form-item-state-default" dimension={args.dimension} placeholder="Введите значение" />
      </FormItem>
    </StoryDemoItem>
    <StoryDemoItem>
      <StoryDemoDescription>Обязательное поле</StoryDemoDescription>
      <FormItem {...args} htmlFor="form-item-state-required" required>
        <Input id="form-item-state-required" dimension={args.dimension} placeholder="Введите значение" required />
      </FormItem>
    </StoryDemoItem>
    <StoryDemoItem>
      <StoryDemoDescription>Ошибка</StoryDemoDescription>
      <FormItem
        {...args}
        htmlFor="form-item-state-error"
        status="error"
        description={<span id="form-item-state-error-message">Введите корректное значение</span>}
      >
        <Input
          id="form-item-state-error"
          dimension={args.dimension}
          status="error"
          defaultValue="Неверное значение"
          aria-invalid
          aria-describedby="form-item-state-error-message"
        />
      </FormItem>
    </StoryDemoItem>
    <StoryDemoItem>
      <StoryDemoDescription>Успешное заполнение</StoryDemoDescription>
      <FormItem
        {...args}
        htmlFor="form-item-state-success"
        status="success"
        description={<span id="form-item-state-success-message">Значение принято</span>}
      >
        <Input
          id="form-item-state-success"
          dimension={args.dimension}
          status="success"
          defaultValue="Верное значение"
          aria-describedby="form-item-state-success-message"
        />
      </FormItem>
    </StoryDemoItem>
  </StoryDemoContainer>
);
