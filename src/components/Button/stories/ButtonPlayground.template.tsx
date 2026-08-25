import { ServiceShareOutline } from '@admiral-ds/admiral3-icons';

import { Button, type ButtonProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer } from '../../stories/StoryContainers';

export const ButtonPlaygroundTemplate = (args: ButtonProps) => {
  return (
    <StoryDemoContainer $gap="16px">
      <Button {...args} />
      <Button {...args}>
        <ServiceShareOutline />
        {args.children}
      </Button>
      <Button {...args}>
        {args.children}
        <ServiceShareOutline />
      </Button>
      <Button {...args} square>
        <ServiceShareOutline />
      </Button>
    </StoryDemoContainer>
  );
};
