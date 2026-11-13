import type { Meta, StoryObj } from '@storybook/react-vite';

import { Avatar, type AvatarProps } from '@admiral-ds/admiral3-components';

import { AvatarActiveAndPassiveTemplate } from './AvatarActiveAndPassive.template';
import avatarActiveAndPassiveTemplateRaw from './AvatarActiveAndPassive.template?raw';
import { AvatarCustomTemplate } from './AvatarCustom.template';
import avatarCustomTemplateRaw from './AvatarCustom.template?raw';
import { AvatarPlaygroundTemplate } from './AvatarPlayground.template';
import avatarPlaygroundTemplateRaw from './AvatarPlayground.template?raw';
import { AvatarSizesTemplate } from './AvatarSizes.template';
import avatarSizesTemplateRaw from './AvatarSizes.template?raw';
import { AvatarStatusesTemplate } from './AvatarStatuses.template';
import avatarStatusesTemplateRaw from './AvatarStatuses.template?raw';
import { AvatarTooltipTemplate } from './AvatarTooltip.template';
import avatarTooltipTemplateRaw from './AvatarTooltip.template?raw';
import { AvatarWithIconTemplate } from './AvatarWithIcon.template';
import avatarWithIconTemplateRaw from './AvatarWithIcon.template?raw';
import { AVATAR_STATUSES, AVATAR_DIMENSIONS } from '../constants';

const meta = {
  title: 'Components/Avatar/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    dimension: {
      control: { type: 'inline-radio' },
      options: AVATAR_DIMENSIONS,
    },
    status: {
      control: { type: 'select' },
      options: AVATAR_STATUSES,
    },
    showTooltip: {
      control: { type: 'boolean' },
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;

const defaultArgs: AvatarProps = {
  userName: 'Иван Иванов',
  dimension: 'm',
  showTooltip: true,
};

export const Playground: StoryObj<AvatarProps> = {
  args: defaultArgs,
  render: AvatarPlaygroundTemplate,
  parameters: {
    docs: {
      source: {
        code: avatarPlaygroundTemplateRaw,
      },
    },
  },
};

export const Sizes: StoryObj<AvatarProps> = {
  args: defaultArgs,
  render: AvatarSizesTemplate,
  parameters: {
    controls: { exclude: ['dimension', 'status', 'withActivityRing', 'showActivityRing'] },
    docs: {
      source: {
        code: avatarSizesTemplateRaw,
      },
    },
  },
};

export const Statuses: StoryObj<AvatarProps> = {
  args: defaultArgs,
  render: AvatarStatusesTemplate,
  parameters: {
    controls: { exclude: ['status'] },
    docs: {
      source: {
        code: avatarStatusesTemplateRaw,
      },
    },
  },
};

export const ActiveAndPassive: StoryObj<AvatarProps> = {
  args: defaultArgs,
  render: AvatarActiveAndPassiveTemplate,
  parameters: {
    controls: { exclude: ['onClick', 'tabIndex'] },
    docs: {
      source: {
        code: avatarActiveAndPassiveTemplateRaw,
      },
    },
  },
};

export const WithIcon: StoryObj<AvatarProps> = {
  args: defaultArgs,
  render: AvatarWithIconTemplate,
  parameters: {
    controls: { exclude: ['dimension', 'href', 'icon'] },
    docs: {
      source: {
        code: avatarWithIconTemplateRaw,
      },
    },
  },
};

export const CustomAvatar: StoryObj<AvatarProps> = {
  name: 'Custom',
  args: defaultArgs,
  render: AvatarCustomTemplate,
  parameters: {
    controls: { exclude: ['appearance', 'status'] },
    docs: {
      source: {
        code: avatarCustomTemplateRaw,
      },
    },
  },
};

export const WithTooltip: StoryObj<AvatarProps> = {
  args: defaultArgs,
  render: AvatarTooltipTemplate,
  parameters: {
    controls: { exclude: ['showTooltip', 'onClick', 'tabIndex'] },
    docs: {
      source: {
        code: avatarTooltipTemplateRaw,
      },
    },
  },
};
