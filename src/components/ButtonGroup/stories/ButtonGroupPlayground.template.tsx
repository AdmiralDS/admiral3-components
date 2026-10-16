import { Button, ButtonGroup, type ButtonGroupProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer } from '../../stories/StoryContainers';

export const ButtonGroupPlaygroundTemplate = (args: ButtonGroupProps) => {
  return (
    <StoryDemoContainer>
      <ButtonGroup {...args} aria-label={args['aria-label'] ?? 'Действия с документом'}>
        <Button>Сохранить</Button>
        <Button>Скопировать</Button>
        <Button>Удалить</Button>
      </ButtonGroup>
    </StoryDemoContainer>
  );
};
