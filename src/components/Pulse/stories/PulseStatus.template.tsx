import styled from 'styled-components';

import { Pulse, type PulseProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';
import { PULSE_STATUSES } from '../constants';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
`;

export const PulseStatusTemplate = (props: PulseProps) => {
  return (
    <StoryDemoContainer $gap="16px" $direction="column">
      <StoryDemoDescription>
        Доступны четыре статуса: info (по умолчанию), error, success и warning. Пользовательский цвет задаётся через
        объект со свойством <code>backgroundColor</code>.
      </StoryDemoDescription>
      <Wrapper>
        {PULSE_STATUSES.map((status) => (
          <Pulse {...props} status={status} key={status} />
        ))}
        <Pulse {...props} status={{ backgroundColor: '#8A3FFC' }} />
      </Wrapper>
    </StoryDemoContainer>
  );
};
