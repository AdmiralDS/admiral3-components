import { useState } from 'react';

import { Input, InputIconPasswordButton, type InputProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription, StoryDemoItem } from '../../stories/StoryContainers';

const PasswordInput = (args: InputProps) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

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
          <InputIconPasswordButton
            visible={passwordVisible}
            disabled={args.disabled}
            onVisibleChange={handleVisibilityChange}
          />
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
