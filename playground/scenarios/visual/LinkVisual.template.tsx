import { ServiceShareOutline } from '@admiral-ds/admiral3-icons';

import { Link } from '@admiral-ds/admiral3-primitives';

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
import { LINK_APPEARANCES, LINK_DIMENSIONS } from '../../../src/components/Link/constants';

const renderLinkSizes = (content: 'text' | 'leading-icon' | 'trailing-icon', disabled = false) => (
  <VisualSamples>
    {LINK_DIMENSIONS.map((dimension) => (
      <VisualSample key={dimension}>
        <VisualLabel>{dimension}</VisualLabel>
        <Link dimension={dimension} disabled={disabled} href="#">
          {content === 'leading-icon' ? <ServiceShareOutline /> : null}
          Link
          {content === 'trailing-icon' ? <ServiceShareOutline /> : null}
        </Link>
      </VisualSample>
    ))}
  </VisualSamples>
);

export const LinkVisualTemplate = () => (
  <VisualLayout>
    <VisualSection>
      <VisualTitle>Appearances and states</VisualTitle>
      <VisualGroups>
        {LINK_APPEARANCES.flatMap((appearance) =>
          [false, true].map((disabled) => (
            <VisualGroup key={`${appearance}-${disabled}`}>
              <VisualGroupTitle>
                {appearance} / {disabled ? 'disabled' : 'default'}
              </VisualGroupTitle>
              <VisualSamples>
                {LINK_DIMENSIONS.map((dimension) => (
                  <VisualSample key={dimension}>
                    <VisualLabel>{dimension}</VisualLabel>
                    <Link appearance={appearance} dimension={dimension} disabled={disabled} href="#">
                      Link
                    </Link>
                  </VisualSample>
                ))}
              </VisualSamples>
            </VisualGroup>
          )),
        )}
      </VisualGroups>
    </VisualSection>
    <VisualSection>
      <VisualTitle>Icon placement</VisualTitle>
      <VisualGroups>
        <VisualGroup>
          <VisualGroupTitle>Leading icon</VisualGroupTitle>
          {renderLinkSizes('leading-icon')}
        </VisualGroup>
        <VisualGroup>
          <VisualGroupTitle>Trailing icon</VisualGroupTitle>
          {renderLinkSizes('trailing-icon')}
        </VisualGroup>
      </VisualGroups>
    </VisualSection>
  </VisualLayout>
);
