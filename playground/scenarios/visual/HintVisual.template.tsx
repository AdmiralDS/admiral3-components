import { Button, Hint, type HintProps, useHint } from '@admiral-ds/admiral3-components';

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
import { HINT_DIMENSIONS } from '../../../src/components/Hint/constants';

type VisualVariant = {
  label: string;
  props: Omit<HintProps, 'targetElement'>;
};

// Add every supported appearance alongside the generated dimension matrix.
const VARIANTS: VisualVariant[] = HINT_DIMENSIONS.map((dimension) => ({
  label: `size ${dimension}`,
  props: { dimension },
}));

// Add every visually distinct interactive and disabled state.
const STATES: VisualVariant[] = [{ label: 'default', props: {} }];

const HintSample = ({ props }: { props: Omit<HintProps, 'targetElement'> }) => {
  const { isVisible, triggerProps, hintProps } = useHint<HTMLButtonElement>();
  return (
    <>
      <Button {...triggerProps}>Target</Button>
      {isVisible && (
        <Hint {...props} {...hintProps}>
          Hint
        </Hint>
      )}
    </>
  );
};

const renderMatrix = (items: VisualVariant[]) => (
  <VisualGroups>
    {items.map(({ label, props }) => (
      <VisualGroup key={label}>
        <VisualGroupTitle>{label}</VisualGroupTitle>
        <VisualSamples>
          <VisualSample>
            <VisualLabel>{label}</VisualLabel>
            <HintSample props={props} />
          </VisualSample>
        </VisualSamples>
      </VisualGroup>
    ))}
  </VisualGroups>
);

export const HintVisualTemplate = () => (
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
