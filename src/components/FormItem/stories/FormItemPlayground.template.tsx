import { useId } from 'react';

import { FormItem, Input, type FormItemProps } from '@admiral-ds/admiral3-components';

import { hasSlotContent } from '../../../utils/hasSlotContent';

export const FormItemPlaygroundTemplate = (args: FormItemProps) => {
  const id = useId();
  const descriptionId = `${id}-description`;
  const hasDescription = hasSlotContent(args.description);
  return (
    <FormItem
      {...args}
      htmlFor={id}
      description={hasDescription ? <span id={descriptionId}>{args.description}</span> : undefined}
    >
      <Input
        id={id}
        aria-label={hasSlotContent(args.label) ? undefined : 'Название'}
        placeholder="Введите значение"
        aria-describedby={hasDescription ? descriptionId : undefined}
      />
    </FormItem>
  );
};
