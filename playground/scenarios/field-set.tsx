import type { PlaygroundScenario } from './index';
import type { FieldSetProps } from '../../src/components/FieldSet';
import { FieldSetPlaygroundTemplate } from '../../src/components/FieldSet/stories/FieldSetPlayground.template';
import { FieldSetStatesTemplate } from '../../src/components/FieldSet/stories/FieldSetStates.template';

const defaultArgs: FieldSetProps = {
  legend: 'Данные пользователя',
};

export const fieldSetScenarios: PlaygroundScenario[] = [
  {
    id: 'field-set/default',
    title: 'Fieldset Default',
    render: () => <FieldSetPlaygroundTemplate {...defaultArgs} data-testid="fieldset" />,
  },
  {
    id: 'field-set/states',
    title: 'Fieldset States',
    render: () => <FieldSetStatesTemplate {...defaultArgs} />,
  },
];
