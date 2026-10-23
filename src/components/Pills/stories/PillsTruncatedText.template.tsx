import styled from 'styled-components';

import { Pill, Pills, type PillProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

const TruncatedPill = styled(Pill)`
  width: 180px;
`;

const DEFAULT_TEXT = 'Я три дня гналась за вами, чтобы сказать, как вы мне безразличны';

export const PillsTruncatedTextTemplate = ({ children = DEFAULT_TEXT, ...args }: PillProps) => {
  return (
    <StoryDemoContainer $direction="column" $gap="16px" $withBackground={false}>
      <StoryDemoDescription $textAlign="center">
        При ограниченной ширине текст сокращается многоточием. Полный текст появляется в Tooltip. Скринридер читает
        полный текст самой кнопки, а дублирующая подсказка скрыта от него.
      </StoryDemoDescription>
      <Pills aria-label="Pill с сокращённым текстом">
        <TruncatedPill {...args} data-testid="pills-truncated">
          {children}
        </TruncatedPill>
        <TruncatedPill {...args} data-testid="pills-truncated-second">
          Второй Pill с длинным текстом, который также сокращается многоточием
        </TruncatedPill>
      </Pills>
    </StoryDemoContainer>
  );
};
