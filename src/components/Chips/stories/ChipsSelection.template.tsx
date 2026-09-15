import { useState } from 'react';

import { Chips, type ChipsProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

export const ChipsSelectionTemplate = (args: ChipsProps) => {
  const [selected, setSelected] = useState(false);
  return (
    <StoryDemoContainer $withBackground={false} $direction="column" $gap="16px">
      <StoryDemoDescription>Нажмите на Chips, чтобы изменить выбранное состояние.</StoryDemoDescription>
      <Chips
        {...args}
        selected={selected}
        onClick={!args.disabled && !args.readOnly ? () => setSelected((value) => !value) : undefined}
      >
        Только избранное
      </Chips>
      <StoryDemoDescription>{selected ? 'Фильтр включён' : 'Фильтр выключен'}</StoryDemoDescription>
    </StoryDemoContainer>
  );
};
