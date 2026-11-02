import type { Meta, StoryObj } from '@storybook/react-vite';

import { InputSlider, type InputSliderProps } from '@admiral-ds/admiral3-components';

import { InputSliderControlledTemplate } from './InputSliderControlled.template';
import controlledSource from './InputSliderControlled.template?raw';
import { InputSliderCurrencyTemplate } from './InputSliderCurrency.template';
import currencySource from './InputSliderCurrency.template?raw';
import { InputSliderFormItemTemplate } from './InputSliderFormItem.template';
import formItemSource from './InputSliderFormItem.template?raw';
import { InputSliderMarksTemplate } from './InputSliderMarks.template';
import marksSource from './InputSliderMarks.template?raw';
import { InputSliderPlaygroundTemplate } from './InputSliderPlayground.template';
import playgroundSource from './InputSliderPlayground.template?raw';
import { InputSliderSizesTemplate } from './InputSliderSizes.template';
import sizesSource from './InputSliderSizes.template?raw';
import { InputSliderStatesTemplate } from './InputSliderStates.template';
import statesSource from './InputSliderStates.template?raw';
import { INPUT_STATUSES } from '../../Input/constants';
import { INPUT_SLIDER_DIMENSIONS } from '../constants';

const meta = {
  title: 'Components/InputSlider',
  component: InputSlider,
  tags: ['autodocs'],
  args: { dimension: 'm', defaultValue: '50', min: 0, max: 100, step: 1 },
  argTypes: {
    dimension: { control: 'inline-radio', options: INPUT_SLIDER_DIMENSIONS },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    status: { control: 'inline-radio', options: INPUT_STATUSES },
    required: { control: 'boolean' },
    inputProps: { control: 'object' },
  },
} satisfies Meta<typeof InputSlider>;

export default meta;
type Story = StoryObj<InputSliderProps>;

export const Playground: Story = {
  render: InputSliderPlaygroundTemplate,
  parameters: { docs: { source: { code: playgroundSource } } },
};
export const Sizes: Story = {
  render: InputSliderSizesTemplate,
  parameters: { docs: { source: { code: sizesSource } } },
};
export const States: Story = {
  render: InputSliderStatesTemplate,
  parameters: { docs: { source: { code: statesSource } } },
};
export const Marks: Story = {
  render: InputSliderMarksTemplate,
  parameters: { docs: { source: { code: marksSource } } },
};
export const Controlled: Story = {
  render: InputSliderControlledTemplate,
  parameters: { docs: { source: { code: controlledSource } } },
};
export const WithFormItem: Story = {
  render: InputSliderFormItemTemplate,
  parameters: { docs: { source: { code: formItemSource } } },
};
export const Currency: Story = {
  name: 'Денежная сумма с маской',
  render: InputSliderCurrencyTemplate,
  parameters: { docs: { source: { code: currencySource } } },
};
