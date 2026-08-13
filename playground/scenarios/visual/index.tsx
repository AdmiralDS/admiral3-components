import type { PlaygroundScenario } from '../index';
import { BadgeDotVisualTemplate } from './BadgeDotVisual.template';
import { BadgeVisualTemplate } from './BadgeVisual.template';
import { ButtonVisualTemplate } from './ButtonVisual.template';
import { CheckBoxVisualTemplate } from './CheckBoxVisual.template';
import { LinkVisualTemplate } from './LinkVisual.template';
import { VISUAL_SCENARIO_IDS } from './manifest';
import { RadioButtonVisualTemplate } from './RadioButtonVisual.template';
import { SkeletonVisualTemplate } from './SkeletonVisual.template';
import { SpinnerVisualTemplate } from './SpinnerVisual.template';
import { ToggleVisualTemplate } from './ToggleVisual.template';

export const visualScenarios: PlaygroundScenario[] = [
  { id: VISUAL_SCENARIO_IDS.badge, title: 'Visual / Badge', visual: true, render: () => <BadgeVisualTemplate /> },
  {
    id: VISUAL_SCENARIO_IDS.badgeDot,
    title: 'Visual / BadgeDot',
    visual: true,
    render: () => <BadgeDotVisualTemplate />,
  },
  { id: VISUAL_SCENARIO_IDS.button, title: 'Visual / Button', visual: true, render: () => <ButtonVisualTemplate /> },
  {
    id: VISUAL_SCENARIO_IDS.checkBox,
    title: 'Visual / CheckBox',
    visual: true,
    render: () => <CheckBoxVisualTemplate />,
  },
  { id: VISUAL_SCENARIO_IDS.link, title: 'Visual / Link', visual: true, render: () => <LinkVisualTemplate /> },
  {
    id: VISUAL_SCENARIO_IDS.radioButton,
    title: 'Visual / RadioButton',
    visual: true,
    render: () => <RadioButtonVisualTemplate />,
  },
  {
    id: VISUAL_SCENARIO_IDS.skeleton,
    title: 'Visual / Skeleton',
    visual: true,
    render: () => <SkeletonVisualTemplate />,
  },
  { id: VISUAL_SCENARIO_IDS.spinner, title: 'Visual / Spinner', visual: true, render: () => <SpinnerVisualTemplate /> },
  { id: VISUAL_SCENARIO_IDS.toggle, title: 'Visual / Toggle', visual: true, render: () => <ToggleVisualTemplate /> },
];
