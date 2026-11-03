import { Button, Pill, type PillProps } from '@admiral-ds/admiral3-components';

import { PillsTruncatedTextTemplate } from './PillsTruncatedText.template';
import { StoryDemoContainer, StoryDirtyContainer } from '../../stories/StoryContainers';
import { PILLS_APPEARANCES } from '../constants';

export const PillsDirtyTemplate = (args: PillProps) => {
  return (
    <StoryDirtyContainer>
      {PILLS_APPEARANCES.map((appearance) => (
        <Pill key={appearance} {...args} appearance={appearance}>
          {appearance}
        </Pill>
      ))}
    </StoryDirtyContainer>
  );
};

export const PillsTruncatedTextDirtyTemplate = (args: PillProps) => (
  <StoryDemoContainer $direction="column" $gap="16px" $withBackground={false}>
    <Button appearance="flat" dimension="s" data-testid="before-truncated-pills">
      До группы
    </Button>
    <PillsTruncatedTextTemplate {...args} />
    <Button appearance="flat" dimension="s" data-testid="after-truncated-pills">
      После группы
    </Button>
  </StoryDemoContainer>
);
