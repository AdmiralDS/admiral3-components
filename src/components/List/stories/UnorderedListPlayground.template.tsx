import { SystemStarSolid } from '@admiral-ds/admiral3-icons';

import { UnorderedList, ListItem, ListIcon, type UnorderedListProps } from '@admiral-ds/admiral3-primitives';

import { StoryDemoContainer } from '../../stories/StoryContainers';

export const UnorderedListPlaygroundTemplate = ({ styleType, ...props }: UnorderedListProps) => {
  const withIcon = styleType === 'icon';
  return (
    <StoryDemoContainer>
      <UnorderedList {...props} styleType={styleType}>
        <ListItem>{withIcon && <ListIcon as={SystemStarSolid} />}Текст строки</ListItem>
        <ListItem>{withIcon && <ListIcon as={SystemStarSolid} />}Текст строки</ListItem>
        <ListItem>{withIcon && <ListIcon as={SystemStarSolid} />}Текст строки</ListItem>
        <ListItem>{withIcon && <ListIcon as={SystemStarSolid} />}Текст строки</ListItem>
      </UnorderedList>
    </StoryDemoContainer>
  );
};
