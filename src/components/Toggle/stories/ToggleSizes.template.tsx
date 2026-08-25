import { Toggle } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer } from '../../stories/StoryContainers';

export const ToggleSizesTemplate = () => (
  <StoryDemoContainer $direction="column" $gap="16px">
    <Toggle dimension="m">Size M</Toggle>
    <Toggle dimension="s">Size S</Toggle>
    <Toggle dimension="xs">Size XS</Toggle>
  </StoryDemoContainer>
);
