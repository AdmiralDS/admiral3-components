import type { ComponentProps } from 'react';

import { Chips } from '@admiral-ds/admiral3-components';

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
import { CHIPS_APPEARANCES, CHIPS_COLOR_MODES, CHIPS_DIMENSIONS } from '../../../src/components/Chips/constants';

type VisualVariant = {
  label: string;
  props: ComponentProps<typeof Chips>;
};

const VARIANTS: VisualVariant[] = CHIPS_DIMENSIONS.flatMap((dimension) =>
  CHIPS_APPEARANCES.flatMap((appearance) =>
    CHIPS_COLOR_MODES.map((colorMode) => ({
      label: `${dimension} / ${appearance} / ${colorMode}`,
      props: { dimension, appearance, colorMode },
    })),
  ),
);

const STATES: VisualVariant[] = CHIPS_APPEARANCES.flatMap((appearance) =>
  CHIPS_COLOR_MODES.flatMap((colorMode) =>
    [
      { label: 'selected', props: { selected: true } },
      { label: 'disabled', props: { disabled: true } },
      { label: 'selected disabled', props: { selected: true, disabled: true } },
      { label: 'badge', props: { badge: 5 } },
      { label: 'close', props: { onClose: () => undefined } },
      { label: 'readOnly', props: { readOnly: true, onClose: () => undefined } },
    ].map(({ label, props }) => ({
      label: `${appearance} / ${colorMode} / ${label}`,
      props: { appearance, colorMode, ...props },
    })),
  ),
);

const renderMatrix = (items: VisualVariant[]) => (
  <VisualGroups>
    {items.map(({ label, props }) => (
      <VisualGroup key={label}>
        <VisualGroupTitle>{label}</VisualGroupTitle>
        <VisualSamples>
          <VisualSample>
            <VisualLabel>{label}</VisualLabel>
            <Chips {...props}>Chips</Chips>
          </VisualSample>
        </VisualSamples>
      </VisualGroup>
    ))}
  </VisualGroups>
);

export const ChipsVisualTemplate = () => (
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
