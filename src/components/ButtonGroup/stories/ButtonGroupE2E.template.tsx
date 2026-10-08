import { useState } from 'react';

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

const SelfDisablingButton = () => {
  const [disabled, setDisabled] = useState(false);

  return (
    <Button data-testid="button-group-self-disabling" disabled={disabled} onClick={() => setDisabled(true)}>
      Отключить себя
    </Button>
  );
};

export const ButtonGroupChildDisabledDirtyTemplate = () => (
  <StoryDirtyContainer>
    <Button data-testid="before-button-group">До группы</Button>
    <ButtonGroup aria-label="Действия">
      <SelfDisablingButton />
      <Button data-testid="button-group-remaining">Доступная</Button>
    </ButtonGroup>
    <Button data-testid="after-button-group">После группы</Button>
  </StoryDirtyContainer>
);

export const ButtonGroupCustomColorStatesDirtyTemplate = () => (
  <StoryDirtyContainer>
    <ButtonGroup
      appearance="solid"
      colorMode="colored"
      colorConfig={{
        backgroundColor: {
          rest: 'var(--admiral-color-error-base-1-rest)',
          hover: 'var(--admiral-color-error-base-1-hover)',
          press: 'var(--admiral-color-error-base-1-press)',
        },
        textColor: 'var(--admiral-color-neutral-text-static-white-1)',
      }}
      aria-label="Solid custom colors"
    >
      <Button data-testid="button-group-custom-solid-focus">Доступная</Button>
      <Button data-testid="button-group-custom-solid-disabled" disabled>
        Disabled
      </Button>
    </ButtonGroup>
    <ButtonGroup
      appearance="outline"
      colorMode="colored"
      colorConfig={{
        textColor: 'var(--admiral-color-error-text-1-rest)',
        borderColor: 'var(--admiral-color-error-stroke-1-rest)',
        focusColor: 'var(--admiral-color-success-stroke-1-rest)',
      }}
      aria-label="Outline custom colors"
    >
      <Button data-testid="button-group-custom-outline-focus">Доступная</Button>
      <Button data-testid="button-group-custom-outline-disabled" disabled>
        Disabled
      </Button>
    </ButtonGroup>
  </StoryDirtyContainer>
);
