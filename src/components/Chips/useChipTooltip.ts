import { useState } from 'react';

import { useTooltip } from '#src/components/Tooltip';
import { useOverflow } from '#src/hooks/useOverflow';

export const useChipTooltip = (enabled = true) => {
  const [contentElement, setContentElement] = useState<HTMLSpanElement | null>(null);
  const {
    triggerProps: { ref: tooltipTriggerRef },
    tooltipProps,
    isVisible,
  } = useTooltip<HTMLDivElement>();
  const textOverflow = useOverflow(enabled ? tooltipProps.targetElement : null, contentElement);

  return {
    triggerRef: enabled ? tooltipTriggerRef : undefined,
    contentRef: setContentElement,
    tooltipProps,
    isTooltipVisible: enabled && isVisible && textOverflow,
  };
};
