import type { RadioButtonProps, RadioGroupProps } from '@admiral-ds/admiral3-components';

import type { PlaygroundScenario } from './index';
import { RadioButtonPlaygroundTemplate } from '../../src/components/RadioButton/stories/RadioButtonPlayground.template';
import { RadioButtonStatesTemplate } from '../../src/components/RadioButton/stories/RadioButtonStates.template';
import { RadioButtonTableDirtyTemplate } from '../../src/components/RadioButton/stories/RadioButtonTableDirty.template';
import { RadioGroupReadOnlyTemplate } from '../../src/components/RadioButton/stories/RadioGroupReadOnly.template';
import { RadioGroupSizesTemplate } from '../../src/components/RadioButton/stories/RadioGroupSizes.template';

const playgroundArgs: RadioButtonProps = {
  children: 'RadioButton',
  name: 'default',
};

const radioGroupArgs: RadioGroupProps = {
  defaultValue: 'courier',
};

export const radioButtonScenarios: PlaygroundScenario[] = [
  {
    id: 'radio-button/default',
    title: 'RadioButton Default',
    render: () => <RadioButtonPlaygroundTemplate {...playgroundArgs} data-testid="radio-button" />,
  },
  {
    id: 'radio-group/sizes',
    title: 'RadioGroup Sizes',
    render: () => <RadioGroupSizesTemplate {...radioGroupArgs} />,
  },
  {
    id: 'radio-group/readonly',
    title: 'RadioGroup ReadOnly',
    render: () => <RadioGroupReadOnlyTemplate {...radioGroupArgs} />,
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
