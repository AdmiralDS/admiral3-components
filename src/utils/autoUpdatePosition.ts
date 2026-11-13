import { getOverflowAncestors } from './getOverflowAncestors';
import { observeLayoutShift } from './observeLayoutShift';

export type AutoUpdatePositionOptions = {
  /** Обновлять позицию при прокрутке overflow-предков target- и floating-элементов. По умолчанию `true`. */
  ancestorScroll?: boolean;
  /** Обновлять позицию при изменении размеров окна и overflow-предков. По умолчанию `true`. */
  ancestorResize?: boolean;
  /** Обновлять позицию при изменении размеров target- и floating-элементов. По умолчанию `true`. */
  elementResize?: boolean;
  /** Обновлять позицию при перемещении target-элемента в результате layout shift. По умолчанию `true`. */
  layoutShift?: boolean;
};

/**
 * Подписывается на события, способные повлиять на положение floating-элемента
 * относительно target-элемента, и вызывает `update` для повторного расчёта позиции.
 *
 * Утилита учитывает прокрутку и изменение размеров overflow-предков, изменение
 * размеров обоих элементов и перемещение target-элемента вследствие layout shift.
 * Конкретные источники обновлений настраиваются через `options`.
 *
 * Для изменения размеров окна используется событие `resize`, поскольку
 * `ResizeObserver` наблюдает только за `Element` и не может наблюдать за `Window`
 * или viewport. Изменения размеров DOM-элементов отслеживаются через
 * `ResizeObserver`.
 *
 * Несколько сигналов, полученных в пределах одного кадра, объединяются в один
 * вызов `update`. Первый вызов также выполняется асинхронно в ближайшем кадре.
 *
 * @param targetElement Элемент, относительно которого позиционируется floating-элемент.
 * @param floatingElement Позиционируемый элемент.
 * @param update Функция повторного расчёта и применения позиции.
 * @param options Настройки источников, вызывающих обновление позиции.
 * @returns Функция для удаления подписок, остановки наблюдателей и отмены
 * запланированного обновления.
 */
export function autoUpdatePosition(
  targetElement: Element,
  floatingElement: Element,
  update: () => void,
  options: AutoUpdatePositionOptions = {},
): () => void {
  const { ancestorScroll = true, ancestorResize = true, elementResize = true, layoutShift = true } = options;
  const win = targetElement.ownerDocument.defaultView;
  if (!win) return () => undefined;

  // Положение floating-элемента может зависеть от overflow-предков обоих элементов.
  // Общие предки включаются в список только один раз.
  const ancestors = Array.from(
    new Set([...getOverflowAncestors(targetElement), ...getOverflowAncestors(floatingElement)]),
  );
  let resizeObserver: ResizeObserver | undefined;
  let cleanupLayoutShift: (() => void) | undefined;
  let frameId: number | undefined;
  let updateScheduled = false;
  let active = true;

  const runUpdate = () => {
    frameId = undefined;
    updateScheduled = false;
    if (active) update();
  };

  const scheduleUpdate = () => {
    if (!active || updateScheduled) return;
    // requestAnimationFrame ограничивает частоту обновлений одним вызовом за кадр
    // и запускается только в ответ на один из отслеживаемых сигналов.
    updateScheduled = true;
    frameId = win.requestAnimationFrame(runUpdate);
  };

  ancestors.forEach((ancestor) => {
    if (ancestorScroll) ancestor.addEventListener('scroll', scheduleUpdate, { passive: true });
    if (ancestorResize && ancestor === win) ancestor.addEventListener('resize', scheduleUpdate);
  });

  if ((elementResize || ancestorResize) && win.ResizeObserver) {
    resizeObserver = new win.ResizeObserver(scheduleUpdate);

    if (elementResize) {
      resizeObserver.observe(targetElement);
      resizeObserver.observe(floatingElement);
    }

    if (ancestorResize) {
      // Размеры Element-предков отслеживаются тем же ResizeObserver, что и размеры target и floating.
      ancestors.forEach((ancestor) => {
        if (ancestor instanceof win.Element) resizeObserver?.observe(ancestor);
      });
    }
  }

  if (layoutShift) cleanupLayoutShift = observeLayoutShift(targetElement, scheduleUpdate);
  // Отложенный начальный расчёт позволяет измерить floating-элемент после его
  // добавления в DOM, в том числе при рендеринге через portal.
  scheduleUpdate();

  return () => {
    if (!active) return;
    active = false;

    ancestors.forEach((ancestor) => {
      ancestor.removeEventListener('scroll', scheduleUpdate);
      if (ancestor === win) ancestor.removeEventListener('resize', scheduleUpdate);
    });
    resizeObserver?.disconnect();
    cleanupLayoutShift?.();

    if (frameId !== undefined) win.cancelAnimationFrame(frameId);
    frameId = undefined;
    updateScheduled = false;
  };
}
