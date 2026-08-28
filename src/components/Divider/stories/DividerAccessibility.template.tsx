import { StoryDemoContainer, StoryDemoDescription } from '#src/components/stories/StoryContainers';

import { Divider } from '@admiral-ds/admiral3-components';

export const DividerAccessibilityTemplate = () => {
  return (
    <StoryDemoContainer $gap="16px" $direction="column">
      <StoryDemoDescription>
        По умолчанию Divider имеет роль separator и передаёт скринридеру свою ориентацию.
      </StoryDemoDescription>
      <Divider />
      <StoryDemoDescription>
        Если Divider используется только для оформления, укажите decorative, чтобы убрать семантику разделителя.
      </StoryDemoDescription>
      <Divider decorative />
    </StoryDemoContainer>
  );
};
