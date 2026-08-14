import { useState } from 'react';

import { textStyles } from '@admiral-ds/admiral3-tokens';
import styled from 'styled-components';

import { CheckBox } from '@admiral-ds/admiral3-primitives';

const Table = styled.table`
  width: min(100%, 760px);
  border: 1px solid var(--admiral-color-neutral-stroke-subtle-rest);
  border-radius: var(--admiral-radius-by-base-4-medium);
  border-spacing: 0;
  background: var(--admiral-color-neutral-base-1-rest);
  color: var(--admiral-color-neutral-text-1-rest);
  overflow: hidden;
  ${textStyles.body.body2Short}
`;

const HeaderCell = styled.th`
  padding: 12px 16px;
  border-bottom: 1px solid var(--admiral-color-neutral-stroke-subtle-rest);
  background: var(--admiral-color-neutral-base-2-rest);
  text-align: left;
  ${textStyles.subtitle.subtitle3}
`;

const Cell = styled.td`
  padding: 12px 16px;
  border-bottom: 1px solid var(--admiral-color-neutral-stroke-subtle-rest);
`;

const CheckBoxCell = styled(Cell)`
  width: 24px;
  text-align: center;
`;

const CheckBoxHeaderCell = styled(HeaderCell)`
  width: 24px;
  text-align: center;
`;

const TableRow = styled.tr`
  &:last-child ${Cell} {
    border-bottom: 0;
  }
`;

const tableRows = [
  { id: 'report', name: 'Ежемесячный отчёт', owner: 'Анна Смирнова', status: 'Готов' },
  { id: 'contract', name: 'Договор поставки', owner: 'Иван Петров', status: 'На согласовании' },
  { id: 'presentation', name: 'Презентация проекта', owner: 'Мария Волкова', status: 'Черновик' },
  { id: 'research', name: 'Исследование рынка', owner: 'Олег Соколов', status: 'Готов' },
] as const;

export const CheckBoxTableSelectionTemplate = () => {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const allRowsSelected = selectedRows.length === tableRows.length;
  const someRowsSelected = selectedRows.length > 0 && !allRowsSelected;

  const toggleRow = (rowId: string, checked: boolean) => {
    setSelectedRows((currentRows) =>
      checked ? [...currentRows, rowId] : currentRows.filter((currentRowId) => currentRowId !== rowId),
    );
  };

  return (
    <Table aria-label="Документы">
      <thead>
        <tr>
          <CheckBoxHeaderCell scope="col">
            <CheckBox
              aria-label="Выбрать все строки"
              checked={allRowsSelected}
              indeterminate={someRowsSelected}
              onChange={(event) => setSelectedRows(event.currentTarget.checked ? tableRows.map(({ id }) => id) : [])}
            />
          </CheckBoxHeaderCell>
          <HeaderCell scope="col">Документ</HeaderCell>
          <HeaderCell scope="col">Владелец</HeaderCell>
          <HeaderCell scope="col">Статус</HeaderCell>
        </tr>
      </thead>
      <tbody>
        {tableRows.map((row) => {
          const checked = selectedRows.includes(row.id);

          return (
            <TableRow key={row.id}>
              <CheckBoxCell>
                <CheckBox
                  aria-label={`Выбрать строку «${row.name}»`}
                  checked={checked}
                  onChange={(event) => toggleRow(row.id, event.currentTarget.checked)}
                />
              </CheckBoxCell>
              <Cell>{row.name}</Cell>
              <Cell>{row.owner}</Cell>
              <Cell>{row.status}</Cell>
            </TableRow>
          );
        })}
      </tbody>
    </Table>
  );
};
