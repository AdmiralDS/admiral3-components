import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type RefObject,
} from 'react';

export type RovingFocusOrientation = 'horizontal' | 'vertical' | 'both';
export type RovingFocusItemId = string | number | symbol;

export interface RovingFocusItem<T extends HTMLElement, Id extends RovingFocusItemId = RovingFocusItemId> {
  id: Id;
  ref: RefObject<T | null>;
  disabled?: boolean;
}

export interface UseRovingFocusOptions<T extends HTMLElement, Id extends RovingFocusItemId = RovingFocusItemId> {
  containerRef: RefObject<HTMLElement | null>;
  orientation?: RovingFocusOrientation;
  entryItemId?: Id | null;
  loop?: boolean;
  preventScroll?: boolean;
  fallbackRef?: RefObject<HTMLElement | null>;
  isItemAvailable?: (item: RovingFocusItem<T, Id>) => boolean;
  onMoveFocus?: (item: RovingFocusItem<T, Id>) => void;
}

export interface UseRovingFocusResult<T extends HTMLElement, Id extends RovingFocusItemId = RovingFocusItemId> {
  focusableItemId: Id | null;
  registerItem: (item: RovingFocusItem<T, Id>) => () => void;
  updateItem: (id: Id, state: Pick<RovingFocusItem<T, Id>, 'disabled'>) => void;
  getItemTabIndex: (id: Id) => 0 | -1;
  getItems: (availableOnly?: boolean) => RovingFocusItem<T, Id>[];
  getItemById: (id: Id) => RovingFocusItem<T, Id> | undefined;
  getItemByTarget: (target: EventTarget | null, availableOnly?: boolean) => RovingFocusItem<T, Id> | undefined;
  onFocus: (event: FocusEvent<HTMLElement>) => void;
  onBlur: (event: FocusEvent<HTMLElement>) => void;
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
}

interface RegistryState<T extends HTMLElement, Id extends RovingFocusItemId> {
  items: Map<Id, RovingFocusItem<T, Id>>;
  focusableItemId: Id | null;
}

const compareElements = (first: HTMLElement | null, second: HTMLElement | null) => {
  if (!first || !second || first === second) return 0;
  const position = first.compareDocumentPosition(second);
  const NodeConstructor = first.ownerDocument.defaultView?.Node;
  if (!NodeConstructor) return 0;
  if (position & NodeConstructor.DOCUMENT_POSITION_FOLLOWING) return -1;
  if (position & NodeConstructor.DOCUMENT_POSITION_PRECEDING) return 1;
  return 0;
};

const isDefaultItemAvailable = <T extends HTMLElement, Id extends RovingFocusItemId>(item: RovingFocusItem<T, Id>) =>
  !item.disabled && Boolean(item.ref.current?.isConnected);

