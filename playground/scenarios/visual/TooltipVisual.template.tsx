import type { ComponentProps } from 'react';

import { Tooltip } from '@admiral-ds/admiral3-components';

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
import { TOOLTIP_DIMENSIONS } from '../../../src/components/Tooltip/constants';

type VisualVariant = {
  label: string;
  props: ComponentProps<typeof Tooltip>;
};

// Add every supported appearance alongside the generated dimension matrix.
const VARIANTS: VisualVariant[] = TOOLTIP_DIMENSIONS.map((dimension) => ({
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
            <Tooltip {...props}>Tooltip</Tooltip>
          </VisualSample>
        </VisualSamples>
      </VisualGroup>
    ))}
  </VisualGroups>
);

export const TooltipVisualTemplate = () => (
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
