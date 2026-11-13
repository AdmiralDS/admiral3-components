import { forwardRef, type ComponentPropsWithoutRef } from 'react';

import { withHint, type WithHintProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

const FunctionalButton = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<'button'>>(
  ({ children, type = 'button', ...props }, ref) => (
    <button ref={ref} type={type} {...props}>
      {children}
    </button>
  ),
);
const FunctionalButtonWithHint = withHint(FunctionalButton);

export const WithHintFunctionalComponentTemplate = (props: WithHintProps) => (
  <StoryDemoContainer $direction="column" $gap="24px">
    <StoryDemoDescription>
      Функциональный компонент объявлен через <code>forwardRef</code> и назначает полученный ref корневому
      HTML-элементу. Он используется для обработки событий и позиционирования Hint.
    </StoryDemoDescription>
    <FunctionalButtonWithHint {...props}>Функциональный компонент</FunctionalButtonWithHint>
  </StoryDemoContainer>
);
