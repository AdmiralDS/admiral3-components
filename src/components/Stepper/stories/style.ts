import { textStyles } from '@admiral-ds/admiral3-tokens';
import styled from 'styled-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

export const StepperStoryContainer = styled(StoryDemoContainer)`
  align-items: flex-start;
`;

export const StepperStoryDescription = styled(StoryDemoDescription)`
  width: 100%;
  max-inline-size: 800px;
`;

export const StepperDemoFrame = styled.div`
  box-sizing: border-box;
  width: 100%;
  max-width: 800px;
`;

export const StepperDemoExamples = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  width: 100%;
  max-width: 800px;
`;

export const StepperDemoControls = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 24px;
`;

export const StepperDemoHeading = styled.h2`
  ${textStyles.header.h6}
  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }
`;

export const StepperDemoField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
