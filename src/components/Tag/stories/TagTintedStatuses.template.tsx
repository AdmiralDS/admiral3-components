import styled from 'styled-components';

import { TagTinted, type TagTintedProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer } from '../../stories/StoryContainers';
import { TAG_STATUSES } from '../constants';

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 16px;
`;

export const TagTintedStatusesTemplate = (args: TagTintedProps) => (
  <StoryDemoContainer $withBackground={false}>
    <TagList>
      {TAG_STATUSES.map((status) => (
        <TagTinted key={status} {...args} status={status}>
          {status}
        </TagTinted>
      ))}
    </TagList>
  </StoryDemoContainer>
);
