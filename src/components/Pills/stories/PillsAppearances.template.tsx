import styled from 'styled-components';

import { Pill, type PillProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer } from '../../stories/StoryContainers';
import { PILLS_APPEARANCES } from '../constants';

const AppearanceList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 32px;
  row-gap: 16px;
`;

const AppearanceItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const appearanceNames: Record<(typeof PILLS_APPEARANCES)[number], string> = {
  neutral1: 'Neutral 1',
  neutral2: 'Neutral 2',
  info1: 'Info 1',
  info2: 'Info 2',
  success1: 'Success 1',
  success2: 'Success 2',
  error1: 'Error 1',
  error2: 'Error 2',
  warning1: 'Warning 1',
  warning2: 'Warning 2',
  attention1: 'Attention 1',
  attention2: 'Attention 2',
};

export const PillsAppearancesTemplate = (args: PillProps) => {
  return (
    <StoryDemoContainer $withBackground={false}>
      <AppearanceList>
        {PILLS_APPEARANCES.map((appearance) => (
          <AppearanceItem key={appearance}>
            <Pill {...args} appearance={appearance} />
            <span>{appearanceNames[appearance]}</span>
          </AppearanceItem>
        ))}
      </AppearanceList>
    </StoryDemoContainer>
  );
};
