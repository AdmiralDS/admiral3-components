import { ProgressPage } from '@admiral-ds/admiral3-components';

import type { PlaygroundScenario } from './index';

export const progressPageScenarios: PlaygroundScenario[] = [
  {
    id: 'progress-page/default',
    title: 'ProgressPage Default',
    render: () => <ProgressPage data-testid="progress-page" value={35} label="Загрузка данных" valueLabel="35%" />,
  },
  {
    id: 'progress-page/indeterminate',
    title: 'ProgressPage Indeterminate',
    render: () => <ProgressPage data-testid="progress-page" label="Загрузка данных" />,
  },
  {
    id: 'progress-page/custom-error',
    title: 'ProgressPage Custom Error',
    render: () => (
      <ProgressPage
        data-testid="progress-page"
        value={62}
        error
        label="Ошибка загрузки"
        valueLabel="62%"
        appearance={{
          progressColorError: 'var(--admiral-color-magenta-stroke-1-rest)',
        }}
      />
    ),
  },
  {
    id: 'progress-page/labels-layout',
    title: 'ProgressPage Labels Layout',
    render: () => (
      <ProgressPage
        data-testid="progress-page"
        style={{ width: 200 }}
        value={35}
        label="Загрузка большого количества данных"
        valueLabel="35 из 100"
      />
    ),
  },
];
