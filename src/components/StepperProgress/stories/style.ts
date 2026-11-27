import { textStyles } from '@admiral-ds/admiral3-tokens';
import styled from 'styled-components';

import { StoryDemoContainer } from '../../stories/StoryContainers';

export const DemoContainer = styled(StoryDemoContainer)`
  align-items: flex-start;
`;

export const DemoFrame = styled.div<{ $width?: number; $unconstrained?: boolean }>`
  box-sizing: border-box;
  width: ${({ $width }) => ($width === undefined ? '100%' : `${$width}px`)};
  max-width: ${({ $unconstrained }) => ($unconstrained ? 'none' : '640px')};
`;

export const DemoExamples = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
`;

export const DemoControls = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 24px;
`;

export const DemoHeading = styled.h2`
  ${textStyles.header.h6}
  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }
`;

export const DemoField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
