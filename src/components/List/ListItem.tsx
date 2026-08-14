import { forwardRef } from 'react';

import { ListItemComponent, ListItemContent } from './style';
import type { ListItemProps } from './types';

/**
 * Компонент для вертикальной группировки связанных по смыслу текстовых пунктов. Представлен в двух вариантах OrderedList и UnorderedList.
 * Рекомендации:
 * - Используйте список, если у вас есть два и более пунктов.
 * - Простые списки, разделенные запятыми, могут не нуждаться в разметке, но длинные списки или группы ссылок должны ее иметь.
 * - Организуйте списки так, чтобы пользователи могли понять взаимосвязь и группировку информации.
 * - Создавайте структурированные списки. Их легче использовать, чем простые таблицы.
 **/
export const ListItem = forwardRef<HTMLLIElement, ListItemProps>(({ children, ...props }, ref) => {
  return (
    <ListItemComponent ref={ref} role="listitem" {...props}>
      <ListItemContent>{children}</ListItemContent>
    </ListItemComponent>
  );
});
ListItem.displayName = 'ListItem';
