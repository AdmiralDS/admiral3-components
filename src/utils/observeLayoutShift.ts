import { rectChanged } from './rectGeometry';

/**
 * Сообщает, когда layout shift мог изменить viewport-геометрию элемента.
 *
 * IntersectionObserver используется как датчик перемещения: его rootMargin сужает
 * область наблюдения до текущего rect элемента. Изменение пересечения служит сигналом
 * переcчитать геометрию, после чего область наблюдения строится заново.
 * При изменении размеров окна область наблюдения перестраивается без вызова onChange:
 * предполагается, что внешний код самостоятельно обновляет геометрию на resize.
 *
 * Функцию следует вызывать, когда floating-элемент уже смонтирован и видим: для
 * элемента с нулевой шириной или высотой IntersectionObserver не создаётся.
 *
 * @param element Элемент, за viewport-геометрией которого нужно следить.
 * @param onChange Callback, сигнализирующий, что геометрию элемента нужно перепроверить.
 * @returns Функция, останавливающая observer и отложенное обновление.
 *
 * inspired by Floating UI и https://samthor.au/2021/observing-dom/
 */
export const observeLayoutShift = (element: Element, onChange: () => void): (() => void) => {
  const win = element.ownerDocument.defaultView;
  const root = element.ownerDocument.documentElement;
  let observer: IntersectionObserver | undefined;
  let timeoutId: number | undefined;
  let active = true;

  if (!win?.IntersectionObserver) return () => undefined;

  const cleanup = () => {
    if (timeoutId !== undefined) win.clearTimeout(timeoutId);
    observer?.disconnect();
    observer = undefined;
  };

  const refresh = (skipUpdate = false, threshold = 1) => {
    if (!active) return;
    cleanup();

    const initialRect = element.getBoundingClientRect();
    const { left, top, width, height } = initialRect;
    if (!skipUpdate) onChange();
    if (!width || !height) return;

    const rootMargin = `${-Math.floor(top)}px ${-Math.floor(root.clientWidth - (left + width))}px ${-Math.floor(
      root.clientHeight - (top + height),
    )}px ${-Math.floor(left)}px`;
    let isFirstUpdate = true;

    observer = new win.IntersectionObserver(
      ([entry]) => {
        if (!active || !entry) return;

        const currentRect = element.getBoundingClientRect();
        if (rectChanged(initialRect, currentRect)) {
          refresh();
          return;
        }

        if (entry.intersectionRatio !== threshold) {
          if (!isFirstUpdate) {
            refresh();
          } else if (!entry.intersectionRatio) {
            // If the target is clipped in place, the ratio is 0. Throttle
            // the refresh to prevent an infinite loop of updates.
            timeoutId = win.setTimeout(() => refresh(false, 1e-7), 1000);
          } else {
            refresh(false, entry.intersectionRatio);
          }
        }

        isFirstUpdate = false;
      },
      { root: element.ownerDocument, rootMargin, threshold: Math.max(0, Math.min(1, threshold)) || 1 },
    );
    observer.observe(element);
  };

  const handleResize = () => refresh(true);

  win.addEventListener('resize', handleResize);
  refresh(true);
  return () => {
    active = false;
    win.removeEventListener('resize', handleResize);
    cleanup();
  };
};
