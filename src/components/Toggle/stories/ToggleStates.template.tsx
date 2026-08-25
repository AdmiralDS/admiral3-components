import { Toggle } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer } from '../../stories/StoryContainers';

export const ToggleStatesTemplate = () => (
  <StoryDemoContainer $direction="column" $gap="16px">
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
  </StoryDemoContainer>
);
