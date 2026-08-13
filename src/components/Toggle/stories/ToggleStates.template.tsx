import styled from 'styled-components';

import { Toggle } from '@admiral-ds/admiral3-primitives';

const Column = styled.div`
  display: flex;
  width: 240px;
  flex-direction: column;
  align-items: stretch;
  gap: 16px;
`;

export const ToggleStatesTemplate = () => (
  <Column>
    <Toggle>Rest</Toggle>
    <Toggle defaultChecked>Active</Toggle>
    <Toggle disabled>Disabled</Toggle>
    <Toggle disabled defaultChecked>
      Disabled active
    </Toggle>
    <Toggle readOnly>Read only</Toggle>
    <Toggle readOnly defaultChecked>
      Read only active
    </Toggle>
    <Toggle labelPosition="left">Label left</Toggle>
    <Toggle extraText="Additional text">With additional text</Toggle>
  </Column>
);
