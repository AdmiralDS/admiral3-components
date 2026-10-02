import { SystemSearchOutline } from '@admiral-ds/admiral3-icons';
import styled from 'styled-components';

import { Chips, type ChipsProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

//TODO Поменять на компонент Avatar при его реализации
const Avatar = styled.div<{ $dimension: ChipsProps['dimension'] }>`
  background-color: red;
  width: ${(p) => (p.$dimension === 'l' ? '20px' : '16px')};
  height: 100%;
  border-radius: 50%;
`;

export const ChipsContentTemplate = (args: ChipsProps) => (
  <StoryDemoContainer $withBackground={false} $direction="column" $gap="16px">
    <StoryDemoDescription>Иконки, аватар, бейдж.</StoryDemoDescription>
    <Chips
      {...args}
      badge={5}
      iconsBefore={<SystemSearchOutline />}
      avatar={<Avatar $dimension={args.dimension} />}
      onClose={() => null}
    />
  </StoryDemoContainer>
);
