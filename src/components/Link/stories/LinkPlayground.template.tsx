import { ServiceShareOutline } from '@admiral-ds/admiral3-icons';

import { Link, type LinkProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer } from '../../stories/StoryContainers';

export const LinkPlaygroundTemplate = (args: LinkProps) => {
  return (
    <StoryDemoContainer>
      <Link {...args}>
        {args.children}
        <ServiceShareOutline />
      </Link>
    </StoryDemoContainer>
  );
};
