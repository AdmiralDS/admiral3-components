import type { Meta, StoryObj } from '@storybook/react-vite';

import { ReactHookFormTemplate } from './ReactHookForm.template';
import reactHookFormTemplateRaw from './ReactHookForm.template?raw';

const meta = {
  title: 'Integration/React Hook Form',
  component: ReactHookFormTemplate,
  tags: ['autodocs'],
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        component:
          'Интеграция Input, RadioButton, CheckBox и Toggle с React Hook Form. Текстовые поля показаны с обычными подписями и в обёртке FormItem; оба варианта включают валидацию, отправку и сброс формы.',
      },
    },
  },
} satisfies Meta<typeof ReactHookFormTemplate>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Form: Story = {
  name: 'Без FormItem',
  args: { withFormItem: false },
  parameters: {
    docs: {
      source: {
        code: reactHookFormTemplateRaw,
      },
    },
  },
};

export const FormWithFormItem: Story = {
  name: 'С FormItem',
  args: { withFormItem: true },
  parameters: {
    docs: {
      source: {
        code: reactHookFormTemplateRaw,
      },
    },
  },
};
