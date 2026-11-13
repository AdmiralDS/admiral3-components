import { Button, type StepperProps } from '@admiral-ds/admiral3-components';

import type { PlaygroundScenario } from './index';
import { StepperDescriptionOnlyTemplate } from '../../src/components/Stepper/stories/StepperDescriptionOnly.template';
import { StepperDirtyTemplate } from '../../src/components/Stepper/stories/StepperDirty.template';
import { StepperFormTemplate } from '../../src/components/Stepper/stories/StepperForm.template';
import { StepperInactiveTemplate } from '../../src/components/Stepper/stories/StepperInactive.template';
import { StepperMobileTemplate } from '../../src/components/Stepper/stories/StepperMobile.template';
import { StepperNavigationTemplate } from '../../src/components/Stepper/stories/StepperNavigation.template';
import { StepperPlaygroundTemplate } from '../../src/components/Stepper/stories/StepperPlayground.template';
import { StepperTruncationTemplate } from '../../src/components/Stepper/stories/StepperTruncation.template';

const renderNavigation = (args: StepperProps) => (
  <>
    <Button data-testid="before-stepper">Перед Stepper</Button>
    <StepperNavigationTemplate {...args} />
    <Button data-testid="after-stepper">После Stepper</Button>
  </>
);

export const stepperScenarios: PlaygroundScenario[] = [
  {
    id: 'stepper/description-only',
    title: 'Stepper / Description without heading',
    render: () => (
      <StepperDescriptionOnlyTemplate activeStep={1} stepWidth={80} lineClamp={1} data-testid="description-stepper" />
    ),
  },
  {
    id: 'stepper/default',
    title: 'Stepper / Static',
    render: () => <StepperInactiveTemplate activeStep={1} data-testid="stepper" />,
  },
  {
    id: 'stepper/active',
    title: 'Stepper / Active',
    render: () => <StepperPlaygroundTemplate activeStep={1} data-testid="stepper" />,
  },
  {
    id: 'stepper/navigation',
    title: 'Stepper / Navigation',
    render: () => renderNavigation({ activeStep: 2 }),
  },
  {
    id: 'stepper/vertical',
    title: 'Stepper / Vertical navigation',
    render: () => renderNavigation({ activeStep: 2, orientation: 'vertical' }),
  },
  { id: 'stepper/mobile', title: 'Stepper / Mobile', render: () => <StepperMobileTemplate activeStep={0} /> },
  {
    id: 'stepper/truncation',
    title: 'Stepper / Truncation',
    render: () => <StepperTruncationTemplate activeStep={0} />,
  },
  { id: 'stepper/form', title: 'Stepper / Form focus', render: () => <StepperFormTemplate activeStep={0} /> },
  { id: 'stepper/runtime', title: 'Stepper / Runtime changes', render: () => <StepperDirtyTemplate activeStep={1} /> },
];
