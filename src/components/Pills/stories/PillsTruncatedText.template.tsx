import styled from 'styled-components';

import { Pill, type PillProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

const TruncatedPill = styled(Pill)`
  width: 180px;
`;

const DEFAULT_TEXT = 'Я три дня гналась за вами, чтобы сказать, как вы мне безразличны';

export const PillsTruncatedTextTemplate = ({ children = DEFAULT_TEXT, ...args }: PillProps) => {
  const title = typeof children === 'string' ? children : DEFAULT_TEXT;

  return (
    <StoryDemoContainer $direction="column" $gap="16px" $withBackground={false}>
      <StoryDemoDescription $textAlign="center">
        При ограниченной ширине текст сокращается многоточием, но полностью остаётся в DOM. Tooltip будет подключён
        после появления соответствующего компонента.
      </StoryDemoDescription>
      {/* TODO: Заменить title на Tooltip после появления компонента. */}
      <TruncatedPill {...args} title={title} data-testid="pills-truncated">
        {children}
      </TruncatedPill>
    </StoryDemoContainer>
  );
};
