import { SystemPersonOutline } from '@admiral-ds/admiral3-icons';

import { Avatar, type AvatarProps } from '@admiral-ds/admiral3-components';

import {
  StoryDemoContainer,
  StoryDemoDescription,
  StoryDemoSample,
  StoryDemoSamples,
} from '../../stories/StoryContainers';
import { AVATAR_DIMENSIONS, AVATAR_DIMENSION_PARAMETERS } from '../constants';

const ICON_DIMENSIONS = AVATAR_DIMENSIONS.filter((dimension) => AVATAR_DIMENSION_PARAMETERS[dimension].iconSize > 0);

export const AvatarWithIconTemplate = (args: AvatarProps) => (
  <StoryDemoContainer $direction="column" $gap="24px">
    <StoryDemoDescription $textAlign="center">
      Вместо инициалов можно передать иконку. Она отображается начиная с размера XS.
    </StoryDemoDescription>
    <StoryDemoSamples>
      {ICON_DIMENSIONS.map((dimension) => (
        <StoryDemoSample key={dimension}>
          <Avatar
            {...args}
            dimension={dimension}
            href={undefined}
            icon={<SystemPersonOutline width="100%" height="100%" aria-hidden="true" focusable="false" />}
          />
          <StoryDemoDescription>{dimension.toUpperCase()}</StoryDemoDescription>
        </StoryDemoSample>
      ))}
    </StoryDemoSamples>
  </StoryDemoContainer>
);
