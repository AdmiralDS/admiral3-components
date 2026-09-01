import styled from 'styled-components';

import { Divider, type DividerAppearance } from '@admiral-ds/admiral3-components';

import {
  VisualGroup,
  VisualGroups,
  VisualGroupTitle,
  VisualLabel,
  VisualLayout,
  VisualPrimarySurface,
  VisualSample,
  VisualSamples,
  VisualSection,
  VisualTitle,
} from './VisualLayout';
import { DIVIDER_APPEARANCES, DIVIDER_DIMENSIONS } from '../../../src/components/Divider/constants';

const HorizontalSample = styled(VisualSample)`
  width: 240px;
`;

const VerticalSample = styled(VisualSample)`
  height: 144px;
`;

const renderPresetSamples = (appearance: DividerAppearance) => {
  const samples = (
    <VisualSamples>
      {DIVIDER_DIMENSIONS.map((dimension) => (
        <HorizontalSample key={`horizontal-${dimension}`}>
          <VisualLabel>horizontal / {dimension}</VisualLabel>
          <Divider appearance={appearance} dimension={dimension} length={200} />
        </HorizontalSample>
      ))}
      {DIVIDER_DIMENSIONS.map((dimension) => (
        <VerticalSample key={`vertical-${dimension}`}>
          <VisualLabel>vertical / {dimension}</VisualLabel>
          <Divider appearance={appearance} dimension={dimension} length={96} orientation="vertical" />
        </VerticalSample>
      ))}
    </VisualSamples>
  );

  return appearance === 'staticWhite' ? <VisualPrimarySurface>{samples}</VisualPrimarySurface> : samples;
};

export const DividerVisualTemplate = () => (
  <VisualLayout>
    <VisualSection>
      <VisualTitle>Preset appearances, dimensions and orientations</VisualTitle>
      <VisualGroups>
        {DIVIDER_APPEARANCES.map((appearance) => (
          <VisualGroup key={appearance}>
            <VisualGroupTitle>{appearance}</VisualGroupTitle>
            {renderPresetSamples(appearance)}
          </VisualGroup>
        ))}
      </VisualGroups>
    </VisualSection>

    <VisualSection>
      <VisualTitle>Custom appearance</VisualTitle>
      <VisualGroup>
        <VisualGroupTitle>custom</VisualGroupTitle>
        <VisualSamples>
          <HorizontalSample>
            <VisualLabel>horizontal / m</VisualLabel>
            <Divider appearance={{ backgroundColor: '#7c3aed' }} length={200} />
          </HorizontalSample>
          <VerticalSample>
            <VisualLabel>vertical / s</VisualLabel>
            <Divider appearance={{ backgroundColor: '#7c3aed' }} dimension="s" length={96} orientation="vertical" />
          </VerticalSample>
        </VisualSamples>
      </VisualGroup>
    </VisualSection>

    <VisualSection>
      <VisualTitle>Lengths</VisualTitle>
      <VisualGroups>
        <VisualGroup>
          <VisualGroupTitle>horizontal</VisualGroupTitle>
          <VisualSamples>
            <HorizontalSample>
              <VisualLabel>80px</VisualLabel>
              <Divider length={80} />
            </HorizontalSample>
            <HorizontalSample>
              <VisualLabel>50%</VisualLabel>
              <Divider length="50%" />
            </HorizontalSample>
            <HorizontalSample>
              <VisualLabel>240px</VisualLabel>
              <Divider length={240} />
            </HorizontalSample>
          </VisualSamples>
        </VisualGroup>
        <VisualGroup>
          <VisualGroupTitle>vertical</VisualGroupTitle>
          <VisualSamples>
            {[40, 80, 120].map((length) => (
              <VerticalSample key={length}>
                <VisualLabel>{length}px</VisualLabel>
                <Divider length={length} orientation="vertical" />
              </VerticalSample>
            ))}
          </VisualSamples>
        </VisualGroup>
      </VisualGroups>
    </VisualSection>
  </VisualLayout>
);
