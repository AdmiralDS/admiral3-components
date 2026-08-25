import type { SpinnerProps } from '@admiral-ds/admiral3-components';

import type { PlaygroundScenario } from './index';
import { SpinnerCustomColorsTemplate } from '../../src/components/Spinner/stories/SpinnerCustomColor.template';
import { SpinnerPlaygroundTemplate } from '../../src/components/Spinner/stories/SpinnerPlayground.template';

const defaultArgs: SpinnerProps = {
  appearance: 'colored',
  dimension: 'm',
};

export const spinnerScenarios: PlaygroundScenario[] = [
  {
    id: 'spinner/neutral',
    title: 'Spinner Neutral',
    render: () => <SpinnerPlaygroundTemplate appearance="neutral" dimension="s" data-testid="spinner" />,
  },
  {
    id: 'spinner/custom-colors',
    title: 'Spinner Custom Colors',
    render: () => <SpinnerCustomColorsTemplate {...defaultArgs} data-testid="spinner" />,
  },
];
