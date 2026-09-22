import { CategoryVIPOutline } from '@admiral-ds/admiral3-icons';
import { textStyles } from '@admiral-ds/admiral3-tokens';
import styled from 'styled-components';

import { Button, Tooltip, type TooltipDimension, type TooltipProps, useTooltip } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

const CustomContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const Name = styled.span<{ $dimension: TooltipDimension }>`
  ${({ $dimension }) => ($dimension === 'm' ? textStyles.subtitle.subtitle3 : textStyles.caption.caption1)}
  font-weight: 600;
`;

const Position = styled.span<{ $dimension: TooltipDimension }>`
  ${({ $dimension }) => ($dimension === 'm' ? textStyles.body.body2Short : textStyles.caption.caption1)}
`;

export const TooltipCustomTemplate = (props: TooltipProps) => {
  const dimension = props.dimension ?? 'm';
  const { targetProps, tooltipProps, isVisible } = useTooltip<HTMLButtonElement>();

  return (
    <StoryDemoContainer $direction="column" $gap="20px">
      <StoryDemoDescription>
        <code>children</code> принимает ReactNode, поэтому внутри Tooltip можно использовать собственную разметку и
        типографику.
      </StoryDemoDescription>
      <Button {...targetProps} dimension="m" square aria-label="Профиль">
        <CategoryVIPOutline aria-hidden />
      </Button>
      {isVisible && (
        <Tooltip {...props} {...tooltipProps}>
          <CustomContent>
            <Name $dimension={dimension}>Фамилия Имя Отчество</Name>
            <Position $dimension={dimension}>Старший дизайнер</Position>
          </CustomContent>
        </Tooltip>
      )}
    </StoryDemoContainer>
  );
};
