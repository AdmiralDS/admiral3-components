import { Input } from '@admiral-ds/admiral3-components';

import type { PlaygroundScenario } from './index';
import {
  FormItemCounterTemplate,
  FormItemErrorTemplate,
  FormItemPlaygroundTemplate,
  FormItemSuccessTemplate,
  FormItemXsTemplate,
} from '../../src/components/FormItem/stories/FormItemPlayground.template';

export const formItemScenarios: PlaygroundScenario[] = [
  {
    id: 'form-item/default',
    title: 'FormItem Default',
    render: () => (
      <FormItemPlaygroundTemplate label="Электронная почта" description="Укажите рабочий адрес" children={<Input />} />
    ),
  },
  { id: 'form-item/error', title: 'FormItem Error', render: () => <FormItemErrorTemplate /> },
  { id: 'form-item/success', title: 'FormItem Success', render: () => <FormItemSuccessTemplate /> },
  { id: 'form-item/xs', title: 'FormItem XS', render: () => <FormItemXsTemplate /> },
  { id: 'form-item/counter', title: 'FormItem Counter', render: () => <FormItemCounterTemplate /> },
];
