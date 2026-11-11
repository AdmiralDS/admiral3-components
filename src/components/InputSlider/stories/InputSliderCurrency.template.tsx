import { useState } from 'react';

import { maskitoNumber, maskitoParseNumber, maskitoStringifyNumber, type MaskitoNumberParams } from '@maskito/kit';
import { useMaskito } from '@maskito/react';

import { Button, InputSlider } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription, StoryDemoItem } from '../../stories/StoryContainers';

const numberParams: MaskitoNumberParams = {
  decimalSeparator: ',',
  decimalPseudoSeparators: ['.'],
  thousandSeparator: ' ',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  postfix: ' руб',
};
const mask = maskitoNumber(numberParams);
const formatValue = (value: number) => maskitoStringifyNumber(value, numberParams);
const parseValue = (text: string) => {
  const number = maskitoParseNumber(text, numberParams);
  return Number.isFinite(number) ? number : null;
};

export const InputSliderCurrencyTemplate = () => {
  const [value, setValue] = useState('10000.5');
  const [submitted, setSubmitted] = useState('');
  const nativeInputRef = useMaskito({ options: mask });

  return (
    <StoryDemoContainer $direction="column" $gap="24px">
      <StoryDemoDescription>
        Maskito разделяет тысячи пробелами, задаёт два знака после запятой и добавляет «руб» внутри текстового поля.
        Дополнение входит в маску и значение видимого Input. Исходное value и данные формы содержат строку без
        форматирования: например, «10000.5» для «10 000,50 руб».
      </StoryDemoDescription>
      <StoryDemoItem
        as="form"
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(String(new FormData(event.currentTarget).get('amount')));
        }}
      >
        <InputSlider
          name="amount"
          value={value}
          onValueChange={setValue}
          nativeInputRef={nativeInputRef}
          formatValue={formatValue}
          parseValue={parseValue}
          min={0}
          max={20_000}
          step={0.01}
          sliderProps={{ renderMarks: (value) => value.toLocaleString('ru-RU'), renderValue: formatValue }}
          inputProps={{ 'aria-label': 'Сумма в рублях', inputMode: 'decimal', showClearIcon: true }}
        />
        <Button type="submit">Отправить</Button>
        <StoryDemoDescription role="status" aria-label="Отправлено">
          {submitted}
        </StoryDemoDescription>
      </StoryDemoItem>
    </StoryDemoContainer>
  );
};
