import styled from 'styled-components';

import { FormItem, Input } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer } from '../../stories/StoryContainers';

const NarrowFormItem = styled(FormItem)`
  width: 240px;
  max-width: 100%;
`;

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
