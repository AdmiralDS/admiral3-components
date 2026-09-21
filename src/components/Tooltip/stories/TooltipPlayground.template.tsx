import { Tooltip, type TooltipProps, useTooltip } from '@admiral-ds/admiral3-components';

export const TooltipPlaygroundTemplate = (props: TooltipProps) => {
  const { targetProps, tooltipProps, isVisible } = useTooltip<HTMLButtonElement>();

  return (
    <>
      <button {...targetProps}>Test</button>
      {isVisible && (
        <Tooltip
          {...tooltipProps}
          dimension={props.dimension}
          tooltipPosition={props.tooltipPosition}
          style={{ minWidth: '200px', maxWidth: '300px' }}
        >
          {props.children}
        </Tooltip>
      )}
    </>
  );
};
