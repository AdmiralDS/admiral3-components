import { ServiceCheckOutline, SystemSearchOutline } from '@admiral-ds/admiral3-icons';
import styled from 'styled-components';

import { Chips, type ChipsProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

const Avatar = styled.div`
  background-color: red;
  width: 100%;
  height: 100%;
  border-radius: 50%;
`;

export const ChipsContentTemplate = (args: ChipsProps) => (
  <StoryDemoContainer $withBackground={false} $direction="column" $gap="16px">
    <StoryDemoDescription>Иконки, аватар, бейдж.</StoryDemoDescription>
    <Chips {...args} badge={5} iconBefore={<SystemSearchOutline />} avatar={<Avatar />} onClose={() => null} />
    <Chips
      {...args}
      badge={5}
      iconBefore={<SystemSearchOutline />}
      avatar={<Avatar />}
      iconAfter={<ServiceCheckOutline />}
    />
  </StoryDemoContainer>
);
