import { useCallback, useState } from 'react';

import { SystemDeleteOutline } from '@admiral-ds/admiral3-icons';

import { Button, Tooltip, type TooltipProps, useTooltip } from '@admiral-ds/admiral3-components';

export const TooltipRefTemplate = (props: TooltipProps) => {
  const { targetElement, targetRef, tooltipRef, isVisible } = useTooltip<HTMLButtonElement>();
  const [tooltipElement, setTooltipElement] = useState<HTMLDivElement | null>(null);
  const setTooltipRefs = useCallback(
    (element: HTMLDivElement | null) => {
      tooltipRef(element);
      setTooltipElement(element);
    },
    [tooltipRef],
  );

  return (
    <>
      <Button ref={targetRef} dimension="m" square aria-label="Удалить" aria-describedby="tooltip-ref">
        <SystemDeleteOutline aria-hidden />
      </Button>
      {isVisible && (
        <Tooltip
          {...props}
          ref={setTooltipRefs}
          targetElement={targetElement}
          renderContent={() => `DOM-элемент Tooltip ${tooltipElement ? 'получен' : 'ещё не получен'}`}
          id="tooltip-ref"
        />
      )}
    </>
  );
};
