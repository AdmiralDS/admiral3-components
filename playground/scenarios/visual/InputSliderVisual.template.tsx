import type { ComponentProps } from 'react';

import styled from 'styled-components';

import { InputSlider } from '@admiral-ds/admiral3-components';

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
import { INPUT_APPEARANCES } from '../../../src/components/Input/constants';
import { INPUT_SLIDER_DIMENSIONS } from '../../../src/components/InputSlider/constants';

type VisualVariant = { label: string; props: ComponentProps<typeof InputSlider> };

const Sample = styled(VisualSample)`
  width: 320px;
`;

const VARIANTS: VisualVariant[] = INPUT_SLIDER_DIMENSIONS.flatMap((dimension) =>
  INPUT_APPEARANCES.map((appearance) => ({
    label: `${dimension} / ${appearance}`,
    props: { dimension, inputProps: { appearance } },
  })),
);
const STATES: VisualVariant[] = [
  { label: 'default', props: {} },
  { label: 'disabled', props: { disabled: true } },
  { label: 'readOnly', props: { readOnly: true } },
  { label: 'error', props: { status: 'error' } },
  { label: 'success', props: { status: 'success' } },
  { label: 'clear', props: { inputProps: { showClearIcon: true } } },
  { label: 'marks', props: { marks: [0, 25, 50, 100] } },
  { label: 'suffix', props: { inputProps: { suffix: '₽' } } },
  { label: 'no scale', props: { sliderProps: { renderMarks: null } } },
];

const renderMatrix = (items: VisualVariant[]) => (
  <VisualGroups>
    {items.map(({ label, props }) => (
      <VisualGroup key={label}>
        <VisualGroupTitle>{label}</VisualGroupTitle>
        <VisualSamples>
          <Sample>
            <VisualLabel>{label}</VisualLabel>
            <InputSlider defaultValue="50" {...props} inputProps={{ ...props.inputProps, 'aria-label': label }} />
          </Sample>
        </VisualSamples>
      </VisualGroup>
    ))}
  </VisualGroups>
);

export const InputSliderVisualTemplate = () => (
  <VisualLayout>
    <VisualSection>
      <VisualTitle>Sizes and appearances</VisualTitle>
      {renderMatrix(VARIANTS)}
    </VisualSection>
    <VisualSection>
      <VisualTitle>States</VisualTitle>
      {renderMatrix(STATES)}
    </VisualSection>
  </VisualLayout>
);
