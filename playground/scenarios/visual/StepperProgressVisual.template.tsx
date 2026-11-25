import styled from 'styled-components';

import { StepperProgress, type StepperProgressProps } from '@admiral-ds/admiral3-components';

import {
  VisualGroup,
  VisualGroups,
  VisualGroupTitle,
  VisualLayout,
  VisualSample,
  VisualSamples,
  VisualSection,
  VisualTitle,
} from './VisualLayout';
import {
  STEPPER_PROGRESS_COLOR_MODES,
  STEPPER_PROGRESS_FORMATS,
} from '../../../src/components/StepperProgress/constants';

const STEPS = [
  'Заполнение данных',
  'Проверка документов',
  'Подтверждение заявки',
  'Обработка заявки',
  'Договор',
  'Выдача',
];
const LONG_STEPS = [
  'Название текущего шага, которое не помещается в одну строку и переносится на следующую',
  'Название следующего шага, которое полностью переносится на несколько строк и остаётся доступным без подсказки',
  'Подписание договора после проверки документов и согласования условий',
];

const StepperProgressVisualSample = styled(VisualSample)<{ $width: number }>`
  width: ${({ $width }) => $width}px;
`;

interface VisualVariant {
  label: string;
  props: Partial<StepperProgressProps>;
  width?: number;
}

const renderMatrix = (items: VisualVariant[]) => (
  <VisualGroups>
    {items.map(({ label, props, width = 640 }) => (
      <VisualGroup key={label}>
        <VisualGroupTitle>{label}</VisualGroupTitle>
        <VisualSamples>
          <StepperProgressVisualSample $width={width}>
            <StepperProgress steps={STEPS} activeStep={2} {...props} />
          </StepperProgressVisualSample>
        </VisualSamples>
      </VisualGroup>
    ))}
  </VisualGroups>
);

export const StepperProgressVisualTemplate = () => (
  <VisualLayout>
    <VisualSection>
      <VisualTitle>Colors and formats</VisualTitle>
      {renderMatrix(
        STEPPER_PROGRESS_COLOR_MODES.flatMap((colorMode) =>
          STEPPER_PROGRESS_FORMATS.map((progressFormat) => ({
            label: `${colorMode} ${progressFormat}`,
            props: { colorMode, progressFormat },
          })),
        ),
      )}
    </VisualSection>
    <VisualSection>
      <VisualTitle>Progress and next step</VisualTitle>
      {renderMatrix([
        { label: 'first step', props: { activeStep: 0 } },
        { label: 'last step', props: { activeStep: 5, progressFormat: 'percentage' } },
        { label: 'single step', props: { steps: ['Единственный шаг'], activeStep: 0 } },
        { label: 'without next step', props: { displayNextStepName: false } },
        { label: 'minimum desktop width', props: {}, width: 388 },
      ])}
    </VisualSection>
    <VisualSection>
      <VisualTitle>Mobile</VisualTitle>
      {renderMatrix(
        [288, 320].flatMap((width) =>
          STEPPER_PROGRESS_COLOR_MODES.flatMap((colorMode) =>
            STEPPER_PROGRESS_FORMATS.map((progressFormat) => ({
              label: `${width}px ${colorMode} ${progressFormat}`,
              width,
              props: { mobile: true, colorMode, progressFormat },
            })),
          ),
        ),
      )}
      {renderMatrix([
        { label: 'mobile first step', props: { mobile: true, activeStep: 0 }, width: 288 },
        { label: 'mobile last step', props: { mobile: true, activeStep: 5 }, width: 288 },
        { label: 'mobile without next step', props: { mobile: true, displayNextStepName: false }, width: 288 },
      ])}
    </VisualSection>
    <VisualSection>
      <VisualTitle>Long labels</VisualTitle>
      {renderMatrix([
        { label: 'desktop wrapped labels', props: { steps: LONG_STEPS, activeStep: 0 } },
        {
          label: 'mobile wrapped labels',
          props: { steps: LONG_STEPS, activeStep: 1, mobile: true },
          width: 288,
        },
      ])}
    </VisualSection>
  </VisualLayout>
);
