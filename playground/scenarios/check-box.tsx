import type { CheckBoxProps } from '@admiral-ds/admiral3-primitives';

import { CheckBoxStatesPlaygroundTemplate } from './CheckBoxStatesPlayground.template';
import type { PlaygroundScenario } from './index';
import { CheckBoxPlaygroundTemplate } from '../../src/components/CheckBox/stories/CheckBoxPlayground.template';
import { CheckBoxTableSelectionTemplate } from '../../src/components/CheckBox/stories/CheckBoxTableSelection.template';

const defaultArgs: CheckBoxProps = {
  children: 'Подпись CheckBox',
};

export const checkBoxScenarios: PlaygroundScenario[] = [
  {
    id: 'check-box/default',
    title: 'CheckBox Default',
    render: () => <CheckBoxPlaygroundTemplate {...defaultArgs} data-testid="check-box" />,
  },
  {
    id: 'check-box/states',
    title: 'CheckBox States',
    render: () => <CheckBoxStatesPlaygroundTemplate {...defaultArgs} />,
  },
  {
    id: 'check-box/table-selection',
    title: 'CheckBox Table Selection',
    render: () => <CheckBoxTableSelectionTemplate />,
  },
];
