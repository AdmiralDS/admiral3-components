import { useState } from 'react';

import { ServiceCloseOutline } from '@admiral-ds/admiral3-icons';
import { textStyles } from '@admiral-ds/admiral3-tokens';
import styled from 'styled-components';

import { StoryDemoContainer } from '../../../stories/StoryContainers';
import { IconPlacement } from '../IconPlacement';
import type { IconPlacementProps } from '../types';

const ClickCount = styled.span`
  ${textStyles.body.body2Long}
  color: var(--admiral-color-neutral-text-1-rest);
`;

export const IconPlacementClickTemplate = (args: IconPlacementProps) => {
  const [clickCount, setClickCount] = useState(0);

  return (
    <StoryDemoContainer $gap="16px">
      <IconPlacement {...args} aria-label="Увеличить счётчик" onClick={() => setClickCount((count) => count + 1)}>
        <ServiceCloseOutline />
      </IconPlacement>
      <ClickCount>Количество нажатий: {clickCount}</ClickCount>
    </StoryDemoContainer>
  );
};
