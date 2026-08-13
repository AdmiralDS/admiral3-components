import { Children, Fragment, forwardRef, isValidElement, type ReactNode, useMemo } from 'react';

import { LIST_GAP } from './constants';
import { ListItem } from './ListItem';
import { OrderedListComponent } from './style';
import type { OrderedListProps } from './types';

const countListItems = (children: ReactNode): number =>
  Children.toArray(children).reduce<number>((count, child) => {
    if (!isValidElement<{ children?: ReactNode }>(child)) return count;
    if (child.type === Fragment) return count + countListItems(child.props.children);
    return count + (child.type === ListItem || child.type === 'li' ? 1 : 0);
  }, 0);

/**
 * OrderedList – компонент для вертикальной группировки связанных по смыслу текстовых пунктов. OrderedList следует использовать, если вам необходим упорядоченный, пронумерованный список.
 *
 * Компонент представлен в двух видах (Numbers и Letters) и двух размерах (S и M). В списках Letters можно использовать как прописные (lower-letters), так и заглавные буквы (upper-letters).
 */
export const OrderedList = forwardRef<HTMLOListElement, OrderedListProps>(
  (
    { children, dimension = 'm', styleType = 'numbers', gap = LIST_GAP, markerCssMixin, reversed, start, ...props },
    ref,
  ) => {
    const counterReset = useMemo(
      () => (reversed ? (start ?? countListItems(children)) + 1 : (start ?? 1) - 1),
      [children, reversed, start],
    );

    return (
      <OrderedListComponent
        ref={ref}
        role="list"
        data-dimension={dimension}
        $dimension={dimension}
        $styleType={styleType}
        $gap={gap}
        $markerCssMixin={markerCssMixin}
        $counterReset={counterReset}
        reversed={reversed}
        start={start}
        {...props}
      >
        {children}
      </OrderedListComponent>
    );
  },
);
OrderedList.displayName = 'OrderedList';
