import { forwardRef } from 'react';

import { LIST_GAP } from './constants';
import { UnorderedListComponent } from './style';
import type { UnorderedListProps } from './types';

/**
 * UnorderedList – компонент для вертикальной группировки связанных по смыслу текстовых пунктов. UnorderedList следует использовать, если вам необходим неупорядоченный список, когда смысл списка не меняется в зависимости от порядка элементов.
 *
 * Компонент представлен в трех видах (Bullet, Virgule, Icon) и двух размерах (S и M).
 **/
export const UnorderedList = forwardRef<HTMLUListElement, UnorderedListProps>(
  ({ children, dimension = 'm', styleType = 'bullet', gap = LIST_GAP, markerCssMixin, ...props }, ref) => {
    return (
      <UnorderedListComponent
        ref={ref}
        data-dimension={dimension}
        $dimension={dimension}
        $styleType={styleType}
        $gap={gap}
        $markerCssMixin={markerCssMixin}
        {...props}
      >
        {children}
      </UnorderedListComponent>
    );
  },
);
UnorderedList.displayName = 'UnorderedList';
