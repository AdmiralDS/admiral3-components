import { Input } from '@admiral-ds/admiral3-components';

import type { PlaygroundScenario } from './index';
import { FormItemCounterTemplate } from '../../src/components/FormItem/stories/FormItemCounter.template';
import { FormItemDisabledStatesTemplate } from '../../src/components/FormItem/stories/FormItemDisabledStates.template';
import { FormItemErrorTemplate } from '../../src/components/FormItem/stories/FormItemError.template';
import { FormItemLongTextTemplate } from '../../src/components/FormItem/stories/FormItemLongText.template';
import { FormItemPlaygroundTemplate } from '../../src/components/FormItem/stories/FormItemPlayground.template';
import { FormItemSizesTemplate } from '../../src/components/FormItem/stories/FormItemSizes.template';
import { FormItemStatesTemplate } from '../../src/components/FormItem/stories/FormItemStates.template';
import { FormItemSuccessTemplate } from '../../src/components/FormItem/stories/FormItemSuccess.template';
import { FormItemWithoutLabelTemplate } from '../../src/components/FormItem/stories/FormItemWithoutLabel.template';
import { FormItemXsTemplate } from '../../src/components/FormItem/stories/FormItemXs.template';

export const formItemScenarios: PlaygroundScenario[] = [
  {
    id: 'form-item/long-text',
    title: 'FormItem Long Text',
    render: () => (
      <FormItemLongTextTemplate
        label="ОченьДлинноеНазваниеПоляБезПробеловОченьДлинноеНазваниеПоляБезПробелов"
        additionalLabel="ОченьДлиннаяДополнительнаяПодписьБезПробелов"
        description="https://example.org/very-long-address-without-spaces/very-long-address-without-spaces"
        maxLength={20}
        children={<Input />}
      />
    ),
  },
  {
    id: 'form-item/without-label',
    title: 'FormItem Without Label',
    render: () => <FormItemWithoutLabelTemplate description="Пояснение" required children={<Input />} />,
  },
  {
    id: 'form-item/disabled-states',
    title: 'FormItem Disabled States',
    render: () => <FormItemDisabledStatesTemplate />,
  },
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
  {
    id: 'form-item/counter',
    title: 'FormItem Counter',
    render: () => (
      <FormItemCounterTemplate
        label="Название"
        description="Не более 20 символов"
        maxLength={20}
        counterThreshold={0.8}
        children={<Input />}
      />
    ),
  },
  {
    id: 'form-item/sizes',
    title: 'FormItem Sizes',
    render: () => (
      <FormItemSizesTemplate
        label="Подпись"
        additionalLabel="Дополнение"
        description="Пояснение"
        maxLength={20}
        children={<Input />}
      />
    ),
  },
  {
    id: 'form-item/states',
    title: 'FormItem States',
    render: () => (
      <FormItemStatesTemplate
        label="Подпись"
        additionalLabel="Дополнение"
        description="Пояснение"
        children={<Input />}
      />
    ),
  },
];
