import styled from 'styled-components';

import { FormItem, Input } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer } from '../../stories/StoryContainers';

const LabelLeftFormItem = styled(FormItem)`
  width: 480px;
  max-width: 100%;
`;

const CustomLabelLeftFormItem = styled(LabelLeftFormItem)`
  &&[data-label-position='left'] {
    grid-template-columns: 120px minmax(0, 1fr);
    column-gap: 24px;
  }
`;

export const FormItemLabelLeftTemplate = () => (
  <StoryDemoContainer $direction="column" $gap="24px">
    <LabelLeftFormItem
      labelPosition="left"
      label="Название"
      additionalLabel="Необязательно"
      description={<span id="form-item-label-left-description">Дополнительный текст</span>}
      htmlFor="form-item-label-left-input"
      maxLength={20}
      counterThreshold={0}
    >
      <Input
        id="form-item-label-left-input"
        aria-describedby="form-item-label-left-description"
        defaultValue="Пример"
        placeholder="Введите название"
      />
    </LabelLeftFormItem>
    <LabelLeftFormItem labelPosition="left" dimension="xs" label="Код" htmlFor="form-item-label-left-xs-input">
      <Input id="form-item-label-left-xs-input" placeholder="Введите код" />
    </LabelLeftFormItem>
    <CustomLabelLeftFormItem
      labelPosition="left"
      label="Подпись шириной 120px"
      htmlFor="form-item-label-left-custom-input"
    >
      <Input id="form-item-label-left-custom-input" placeholder="Расстояние до подписи 24px" />
    </CustomLabelLeftFormItem>
  </StoryDemoContainer>
);
