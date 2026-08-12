import styled from 'styled-components';

import { RadioButton, type RadioButtonDimension } from '@admiral-ds/admiral3-primitives';

const Table = styled.table`
  border-collapse: collapse;

  th,
  td {
    padding: 8px 12px;
    border: 1px solid var(--admiral-color-neutral-stroke-2-rest);
    text-align: left;
  }

  th:first-child,
  td:first-child {
    text-align: center;
  }
`;

const ROWS: Array<{ dimension: RadioButtonDimension; label: string }> = [
  { dimension: 'm', label: 'Первая строка' },
  { dimension: 's', label: 'Вторая строка' },
  { dimension: 'xs', label: 'Третья строка' },
];

export const RadioButtonTableDirtyTemplate = () => (
  <Table>
    <thead>
      <tr>
        <th scope="col">Выбор</th>
        <th scope="col">Строка</th>
        <th scope="col">Размер RadioButton</th>
      </tr>
    </thead>
    <tbody>
      {ROWS.map(({ dimension, label }, index) => (
        <tr key={dimension}>
          <td>
            <RadioButton
              aria-label={`Выбрать: ${label}`}
              data-testid={`table-radio-${dimension}`}
              defaultChecked={index === 0}
              dimension={dimension}
              name="table-row"
              value={dimension}
            />
          </td>
          <td>{label}</td>
          <td>{dimension}</td>
        </tr>
      ))}
    </tbody>
  </Table>
);
