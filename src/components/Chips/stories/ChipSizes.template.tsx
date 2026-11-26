import { Chip, type ChipBaseProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';
import { CHIPS_DIMENSIONS } from '../constants';

export const ChipSizesTemplate = (args: ChipBaseProps) => (
  <StoryDemoContainer $withBackground={false} $direction="column" $gap="16px">
    <StoryDemoDescription>
      Chip поддерживает размеры s, m и l. Размер определяет высоту, типографику, отступы и размер иконок.
    </StoryDemoDescription>
    {CHIPS_DIMENSIONS.map((dimension) => (
      <Chip key={dimension} {...args} dimension={dimension}>
        Chip {dimension.toUpperCase()}
      </Chip>
    ))}
  </StoryDemoContainer>
);
