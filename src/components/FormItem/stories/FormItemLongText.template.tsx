import styled from 'styled-components';

import { FormItem, Input, type FormItemProps } from '@admiral-ds/admiral3-components';

import { hasSlotContent } from '../../../utils/hasSlotContent';

const NarrowFormItem = styled(FormItem)`
  width: 240px;
  max-width: 100%;
`;

export const FormItemLongTextTemplate = (args: FormItemProps) => {
  const hasDescription = hasSlotContent(args.description);
  return (
    <NarrowFormItem
      {...args}
      htmlFor="form-item-long-text"
      description={hasDescription ? <span id="form-item-long-description-message">{args.description}</span> : undefined}
    >
      <Input
        id="form-item-long-text"
        dimension={args.dimension}
        status={args.status}
        required={args.required}
        disabled={args.disabled}
        aria-label={hasSlotContent(args.label) ? undefined : 'Название'}
        aria-describedby={hasDescription ? 'form-item-long-description-message' : undefined}
        defaultValue="Очень длинное значение поля, которое целиком не помещается в доступную ширину"
      />
    </NarrowFormItem>
  );
};
