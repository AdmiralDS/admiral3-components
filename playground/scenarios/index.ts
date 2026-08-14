import type { ReactElement } from 'react';

import { badgeScenarios } from './badge';
import { badgeDotScenarios } from './badge-dot';
import { buttonScenarios } from './button';
import { checkBoxScenarios } from './check-box';
import { linkScenarios } from './link';
import { listScenarios } from './list';
import { radioButtonScenarios } from './radio-button';
import { skeletonScenarios } from './skeleton';
import { spinnerScenarios } from './spinner';
import { toggleScenarios } from './toggle';
import { visualScenarios } from './visual';

export type PlaygroundScenario = {
  id: string;
  title: string;
  visual?: boolean;
  render: () => ReactElement;
};

export const playgroundScenarios = [
  ...badgeDotScenarios,
  ...badgeScenarios,
  ...buttonScenarios,
  ...checkBoxScenarios,
  ...linkScenarios,
  ...listScenarios,
  ...radioButtonScenarios,
  ...skeletonScenarios,
  ...spinnerScenarios,
  ...toggleScenarios,
  ...visualScenarios,
];
