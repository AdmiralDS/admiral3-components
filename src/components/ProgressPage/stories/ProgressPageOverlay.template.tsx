import { useEffect, useRef, useState } from 'react';

import { themes } from '@admiral-ds/admiral3-tokens';
import styled from 'styled-components';

import { Button, ProgressPage } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

const PROGRESS_STEP = 2;
const PROGRESS_UPDATE_INTERVAL = 50;
const DIALOG_CLOSE_DELAY = 1000;

const Dialog = styled.dialog`
  box-sizing: border-box;
  width: min(480px, calc(100% - 32px));
  padding: 24px;
  border: 0;
  border-radius: 8px;
  background-color: var(--admiral-color-neutral-base-1-rest, ${themes.light.color.neutral.base._1.rest});

  &::backdrop {
    background-color: var(--admiral-color-neutral-base-overlay-rest, ${themes.light.color.neutral.base.overlay.rest});
  }
`;

export const ProgressPageOverlayTemplate = () => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [value, setValue] = useState(0);

  const clearTimers = () => {
    clearInterval(progressIntervalRef.current);
    clearTimeout(closeTimeoutRef.current);
  };

  const handleOpenDialog = () => {
    if (!dialogRef.current || dialogRef.current.open) return;

    dialogRef.current.showModal();

    let nextValue = 0;
    progressIntervalRef.current = setInterval(() => {
      nextValue = Math.min(nextValue + PROGRESS_STEP, 100);
      setValue(nextValue);

      if (nextValue === 100) {
        clearInterval(progressIntervalRef.current);
        closeTimeoutRef.current = setTimeout(() => dialogRef.current?.close(), DIALOG_CLOSE_DELAY);
      }
    }, PROGRESS_UPDATE_INTERVAL);
  };

  const handleCloseDialog = () => {
    clearTimers();
    setValue(0);
  };

  useEffect(() => {
    return clearTimers;
  }, []);

  return (
    <StoryDemoContainer $direction="column" $gap="24px">
      <StoryDemoDescription>
        Один из сценариев использования ProgressPage - это загрузка тяжелой страницы (или контента на ней),
        сопровождаемая блокировкой содержимого страницы и отображением ProgressPage через оверлей.
      </StoryDemoDescription>
      <Button type="button" onClick={handleOpenDialog}>
        Показать прогресс в overlay
      </Button>
      <Dialog ref={dialogRef} aria-label="Выполнение операции" onClose={handleCloseDialog}>
        <ProgressPage value={value} label="Загрузка данных..." valueLabel={`${value}%`} />
      </Dialog>
    </StoryDemoContainer>
  );
};
