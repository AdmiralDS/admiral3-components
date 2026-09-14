import { useState, type InputEvent } from 'react';

import { maskitoUpdateElement, type MaskitoOptions } from '@maskito/core';
import { maskitoEventHandler, maskitoNumber, type MaskitoNumberParams } from '@maskito/kit';
import { useMaskito } from '@maskito/react';
import styled from 'styled-components';

import { Input, type InputProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription, StoryDemoItem } from '../../stories/StoryContainers';

const currencyNumberParams: MaskitoNumberParams = {
  decimalSeparator: ',',
  decimalPseudoSeparators: ['.'],
  thousandSeparator: ' ',
  maximumFractionDigits: 2,
};

const baseCurrencyMask = maskitoNumber(currencyNumberParams);

const currencyMask: MaskitoOptions = {
  ...baseCurrencyMask,
  overwriteMode: ({ value, selection: [from] }) =>
    from > value.indexOf(',') && value.includes(',') ? 'replace' : 'shift',
  plugins: [
    ...(baseCurrencyMask.plugins ?? []),
    maskitoEventHandler(
      'blur',
      (element) => {
        if (/,[0-9]$/.test(element.value)) {
          maskitoUpdateElement(element, `${element.value}0`);
        }
      },
      { capture: true },
    ),
  ],
};

const lowerBoundMask = maskitoNumber({ ...currencyNumberParams, min: 0, max: 100_000 });
const upperBoundMask = maskitoNumber({ ...currencyNumberParams, min: 0, max: 100_000 });

const CurrencyRange = styled.div`
  display: flex;
  width: 100%;
  gap: 16px;

  > * {
    flex: 1 1 0;
    min-width: 0;
  }
`;

const CurrencyRangeItem = styled(StoryDemoItem)`
  inline-size: min(100%, 656px);
`;

type CurrencyInputProps = InputProps & {
  ariaLabel?: string;
  initialValue?: string;
  mask?: MaskitoOptions;
  rangePrefix?: 'От' | 'До';
};

const CurrencyInput = ({
  ariaLabel = 'Сумма в рублях',
  initialValue = '25 000,50',
  mask = currencyMask,
  rangePrefix,
  ...args
}: CurrencyInputProps) => {
  const [value, setValue] = useState(initialValue);
  const inputRef = useMaskito({ options: mask });

  const handleInput = (event: InputEvent<HTMLInputElement>) => {
    setValue(event.currentTarget.value);
  };

  return (
    <Input
      {...args}
      ref={inputRef}
      name="currency-rub"
      value={value}
      onInput={handleInput}
      inputMode="decimal"
      prefix={rangePrefix}
      suffix="RUB"
      showAffixDivider={false}
      aria-label={ariaLabel}
    />
  );
};

export const InputCurrencyTemplate = (args: InputProps) => (
  <StoryDemoContainer $direction="column" $gap="16px">
    <StoryDemoDescription>
      Компонент для ввода числовых значений валюты с точностью до двух знаков после запятой. Особенности:
    </StoryDemoDescription>
    <StoryDemoDescription as="ul">
      <li>Возможен ввод как целых чисел, так и с двумя знаками после запятой.</li>
      <li>Если при вводе цифр нажать «,» (запятая), то включается маска ввода сотых значений.</li>
      <li>Введенная «.» (точка) автоматически конвертируется в «,» (запятая).</li>
      <li>Валюта ввода может быть как фиксированной (только рубли, например), так и изменяемой через суффикс поля.</li>
      <li>Автопробел каждые три знака в целой части суммы.</li>
      <li>Можно указывать минимальные и максимальные значения для вводимой суммы.</li>
    </StoryDemoDescription>
    <StoryDemoItem>
      <CurrencyInput {...args} />
    </StoryDemoItem>
    <StoryDemoDescription>
      Для полей диапазона ограничения минимального и максимального значения задаются в настройках маски. Подписи «От» и
      «До» передаются через префикс Input. Префиксы и суффикс валюты отображаются без разделителей.
    </StoryDemoDescription>
    <CurrencyRangeItem>
      <CurrencyRange>
        <CurrencyInput
          {...args}
          ariaLabel="Нижняя граница суммы"
          initialValue="1 000"
          mask={lowerBoundMask}
          rangePrefix="От"
        />
        <CurrencyInput
          {...args}
          ariaLabel="Верхняя граница суммы"
          initialValue="100 000"
          mask={upperBoundMask}
          rangePrefix="До"
        />
      </CurrencyRange>
    </CurrencyRangeItem>
  </StoryDemoContainer>
);
