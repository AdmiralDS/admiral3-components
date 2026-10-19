import { useMemo, useState } from 'react';

import { Button, Hint, type HintProps, useHint } from '@admiral-ds/admiral3-components';

import { refSetter } from '../../../utils/refSetter';
import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

export const HintRefTemplate = (props: Omit<HintProps, 'targetElement'>) => {
  const { isVisible, triggerProps, hintProps } = useHint<HTMLButtonElement>();
  const [hintElement, setHintElement] = useState<HTMLDivElement | null>(null);
  const setHintRefs = useMemo(() => refSetter(hintProps.ref, setHintElement), [hintProps.ref]);

  return (
    <StoryDemoContainer $direction="column" $gap="20px">
      <StoryDemoDescription>
        Если приложению нужен DOM-элемент Hint, объедините собственный ref с <code>hintProps.ref</code> с помощью
        утилиты <code>refSetter</code>. Не заменяйте ref, возвращённый хуком: он нужен <code>useHint</code> для
        обработки взаимодействия с подсказкой.
      </StoryDemoDescription>
      <Button {...triggerProps}>Проверить ref</Button>
      {isVisible && (
        <Hint {...props} {...hintProps} ref={setHintRefs}>
          {props.children} DOM-элемент Hint {hintElement ? 'получен' : 'ещё не получен'}.
        </Hint>
      )}
    </StoryDemoContainer>
  );
};
