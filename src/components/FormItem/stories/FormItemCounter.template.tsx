import { useState } from 'react';

import { FormItem, Input, type FormItemProps } from '@admiral-ds/admiral3-components';

import { hasSlotContent } from '../../../utils/hasSlotContent';
import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

export const FormItemCounterTemplate = (args: FormItemProps) => {
  const hasDescription = hasSlotContent(args.description);
  const [value, setValue] = useState('Пример названия №1');

  return (
    <StoryDemoContainer $direction="column" $gap="24px">
      <StoryDemoDescription>
        <code>maxLength</code> включает счётчик символов и передаёт ограничение вложенному Input.{' '}
        <code>counterThreshold</code> задаёт порог появления счётчика от 0 до 1 и по умолчанию равен 0.8.
      </StoryDemoDescription>
      <FormItem
        {...args}
        htmlFor="form-item-counter-input"
        description={hasDescription ? <span id="form-item-counter-description">{args.description}</span> : undefined}
      >
        <Input
          id="form-item-counter-input"
          aria-label={hasSlotContent(args.label) ? undefined : 'Название'}
          aria-describedby={hasDescription ? 'form-item-counter-description' : undefined}
          showClearIcon
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      </FormItem>
    </StoryDemoContainer>
  );
};
