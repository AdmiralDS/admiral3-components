import type { ComponentProps } from 'react';
import { useState } from 'react';

import styled from 'styled-components';

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
  props: Partial<ComponentProps<typeof Tooltip>>;
  content?: string;
};

const VARIANTS: VisualVariant[] = TOOLTIP_DIMENSIONS.map((dimension) => ({
  label: `size ${dimension}`,
  props: { dimension },
}));

const POSITIONS: VisualVariant[] = [
  { label: 'bottom', props: { tooltipPosition: 'bottom' } },
  { label: 'top', props: { tooltipPosition: 'top' } },
  { label: 'left', props: { tooltipPosition: 'left' } },
  { label: 'right', props: { tooltipPosition: 'right' } },
];

const CONTENT: VisualVariant[] = [
  { label: 'short content', props: {}, content: 'Tooltip' },
  {
    label: 'multiline content',
    props: { style: { width: '240px' } },
    content: 'A tooltip can contain a longer explanation that wraps across multiple lines.',
  },
];

const SampleCanvas = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 360px;
  height: 140px;
`;

const TooltipSample = ({ props, content = 'Tooltip' }: Pick<VisualVariant, 'props' | 'content'>) => {
  const [targetElement, setTargetElement] = useState<HTMLButtonElement | null>(null);

  return (
    <SampleCanvas>
      <button ref={setTargetElement}>Anchor</button>
      {targetElement && (
        <Tooltip {...props} targetElement={targetElement}>
          {content}
        </Tooltip>
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
            <TooltipSample props={props} content={content} />
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
      <VisualTitle>Preferred positions</VisualTitle>
      {renderMatrix(POSITIONS)}
    </VisualSection>
    <VisualSection>
      <VisualTitle>Content</VisualTitle>
      {renderMatrix(CONTENT)}
    </VisualSection>
  </VisualLayout>
);
