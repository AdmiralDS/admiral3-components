import {
  StepperProgress,
  type StepperProgressLocale,
  type StepperProgressProps,
} from '@admiral-ds/admiral3-components';

import { DemoContainer, DemoExamples, DemoFrame } from './style';
import { StoryDemoDescription } from '../../stories/StoryContainers';

const englishLocale: StepperProgressLocale = {
  progressText: (current, total) => `Step ${current} of ${total}`,
  percentageText: (percentage) => new Intl.NumberFormat('en', { style: 'percent' }).format(percentage / 100),
  renderNextStepName: (name) => `Next — ${name}`,
  valueText: (current, total) => `Step ${current} of ${total}`,
  stepLabel: (current) => `Step ${current}`,
};

export const StepperProgressLocalizationTemplate = (args: StepperProgressProps) => (
  <DemoContainer $direction="column" $gap="24px" $withBackground={false}>
    <StoryDemoDescription>
      Форматтеры меняют видимые и доступные подписи. Регистр названий сохраняется.
    </StoryDemoDescription>
    <DemoFrame>
      <DemoExamples>
        <StepperProgress
          {...args}
          steps={['API configuration', 'Verify ID', 'Submit application']}
          activeStep={0}
          progressLocale={englishLocale}
          lang="en"
        />
        {[1, 2, 5, 11, 21, 22, 25].map((count) => (
          <StepperProgress
            {...args}
            key={count}
            activeStep={0}
            progressFormat="steps"
            progressLocale={undefined}
            steps={Array.from({ length: count }, (_, index) => `Проверка ФИО, этап ${index + 1}`)}
          />
        ))}
      </DemoExamples>
    </DemoFrame>
  </DemoContainer>
);
