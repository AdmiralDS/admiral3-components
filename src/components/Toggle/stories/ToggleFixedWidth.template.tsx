import { Toggle } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer } from '../../stories/StoryContainers';

export const ToggleFixedWidthTemplate = () => (
  <StoryDemoContainer $direction="column" $gap="16px">
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
  </StoryDemoContainer>
);
