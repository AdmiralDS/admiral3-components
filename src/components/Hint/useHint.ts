import type { UseHintOptions, UseHintResult } from './types';
import { useTooltip } from '../Tooltip/useTooltip';

/**
 * Управляет открытием Hint при наведении или фокусе и закрытием при уходе, потере фокуса или Escape.
 * Элемент позиционирования может отличаться от триггера, но не входит в интерактивную область Hint.
 */
export const useHint = <T extends HTMLElement = HTMLElement>(options: UseHintOptions = {}): UseHintResult<T> => {
  const { isVisible, triggerProps, tooltipProps } = useTooltip<T>(options);
  return { isVisible, triggerProps, hintProps: tooltipProps };
};
