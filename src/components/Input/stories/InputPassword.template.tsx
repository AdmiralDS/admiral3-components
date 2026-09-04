import { useState, type MouseEvent } from 'react';

import { ServiceEyeCloseOutline, ServiceEyeOutline } from '@admiral-ds/admiral3-icons';

import { Input, InputIconButton, type InputProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription, StoryDemoItem } from '../../stories/StoryContainers';

const PasswordInput = (args: InputProps) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const preventIconMouseDefault = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleVisibilityChange = () => {
    setPasswordVisible((visible) => !visible);
  };

  return (
    <Input
      {...args}
      aria-label="Пароль"
      type={args.readOnly || passwordVisible ? 'text' : 'password'}
      iconsAfter={
        args.readOnly ? undefined : (
          <InputIconButton
            aria-label={passwordVisible ? 'Скрыть пароль' : 'Показать пароль'}
            aria-pressed={passwordVisible}
            disabled={args.disabled}
            onMouseDown={preventIconMouseDefault}
            onMouseUp={preventIconMouseDefault}
            onClick={handleVisibilityChange}
          >
            {passwordVisible ? <ServiceEyeOutline aria-hidden /> : <ServiceEyeCloseOutline aria-hidden />}
          </InputIconButton>
        )
      }
    />
  );
};

export const InputPasswordTemplate = (args: InputProps) => (
  <StoryDemoContainer $direction="column" $gap="16px">
    <StoryDemoDescription>
      Поле ввода с возможностью скрытия вводимых символов. Чаще всего используется для ввода паролей.
    </StoryDemoDescription>
    <StoryDemoItem>
      <PasswordInput {...args} name="password" />
    </StoryDemoItem>
  </StoryDemoContainer>
);
