import { RadioButton, RadioGroup, type RadioButtonProps } from '@admiral-ds/admiral3-components';

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
import { RADIO_BUTTON_DIMENSIONS } from '../../../src/components/RadioButton/constants';

const RADIO_BUTTON_STATES: Array<{
  label: string;
  props: Pick<RadioButtonProps, 'defaultChecked' | 'disabled' | 'error'>;
}> = [
  { label: 'default', props: {} },
  { label: 'checked', props: { defaultChecked: true } },
  { label: 'error', props: { error: true } },
  { label: 'disabled', props: { disabled: true } },
  { label: 'disabled checked', props: { defaultChecked: true, disabled: true } },
];

const renderStates = (withExtraText: boolean) => (
  <VisualGroups>
    {RADIO_BUTTON_STATES.map(({ label, props }) => (
      <VisualGroup key={label}>
        <VisualGroupTitle>{label}</VisualGroupTitle>
        <VisualSamples>
          {RADIO_BUTTON_DIMENSIONS.map((dimension) => (
            <VisualSample key={dimension}>
              <VisualLabel>{dimension}</VisualLabel>
              <RadioButton
                {...props}
                dimension={dimension}
                extraText={withExtraText ? 'Дополнительный текст' : undefined}
                name={`visual-${dimension}-${label}-${withExtraText}`}
              >
                RadioButton
              </RadioButton>
            </VisualSample>
          ))}
        </VisualSamples>
      </VisualGroup>
    ))}
  </VisualGroups>
);

const renderReadOnlyStates = (withExtraText: boolean) => (
  <VisualGroups>
    <VisualGroup>
      <VisualGroupTitle>readOnly group</VisualGroupTitle>
      <VisualSamples>
        {RADIO_BUTTON_DIMENSIONS.map((dimension) => (
          <VisualSample key={dimension}>
            <VisualLabel>{dimension}</VisualLabel>
            <RadioGroup
              name={`visual-readonly-${dimension}-${withExtraText}`}
              dimension={dimension}
              defaultValue="checked"
              readOnly
            >
              <RadioButton value="checked" extraText={withExtraText ? 'Дополнительный текст' : undefined}>
                Checked RadioButton
              </RadioButton>
              <RadioButton value="unchecked" extraText={withExtraText ? 'Дополнительный текст' : undefined}>
                Not checked RadioButton
              </RadioButton>
            </RadioGroup>
          </VisualSample>
        ))}
      </VisualSamples>
    </VisualGroup>
  </VisualGroups>
);

export const RadioButtonVisualTemplate = () => (
  <VisualLayout>
    <VisualSection>
      <VisualTitle>States</VisualTitle>
      {renderStates(false)}
    </VisualSection>
    <VisualSection>
      <VisualTitle>States with extra text</VisualTitle>
      {renderStates(true)}
    </VisualSection>
    <VisualSection>
      <VisualTitle>ReadOnly RadioGroup</VisualTitle>
      {renderReadOnlyStates(false)}
    </VisualSection>
    <VisualSection>
      <VisualTitle>ReadOnly RadioGroup with extra text</VisualTitle>
      {renderReadOnlyStates(true)}
    </VisualSection>
  </VisualLayout>
);
