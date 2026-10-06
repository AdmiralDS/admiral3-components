import { useMemo, useState } from 'react';

import { SystemDeleteOutline } from '@admiral-ds/admiral3-icons';

import { Button, Tooltip, type TooltipProps, useTooltip } from '@admiral-ds/admiral3-components';

// TODO: Разработать правила публичного экспорта утилит и заменить внутренний путь на импорт из библиотеки.
import { refSetter } from '../../../utils/refSetter';
import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

export const TooltipRefTemplate = (props: TooltipProps) => {
  const { targetProps, tooltipProps, isVisible } = useTooltip<HTMLButtonElement>();
  const [tooltipElement, setTooltipElement] = useState<HTMLDivElement | null>(null);
  const setTooltipRefs = useMemo(() => refSetter(tooltipProps.ref, setTooltipElement), [tooltipProps.ref]);

  return (
    <StoryDemoContainer $direction="column" $gap="20px">
      <StoryDemoDescription>
        Если приложению нужен DOM-элемент Tooltip, объедините собственный ref с <code>tooltipProps.ref</code> через{' '}
        <code>refSetter</code>. Не заменяйте ref хука: он нужен для корректного перехода указателя на подсказку.
      </StoryDemoDescription>
      <Button {...targetProps} dimension="m" square aria-label="Удалить">
        <SystemDeleteOutline aria-hidden />
      </Button>
      {isVisible && (
        <Tooltip {...props} {...tooltipProps} ref={setTooltipRefs}>
          DOM-элемент Tooltip {tooltipElement ? 'получен' : 'ещё не получен'}
        </Tooltip>
      )}
    </StoryDemoContainer>
  );
};
