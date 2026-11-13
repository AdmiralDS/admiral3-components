import { SystemStarSolid } from '@admiral-ds/admiral3-icons';

import { TagDot, TagTinted } from '@admiral-ds/admiral3-components';

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
import { TAG_DIMENSIONS, TAG_STATUSES } from '../../../src/components/Tag/constants';

export const TagVisualTemplate = () => (
  <VisualLayout>
    <VisualSection>
      <VisualTitle>Sizes and appearances</VisualTitle>
      <VisualGroups>
        {TAG_DIMENSIONS.map((dimension) => (
          <VisualGroup key={dimension}>
            <VisualGroupTitle>size {dimension}</VisualGroupTitle>
            <VisualSamples>
              <VisualSample>
                <VisualLabel>TagDot</VisualLabel>
                <TagDot dimension={dimension}>Tag</TagDot>
              </VisualSample>
              <VisualSample>
                <VisualLabel>TagTinted</VisualLabel>
                <TagTinted dimension={dimension}>Tag</TagTinted>
              </VisualSample>
            </VisualSamples>
          </VisualGroup>
        ))}
      </VisualGroups>
    </VisualSection>

    <VisualSection>
      <VisualTitle>States</VisualTitle>
      <VisualGroups>
        <VisualGroup>
          <VisualGroupTitle>default</VisualGroupTitle>
          <VisualSamples>
            <VisualSample>
              <VisualLabel>TagDot</VisualLabel>
              <TagDot>Tag</TagDot>
            </VisualSample>
            <VisualSample>
              <VisualLabel>TagTinted</VisualLabel>
              <TagTinted>Tag</TagTinted>
            </VisualSample>
          </VisualSamples>
        </VisualGroup>
      </VisualGroups>
    </VisualSection>

    <VisualSection>
      <VisualTitle>Preset statuses with border</VisualTitle>
      <VisualSamples>
        {TAG_STATUSES.flatMap((status) => [
          <VisualSample key={`dot-${status}`}>
            <VisualLabel>TagDot {status}</VisualLabel>
            <TagDot status={status} withBorder>
              Tag
            </TagDot>
          </VisualSample>,
          <VisualSample key={`tinted-${status}`}>
            <VisualLabel>TagTinted {status}</VisualLabel>
            <TagTinted status={status} withBorder>
              Tag
            </TagTinted>
          </VisualSample>,
        ])}
      </VisualSamples>
    </VisualSection>

    <VisualSection>
      <VisualTitle>Custom status</VisualTitle>
      <VisualSamples>
        <VisualSample>
          <VisualLabel>TagDot custom</VisualLabel>
          <TagDot
            status={{
              backgroundColor: { rest: 'var(--admiral-color-magenta-base-3-rest)' },
              borderColor: 'var(--admiral-color-magenta-stroke-2-rest)',
              dotAppearance: { backgroundColor: 'var(--admiral-color-magenta-base-1-rest)' },
              textColor: 'var(--admiral-color-magenta-text-1-rest)',
            }}
            withBorder
          >
            Tag
          </TagDot>
        </VisualSample>
        <VisualSample>
          <VisualLabel>TagTinted custom</VisualLabel>
          <TagTinted
            status={{
              backgroundColor: { rest: 'var(--admiral-color-magenta-base-3-rest)' },
              borderColor: 'var(--admiral-color-magenta-stroke-2-rest)',
              textColor: 'var(--admiral-color-magenta-text-1-rest)',
            }}
            withBorder
          >
            Tag
          </TagTinted>
        </VisualSample>
      </VisualSamples>
    </VisualSection>

    <VisualSection>
      <VisualTitle>TagTinted with icon</VisualTitle>
      <VisualSamples>
        <VisualSample>
          <VisualLabel>Icon before</VisualLabel>
          <TagTinted iconsBefore={<SystemStarSolid aria-hidden="true" focusable="false" />}>Tag</TagTinted>
        </VisualSample>
      </VisualSamples>
    </VisualSection>
  </VisualLayout>
);
