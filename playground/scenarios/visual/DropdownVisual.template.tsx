import { useState } from 'react';

import styled from 'styled-components';

import { Dropdown, type DropdownProps } from '@admiral-ds/admiral3-components';

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
  props: Omit<DropdownProps, 'children' | 'targetElement'>;
  contentWidth: number;
  targetWidth: number;
};

const WIDTH_MODES: VisualVariant[] = [
  {
    label: 'content width',
    props: { widthMode: 'content' },
    contentWidth: 280,
    targetWidth: 160,
  },
  {
    label: 'target width',
    props: { widthMode: 'target' },
    contentWidth: 280,
    targetWidth: 160,
  },
];

const ALIGNMENTS: VisualVariant[] = [
  { label: 'start', props: { align: 'start' }, contentWidth: 120, targetWidth: 200 },
  { label: 'center', props: { align: 'center' }, contentWidth: 120, targetWidth: 200 },
  { label: 'end', props: { align: 'end' }, contentWidth: 120, targetWidth: 200 },
];

const SampleCanvas = styled.div`
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 480px;
  height: 150px;
  padding-top: 16px;
`;

const Target = styled.button<{ $width: number }>`
  box-sizing: border-box;
  width: ${({ $width }) => $width}px;
  min-height: 40px;
`;

const Content = styled.div<{ $fitTarget: boolean; $width: number }>`
  box-sizing: border-box;
  width: ${({ $fitTarget, $width }) => ($fitTarget ? '100%' : `${$width}px`)};
  min-height: 64px;
  padding: 12px;
  overflow-wrap: anywhere;
`;

const DropdownSample = ({ props, contentWidth, targetWidth }: Omit<VisualVariant, 'label'>) => {
  const [targetElement, setTargetElement] = useState<HTMLButtonElement | null>(null);

  return (
    <SampleCanvas>
      <Target ref={setTargetElement} $width={targetWidth}>
        Target
      </Target>
      {targetElement && (
        <Dropdown {...props} targetElement={targetElement}>
          <Content $fitTarget={props.widthMode === 'target'} $width={contentWidth}>
            Dropdown content
          </Content>
        </Dropdown>
      )}
    </SampleCanvas>
  );
};

const renderMatrix = (items: VisualVariant[]) => (
  <VisualGroups>
    {items.map(({ label, ...variant }) => (
      <VisualGroup key={label}>
        <VisualGroupTitle>{label}</VisualGroupTitle>
        <VisualSamples>
          <VisualSample>
            <VisualLabel>{label}</VisualLabel>
            <DropdownSample {...variant} />
          </VisualSample>
        </VisualSamples>
      </VisualGroup>
    ))}
  </VisualGroups>
);

export const DropdownVisualTemplate = () => (
  <VisualLayout>
    <VisualSection>
      <VisualTitle>Width modes</VisualTitle>
      {renderMatrix(WIDTH_MODES)}
    </VisualSection>
    <VisualSection>
      <VisualTitle>Alignments</VisualTitle>
      {renderMatrix(ALIGNMENTS)}
    </VisualSection>
  </VisualLayout>
);
