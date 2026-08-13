import styled from 'styled-components';

import { Toggle } from '@admiral-ds/admiral3-primitives';

const Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
`;

export const ToggleFixedWidthTemplate = () => (
  <Column>
    <Toggle labelPosition="left" width={192} dimension="m">
      Toggle text
    </Toggle>
    <Toggle labelPosition="left" width={192} dimension="s">
      Toggle text
    </Toggle>
    <Toggle labelPosition="left" width={192} dimension="xs">
      Toggle text
    </Toggle>
    <Toggle labelPosition="left" width={192} dimension="m" defaultChecked extraText="Add text">
      Toggle text
    </Toggle>
    <Toggle labelPosition="left" width={192} dimension="s" defaultChecked extraText="Add text">
      Toggle text
    </Toggle>
    <Toggle labelPosition="left" width={192} dimension="xs" defaultChecked extraText="Add text">
      Toggle text
    </Toggle>
  </Column>
);
