import { useState, type FormEvent } from 'react';

import { Button, CheckBox, InputSliderRange } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription, StoryDemoItem } from '../../stories/StoryContainers';

export const InputSliderRangeFormTemplate = () => {
  const [required, setRequired] = useState(true);
  const [submitted, setSubmitted] = useState('');
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))));
  };

  return (
    <StoryDemoContainer $direction="column" $gap="24px">
      <StoryDemoDescription>
        LowerName и upperName задают два отдельных скрытых поля формы: amountFrom и amountTo. Они отправляют исходные
        числовые строки без форматирования. Видимые поля и ползунки не имеют name. Required делает обязательными обе
        границы; без него пустая граница отправляется пустой строкой.
      </StoryDemoDescription>
      <StoryDemoDescription>
        Невалидный текст блокирует submit. На blur числа приводятся к допустимым границам с учётом зазора; нечисловой
        текст сохраняет ошибку. Reset восстанавливает defaultValue и очищает промежуточный ввод. В controlled-режиме
        value восстанавливает владелец. Прямой new FormData(form) не запускает проверку и содержит пустую строку для
        невалидного поля.
      </StoryDemoDescription>
      <StoryDemoItem>
        <CheckBox checked={required} onChange={(event) => setRequired(event.target.checked)}>
          Обе границы обязательны
        </CheckBox>
      </StoryDemoItem>
      <StoryDemoItem as="form" onSubmit={handleSubmit} onReset={() => setSubmitted('')}>
        <InputSliderRange
          lowerName="amountFrom"
          upperName="amountTo"
          defaultValue={['25', '75']}
          required={required}
          lowerInputProps={{ prefix: 'От', 'aria-label': 'Сумма от', showClearIcon: true }}
          upperInputProps={{ prefix: 'До', 'aria-label': 'Сумма до', showClearIcon: true }}
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
