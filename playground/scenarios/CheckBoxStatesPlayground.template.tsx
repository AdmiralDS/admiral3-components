import styled from 'styled-components';

import type { CheckBoxProps } from '@admiral-ds/admiral3-primitives';

import { CheckBoxStatesTemplate } from '../../src/components/CheckBox/stories/CheckBoxStates.template';

const StatesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const CheckBoxStatesPlaygroundTemplate = (args: CheckBoxProps) => (
  <StatesContainer>
    <CheckBoxStatesTemplate {...args} />
    <CheckBoxStatesTemplate {...args} extraText="Дополнительный текст" />
  </StatesContainer>
);
