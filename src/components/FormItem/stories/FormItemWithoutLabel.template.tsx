import styled from 'styled-components';

import { FormItem, Input, type FormItemProps } from '@admiral-ds/admiral3-components';

import { hasSlotContent } from '../../../utils/hasSlotContent';

const NarrowFormItem = styled(FormItem)`
  width: 240px;
  max-width: 100%;
`;

export const FormItemWithoutLabelTemplate = (args: FormItemProps) => {
  const hasDescription = hasSlotContent(args.description);
  return (
    <NarrowFormItem
      {...args}
      label={undefined}
      additionalLabel={undefined}
      description={
        hasDescription ? <span id="form-item-without-label-description">{args.description}</span> : undefined
      }
    >
      <Input
        id="form-item-without-label"
        aria-label="Название"
        placeholder="Введите название"
        dimension={args.dimension}
        status={args.status}
        required={args.required}
        disabled={args.disabled}
        aria-describedby={hasDescription ? 'form-item-without-label-description' : undefined}
      />
    </NarrowFormItem>
  );
};
