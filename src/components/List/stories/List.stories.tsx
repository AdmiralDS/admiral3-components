import type { Meta, StoryObj } from '@storybook/react-vite';

import { ListItem } from '@admiral-ds/admiral3-components';

import { ListMarkerColorTemplate } from './ListMarkerColor.template';
import listMarkerColorTemplateRaw from './ListMarkerColor.template?raw';
import { ListMarkerCustomTemplate } from './ListMarkerCustom.template';
import listMarkerCustomTemplateRaw from './ListMarkerCustom.template?raw';
import { ListMultiLineTemplate } from './ListMultiline.template';
import listMultiLineTemplateRaw from './ListMultiline.template?raw';
import { ListNestedTemplate } from './ListNested.template';
import listNestedTemplateRaw from './ListNested.template?raw';

const meta = {
  title: 'Components/List/Общие примеры',
  component: ListItem,
  tags: ['autodocs'],
} satisfies Meta<typeof ListItem>;

export default meta;

export const ListNestedStory: StoryObj = {
  render: ListNestedTemplate,
  parameters: {
    docs: {
      source: {
        code: listNestedTemplateRaw,
      },
    },
  },
  name: 'Вложенные списки',
};

export const ListMarkerColorStory: StoryObj = {
  render: ListMarkerColorTemplate,
  parameters: {
    docs: {
      source: {
        code: listMarkerColorTemplateRaw,
      },
    },
  },
  name: 'Кастомный цвет маркера',
};

export const ListMarkerCustomStory: StoryObj = {
  render: ListMarkerCustomTemplate,
  parameters: {
    docs: {
      source: {
        code: listMarkerCustomTemplateRaw,
      },
    },
  },
  name: 'Кастомизация маркеров',
};

export const ListMultilineStory: StoryObj = {
  render: ListMultiLineTemplate,
  parameters: {
    docs: {
      source: {
        code: listMultiLineTemplateRaw,
      },
    },
  },
  name: 'Многострочность и регулировка ширины списка',
};
