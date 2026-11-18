import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type RefObject,
} from 'react';

export type RovingFocusNavigationAxis = 'horizontal' | 'vertical' | 'both';
export type RovingFocusItemId = string | number;

export interface RovingFocusItem<T extends HTMLElement, Id extends RovingFocusItemId = RovingFocusItemId> {
  id: Id;
  ref: RefObject<T | null>;
  disabled?: boolean;
}

export interface UseRovingFocusOptions<T extends HTMLElement, Id extends RovingFocusItemId = RovingFocusItemId> {
  containerRef: RefObject<HTMLElement | null>;
  /**
   * Ось клавиатурного обхода. По умолчанию horizontal.
   * Элементы обходятся в DOM-порядке. CSS order и визуальные перестановки его не меняют.
   * both включает обе пары стрелок для одного линейного списка, без навигации по сетке.
   */
  navigationAxis?: RovingFocusNavigationAxis;
  /**
   * Предпочтительный элемент для первого и повторного входа через Tab и для восстановления фокуса.
   * Если он недоступен, выбирается первый доступный в DOM-порядке.
   * Пока фокус находится в группе, изменение entryItemId само по себе его не перемещает.
   * Без entryItemId при повторном входе сохраняется последняя доступная Tab-остановка.
   */
  entryItemId?: Id | null;
  loop?: boolean;
  preventScroll?: boolean;
  fallbackRef?: RefObject<HTMLElement | null>;
  isItemAvailable?: (item: RovingFocusItem<T, Id>) => boolean;
  onMoveFocus?: (item: RovingFocusItem<T, Id>) => void;
}

export interface UseRovingFocusResult<T extends HTMLElement, Id extends RovingFocusItemId = RovingFocusItemId> {
  focusableItemId: Id | null;
  /** Регистрирует элемент и возвращает cleanup. Ссылка функции сохраняется при смене настроек навигации. */
  registerItem: (item: RovingFocusItem<T, Id>) => () => void;
  /** Обновляет состояние элемента, сохраняя идентичность его регистрации. */
  updateItem: (id: Id, state: Pick<RovingFocusItem<T, Id>, 'disabled'>) => void;
  getItemTabIndex: (id: Id) => 0 | -1;
  getItems: (availableOnly?: boolean) => RovingFocusItem<T, Id>[];
  getItemById: (id: Id) => RovingFocusItem<T, Id> | undefined;
  getItemByTarget: (target: EventTarget | null, availableOnly?: boolean) => RovingFocusItem<T, Id> | undefined;
  onFocus: (event: FocusEvent<HTMLElement>) => void;
  onBlur: (event: FocusEvent<HTMLElement>) => void;
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
}

interface RegisteredItem<T extends HTMLElement, Id extends RovingFocusItemId> extends RovingFocusItem<T, Id> {
  /** Номер конкретной регистрации. Сохраняется при updateItem, меняется при новом registerItem. */
  registrationId: number;
}

interface RegistryState<T extends HTMLElement, Id extends RovingFocusItemId> {
  items: Map<Id, RegisteredItem<T, Id>>;
  focusableItemId: Id | null;
}

const compareElements = (first: HTMLElement | null, second: HTMLElement | null) => {
  if (!first || !second || first === second) return 0;
  const position = first.compareDocumentPosition(second);
  const ownerWindow = first.ownerDocument.defaultView;
  if (!ownerWindow) return 0;
  if (position & ownerWindow.Node.DOCUMENT_POSITION_FOLLOWING) return -1;
  if (position & ownerWindow.Node.DOCUMENT_POSITION_PRECEDING) return 1;
  return 0;
};

const isDefaultItemAvailable = <T extends HTMLElement, Id extends RovingFocusItemId>(item: RovingFocusItem<T, Id>) =>
  !item.disabled && Boolean(item.ref.current?.isConnected);

