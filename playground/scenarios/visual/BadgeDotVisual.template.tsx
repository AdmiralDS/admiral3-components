import { BadgeDot } from '@admiral-ds/admiral3-components';

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
import { BADGE_DOT_APPEARANCES, BADGE_DOT_DIMENSIONS } from '../../../src/components/BadgeDot/constants';

export const BadgeDotVisualTemplate = () => (
  <VisualLayout>
    <VisualSection>
      <VisualTitle>Preset appearances</VisualTitle>
      <VisualGroups>
        {BADGE_DOT_APPEARANCES.map((appearance) => (
          <VisualGroup key={appearance}>
            <VisualGroupTitle>{appearance}</VisualGroupTitle>
            <VisualSamples>
              {BADGE_DOT_DIMENSIONS.map((dimension) => (
                <VisualSample key={dimension}>
                  <VisualLabel>{dimension}</VisualLabel>
                  <BadgeDot appearance={appearance} dimension={dimension} />
                </VisualSample>
              ))}
            </VisualSamples>
          </VisualGroup>
        ))}
      </VisualGroups>
    </VisualSection>
    <VisualSection>
      <VisualTitle>Custom appearance</VisualTitle>
      <VisualSamples>
        <BadgeDot appearance={{ backgroundColor: '#7c3aed' }} dimension="xxl" />
      </VisualSamples>
    </VisualSection>
  </VisualLayout>
);
