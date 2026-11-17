import { forwardRef, useContext, useLayoutEffect, useMemo, useRef } from 'react';
import type { KeyboardEvent, MouseEvent } from 'react';

import { refSetter } from '#src/utils/refSetter';

import { FilterChipsContext } from './context';
import type { FilterChipsItemProps } from './types';
import { SelectableChip } from '../SelectableChip';

export const FilterChipsItem = forwardRef<HTMLDivElement, FilterChipsItemProps>((itemProps, ref) => {
  const { value, dimension, disabled, readOnly, onClick, onKeyDown, onKeyDownCapture, ...chipsProps } = itemProps;
  const group = useContext(FilterChipsContext);
  if (!group) throw new Error('FilterChips.Item must be used inside FilterChips');
  const { focusableItemValue, isSelected, registerItem, select, updateItem } = group;

  // Корневой узел SelectableChip используется для фокуса и навигации группы.
  const itemRef = useRef<HTMLDivElement | null>(null);
  // Блокировка группы и элемента вместе определяет доступность Item для навигации.
  const currentDisabled = disabled || group.disabled;
  // readOnly дополнительно запрещает действие, но не исключает Item из навигации.
  const eventsDisabled = currentDisabled || readOnly;
  const mergedRef = useMemo(() => refSetter(ref, itemRef), [ref]);

  useLayoutEffect(() => registerItem(value, itemRef, currentDisabled), [currentDisabled, registerItem, value]);

  useLayoutEffect(() => {
    updateItem(value, currentDisabled);
  }, [currentDisabled, updateItem, value]);

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    if (eventsDisabled) return;

    onClick?.(event);
    if (event.defaultPrevented) return;

    itemRef.current?.focus();
    select(value, event);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);

    if (event.key === 'Enter' || event.key === ' ') {
      // Только Space выбирает Item; пользовательский обработчик может отменить выбор.
      const shouldSelect = event.key === ' ' && !eventsDisabled && !event.defaultPrevented;

      event.preventDefault();
      if (shouldSelect) select(value, event);
    }
  };

  return (
    <SelectableChip
      {...chipsProps}
      ref={mergedRef}
      dimension={dimension ?? group.dimension}
      disabled={currentDisabled}
      readOnly={readOnly}
      selected={isSelected(value)}
      tabIndex={currentDisabled || focusableItemValue !== value ? -1 : 0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onKeyDownCapture={eventsDisabled ? undefined : onKeyDownCapture}
    />
  );
});

FilterChipsItem.displayName = 'FilterChips.Item';
