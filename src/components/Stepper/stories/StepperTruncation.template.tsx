import { useState } from 'react';

import styled from 'styled-components';

import { Button, Step, Stepper, type StepperProps } from '@admiral-ds/admiral3-components';

import {
  StepperDemoControls,
  StepperDemoFrame,
  StepperStoryContainer as StoryDemoContainer,
  StepperStoryDescription as StoryDemoDescription,
} from './style';

const TruncatedFrame = styled(StepperDemoFrame)<{ $wide: boolean }>`
  max-width: ${({ $wide }) => ($wide ? 768 : 208)}px;
`;

export const StepperTruncationTemplate = (args: StepperProps) => {
  const [wide, setWide] = useState(false);
  return (
    <StoryDemoContainer $direction="column" $gap="24px" $withBackground={false}>
      <StoryDemoDescription>
        <code>lineClamp</code> ограничивает описание до 1–3 строк; заголовок занимает одну строку. Tooltip раскрывает
        полный текст при переполнении, по наведению или фокусу доступного шага. <code>Escape</code> закрывает подсказку.
        Полные строки сохраняются в DOM.
      </StoryDemoDescription>
      <TruncatedFrame $wide={wide}>
        <Stepper
          {...args}
          activeStep={0}
          onStepChange={() => undefined}
          data-testid="truncated-stepper"
          aria-label="Длинный текст"
        >
          <Step
            label="Контактная информация получателя"
            description="Укажите телефон и адрес электронной почты для уведомлений о заказе."
          />
          <Step label="Доставка" description="Выберите удобный способ." />
        </Stepper>
        <StepperDemoControls>
          <Button onClick={() => setWide((value) => !value)}>Изменить ширину</Button>
        </StepperDemoControls>
      </TruncatedFrame>
    </StoryDemoContainer>
  );
};
