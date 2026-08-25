import { Skeleton } from '@admiral-ds/admiral3-components';

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

const SKELETON_VARIANTS = [
  { label: 'Numeric rectangle', width: 200, height: 40, borderRadius: 0 },
  { label: 'Rounded rectangle', width: 200, height: 40, borderRadius: 8 },
  { label: 'Circle', width: 64, height: 64, borderRadius: '50%' },
  { label: 'Percentage width', width: '100%', height: 16, borderRadius: 4 },
  { label: 'Text line', width: 320, height: 16, borderRadius: 2 },
] as const;

export const SkeletonVisualTemplate = () => (
  <VisualLayout>
    <VisualSection>
      <VisualTitle>Geometry variants</VisualTitle>
      <VisualGroups>
        {SKELETON_VARIANTS.map(({ label, ...props }) => (
          <VisualGroup key={label}>
            <VisualGroupTitle>{label}</VisualGroupTitle>
            <VisualSamples>
              <VisualSample>
                <VisualLabel>
                  {String(props.width)} × {String(props.height)} / radius {String(props.borderRadius)}
                </VisualLabel>
                <Skeleton {...props} />
              </VisualSample>
            </VisualSamples>
          </VisualGroup>
        ))}
      </VisualGroups>
    </VisualSection>
  </VisualLayout>
);
