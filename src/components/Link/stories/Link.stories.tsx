import type { Meta, StoryObj } from '@storybook/react-vite';

import { Link, type LinkProps } from '@admiral-ds/admiral3-components';

import { LinkAppearancesTemplate } from './LinkAppearances.template';
import linkAppearancesTemplateRaw from './LinkAppearances.template?raw';
import { LinkAsPropTemplate } from './LinkAsProp.template';
import linkAsPropTemplateRaw from './LinkAsProp.template?raw';
import { LinkIconTemplate } from './LinkIcon.template';
import linkIconTemplateRaw from './LinkIcon.template?raw';
import { LinkPlaygroundTemplate } from './LinkPlayground.template';
import linkPlaygroundTemplateRaw from './LinkPlayground.template?raw';
import { LinkSizesTemplate } from './LinkSizes.template';
import linkSizesTemplateRaw from './LinkSizes.template?raw';
import { LinkStatesTemplate } from './LinkStates.template';
import linkStatesTemplateRaw from './LinkStates.template?raw';
import { LINK_APPEARANCES, LINK_DIMENSIONS } from '../constants';

const meta = {
  title: 'Components/Link',
  component: Link,
  tags: ['autodocs'],
  argTypes: {
    appearance: { control: 'inline-radio', options: LINK_APPEARANCES },
    dimension: { control: 'inline-radio', options: LINK_DIMENSIONS },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Link>;

export default meta;

const defaultArgs: LinkProps = {
  appearance: 'colored',
  dimension: 'm',
  href: '#',
  children: 'Link',
};

export const Playground: StoryObj<LinkProps> = {
  args: defaultArgs,
  render: LinkPlaygroundTemplate,
  parameters: { docs: { source: { code: linkPlaygroundTemplateRaw } } },
};

export const Sizes: StoryObj<LinkProps> = {
  args: defaultArgs,
  render: LinkSizesTemplate,
  parameters: {
    controls: { exclude: ['children', 'dimension'] },
    docs: { source: { code: linkSizesTemplateRaw } },
  },
};

export const Appearances: StoryObj<LinkProps> = {
  args: defaultArgs,
  render: LinkAppearancesTemplate,
  parameters: {
    controls: { exclude: ['appearance', 'children'] },
    docs: { source: { code: linkAppearancesTemplateRaw } },
  },
};

export const States: StoryObj<LinkProps> = {
  args: defaultArgs,
  render: LinkStatesTemplate,
  parameters: {
    controls: { exclude: ['children', 'disabled'] },
    docs: { source: { code: linkStatesTemplateRaw } },
  },
};

export const WithIcon: StoryObj<LinkProps> = {
  args: defaultArgs,
  render: LinkIconTemplate,
  parameters: {
    controls: { exclude: ['children'] },
    docs: { source: { code: linkIconTemplateRaw } },
  },
};

export const LinkAsProp: StoryObj<LinkProps> = {
  name: 'Link as prop',
  args: defaultArgs,
  render: LinkAsPropTemplate,
  parameters: {
    controls: { exclude: ['children', 'href'] },
    docs: { source: { code: linkAsPropTemplateRaw } },
  },
};
