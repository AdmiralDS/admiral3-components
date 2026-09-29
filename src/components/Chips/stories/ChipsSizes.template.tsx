import { Chips, type ChipsProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';
import { CHIPS_DIMENSIONS } from '../constants';

export const ChipsSizesTemplate = (args: ChipsProps) => (
  <StoryDemoContainer $withBackground={false} $direction="column" $gap="16px">
    <StoryDemoDescription>Три размера Chips: s, m и l.</StoryDemoDescription>
    {CHIPS_DIMENSIONS.map((dimension) => (
      <Chips key={dimension} {...args} dimension={dimension}>
        Chip {dimension.toUpperCase()}
      </Chips>
    ))}
  </StoryDemoContainer>
);
