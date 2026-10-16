import { useState } from 'react';

import { SliderRange, type SliderRangeProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription, StoryDemoItem } from '../../stories/StoryContainers';

export const SliderRangeStoryControlledTemplate = (args: SliderRangeProps) => {
  const [value, setValue] = useState<[number, number]>([25, 75]);
  return (
    <StoryDemoContainer $direction="column">
      <StoryDemoDescription>В controlled-режиме выбранным интервалом управляет внешний компонент.</StoryDemoDescription>
      <StoryDemoItem>
        <SliderRange {...args} value={value} onChange={setValue} />
        <StoryDemoDescription>
          Выбрано: {value[0]} — {value[1]}
        </StoryDemoDescription>
      </StoryDemoItem>
    </StoryDemoContainer>
  );
};
