import type { PlaygroundScenario } from './index';
import {
  DropdownPlaygroundTemplate,
  type DropdownPlaygroundTemplateProps,
} from '../../src/components/Dropdown/stories/DropdownPlayground.template';

const defaultArgs: DropdownPlaygroundTemplateProps = {
  align: 'start',
  children: 'Dropdown',
  widthMode: 'target',
};

export const dropdownScenarios: PlaygroundScenario[] = [
  {
    id: 'dropdown/default',
    title: 'Dropdown Default',
    render: () => <DropdownPlaygroundTemplate {...defaultArgs} data-testid="dropdown" />,
  },
  {
    id: 'dropdown/content-width',
    title: 'Dropdown Content Width',
    render: () => (
      <DropdownPlaygroundTemplate
        {...defaultArgs}
        contentWidth={280}
        data-testid="dropdown"
        targetWidth={160}
        widthMode="content"
      />
    ),
  },
  {
    id: 'dropdown/top',
    title: 'Dropdown Top',
    render: () => <DropdownPlaygroundTemplate {...defaultArgs} data-testid="dropdown" targetPlacement="bottom" />,
  },
  ...(['start', 'center', 'end'] as const).map((align) => ({
    id: `dropdown/align-${align}`,
    title: `Dropdown Align ${align}`,
    render: () => (
      <DropdownPlaygroundTemplate
        {...defaultArgs}
        align={align}
        contentWidth={120}
        data-testid="dropdown"
        targetWidth={200}
        widthMode="content"
      />
    ),
  })),
];
