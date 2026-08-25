import type { Meta, StoryObj } from '@storybook/react-vite';

import { Toggle, type ToggleProps } from '@admiral-ds/admiral3-components';

import { ToggleFixedWidthTemplate } from './ToggleFixedWidth.template';
import { TogglePlaygroundTemplate } from './TogglePlayground.template';
import togglePlaygroundTemplateRaw from './TogglePlayground.template?raw';
import { ToggleSizesTemplate } from './ToggleSizes.template';
import { ToggleStatesTemplate } from './ToggleStates.template';
import { TOGGLE_DIMENSIONS, TOGGLE_LABEL_POSITIONS } from '../constants';

const meta = {
  title: 'Components/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  argTypes: {
    dimension: {
      control: { type: 'inline-radio' },
      options: TOGGLE_DIMENSIONS,
    },
    labelPosition: {
      control: { type: 'inline-radio' },
      options: TOGGLE_LABEL_POSITIONS,
    },
    checked: { control: { type: 'boolean' } },
    defaultChecked: { control: { type: 'boolean' } },
    disabled: { control: { type: 'boolean' } },
    readOnly: { control: { type: 'boolean' } },
    children: { control: { type: 'text' } },
    extraText: { control: { type: 'text' } },
    width: { control: { type: 'text' } },
  },
} satisfies Meta<typeof Toggle>;

export default meta;

const defaultArgs: ToggleProps = {
  children: 'Toggle text',
  dimension: 'm',
  disabled: false,
  labelPosition: 'right',
  readOnly: false,
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
