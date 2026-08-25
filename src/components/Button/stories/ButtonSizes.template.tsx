import { Button, type ButtonProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer } from '../../stories/StoryContainers';
import { BUTTON_DIMENSIONS } from '../constants';

export const ButtonSizesTemplate = (args: ButtonProps) => {
  return (
    <StoryDemoContainer $gap="16px">
      {BUTTON_DIMENSIONS.map((dimension) => (
        <Button key={dimension} {...args} dimension={dimension} />
      ))}
    </StoryDemoContainer>
  );
};
