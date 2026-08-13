import { Toggle, type ToggleProps } from '@admiral-ds/admiral3-primitives';

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
import { TOGGLE_DIMENSIONS } from '../../../src/components/Toggle/constants';

const TOGGLE_STATES: Array<{
  label: string;
  props: Pick<ToggleProps, 'defaultChecked' | 'disabled' | 'readOnly'>;
}> = [
  { label: 'default', props: {} },
  { label: 'active', props: { defaultChecked: true } },
  { label: 'disabled', props: { disabled: true } },
  { label: 'disabled active', props: { defaultChecked: true, disabled: true } },
  { label: 'readOnly', props: { readOnly: true } },
  { label: 'readOnly active', props: { defaultChecked: true, readOnly: true } },
];

const renderStates = (labelPosition: NonNullable<ToggleProps['labelPosition']>, withExtraText: boolean) => (
  <VisualGroups>
    {TOGGLE_STATES.map(({ label, props }) => (
      <VisualGroup key={label}>
        <VisualGroupTitle>{label}</VisualGroupTitle>
        <VisualSamples>
          {TOGGLE_DIMENSIONS.map((dimension) => (
            <VisualSample key={dimension}>
              <VisualLabel>{dimension}</VisualLabel>
              <Toggle
                {...props}
                dimension={dimension}
                labelPosition={labelPosition}
                extraText={withExtraText ? 'Additional text' : undefined}
              >
                Toggle text
              </Toggle>
            </VisualSample>
          ))}
        </VisualSamples>
      </VisualGroup>
    ))}
  </VisualGroups>
);

const renderWithoutLabel = () => (
  <VisualGroups>
    {TOGGLE_STATES.map(({ label, props }) => (
      <VisualGroup key={label}>
        <VisualGroupTitle>{label}</VisualGroupTitle>
        <VisualSamples>
          {TOGGLE_DIMENSIONS.map((dimension) => (
            <VisualSample key={dimension}>
              <VisualLabel>{dimension}</VisualLabel>
              <Toggle {...props} dimension={dimension} aria-label={`${label} ${dimension}`} />
            </VisualSample>
          ))}
        </VisualSamples>
      </VisualGroup>
    ))}
  </VisualGroups>
);

const renderFixedWidth = (labelPosition: NonNullable<ToggleProps['labelPosition']>) => (
  <VisualGroup>
    <VisualGroupTitle>label {labelPosition}</VisualGroupTitle>
    <VisualSamples>
      {TOGGLE_DIMENSIONS.map((dimension) => (
        <VisualSample key={dimension}>
          <VisualLabel>{dimension}</VisualLabel>
          <Toggle width={192} dimension={dimension} labelPosition={labelPosition}>
            Toggle text
          </Toggle>
          <Toggle width={192} dimension={dimension} labelPosition={labelPosition} defaultChecked extraText="Add text">
            Toggle text
          </Toggle>
        </VisualSample>
      ))}
    </VisualSamples>
  </VisualGroup>
);

export const ToggleVisualTemplate = () => (
  <VisualLayout>
    <VisualSection>
      <VisualTitle>States with label right</VisualTitle>
      {renderStates('right', false)}
    </VisualSection>
    <VisualSection>
      <VisualTitle>States with label left</VisualTitle>
      {renderStates('left', false)}
    </VisualSection>
    <VisualSection>
      <VisualTitle>States with extra text and label right</VisualTitle>
      {renderStates('right', true)}
    </VisualSection>
    <VisualSection>
      <VisualTitle>States with extra text and label left</VisualTitle>
      {renderStates('left', true)}
    </VisualSection>
    <VisualSection>
      <VisualTitle>States without label</VisualTitle>
      {renderWithoutLabel()}
    </VisualSection>
    <VisualSection>
      <VisualTitle>Fixed width</VisualTitle>
      <VisualGroups>
        {renderFixedWidth('right')}
        {renderFixedWidth('left')}
      </VisualGroups>
    </VisualSection>
  </VisualLayout>
);
