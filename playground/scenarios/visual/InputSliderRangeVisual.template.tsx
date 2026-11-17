import type { ComponentProps } from 'react';

import styled from 'styled-components';

import { InputSliderRange } from '@admiral-ds/admiral3-components';

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
import { INPUT_SLIDER_RANGE_DIMENSIONS } from '../../../src/components/InputSliderRange/constants';

type VisualVariant = {
  label: string;
  props: ComponentProps<typeof InputSliderRange>;
};

const Sample = styled(VisualSample)`
  width: 320px;
`;

const VARIANTS: VisualVariant[] = INPUT_SLIDER_RANGE_DIMENSIONS.flatMap((dimension) =>
  INPUT_APPEARANCES.map((appearance) => ({
    label: `${dimension} / ${appearance}`,
    props: { dimension, lowerInputProps: { appearance }, upperInputProps: { appearance } },
  })),
);
const STATES: VisualVariant[] = [
  { label: 'default', props: {} },
  { label: 'disabled', props: { disabled: true } },
  { label: 'readOnly', props: { readOnly: true } },
  { label: 'error', props: { status: 'error' } },
  { label: 'success', props: { status: 'success' } },
  { label: 'clear', props: { lowerInputProps: { showClearIcon: true }, upperInputProps: { showClearIcon: true } } },
  {
    label: 'suffix',
    props: { lowerInputProps: { prefix: 'От', suffix: '₽' }, upperInputProps: { prefix: 'До', suffix: '₽' } },
  },
  { label: 'empty', props: { defaultValue: ['', ''] } },
  { label: 'equal', props: { defaultValue: ['50', '50'] } },
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
            <InputSliderRange
              defaultValue={['25', '75']}
              {...props}
              lowerInputProps={{ ...props.lowerInputProps, 'aria-label': `From ${label}` }}
              upperInputProps={{ ...props.upperInputProps, 'aria-label': `To ${label}` }}
            />
          </Sample>
        </VisualSamples>
      </VisualGroup>
    ))}
  </VisualGroups>
);

export const InputSliderRangeVisualTemplate = () => (
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
