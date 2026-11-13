import { Button, Hint, type HintProps, useHint } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

export const HintUseHintTemplate = (props: Omit<HintProps, 'targetElement'>) => {
  const { isVisible, triggerProps, hintProps } = useHint<HTMLButtonElement>();

  return (
    <StoryDemoContainer $direction="column" $gap="20px">
      <StoryDemoDescription>
        Хук <code>useHint</code> упрощает настройку появления Hint и связывает подсказку с управляющим элементом. Он
        возвращает <code>triggerProps</code>, <code>hintProps</code> и <code>isVisible</code>. Передайте{' '}
        <code>triggerProps</code> элементу-триггеру, <code>hintProps</code> — компоненту Hint и добавляйте Hint в DOM,
        когда <code>isVisible</code> равен <code>true</code>. Вместе с обработчиками хук устанавливает необходимые ref и
        ARIA-атрибуты.
      </StoryDemoDescription>
      <StoryDemoDescription>
        Хук принимает объект настроек. По умолчанию параметр хука <code>triggerMode</code> имеет значение{' '}
        <code>hover</code>, поэтому достаточно вызвать <code>useHint()</code>. В этом режиме Hint открывается при
        наведении указателя или получении фокуса, закрывается при уходе указателя, потере фокуса или нажатии Escape и
        остаётся открытым, когда пользователь переводит указатель с целевого элемента на подсказку. Этот режим подходит
        для информационного содержимого, с которым не требуется взаимодействовать.
      </StoryDemoDescription>
      <StoryDemoDescription>
        Чтобы включить альтернативный сценарий, передайте настройку при вызове хука:{' '}
        <code>useHint(&#123; triggerMode: 'click' &#125;)</code>. Тогда Hint открывается и закрывается по клику, либо
        активации триггера клавишей Enter или Space. В этом режиме хук также добавляет кнопку закрытия, закрывает Hint
        по Escape и клику за его пределами и управляет переходом фокуса для интерактивного содержимого. Если триггер не
        является нативным интерактивным элементом, ему необходимо самостоятельно назначить <code>role="button"</code> и{' '}
        <code>tabIndex=&#123;0&#125;</code>.
      </StoryDemoDescription>
      <StoryDemoDescription>
        Хук покрывает стандартные сценарии открытия по наведению и активации. Если Hint должен появляться по другому
        событию страницы, использовать <code>useHint</code> необязательно: управляйте состоянием и добавлением Hint в
        DOM самостоятельно, а элемент позиционирования передайте через <code>targetElement</code>. В таком сценарии
        разработчик также самостоятельно отвечает за обработку закрытия, клавиатуры, фокуса и доступные ARIA-связи.
      </StoryDemoDescription>
      <Button {...triggerProps}>Наведите указатель или установите фокус</Button>
      {isVisible && <Hint {...props} {...hintProps} />}
    </StoryDemoContainer>
  );
};