/** Управляет единственной Tab-остановкой и клавиатурным обходом зарегистрированных элементов группы. */
export const useRovingFocus = <T extends HTMLElement, Id extends RovingFocusItemId = RovingFocusItemId>({
  containerRef,
  navigationAxis = 'horizontal',
  entryItemId = null,
  loop = true,
  preventScroll = false,
  fallbackRef,
  isItemAvailable = isDefaultItemAvailable,
  onMoveFocus,
}: UseRovingFocusOptions<T, Id>): UseRovingFocusResult<T, Id> => {
  const focusedItemIdRef = useRef<Id | null>(null);
  const focusTransferFromIdRef = useRef<Id | null>(null);
  const registrationCounterRef = useRef(0);
  const registrationOwnersRef = useRef(new Map<Id, number>());
  const entryItemIdRef = useRef(entryItemId);
  const availabilityRef = useRef(isItemAvailable);
  const synchronizeFocusRef = useRef<(() => void) | null>(null);

  // Настройки меняются независимо от времени жизни регистрации.
  useLayoutEffect(() => {
    availabilityRef.current = isItemAvailable;
    entryItemIdRef.current = entryItemId;
  }, [entryItemId, isItemAvailable]);

  const checkItemAvailable = useCallback((item: RovingFocusItem<T, Id>) => availabilityRef.current(item), []);
  const [registry, setRegistry] = useState<RegistryState<T, Id>>(() => ({
    items: new Map(),
    focusableItemId: null,
  }));

  const sortItems = useCallback(
    (items: Iterable<RovingFocusItem<T, Id>>, availableOnly = false) => {
      const itemList = Array.from(items);
      const itemsToSort = availableOnly ? itemList.filter(checkItemAvailable) : itemList;
      return itemsToSort.sort((first, second) => compareElements(first.ref.current, second.ref.current));
    },
    [checkItemAvailable],
  );

  const normalizeRegistry = useCallback(
    (items: Map<Id, RegisteredItem<T, Id>>, preferredId: Id | null): RegistryState<T, Id> => {
      const availableItems = sortItems(items.values(), true);
      const focusableItemId = availableItems.some((item) => item.id === preferredId)
        ? preferredId
        : (availableItems[0]?.id ?? null);
      return { items, focusableItemId };
    },
    [sortItems],
  );

  const registerItem = useCallback(
    (item: RovingFocusItem<T, Id>) => {
      const registrationId = ++registrationCounterRef.current;
      registrationOwnersRef.current.set(item.id, registrationId);
      const element = item.ref.current;
      const alreadyFocused = element?.ownerDocument.activeElement === element;
      if (alreadyFocused && checkItemAvailable(item)) {
        focusedItemIdRef.current = item.id;
        if (focusTransferFromIdRef.current === item.id) focusTransferFromIdRef.current = null;
      }

      setRegistry((current) => {
        const items = new Map(current.items);
        items.set(item.id, { ...item, registrationId });
        return normalizeRegistry(items, focusedItemIdRef.current ?? entryItemIdRef.current ?? current.focusableItemId);
      });

      return () => {
        if (registrationOwnersRef.current.get(item.id) !== registrationId) return;
        registrationOwnersRef.current.delete(item.id);
        if (focusedItemIdRef.current === item.id) {
          focusTransferFromIdRef.current = item.id;
          focusedItemIdRef.current = null;
        }
        setRegistry((current) => {
          if (current.items.get(item.id)?.registrationId !== registrationId) return current;
          const items = new Map(current.items);
          items.delete(item.id);
          return normalizeRegistry(items, focusedItemIdRef.current ?? current.focusableItemId);
        });
      };
    },
    [checkItemAvailable, normalizeRegistry],
  );

  const updateItem = useCallback(
    (id: Id, state: Pick<RovingFocusItem<T, Id>, 'disabled'>) => {
      if (state.disabled && focusedItemIdRef.current === id) {
        focusTransferFromIdRef.current = id;
        focusedItemIdRef.current = null;
      }
      setRegistry((current) => {
        const item = current.items.get(id);
        if (!item || item.disabled === state.disabled) return current;
        const items = new Map(current.items);
        items.set(id, { ...item, ...state });
        return normalizeRegistry(items, focusedItemIdRef.current ?? entryItemIdRef.current ?? current.focusableItemId);
      });
    },
    [normalizeRegistry],
  );

  const synchronizeFocus = useCallback(() => {
    const availableItems = sortItems(registry.items.values(), true);
    const focusedItemId = focusedItemIdRef.current;
    const registeredFocusedItem = focusedItemId === null ? undefined : registry.items.get(focusedItemId);
    const focusedItem = availableItems.find((item) => item.id === focusedItemId);
    if (registeredFocusedItem && !focusedItem) {
      focusTransferFromIdRef.current = focusedItemId;
      focusedItemIdRef.current = null;
    }

    const preferredId = focusedItem?.id ?? entryItemId ?? registry.focusableItemId;
    const focusableItemId = availableItems.find((item) => item.id === preferredId)?.id ?? availableItems[0]?.id ?? null;
    if (focusableItemId !== registry.focusableItemId) {
      // Доступность зависит от DOM и проверяется после commit. Без изменений ререндер не нужен.
      setRegistry((current) => {
        const next = normalizeRegistry(
          current.items,
          focusedItemIdRef.current ?? entryItemId ?? current.focusableItemId,
        );
        return next.focusableItemId === current.focusableItemId ? current : next;
      });
    }

    const previousItemId = focusTransferFromIdRef.current;
    if (previousItemId === null) return;
    const previousItem = registry.items.get(previousItemId);
    // Обновление реестра из дочернего layout-эффекта может ещё ожидать следующего рендера.
    if (previousItem && isItemAvailable(previousItem)) return;
    focusTransferFromIdRef.current = null;

    const container = containerRef.current;
    const nextItem = availableItems.find((item) => item.id === entryItemId) ?? availableItems[0];
    const nextElement = nextItem?.ref.current;
    if (!container) return;
    const activeElement = container.ownerDocument.activeElement;
    const focusMovedOutside =
      activeElement !== null &&
      activeElement !== container.ownerDocument.body &&
      activeElement.isConnected &&
      !container.contains(activeElement);
    if (focusMovedOutside) return;

    if (nextItem && nextElement) {
      nextElement.focus({ preventScroll });
      focusedItemIdRef.current = nextItem.id;
      onMoveFocus?.(nextItem);
    } else {
      fallbackRef?.current?.focus({ preventScroll });
    }
  }, [
    containerRef,
    entryItemId,
    fallbackRef,
    isItemAvailable,
    normalizeRegistry,
    onMoveFocus,
    preventScroll,
    registry,
    sortItems,
  ]);

  useLayoutEffect(() => {
    synchronizeFocusRef.current = synchronizeFocus;
    synchronizeFocus();
  });

  useLayoutEffect(() => {
    const container = containerRef.current;
    const ownerWindow = container?.ownerDocument.defaultView;
    if (!container || !ownerWindow?.ResizeObserver) return;
    const observer = new ownerWindow.ResizeObserver(() => synchronizeFocusRef.current?.());
    observer.observe(container);
    return () => observer.disconnect();
  }, [containerRef]);

  const getItems = useCallback(
    (availableOnly = false) => sortItems(registry.items.values(), availableOnly),
    [registry.items, sortItems],
  );

  const getItemByTarget = useCallback(
    (target: EventTarget | null, availableOnly = true) => {
      const container = containerRef.current;
      const ownerWindow = container?.ownerDocument.defaultView;
      if (!ownerWindow || !(target instanceof ownerWindow.Node)) return undefined;
      return getItems(availableOnly).find((item) => item.ref.current?.contains(target));
    },
    [containerRef, getItems],
  );

  const onFocus = useCallback(
    (event: FocusEvent<HTMLElement>) => {
      const item = getItemByTarget(event.target);
      if (!item) return;
      focusedItemIdRef.current = item.id;
      focusTransferFromIdRef.current = null;
      setRegistry((current) =>
        current.focusableItemId === item.id ? current : { ...current, focusableItemId: item.id },
      );
    },
    [getItemByTarget],
  );

  const onBlur = useCallback(
    (event: FocusEvent<HTMLElement>) => {
      const item = getItemByTarget(event.target, false);
      // При замене или блокировке узла браузер может отправить blur без новой цели.
      // Сохраняем владельца фокуса до очистки регистрации и восстановления в layout-эффекте.
      const intentionalBlur =
        event.relatedTarget !== null || (event.target.isConnected && item !== undefined && isItemAvailable(item));
      if (intentionalBlur) {
        if (item?.id === focusedItemIdRef.current) focusedItemIdRef.current = null;
        focusTransferFromIdRef.current = null;
      }
      if (!event.currentTarget.contains(event.relatedTarget as Node | null) && entryItemId !== null) {
        const availableItems = getItems(true);
        const entryItem = availableItems.find((candidate) => candidate.id === entryItemId) ?? availableItems[0];
        setRegistry((current) => ({ ...current, focusableItemId: entryItem?.id ?? null }));
      }
    },
    [entryItemId, getItemByTarget, getItems, isItemAvailable],
  );

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      const currentItem = getItemByTarget(event.target);
      if (!currentItem) return;
      const items = getItems(true);
      const currentIndex = items.findIndex((item) => item.id === currentItem.id);
      if (currentIndex < 0) return;

      let nextIndex: number;
      switch (event.key) {
        case 'Home':
          nextIndex = 0;
          break;
        case 'End':
          nextIndex = items.length - 1;
          break;
        case 'ArrowLeft':
        case 'ArrowRight':
          if (navigationAxis === 'vertical') return;
          nextIndex = currentIndex + (event.key === 'ArrowLeft' ? -1 : 1);
          break;
        case 'ArrowUp':
        case 'ArrowDown':
          if (navigationAxis === 'horizontal') return;
          nextIndex = currentIndex + (event.key === 'ArrowUp' ? -1 : 1);
          break;
        default:
          return;
      }
      nextIndex = loop ? (nextIndex + items.length) % items.length : Math.max(0, Math.min(nextIndex, items.length - 1));

      const nextItem = items[nextIndex];
      const nextElement = nextItem?.ref.current;
      if (!nextItem || !nextElement) return;
      event.preventDefault();
      focusedItemIdRef.current = nextItem.id;
      setRegistry((current) => ({ ...current, focusableItemId: nextItem.id }));
      nextElement.focus({ preventScroll });
      onMoveFocus?.(nextItem);
    },
    [getItemByTarget, getItems, loop, navigationAxis, onMoveFocus, preventScroll],
  );

  return {
    focusableItemId: registry.focusableItemId,
    registerItem,
    updateItem,
    getItemTabIndex: (id) => (id === registry.focusableItemId ? 0 : -1),
    getItems,
    getItemById: (id) => registry.items.get(id),
    getItemByTarget,
    onFocus,
    onBlur,
    onKeyDown,
  };
};
