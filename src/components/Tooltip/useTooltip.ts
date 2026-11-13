import type { UseTooltipOptions, UseTooltipResult } from './types';
import { useHoverTrigger } from '../_internal/FloatingInteractions/useHoverTrigger';

/** Рекомендуемая задержка открытия Tooltip при наведении в миллисекундах. */
export const TOOLTIP_DELAY = 1500;

/** Управляет открытием Tooltip при наведении или получении фокуса. */
export const useTooltip = <T extends HTMLElement = HTMLElement>(
  options: UseTooltipOptions = {},
): UseTooltipResult<T> => {
  const { isVisible, triggerProps, floatingProps } = useHoverTrigger<T>(options);
  return { isVisible, triggerProps, tooltipProps: floatingProps };
};
