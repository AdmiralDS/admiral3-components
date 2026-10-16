import { SystemLightModeOutline, SystemLightModeSolid } from '@admiral-ds/admiral3-icons';
import styled from 'styled-components';

import { Slider, type SliderProps } from '@admiral-ds/admiral3-components';

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
import { SLIDER_DIMENSIONS, SLIDER_THUMB_APPEARANCES } from '../../../src/components/Slider/constants';

const Sample = styled(VisualSample)`
  width: 240px;
  padding-inline: 12px;
`;
const STATES: Array<{ label: string; props: SliderProps }> = [
  { label: 'min', props: { value: 0 } },
  { label: 'middle', props: { value: 50 } },
  { label: 'max', props: { value: 100 } },
  { label: 'disabled min', props: { value: 0, disabled: true } },
  { label: 'disabled middle', props: { value: 50, disabled: true } },
  { label: 'disabled max', props: { value: 100, disabled: true } },
  { label: 'icons', props: { value: 50, iconStart: <SystemLightModeSolid />, iconEnd: <SystemLightModeOutline /> } },
  { label: 'without range', props: { value: 50, renderMarks: null } },
  { label: 'without value', props: { value: 50, renderValue: null } },
  { label: 'only slider', props: { value: 50, label: undefined, renderMarks: null } },
  {
    label: 'steps4',
    props: {
      value: 50,
      max: 150,
      marks: [0, 50, 100, 150],
    },
  },
  {
    label: 'steps5',
    props: {
      value: 50,
      marks: [0, 25, 50, 75, 100],
    },
  },
  {
    label: 'steps6',
    props: {
      value: 50,
      max: 125,
      marks: [0, 25, 50, 75, 100, 125],
    },
  },
  {
    label: 'steps min',
    props: {
      value: 0,
      marks: [0, 25, 50, 75, 100],
    },
  },
  {
    label: 'steps max',
    props: {
      value: 100,
      marks: [0, 25, 50, 75, 100],
    },
  },
  {
    label: 'steps disabled',
    props: {
      value: 50,
      disabled: true,
      marks: [0, 25, 50, 75, 100],
    },
  },
  {
    label: 'nonuniform marks',
    props: {
      value: 40,
      marks: [0, 10, 40, 70, 100],
    },
  },
  { label: 'marks without boundary values', props: { value: 40, marks: [10, 40, 70] } },
  { label: 'without label', props: { value: 50, label: undefined } },
  { label: 'icon left', props: { value: 50, iconStart: <SystemLightModeSolid /> } },
  { label: 'icon right', props: { value: 50, iconEnd: <SystemLightModeOutline /> } },
  {
    label: 'disabled icons',
    props: {
      value: 50,
      disabled: true,
      iconStart: <SystemLightModeSolid />,
      iconEnd: <SystemLightModeOutline />,
    },
  },
];
export const SliderVisualTemplate = () => (
  <VisualLayout>
    {SLIDER_THUMB_APPEARANCES.map((thumbAppearance) => (
      <VisualSection key={thumbAppearance}>
        <VisualTitle>{thumbAppearance}</VisualTitle>
        <VisualGroups>
          {STATES.map(({ label, props }) => (
            <VisualGroup key={label}>
              <VisualGroupTitle>{label}</VisualGroupTitle>
              <VisualSamples>
                {SLIDER_DIMENSIONS.map((dimension) => (
                  <Sample key={dimension}>
                    <VisualLabel>{dimension}</VisualLabel>
                    <Slider
                      label="Label text"
                      {...props}
                      nativeSliderProps={{ 'aria-label': `${label} ${dimension}`, ...props.nativeSliderProps }}
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
