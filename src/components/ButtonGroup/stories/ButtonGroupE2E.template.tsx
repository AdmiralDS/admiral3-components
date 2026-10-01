import { Button, ButtonGroup } from '@admiral-ds/admiral3-components';

import { StoryDirtyContainer } from '../../stories/StoryContainers';
import { BUTTON_GROUP_DIMENSIONS } from '../constants';

export const ButtonGroupDimensionsDirtyTemplate = () => (
  <StoryDirtyContainer>
    {BUTTON_GROUP_DIMENSIONS.map((dimension) => (
      <ButtonGroup
        key={dimension}
        dimension={dimension}
        aria-label={`Размер ${dimension}`}
        data-testid={`button-group-${dimension}`}
      >
        <Button>Первый</Button>
        <Button>Второй</Button>
        <Button>Третий</Button>
      </ButtonGroup>
    ))}
  </StoryDirtyContainer>
);

export const ButtonGroupStatesDirtyTemplate = () => (
  <StoryDirtyContainer>
    <ButtonGroup aria-label="Состояния Button" data-testid="button-group">
      <Button data-testid="button-group-default">Обычная</Button>
      <Button disabled data-testid="button-group-disabled">
        Disabled
      </Button>
      <Button inactive data-testid="button-group-inactive">
        Inactive
      </Button>
      <Button loading data-testid="button-group-loading">
        Loading
      </Button>
    </ButtonGroup>
  </StoryDirtyContainer>
);
