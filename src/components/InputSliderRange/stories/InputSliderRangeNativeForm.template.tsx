import { useState, type FormEvent, type MouseEvent } from 'react';

import { Button, InputSliderRange } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription, StoryDemoItem } from '../../stories/StoryContainers';

/** Внутренний сценарий нативной валидации, reset и fieldset для e2e. */
export const InputSliderRangeNativeFormTemplate = () => {
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [submitted, setSubmitted] = useState('');
  const [formData, setFormData] = useState('');
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))));
  };
  const handleReadData = (event: MouseEvent<HTMLButtonElement>) => {
    const form = event.currentTarget.form;
    if (form) setFormData(JSON.stringify(Object.fromEntries(new FormData(form))));
  };
  const handleRequestSubmit = (event: MouseEvent<HTMLButtonElement>) => event.currentTarget.form?.requestSubmit();
  return (
    <StoryDemoContainer $direction="column" $gap="24px">
      <StoryDemoItem as="form" id="input-slider-range-form" onSubmit={handleSubmit}>
        <fieldset disabled={disabled}>
          <legend>Интервал</legend>
          <InputSliderRange
            lowerName="lower"
            upperName="upper"
            defaultValue={['25', '75']}
            required
            readOnly={readOnly}
            lowerInputProps={{ 'aria-label': 'От', showClearIcon: true }}
            upperInputProps={{ 'aria-label': 'До', showClearIcon: true }}
          />
        </fieldset>
        <Button type="submit">Отправить</Button>
        <Button type="button" onClick={handleRequestSubmit}>
          Вызвать requestSubmit
        </Button>
        <Button type="button" onClick={handleReadData}>
          Прочитать FormData
        </Button>
        <Button type="reset">Сбросить</Button>
        <Button type="button" onClick={() => setDisabled(!disabled)}>
          Переключить fieldset
        </Button>
        <Button type="button" onClick={() => setReadOnly(!readOnly)}>
          Переключить readOnly
        </Button>
        <StoryDemoDescription role="status" aria-label="Отправлено">
          {submitted}
        </StoryDemoDescription>
        <StoryDemoDescription role="status" aria-label="Данные формы">
          {formData}
        </StoryDemoDescription>
      </StoryDemoItem>
    </StoryDemoContainer>
  );
};
