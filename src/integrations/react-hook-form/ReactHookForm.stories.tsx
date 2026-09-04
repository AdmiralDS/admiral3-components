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
          'Интеграция Input, RadioButton, CheckBox и Toggle с React Hook Form. Пример включает все поддерживаемые типы Input, валидацию, отправку и сброс формы.',
      },
    },
  },
} satisfies Meta<typeof ReactHookFormTemplate>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Form: Story = {
  parameters: {
    docs: {
      source: {
        code: reactHookFormTemplateRaw,
      },
    },
  },
};
