import { SystemDeleteOutline } from '@admiral-ds/admiral3-icons';

import { Button, TOOLTIP_DELAY, Tooltip, type TooltipProps, useTooltip } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

export const TooltipDelayTemplate = (props: TooltipProps) => {
  const { targetProps, tooltipProps, isVisible } = useTooltip<HTMLButtonElement>({
    delay: TOOLTIP_DELAY,
  });

  return (
    <StoryDemoContainer $direction="column" $gap="20px">
      <StoryDemoDescription>
        Параметр <code>delay</code> задаёт задержку перед появлением Tooltip при наведении. При получении фокуса Tooltip
        открывается без задержки. Если убрать указатель с целевого элемента до окончания задержки, Tooltip не появится.
        В качестве значения задержки рекомендуется использовать константу <code>TOOLTIP_DELAY</code>.
      </StoryDemoDescription>
      <Button {...targetProps} dimension="m" square aria-label="Удалить">
        <SystemDeleteOutline aria-hidden />
      </Button>
      {isVisible && (
        <Tooltip {...props} {...tooltipProps}>
          Tooltip появился с задержкой {TOOLTIP_DELAY / 1000} секунды.
        </Tooltip>
      )}
    </StoryDemoContainer>
  );
};
