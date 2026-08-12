import { textStyles } from '@admiral-ds/admiral3-tokens';
import styled from 'styled-components';

import { CheckBox, type CheckBoxProps } from '@admiral-ds/admiral3-primitives';

import { StoryDemoContainer } from '../../stories/StoryContainers';
import { CHECK_BOX_DIMENSIONS } from '../constants';

const MatrixContainer = styled(StoryDemoContainer)`
  align-items: flex-start;
  justify-content: flex-start;
  overflow-x: auto;
`;

const StatesTable = styled.table`
  min-width: 640px;
  border-spacing: 0;
  border-collapse: collapse;
  color: var(--admiral-color-neutral-text-1-rest);
`;

const HeaderCell = styled.th`
  ${textStyles.body.body2Short}
  padding: 12px 16px;
  border-bottom: 1px solid var(--admiral-color-neutral-stroke-subtle-rest);
  text-align: left;
`;

const StateCell = styled.th`
  ${textStyles.body.body2Short}
  width: 200px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--admiral-color-neutral-stroke-subtle-rest);
  color: var(--admiral-color-neutral-text-2-rest);
  text-align: left;
`;

const CheckBoxCell = styled.td`
  min-width: 140px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--admiral-color-neutral-stroke-subtle-rest);
`;

type CheckBoxState = {
  label: string;
  props: Pick<CheckBoxProps, 'defaultChecked' | 'disabled' | 'error' | 'indeterminate' | 'readOnly'>;
};

const CHECK_BOX_STATES: CheckBoxState[] = [
  { label: 'Default', props: {} },
  { label: 'Checked', props: { defaultChecked: true } },
  { label: 'Indeterminate', props: { indeterminate: true } },
  { label: 'Error', props: { error: true } },
  { label: 'Disabled', props: { disabled: true } },
  { label: 'Disabled Checked', props: { defaultChecked: true, disabled: true } },
  { label: 'Disabled Indeterminate', props: { indeterminate: true, disabled: true } },
  { label: 'Read Only', props: { readOnly: true } },
  { label: 'Read Only Checked', props: { defaultChecked: true, readOnly: true } },
  { label: 'Read Only Indeterminate', props: { indeterminate: true, readOnly: true } },
];

export const CheckBoxStatesTemplate = (args: CheckBoxProps) => (
  <MatrixContainer>
    <StatesTable aria-label="Состояния CheckBox по размерам">
      <thead>
        <tr>
          <HeaderCell scope="col">Состояние</HeaderCell>
          {CHECK_BOX_DIMENSIONS.map((dimension) => (
            <HeaderCell key={dimension} scope="col">
              {dimension.toUpperCase()}
            </HeaderCell>
          ))}
        </tr>
      </thead>
      <tbody>
        {CHECK_BOX_STATES.map((state) => (
          <tr key={state.label}>
            <StateCell scope="row">{state.label}</StateCell>
            {CHECK_BOX_DIMENSIONS.map((dimension) => (
              <CheckBoxCell key={dimension}>
                <CheckBox
                  {...args}
                  {...state.props}
                  aria-label={`${state.label}, размер ${dimension.toUpperCase()}`}
                  dimension={dimension}
                >
                  Размер {dimension.toUpperCase()}
                </CheckBox>
              </CheckBoxCell>
            ))}
          </tr>
        ))}
      </tbody>
    </StatesTable>
  </MatrixContainer>
);
