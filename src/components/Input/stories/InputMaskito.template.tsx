import type { FormEvent } from 'react';
import { useMemo, useState } from 'react';

import type { MaskitoOptions } from '@maskito/core';
import { maskitoWithPlaceholder } from '@maskito/kit';
import { useMaskito } from '@maskito/react';

import { Input, type InputProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription, StoryDemoItem } from '../../stories/StoryContainers';

const fourDigits = [/\d/, /\d/, /\d/, /\d/];
const cardNumberPlaceholder = '____ ____ ____ ____';

const cardNumberMask: MaskitoOptions = {
  mask: [...fourDigits, ' ', ...fourDigits, ' ', ...fourDigits, ' ', ...fourDigits],
};

export const InputMaskitoTemplate = (args: InputProps) => {
  const [simpleValue, setSimpleValue] = useState('');
  const [placeholderValue, setPlaceholderValue] = useState('');
  const simpleInputRef = useMaskito({ options: cardNumberMask });
  const placeholderMask = useMemo(() => {
    const { removePlaceholder, ...placeholderOptions } = maskitoWithPlaceholder(cardNumberPlaceholder);

    return {
      options: { ...cardNumberMask, ...placeholderOptions },
      removePlaceholder,
    };
  }, []);
  const placeholderInputRef = useMaskito({ options: placeholderMask.options });

  const handleSimpleInput = (event: FormEvent<HTMLInputElement>) => {
    setSimpleValue(event.currentTarget.value);
  };

  const handlePlaceholderInput = (event: FormEvent<HTMLInputElement>) => {
    setPlaceholderValue(event.currentTarget.value);
  };

  return (
    <StoryDemoContainer $direction="column" $gap="32px">
      <StoryDemoDescription>
        В поле ввода может работать маска, которая определяет, как должны выглядеть вводимые данные. В дизайн-системе
        нет встроенных масок.
      </StoryDemoDescription>
      <StoryDemoDescription>Для маскирования ввода рекомендуем использовать библиотеку Maskito.</StoryDemoDescription>
      <StoryDemoItem>
        <StoryDemoDescription>Нативный placeholder</StoryDemoDescription>
        <Input
          {...args}
          ref={simpleInputRef}
          name="card-number-simple"
          value={simpleValue}
          onInput={handleSimpleInput}
          placeholder={cardNumberPlaceholder}
          inputMode="numeric"
          autoComplete="cc-number"
          aria-label="Номер карты с нативным placeholder"
        />
      </StoryDemoItem>
      <StoryDemoItem>
        <StoryDemoDescription>
          Placeholder под управлением <code>maskitoWithPlaceholder</code>
        </StoryDemoDescription>
        <Input
          {...args}
          ref={placeholderInputRef}
          name="card-number-maskito-placeholder"
          value={placeholderValue}
          onInput={handlePlaceholderInput}
          placeholder={cardNumberPlaceholder}
          showClearIcon={args.showClearIcon && placeholderMask.removePlaceholder(placeholderValue).length > 0}
          inputMode="numeric"
          autoComplete="cc-number"
          aria-label="Номер карты с placeholder Maskito"
        />
      </StoryDemoItem>
      <StoryDemoDescription>
        Оба controlled Input используют одну маску номера карты и обновляют значение через <code>onInput</code>.
      </StoryDemoDescription>
    </StoryDemoContainer>
  );
};
