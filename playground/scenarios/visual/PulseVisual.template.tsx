import { Pulse } from '@admiral-ds/admiral3-primitives';

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
import { PULSE_DIMENSIONS, PULSE_STATUSES } from '../../../src/components/Pulse/constants';

export const PulseVisualTemplate = () => (
  <VisualLayout>
    <VisualSection>
      <VisualTitle>Preset statuses</VisualTitle>
      <VisualGroups>
        {PULSE_STATUSES.map((status) => (
          <VisualGroup key={status}>
            <VisualGroupTitle>{status}</VisualGroupTitle>
            <VisualSamples>
              {PULSE_DIMENSIONS.map((dimension) => (
                <VisualSample key={dimension}>
                  <VisualLabel>{dimension}</VisualLabel>
                  <Pulse dimension={dimension} status={status} />
                </VisualSample>
              ))}
            </VisualSamples>
          </VisualGroup>
        ))}
      </VisualGroups>
    </VisualSection>
    <VisualSection>
      <VisualTitle>Custom status</VisualTitle>
      <VisualSamples>
        <Pulse dimension="l" status={{ backgroundColor: '#7c3aed' }} />
      </VisualSamples>
    </VisualSection>
  </VisualLayout>
);
