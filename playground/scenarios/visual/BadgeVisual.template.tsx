import { Badge } from '@admiral-ds/admiral3-primitives';

import {
  VisualContrastSurface,
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
import { BADGE_APPEARANCES, BADGE_DIMENSIONS } from '../../../src/components/Badge/constants';

export const BadgeVisualTemplate = () => (
  <VisualLayout>
    <VisualSection>
      <VisualTitle>Preset appearances</VisualTitle>
      <VisualGroups>
        {BADGE_APPEARANCES.map((appearance) => (
          <VisualGroup key={appearance}>
            <VisualGroupTitle>{appearance}</VisualGroupTitle>
            <VisualContrastSurface>
              <VisualSamples>
                {BADGE_DIMENSIONS.map((dimension) => (
                  <VisualSample key={dimension}>
                    <VisualLabel>{dimension}</VisualLabel>
                    <Badge appearance={appearance} dimension={dimension}>
                      159
                    </Badge>
                  </VisualSample>
                ))}
              </VisualSamples>
            </VisualContrastSurface>
          </VisualGroup>
        ))}
      </VisualGroups>
    </VisualSection>
    <VisualSection>
      <VisualTitle>Custom appearance</VisualTitle>
      <VisualSamples>
        <Badge appearance={{ backgroundColor: '#7c3aed', textColor: '#ffffff' }}>159</Badge>
      </VisualSamples>
    </VisualSection>
  </VisualLayout>
);
