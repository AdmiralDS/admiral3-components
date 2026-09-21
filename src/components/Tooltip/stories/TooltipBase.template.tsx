import { SystemDeleteOutline } from '@admiral-ds/admiral3-icons';

import { Button, Tooltip, type TooltipProps, useTooltip } from '@admiral-ds/admiral3-components';

const TOOLTIP_TEXT =
  'Tooltip показывает поясняющий текст для элемента интерфейса. Его содержимое можно выделить и скопировать.';

export const TooltipBaseTemplate = (props: TooltipProps) => {
  const { targetElement, targetProps, tooltipProps, isVisible } = useTooltip<HTMLButtonElement>();

  return (
    <>
      <Button {...targetProps} dimension="m" square aria-label="Удалить">
        <SystemDeleteOutline aria-hidden />
      </Button>
      {isVisible && (
        <Tooltip
          {...props}
          {...tooltipProps}
          targetElement={targetElement}
          style={{ minWidth: '200px', maxWidth: '300px' }}
        >
          {TOOLTIP_TEXT}
        </Tooltip>
      )}
    </>
  );
};
