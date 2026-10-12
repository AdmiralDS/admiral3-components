import { forwardRef, type ComponentPropsWithoutRef } from 'react';

import { withTooltip, type WithTooltipProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

const FunctionalButton = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<'button'>>(
  ({ children, type = 'button', ...props }, ref) => (
    <button ref={ref} type={type} {...props}>
      {children}
    </button>
  ),
);

const FunctionalButtonWithTooltip = withTooltip(FunctionalButton);

export const WithTooltipFunctionalComponentTemplate = (props: WithTooltipProps) => (
  <StoryDemoContainer $direction="column" $gap="24px">
    <StoryDemoDescription>
      Оборачиваемый функциональный компонент должен быть объявлен через <code>forwardRef</code> и обязательно назначать
      полученный <code>ref</code> своему корневому HTML-элементу. Этот элемент используется для обработки событий и
      позиционирования Tooltip.
    </StoryDemoDescription>
    <FunctionalButtonWithTooltip
      {...props}
      renderContent={() => 'Пример использования withTooltip с функциональным компонентом.'}
    >
      Функциональный компонент
    </FunctionalButtonWithTooltip>
  </StoryDemoContainer>
);
