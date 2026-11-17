import { createRef } from 'react';

import { themes } from '@admiral-ds/admiral3-tokens';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  ACTIVITY_AVATAR_DIMENSIONS,
  AVATAR_DIMENSIONS,
  AVATAR_DIMENSION_PARAMETERS,
  AVATAR_STATUSES,
} from './constants';
import { ActivityAvatar, Avatar, type AvatarProps } from './index';

const defaultProps = { userName: 'Иван Иванов' } satisfies AvatarProps;

const normalizeCssValue = (value: string) => value.replace(/\s*,\s*/g, ',').trim();

const expectCssVariables = (element: Element | null, variables: Record<string, string>) => {
  expect(element).toBeInTheDocument();
  const styles = getComputedStyle(element!);

  for (const [property, value] of Object.entries(variables)) {
    expect(normalizeCssValue(styles.getPropertyValue(property)), property).toBe(normalizeCssValue(value));
  }
};

describe('Avatar', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it.each(AVATAR_DIMENSIONS)('applies the %s dimension without forwarding it to the DOM', (dimension) => {
    render(<Avatar {...defaultProps} data-testid="avatar" dimension={dimension} />);

    const component = screen.getByTestId('avatar');

    expect(component).toHaveStyle({
      width: `${AVATAR_DIMENSION_PARAMETERS[dimension].size}px`,
      height: `${AVATAR_DIMENSION_PARAMETERS[dimension].size}px`,
    });
    expect(component).not.toHaveAttribute('dimension');
  });

  it('renders the provided icon instead of initials', () => {
    render(<Avatar {...defaultProps} icon={<svg data-testid="avatar-icon" />} />);

    expect(screen.getByTestId('avatar-icon')).toBeInTheDocument();
    expect(screen.queryByText('ИИ')).not.toBeInTheDocument();
  });

  it.each(['xxs', 'xxxs'] as const)('keeps initials visible instead of an icon at the %s dimension', (dimension) => {
    render(<Avatar {...defaultProps} dimension={dimension} icon={<svg data-testid="avatar-icon" />} />);

    expect(screen.getByRole('button', { name: defaultProps.userName })).toHaveTextContent('И');
    expect(screen.queryByTestId('avatar-icon')).not.toBeInTheDocument();
  });

  it('resolves preset SVG colors with the active theme', () => {
    const { container } = render(
      <ThemeProvider theme={themes.dark}>
        <ActivityAvatar {...defaultProps} status="success" showActivityRing />
      </ThemeProvider>,
    );

    expectCssVariables(container.querySelector('svg'), {
      '--admiral-avatar-background-color': `var(--admiral-color-neutral-base-3-rest, ${themes.dark.color.neutral.base._3.rest})`,
      '--admiral-avatar-status-color': `var(--admiral-color-success-base-1-rest, ${themes.dark.color.success.base._1.rest})`,
      '--admiral-avatar-ring-color': `var(--admiral-color-primary-stroke-1-rest, ${themes.dark.color.primary.stroke._1.rest})`,
    });
  });

  it('renders custom status colors without forwarding the config to the DOM', () => {
    const { container } = render(<Avatar {...defaultProps} status={{ backgroundColor: 'tomato' }} />);

    expect(screen.getByRole('button')).toHaveAttribute('data-status', 'custom');
    expect(screen.getByRole('button')).not.toHaveAttribute('status');
    expect(container.querySelector('svg')).toHaveStyle({ '--admiral-avatar-status-color': 'tomato' });
    expect(container.querySelector('svg > ellipse')).toHaveAttribute('fill', 'var(--admiral-avatar-status-color)');
  });

  it('keeps the default background for a partial custom appearance', () => {
    const { container } = render(<Avatar {...defaultProps} appearance={{ textColor: 'red' }} />);

    expectCssVariables(container.querySelector('svg'), {
      '--admiral-avatar-background-color': `var(--admiral-color-neutral-base-3-rest, ${themes.light.color.neutral.base._3.rest})`,
    });
  });

  it('centers the avatar and ring within their reserved space', () => {
    const { container } = render(<ActivityAvatar {...defaultProps} showActivityRing />);

    expect(screen.getByRole('button')).toHaveStyle({ width: '48px', height: '48px' });
    const background = container.querySelector('svg > circle');
    expect(background).toHaveAttribute('cx', '24');
    expect(background).toHaveAttribute('cy', '24');
    expect(background).toHaveAttribute('r', '20');
    expect(container.querySelector('svg > circle[fill="none"]')).toHaveAttribute('r', '23');
  });

  it.each(ACTIVITY_AVATAR_DIMENSIONS)(
    'reserves ring space at the %s dimension even when the ring is hidden',
    (dimension) => {
      const { container, rerender } = render(<ActivityAvatar {...defaultProps} dimension={dimension} />);
      const size = AVATAR_DIMENSION_PARAMETERS[dimension].size + 8;
      const target = screen.getByRole('button');

      expect(target).toHaveStyle({ width: `${size}px`, height: `${size}px` });
      expect(container.querySelector('svg')).toHaveAttribute('viewBox', `0 0 ${size} ${size}`);
      expect(container.querySelector('svg > circle[fill="none"]')).not.toBeInTheDocument();

      rerender(<ActivityAvatar {...defaultProps} dimension={dimension} showActivityRing />);

      expect(target).toHaveStyle({ width: `${size}px`, height: `${size}px` });
      expect(container.querySelector('svg > circle[fill="none"]')).toBeInTheDocument();

      rerender(<ActivityAvatar {...defaultProps} dimension={dimension} showActivityRing={false} />);

      expect(container.querySelector('svg > circle[fill="none"]')).not.toBeInTheDocument();
    },
  );

  it.each(['xxs', 'xxxs'] as const)('promotes the %s dimension to xs when a status is present', (dimension) => {
    render(<Avatar {...defaultProps} dimension={dimension} status="success" />);

    expect(screen.getByRole('button')).toHaveAttribute('data-dimension', 'xs');
    expect(screen.getByRole('button')).toHaveStyle({ width: '24px', height: '24px' });
    expect(screen.getByRole('button')).toHaveTextContent('И');
  });

  describe.each([
    { name: 'Avatar', Component: Avatar },
    { name: 'ActivityAvatar', Component: ActivityAvatar },
  ])('$name', ({ Component }) => {
    it('uses a passive button with an accessible name and a decorative SVG by default', () => {
      const { container } = render(<Component {...defaultProps} />);
      const target = screen.getByRole('button', { name: defaultProps.userName });

      expect(target).toHaveTextContent('ИИ');
      expect(target).toHaveAttribute('type', 'button');
      expect(target).toHaveAttribute('tabindex', '-1');
      expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
      expect(container.querySelector('svg')).toHaveAttribute('focusable', 'false');
    });

    it('preserves the ref and consumer attributes across rerenders', () => {
      const ref = createRef<HTMLButtonElement>();
      const { rerender } = render(
        <Component {...defaultProps} ref={ref} aria-label="Открыть профиль" title="Профиль" data-testid="avatar" />,
      );
      const target = screen.getByTestId('avatar');

      expect(ref.current).toBe(target);
      expect(target).toHaveAccessibleName('Открыть профиль');
      expect(target).toHaveAttribute('title', 'Профиль');

      rerender(<Component {...defaultProps} ref={ref} showTooltip={false} />);

      expect(ref.current).toBe(target);
    });

    it('supports activation and updates the default tab order when an action is removed', () => {
      const onClick = vi.fn();
      const { rerender } = render(<Component {...defaultProps} onClick={onClick} />);
      const target = screen.getByRole('button');

      expect(target).toHaveAttribute('tabindex', '0');
      fireEvent.click(target);
      expect(onClick).toHaveBeenCalledOnce();

      rerender(<Component {...defaultProps} />);

      expect(target).toHaveAttribute('tabindex', '-1');
      fireEvent.click(target);
      expect(onClick).toHaveBeenCalledOnce();
    });

    it('preserves an explicitly supplied tabIndex for both active and passive avatars', () => {
      const { rerender } = render(<Component {...defaultProps} onClick={vi.fn()} tabIndex={-1} />);
      const target = screen.getByRole('button');

      expect(target).toHaveAttribute('tabindex', '-1');

      rerender(<Component {...defaultProps} tabIndex={0} />);

      expect(target).toHaveAttribute('tabindex', '0');
    });

    it('uses explicit initials instead of generating them from the name', () => {
      render(<Component {...defaultProps} userInitials="АБ" />);

      expect(screen.getByRole('button', { name: defaultProps.userName })).toHaveTextContent('АБ');
      expect(screen.queryByText('ИИ')).not.toBeInTheDocument();
    });

    it.each([false, true, null, undefined, ''])('keeps initials for an empty icon slot (%s)', (icon) => {
      render(<Component {...defaultProps} icon={icon} />);

      expect(screen.getByRole('button')).toHaveTextContent('ИИ');
    });

    it('renders a numeric icon slot instead of initials', () => {
      render(<Component {...defaultProps} icon={0} />);

      expect(screen.getByRole('button')).toHaveTextContent('0');
      expect(screen.queryByText('ИИ')).not.toBeInTheDocument();
    });

    it.each(AVATAR_STATUSES)('renders the %s status and removes it when the prop is cleared', (status) => {
      const { container, rerender } = render(<Component {...defaultProps} status={status} />);
      const target = screen.getByRole('button');

      expect(target).toHaveAttribute('data-status', status);
      expect(target).not.toHaveAttribute('status');
      expect(container.querySelector('svg > ellipse')).toBeInTheDocument();

      rerender(<Component {...defaultProps} />);

      expect(target).not.toHaveAttribute('data-status');
      expect(container.querySelector('svg > ellipse')).not.toBeInTheDocument();
    });

    it('applies custom background and text colors without leaking configuration to the DOM', () => {
      const { container } = render(
        <Component {...defaultProps} appearance={{ backgroundColor: 'navy', textColor: 'white' }} />,
      );

      expect(container.querySelector('svg')).toHaveStyle({ '--admiral-avatar-background-color': 'navy' });
      expect(screen.getByText('ИИ')).toHaveStyle({ color: 'rgb(255, 255, 255)' });
      expect(screen.getByRole('button')).not.toHaveAttribute('appearance');
    });

    it('keeps SVG masks unique when multiple avatars are mounted', () => {
      const { container } = render(
        <>
          <Component {...defaultProps} status="success" />
          <Component userName="Пётр Петров" status="error" />
        </>,
      );
      const masks = Array.from(container.querySelectorAll('mask'));

      expect(masks).toHaveLength(2);
      expect(new Set(masks.map((mask) => mask.id)).size).toBe(2);
      for (const mask of masks) {
        expect(mask.closest('svg')?.querySelector('svg > circle')).toHaveAttribute('mask', `url(#${mask.id})`);
      }
    });

    describe('image loading', () => {
      let images: HTMLImageElement[];

      beforeEach(() => {
        images = [];
        vi.spyOn(globalThis, 'Image').mockImplementation(function () {
          const image = document.createElement('img');
          images.push(image);
          return image;
        });
      });

      it('shows initials while loading and replaces them with the loaded image', () => {
        const { container } = render(<Component {...defaultProps} href="/avatar.png" />);

        expect(screen.getByRole('button')).toHaveTextContent('ИИ');
        expect(container.querySelector('svg > image')).not.toBeInTheDocument();

        fireEvent.load(images[0]);

        expect(container.querySelector('svg > image')).toHaveAttribute('href', '/avatar.png');
        expect(screen.queryByText('ИИ')).not.toBeInTheDocument();
        expect(screen.getByRole('button')).toHaveAccessibleName(defaultProps.userName);
      });

      it('prefers a successfully loaded image to the supplied icon', () => {
        const { container } = render(
          <Component {...defaultProps} href="/avatar.png" icon={<svg data-testid="fallback-icon" />} />,
        );

        expect(screen.getByTestId('fallback-icon')).toBeInTheDocument();

        fireEvent.load(images[0]);

        expect(container.querySelector('svg > image')).toBeInTheDocument();
        expect(screen.queryByTestId('fallback-icon')).not.toBeInTheDocument();
      });

      it('keeps the provided icon when an image fails to load', () => {
        const { container } = render(
          <Component {...defaultProps} href="/missing.png" icon={<svg data-testid="fallback-icon" />} />,
        );

        fireEvent.error(images[0]);

        expect(screen.getByTestId('fallback-icon')).toBeInTheDocument();
        expect(container.querySelector('svg > image')).not.toBeInTheDocument();
      });

      it('uses fallback content while a replacement image is loading and when href is removed', () => {
        const { container, rerender } = render(<Component {...defaultProps} href="/first.png" />);
        fireEvent.load(images[0]);

        rerender(<Component {...defaultProps} href="/second.png" />);

        expect(container.querySelector('svg > image')).not.toBeInTheDocument();
        expect(screen.getByRole('button')).toHaveTextContent('ИИ');

        fireEvent.load(images[1]);

        expect(container.querySelector('svg > image')).toHaveAttribute('href', '/second.png');

        rerender(<Component {...defaultProps} />);

        expect(container.querySelector('svg > image')).not.toBeInTheDocument();
        expect(screen.getByRole('button')).toHaveTextContent('ИИ');
      });

      it('ignores stale load and error events from a previous URL', () => {
        const { container, rerender } = render(<Component {...defaultProps} href="/first.png" />);
        rerender(<Component {...defaultProps} href="/second.png" />);

        fireEvent.load(images[0]);
        expect(container.querySelector('svg > image')).not.toBeInTheDocument();

        fireEvent.load(images[1]);
        fireEvent.error(images[0]);

        expect(container.querySelector('svg > image')).toHaveAttribute('href', '/second.png');
      });
    });

    it('shows the full name on focus, preserves descriptions and closes on Escape', () => {
      const onFocus = vi.fn();
      render(
        <>
          <p id="profile-description">Дополнительная информация о пользователе</p>
          <Component {...defaultProps} aria-describedby="profile-description" onFocus={onFocus} />
        </>,
      );
      const target = screen.getByRole('button');

      fireEvent.focus(target);

      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toHaveTextContent(defaultProps.userName);
      expect(target).toHaveAttribute('aria-describedby', 'profile-description');
      expect(target).toHaveAccessibleDescription('Дополнительная информация о пользователе');
      expect(onFocus).toHaveBeenCalledOnce();

      fireEvent.keyDown(target, { key: 'Escape' });

      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
      expect(target).toHaveAttribute('aria-describedby', 'profile-description');
    });

    it('does not repeat the accessible name in a tooltip description', () => {
      render(<Component {...defaultProps} />);
      const target = screen.getByRole('button', { name: defaultProps.userName });

      fireEvent.focus(target);

      expect(screen.getByRole('tooltip')).toHaveTextContent(defaultProps.userName);
      expect(target).toHaveAccessibleName(defaultProps.userName);
      expect(target).not.toHaveAttribute('aria-describedby');
      expect(target).toHaveAccessibleDescription('');
    });

    it('closes the tooltip when focus leaves the avatar', () => {
      render(<Component {...defaultProps} />);
      const target = screen.getByRole('button');
      fireEvent.focus(target);

      expect(screen.getByRole('tooltip')).toBeInTheDocument();

      fireEvent.blur(target, { relatedTarget: document.body });

      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });

    it('opens on hover without a delay and closes when the pointer leaves', () => {
      render(<Component {...defaultProps} />);
      const target = screen.getByRole('button');

      fireEvent.mouseEnter(target);

      expect(screen.getByRole('tooltip')).toHaveTextContent(defaultProps.userName);

      fireEvent.mouseLeave(target, { relatedTarget: document.body });

      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });

    it('disables the tooltip without replacing the target or forwarding showTooltip to the DOM', () => {
      const { rerender } = render(<Component {...defaultProps} />);
      const target = screen.getByRole('button');
      fireEvent.focus(target);
      expect(screen.getByRole('tooltip')).toBeInTheDocument();

      rerender(<Component {...defaultProps} showTooltip={false} />);

      expect(screen.getByRole('button')).toBe(target);
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
      expect(target).not.toHaveAttribute('aria-describedby');
      expect(target).not.toHaveAttribute('showTooltip');
      fireEvent.focus(target);
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });
});
