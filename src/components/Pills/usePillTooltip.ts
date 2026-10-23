import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

import { checkOverflow } from '../../utils/checkOverflow';
import { useTooltip } from '../Tooltip/useTooltip';

export const usePillTooltip = (children: ReactNode) => {
  const { isVisible, triggerProps, tooltipProps } = useTooltip<HTMLButtonElement>();
  const [content, setContent] = useState<string | null>(null);
  const targetElement = tooltipProps.targetElement;

  useEffect(() => {
    if (!targetElement) return;

    const checkContent = () => {
      const labels = Array.from(targetElement.querySelectorAll<HTMLElement>('[data-pill-label]'));
      setContent(labels.some(checkOverflow) ? labels.map((label) => label.textContent).join('') : null);
    };

    checkContent();
    targetElement.addEventListener('mouseenter', checkContent);
    targetElement.addEventListener('focus', checkContent);
    return () => {
      targetElement.removeEventListener('mouseenter', checkContent);
      targetElement.removeEventListener('focus', checkContent);
    };
  }, [children, targetElement]);

  return { triggerRef: triggerProps.ref, tooltipProps, content, isVisible: isVisible && Boolean(content) };
};