/** Управляет единственной Tab-остановкой и клавиатурным обходом зарегистрированных элементов группы. */
export const useRovingFocus = <T extends HTMLElement, Id extends RovingFocusItemId = RovingFocusItemId>({
  containerRef,
  orientation = 'horizontal',
  entryItemId = null,
  loop = true,
  preventScroll = false,
  fallbackRef,
  isItemAvailable = isDefaultItemAvailable,
  onMoveFocus,
}: UseRovingFocusOptions<T, Id>): UseRovingFocusResult<T, Id> => {
  const focusedItemIdRef = useRef<Id | null>(null);
  const focusTransferFromIdRef = useRef<Id | null>(null);
  const [registry, setRegistry] = useState<RegistryState<T, Id>>(() => ({
    items: new Map(),
    focusableItemId: null,
  }));

  const sortItems = useCallback(
    (items: Iterable<RovingFocusItem<T, Id>>, availableOnly = false) =>
      Array.from(items)
        .filter((item) => !availableOnly || isItemAvailable(item))
        .sort((first, second) => compareElements(first.ref.current, second.ref.current)),
    [isItemAvailable],
  );

  const normalizeRegistry = useCallback(
    (items: Map<Id, RovingFocusItem<T, Id>>, preferredId: Id | null): RegistryState<T, Id> => {
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
      const element = item.ref.current;
      const alreadyFocused = element?.ownerDocument.activeElement === element;
      if (alreadyFocused && isItemAvailable(item)) {
        focusedItemIdRef.current = item.id;
        if (focusTransferFromIdRef.current === item.id) focusTransferFromIdRef.current = null;
      }

      setRegistry((current) => {
        const items = new Map(current.items);
        items.set(item.id, item);
        return normalizeRegistry(items, focusedItemIdRef.current ?? entryItemId ?? current.focusableItemId);
      });

      return () => {
        if (focusedItemIdRef.current === item.id) {
          focusTransferFromIdRef.current = item.id;
          focusedItemIdRef.current = null;
        }
        setRegistry((current) => {
          if (current.items.get(item.id) !== item) return current;
          const items = new Map(current.items);
          items.delete(item.id);
          return normalizeRegistry(items, focusedItemIdRef.current ?? current.focusableItemId);
        });
      };
    },
    [entryItemId, isItemAvailable, normalizeRegistry],
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
        return normalizeRegistry(items, focusedItemIdRef.current ?? entryItemId ?? current.focusableItemId);
      });
    },
    [entryItemId, normalizeRegistry],
  );

  useLayoutEffect(() => {
    const previousItemId = focusTransferFromIdRef.current;
    if (previousItemId === null) return;
    const previousItem = registry.items.get(previousItemId);
    // Обновление реестра из дочернего layout-эффекта может ещё ожидать следующего рендера.
    if (previousItem && isItemAvailable(previousItem)) return;
    focusTransferFromIdRef.current = null;

    const container = containerRef.current;
    const availableItems = sortItems(registry.items.values(), true);
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
  }, [containerRef, entryItemId, fallbackRef, isItemAvailable, onMoveFocus, preventScroll, registry, sortItems]);

  const getItems = useCallback(
    (availableOnly = false) => sortItems(registry.items.values(), availableOnly),
    [registry.items, sortItems],
  );

  const getItemByTarget = useCallback(
    (target: EventTarget | null, availableOnly = true) => {
      const container = containerRef.current;
      const NodeConstructor = container?.ownerDocument.defaultView?.Node;
      if (!NodeConstructor || !(target instanceof NodeConstructor)) return undefined;
      return getItems(availableOnly).find((item) => item.ref.current?.contains(target));
    },
    [containerRef, getItems],
  );

  const setTabStop = useCallback(
    (focusableItemId: Id | null) => {
      getItems().forEach((item) => {
        const element = item.ref.current;
        if (element) element.tabIndex = item.id === focusableItemId ? 0 : -1;
      });
    },
    [getItems],
  );

  const onFocus = useCallback(
    (event: FocusEvent<HTMLElement>) => {
      const item = getItemByTarget(event.target);
      if (!item) return;
      focusedItemIdRef.current = item.id;
      focusTransferFromIdRef.current = null;
      setTabStop(item.id);
      setRegistry((current) =>
        current.focusableItemId === item.id ? current : { ...current, focusableItemId: item.id },
      );
    },
    [getItemByTarget, setTabStop],
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
        setTabStop(entryItem?.id ?? null);
        setRegistry((current) => ({ ...current, focusableItemId: entryItem?.id ?? null }));
      }
    },
    [entryItemId, getItemByTarget, getItems, isItemAvailable, setTabStop],
  );

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      const currentItem = getItemByTarget(event.target);
      if (!currentItem) return;
      const items = getItems(true);
      const currentIndex = items.findIndex((item) => item.id === currentItem.id);
      if (currentIndex < 0) return;

      const previousKey = orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft';
      const nextKey = orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight';
      let nextIndex: number | undefined;
      if (event.key === 'Home') nextIndex = 0;
      else if (event.key === 'End') nextIndex = items.length - 1;
      else if (event.key === previousKey || (orientation === 'both' && event.key === 'ArrowUp')) {
        nextIndex = currentIndex === 0 ? (loop ? items.length - 1 : 0) : currentIndex - 1;
      } else if (event.key === nextKey || (orientation === 'both' && event.key === 'ArrowDown')) {
        nextIndex = currentIndex === items.length - 1 ? (loop ? 0 : currentIndex) : currentIndex + 1;
      } else return;

      const nextItem = items[nextIndex];
      const nextElement = nextItem?.ref.current;
      if (!nextItem || !nextElement) return;
      event.preventDefault();
      focusedItemIdRef.current = nextItem.id;
      setTabStop(nextItem.id);
      setRegistry((current) => ({ ...current, focusableItemId: nextItem.id }));
      nextElement.focus({ preventScroll });
      onMoveFocus?.(nextItem);
    },
    [getItemByTarget, getItems, loop, onMoveFocus, orientation, preventScroll, setTabStop],
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
