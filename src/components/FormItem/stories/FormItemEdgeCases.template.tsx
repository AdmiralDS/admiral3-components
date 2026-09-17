import styled from 'styled-components';

import { FormItem, Input } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer } from '../../stories/StoryContainers';

const NarrowFormItem = styled(FormItem)`
  width: 240px;
  max-width: 100%;
`;

export const FormItemLongTextTemplate = () => (
  <StoryDemoContainer $direction="column" $gap="16px">
    <NarrowFormItem
      label="ОченьДлинноеНазваниеПоляБезПробеловОченьДлинноеНазваниеПоляБезПробелов"
      additionalLabel="Дополнение"
      htmlFor="form-item-long-label"
    >
      <Input id="form-item-long-label" />
    </NarrowFormItem>
    <NarrowFormItem
      label="Название"
      additionalLabel="ОченьДлиннаяДополнительнаяПодписьБезПробелов"
      htmlFor="form-item-long-additional-label"
    >
      <Input id="form-item-long-additional-label" />
    </NarrowFormItem>
    <NarrowFormItem
      label="Название"
      htmlFor="form-item-long-description"
      description={
        <span id="form-item-long-description-message">
          https://example.org/very-long-address-without-spaces/very-long-address-without-spaces
        </span>
      }
      counter="16 / 20"
    >
      <Input id="form-item-long-description" aria-describedby="form-item-long-description-message" />
    </NarrowFormItem>
  </StoryDemoContainer>
);

export const FormItemWithoutLabelTemplate = () => (
  <NarrowFormItem description={<span id="form-item-without-label-description">Пояснение</span>} required>
    <Input
      id="form-item-without-label"
      aria-label="Название"
      aria-describedby="form-item-without-label-description"
      required
    />
  </NarrowFormItem>
);

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
