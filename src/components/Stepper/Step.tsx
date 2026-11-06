import { forwardRef, useContext, useId, useState, type MouseEvent } from 'react';

import { ServiceCheckSolid, ServiceCloseCircleSolid, ServiceErrorSolid } from '@admiral-ds/admiral3-icons';

import { STEPPER_DESCRIPTION_OVERFLOW_TOLERANCE } from './constants';
import { StepperContext } from './StepperContext';
import {
  Connector,
  HiddenText,
  Indicator,
  StepDescription,
  StepLabel,
  StepSegment,
  StepText,
  StepTrack,
} from './style';
import type { StepProps, StepVisualState } from './types';
import { useOverflow } from '../../hooks/useOverflow';
import { Tooltip, TOOLTIP_DELAY, useTooltip } from '../Tooltip';

const STATUS_ICONS = {
  completed: ServiceCheckSolid,
  disabled: ServiceCheckSolid,
  error: ServiceCloseCircleSolid,
  warning: ServiceErrorSolid,
};

/** Один сегмент Stepper. Состояние завершения задаётся независимо от текущего шага. */
export const Step = forwardRef<HTMLLIElement, StepProps>(
  (
    {
      label,
      description,
      completed = false,
      visited = false,
      disabled = false,
      redo = false,
      status = 'default',
      buttonProps,
      onClick,
      ...props
    },
    ref,
  ) => {
    const context = useContext(StepperContext);
    if (!context) throw new Error('Step must be rendered as a direct child of Stepper.');
    const { index, active, dimension, orientation, colorMode, lineClamp, hideLine, onStepChange, statusLabels } =
      context;
    const labelId = useId();
    const descriptionId = useId();
    const statusId = useId();
    const hasLabel = Boolean(label?.trim());
    const hasCustomName = Boolean(buttonProps?.['aria-label'] || buttonProps?.['aria-labelledby']);
    const [labelElement, setLabelElement] = useState<HTMLSpanElement | null>(null);
    const [descriptionElement, setDescriptionElement] = useState<HTMLSpanElement | null>(null);
    const { isVisible, triggerProps, tooltipProps } = useTooltip<HTMLElement>({ delay: TOOLTIP_DELAY });
    const labelOverflow = useOverflow(tooltipProps.targetElement, labelElement, {
      observe: true,
      measurementKey: `${dimension}:${label ?? ''}`,
    });
    const descriptionOverflow = useOverflow(tooltipProps.targetElement, descriptionElement, {
      observe: true,
      measurementKey: `${dimension}:${lineClamp}:${description}`,
      verticalTolerance: STEPPER_DESCRIPTION_OVERFLOW_TOLERANCE,
    });
    const interactive = Boolean(onStepChange) && !disabled && (active || completed || visited);
    let state: StepVisualState = 'next';
    if (completed) state = 'completed';
    if (active) state = 'active';
    if (status !== 'default') state = status;
    if (disabled) state = 'disabled';
    const statusText = [
      disabled && statusLabels.disabled,
      !disabled && status !== 'default' && statusLabels[status],
      completed && statusLabels.completed,
      active && redo && statusLabels.redo,
    ]
      .filter(Boolean)
      .join('. ');
    const showTooltip = (labelOverflow || descriptionOverflow) && isVisible;
    const nameId = hasLabel ? labelId : descriptionId;
    const contentDescriptionId = showTooltip ? tooltipProps.id : descriptionId;
    const describedBy =
      [
        buttonProps?.['aria-describedby'],
        hasLabel || (interactive && hasCustomName) ? contentDescriptionId : undefined,
        statusText ? statusId : undefined,
      ]
        .filter(Boolean)
        .join(' ') || undefined;

    const handleItemClick = (event: MouseEvent<HTMLLIElement>) => {
      if (disabled) {
        event.preventDefault();
        return;
      }
      onClick?.(event);
    };

    const handleButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
      buttonProps?.onClick?.(event);
      if (!active && !event.defaultPrevented) {
        onStepChange?.(index, event);
      }
    };

    const Icon = state === 'active' || state === 'next' ? undefined : STATUS_ICONS[state];

    return (
      <li
        ref={ref}
        {...props}
        aria-current={active && !interactive ? 'step' : undefined}
        data-step-index={index}
        onClick={handleItemClick}
      >
        <StepSegment
          {...triggerProps}
          role={interactive ? undefined : 'group'}
          aria-labelledby={interactive && buttonProps?.['aria-label'] !== undefined ? undefined : nameId}
          {...(interactive ? buttonProps : undefined)}
          onClick={interactive ? handleButtonClick : undefined}
          as={interactive ? 'button' : 'div'}
          type={interactive ? 'button' : undefined}
          tabIndex={interactive ? -1 : undefined}
          aria-describedby={describedBy}
          aria-disabled={disabled || undefined}
          aria-current={active && interactive ? 'step' : undefined}
          data-step-action={interactive ? '' : undefined}
          data-state={state}
          data-redo={active && redo && !disabled ? '' : undefined}
          data-hide-line={hideLine ? '' : undefined}
          $dimension={dimension}
          $orientation={orientation}
          $colorMode={colorMode}
        >
          <StepTrack aria-hidden="true">
            <Indicator>
              {/* У статусных иконок круг занимает 18px из viewBox 24px; в Stepper он заполняет весь индикатор. */}
              {Icon ? <Icon viewBox="3 3 18 18" /> : index + 1}
            </Indicator>
            <Connector data-step-connector="" />
          </StepTrack>
          <StepText>
            {hasLabel && (
              <StepLabel id={labelId} ref={setLabelElement}>
                {label}
              </StepLabel>
            )}
            <StepDescription id={descriptionId} ref={setDescriptionElement} $lineClamp={lineClamp}>
              {description}
            </StepDescription>
          </StepText>
          {statusText && <HiddenText id={statusId}>{statusText}</HiddenText>}
        </StepSegment>
        {showTooltip && (
          <Tooltip {...tooltipProps} dimension={dimension}>
            {hasLabel ? `${label} — ${description}` : description}
          </Tooltip>
        )}
      </li>
    );
  },
);

Step.displayName = 'Step';
