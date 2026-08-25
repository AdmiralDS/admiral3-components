import { ServiceShareOutline } from '@admiral-ds/admiral3-icons';
import styled from 'styled-components';

import { Link, type LinkProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

const LinkList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
`;

export const LinkIconTemplate = (args: LinkProps) => (
  <StoryDemoContainer $direction="column" $gap="16px">
    <StoryDemoDescription>
      Для дополнительного акцента ссылка может содержать иконку. В зависимости от контекста иконка располагается в
      начале или в конце ссылки.
    </StoryDemoDescription>
    <LinkList>
      <Link {...args}>
        <ServiceShareOutline />
        Link
      </Link>
      <Link {...args}>
        Link
        <ServiceShareOutline />
      </Link>
    </LinkList>
  </StoryDemoContainer>
);
