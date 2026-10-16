import type { Meta, StoryObj } from '@storybook/react-vite';

import { SliderRange, type SliderRangeProps } from '@admiral-ds/admiral3-components';

import { SliderRangeAppearancesTemplate } from './SliderRangeAppearances.template';
import SliderRangeAppearancesTemplateRaw from './SliderRangeAppearances.template?raw';
import { SliderRangeDisplayOptionsTemplate } from './SliderRangeDisplayOptions.template';
import SliderRangeDisplayOptionsTemplateRaw from './SliderRangeDisplayOptions.template?raw';
import { SliderRangeFormattingTemplate } from './SliderRangeFormatting.template';
import sliderRangeFormattingRaw from './SliderRangeFormatting.template?raw';
import { SliderRangeKeyboardTemplate } from './SliderRangeKeyboard.template';
import SliderRangeKeyboardTemplateRaw from './SliderRangeKeyboard.template?raw';
import { SliderRangeSizesTemplate } from './SliderRangeSizes.template';
import SliderRangeSizesTemplateRaw from './SliderRangeSizes.template?raw';
import { SliderRangeStatesTemplate } from './SliderRangeStates.template';
import SliderRangeStatesTemplateRaw from './SliderRangeStates.template?raw';
import { SliderRangeStoryControlledTemplate } from './SliderRangeStoryControlled.template';
import SliderRangeStoryControlledTemplateRaw from './SliderRangeStoryControlled.template?raw';
import { SliderRangeStoryNativeFormTemplate } from './SliderRangeStoryNativeForm.template';
import SliderRangeStoryNativeFormTemplateRaw from './SliderRangeStoryNativeForm.template?raw';
import { SliderRangeStoryPlaygroundTemplate } from './SliderRangeStoryPlayground.template';
import SliderRangeStoryPlaygroundTemplateRaw from './SliderRangeStoryPlayground.template?raw';
import { SliderRangeTooltipTemplate } from './SliderRangeTooltip.template';
import SliderRangeTooltipTemplateRaw from './SliderRangeTooltip.template?raw';
import { SLIDER_RANGE_DIMENSIONS, SLIDER_THUMB_APPEARANCES } from '../constants';

const meta = {
  title: 'Components/SliderRange',
  component: SliderRange,
  tags: ['autodocs'],
  args: {
    label: 'Сумма',
    defaultValue: [25, 75],
    dimension: 'm',
    lowerNativeSliderProps: { 'aria-label': 'Минимальная сумма' },
    upperNativeSliderProps: { 'aria-label': 'Максимальная сумма' },
  },
  argTypes: {
    dimension: { control: { type: 'inline-radio' }, options: SLIDER_RANGE_DIMENSIONS },
    thumbAppearance: { control: { type: 'inline-radio' }, options: SLIDER_THUMB_APPEARANCES },
    showTooltip: { control: 'boolean' },
    renderValue: { control: 'select', options: ['numbers', 'hidden'], mapping: { numbers: undefined, hidden: null } },
    renderMarks: { control: 'select', options: ['numbers', 'hidden'], mapping: { numbers: undefined, hidden: null } },
  },
} satisfies Meta<typeof SliderRange>;
export default meta;

export const Playground: StoryObj<SliderRangeProps> = {
  render: SliderRangeStoryPlaygroundTemplate,
  parameters: {
    docs: { source: { code: SliderRangeStoryPlaygroundTemplateRaw } },
    controls: {
      include: [
        'dimension',
        'thumbAppearance',
        'disabled',
        'label',
        'renderValue',
        'renderMarks',
        'showTooltip',
        'min',
        'max',
        'step',
      ],
    },
  },
};
export const Sizes: StoryObj<SliderRangeProps> = {
  render: SliderRangeSizesTemplate,
  parameters: {
    docs: { source: { code: SliderRangeSizesTemplateRaw } },
    controls: { include: ['thumbAppearance', 'disabled', 'label', 'renderValue', 'renderMarks', 'showTooltip'] },
  },
};
export const Appearances: StoryObj<SliderRangeProps> = {
  render: SliderRangeAppearancesTemplate,
  parameters: {
    docs: { source: { code: SliderRangeAppearancesTemplateRaw } },
    controls: { include: ['dimension', 'disabled', 'label', 'renderValue', 'renderMarks', 'showTooltip'] },
  },
};
export const States: StoryObj<SliderRangeProps> = {
  render: SliderRangeStatesTemplate,
  parameters: {
    docs: { source: { code: SliderRangeStatesTemplateRaw } },
    controls: { include: ['dimension', 'thumbAppearance', 'label', 'renderValue', 'renderMarks', 'showTooltip'] },
  },
};
export const DisplayOptions: StoryObj<SliderRangeProps> = {
  render: SliderRangeDisplayOptionsTemplate,
  parameters: {
    docs: { source: { code: SliderRangeDisplayOptionsTemplateRaw } },
    controls: { include: ['dimension', 'thumbAppearance', 'disabled', 'showTooltip'] },
  },
};
export const WithTooltip: StoryObj<SliderRangeProps> = {
  render: SliderRangeTooltipTemplate,
  parameters: {
    docs: { source: { code: SliderRangeTooltipTemplateRaw } },
    controls: { include: ['dimension', 'thumbAppearance', 'disabled', 'label', 'renderValue', 'renderMarks'] },
  },
};
export const Controlled: StoryObj<SliderRangeProps> = {
  render: SliderRangeStoryControlledTemplate,
  parameters: {
    docs: { source: { code: SliderRangeStoryControlledTemplateRaw } },
    controls: {
      include: [
        'dimension',
        'thumbAppearance',
        'disabled',
        'label',
        'renderValue',
        'renderMarks',
        'showTooltip',
        'min',
        'max',
        'step',
      ],
    },
  },
};
export const NativeForm: StoryObj<SliderRangeProps> = {
  render: SliderRangeStoryNativeFormTemplate,
  parameters: {
    docs: { source: { code: SliderRangeStoryNativeFormTemplateRaw } },
    controls: {
      include: [
        'dimension',
        'thumbAppearance',
        'disabled',
        'label',
        'renderValue',
        'renderMarks',
        'showTooltip',
        'min',
        'max',
        'step',
      ],
    },
  },
};
export const KeyboardNavigation: StoryObj<SliderRangeProps> = {
  render: SliderRangeKeyboardTemplate,
  parameters: {
    docs: { source: { code: SliderRangeKeyboardTemplateRaw } },
    controls: {
      include: [
        'dimension',
        'thumbAppearance',
        'disabled',
        'label',
        'renderValue',
        'renderMarks',
        'showTooltip',
        'min',
        'max',
        'step',
      ],
    },
  },
};

export const Formatting: StoryObj<SliderRangeProps> = {
  render: SliderRangeFormattingTemplate,
  parameters: {
    docs: { source: { code: sliderRangeFormattingRaw } },
    controls: { include: ['dimension', 'thumbAppearance', 'disabled', 'label', 'min', 'max', 'step'] },
  },
};
