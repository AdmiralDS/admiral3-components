import { ProgressHeader } from '@admiral-ds/admiral3-components';

import type { PlaygroundScenario } from './index';

export const progressHeaderScenarios: PlaygroundScenario[] = [
  {
    id: 'progress-header/default',
    title: 'ProgressHeader Default',
    render: () => <ProgressHeader value={35} aria-label="Загрузка страницы" data-testid="progress-header" />,
  },
  {
    id: 'progress-header/indeterminate',
    title: 'ProgressHeader Indeterminate',
    render: () => <ProgressHeader aria-label="Загрузка страницы" data-testid="progress-header" />,
  },
  {
    id: 'progress-header/custom-error',
    title: 'ProgressHeader Custom Error',
    render: () => (
      <ProgressHeader
        value={62}
        error
        appearance={{ progressColorError: 'var(--admiral-color-magenta-stroke-1-rest)' }}
        aria-label="Ошибка загрузки страницы"
        data-testid="progress-header"
      />
    ),
  },
];
