import styled from 'styled-components';

import { Badge, type BadgeProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer } from '../../stories/StoryContainers';
import { BADGE_DIMENSIONS } from '../constants';

const BadgeList = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const BadgeSizesTemplate = (args: BadgeProps) => {
  return (
    <StoryDemoContainer>
      <BadgeList>
        {BADGE_DIMENSIONS.map((dimension) => (
          <Badge key={dimension} {...args} dimension={dimension} />
        ))}
      </BadgeList>
    </StoryDemoContainer>
  );
};
