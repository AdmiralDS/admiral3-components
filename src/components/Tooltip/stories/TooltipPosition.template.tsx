import styled from 'styled-components';

import { Button, Tooltip, type TooltipProps, useTooltip } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

const Examples = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 24px;
`;

export const TooltipPositionTemplate = (props: TooltipProps) => {
  const automatic = useTooltip<HTMLButtonElement>();
  const positioned = useTooltip<HTMLButtonElement>();
  const tooltipPosition = props.tooltipPosition ?? 'top';

  return (
    <StoryDemoContainer $direction="column" $gap="20px">
      <StoryDemoDescription>
        Если <code>tooltipPosition</code> не задан, Tooltip автоматически выбирает подходящее расположение по
        внутреннему приоритету: снизу, сверху, слева или справа от целевого элемента. Если для центрированного положения
        недостаточно места, Tooltip пробует варианты со смещением.
      </StoryDemoDescription>
      <StoryDemoDescription>
        Заданный <code>tooltipPosition</code> фиксирует сторону размещения. Для <code>top</code> и <code>bottom</code>{' '}
        Tooltip остаётся сверху или снизу, но может смещаться по горизонтали; для <code>left</code> и <code>right</code>{' '}
        — остаётся слева или справа и может смещаться по вертикали. Таким образом, компонент адаптируется к доступному
        месту, не переходя на другую сторону целевого элемента.
      </StoryDemoDescription>
      <Examples>
        <Button {...automatic.targetProps}>Автоматическая позиция</Button>
        <Button {...positioned.targetProps}>Позиция: {tooltipPosition}</Button>
      </Examples>
      {automatic.isVisible && (
        <Tooltip {...props} {...automatic.tooltipProps} tooltipPosition={undefined}>
          Позиция выбрана автоматически
        </Tooltip>
      )}
      {positioned.isVisible && (
        <Tooltip {...props} {...positioned.tooltipProps} tooltipPosition={tooltipPosition}>
          Задано направление: {tooltipPosition}
        </Tooltip>
      )}
    </StoryDemoContainer>
  );
};
