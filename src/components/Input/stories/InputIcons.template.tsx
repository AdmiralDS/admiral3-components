import { useRef } from 'react';

import { DocumentsCopyOutline, ServiceInfoOutline, SystemSearchOutline } from '@admiral-ds/admiral3-icons';

import { Input, InputIcon, InputIconButton, type InputProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription, StoryDemoItem } from '../../stories/StoryContainers';

const InputWithIcons = (args: InputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCopy = () => {
    if (inputRef.current) {
      void navigator.clipboard.writeText(inputRef.current.value);
    }
  };

  return (
    <Input
      {...args}
      ref={inputRef}
      showClearIcon
      iconsBefore={
        <InputIcon aria-hidden>
          <SystemSearchOutline />
        </InputIcon>
      }
      iconsAfter={
        <>
          <InputIconButton aria-label="Показать информацию">
            <ServiceInfoOutline aria-hidden />
          </InputIconButton>
          <InputIconButton aria-label="Скопировать значение" disabled={args.disabled} onClick={handleCopy} preventFocus>
            <DocumentsCopyOutline aria-hidden />
          </InputIconButton>
        </>
      }
    />
  );
};

export const InputIconsTemplate = (args: InputProps) => (
  <StoryDemoContainer $direction="column" $gap="16px">
    <StoryDemoDescription>
      Приоритет расположения иконок определяется функцией поля ввода. На первом месте справа располагается основная
      иконка-функция: например, календарь в Date Picker, глаз в Password Input или лупа в поиске. Затем, если есть,
      располагается иконка, заданная пользователем. Последними слева располагаются динамические иконки, например кнопка
      удаления введённой информации.
    </StoryDemoDescription>
    <StoryDemoDescription>
      Для декоративной иконки без действия используйте <code>InputIcon</code>. По умолчанию такая иконка не получает
      фокус и не участвует в клавиатурной навигации. Для интерактивной иконки используйте <code>InputIconButton</code>:
      добавьте ей обработчик действия и доступное имя, например через <code>aria-label</code>. По умолчанию кнопка при
      нажатии указателем переводит фокус в поле и устанавливает в нём каретку. Это поведение можно отключить пропом{' '}
      <code>preventFocus</code>. При этом кнопка участвует в Tab-порядке и нативно активируется клавишами{' '}
      <code>Space</code> и <code>Enter</code>. Пользователь самостоятельно определяет, должна ли иконка участвовать в
      Tab-порядке, быть видимой или доступной в состояниях <code>readOnly</code> и <code>disabled</code>, используя{' '}
      <code>tabIndex</code>, <code>disabled</code> и условный рендер.
    </StoryDemoDescription>
    <StoryDemoItem>
      <InputWithIcons {...args} />
    </StoryDemoItem>
    <StoryDemoDescription>
      Поведение штатных иконок в состоянии <code>readOnly</code> описывается в документации каждого типа поля ввода.
      Например, встроенная кнопка очистки базового Input скрывается. <code>InputIconInformer</code> — готовый helper для
      пользовательской иконки, поэтому Input не управляет его состоянием. Видимость и доступность информера и других
      пользовательских иконок в состояниях <code>readOnly</code> и <code>disabled</code> определяет пользователь.
    </StoryDemoDescription>
  </StoryDemoContainer>
);
