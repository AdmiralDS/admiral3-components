import { forwardRef, type AnchorHTMLAttributes } from 'react';

import { Link } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

interface RouterLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  to: string;
}

const RouterLink = forwardRef<HTMLAnchorElement, RouterLinkProps>(({ to, ...props }, ref) => (
  <a {...props} href={to} ref={ref} />
));

export const LinkAsPropTemplate = () => (
  <StoryDemoContainer $direction="column" $gap="16px">
    <StoryDemoDescription>
      По умолчанию Link возвращает стандартный HTML-элемент <code>a</code>. Параметр <code>as</code> позволяет передать
      компонент библиотеки роутинга, который также рендерит HTML-ссылку и пробрасывает ref в неё.
    </StoryDemoDescription>
    <Link as={RouterLink} to="/profile">
      Render RouterLink instead of anchor
    </Link>
  </StoryDemoContainer>
);
