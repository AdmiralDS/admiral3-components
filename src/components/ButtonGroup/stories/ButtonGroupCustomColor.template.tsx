import styled from 'styled-components';

import {
  Button,
  ButtonGroup,
  type ButtonGroupAppearance,
  type ButtonGroupColorConfig,
  type ButtonGroupProps,
} from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

const Examples = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  width: max-content;
`;

const Example = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
`;

const ERROR_COLOR_CONFIGS: Record<ButtonGroupAppearance, ButtonGroupColorConfig> = {
  solid: {
    backgroundColor: {
      rest: 'var(--admiral-color-error-base-1-rest)',
      hover: 'var(--admiral-color-error-base-1-hover)',
      press: 'var(--admiral-color-error-base-1-press)',
    },
  },
  flat: {
    backgroundColor: {
      rest: 'var(--admiral-color-error-base-3-rest)',
      hover: 'var(--admiral-color-error-base-3-hover)',
      press: 'var(--admiral-color-error-base-3-press)',
    },
    textColor: 'var(--admiral-color-error-text-1-rest)',
  },
  outline: {
    borderColor: 'var(--admiral-color-error-stroke-1-rest)',
    textColor: 'var(--admiral-color-error-text-1-rest)',
  },
};

const APPEARANCES = Object.keys(ERROR_COLOR_CONFIGS) as ButtonGroupAppearance[];

export const ButtonGroupCustomColorTemplate = (args: ButtonGroupProps) => (
  <StoryDemoContainer $direction="column" $gap="24px">
    <StoryDemoDescription>
      <code>colorConfig</code> задаётся на ButtonGroup и применяется ко всем Button. Настройка цвета отдельной Button
      внутри группы игнорируется. Для пользовательских цветов необходимо самостоятельно обеспечить достаточный контраст.
    </StoryDemoDescription>
    <Examples>
      {APPEARANCES.map((appearance) => (
        <Example key={appearance}>
          <StoryDemoDescription>{appearance}</StoryDemoDescription>
          <ButtonGroup
            {...args}
            appearance={appearance}
            colorMode="colored"
            colorConfig={ERROR_COLOR_CONFIGS[appearance]}
            aria-label={`Пользовательские цвета ${appearance}`}
          >
            <Button>Первый</Button>
            <Button>Второй</Button>
            <Button>Третий</Button>
          </ButtonGroup>
        </Example>
      ))}
    </Examples>
  </StoryDemoContainer>
);
