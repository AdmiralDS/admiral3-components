import { Children, forwardRef, isValidElement, useCallback, useMemo, useRef, useState } from 'react';
import type { FocusEvent, ForwardRefExoticComponent, KeyboardEvent, PropsWithoutRef, RefAttributes } from 'react';

import { refSetter } from '#src/utils/refSetter';

import { FilterChipsContext, type FilterChipsContextValue } from './context';
import { FilterChipsItem } from './FilterChipsItem';
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
    const [focusedValue, setFocusedValue] = useState<string | null>(null);
    const [uncontrolledValue, setUncontrolledValue] = useState<string | string[] | null>(
      defaultValue ?? (exclusive ? null : []),
    );

    const uncontrolledMode = value === undefined;
    const selectedValue = uncontrolledMode ? uncontrolledValue : value;

    const containerRef = useRef<HTMLDivElement>(null);
    // Хранит фокусируемые узлы Item по значению выбора для навигации с клавиатуры.
    const itemsRef = useRef(new Map<string, HTMLDivElement>());

    // Только доступные для навигации Item; уникальность проверяется и для отключённых элементов.
    const navigableItemValues = useMemo(() => {
      const seen = new Set<string>();
      const values: string[] = [];

      for (const child of Children.toArray(children)) {
        if (!isValidElement<FilterChipsItemProps>(child) || child.type !== FilterChipsItem) continue;

        const itemValue = child.props.value;
        if (seen.has(itemValue)) {
          throw new Error(`FilterChips.Item value "${itemValue}" must be unique in its group`);
        }

        seen.add(itemValue);
        if (!disabled && !child.props.disabled) values.push(itemValue);
      }

      return values;
    }, [children, disabled]);

    // Проверка выбора используется контекстом и при определении Tab-остановки.
    const isSelected = useCallback<FilterChipsContextValue['isSelected']>(
      (itemValue) =>
        exclusive ? selectedValue === itemValue : Array.isArray(selectedValue) && selectedValue.includes(itemValue),
      [exclusive, selectedValue],
    );
    // При входе в группу Tab попадает на выбранный Item или на первый доступный.
    const entryValue = navigableItemValues.find(isSelected) ?? navigableItemValues[0] ?? null;
    // Пока фокус внутри группы, Tab-остановкой остаётся текущий Item.
    const tabbableValue =
      focusWithin && focusedValue !== null && navigableItemValues.includes(focusedValue) ? focusedValue : entryValue;

    const registerItem = useCallback((itemValue: string, node: HTMLDivElement | null) => {
      if (node) itemsRef.current.set(itemValue, node);
      else itemsRef.current.delete(itemValue);
    }, []);

    // Переключает выбор и уведомляет пользователя в обоих режимах управления.
    const select = useCallback<FilterChipsContextValue['select']>(
      (itemValue, event) => {
        if (disabled) return;

        if (exclusive) {
          const nextValue = selectedValue === itemValue ? null : itemValue;
          if (uncontrolledMode) setUncontrolledValue(nextValue);

          onChange?.(event, nextValue);
        } else if (Array.isArray(selectedValue)) {
          const nextValue = selectedValue.includes(itemValue)
            ? selectedValue.filter((value) => value !== itemValue)
            : [...selectedValue, itemValue];

          if (uncontrolledMode) setUncontrolledValue(nextValue);

          onChange?.(event, nextValue);
        }
      },
      [disabled, exclusive, selectedValue, onChange, uncontrolledMode],
    );

    const context = useMemo<FilterChipsContextValue>(
      () => ({
        dimension,
        disabled,
        tabbableValue,
        registerItem,
        isSelected,
        select,
      }),
      [dimension, disabled, tabbableValue, registerItem, isSelected, select],
    );

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (navigableItemValues.length === 0) return;

      const currentValue = Array.from(itemsRef.current).find(([, node]) => node === event.target)?.[0];
      if (currentValue === undefined) return;

      const currentIndex = navigableItemValues.indexOf(currentValue);
      if (currentIndex < 0) return;

      let nextIndex: number;

      switch (event.key) {
        case 'ArrowRight':
          nextIndex = (currentIndex + 1) % navigableItemValues.length;
          break;
        case 'ArrowLeft':
          nextIndex = (currentIndex - 1 + navigableItemValues.length) % navigableItemValues.length;
          break;
        case 'Home':
          nextIndex = 0;
          break;
        case 'End':
          nextIndex = navigableItemValues.length - 1;
          break;
        default:
          return;
      }

      const nextValue = navigableItemValues[nextIndex];
      const nextNode = itemsRef.current.get(nextValue);

      if (!nextNode) return;

      event.preventDefault();
      setFocusedValue(nextValue);
      nextNode.focus();
    };

    const handleFocusCapture = (event: FocusEvent<HTMLDivElement>) => {
      onFocusCapture?.(event);
      const itemValue = Array.from(itemsRef.current).find(([, node]) => node === event.target)?.[0];
      setFocusWithin(itemValue !== undefined);
      setFocusedValue(itemValue ?? null);
    };

    const handleBlurCapture = (event: FocusEvent<HTMLDivElement>) => {
      onBlurCapture?.(event);
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
        setFocusWithin(false);
        setFocusedValue(null);
      }
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
          onFocusCapture={handleFocusCapture}
          onBlurCapture={handleBlurCapture}
        >
          {children}
        </ContainerFilterChips>
      </FilterChipsContext.Provider>
    );
  },
) as FilterChipsCompound;

FilterChips.Item = FilterChipsItem;
FilterChips.displayName = 'FilterChips';
