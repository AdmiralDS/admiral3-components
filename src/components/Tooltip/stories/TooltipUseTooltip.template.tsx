import { SystemDeleteOutline } from '@admiral-ds/admiral3-icons';

import { Button, Tooltip, type TooltipProps, useTooltip } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

export const TooltipUseTooltipTemplate = (props: TooltipProps) => {
  const { targetProps, tooltipProps, isVisible } = useTooltip<HTMLButtonElement>();

  return (
    <StoryDemoContainer $direction="column" $gap="20px">
      <StoryDemoDescription>
        Хук <code>useTooltip</code> упрощает настройку появления Tooltip: открывает его при наведении или фокусе,
        закрывает при уходе указателя, потере фокуса или нажатии Escape и сохраняет открытым при переносе указателя с
        целевого элемента на подсказку.
      </StoryDemoDescription>
      <StoryDemoDescription>
        Вызов <code>useTooltip</code> возвращает <code>targetProps</code>, <code>tooltipProps</code> и{' '}
        <code>isVisible</code>. Передайте <code>targetProps</code> целевому элементу, <code>tooltipProps</code> —
        компоненту Tooltip и добавляйте Tooltip в DOM по <code>isVisible</code>. Если стандартное поведение не подходит,
        использовать хук необязательно: вы можете самостоятельно управлять отображением Tooltip и передать ему элемент
        для позиционирования через <code>targetElement</code>.
      </StoryDemoDescription>
      <Button {...targetProps} dimension="m" square aria-label="Удалить">
        <SystemDeleteOutline aria-hidden />
      </Button>
      {isVisible && (
        <Tooltip {...props} {...tooltipProps} style={{ minWidth: '200px', maxWidth: '300px' }}>
          {props.children}
        </Tooltip>
      )}
    </StoryDemoContainer>
  );
};
