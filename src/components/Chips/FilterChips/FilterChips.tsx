import { Children, forwardRef, isValidElement, useCallback, useMemo, useRef, useState } from 'react';
import type { ForwardRefExoticComponent, KeyboardEvent, PropsWithoutRef, RefAttributes } from 'react';

import { refSetter } from '#src/utils/refSetter';

import { FilterChipsContext, type FilterChipsContextValue } from './context';
import { FilterChipsItem } from './FilterChipsItem';
import { getItemValue } from './getItemValue';
import { ContainerFilterChips } from './style';
import type { FilterChipsItemProps, FilterChipsProps } from './types';

type FilterChipsCompound = ForwardRefExoticComponent<
  PropsWithoutRef<FilterChipsProps> & RefAttributes<HTMLDivElement>
> & {
  Item: typeof FilterChipsItem;
};

/** Группа выбора с циклической клавиатурной навигацией между прямыми дочерними FilterChips.Item. */
export const FilterChips = forwardRef<HTMLDivElement, FilterChipsProps>(
  (
    {
      children,
      dimension = 'm',
      gap,
      disabled = false,
      exclusive,
      value,
      defaultValue,
      onChange,
      onKeyDown,
      onFocusCapture,
      onBlurCapture,
      ...containerProps
    },
    ref,
  ) => {
    // Текущий фокус сохраняет Tab-остановку, пока он находится внутри группы.
    const [focusWithin, setFocusWithin] = useState(false);
    const [focusedId, setFocusedId] = useState<string | null>(null);
    const [uncontrolledValue, setUncontrolledValue] = useState<string | string[] | null>(
      defaultValue ?? (exclusive ? null : []),
    );

    const uncontrolledMode = value === undefined;
    const selectedValue = uncontrolledMode ? uncontrolledValue : value;

    const containerRef = useRef<HTMLDivElement>(null);
    // Хранит фокусируемые узлы Item по значению выбора для навигации с клавиатуры.
    const itemsRef = useRef(new Map<string, HTMLDivElement>());

    // Только доступные для навигации Item; уникальность проверяется и для отключённых элементов.
    const navigableItemIds = useMemo(() => {
      const seen = new Set<string>();
      const ids: string[] = [];

      for (const child of Children.toArray(children)) {
        if (!isValidElement<FilterChipsItemProps>(child) || child.type !== FilterChipsItem) continue;

        // Значение выбора: id, если он задан, иначе содержимое Item.
        const id = getItemValue(child.props);
        if (seen.has(id)) {
          throw new Error(`FilterChips.Item value "${id}" must be unique in its group`);
        }

        seen.add(id);
        if (!disabled && !child.props.disabled) ids.push(id);
      }

      return ids;
    }, [children, disabled]);

    // При входе в группу Tab попадает на выбранный Item или на первый доступный.
    const entryId =
      navigableItemIds.find((id) =>
        exclusive ? selectedValue === id : Array.isArray(selectedValue) && selectedValue.includes(id),
      ) ??
      navigableItemIds[0] ??
      null;
    // Пока фокус внутри группы, Tab-остановкой остаётся текущий Item.
    const tabbableId = focusWithin && focusedId && navigableItemIds.includes(focusedId) ? focusedId : entryId;

    const registerItem = useCallback((id: string, node: HTMLDivElement | null) => {
      if (node) itemsRef.current.set(id, node);
      else itemsRef.current.delete(id);
    }, []);

    const context = useMemo<FilterChipsContextValue>(
      () => ({
        dimension,
        disabled,
        tabbableId,
        registerItem,
        isSelected: (id) =>
          exclusive ? selectedValue === id : Array.isArray(selectedValue) && selectedValue.includes(id),
        select: (id, event) => {
          if (disabled) return;

          if (exclusive) {
            const nextValue = selectedValue === id ? null : id;
            if (uncontrolledMode) setUncontrolledValue(nextValue);

            onChange?.(event, nextValue);
          } else if (Array.isArray(selectedValue)) {
            const nextValue = selectedValue.includes(id)
              ? selectedValue.filter((selectedId) => selectedId !== id)
              : [...selectedValue, id];

            if (uncontrolledMode) setUncontrolledValue(nextValue);

            onChange?.(event, nextValue);
          }
        },
      }),
      [dimension, disabled, tabbableId, registerItem, exclusive, selectedValue, onChange, uncontrolledMode],
    );

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (navigableItemIds.length === 0) return;

      const currentId = Array.from(itemsRef.current).find(([, node]) => node === event.target)?.[0];
      if (!currentId) return;

      const currentIndex = navigableItemIds.indexOf(currentId);
      if (currentIndex < 0) return;

      let nextIndex: number;

      switch (event.key) {
        case 'ArrowRight':
          nextIndex = (currentIndex + 1) % navigableItemIds.length;
          break;
        case 'ArrowLeft':
          nextIndex = (currentIndex - 1 + navigableItemIds.length) % navigableItemIds.length;
          break;
        case 'Home':
          nextIndex = 0;
          break;
        case 'End':
          nextIndex = navigableItemIds.length - 1;
          break;
        default:
          return;
      }

      const nextId = navigableItemIds[nextIndex];
      const nextNode = itemsRef.current.get(nextId);

      if (!nextNode) return;

      event.preventDefault();
      setFocusedId(nextId);
      nextNode.focus();
    };

    return (
      <FilterChipsContext.Provider value={context}>
        <ContainerFilterChips
          role="group"
          aria-disabled={disabled || undefined}
          {...containerProps}
          ref={refSetter(containerRef, ref)}
          $dimension={dimension}
          $gap={gap}
          onKeyDown={handleKeyDown}
          onFocusCapture={(event) => {
            onFocusCapture?.(event);
            const id = Array.from(itemsRef.current).find(([, node]) => node === event.target)?.[0];
            setFocusWithin(!!id);
            setFocusedId(id ?? null);
          }}
          onBlurCapture={(event) => {
            onBlurCapture?.(event);
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
              setFocusWithin(false);
              setFocusedId(null);
            }
          }}
        >
          {children}
        </ContainerFilterChips>
      </FilterChipsContext.Provider>
    );
  },
) as FilterChipsCompound;

FilterChips.Item = FilterChipsItem;
FilterChips.displayName = 'FilterChips';
