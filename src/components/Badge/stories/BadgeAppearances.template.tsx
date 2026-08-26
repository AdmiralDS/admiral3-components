import styled from 'styled-components';

import { Badge, type BadgeProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer } from '../../stories/StoryContainers';
import { BADGE_APPEARANCES, BADGE_DIMENSIONS } from '../constants';

const Appearances = styled.div`
  display: grid;
  gap: 16px;
`;

const AppearanceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

const BadgeList = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const appearanceLabels: Record<(typeof BADGE_APPEARANCES)[number], string> = {
  neutral1: 'Neutral 1',
  neutral1Inactive: 'Neutral 1 Inactive',
  neutral1Disable: 'Neutral 1 Disable',
  neutral2: 'Neutral 2',
  neutral2Inactive: 'Neutral 2 Inactive',
  neutral2Disable: 'Neutral 2 Disable',
  neutral3: 'Neutral 3',
  info: 'Info',
  warning: 'Warning',
  success: 'Success',
  error: 'Error',
  whiteStatic: 'White Static',
};

export const BadgeAppearancesTemplate = (args: BadgeProps) => {
  return (
    <StoryDemoContainer>
      <Appearances>
        {BADGE_APPEARANCES.map((appearance) => (
          <AppearanceRow key={appearance}>
            <BadgeList>
              {BADGE_DIMENSIONS.map((dimension) => (
                <Badge key={dimension} {...args} appearance={appearance} dimension={dimension}>
                  {args.children}
                </Badge>
              ))}
            </BadgeList>
            <span>{appearanceLabels[appearance]}</span>
          </AppearanceRow>
        ))}
      </Appearances>
    </StoryDemoContainer>
  );
};
