import type { UseHintOptions, UseHintResult } from './types';
import { useClickTrigger } from '../_internal/FloatingInteractions/useClickTrigger';
import { useHoverTrigger } from '../_internal/FloatingInteractions/useHoverTrigger';

/** Рекомендуемая задержка открытия Hint при наведении в миллисекундах. */
export const HINT_DELAY = 1500;

/**
 * Управляет Hint в одном из двух режимов:
 * - hover: открывает при наведении или фокусе, закрывает при уходе, потере фокуса или по Escape;
 * - click: открывает активацией триггера и управляет фокусом интерактивного содержимого.
 *
 * Ненативному элементу-триггеру в режиме click потребитель должен самостоятельно добавить
 * `role="button"` и `tabIndex={0}`, иначе доступность с клавиатуры не гарантируется.
 */
export const useHint = <T extends HTMLElement = HTMLElement>(options: UseHintOptions = {}): UseHintResult<T> => {
  const { triggerMode = 'hover', ...interactionOptions } = options;
  const clickInteraction = useClickTrigger<T>(interactionOptions);
  const hoverInteraction = useHoverTrigger<T>(interactionOptions);
  const interaction = triggerMode === 'click' ? clickInteraction : hoverInteraction;

  return {
    isVisible: interaction.isVisible,
    triggerProps: interaction.triggerProps,
    hintProps: interaction.floatingProps,
  };
};
