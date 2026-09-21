import styled, { css } from 'styled-components';

import { FormItem, Input, type FormItemProps } from '@admiral-ds/admiral3-components';

import { hasSlotContent } from '../../../utils/hasSlotContent';

const NarrowFormItem = styled(FormItem)`
  width: 240px;
  max-width: 100%;
`;

const compactText = css`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow-wrap: normal;
`;

export const FormItemLongTextTemplate = (args: FormItemProps) => {
  const hasDescription = hasSlotContent(args.description);
  return (
    <NarrowFormItem
      {...args}
      htmlFor="form-item-long-text"
      description={hasDescription ? <span id="form-item-long-description-message">{args.description}</span> : undefined}
      labelCssMixins={{
        label: css`
          ${compactText}
          flex: 0 1 65%;
        `,
        additionalLabel: css`
          ${compactText}
          flex: 0 1 35%;
        `,
        description: compactText,
      }}
      visibleLabelTooltips={{ label: true, additionalLabel: true }}
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
