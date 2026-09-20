import type { Meta, StoryObj } from '@storybook/react-vite';

import { TanStackFormTemplate } from './TanStackForm.template';
import tanStackFormTemplateRaw from './TanStackForm.template?raw';
import { TanStackFormWithFormItemTemplate } from './TanStackFormWithFormItem.template';
import tanStackFormWithFormItemTemplateRaw from './TanStackFormWithFormItem.template?raw';

const meta = {
  title: 'Integration/TanStack Form',
  component: TanStackFormTemplate,
  tags: ['autodocs'],
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        component:
          'Интеграция Input, RadioButton, CheckBox и Toggle с TanStack Form. Текстовые поля показаны с обычными подписями и в обёртке FormItem; пример с FormItem также демонстрирует управляемое поле со счётчиком. Оба варианта включают валидацию, отправку и сброс формы.',
      },
    },
  },
} satisfies Meta<typeof TanStackFormTemplate>;

export default meta;

type Story = StoryObj<typeof meta>;

export const FormWithFormItem: Story = {
  name: 'С FormItem',
  render: () => <TanStackFormWithFormItemTemplate />,
  parameters: {
    docs: {
      source: {
        code: tanStackFormWithFormItemTemplateRaw,
      },
    },
  },
};

export const Form: Story = {
  name: 'Без FormItem',
  parameters: {
    docs: {
      source: {
        code: tanStackFormTemplateRaw,
      },
    },
  },
};
