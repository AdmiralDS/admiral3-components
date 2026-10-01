import type { Meta, StoryObj } from '@storybook/react-vite';

import { ButtonGroup, type ButtonGroupProps } from '@admiral-ds/admiral3-components';

import { ButtonGroupAppearancesTemplate } from './ButtonGroupAppearances.template';
import buttonGroupAppearancesTemplateRaw from './ButtonGroupAppearances.template?raw';
import { ButtonGroupCustomColorTemplate } from './ButtonGroupCustomColor.template';
import buttonGroupCustomColorTemplateRaw from './ButtonGroupCustomColor.template?raw';
import { ButtonGroupDimensionsTemplate } from './ButtonGroupDimensions.template';
import buttonGroupDimensionsTemplateRaw from './ButtonGroupDimensions.template?raw';
import { ButtonGroupIconBadgeTemplate } from './ButtonGroupIconBadge.template';
import buttonGroupIconBadgeTemplateRaw from './ButtonGroupIconBadge.template?raw';
import { ButtonGroupKeyboardNavigationTemplate } from './ButtonGroupKeyboardNavigation.template';
import buttonGroupKeyboardNavigationTemplateRaw from './ButtonGroupKeyboardNavigation.template?raw';
import { ButtonGroupPlaygroundTemplate } from './ButtonGroupPlayground.template';
import buttonGroupPlaygroundTemplateRaw from './ButtonGroupPlayground.template?raw';
import { ButtonGroupStatesTemplate } from './ButtonGroupStates.template';
import buttonGroupStatesTemplateRaw from './ButtonGroupStates.template?raw';
import { BUTTON_GROUP_APPEARANCES, BUTTON_GROUP_COLOR_MODES, BUTTON_GROUP_DIMENSIONS } from '../constants';

const meta = {
  title: 'Components/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs'],
  argTypes: {
    appearance: {
      control: { type: 'inline-radio' },
      options: BUTTON_GROUP_APPEARANCES,
    },
    colorMode: {
      control: { type: 'inline-radio' },
      options: BUTTON_GROUP_COLOR_MODES,
    },
    dimension: {
      control: { type: 'inline-radio' },
      options: BUTTON_GROUP_DIMENSIONS,
    },
  },
} satisfies Meta<typeof ButtonGroup>;

export default meta;

const defaultArgs: ButtonGroupProps = {
  appearance: 'solid',
  colorMode: 'colored',
  dimension: 'm',
  'aria-label': 'Действия с документом',
};

export const Playground: StoryObj<ButtonGroupProps> = {
  args: defaultArgs,
  render: ButtonGroupPlaygroundTemplate,
  parameters: {
    docs: {
      source: {
        code: buttonGroupPlaygroundTemplateRaw,
      },
    },
  },
};

export const AppearancesAndColorModes: StoryObj<ButtonGroupProps> = {
  args: defaultArgs,
  render: ButtonGroupAppearancesTemplate,
  parameters: {
    controls: {
      exclude: ['appearance', 'colorMode'],
    },
    docs: {
      source: {
        code: buttonGroupAppearancesTemplateRaw,
      },
    },
  },
};

export const CustomColor: StoryObj<ButtonGroupProps> = {
  args: defaultArgs,
  render: ButtonGroupCustomColorTemplate,
  parameters: {
    controls: {
      exclude: ['appearance', 'colorMode', 'colorConfig'],
    },
    docs: {
      source: {
        code: buttonGroupCustomColorTemplateRaw,
      },
    },
  },
};

export const Dimensions: StoryObj<ButtonGroupProps> = {
  args: defaultArgs,
  render: ButtonGroupDimensionsTemplate,
  parameters: {
    controls: {
      exclude: ['dimension'],
    },
    docs: {
      source: {
        code: buttonGroupDimensionsTemplateRaw,
      },
    },
  },
};

export const WithIconAndBadge: StoryObj<ButtonGroupProps> = {
  args: defaultArgs,
  render: ButtonGroupIconBadgeTemplate,
  parameters: {
    docs: {
      source: {
        code: buttonGroupIconBadgeTemplateRaw,
      },
    },
  },
};

export const States: StoryObj<ButtonGroupProps> = {
  args: defaultArgs,
  render: ButtonGroupStatesTemplate,
  parameters: {
    controls: {
      exclude: ['appearance'],
    },
    docs: {
      source: {
        code: buttonGroupStatesTemplateRaw,
      },
    },
  },
};

export const KeyboardNavigation: StoryObj<ButtonGroupProps> = {
  args: defaultArgs,
  render: ButtonGroupKeyboardNavigationTemplate,
  parameters: {
    docs: {
      source: {
        code: buttonGroupKeyboardNavigationTemplateRaw,
      },
    },
  },
};
