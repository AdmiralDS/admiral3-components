import { ServiceShareOutline } from '@admiral-ds/admiral3-icons';

import { Button, withTooltip, type ButtonProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer } from '../../stories/StoryContainers';

const ButtonWithTooltip = withTooltip(Button);

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
      <ButtonWithTooltip {...args} square aria-label="Share" renderContent={() => 'Open sharing options'}>
        <ServiceShareOutline />
      </ButtonWithTooltip>
    </StoryDemoContainer>
  );
};
