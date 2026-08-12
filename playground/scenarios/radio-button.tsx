import type { RadioButtonProps } from '@admiral-ds/admiral3-primitives';

import type { PlaygroundScenario } from './index';
import { RadioButtonFieldsetTemplate } from '../../src/components/RadioButton/stories/RadioButtonFieldset.template';
import { RadioButtonFieldsetReadOnlyTemplate } from '../../src/components/RadioButton/stories/RadioButtonFieldsetReadOnly.template';
import { RadioButtonPlaygroundTemplate } from '../../src/components/RadioButton/stories/RadioButtonPlayground.template';
import { RadioButtonStatesTemplate } from '../../src/components/RadioButton/stories/RadioButtonStates.template';
import { RadioButtonTableDirtyTemplate } from '../../src/components/RadioButton/stories/RadioButtonTableDirty.template';

const playgroundArgs: RadioButtonProps = {
  children: 'RadioButton',
  name: 'default',
};

export const radioButtonScenarios: PlaygroundScenario[] = [
  {
    id: 'radio-button/default',
    title: 'RadioButton Default',
    render: () => <RadioButtonPlaygroundTemplate {...playgroundArgs} data-testid="radio-button" />,
  },
  {
    id: 'radio-button/fieldset',
    title: 'RadioButton in Fieldset',
    render: () => <RadioButtonFieldsetTemplate />,
  },
  {
    id: 'radio-button/readonly-fieldset',
    title: 'RadioButton ReadOnly Fieldset',
    render: () => <RadioButtonFieldsetReadOnlyTemplate />,
  },
  {
    id: 'radio-button/table',
    title: 'RadioButton Table',
    render: () => <RadioButtonTableDirtyTemplate />,
  },
  {
    id: 'radio-button/states',
    title: 'RadioButton States',
    render: () => <RadioButtonStatesTemplate />,
  },
];
