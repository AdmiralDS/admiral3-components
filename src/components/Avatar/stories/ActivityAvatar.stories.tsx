import type { Meta, StoryObj } from '@storybook/react-vite';

import { ActivityAvatar, type ActivityAvatarProps } from '@admiral-ds/admiral3-components';

import { ActivityAvatarActiveAndPassiveTemplate } from './ActivityAvatarActiveAndPassive.template';
import activityAvatarActiveAndPassiveTemplateRaw from './ActivityAvatarActiveAndPassive.template?raw';
import { ActivityAvatarCustomTemplate } from './ActivityAvatarCustom.template';
import activityAvatarCustomTemplateRaw from './ActivityAvatarCustom.template?raw';
import { ActivityAvatarTemplate } from './ActivityAvatarPlayground.template';
import activityAvatarPlaygroundTemplateRaw from './ActivityAvatarPlayground.template?raw';
import { ActivityAvatarSizesTemplate } from './ActivityAvatarSizes.template';
import activityAvatarSizesTemplateRaw from './ActivityAvatarSizes.template?raw';
import { ActivityAvatarStatusesTemplate } from './ActivityAvatarStatuses.template';
import activityAvatarStatusesTemplateRaw from './ActivityAvatarStatuses.template?raw';
import { ActivityAvatarTooltipTemplate } from './ActivityAvatarTooltip.template';
import activityAvatarTooltipTemplateRaw from './ActivityAvatarTooltip.template?raw';
import { ActivityAvatarWithIconTemplate } from './ActivityAvatarWithIcon.template';
import activityAvatarWithIconTemplateRaw from './ActivityAvatarWithIcon.template?raw';
import { AVATAR_STATUSES, ACTIVITY_AVATAR_DIMENSIONS } from '../constants';

const meta = {
  title: 'Components/Avatar/ActivityAvatar',
  component: ActivityAvatar,
  tags: ['autodocs'],
  argTypes: {
    dimension: {
      control: { type: 'inline-radio' },
      options: ACTIVITY_AVATAR_DIMENSIONS,
    },
    status: {
      control: { type: 'select' },
      options: AVATAR_STATUSES,
    },
    showTooltip: {
      control: { type: 'boolean' },
    },
  },
} satisfies Meta<typeof ActivityAvatar>;

export default meta;

const defaultArgs: ActivityAvatarProps = {
  userName: 'Иван Иванов',
  dimension: 'm',
  showActivityRing: true,
  showTooltip: true,
};

export const Playground: StoryObj<ActivityAvatarProps> = {
  args: defaultArgs,
  render: ActivityAvatarTemplate,
  parameters: {
    docs: {
      source: {
        code: activityAvatarPlaygroundTemplateRaw,
      },
    },
  },
};

export const Sizes: StoryObj<ActivityAvatarProps> = {
  args: defaultArgs,
  render: ActivityAvatarSizesTemplate,
  parameters: {
    controls: { exclude: ['dimension', 'status'] },
    docs: {
      source: {
        code: activityAvatarSizesTemplateRaw,
      },
    },
  },
};

export const Statuses: StoryObj<ActivityAvatarProps> = {
  args: defaultArgs,
  render: ActivityAvatarStatusesTemplate,
  parameters: {
    controls: { exclude: ['status'] },
    docs: {
      source: {
        code: activityAvatarStatusesTemplateRaw,
      },
    },
  },
};

export const ActiveAndPassive: StoryObj<ActivityAvatarProps> = {
  args: defaultArgs,
  render: ActivityAvatarActiveAndPassiveTemplate,
  parameters: {
    controls: { exclude: ['onClick', 'tabIndex'] },
    docs: {
      source: {
        code: activityAvatarActiveAndPassiveTemplateRaw,
      },
    },
  },
};

export const WithIcon: StoryObj<ActivityAvatarProps> = {
  args: defaultArgs,
  render: ActivityAvatarWithIconTemplate,
  parameters: {
    controls: { exclude: ['dimension', 'href', 'icon'] },
    docs: {
      source: {
        code: activityAvatarWithIconTemplateRaw,
      },
    },
  },
};

export const CustomActivityAvatar: StoryObj<ActivityAvatarProps> = {
  name: 'Custom',
  args: defaultArgs,
  render: ActivityAvatarCustomTemplate,
  parameters: {
    controls: { exclude: ['appearance', 'status'] },
    docs: {
      source: {
        code: activityAvatarCustomTemplateRaw,
      },
    },
  },
};

export const WithTooltip: StoryObj<ActivityAvatarProps> = {
  args: defaultArgs,
  render: ActivityAvatarTooltipTemplate,
  parameters: {
    controls: { exclude: ['showTooltip', 'onClick', 'tabIndex'] },
    docs: {
      source: {
        code: activityAvatarTooltipTemplateRaw,
      },
    },
  },
};
