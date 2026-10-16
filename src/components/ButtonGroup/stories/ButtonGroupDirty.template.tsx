import { Button, ButtonGroup, type ButtonGroupProps } from '@admiral-ds/admiral3-components';

import { StoryDirtyContainer } from '../../stories/StoryContainers';

export const ButtonGroupDirtyTemplate = (args: ButtonGroupProps) => (
  <StoryDirtyContainer>
    <ButtonGroup {...args} aria-label={args['aria-label'] ?? 'Действия'} data-testid="button-group">
      <Button data-testid="button-group-first">Первый</Button>
      <Button data-testid="button-group-second">Второй</Button>
      <Button data-testid="button-group-third">Третий</Button>
    </ButtonGroup>
  </StoryDirtyContainer>
);
