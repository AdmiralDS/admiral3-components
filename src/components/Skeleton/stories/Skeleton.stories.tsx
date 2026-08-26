import type { Meta, StoryObj } from '@storybook/react-vite';

import { Skeleton, type SkeletonProps } from '@admiral-ds/admiral3-components';

import { SkeletonComponentsTemplate } from './SkeletonComponents.template';
import skeletonComponentsTemplateRaw from './SkeletonComponents.template?raw';
import { SkeletonPlaygroundTemplate } from './SkeletonPlayground.template';
import skeletonPlaygroundTemplateRaw from './SkeletonPlayground.template?raw';
import { SkeletonTextTemplate } from './SkeletonText.template';
import skeletonTextTemplateRaw from './SkeletonText.template?raw';

const meta = {
  title: 'Components/Skeleton',
  component: Skeleton,
  argTypes: {
    height: {
      control: { type: 'number' },
    },
    width: {
      control: { type: 'number' },
    },
    borderRadius: {
      control: { type: 'number' },
    },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;

export const Playground: StoryObj<SkeletonProps> = {
  args: {
    width: 200,
    height: 40,
    borderRadius: 0,
  },
  render: SkeletonPlaygroundTemplate,
  parameters: {
    docs: {
      source: {
        code: skeletonPlaygroundTemplateRaw,
      },
    },
  },
};

export const SkeletonInComponents: StoryObj<SkeletonProps> = {
  render: SkeletonComponentsTemplate,
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      source: {
        code: skeletonComponentsTemplateRaw,
      },
    },
  },
};

export const SkeletonForText: StoryObj<SkeletonProps> = {
  render: SkeletonTextTemplate,
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      source: {
        code: skeletonTextTemplateRaw,
      },
    },
  },
};
