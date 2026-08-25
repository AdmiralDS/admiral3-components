import { Link, type LinkProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer } from '../../stories/StoryContainers';
import { LINK_DIMENSIONS } from '../constants';

export const LinkSizesTemplate = (args: LinkProps) => (
  <StoryDemoContainer $gap="16px">
    {LINK_DIMENSIONS.map((dimension) => (
      <Link {...args} key={dimension} dimension={dimension}>
        Link {dimension}
      </Link>
    ))}
  </StoryDemoContainer>
);
