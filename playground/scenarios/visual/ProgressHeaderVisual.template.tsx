import { ProgressHeader } from '@admiral-ds/admiral3-components';

import { VisualLayout, VisualSample, VisualSamples, VisualSection, VisualTitle } from './VisualLayout';

export const ProgressHeaderVisualTemplate = () => (
  <VisualLayout>
    <VisualSection>
      <VisualTitle>Determinate, 35%</VisualTitle>
      <VisualSamples>
        <VisualSample>
          <ProgressHeader value={35} aria-label="Загрузка страницы" />
        </VisualSample>
      </VisualSamples>
    </VisualSection>
  </VisualLayout>
);
