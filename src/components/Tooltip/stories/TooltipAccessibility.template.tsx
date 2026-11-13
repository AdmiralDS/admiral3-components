import styled from 'styled-components';

import { Button, Tooltip, type TooltipProps, useTooltip } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

const TruncatedButton = styled(Button)`
  inline-size: 240px;

  > div {
    inline-size: 100%;
  }
`;

const TruncatedText = styled.span`
  min-inline-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const BUTTON_TEXT = 'Открыть отчёт о финансовых результатах за третий квартал';

export const TooltipAccessibilityTemplate = (props: TooltipProps) => {
  const { triggerProps, tooltipProps, isVisible } = useTooltip<HTMLButtonElement>();
  const { 'aria-describedby': _ariaDescribedBy, ...triggerPropsWithoutDescription } = triggerProps;

  return (
    <StoryDemoContainer $direction="column" $gap="20px">
      <StoryDemoDescription>
        <code>aria-describedby</code> связывает триггер с Tooltip, когда подсказка дополняет его доступное имя новой
        информацией. Но ARIA-атрибуты нужно применять с учётом контекста, а не формально.
      </StoryDemoDescription>
      <StoryDemoDescription>
        В этом примере многоточие только визуально обрезает текст кнопки: её полное доступное имя уже вычисляется из
        содержимого. Tooltip повторяет тот же текст, поэтому связь через <code>aria-describedby</code> добавила бы к
        имени такое же описание и могла бы привести к повторной озвучке. Мы сохраняем свойства для управления Tooltip,
        но намеренно исключаем <code>aria-describedby</code>. Если подсказка содержит дополнительную информацию, удалять
        связь не следует.
      </StoryDemoDescription>
      <TruncatedButton {...triggerPropsWithoutDescription}>
        <TruncatedText>{BUTTON_TEXT}</TruncatedText>
      </TruncatedButton>
      {isVisible && (
        <Tooltip {...props} {...tooltipProps}>
          {BUTTON_TEXT}
        </Tooltip>
      )}
    </StoryDemoContainer>
  );
};
