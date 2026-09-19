import { FormItem, Input, type FormItemProps } from '@admiral-ds/admiral3-components';

import { hasSlotContent } from '../../../utils/hasSlotContent';
import { StoryDemoContainer, StoryDemoDescription, StoryDemoItem } from '../../stories/StoryContainers';

export const FormItemStatesTemplate = (args: FormItemProps) => {
  const hasDescription = hasSlotContent(args.description);
  return (
    <StoryDemoContainer $direction="column" $gap="16px">
      <StoryDemoItem>
        <StoryDemoDescription>Обычное поле</StoryDemoDescription>
        <FormItem
          {...args}
          htmlFor="form-item-state-default"
          description={
            hasDescription ? <span id="form-item-state-default-description">{args.description}</span> : undefined
          }
        >
          <Input
            id="form-item-state-default"
            placeholder="Введите значение"
            aria-describedby={hasDescription ? 'form-item-state-default-description' : undefined}
          />
        </FormItem>
      </StoryDemoItem>
      <StoryDemoItem>
        <StoryDemoDescription>Обязательное поле</StoryDemoDescription>
        <FormItem
          {...args}
          htmlFor="form-item-state-required"
          required
          description={
            hasDescription ? <span id="form-item-state-required-description">{args.description}</span> : undefined
          }
        >
          <Input
            id="form-item-state-required"
            placeholder="Введите значение"
            aria-describedby={hasDescription ? 'form-item-state-required-description' : undefined}
          />
        </FormItem>
      </StoryDemoItem>
      <StoryDemoItem>
        <StoryDemoDescription>Недоступное поле</StoryDemoDescription>
        <FormItem
          {...args}
          htmlFor="form-item-state-disabled"
          disabled
          description={
            hasDescription ? <span id="form-item-state-disabled-description">{args.description}</span> : undefined
          }
        >
          <Input
            id="form-item-state-disabled"
            placeholder="Введите значение"
            aria-describedby={hasDescription ? 'form-item-state-disabled-description' : undefined}
          />
        </FormItem>
      </StoryDemoItem>
      <StoryDemoItem>
        <StoryDemoDescription>Только чтение</StoryDemoDescription>
        <FormItem
          {...args}
          label="Номер договора"
          htmlFor="form-item-state-readonly"
          readOnly
          description={<span id="form-item-state-readonly-description">Значение можно выделить и скопировать</span>}
        >
          <Input
            id="form-item-state-readonly"
            defaultValue="ADM-2026-001"
            aria-describedby="form-item-state-readonly-description"
          />
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
            defaultValue="Неверное значение"
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
            defaultValue="Верное значение"
            aria-describedby="form-item-state-success-message"
          />
        </FormItem>
      </StoryDemoItem>
    </StoryDemoContainer>
  );
};
