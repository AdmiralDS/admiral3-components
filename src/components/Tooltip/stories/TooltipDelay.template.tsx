import { SystemDeleteOutline } from '@admiral-ds/admiral3-icons';

import { Button, TOOLTIP_DELAY, Tooltip, type TooltipProps, useTooltip } from '@admiral-ds/admiral3-components';

export const TooltipDelayTemplate = (props: TooltipProps) => {
  const { targetElement, targetRef, tooltipRef, isVisible } = useTooltip<HTMLButtonElement>({
    openDelay: TOOLTIP_DELAY,
  });

  return (
    <>
      <Button ref={targetRef} dimension="m" square aria-label="Удалить" aria-describedby="tooltip-delay">
        <SystemDeleteOutline aria-hidden />
      </Button>
      {isVisible && (
        <Tooltip
          {...props}
          ref={tooltipRef}
          targetElement={targetElement}
          renderContent={() => `Tooltip появился с задержкой ${TOOLTIP_DELAY / 1000} секунды.`}
          id="tooltip-delay"
        />
      )}
    </>
  );
};
