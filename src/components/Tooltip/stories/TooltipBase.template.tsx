import { SystemDeleteOutline } from '@admiral-ds/admiral3-icons';

import { Button, Tooltip, type TooltipProps, useTooltip } from '@admiral-ds/admiral3-components';

const TOOLTIP_TEXT =
  'Tooltip показывает поясняющий текст для элемента интерфейса. Его содержимое можно выделить и скопировать.';

export const TooltipBaseTemplate = (props: TooltipProps) => {
  const { targetElement, targetRef, tooltipRef, isVisible } = useTooltip<HTMLButtonElement>();

  return (
    <>
      <Button ref={targetRef} dimension="m" square aria-label="Удалить" aria-describedby="tooltip-base">
        <SystemDeleteOutline aria-hidden />
      </Button>
      {isVisible && (
        <Tooltip
          {...props}
          ref={tooltipRef}
          targetElement={targetElement}
          renderContent={() => TOOLTIP_TEXT}
          id="tooltip-base"
          style={{ minWidth: '200px', maxWidth: '300px' }}
        />
      )}
    </>
  );
};
