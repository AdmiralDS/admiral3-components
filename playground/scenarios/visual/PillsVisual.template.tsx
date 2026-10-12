import { SystemStarSolid } from '@admiral-ds/admiral3-icons';
import styled from 'styled-components';

import { Pill, Pills } from '@admiral-ds/admiral3-components';

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
import { PILLS_APPEARANCES } from '../../../src/components/Pills/constants';

const TruncatedPill = styled(Pill)`
  width: 180px;
`;

export const PillsVisualTemplate = () => (
  <VisualLayout>
    <VisualSection>
      <VisualTitle>Preset appearances</VisualTitle>
      <VisualGroups>
        {PILLS_APPEARANCES.map((appearance) => (
          <VisualGroup key={appearance}>
            <VisualGroupTitle>{appearance}</VisualGroupTitle>
            <VisualSamples>
              <VisualSample>
                <VisualLabel>text</VisualLabel>
                <Pill appearance={appearance}>Pills</Pill>
              </VisualSample>
              <VisualSample>
                <VisualLabel>icon and text</VisualLabel>
                <Pill appearance={appearance}>
                  <SystemStarSolid aria-hidden="true" focusable="false" />
                  Pills
                </Pill>
              </VisualSample>
            </VisualSamples>
          </VisualGroup>
        ))}
      </VisualGroups>
    </VisualSection>
    <VisualSection>
      <VisualTitle>Composition and overflow</VisualTitle>
      <VisualSamples>
        <VisualSample>
          <VisualLabel>connected</VisualLabel>
          <Pills connected aria-label="Connected Pills">
            <Pill appearance="info1">First</Pill>
            <Pill appearance="error1">Middle</Pill>
            <Pill appearance="attention1">Middle</Pill>
            <Pill appearance="success1">Last</Pill>
          </Pills>
        </VisualSample>
        <VisualSample>
          <VisualLabel>truncated</VisualLabel>
          <TruncatedPill appearance="success1">
            Я три дня гналась за вами, чтобы сказать, как вы мне безразличны
          </TruncatedPill>
        </VisualSample>
      </VisualSamples>
    </VisualSection>
    <VisualSection>
      <VisualTitle>Custom appearance</VisualTitle>
      <VisualSamples>
        <Pill
          appearance={{
            backgroundColor: 'var(--admiral-color-purple-base-1-rest)',
            textColor: 'var(--admiral-color-neutral-text-static-white-1)',
          }}
        >
          Custom
        </Pill>
      </VisualSamples>
    </VisualSection>
  </VisualLayout>
);
