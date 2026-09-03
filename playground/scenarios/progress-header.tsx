import type { PlaygroundScenario } from './index';
import type { ProgressHeaderProps } from '../../src/components/ProgressHeader';
import { ProgressHeaderPlaygroundTemplate } from '../../src/components/ProgressHeader/stories/ProgressHeaderPlayground.template';

const defaultArgs: ProgressHeaderProps = {
  value: 35,
  'aria-label': 'Загрузка страницы',
};

export const progressHeaderScenarios: PlaygroundScenario[] = [
  {
    id: 'progress-header/default',
    title: 'ProgressHeader Default',
    render: () => <ProgressHeaderPlaygroundTemplate {...defaultArgs} data-testid="progress-header" />,
  },
];
