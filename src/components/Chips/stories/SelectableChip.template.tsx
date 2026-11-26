import { useState } from 'react';

import { SelectableChip, type SelectableChipProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

export const SelectableChipTemplate = (args: SelectableChipProps) => {
  const [selected, setSelected] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  return (
    <StoryDemoContainer $withBackground={false} $direction="column" $gap="16px">
      <StoryDemoDescription>
        SelectableChip не является контрактным компонентом дизайн-системы. Он доступен для самостоятельного
        использования, создания пользовательских групп выбора и композиции более сложных компонентов, включая
        FilterChips.
      </StoryDemoDescription>
      <StoryDemoDescription>
        Компонент используется для выбора параметра, например включения фильтра. Нажатие на Enter или Space активирует
        чипс и вызывает onSelectedChange и onClick. Для скринридера выбор обозначается атрибутом aria-pressed. При
        disabled или readOnly блокируются события onClick и onKeyDown; readOnly сохраняет чипс в порядке Tab. Иконка,
        аватар и Badge дополняют текст чипса.
      </StoryDemoDescription>
      <SelectableChip
        {...args}
        selected={selected}
        onSelectedChange={(selected) => setSelected(selected)}
        onClick={() => setClickCount((count) => count + 1)}
        data-click-count={clickCount}
      >
        Chip
      </SelectableChip>
    </StoryDemoContainer>
  );
};
