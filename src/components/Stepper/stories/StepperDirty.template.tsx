import { useState } from 'react';

import { Button, Step, Stepper, type StepperProps } from '@admiral-ds/admiral3-components';

import { StepperDemoFrame } from './style';

/** Сценарий для browser-проверок изменения дерева и отмены событий; в Storybook не индексируется. */
export const StepperDirtyTemplate = (args: StepperProps) => {
  const [keys, setKeys] = useState(['one', 'two', 'three']);
  const [disabled, setDisabled] = useState<string[]>([]);
  const [hidden, setHidden] = useState<string[]>([]);
  const [current, setCurrent] = useState('two');
  const [interactive, setInteractive] = useState(true);
  const [cancel, setCancel] = useState(false);
  const [stopPropagation, setStopPropagation] = useState(false);
  const [requests, setRequests] = useState(0);
  return (
    <StepperDemoFrame>
      <p>Delete удаляет шаг, D блокирует его, H скрывает, R меняет порядок. Это служебный сценарий проверки.</p>
      <Button data-testid="before-stepper">Перед Stepper</Button>
      <Stepper
        {...args}
        data-testid="dirty-stepper"
        activeStep={keys.indexOf(current)}
        onStepChange={
          interactive
            ? (index) => {
                setCurrent(keys[index]);
                setRequests((count) => count + 1);
              }
            : undefined
        }
      >
        {keys.map((key) => (
          <Step
            key={key}
            label={key}
            description={`Описание ${key}`}
            completed
            disabled={disabled.includes(key)}
            hidden={hidden.includes(key)}
            buttonProps={{
              onKeyDown: (event) => {
                if (cancel) event.preventDefault();
                if (event.key === 'Delete') setKeys((items) => items.filter((item) => item !== key));
                if (event.key.toLowerCase() === 'd') setDisabled((items) => [...items, key]);
                if (event.key.toLowerCase() === 'h') setHidden((items) => [...items, key]);
                if (event.key.toLowerCase() === 'r') setKeys((items) => [...items].reverse());
              },
              onClick: (event) => {
                if (cancel) event.preventDefault();
                if (stopPropagation) event.stopPropagation();
              },
            }}
          />
        ))}
      </Stepper>
      <Button data-testid="after-stepper">После Stepper</Button>
      <Button onClick={() => setCancel((value) => !value)}>Отмена событий: {cancel ? 'да' : 'нет'}</Button>
      <Button onClick={() => setStopPropagation((value) => !value)}>
        Остановка всплытия: {stopPropagation ? 'да' : 'нет'}
      </Button>
      <Button onClick={() => setInteractive((value) => !value)}>Переключить интерактивность</Button>
      <Button onClick={() => setCurrent('three')}>Выбрать three извне</Button>
      <output aria-label="Запросы перехода">{requests}</output>
    </StepperDemoFrame>
  );
};
