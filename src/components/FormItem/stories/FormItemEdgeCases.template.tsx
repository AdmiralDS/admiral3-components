import styled from 'styled-components';

import { FormItem, Input, type FormItemProps } from '@admiral-ds/admiral3-components';

import { hasSlotContent } from '../../../utils/hasSlotContent';
import { StoryDemoContainer } from '../../stories/StoryContainers';

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

export const FormItemDisabledStatesTemplate = () => (
  <StoryDemoContainer $direction="column" $gap="16px">
    {([undefined, 'error', 'success'] as const).map((status) => {
      const id = `form-item-disabled-${status ?? 'default'}`;
      return (
        <NarrowFormItem
          key={id}
          label="Подпись"
          additionalLabel="Дополнение"
          htmlFor={id}
          description={<span id={`${id}-description`}>Пояснение</span>}
          counter="16 / 20"
          status={status}
          disabled
          required
        >
          <Input id={id} aria-describedby={`${id}-description`} status={status} disabled required />
        </NarrowFormItem>
      );
    })}
  </StoryDemoContainer>
);
