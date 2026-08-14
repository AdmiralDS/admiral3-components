import { CheckBox, type CheckBoxProps } from '@admiral-ds/admiral3-primitives';

import {
  VisualGroup,
  VisualGroups,
  VisualGroupTitle,
  VisualLabel,
  VisualLayout,
  VisualSample,
  VisualSamples,
  VisualSection,
  VisualTitle,
} from './VisualLayout';
import { CHECK_BOX_DIMENSIONS } from '../../../src/components/CheckBox/constants';

const CHECK_BOX_STATES: Array<{
  label: string;
  props: Pick<CheckBoxProps, 'defaultChecked' | 'disabled' | 'error' | 'indeterminate' | 'readOnly'>;
}> = [
  { label: 'default', props: {} },
  { label: 'checked', props: { defaultChecked: true } },
  { label: 'indeterminate', props: { indeterminate: true } },
  { label: 'error', props: { error: true } },
  { label: 'disabled', props: { disabled: true } },
  { label: 'disabled checked', props: { defaultChecked: true, disabled: true } },
  { label: 'disabled indeterminate', props: { disabled: true, indeterminate: true } },
  { label: 'readOnly', props: { readOnly: true } },
  { label: 'readOnly checked', props: { defaultChecked: true, readOnly: true } },
  { label: 'readOnly indeterminate', props: { indeterminate: true, readOnly: true } },
];

const renderStates = (withExtraText: boolean) => (
  <VisualGroups>
    {CHECK_BOX_STATES.map(({ label, props }) => (
      <VisualGroup key={label}>
        <VisualGroupTitle>{label}</VisualGroupTitle>
        <VisualSamples>
          {CHECK_BOX_DIMENSIONS.map((dimension) => (
            <VisualSample key={dimension}>
              <VisualLabel>{dimension}</VisualLabel>
              <CheckBox {...props} dimension={dimension} extraText={withExtraText ? 'Дополнительный текст' : undefined}>
                CheckBox
              </CheckBox>
            </VisualSample>
          ))}
        </VisualSamples>
      </VisualGroup>
    ))}
  </VisualGroups>
);

export const CheckBoxVisualTemplate = () => (
  <VisualLayout>
    <VisualSection>
      <VisualTitle>States</VisualTitle>
      {renderStates(false)}
    </VisualSection>
    <VisualSection>
      <VisualTitle>States with extra text</VisualTitle>
      {renderStates(true)}
    </VisualSection>
  </VisualLayout>
);
