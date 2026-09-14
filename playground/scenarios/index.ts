import type { ReactElement } from 'react';

import { badgeScenarios } from './badge';
import { badgeDotScenarios } from './badge-dot';
import { buttonScenarios } from './button';
import { checkBoxScenarios } from './check-box';
import { dividerScenarios } from './divider';
import { fieldSetScenarios } from './field-set';
import { inputScenarios } from './input';
import { linkScenarios } from './link';
import { listScenarios } from './list';
import { pulseScenarios } from './pulse';
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
  ...badgeScenarios,
  ...badgeDotScenarios,
  ...buttonScenarios,
  ...checkBoxScenarios,
  ...dividerScenarios,
  ...fieldSetScenarios,
  ...inputScenarios,
  ...linkScenarios,
  ...listScenarios,
  ...pulseScenarios,
  ...radioButtonScenarios,
  ...skeletonScenarios,
  ...spinnerScenarios,
  ...toggleScenarios,
  ...visualScenarios,
];
