import { ServiceCloseOutline } from '@admiral-ds/admiral3-icons';
import styled from 'styled-components';

import { StoryDemoContainer, StoryDemoItem } from '../../../stories/StoryContainers';
import { ICON_PLACEMENT_DIMENSIONS } from '../constants';
import { IconPlacement } from '../IconPlacement';

const Sample = styled(StoryDemoItem)`
  inline-size: auto;
  align-items: center;
`;

export const IconPlacementSizesTemplate = () => (
  <StoryDemoContainer $gap="24px">
    {ICON_PLACEMENT_DIMENSIONS.map((dimension) => (
      <Sample key={dimension}>
        <IconPlacement dimension={dimension} aria-label={`Закрыть, размер ${dimension}`}>
          <ServiceCloseOutline />
        </IconPlacement>
        <span>{dimension}</span>
      </Sample>
    ))}
  </StoryDemoContainer>
);
