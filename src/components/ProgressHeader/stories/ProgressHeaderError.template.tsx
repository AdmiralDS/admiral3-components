import { ProgressHeader } from '@admiral-ds/admiral3-components';

export const ProgressHeaderErrorTemplate = () => {
  return (
    <>
      <ProgressHeader value={62} error aria-label="Не удалось загрузить страницу" />
      <p>При ошибке меняется только цвет индикатора, а его значение остаётся равным 62%.</p>
    </>
  );
};
