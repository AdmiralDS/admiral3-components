import { UnorderedList, ListItem, type UnorderedListProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

export const ListMultiLineTemplate = (props: UnorderedListProps) => {
  return (
    <StoryDemoContainer $direction="column" $gap="24px">
      <StoryDemoDescription>
        Пользователь может настроить необходимую ширину компонента самостоятельно, например, через атрибут{' '}
        <code>style</code>. По умолчанию компонент подстраивается под размеры родительского элемента.
      </StoryDemoDescription>
      <UnorderedList style={{ maxWidth: '500px' }} {...props}>
        <ListItem>First, let's set up your Segment Unify space. We'll take you to Segment to do this.</ListItem>
        <ListItem>
          The segment uses IDs to find customer profiles. Give your IDs display names and select IDs to use when
          automatically finding profiles.
        </ListItem>
        <ListItem>
          Customer profiles in your Segment Unify space can include a large number of traits. Select the traits you want
          to make available to Flex agents and give them display names.
        </ListItem>
      </UnorderedList>
    </StoryDemoContainer>
  );
};
