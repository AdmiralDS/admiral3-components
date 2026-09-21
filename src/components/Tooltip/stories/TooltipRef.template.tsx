import { useCallback, useState } from 'react';

import { SystemDeleteOutline } from '@admiral-ds/admiral3-icons';

import { Button, Tooltip, type TooltipProps, useTooltip } from '@admiral-ds/admiral3-components';

export const TooltipRefTemplate = (props: TooltipProps) => {
  const { targetProps, tooltipProps, isVisible } = useTooltip<HTMLButtonElement>();
  const [tooltipElement, setTooltipElement] = useState<HTMLDivElement | null>(null);
  const setTooltipRefs = useCallback(
    (element: HTMLDivElement | null) => {
      tooltipProps.ref(element);
      setTooltipElement(element);
    },
    [tooltipProps],
  );

  return (
    <>
      <Button {...targetProps} dimension="m" square aria-label="Удалить">
        <SystemDeleteOutline aria-hidden />
      </Button>
      {isVisible && (
        <Tooltip {...props} {...tooltipProps} ref={setTooltipRefs}>
          DOM-элемент Tooltip {tooltipElement ? 'получен' : 'ещё не получен'}
        </Tooltip>
      )}
    </>
  );
};
