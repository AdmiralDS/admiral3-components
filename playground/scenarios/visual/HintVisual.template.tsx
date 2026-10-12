import type { ReactNode } from 'react';
import { useState } from 'react';

import styled from 'styled-components';

import { Button, Hint, HintLabel, type HintProps } from '@admiral-ds/admiral3-components';

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

type VisualVariant = {
  label: string;
  props?: Omit<HintProps, 'children' | 'targetElement'>;
  content?: ReactNode;
};

const HintBody = styled.div`
  display: flex;
  width: 288px;
  flex-direction: column;
  gap: 4px;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

const SampleCanvas = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 640px;
  height: 320px;
`;

const APPEARANCE: VisualVariant[] = [
  { label: 'default' },
  { label: 'with close button', props: { showCloseIcon: true } },
];

const POSITIONS: VisualVariant[] = [
  { label: 'bottom', props: { hintPosition: 'bottom' } },
  { label: 'top', props: { hintPosition: 'top' } },
  { label: 'left', props: { hintPosition: 'left' } },
  { label: 'right', props: { hintPosition: 'right' } },
];

const CONTENT: VisualVariant[] = [
  { label: 'short text', content: 'Hint' },
  {
    label: 'multiline text',
    props: { hintStyles: { style: { width: 288 } } },
    content: 'A hint can contain a longer explanation that wraps across multiple lines.',
  },
  {
    label: 'structured content',
    props: { showCloseIcon: true },
    content: (
      <HintBody>
        <HintLabel>Additional information</HintLabel>
        <div>A hint can contain text and actions related to the current context.</div>
        <Actions>
          <Button dimension="xs">Continue</Button>
          <Button dimension="xs" appearance="flat">
            Cancel
          </Button>
        </Actions>
      </HintBody>
    ),
  },
];

const HintSample = ({ props = {}, content = 'Hint' }: Omit<VisualVariant, 'label'>) => {
  const [targetElement, setTargetElement] = useState<HTMLButtonElement | null>(null);

  return (
    <SampleCanvas>
      <button ref={setTargetElement}>Anchor</button>
      {targetElement && (
        <Hint {...props} targetElement={targetElement}>
          {content}
        </Hint>
      )}
    </SampleCanvas>
  );
};

const renderMatrix = (items: VisualVariant[]) => (
  <VisualGroups>
    {items.map(({ label, props, content }) => (
      <VisualGroup key={label}>
        <VisualGroupTitle>{label}</VisualGroupTitle>
        <VisualSamples>
          <VisualSample>
            <VisualLabel>{label}</VisualLabel>
            <HintSample props={props} content={content} />
          </VisualSample>
        </VisualSamples>
      </VisualGroup>
    ))}
  </VisualGroups>
);

export const HintVisualTemplate = () => (
  <VisualLayout>
    <VisualSection>
      <VisualTitle>Appearance</VisualTitle>
      {renderMatrix(APPEARANCE)}
    </VisualSection>
    <VisualSection>
      <VisualTitle>Preferred positions</VisualTitle>
      {renderMatrix(POSITIONS)}
    </VisualSection>
    <VisualSection>
      <VisualTitle>Content</VisualTitle>
      {renderMatrix(CONTENT)}
    </VisualSection>
  </VisualLayout>
);
