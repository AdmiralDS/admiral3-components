import { forwardRef, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { Tooltip, useTooltip } from '#src/components/Tooltip';

import { Wrapper, TagCircle, Icon, Text, StatusIcon } from './style';
import { BadgeDot } from '../BadgeDot';
import { refSetter } from '#src/utils/refSetter';

export type TagDimension = 'm' | 's';

/**
 * @deprecated Помечено как deprecated в версии 4.14.0, будет удалено в версии 9.х.х.
 * Взамен используйте альтернативные значения 'neutral' | 'success' | 'primary' | 'danger' | 'warning'
 */
export type DeprecatedTagKind = 'green' | 'blue' | 'red' | 'orange';

export type TagKind = 'neutral' | 'success' | 'primary' | 'danger' | 'warning' | DeprecatedTagKind;

export interface TagVisualProps {
  /** Тип тэга. Можно выбрать из предложенных вариантов, либо задать свои цвета для тэга.
   * В случае когда статус задается через статусную метку (кружок), свойство background отвечает за цвет статусной метки.
   * В случае когда статус задается через цвет фона и обводки, свойство background отвечает за цвет фона,
   * свойство border отвечает за цвет обводки, свойство backgroundHover отвечает за цвет фона при ховере в случае активного тэга.
   */
  kind?: TagKind | { background: string; border?: string; backgroundHover?: string };
  /** Отображение статуса через цвет обводки и фона. По умолчанию, при statusViaBackground = false, отображение статуса
   * происходит через цветную статусную метку (цветной кружок рядом с текстом)
   */
  statusViaBackground?: boolean;
  /** Скрыть обводку тэга (при условии, что статус отображается через цвет обводки и фона) */
  isBorderHidden?: boolean;
  /** Отображение иконки. Иконка отображается только по левому краю и при условии, что статус отображается через цвет обводки и фона */
  icon?: React.ReactNode;
}

export interface TagSizeProps {
  /** Высота тэга */
  dimension?: TagDimension;
  /** Ширина тэга */
  width?: number | string;
  /**
   * Позволяет рендерить компонент, используя другой тег HTML (https://styled-components.com/docs/api#as-polymorphic-prop).
   * В storybook в качестве примера приведены несколько возможных вариантов этого параметра (кроме них можно использовать любой другой HTML тег).
   */
  as?: React.ElementType;
}

export interface TagProps extends React.HTMLAttributes<HTMLButtonElement>, TagVisualProps, TagSizeProps {}

export interface TagInternalProps {
  /** Для внутреннего использования! Отображение иконки отрытия выпадающего меню */
  statusIcon?: React.ReactNode;
}

export const Tag = forwardRef<HTMLElement, TagProps & TagInternalProps>(
  (
    {
      children,
      kind = 'neutral',
      dimension = 'm',
      width,
      statusViaBackground = false,
      isBorderHidden = false,
      icon,
      statusIcon,
      onClick,
      status,
      ...props
    },
    ref,
  ) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLElement>(null);
    const [overflow, setOverflow] = useState(false);
    const [tooltipVisible, setTooltipVisible] = useState(false);

    const {
      targetProps: { ref: targetRef, ...tragetProps },
      // targetProps,
      tooltipProps,
      isVisible,
    } = useTooltip<HTMLDivElement>();

    // const [targetElement, setTargetElement] = useState<HTMLDivElement | null>(null);
    // const setTargetRefs = useMemo(() => refSetter(targetProps.ref, setTargetElement), [targetProps.ref]);

    const background: TagKind | string =
      typeof kind === 'object' ? (kind.background ? kind.background : 'neutral') : (kind as TagKind);
    const border: TagKind | string = isBorderHidden
      ? 'transparent'
      : typeof kind === 'object'
        ? !!kind.background && !!kind.border
          ? kind.border
          : 'neutral'
        : (kind as TagKind);
    const backgroundHover: TagKind | string =
      typeof kind === 'object'
        ? kind.backgroundHover
          ? kind.backgroundHover
          : kind.background
            ? kind.background
            : 'neutral'
        : (kind as TagKind);

    useLayoutEffect(() => {
      const element = textRef.current;
      if (element && checkOverflow(element) !== overflow) {
        setOverflow(checkOverflow(element));
      }
    }, [tooltipVisible, setOverflow]);

    useLayoutEffect(() => {
      function show() {
        setTooltipVisible(true);
      }
      function hide() {
        setTooltipVisible(false);
      }
      const wrapper = wrapperRef.current;
      if (wrapper) {
        wrapper.addEventListener('mouseenter', show);
        wrapper.addEventListener('mouseleave', hide);
        wrapper.addEventListener('focus', show);
        wrapper.addEventListener('blur', hide);
        return () => {
          wrapper.removeEventListener('mouseenter', show);
          wrapper.removeEventListener('mouseleave', hide);
          wrapper.removeEventListener('focus', show);
          wrapper.removeEventListener('blur', hide);
        };
      }
    }, [setTooltipVisible]);

    return (
      <>
        <Wrapper
          {...tragetProps}
          ref={targetRef}
          $width={width}
          onClick={onClick}
          $clickable={!!onClick}
          $statusViaBackground={statusViaBackground}
          $border={border}
          $background={background}
          $backgroundHover={backgroundHover}
          $dimension={dimension}
          type="button"
          {...props}
        >
          {background !== 'neutral' && !statusViaBackground && <BadgeDot appearance={status} />}
          {statusViaBackground && icon && <Icon>{icon}</Icon>}
          {children && <Text ref={textRef}>{children}</Text>}
          {statusIcon && <StatusIcon>{statusIcon}</StatusIcon>}
        </Wrapper>
        {isVisible && overflow && <Tooltip {...tooltipProps}>{children}</Tooltip>}
      </>
    );
  },
);

Tag.displayName = 'Tag';

export { TagCircle } from './style';
