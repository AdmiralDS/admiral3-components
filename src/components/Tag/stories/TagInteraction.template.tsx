import { useState } from 'react';

import styled from 'styled-components';

import { TagDot, TagTinted } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer } from '../../stories/StoryContainers';

const TruncatedTagDot = styled(TagDot)`
  max-inline-size: 200px;
`;

const TruncatedTagTinted = styled(TagTinted)`
  max-inline-size: 200px;
`;

const TagInteractionTemplate = ({ variant }: { variant: 'dot' | 'tinted' }) => {
  const [activationCount, setActivationCount] = useState(0);
  const InteractiveTag = variant === 'dot' ? TruncatedTagDot : TruncatedTagTinted;
  const PassiveTag = variant === 'dot' ? TagDot : TagTinted;

  return (
    <StoryDemoContainer $direction="column" $gap="16px" $withBackground={false}>
      <button type="button" data-testid="before-tag">
        Перед тегом
      </button>
      <InteractiveTag
        data-testid="interactive-tag"
        status="success"
        onClick={() => setActivationCount((count) => count + 1)}
      >
        Документ согласован всеми участниками рабочего процесса
      </InteractiveTag>
      <PassiveTag data-testid="passive-tag">Без действия</PassiveTag>
      <button type="button" data-testid="after-tag">
        После тега
      </button>
      <output data-testid="activation-count" aria-live="polite">
        {activationCount}
      </output>
    </StoryDemoContainer>
  );
};

export const TagDotInteractionTemplate = () => <TagInteractionTemplate variant="dot" />;

export const TagTintedInteractionTemplate = () => <TagInteractionTemplate variant="tinted" />;
