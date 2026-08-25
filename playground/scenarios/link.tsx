import { ServiceShareOutline } from '@admiral-ds/admiral3-icons';

import type { LinkProps } from '@admiral-ds/admiral3-components';

import type { PlaygroundScenario } from './index';
import { Link } from '../../src/components/Link';
import { LinkPlaygroundTemplate } from '../../src/components/Link/stories/LinkPlayground.template';

const defaultArgs: LinkProps = {
  children: 'Link',
  href: '/link-target',
};

export const linkScenarios: PlaygroundScenario[] = [
  {
    id: 'link/default',
    title: 'Link Default',
    render: () => <LinkPlaygroundTemplate {...defaultArgs} data-testid="link" />,
  },
  {
    id: 'link/neutral-disabled',
    title: 'Link Neutral Disabled',
    render: () => (
      <Link {...defaultArgs} appearance="neutral" disabled data-testid="link">
        <ServiceShareOutline />
        {defaultArgs.children}
      </Link>
    ),
  },
];
