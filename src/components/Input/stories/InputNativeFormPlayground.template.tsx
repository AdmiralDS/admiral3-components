import { useState, type FormEvent, type InvalidEvent } from 'react';

import { Input } from '@admiral-ds/admiral3-components';

const FORM_ID = 'native-input-form';

export const InputNativeFormPlaygroundTemplate = () => {
  const [submittedData, setSubmittedData] = useState('');
  const [invalidCount, setInvalidCount] = useState(0);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmittedData(JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))));
  };

  const handleInvalid = (_event: InvalidEvent<HTMLInputElement>) => {
    setInvalidCount((count) => count + 1);
  };

  return (
    <>
      <form id={FORM_ID} data-testid="native-input-form" onReset={() => setSubmittedData('')} onSubmit={handleSubmit}>
        <Input
          aria-label="Логин"
          defaultValue="Admiral"
          name="login"
          onInvalid={handleInvalid}
          pattern="[A-Za-z]+"
          required
        />
        <Input aria-label="Токен только для чтения" defaultValue="read-only-token" name="token" readOnly />
        <Input aria-label="Отключённое поле" defaultValue="disabled-value" disabled name="disabledField" />
        <button type="submit">Отправить</button>
        <button type="reset">Сбросить</button>
      </form>
      <Input aria-label="Внешнее поле формы" defaultValue="external-value" form={FORM_ID} name="externalField" />
      <output data-testid="submitted-form-data">{submittedData}</output>
      <output data-testid="invalid-event-count">{invalidCount}</output>
    </>
  );
};
