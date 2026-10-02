import { Button, Tooltip, type TooltipProps, useTooltip } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer } from '../../stories/StoryContainers';

export const TooltipPlaygroundTemplate = (props: TooltipProps) => {
  const { targetProps, tooltipProps, isVisible } = useTooltip<HTMLButtonElement>();

  return (
    <StoryDemoContainer>
      <Button {...targetProps}>Наведи на меня</Button>
      {isVisible && <Tooltip {...props} {...tooltipProps} />}
    </StoryDemoContainer>
  );
};
