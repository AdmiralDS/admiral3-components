import { useState } from 'react';

import { Chips, type ChipsProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

export const ChipsSelectionTemplate = (args: ChipsProps) => {
  const [selected, setSelected] = useState(false);
  return (
    <StoryDemoContainer $withBackground={false} $direction="column" $gap="16px">
      <StoryDemoDescription>
        Нажмите на Chips, чтобы изменить выбранное состояние. При onClose не работает режим выбора Chips.
      </StoryDemoDescription>
      <Chips {...args} selected={selected} onClick={() => setSelected((value) => !value)}>
        Только избранное
      </Chips>
      <StoryDemoDescription>{selected ? 'Фильтр включён' : 'Фильтр выключен'}</StoryDemoDescription>
    </StoryDemoContainer>
  );
};
