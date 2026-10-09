import { Button, Hint, type HintProps, useHint } from '@admiral-ds/admiral3-components';

export const HintPlaygroundTemplate = (args: Omit<HintProps, 'targetElement'>) => {
  const { isVisible, triggerProps, hintProps } = useHint<HTMLButtonElement>();
  return (
    <>
      <Button {...triggerProps}>Наведи курсор или установи фокус</Button>
      {isVisible && <Hint {...args} {...hintProps} />}
    </>
  );
};
