import type { Meta, StoryObj } from '@storybook/react-vite';

import { Pill, type PillProps, type PillsProps } from '@admiral-ds/admiral3-components';

import { PillsAppearancesTemplate } from './PillsAppearances.template';
import pillsAppearancesTemplateRaw from './PillsAppearances.template?raw';
import { PillsCustomColorsTemplate } from './PillsCustomColors.template';
import pillsCustomColorsTemplateRaw from './PillsCustomColors.template?raw';
import { PillsDropdownTemplate } from './PillsDropdown.template';
import pillsDropdownTemplateRaw from './PillsDropdown.template?raw';
import { PillsKeyboardNavigationTemplate } from './PillsKeyboardNavigation.template';
import pillsKeyboardNavigationTemplateRaw from './PillsKeyboardNavigation.template?raw';
import { PillsNestedTemplate } from './PillsNested.template';
import pillsNestedTemplateRaw from './PillsNested.template?raw';
import { PillsPlaygroundTemplate } from './PillsPlayground.template';
import pillsPlaygroundTemplateRaw from './PillsPlayground.template?raw';
import { PillsTruncatedTextTemplate } from './PillsTruncatedText.template';
import pillsTruncatedTextTemplateRaw from './PillsTruncatedText.template?raw';
import { PillsWithIconTemplate } from './PillsWithIcon.template';
import pillsWithIconTemplateRaw from './PillsWithIcon.template?raw';
import { PILLS_APPEARANCES } from '../constants';

const defaultArgs: PillProps = {
  children: 'Pills',
  appearance: 'neutral1',
};

const defaultPillsArgs: PillsProps = {
  connected: false,
};

const meta = {
  title: 'Components/Pills',
  component: Pill,
  tags: ['autodocs'],
  argTypes: {
    appearance: {
      control: { type: 'select' },
      options: PILLS_APPEARANCES,
    },
  },
  parameters: {
    docs: {
      subcomponents: {
        Pills: {
          title: 'Pills',
          description: 'A component representing a set of pills.',
          args: {
            connected: {
              description: 'Determines if the pills are connected.',
              type: { name: 'boolean', required: true },
            },
            pills: {
              description: 'An array of pills.',
              type: { name: 'Array<PillProps>', required: true },
            },
            ...defaultArgs,
          },
        },
      },
    },
  },
} satisfies Meta<typeof Pill>;

export default meta;

export const Playground: StoryObj<PillProps> = {
  args: defaultArgs,
  render: PillsPlaygroundTemplate,
  parameters: {
    docs: {
      source: {
        code: pillsPlaygroundTemplateRaw,
      },
    },
  },
};

export const Appearances: StoryObj<PillProps> = {
  args: defaultArgs,
  render: PillsAppearancesTemplate,
  parameters: {
    controls: {
      exclude: ['appearance'],
    },
    docs: {
      source: {
        code: pillsAppearancesTemplateRaw,
      },
    },
  },
};

export const CustomColors: StoryObj<PillProps> = {
  args: defaultArgs,
  render: PillsCustomColorsTemplate,
  parameters: {
    controls: {
      exclude: ['appearance'],
    },
    docs: {
      source: {
        code: pillsCustomColorsTemplateRaw,
      },
    },
  },
};

export const WithIcon: StoryObj<PillProps> = {
  args: {
    ...defaultArgs,
    appearance: 'success1',
    children: 'Success',
  },
  render: PillsWithIconTemplate,
  parameters: {
    docs: {
      source: {
        code: pillsWithIconTemplateRaw,
      },
    },
  },
};

export const Nested: StoryObj<PillsProps> = {
  args: defaultPillsArgs,
  render: PillsNestedTemplate,
  parameters: {
    controls: {
      exclude: ['appearance'],
    },
    docs: {
      source: {
        code: pillsNestedTemplateRaw,
      },
    },
  },
};

export const TruncatedText: StoryObj<PillProps> = {
  args: {
    ...defaultArgs,
    appearance: 'success1',
    children: 'Я три дня гналась за вами, чтобы сказать, как вы мне безразличны',
  },
  render: PillsTruncatedTextTemplate,
  parameters: {
    docs: {
      source: {
        code: pillsTruncatedTextTemplateRaw,
      },
    },
  },
};

export const Dropdown: StoryObj<PillProps> = {
  render: PillsDropdownTemplate,
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      source: {
        code: pillsDropdownTemplateRaw,
      },
    },
  },
};

export const KeyboardNavigation: StoryObj<PillsProps> = {
  args: defaultPillsArgs,
  render: PillsKeyboardNavigationTemplate,
  parameters: {
    controls: {
      exclude: ['appearance'],
    },
    docs: {
      source: {
        code: pillsKeyboardNavigationTemplateRaw,
      },
    },
  },
};
