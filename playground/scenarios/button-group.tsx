import type { ButtonGroupProps } from '@admiral-ds/admiral3-components';

import type { PlaygroundScenario } from './index';
import { ButtonGroupDirtyTemplate } from '../../src/components/ButtonGroup/stories/ButtonGroupDirty.template';
import {
  ButtonGroupDimensionsDirtyTemplate,
  ButtonGroupStatesDirtyTemplate,
} from '../../src/components/ButtonGroup/stories/ButtonGroupE2E.template';
import { ButtonGroupKeyboardNavigationTemplate } from '../../src/components/ButtonGroup/stories/ButtonGroupKeyboardNavigation.template';

const defaultArgs: ButtonGroupProps = {
  appearance: 'solid',
  colorMode: 'colored',
  dimension: 'm',
};

const customColorConfig: ButtonGroupProps['colorConfig'] = {
  borderColor: 'var(--admiral-color-error-stroke-1-rest)',
  textColor: 'var(--admiral-color-error-text-1-rest)',
};

export const buttonGroupScenarios: PlaygroundScenario[] = [
  {
    id: 'button-group/default',
    title: 'ButtonGroup Default',
    render: () => <ButtonGroupDirtyTemplate {...defaultArgs} />,
  },
  {
    id: 'button-group/styling/outline',
    title: 'ButtonGroup Outline',
    render: () => <ButtonGroupDirtyTemplate {...defaultArgs} appearance="outline" />,
  },
  {
    id: 'button-group/styling/flat',
    title: 'ButtonGroup Flat',
    render: () => <ButtonGroupDirtyTemplate {...defaultArgs} appearance="flat" colorMode="neutral" />,
  },
  {
    id: 'button-group/styling/custom-colors',
    title: 'ButtonGroup Custom Colors',
    render: () => <ButtonGroupDirtyTemplate {...defaultArgs} appearance="outline" colorConfig={customColorConfig} />,
  },
  {
    id: 'button-group/styling/dimensions',
    title: 'ButtonGroup Dimensions',
    render: () => <ButtonGroupDimensionsDirtyTemplate />,
  },
  {
    id: 'button-group/states',
    title: 'ButtonGroup States',
    render: () => <ButtonGroupStatesDirtyTemplate />,
  },
  {
    id: 'button-group/keyboard-navigation',
    title: 'ButtonGroup Keyboard Navigation',
    render: () => <ButtonGroupKeyboardNavigationTemplate {...defaultArgs} />,
  },
];
