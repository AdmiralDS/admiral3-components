import { forwardRef } from 'react';

import { LIST_GAP } from './constants';
import { OrderedListComponent } from './style';
import type { OrderedListProps } from './types';

/**
 * OrderedList – компонент для вертикальной группировки связанных по смыслу текстовых пунктов. OrderedList следует использовать, если вам необходим упорядоченный, пронумерованный список.
 *
 * Компонент представлен в двух видах (Numbers и Letters) и двух размерах (S и M). В списках Letters можно использовать как прописные (lower-letters), так и заглавные буквы (upper-letters).
 */
export const OrderedList = forwardRef<HTMLOListElement, OrderedListProps>(
  ({ children, dimension = 'm', styleType = 'numbers', gap = LIST_GAP, markerCssMixin, ...props }, ref) => {
    return (
      <OrderedListComponent
        ref={ref}
        role="list"
        data-dimension={dimension}
        $dimension={dimension}
        $styleType={styleType}
        $gap={gap}
        $markerCssMixin={markerCssMixin}
        {...props}
      >
        {children}
      </OrderedListComponent>
    );
  },
);
OrderedList.displayName = 'OrderedList';
