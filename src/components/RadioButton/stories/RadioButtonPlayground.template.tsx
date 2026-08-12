import { useState } from 'react';

import { RadioButton, type RadioButtonProps, Button } from '@admiral-ds/admiral3-primitives';

import { StoryDemoContainer } from '../../stories/StoryContainers';

export const RadioButtonPlaygroundTemplate = (props: RadioButtonProps) => {
  const [checked, setChecked] = useState(false);

  return (
    <StoryDemoContainer $gap="16px" $direction="column" $withBackground={false}>
      <RadioButton
        value={1}
        checked={checked}
        onChange={(event) => setChecked(event.currentTarget.checked)}
        {...props}
      />
      <Button onClick={() => setChecked(false)}>Сбросить состояние радиокнопки</Button>
    </StoryDemoContainer>
  );
};
