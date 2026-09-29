import { forwardRef, useContext, useRef } from 'react';
import type { KeyboardEvent, MouseEvent } from 'react';

import { refSetter } from '#src/utils/refSetter';

import { FilterChipsContext } from './context';
import { getItemValue } from './getItemValue';
import type { FilterChipsItemProps } from './types';
import { Chips } from '../Chips';

export const FilterChipsItem = forwardRef<HTMLDivElement, FilterChipsItemProps>((itemProps, ref) => {
  const { id, dimension, disabled, readOnly, onKeyDownCapture, ...chipsProps } = itemProps;
  const group = useContext(FilterChipsContext);
  if (!group) throw new Error('FilterChips.Item must be used inside FilterChips');
  // Значение выбора: id, если он задан, иначе содержимое Item.
  const itemValue = getItemValue(itemProps);

  // Ссылка указывает на внутренний фокусируемый узел Chips, а не на его внешнюю обёртку.
  const itemRef = useRef<HTMLDivElement | null>(null);
  // Блокировка группы и элемента вместе определяет доступность Item для навигации.
  const currentDisabled = disabled || group.disabled;
  // readOnly дополнительно запрещает действие, но не исключает Item из навигации.
  const eventsDisabled = currentDisabled || readOnly;

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    if (eventsDisabled) return;

    itemRef.current?.focus();
    group.select(itemValue, event);
  };

  const handleKeyDownCapture = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!eventsDisabled) onKeyDownCapture?.(event);
    if (event.key !== 'Enter' && event.key !== ' ') return;
    if (!eventsDisabled) chipsProps.onKeyDown?.(event);
    // Только Space выбирает Item; пользовательский обработчик может отменить выбор.
    const shouldSelect = event.key === ' ' && !eventsDisabled && !event.defaultPrevented;

    event.preventDefault();
    event.stopPropagation();
    if (shouldSelect) group.select(itemValue, event);
  };

  return (
    <Chips
      {...chipsProps}
      id={id}
      ref={(chipNode) => {
        // Фокусируемый узел регистрируется в группе для перемещения стрелками, Home и End.
        const focusable = chipNode?.querySelector<HTMLDivElement>('[role="button"][tabindex]') ?? null;
        refSetter(ref, itemRef, (node) => group.registerItem(itemValue, node))(focusable);
      }}
      dimension={dimension ?? group.dimension}
      disabled={currentDisabled}
      readOnly={readOnly}
      selected={group.isSelected(itemValue)}
      tabIndex={currentDisabled || group.tabbableId !== itemValue ? -1 : 0}
      onClick={handleClick}
      onKeyDownCapture={handleKeyDownCapture}
    />
  );
});

FilterChipsItem.displayName = 'FilterChips.Item';
