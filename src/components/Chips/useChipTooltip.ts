import { useLayoutEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

import { checkOverflow } from '#src/utils/checkOverflow';

export const useChipTooltip = (
  containerRef: React.RefObject<HTMLDivElement | null>,
  children: ReactNode,
  renderContentTooltip?: () => string,
  disabledTooltip?: boolean,
) => {
  const [visible, setVisible] = useState(false);
  const [overflow, setOverflow] = useState(false);

  const contentRef = useRef<HTMLSpanElement>(null);

  //TODO добавить проверку на number при добавлении компонента Tooltip
  const content = renderContentTooltip?.() || (typeof children === 'string' ? children : undefined);

  useLayoutEffect(() => {
    if (disabledTooltip || !contentRef.current) return;

    function show() {
      setOverflow(checkOverflow(contentRef.current));
      setVisible(true);
    }
    function hide() {
      setVisible(false);
    }

    const chipNode = containerRef.current;

    if (chipNode) {
      chipNode.addEventListener('mouseenter', show);
      chipNode.addEventListener('mouseleave', hide);
      chipNode.addEventListener('focus', show);
      chipNode.addEventListener('blur', hide);
      return () => {
        chipNode.removeEventListener('mouseenter', show);
        chipNode.removeEventListener('mouseleave', hide);
        chipNode.removeEventListener('focus', show);
        chipNode.removeEventListener('blur', hide);
      };
    }
  }, [disabledTooltip]);

  return {
    contentRef,
    title: !disabledTooltip && visible && overflow ? content : undefined,
  };
};
