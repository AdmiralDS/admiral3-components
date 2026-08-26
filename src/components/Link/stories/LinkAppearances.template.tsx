import { Link, type LinkProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer } from '../../stories/StoryContainers';
import { LINK_APPEARANCES } from '../constants';

export const LinkAppearancesTemplate = (args: LinkProps) => (
  <StoryDemoContainer $gap="16px">
    {LINK_APPEARANCES.map((appearance) => (
      <Link {...args} key={appearance} appearance={appearance}>
        Link {appearance}
      </Link>
    ))}
  </StoryDemoContainer>
);
