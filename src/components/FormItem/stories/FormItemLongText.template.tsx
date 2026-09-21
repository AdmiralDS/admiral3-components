import { textStyles } from '@admiral-ds/admiral3-tokens';
import styled, { css } from 'styled-components';

import { FormItem, Input, type FormItemProps } from '@admiral-ds/admiral3-components';

import { hasSlotContent } from '../../../utils/hasSlotContent';
import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

const NarrowFormItem = styled(FormItem)`
  width: 240px;
  max-width: 100%;
`;

const Example = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ExampleTitle = styled.h3`
  ${textStyles.subtitle.subtitle3}
  margin: 0;
  color: var(--admiral-color-neutral-text-1-rest);
`;

export const FormItemLongTextTemplate = (args: FormItemProps) => {
  const hasDescription = hasSlotContent(args.description);
  return (
    <StoryDemoContainer $direction="column" $gap="24px">
      <StoryDemoDescription>
        По умолчанию длинные подписи переносятся на несколько строк. <code>labelCssMixins</code> позволяет изменить
        распределение ширины между основной и дополнительной подписями.
      </StoryDemoDescription>
      <Example>
        <ExampleTitle>Стандартное распределение</ExampleTitle>
        <NarrowFormItem
          {...args}
          htmlFor="form-item-long-text-default"
          description={
            hasDescription ? <span id="form-item-long-description-default">{args.description}</span> : undefined
          }
        >
          <Input
            id="form-item-long-text-default"
            dimension={args.dimension}
            status={args.status}
            required={args.required}
            disabled={args.disabled}
            aria-label={hasSlotContent(args.label) ? undefined : 'Название'}
            aria-describedby={hasDescription ? 'form-item-long-description-default' : undefined}
            defaultValue="Длинное значение поля со стандартным распределением ширины между подписями"
          />
        </NarrowFormItem>
      </Example>
      <Example>
        <ExampleTitle>Кастомное распределение</ExampleTitle>
        <NarrowFormItem
          {...args}
          htmlFor="form-item-long-text-custom"
          description={
            hasDescription ? <span id="form-item-long-description-custom">{args.description}</span> : undefined
          }
          labelCssMixins={{
            label: css`
              flex: 0 1 65%;
            `,
            additionalLabel: css`
              flex: 0 1 35%;
            `,
          }}
        >
          <Input
            id="form-item-long-text-custom"
            dimension={args.dimension}
            status={args.status}
            required={args.required}
            disabled={args.disabled}
            aria-label={hasSlotContent(args.label) ? undefined : 'Название'}
            aria-describedby={hasDescription ? 'form-item-long-description-custom' : undefined}
            defaultValue="Длинное значение поля с кастомным распределением ширины между подписями"
          />
        </NarrowFormItem>
      </Example>
    </StoryDemoContainer>
  );
};
