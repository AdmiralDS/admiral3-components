import { RemovableChip, type RemovableChipProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';
import { CHIPS_DIMENSIONS } from '../constants';

export const RemovableChipSizesTemplate = (args: RemovableChipProps) => (
  <StoryDemoContainer $withBackground={false} $direction="column" $gap="16px">
    <StoryDemoDescription>
      RemovableChip поддерживает три размера: s, m и l. Размер определяет высоту чипса, типографику, отступы и размер
      иконок.
    </StoryDemoDescription>
    {CHIPS_DIMENSIONS.map((dimension) => (
      <RemovableChip key={dimension} {...args} dimension={dimension}>
        Chip {dimension.toUpperCase()}
      </RemovableChip>
    ))}
  </StoryDemoContainer>
);
