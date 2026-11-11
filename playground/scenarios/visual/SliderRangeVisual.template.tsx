import styled from 'styled-components';

import { SliderRange, type SliderRangeProps } from '@admiral-ds/admiral3-components';

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
import { SLIDER_RANGE_DIMENSIONS, SLIDER_THUMB_APPEARANCES } from '../../../src/components/SliderRange/constants';

const Sample = styled(VisualSample)`
  width: 240px;
  padding-inline: 12px;
`;
const STATES: Array<{ label: string; props: SliderRangeProps }> = [
  { label: 'middle', props: { value: [33, 66] } },
  { label: 'full range', props: { value: [0, 100] } },
  { label: 'coincident', props: { value: [50, 50] } },
  { label: 'coincident min', props: { value: [0, 0] } },
  { label: 'coincident max', props: { value: [100, 100] } },
  { label: 'disabled', props: { value: [33, 66], disabled: true } },
  { label: 'disabled full range', props: { value: [0, 100], disabled: true } },
  { label: 'without range', props: { value: [33, 66], renderMarks: null } },
  { label: 'without value', props: { value: [33, 66], renderValue: null } },
  { label: 'only controls', props: { value: [33, 66], label: undefined, renderMarks: null } },
  { label: 'without label', props: { value: [33, 66], label: undefined } },
];
export const SliderRangeVisualTemplate = () => (
  <VisualLayout>
    {SLIDER_THUMB_APPEARANCES.map((thumbAppearance) => (
      <VisualSection key={thumbAppearance}>
        <VisualTitle>{thumbAppearance}</VisualTitle>
        <VisualGroups>
          {STATES.map(({ label, props }) => (
            <VisualGroup key={label}>
              <VisualGroupTitle>{label}</VisualGroupTitle>
              <VisualSamples>
                {SLIDER_RANGE_DIMENSIONS.map((dimension) => (
                  <Sample key={dimension}>
                    <VisualLabel>{dimension}</VisualLabel>
                    <SliderRange
                      label="Label text"
                      lowerNativeSliderProps={{ 'aria-label': 'Minimum value' }}
                      upperNativeSliderProps={{ 'aria-label': 'Maximum value' }}
                      {...props}
                      dimension={dimension}
                      thumbAppearance={thumbAppearance}
                    />
                  </Sample>
                ))}
              </VisualSamples>
            </VisualGroup>
          ))}
        </VisualGroups>
      </VisualSection>
    ))}
  </VisualLayout>
);
