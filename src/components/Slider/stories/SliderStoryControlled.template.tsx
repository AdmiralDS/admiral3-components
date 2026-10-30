import { useState } from 'react';

import { Slider, type SliderProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription, StoryDemoItem } from '../../stories/StoryContainers';

export const SliderStoryControlledTemplate = (args: SliderProps) => {
  const [value, setValue] = useState(50);
  return (
    <StoryDemoContainer $direction="column">
      <StoryDemoDescription>В controlled-режиме выбранным значением управляет внешний компонент.</StoryDemoDescription>
      <StoryDemoItem>
        <Slider {...args} label="Громкость" value={value} onChange={setValue} />
        <StoryDemoDescription>Выбрано: {value}</StoryDemoDescription>
      </StoryDemoItem>
    </StoryDemoContainer>
  );
};
