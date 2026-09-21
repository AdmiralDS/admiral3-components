import { SystemDeleteOutline } from '@admiral-ds/admiral3-icons';

import { Button, TOOLTIP_DELAY, Tooltip, type TooltipProps, useTooltip } from '@admiral-ds/admiral3-components';

export const TooltipDelayTemplate = (props: TooltipProps) => {
  const { targetProps, tooltipProps, isVisible } = useTooltip<HTMLButtonElement>({
    delay: TOOLTIP_DELAY,
  });

  return (
    <>
      <Button {...targetProps} dimension="m" square aria-label="Удалить">
        <SystemDeleteOutline aria-hidden />
      </Button>
      {isVisible && (
        <Tooltip {...props} {...tooltipProps}>
          Tooltip появился с задержкой {TOOLTIP_DELAY / 1000} секунды.
        </Tooltip>
      )}
    </>
  );
};
