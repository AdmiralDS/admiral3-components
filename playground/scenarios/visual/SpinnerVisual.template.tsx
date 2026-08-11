import { Spinner } from '@admiral-ds/admiral3-primitives';

import {
  VisualGroup,
  VisualGroups,
  VisualGroupTitle,
  VisualInvertedSurface,
  VisualLabel,
  VisualLayout,
  VisualSample,
  VisualSamples,
  VisualSection,
  VisualPrimarySurface,
  VisualTitle,
} from './VisualLayout';
import { SPINNER_APPEARANCES, SPINNER_DIMENSIONS } from '../../../src/components/Spinner/constants';

export const SpinnerVisualTemplate = () => (
  <VisualLayout>
    <VisualSection>
      <VisualTitle>Preset appearances</VisualTitle>
      <VisualGroups>
        {SPINNER_APPEARANCES.map((appearance) => {
          const samples = (
            <VisualSamples>
              {SPINNER_DIMENSIONS.map((dimension) => (
                <VisualSample key={dimension}>
                  <VisualLabel>{dimension}</VisualLabel>
                  <Spinner appearance={appearance} dimension={dimension} />
                </VisualSample>
              ))}
            </VisualSamples>
          );

          return (
            <VisualGroup key={appearance}>
              <VisualGroupTitle>{appearance}</VisualGroupTitle>
              {appearance === 'inverted' ? (
                <VisualInvertedSurface>{samples}</VisualInvertedSurface>
              ) : appearance === 'staticWhite' ? (
                <VisualPrimarySurface>{samples}</VisualPrimarySurface>
              ) : (
                samples
              )}
            </VisualGroup>
          );
        })}
      </VisualGroups>
    </VisualSection>
    <VisualSection>
      <VisualTitle>Custom appearance</VisualTitle>
      <VisualSamples>
        <Spinner appearance={{ color: '#7c3aed' }} dimension="xl" />
      </VisualSamples>
    </VisualSection>
  </VisualLayout>
);
