import { createRef } from 'react';

import { cleanup, render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { FloatingPortal } from './FloatingPortal';
const targetElement = document.createElement('button');

describe('FloatingPortal', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  it('renders children into the target document body by default', () => {
    render(
      <FloatingPortal targetElement={targetElement} data-testid="portal">
        Content
      </FloatingPortal>,
    );

    expect(screen.getByTestId('portal').parentElement).toBe(targetElement.ownerDocument.body);
  });

  it('renders children into the provided container', () => {
    const container = document.createElement('section');
    document.body.append(container);

    render(
      <FloatingPortal targetElement={targetElement} container={container} data-testid="portal">
        Content
      </FloatingPortal>,
    );

    expect(screen.getByTestId('portal').parentElement).toBe(container);
    container.remove();
  });

  it('forwards the container node ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<FloatingPortal ref={ref} targetElement={targetElement} data-testid="portal" />);

    expect(ref.current).toBe(screen.getByTestId('portal'));
  });

  it('does not access document when rendered on the server without a target element or container', () => {
    vi.stubGlobal('document', undefined);

    expect(renderToString(<FloatingPortal targetElement={null}>Content</FloatingPortal>)).toBe('');
  });

  it('does not render in the document body without a target element or container', () => {
    render(
      <FloatingPortal targetElement={null} data-testid="portal">
        Content
      </FloatingPortal>,
    );

    expect(screen.queryByTestId('portal')).not.toBeInTheDocument();
  });
});
