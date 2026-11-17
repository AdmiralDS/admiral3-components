import { Children, forwardRef, isValidElement, useCallback, useMemo, useRef, useState } from 'react';
import type { FocusEvent, ForwardRefExoticComponent, KeyboardEvent, PropsWithoutRef, RefAttributes } from 'react';

import { useRovingFocus } from '#src/hooks/useRovingFocus';
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
    const [uncontrolledValue, setUncontrolledValue] = useState<string | string[] | null>(
      defaultValue ?? (exclusive ? null : []),
    );

    const uncontrolledMode = value === undefined;
    const selectedValue = uncontrolledMode ? uncontrolledValue : value;

    const containerRef = useRef<HTMLDivElement>(null);

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
    const {
      focusableItemId,
      registerItem: registerRovingItem,
      updateItem: updateRovingItem,
      onBlur: handleRovingBlur,
      onFocus: handleRovingFocus,
      onKeyDown: handleRovingKeyDown,
    } = useRovingFocus<HTMLDivElement, string>({
      containerRef,
      entryItemId: entryValue,
    });

    const registerItem = useCallback<FilterChipsContextValue['registerItem']>(
      (itemValue, itemRef, itemDisabled) => registerRovingItem({ id: itemValue, ref: itemRef, disabled: itemDisabled }),
      [registerRovingItem],
    );
    const updateItem = useCallback<FilterChipsContextValue['updateItem']>(
      (itemValue, itemDisabled) => updateRovingItem(itemValue, { disabled: itemDisabled }),
      [updateRovingItem],
    );

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
        focusableItemValue: focusableItemId,
        registerItem,
        updateItem,
        isSelected,
        select,
      }),
      [dimension, disabled, focusableItemId, registerItem, updateItem, isSelected, select],
    );

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      handleRovingKeyDown(event);
    };

    const handleFocusCapture = (event: FocusEvent<HTMLDivElement>) => {
      onFocusCapture?.(event);
      if (!event.defaultPrevented) handleRovingFocus(event);
    };

    const handleBlurCapture = (event: FocusEvent<HTMLDivElement>) => {
      onBlurCapture?.(event);
      handleRovingBlur(event);
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
