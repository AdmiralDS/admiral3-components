import type { Meta, StoryObj } from '@storybook/react-vite';

import { TanStackFormTemplate } from './TanStackForm.template';
import tanStackFormTemplateRaw from './TanStackForm.template?raw';

const meta = {
  title: 'Integration/TanStack Form',
  component: TanStackFormTemplate,
  tags: ['autodocs'],
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        component:
          'Интеграция Input, RadioButton, CheckBox и Toggle с TanStack Form. Текстовые поля показаны с обычными подписями и в обёртке FormItem; оба варианта включают валидацию, отправку и сброс формы.',
      },
    },
  },
} satisfies Meta<typeof TanStackFormTemplate>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Form: Story = {
  name: 'Без FormItem',
  args: { withFormItem: false },
  parameters: {
    docs: {
      source: {
        code: tanStackFormTemplateRaw,
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
        code: tanStackFormTemplateRaw,
      },
    },
  },
};
