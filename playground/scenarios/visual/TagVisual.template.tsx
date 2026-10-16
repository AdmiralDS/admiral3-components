import type { ComponentProps } from 'react';

import { TagDot } from '@admiral-ds/admiral3-components';

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
import { TAG_DIMENSIONS } from '../../../src/components/Tag/constants';

type VisualVariant = {
  label: string;
  props: ComponentProps<typeof TagDot>;
};

// Add every supported appearance alongside the generated dimension matrix.
const VARIANTS: VisualVariant[] = TAG_DIMENSIONS.map((dimension) => ({
  label: `size ${dimension}`,
  props: { dimension },
}));

// Add every visually distinct interactive and disabled state.
const STATES: VisualVariant[] = [{ label: 'default', props: {} }];

const renderMatrix = (items: VisualVariant[]) => (
  <VisualGroups>
    {items.map(({ label, props }) => (
      <VisualGroup key={label}>
        <VisualGroupTitle>{label}</VisualGroupTitle>
        <VisualSamples>
          <VisualSample>
            <VisualLabel>{label}</VisualLabel>
            <TagDot {...props}>Tag</TagDot>
          </VisualSample>
        </VisualSamples>
      </VisualGroup>
    ))}
  </VisualGroups>
);

export const TagVisualTemplate = () => (
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
