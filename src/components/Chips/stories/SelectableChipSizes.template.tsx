import { SelectableChip, type SelectableChipProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';
import { CHIPS_DIMENSIONS } from '../constants';

export const SelectableChipSizesTemplate = (args: SelectableChipProps) => (
  <StoryDemoContainer $withBackground={false} $direction="column" $gap="16px">
    <StoryDemoDescription>
      SelectableChip поддерживает три размера: s, m и l. Размер определяет высоту чипса, типографику, отступы и размер
      иконок.
    </StoryDemoDescription>
    {CHIPS_DIMENSIONS.map((dimension) => (
      <SelectableChip key={dimension} {...args} dimension={dimension}>
        Chip {dimension.toUpperCase()}
      </SelectableChip>
    ))}
  </StoryDemoContainer>
);
