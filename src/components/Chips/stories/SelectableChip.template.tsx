import { useState } from 'react';

import { SelectableChip, type SelectableChipProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

export const SelectableChipTemplate = (args: SelectableChipProps) => {
  const [selected, setSelected] = useState(false);

  return (
    <StoryDemoContainer $withBackground={false} $direction="column" $gap="16px">
      <StoryDemoDescription>
        SelectableChip используется для выбора параметра, например включения фильтра. Нажатие на Enter или Space
        вызывает событие onClick. Для скринридера выбор обозначается атрибутом aria-pressed. При disabled или readOnly
        блокируются события onClick и onKeyDown; readOnly сохраняет чипс в порядке Tab. Иконка, аватар и Badge дополняют
        текст чипса.
      </StoryDemoDescription>
      <SelectableChip {...args} selected={selected} onClick={() => setSelected((value) => !value)}>
        Chip
      </SelectableChip>
    </StoryDemoContainer>
  );
};
