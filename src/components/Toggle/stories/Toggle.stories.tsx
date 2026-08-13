import type { Meta, StoryObj } from '@storybook/react-vite';

import { Toggle, type ToggleProps } from '@admiral-ds/admiral3-primitives';

import { ToggleFixedWidthTemplate } from './ToggleFixedWidth.template';
import { TogglePlaygroundTemplate } from './TogglePlayground.template';
import togglePlaygroundTemplateRaw from './TogglePlayground.template?raw';
import { ToggleSizesTemplate } from './ToggleSizes.template';
import { ToggleStatesTemplate } from './ToggleStates.template';

const meta = {
  title: 'Components/Toggle',
  component: Toggle,
  tags: ['autodocs'],
} satisfies Meta<typeof Toggle>;

export default meta;

const defaultArgs: ToggleProps = {
  children: 'Toggle text',
};

export const Playground: StoryObj<ToggleProps> = {
  args: defaultArgs,
  render: TogglePlaygroundTemplate,
  parameters: {
    docs: {
      source: {
        code: togglePlaygroundTemplateRaw,
      },
    },
  },
};

export const Sizes: StoryObj = { render: ToggleSizesTemplate };
export const States: StoryObj = { render: ToggleStatesTemplate };
export const FixedWidth: StoryObj = { render: ToggleFixedWidthTemplate };
