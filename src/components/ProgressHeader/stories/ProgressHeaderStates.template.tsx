import { useState } from 'react';

import { ProgressHeader } from '@admiral-ds/admiral3-components';

export const ProgressHeaderStatesTemplate = () => {
  const [value, setValue] = useState<number | undefined>(35);

  return (
    <>
      <ProgressHeader value={value} aria-label="Загрузка страницы" />
      <p>{value === undefined ? 'Неопределённый прогресс' : `Загружено: ${value}%`}</p>
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="button" onClick={() => setValue(35)}>
          Determinate
        </button>
        <button type="button" onClick={() => setValue(undefined)}>
          Indeterminate
        </button>
      </div>
    </>
  );
};
