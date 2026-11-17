import { useState } from 'react';

import { Button, InputSlider } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription, StoryDemoItem } from '../../stories/StoryContainers';

/** Внутренний сценарий нативных form/reset и fieldset для e2e. */
export const InputSliderNativeFormTemplate = () => {
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [submitted, setSubmitted] = useState('');
  const [formData, setFormData] = useState('');
  const [controlledValue, setControlledValue] = useState('40');
  return (
    <StoryDemoContainer $direction="column" $gap="24px">
      <StoryDemoItem
        as="form"
        id="input-slider-form"
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))));
        }}
      >
        <fieldset disabled={disabled}>
          <legend>Значения</legend>
          <InputSlider
            inputProps={{ 'aria-label': 'Сумма', showClearIcon: true }}
            name="amount"
            defaultValue="20"
            required
            readOnly={readOnly}
          />
          <InputSlider
            inputProps={{ 'aria-label': 'Controlled' }}
            name="controlled"
            value={controlledValue}
            onValueChange={setControlledValue}
          />
        </fieldset>
        <Button type="submit">Отправить</Button>
        <Button type="button" onClick={(event) => event.currentTarget.form?.requestSubmit()}>
          Вызвать requestSubmit
        </Button>
        <Button
          type="button"
          onClick={(event) => {
            const form = event.currentTarget.form;
            if (form) setFormData(JSON.stringify(Object.fromEntries(new FormData(form))));
          }}
        >
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
      <StoryDemoItem>
        <InputSlider
          inputProps={{ 'aria-label': 'Внешнее поле' }}
          name="external"
          form="input-slider-form"
          defaultValue="10"
        />
      </StoryDemoItem>
    </StoryDemoContainer>
  );
};
