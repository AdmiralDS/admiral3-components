import { SystemStarSolid } from '@admiral-ds/admiral3-icons';

import { ListIcon, ListItem, UnorderedList } from '@admiral-ds/admiral3-primitives';

export const ListIconDirtyTemplate = () => (
  <UnorderedList data-testid="icon-list" dimension="s" styleType="icon">
    <ListItem>
      <ListIcon as={SystemStarSolid} color="rgb(255, 0, 0)" data-testid="list-icon" />
      Пункт с иконкой
    </ListItem>
    <ListItem>
      <ListIcon as={SystemStarSolid} data-testid="default-list-icon" />
      Пункт с иконкой цвета по умолчанию
    </ListItem>
  </UnorderedList>
);
