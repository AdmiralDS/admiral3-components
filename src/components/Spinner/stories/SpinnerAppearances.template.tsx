import styled from 'styled-components';

import { Spinner, type SpinnerProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer } from '../../stories/StoryContainers';
import { SPINNER_APPEARANCES, SPINNER_DIMENSIONS } from '../constants';

const Appearances = styled.div`
  display: grid;
  gap: 16px;
`;

const AppearanceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

const SpinnerList = styled.div<{ $appearance?: SpinnerProps['appearance'] }>`
  display: flex;
  align-items: center;
  gap: 14px;
  ${(p) => p.$appearance == 'staticWhite' && `background: var(--admiral-color-primary-base-1-rest);`}
  ${(p) => p.$appearance == 'inverted' && `background: var(--admiral-color-neutral-base-inverted-rest);`}
`;

const appearanceLabels: Record<(typeof SPINNER_APPEARANCES)[number], string> = {
  colored: 'Colored',
  neutral: 'Neutral',
  inverted: 'Inverted',
  staticWhite: 'Static White',
};

export const SpinnerAppearancesTemplate = (args: SpinnerProps) => {
  return (
    <StoryDemoContainer>
      <Appearances>
        {SPINNER_APPEARANCES.map((appearance) => (
          <AppearanceRow key={appearance}>
            <SpinnerList $appearance={appearance}>
              {SPINNER_DIMENSIONS.map((dimension) => (
                <Spinner key={dimension} {...args} appearance={appearance} dimension={dimension} />
              ))}
            </SpinnerList>
            <span>{appearanceLabels[appearance]}</span>
          </AppearanceRow>
        ))}
      </Appearances>
    </StoryDemoContainer>
  );
};
