import { useEffect, useState } from 'react';

import { ProgressHeader } from '@admiral-ds/admiral3-components';

export const ProgressHeaderAnimationTemplate = () => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setValue((currentValue) => (currentValue >= 100 ? 0 : currentValue + 5));
    }, 250);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <>
      <ProgressHeader value={value} aria-label="Загрузка страницы" />
      <p>Загружено: {value}%</p>
    </>
  );
};
