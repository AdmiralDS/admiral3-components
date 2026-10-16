import type { Meta, StoryObj } from '@storybook/react-vite';

import { Avatar, type AvatarProps } from '@admiral-ds/admiral3-components';

import { AvatarPlaygroundTemplate } from './AvatarPlayground.template';
import avatarPlaygroundTemplateRaw from './AvatarPlayground.template?raw';
import { AVATAR_DIMENSIONS } from '../constants';

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    dimension: {
      control: { type: 'inline-radio' },
      options: AVATAR_DIMENSIONS,
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;

const defaultArgs: AvatarProps = {
  children: 'Avatar',
  dimension: 'm',
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
