import { Button, HINT_DELAY, Hint, type HintProps, useHint } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

export const HintHoverTemplate = (props: Omit<HintProps, 'targetElement'>) => {
  const { isVisible, triggerProps, hintProps } = useHint<HTMLButtonElement>({ delay: HINT_DELAY });

  return (
    <StoryDemoContainer $direction="column" $gap="20px">
      <StoryDemoDescription>
        По умолчанию <code>useHint()</code> работает в режиме <code>triggerMode="hover"</code>: Hint открывается при
        наведении указателя или получении фокуса, закрывается при уходе указателя, потере фокуса или нажатии Escape и
        остаётся открытым при переносе указателя с триггера на подсказку.
      </StoryDemoDescription>
      <StoryDemoDescription>
        Появление при наведении можно отложить, передав параметр <code>delay</code> в хук. В примере используется вызов{' '}
        <code>useHint(&#123; delay: HINT_DELAY &#125;)</code> и рекомендуемое значение из константы{' '}
        <code>HINT_DELAY</code>. Если указатель покинет триггер до окончания задержки, Hint не откроется. Задержка
        применяется только к открытию по ховеру: при получении фокуса Hint появляется сразу, а в режиме{' '}
        <code>triggerMode="click"</code> параметр <code>delay</code> не используется.
      </StoryDemoDescription>
      <Button {...triggerProps}>Наведите указатель</Button>
      {isVisible && <Hint {...props} {...hintProps} />}
    </StoryDemoContainer>
  );
};
