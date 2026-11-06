import { useState } from 'react';

import { useTooltip } from '#src/components/Tooltip';
import { useOverflow } from '#src/hooks/useOverflow';

export const useChipTooltip = (tooltipEnabled = true) => {
  const [contentElement, setContentElement] = useState<HTMLSpanElement | null>(null);
  const {
    triggerProps: { ref: tooltipTriggerRef },
    tooltipProps,
    isVisible,
  } = useTooltip<HTMLDivElement>();
  const textOverflow = useOverflow(tooltipEnabled ? tooltipProps.targetElement : null, contentElement);

  return {
    triggerRef: tooltipEnabled ? tooltipTriggerRef : undefined,
    contentRef: setContentElement,
    tooltipProps,
    isTooltipVisible: tooltipEnabled && isVisible && textOverflow,
  };
};
