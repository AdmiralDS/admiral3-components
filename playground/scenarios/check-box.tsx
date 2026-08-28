import type { CheckBoxGroupProps, CheckBoxProps } from '@admiral-ds/admiral3-components';

import type { PlaygroundScenario } from './index';
import { CheckBoxGroupReadOnlyTemplate } from '../../src/components/CheckBox/stories/CheckBoxGroupReadOnly.template';
import { CheckBoxGroupSizesTemplate } from '../../src/components/CheckBox/stories/CheckBoxGroupSizes.template';
import { CheckBoxPlaygroundTemplate } from '../../src/components/CheckBox/stories/CheckBoxPlayground.template';
import { CheckBoxStatesPlaygroundTemplate } from '../../src/components/CheckBox/stories/CheckBoxStatesPlayground.template';
import { CheckBoxTableSelectionTemplate } from '../../src/components/CheckBox/stories/CheckBoxTableSelection.template';

const defaultArgs: CheckBoxProps = {
  children: 'Подпись CheckBox',
};

const checkBoxGroupArgs: CheckBoxGroupProps = {
  defaultValue: ['notifications'],
};

export const checkBoxScenarios: PlaygroundScenario[] = [
  {
    id: 'check-box/default',
    title: 'CheckBox Default',
    render: () => <CheckBoxPlaygroundTemplate {...defaultArgs} data-testid="check-box" />,
  },
  {
    id: 'check-box-group/sizes',
    title: 'CheckBoxGroup Sizes',
    render: () => <CheckBoxGroupSizesTemplate {...checkBoxGroupArgs} />,
  },
  {
    id: 'check-box-group/readonly',
    title: 'CheckBoxGroup ReadOnly',
    render: () => <CheckBoxGroupReadOnlyTemplate {...checkBoxGroupArgs} />,
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
