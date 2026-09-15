import styled from 'styled-components';

import { ProgressPage } from '@admiral-ds/admiral3-components';

import { VisualLabel, VisualLayout, VisualSample, VisualSamples, VisualSection, VisualTitle } from './VisualLayout';

const ProgressSample = styled(VisualSample)`
  width: 320px;
`;

export const ProgressPageVisualTemplate = () => (
  <VisualLayout>
    <VisualSection>
      <VisualTitle>States</VisualTitle>
      <VisualSamples>
        <ProgressSample>
          <VisualLabel>Determinate, 0%</VisualLabel>
          <ProgressPage value={0} label="Начало загрузки" valueLabel="0%" />
        </ProgressSample>
        <ProgressSample>
          <VisualLabel>Determinate, 35%</VisualLabel>
          <ProgressPage value={35} label="Загрузка данных" valueLabel="35%" />
        </ProgressSample>
        <ProgressSample>
          <VisualLabel>Determinate, 100%</VisualLabel>
          <ProgressPage value={100} label="Загрузка завершена" valueLabel="100%" />
        </ProgressSample>
        <ProgressSample>
          <VisualLabel>Indeterminate</VisualLabel>
          <ProgressPage label="Загрузка данных" />
        </ProgressSample>
        <ProgressSample>
          <VisualLabel>Error</VisualLabel>
          <ProgressPage value={62} error label="Ошибка загрузки" valueLabel="62%" />
        </ProgressSample>
      </VisualSamples>
    </VisualSection>
    <VisualSection>
      <VisualTitle>Labels</VisualTitle>
      <VisualSamples>
        <ProgressSample>
          <VisualLabel>Without labels</VisualLabel>
          <ProgressPage value={35} aria-label="Загрузка данных" />
        </ProgressSample>
        <ProgressSample>
          <VisualLabel>Label only</VisualLabel>
          <ProgressPage value={35} label="Загрузка данных" />
        </ProgressSample>
        <ProgressSample>
          <VisualLabel>Value label only</VisualLabel>
          <ProgressPage value={35} valueLabel="35 из 100" aria-label="Загрузка данных" />
        </ProgressSample>
        <ProgressSample>
          <VisualLabel>Wrapping label</VisualLabel>
          <ProgressPage
            value={35}
            label="Загрузка большого количества данных, название которых переносится"
            valueLabel="35 из 100"
          />
        </ProgressSample>
      </VisualSamples>
    </VisualSection>
    <VisualSection>
      <VisualTitle>Custom appearance</VisualTitle>
      <VisualSamples>
        <ProgressSample>
          <ProgressPage
            value={62}
            error
            label="Пользовательский цвет ошибки"
            valueLabel="62%"
            appearance={{
              backgroundColor: '#d8dce3',
              progressColor: '#008c8c',
              progressColorError: '#c2185b',
            }}
          />
        </ProgressSample>
      </VisualSamples>
    </VisualSection>
  </VisualLayout>
);
