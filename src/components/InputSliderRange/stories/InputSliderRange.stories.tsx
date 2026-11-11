import type { Meta, StoryObj } from '@storybook/react-vite';

import { InputSliderRange, type InputSliderRangeProps } from '@admiral-ds/admiral3-components';

import { InputSliderRangeBehaviorTemplate } from './InputSliderRangeBehavior.template';
import behaviorSource from './InputSliderRangeBehavior.template?raw';
import { InputSliderRangeControlledTemplate } from './InputSliderRangeControlled.template';
import controlledSource from './InputSliderRangeControlled.template?raw';
import { InputSliderRangeCurrencyTemplate } from './InputSliderRangeCurrency.template';
import currencySource from './InputSliderRangeCurrency.template?raw';
import { InputSliderRangeFormTemplate } from './InputSliderRangeForm.template';
import nativeFormSource from './InputSliderRangeForm.template?raw';
import { InputSliderRangeFormItemTemplate } from './InputSliderRangeFormItem.template';
import formitemSource from './InputSliderRangeFormItem.template?raw';
import { InputSliderRangePlaygroundTemplate } from './InputSliderRangePlayground.template';
import playgroundSource from './InputSliderRangePlayground.template?raw';
import { InputSliderRangeSizesTemplate } from './InputSliderRangeSizes.template';
import sizesSource from './InputSliderRangeSizes.template?raw';
import { InputSliderRangeStatesTemplate } from './InputSliderRangeStates.template';
import statesSource from './InputSliderRangeStates.template?raw';
import { INPUT_STATUSES } from '../../Input/constants';
import { INPUT_SLIDER_RANGE_DIMENSIONS } from '../constants';

const meta = {
  title: 'Components/InputSliderRange',
  component: InputSliderRange,
  tags: ['autodocs'],
  args: { dimension: 'm', defaultValue: ['25', '75'], min: 0, max: 100, step: 1 },
  argTypes: {
    dimension: { control: 'inline-radio', options: INPUT_SLIDER_RANGE_DIMENSIONS },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    required: { control: 'boolean' },
    minValueDistance: { control: { type: 'number', min: 0 } },
    status: { control: 'inline-radio', options: INPUT_STATUSES },
    lowerInputProps: { control: 'object' },
    upperInputProps: { control: 'object' },
  },
} satisfies Meta<typeof InputSliderRange>;
export default meta;
type Story = StoryObj<InputSliderRangeProps>;
export const Playground: Story = {
  render: InputSliderRangePlaygroundTemplate,
  parameters: { docs: { source: { code: playgroundSource } } },
};
export const Sizes: Story = {
  render: InputSliderRangeSizesTemplate,
  parameters: { docs: { source: { code: sizesSource } } },
};
export const States: Story = {
  render: InputSliderRangeStatesTemplate,
  parameters: { docs: { source: { code: statesSource } } },
};
export const Controlled: Story = {
  render: InputSliderRangeControlledTemplate,
  parameters: { docs: { source: { code: controlledSource } } },
};
export const WithFormItem: Story = {
  render: InputSliderRangeFormItemTemplate,
  parameters: { docs: { source: { code: formitemSource } } },
};
export const Currency: Story = {
  render: InputSliderRangeCurrencyTemplate,
  parameters: { docs: { source: { code: currencySource } } },
};

export const NativeForm: Story = {
  name: 'Нативная форма',
  render: InputSliderRangeFormTemplate,
  parameters: { docs: { source: { code: nativeFormSource } }, controls: { disable: true } },
};

export const RangeBehavior: Story = {
  name: 'Зазор и обмен ползунков',
  render: InputSliderRangeBehaviorTemplate,
  parameters: { docs: { source: { code: behaviorSource } }, controls: { disable: true } },
};
