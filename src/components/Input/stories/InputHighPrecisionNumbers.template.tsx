import { useState, type InputEvent } from 'react';

import type { MaskitoOptions } from '@maskito/core';
import { maskitoNumber, type MaskitoNumberParams } from '@maskito/kit';
import { useMaskito } from '@maskito/react';

import { Input, type InputProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription, StoryDemoItem } from '../../stories/StoryContainers';

const baseNumberParams: MaskitoNumberParams = {
  decimalSeparator: ',',
  decimalPseudoSeparators: ['.'],
  thousandSeparator: ' ',
  maximumFractionDigits: Infinity,
  min: 0,
};

const highPrecisionMask = maskitoNumber(baseNumberParams);
const fourFractionDigitsMaskBase = maskitoNumber({ ...baseNumberParams, maximumFractionDigits: 4 });
const fourFractionDigitsMask: MaskitoOptions = {
  ...fourFractionDigitsMaskBase,
  overwriteMode: ({ value, selection: [from] }) =>
    from > value.indexOf(',') && value.includes(',') ? 'replace' : 'shift',
};
const percentageMask = maskitoNumber({
  ...baseNumberParams,
  maximumFractionDigits: 2,
  max: 100,
  postfix: ' %',
});
const twoFractionDigitsMask = maskitoNumber({
  ...baseNumberParams,
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});
const distanceMask = maskitoNumber({
  ...baseNumberParams,
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
  postfix: ' км',
});
const rublePrefixMask = maskitoNumber({ ...baseNumberParams, prefix: 'RUB ' });
const negativeNumberMask = maskitoNumber({ ...baseNumberParams, min: -Infinity, minusSign: '-' });
const threeDigitsMask = maskitoNumber({
  maximumFractionDigits: 0,
  min: 0,
  thousandSeparator: '',
});

type NumberInputExampleProps = {
  ariaLabel: string;
  initialValue: string;
  inputMode?: InputProps['inputMode'];
  mask: MaskitoOptions;
  maxLength?: number;
};

type HighPrecisionNumberInputProps = Omit<InputProps, keyof NumberInputExampleProps> & NumberInputExampleProps;

const HighPrecisionNumberInput = ({
  ariaLabel,
  initialValue,
  inputMode = 'decimal',
  mask,
  maxLength,
  ...args
}: HighPrecisionNumberInputProps) => {
  const [value, setValue] = useState(initialValue);
  const inputRef = useMaskito({ options: mask });

  const handleInput = (event: InputEvent<HTMLInputElement>) => {
    setValue(event.currentTarget.value);
  };

  return (
    <Input
      {...args}
      ref={inputRef}
      value={value}
      onInput={handleInput}
      inputMode={inputMode}
      maxLength={maxLength}
      aria-label={ariaLabel}
    />
  );
};

