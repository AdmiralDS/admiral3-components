import { useState } from 'react';

import { Button, Pill, Pills, type PillProps } from '@admiral-ds/admiral3-components';

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

const SelfDisablingPill = () => {
  const [disabled, setDisabled] = useState(false);

  return (
    <Pill data-testid="pills-self-disabling" disabled={disabled} onClick={() => setDisabled(true)}>
      Отключить себя
    </Pill>
  );
};

export const PillsChildDisabledDirtyTemplate = () => (
  <StoryDemoContainer $direction="column" $gap="16px" $withBackground={false}>
    <Button data-testid="before-pills-group">До группы</Button>
    <Pills aria-label="Статусы">
      <SelfDisablingPill />
      <Pill data-testid="pills-remaining">Доступная</Pill>
    </Pills>
    <Button data-testid="after-pills-group">После группы</Button>
  </StoryDemoContainer>
);
