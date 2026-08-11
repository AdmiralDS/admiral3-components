import type { PlaygroundScenario } from '../index';
import { BadgeDotVisualTemplate } from './BadgeDotVisual.template';
import { BadgeVisualTemplate } from './BadgeVisual.template';
import { ButtonVisualTemplate } from './ButtonVisual.template';
import { CheckBoxVisualTemplate } from './CheckBoxVisual.template';
import { LinkVisualTemplate } from './LinkVisual.template';
import { RadioButtonVisualTemplate } from './RadioButtonVisual.template';
import { SkeletonVisualTemplate } from './SkeletonVisual.template';
import { SpinnerVisualTemplate } from './SpinnerVisual.template';

export const visualScenarios: PlaygroundScenario[] = [
  { id: 'visual/badge', title: 'Visual / Badge', visual: true, render: () => <BadgeVisualTemplate /> },
  { id: 'visual/badge-dot', title: 'Visual / BadgeDot', visual: true, render: () => <BadgeDotVisualTemplate /> },
  { id: 'visual/button', title: 'Visual / Button', visual: true, render: () => <ButtonVisualTemplate /> },
  { id: 'visual/check-box', title: 'Visual / CheckBox', visual: true, render: () => <CheckBoxVisualTemplate /> },
  { id: 'visual/link', title: 'Visual / Link', visual: true, render: () => <LinkVisualTemplate /> },
  {
    id: 'visual/radio-button',
    title: 'Visual / RadioButton',
    visual: true,
    render: () => <RadioButtonVisualTemplate />,
  },
  { id: 'visual/skeleton', title: 'Visual / Skeleton', visual: true, render: () => <SkeletonVisualTemplate /> },
  { id: 'visual/spinner', title: 'Visual / Spinner', visual: true, render: () => <SpinnerVisualTemplate /> },
];
