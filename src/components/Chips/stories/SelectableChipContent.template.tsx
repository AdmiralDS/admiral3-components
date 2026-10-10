import { useState } from 'react';

import { SystemSearchOutline, DocumentsCopyOutline } from '@admiral-ds/admiral3-icons';
import styled from 'styled-components';

import { SelectableChip, type SelectableChipProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

// TODO Заменить на компонент Avatar после его реализации.
const Avatar = styled.div<{ $dimension: SelectableChipProps['dimension'] }>`
  background-color: red;
  width: ${(p) => (p.$dimension === 'l' ? '20px' : '16px')};
  height: 100%;
  border-radius: 50%;
`;

export const SelectableChipContentTemplate = (args: SelectableChipProps) => {
  const [selected, setSelected] = useState(false);

  return (
    <StoryDemoContainer $withBackground={false} $direction="column" $gap="16px">
      <StoryDemoDescription>Иконки, аватар, бейдж.</StoryDemoDescription>
      <SelectableChip
        {...args}
        iconsBefore={<SystemSearchOutline />}
        iconsAfter={<DocumentsCopyOutline />}
        avatar={<Avatar $dimension={args.dimension} />}
        badge={5}
        selected={selected}
        onSelectedChange={(selected) => setSelected(selected)}
      >
        Chip
      </SelectableChip>
    </StoryDemoContainer>
  );
};
