import styled from 'styled-components';

import { Pulse, type PulseProps } from '@admiral-ds/admiral3-primitives';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';
import { PULSE_DIMENSIONS } from '../constants';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
`;

export const PulseDimensionTemplate = (props: PulseProps) => {
  return (
    <StoryDemoContainer $gap="16px" $direction="column">
      <StoryDemoDescription>Компонент представлен в трёх размерах: L, M (по умолчанию) и S.</StoryDemoDescription>
      <Wrapper>
        {PULSE_DIMENSIONS.map((dimension) => (
          <Pulse {...props} dimension={dimension} key={dimension} />
        ))}
      </Wrapper>
    </StoryDemoContainer>
  );
};
