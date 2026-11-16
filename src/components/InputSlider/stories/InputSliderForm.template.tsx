import { useState, type FormEvent } from 'react';

import { Button, CheckBox, InputSlider } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription, StoryDemoItem } from '../../stories/StoryContainers';

export const InputSliderFormTemplate = () => {
  const [required, setRequired] = useState(true);
  const [submitted, setSubmitted] = useState('');
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))));
  };

  return (
    <StoryDemoContainer $direction="column" $gap="24px">
      <StoryDemoDescription>
        Name задаёт единственное отправляемое поле: amount. Текстовый Input и нативный ползунок не имеют имени. Required
        запрещает пустоту, нечисловой текст блокирует submit независимо от required. Число за диапазоном исправляется
        при выходе из поля. Без required очищенное поле отправляет пустую строку.
      </StoryDemoDescription>
      <StoryDemoDescription>
        Кнопка «Сбросить» восстанавливает defaultValue и снимает ошибку промежуточного ввода. В controlled-режиме
        исходное значение восстанавливает владелец через value; нативный reset очищает промежуточный текст. Прямой new
        FormData(form) не запускает валидацию: для невалидного текста будет пустая строка.
      </StoryDemoDescription>
      <StoryDemoItem>
        <CheckBox checked={required} onChange={(event) => setRequired(event.target.checked)}>
          Обязательное поле
        </CheckBox>
      </StoryDemoItem>
      <StoryDemoItem as="form" onSubmit={handleSubmit} onReset={() => setSubmitted('')}>
        <InputSlider
          name="amount"
          defaultValue="50"
          required={required}
          inputProps={{ 'aria-label': 'Сумма', showClearIcon: true }}
        />
        <Button type="submit">Отправить</Button>
        <Button type="reset">Сбросить</Button>
        <StoryDemoDescription role="status" aria-label="Отправлено">
          {submitted}
        </StoryDemoDescription>
      </StoryDemoItem>
    </StoryDemoContainer>
  );
};
