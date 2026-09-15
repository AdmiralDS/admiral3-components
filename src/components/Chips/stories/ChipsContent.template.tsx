import { ServiceCheckOutline, SystemSearchOutline } from '@admiral-ds/admiral3-icons';

import { Chips, type ChipsProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

export const ChipsContentTemplate = (args: ChipsProps) => (
  <StoryDemoContainer $withBackground={false} $direction="column" $gap="16px">
    <StoryDemoDescription>Иконки, аватар, бейдж.</StoryDemoDescription>
    <Chips
      {...args}
      badge={5}
      iconStart={<SystemSearchOutline />}
      avatar={<div style={{ backgroundColor: 'red', width: '100%', height: '100%', borderRadius: '50%' }}></div>}
      onClose={() => null}
    />
    <Chips
      {...args}
      badge={5}
      iconStart={<SystemSearchOutline />}
      avatar={<div style={{ backgroundColor: 'red', width: '100%', height: '100%', borderRadius: '50%' }}></div>}
      iconEnd={<ServiceCheckOutline />}
    />
  </StoryDemoContainer>
);
