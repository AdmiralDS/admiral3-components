import type { Meta, StoryObj } from '@storybook/react-vite';

import { ReactHookFormTemplate } from './ReactHookForm.template';
import reactHookFormTemplateRaw from './ReactHookForm.template?raw';
import { ReactHookFormWithFormItemTemplate } from './ReactHookFormWithFormItem.template';
import reactHookFormWithFormItemTemplateRaw from './ReactHookFormWithFormItem.template?raw';

const meta = {
  title: 'Integration/React Hook Form',
  component: ReactHookFormTemplate,
  tags: ['autodocs'],
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        component:
          'Интеграция Input, RadioButton, CheckBox и Toggle с React Hook Form. Текстовые поля показаны с обычными подписями и в обёртке FormItem; пример с FormItem также демонстрирует поле со счётчиком, подключённое через Controller. Оба варианта включают валидацию, отправку и сброс формы.',
      },
    },
  },
} satisfies Meta<typeof ReactHookFormTemplate>;

export default meta;

type Story = StoryObj<typeof meta>;

export const FormWithFormItem: Story = {
  name: 'С FormItem',
  render: () => <ReactHookFormWithFormItemTemplate />,
  parameters: {
    docs: {
      source: {
        code: reactHookFormWithFormItemTemplateRaw,
      },
    },
  },
};

export const Form: Story = {
  name: 'Без FormItem',
  parameters: {
    docs: {
      source: {
        code: reactHookFormTemplateRaw,
      },
    },
  },
};
