import styled from 'styled-components';

import { StoryDemoItem } from '../../stories/StoryContainers';

export const Samples = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 32px;
  width: 100%;
`;
export const Sample = styled(StoryDemoItem)`
  min-width: 0;
  max-width: 100%;
`;
