import { useEffect, useState } from 'react';

import { isOverflowed } from '#src/utils/isOverflowed';

export const useOverflow = (targetElement: Element | null, contentElement: HTMLElement | null) => {
  const [hasOverflow, setHasOverflow] = useState(false);

  useEffect(() => {
    if (!targetElement) return;

    const checkOverflow = () => {
      setHasOverflow(isOverflowed(contentElement));
    };

    targetElement.addEventListener('mouseenter', checkOverflow);
    targetElement.addEventListener('focus', checkOverflow);

    return () => {
      targetElement.removeEventListener('mouseenter', checkOverflow);
      targetElement.removeEventListener('focus', checkOverflow);
    };
  }, [targetElement, contentElement]);

  return hasOverflow;
};
