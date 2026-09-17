import { Tooltip, type TooltipProps, useTooltip } from '@admiral-ds/admiral3-components';

export const TooltipPlaygroundTemplate = (props: TooltipProps) => {
  const { targetElement, targetRef, tooltipRef, isVisible } = useTooltip<HTMLButtonElement>();

  return (
    <>
      <button ref={targetRef} aria-describedby="test1">
        Test
      </button>
      {isVisible && (
        <Tooltip
          ref={tooltipRef}
          dimension={props.dimension}
          targetElement={targetElement}
          renderContent={props.renderContent}
          tooltipPosition={props.tooltipPosition}
          style={{ minWidth: '200px', maxWidth: '300px' }}
          id="test1"
        />
      )}
    </>
  );
};
