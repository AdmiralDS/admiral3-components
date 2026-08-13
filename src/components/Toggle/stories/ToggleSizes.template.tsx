import styled from 'styled-components';

import { Toggle } from '@admiral-ds/admiral3-primitives';

const Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
`;

export const ToggleSizesTemplate = () => (
  <Column>
    <Toggle dimension="m">Size M</Toggle>
    <Toggle dimension="s">Size S</Toggle>
    <Toggle dimension="xs">Size XS</Toggle>
  </Column>
);
