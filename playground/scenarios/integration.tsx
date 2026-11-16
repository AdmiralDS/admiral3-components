import type { PlaygroundScenario } from './index';
import { ReactHookFormTemplate } from '../../src/integrations/react-hook-form/ReactHookForm.template';
import { ReactHookFormWithFormItemTemplate } from '../../src/integrations/react-hook-form/ReactHookFormWithFormItem.template';
import { TanStackFormTemplate } from '../../src/integrations/tanstack-form/TanStackForm.template';
import { TanStackFormWithFormItemTemplate } from '../../src/integrations/tanstack-form/TanStackFormWithFormItem.template';

export const integrationScenarios: PlaygroundScenario[] = [
  { id: 'integration/rhf', title: 'React Hook Form', render: () => <ReactHookFormTemplate /> },
  {
    id: 'integration/rhf-form-item',
    title: 'React Hook Form + FormItem',
    render: () => <ReactHookFormWithFormItemTemplate />,
  },
  { id: 'integration/tanstack', title: 'TanStack Form', render: () => <TanStackFormTemplate /> },
  {
    id: 'integration/tanstack-form-item',
    title: 'TanStack Form + FormItem',
    render: () => <TanStackFormWithFormItemTemplate />,
  },
];
