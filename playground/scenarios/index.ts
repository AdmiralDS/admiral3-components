import type { ReactElement } from 'react';

import { badgeScenarios } from './badge';
import { badgeDotScenarios } from './badge-dot';
import { buttonScenarios } from './button';
import { buttonGroupScenarios } from './button-group';
import { checkBoxScenarios } from './check-box';
import { chipsScenarios } from './chips';
import { dividerScenarios } from './divider';
import { fieldSetScenarios } from './field-set';
import { formItemScenarios } from './form-item';
import { hintScenarios } from './hint';
import { inputScenarios } from './input';
import { linkScenarios } from './link';
import { listScenarios } from './list';
import { pillsScenarios } from './pills';
import { progressHeaderScenarios } from './progress-header';
import { progressPageScenarios } from './progress-page';
import { pulseScenarios } from './pulse';
import { radioButtonScenarios } from './radio-button';
import { skeletonScenarios } from './skeleton';
import { sliderScenarios } from './slider';
import { sliderRangeScenarios } from './slider-range';
import { spinnerScenarios } from './spinner';
import { tagScenarios } from './tag';
import { textAreaScenarios } from './text-area';
import { toggleScenarios } from './toggle';
import { tooltipScenarios } from './tooltip';
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
  ...buttonGroupScenarios,
  ...checkBoxScenarios,
  ...chipsScenarios,
  ...dividerScenarios,
  ...fieldSetScenarios,
  ...formItemScenarios,
  ...hintScenarios,
  ...inputScenarios,
  ...linkScenarios,
  ...listScenarios,
  ...pillsScenarios,
  ...progressHeaderScenarios,
  ...progressPageScenarios,
  ...pulseScenarios,
  ...radioButtonScenarios,
  ...skeletonScenarios,
  ...sliderScenarios,
  ...sliderRangeScenarios,
  ...spinnerScenarios,
  ...tagScenarios,
  ...textAreaScenarios,
  ...toggleScenarios,
  ...tooltipScenarios,
  ...visualScenarios,
];