export const InputHighPrecisionNumbersTemplate = (args: InputProps) => (
  <StoryDemoContainer $direction="column" $gap="16px">
    <StoryDemoItem>
      <StoryDemoDescription>
        <strong>Ввод чисел с произвольным количеством знаков после запятой</strong>
      </StoryDemoDescription>
      <StoryDemoDescription>
        Целые числа автоматически отбиваются пробелами после каждых трех знаков.
      </StoryDemoDescription>
      <StoryDemoDescription>
        Форма принимает только цифры и одну запятую, остальные знаки игнорируются. При вводе точки она автоматически
        заменяется на запятую. Значения после запятой не разделяются пробелами.
      </StoryDemoDescription>
      <HighPrecisionNumberInput
        {...args}
        ariaLabel="Число с высокой точностью"
        initialValue="10 200 300,1234567890123456789"
        mask={highPrecisionMask}
      />
      <StoryDemoDescription>
        Если удалить запятую, ранее введенная дробная часть становится частью целого числа.
      </StoryDemoDescription>
      <StoryDemoDescription>
        Если набрано максимально допустимое количество знаков после запятой, новая цифра внутри дробной части заменяет
        цифру справа от каретки, сохраняя заданную точность.
      </StoryDemoDescription>
      <HighPrecisionNumberInput
        {...args}
        ariaLabel="Число с четырьмя знаками после запятой"
        initialValue="10 200 300,1234"
        mask={fourFractionDigitsMask}
      />
      <StoryDemoDescription>
        Если первым знаком набрать запятую или точку, маска автоматически добавит перед разделителем ноль.
      </StoryDemoDescription>
      <StoryDemoDescription>
        В примере используется российский формат с запятой. Для других локалей разделителем может быть точка.
      </StoryDemoDescription>
    </StoryDemoItem>

    <StoryDemoItem>
      <StoryDemoDescription>
        <strong>Suffix, Prefix</strong>
      </StoryDemoDescription>
      <StoryDemoDescription>
        Нередактируемый параметр можно установить в конце или начале значения: например, единицы измерения массы, длины,
        температуры или площади.
      </StoryDemoDescription>
      <StoryDemoDescription>
        В процентном поле нельзя поставить каретку после знака процента или удалить его. Значение ограничено диапазоном
        от 0 до 100 и двумя знаками после запятой.
      </StoryDemoDescription>
      <HighPrecisionNumberInput
        {...args}
        ariaLabel="Процент без дробной части"
        initialValue="0 %"
        mask={percentageMask}
      />
      <HighPrecisionNumberInput
        {...args}
        ariaLabel="Процент с двумя знаками после запятой"
        initialValue="50,25 %"
        mask={percentageMask}
      />
      <HighPrecisionNumberInput
        {...args}
        ariaLabel="Число с префиксом"
        initialValue="RUB 10 200 300,12"
        mask={rublePrefixMask}
      />
    </StoryDemoItem>

    <StoryDemoItem>
      <StoryDemoDescription>
        <strong>Десятичные по умолчанию</strong>
      </StoryDemoDescription>
      <StoryDemoDescription>
        Можно установить количество знаков, которое всегда отображается в дробной части числа.
      </StoryDemoDescription>
      <HighPrecisionNumberInput
        {...args}
        ariaLabel="Число с двумя десятичными знаками по умолчанию"
        initialValue="0,00"
        mask={twoFractionDigitsMask}
      />
      <HighPrecisionNumberInput
        {...args}
        ariaLabel="Расстояние с двумя десятичными знаками по умолчанию"
        initialValue="50,00 км"
        mask={distanceMask}
      />
    </StoryDemoItem>

    <StoryDemoItem>
      <StoryDemoDescription>
        <strong>Динамическая маска десятичных значений</strong>
      </StoryDemoDescription>
      <StoryDemoDescription>
        Дробная часть может быть динамической и активироваться после того, как пользователь введет запятую или точку.
      </StoryDemoDescription>
      <HighPrecisionNumberInput
        {...args}
        ariaLabel="Число с динамической дробной частью"
        initialValue=""
        mask={highPrecisionMask}
      />
    </StoryDemoItem>

    <StoryDemoItem>
      <StoryDemoDescription>
        <strong>Отрицательные значения</strong>
      </StoryDemoDescription>
      <StoryDemoDescription>
        Опционально можно разрешить отрицательные значения со знаком минус «-», который вводится вручную так же, как
        цифры.
      </StoryDemoDescription>
      <HighPrecisionNumberInput
        {...args}
        ariaLabel="Отрицательное число"
        initialValue="-25"
        mask={negativeNumberMask}
      />
    </StoryDemoItem>

    <StoryDemoItem>
      <StoryDemoDescription>
        <strong>Ограничение количества знаков</strong>
      </StoryDemoDescription>
      <StoryDemoDescription>
        Можно задать максимальное количество знаков, которое разрешено ввести.
      </StoryDemoDescription>
      <StoryDemoDescription>Введите CVC код</StoryDemoDescription>
      <HighPrecisionNumberInput
        {...args}
        ariaLabel="Введите CVC код"
        initialValue="23"
        inputMode="numeric"
        mask={threeDigitsMask}
        maxLength={3}
      />
    </StoryDemoItem>
  </StoryDemoContainer>
);
