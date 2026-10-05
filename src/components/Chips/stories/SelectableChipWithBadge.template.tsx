import { useState } from 'react';

import { SelectableChip, type SelectableChipProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

export const SelectableChipWithBadgeTemplate = (args: SelectableChipProps) => {
  const [selected, setSelected] = useState(false);

  return (
    <StoryDemoContainer $withBackground={false} $direction="column" $gap="16px">
      <StoryDemoDescription>В компоненте можно включать бейджи.</StoryDemoDescription>
      <SelectableChip {...args} selected={selected} onClick={() => setSelected((value) => !value)} badge={5}>
        Chip
      </SelectableChip>
    </StoryDemoContainer>
  );
};
