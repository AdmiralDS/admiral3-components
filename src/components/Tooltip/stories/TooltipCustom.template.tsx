import { CategoryVIPOutline } from '@admiral-ds/admiral3-icons';
import { textStyles } from '@admiral-ds/admiral3-tokens';
import styled from 'styled-components';

import { Button, Tooltip, type TooltipDimension, type TooltipProps, useTooltip } from '@admiral-ds/admiral3-components';

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
  const { targetElement, targetRef, tooltipRef, isVisible } = useTooltip<HTMLButtonElement>();

  return (
    <>
      <Button ref={targetRef} dimension="m" square aria-label="Профиль" aria-describedby="tooltip-custom">
        <CategoryVIPOutline aria-hidden />
      </Button>
      {isVisible && (
        <Tooltip
          {...props}
          ref={tooltipRef}
          targetElement={targetElement}
          renderContent={() => (
            <CustomContent>
              <Name $dimension={dimension}>Фамилия Имя Отчество</Name>
              <Position $dimension={dimension}>Старший дизайнер</Position>
            </CustomContent>
          )}
          id="tooltip-custom"
        />
      )}
    </>
  );
};
