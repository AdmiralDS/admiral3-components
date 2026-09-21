import { SystemSearchOutline } from '@admiral-ds/admiral3-icons';
import styled from 'styled-components';

import { Chips, type ChipsProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

const Wrapper = styled.div`
  display: flex;
  gap: 2px;
`;

const Avatar = styled.div<{ $dimension: ChipsProps['dimension'] }>`
  background-color: red;
  width: ${(p) => (p.$dimension === 'l' ? '20px' : '16px')};
  height: ${(p) => (p.$dimension === 'l' ? '20px' : '16px')};
  border-radius: 50%;
`;

export const ChipsContentTemplate = (args: ChipsProps) => (
  <StoryDemoContainer $withBackground={false} $direction="column" $gap="16px">
    <StoryDemoDescription>Иконки, аватар, бейдж.</StoryDemoDescription>
    <Chips
      {...args}
      badge={5}
      iconsBefore={
        <Wrapper>
          <SystemSearchOutline />
          <Avatar $dimension={args.dimension} />
        </Wrapper>
      }
      onClose={() => null}
    />
  </StoryDemoContainer>
);
