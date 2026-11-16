import { useState, type FormEvent } from 'react';

import { maskitoNumber, maskitoParseNumber, maskitoStringifyNumber, type MaskitoNumberParams } from '@maskito/kit';
import { useMaskito } from '@maskito/react';

import { Button, InputSliderRange, type InputSliderRangeValue } from '@admiral-ds/admiral3-components';

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

export const InputSliderRangeCurrencyTemplate = () => {
  const [value, setValue] = useState<InputSliderRangeValue>(['10000.5', '15000']);
  const [submitted, setSubmitted] = useState('');
  const lowerNativeInputRef = useMaskito({ options: mask });
  const upperNativeInputRef = useMaskito({ options: mask });
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setSubmitted(JSON.stringify({ lower: data.get('lower'), upper: data.get('upper') }));
  };

  return (
    <StoryDemoContainer $direction="column" $gap="24px">
      <StoryDemoDescription>
        Maskito подключается к каждому полю снаружи. Тысячи разделены пробелами, после запятой два знака, «руб» входит в
        маску. Tooltip также форматируется. Два скрытых поля отправляют исходные строки без форматирования. Очистка
        сохраняет пустую строку; число за диапазоном или соседней границей исправляется на blur.
      </StoryDemoDescription>
      <StoryDemoItem as="form" onSubmit={handleSubmit}>
        <InputSliderRange
          lowerName="lower"
          upperName="upper"
          value={value}
          onValueChange={setValue}
          lowerNativeInputRef={lowerNativeInputRef}
          upperNativeInputRef={upperNativeInputRef}
          formatValue={formatValue}
          parseValue={parseValue}
          min={0}
          max={20_000}
          step={0.01}
          sliderProps={{ renderMarks: (value) => value.toLocaleString('ru-RU'), renderValue: formatValue }}
          lowerInputProps={{ 'aria-label': 'Сумма от', inputMode: 'decimal', showClearIcon: true }}
          upperInputProps={{ 'aria-label': 'Сумма до', inputMode: 'decimal', showClearIcon: true }}
        />
        <Button type="submit">Отправить</Button>
        <Button type="reset">Сбросить ввод</Button>
        <StoryDemoDescription role="status" aria-label="Отправлено">
          {submitted}
        </StoryDemoDescription>
      </StoryDemoItem>
    </StoryDemoContainer>
  );
};
