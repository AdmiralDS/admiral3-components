import { createRef } from 'react';

import { themes } from '@admiral-ds/admiral3-tokens';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { AVATAR_DIMENSIONS, AVATAR_DIMENSION_PARAMETERS } from './constants';
import { ActivityAvatar, Avatar, type AvatarProps } from './index';
import { TOOLTIP_DELAY } from '../Tooltip';

const defaultProps = { userName: 'Иван Иванов' } satisfies AvatarProps;

describe('Avatar', () => {
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it('renders the public Avatar with generated initials and an accessible name', () => {
    render(<Avatar {...defaultProps} />);

    expect(screen.getByRole('button', { name: defaultProps.userName })).toHaveTextContent('ИИ');
  });

  it('forwards button attributes to the root element', () => {
    render(<Avatar {...defaultProps} data-testid="avatar" title="Avatar" />);

    const component = screen.getByTestId('avatar');

    expect(component).toHaveAttribute('data-testid', 'avatar');
    expect(component).toHaveAttribute('title', 'Avatar');
  });

  it('forwards ref to the root element', () => {
    const ref = createRef<HTMLButtonElement>();

    render(<Avatar {...defaultProps} ref={ref} data-testid="avatar" />);

    expect(ref.current).toBe(screen.getByTestId('avatar'));
    expect(ref.current).toHaveAttribute('type', 'button');
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

  it('resolves preset SVG colors with the active theme', () => {
    const { container } = render(
      <ThemeProvider theme={themes.dark}>
        <ActivityAvatar {...defaultProps} status="success" showActivityRing />
      </ThemeProvider>,
    );

    expect(container.querySelector('svg')).toHaveStyle({
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

    expect(container.querySelector('svg')).toHaveStyle({
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

  describe.each([
    { name: 'Avatar', Component: Avatar },
    { name: 'ActivityAvatar', Component: ActivityAvatar },
  ])('$name tooltip', ({ Component }) => {
    it('shows the full name on focus, preserves descriptions and closes on Escape', () => {
      const onFocus = vi.fn();
      render(<Component {...defaultProps} aria-describedby="profile-description" onFocus={onFocus} />);
      const target = screen.getByRole('button');

      fireEvent.focus(target);

      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toHaveTextContent(defaultProps.userName);
      expect(target.getAttribute('aria-describedby')?.split(' ')).toEqual(['profile-description', tooltip.id]);
      expect(onFocus).toHaveBeenCalledOnce();

      fireEvent.keyDown(target, { key: 'Escape' });

      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
      expect(target).toHaveAttribute('aria-describedby', 'profile-description');
    });

    it('opens on hover after the recommended delay', () => {
      vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
      render(<Component {...defaultProps} />);

      fireEvent.mouseEnter(screen.getByRole('button'));
      act(() => vi.advanceTimersByTime(TOOLTIP_DELAY - 1));
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

      act(() => vi.advanceTimersByTime(1));
      expect(screen.getByRole('tooltip')).toHaveTextContent(defaultProps.userName);
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
