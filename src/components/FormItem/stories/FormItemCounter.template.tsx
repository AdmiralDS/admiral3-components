import { useState } from 'react';

import { FormItem, Input, type FormItemProps } from '@admiral-ds/admiral3-components';

import { hasSlotContent } from '../../../utils/hasSlotContent';

export const FormItemCounterTemplate = (args: FormItemProps) => {
  const hasDescription = hasSlotContent(args.description);
  const [value, setValue] = useState('Пример названия №1');

  return (
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
  );
};
