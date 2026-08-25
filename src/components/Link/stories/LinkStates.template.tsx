import styled from 'styled-components';

import { Link, type LinkProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

const State = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  align-self: flex-start;
`;

export const LinkStatesTemplate = (args: LinkProps) => (
  <StoryDemoContainer $gap="16px" $direction="column">
    <State>
      <Link {...args}>Link</Link>
      <StoryDemoDescription>Default</StoryDemoDescription>
    </State>
    <State>
      <Link {...args} disabled>
        Link
      </Link>
      <StoryDemoDescription>Disabled</StoryDemoDescription>
    </State>
  </StoryDemoContainer>
);
