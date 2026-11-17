import type { Meta, StoryObj } from '@storybook/react-vite';

import { Slider, type SliderProps } from '@admiral-ds/admiral3-components';

import { SliderAppearancesTemplate } from './SliderAppearances.template';
import SliderAppearancesTemplateRaw from './SliderAppearances.template?raw';
import { SliderDisplayOptionsTemplate } from './SliderDisplayOptions.template';
import SliderDisplayOptionsTemplateRaw from './SliderDisplayOptions.template?raw';
import { SliderIconsTemplate } from './SliderIcons.template';
import SliderIconsTemplateRaw from './SliderIcons.template?raw';
import { SliderMarksTemplate } from './SliderMarks.template';
import SliderMarksTemplateRaw from './SliderMarks.template?raw';
import { SliderSizesTemplate } from './SliderSizes.template';
import SliderSizesTemplateRaw from './SliderSizes.template?raw';
import { SliderStatesTemplate } from './SliderStates.template';
import SliderStatesTemplateRaw from './SliderStates.template?raw';
import { SliderStepsTemplate } from './SliderSteps.template';
import SliderStepsTemplateRaw from './SliderSteps.template?raw';
import { SliderStoryControlledTemplate } from './SliderStoryControlled.template';
import SliderStoryControlledTemplateRaw from './SliderStoryControlled.template?raw';
import { SliderStoryKeyboardTemplate } from './SliderStoryKeyboard.template';
import SliderStoryKeyboardTemplateRaw from './SliderStoryKeyboard.template?raw';
import { SliderStoryNativeFormTemplate } from './SliderStoryNativeForm.template';
import SliderStoryNativeFormTemplateRaw from './SliderStoryNativeForm.template?raw';
import { SliderStoryPlaygroundTemplate } from './SliderStoryPlayground.template';
import SliderStoryPlaygroundTemplateRaw from './SliderStoryPlayground.template?raw';
import { SliderTooltipTemplate } from './SliderTooltip.template';
import SliderTooltipTemplateRaw from './SliderTooltip.template?raw';
import { SLIDER_DIMENSIONS, SLIDER_THUMB_APPEARANCES } from '../constants';

const meta = {
  title: 'Components/Slider',
  component: Slider,
  tags: ['autodocs'],
  args: { label: 'Громкость', defaultValue: 50, dimension: 'm' },
  argTypes: {
    dimension: { control: { type: 'inline-radio' }, options: SLIDER_DIMENSIONS },
    thumbAppearance: { control: { type: 'inline-radio' }, options: SLIDER_THUMB_APPEARANCES },
    showTooltip: { control: 'boolean' },
    renderValue: { control: 'select', options: ['numbers', 'hidden'], mapping: { numbers: undefined, hidden: null } },
    renderMarks: { control: 'select', options: ['numbers', 'hidden'], mapping: { numbers: undefined, hidden: null } },
    marks: { control: 'object' },
    step: { control: 'number', if: { arg: 'marks', exists: false } },
  },
} satisfies Meta<typeof Slider>;
export default meta;

export const Playground: StoryObj<SliderProps> = {
  render: SliderStoryPlaygroundTemplate,
  parameters: {
    docs: { source: { code: SliderStoryPlaygroundTemplateRaw } },
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
        'marks',
      ],
    },
  },
};
export const Sizes: StoryObj<SliderProps> = {
  render: SliderSizesTemplate,
  parameters: {
    docs: { source: { code: SliderSizesTemplateRaw } },
    controls: { include: ['thumbAppearance', 'disabled', 'label', 'renderValue', 'renderMarks', 'showTooltip'] },
  },
};
export const Appearances: StoryObj<SliderProps> = {
  render: SliderAppearancesTemplate,
  parameters: {
    docs: { source: { code: SliderAppearancesTemplateRaw } },
    controls: { include: ['dimension', 'disabled', 'label', 'renderValue', 'renderMarks', 'showTooltip'] },
  },
};
export const States: StoryObj<SliderProps> = {
  render: SliderStatesTemplate,
  parameters: {
    docs: { source: { code: SliderStatesTemplateRaw } },
    controls: { include: ['dimension', 'thumbAppearance', 'label', 'renderValue', 'renderMarks', 'showTooltip'] },
  },
};
export const DisplayOptions: StoryObj<SliderProps> = {
  render: SliderDisplayOptionsTemplate,
  parameters: {
    docs: { source: { code: SliderDisplayOptionsTemplateRaw } },
    controls: { include: ['dimension', 'thumbAppearance', 'disabled', 'showTooltip'] },
  },
};
export const WithTooltip: StoryObj<SliderProps> = {
  render: SliderTooltipTemplate,
  parameters: {
    docs: { source: { code: SliderTooltipTemplateRaw } },
    controls: { include: ['dimension', 'thumbAppearance', 'disabled', 'label', 'renderValue', 'renderMarks'] },
  },
};
export const WithIcons: StoryObj<SliderProps> = {
  render: SliderIconsTemplate,
  parameters: {
    docs: { source: { code: SliderIconsTemplateRaw } },
    controls: {
      include: ['dimension', 'thumbAppearance', 'disabled', 'label', 'renderValue', 'renderMarks', 'showTooltip'],
    },
  },
};
export const Steps: StoryObj<SliderProps> = {
  render: SliderStepsTemplate,
  parameters: {
    docs: { source: { code: SliderStepsTemplateRaw } },
    controls: {
      include: ['dimension', 'thumbAppearance', 'disabled', 'label', 'renderValue', 'renderMarks', 'showTooltip'],
    },
  },
};
export const Marks: StoryObj<SliderProps> = {
  render: SliderMarksTemplate,
  parameters: {
    docs: { source: { code: SliderMarksTemplateRaw } },
    controls: {
      include: ['dimension', 'thumbAppearance', 'disabled', 'label', 'renderValue', 'renderMarks', 'showTooltip'],
    },
  },
};
export const Controlled: StoryObj<SliderProps> = {
  render: SliderStoryControlledTemplate,
  parameters: {
    docs: { source: { code: SliderStoryControlledTemplateRaw } },
    controls: {
      include: [
        'dimension',
        'thumbAppearance',
        'disabled',
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
export const NativeForm: StoryObj<SliderProps> = {
  render: SliderStoryNativeFormTemplate,
  parameters: {
    docs: { source: { code: SliderStoryNativeFormTemplateRaw } },
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
export const KeyboardNavigation: StoryObj<SliderProps> = {
  render: SliderStoryKeyboardTemplate,
  parameters: {
    docs: { source: { code: SliderStoryKeyboardTemplateRaw } },
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
