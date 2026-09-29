import type { FilterChipsItemProps } from './types';

export const getItemValue = ({ id, children }: FilterChipsItemProps): string => {
  if (id !== undefined) {
    if (!id) throw new Error('FilterChips.Item id must not be empty');
    return id;
  }

  if (typeof children === 'number') return String(children);
  if (typeof children === 'string' && children.trim()) return children;

  throw new Error('FilterChips.Item requires id when children is not non-empty text or a number');
};
