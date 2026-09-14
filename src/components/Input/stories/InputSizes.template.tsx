import { Input, type InputProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription, StoryDemoItem } from '../../stories/StoryContainers';
import { INPUT_DIMENSIONS } from '../constants';

export const InputSizesTemplate = (args: InputProps) => (
  <StoryDemoContainer $direction="column" $gap="16px">
    {INPUT_DIMENSIONS.map((dimension) => (
      <StoryDemoItem key={dimension}>
        <StoryDemoDescription>Размер {dimension.toUpperCase()}</StoryDemoDescription>
        <Input {...args} dimension={dimension} />
      </StoryDemoItem>
    ))}
  </StoryDemoContainer>
);
