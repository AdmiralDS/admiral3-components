import { useState } from 'react';

import styled from 'styled-components';

import { Chips, type ChipsProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

const array = ['Марс', 'Венера', 'Юпитер', 'Земля'];

const WrapperFilterChips = styled.div<{ $dimension: ChipsProps['dimension'] }>`
  display: flex;
  gap: ${(p) => (p.$dimension === 'l' ? '12px' : '8px')};
`;

export const ChipsRemovableTemplate = (args: ChipsProps) => {
  const [data, setData] = useState(array);

  return (
    <StoryDemoContainer $withBackground={false} $direction="column" $gap="16px">
      <StoryDemoDescription>Крестик вызывает событие onClose.</StoryDemoDescription>
      <WrapperFilterChips $dimension={args.dimension}>
        {data.map((item) => (
          <Chips
            key={item}
            {...args}
            onClose={
              !args.disabled && !args.readOnly
                ? () => setData((prevState) => prevState.filter((elem) => elem !== item))
                : undefined
            }
          >
            {item}
          </Chips>
        ))}
      </WrapperFilterChips>
    </StoryDemoContainer>
  );
};
