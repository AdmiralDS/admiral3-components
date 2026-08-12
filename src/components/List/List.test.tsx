import { createRef } from 'react';

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { List } from './List';
import { LIST_ROOT_DATA_ATTRIBUTE } from './constants';

describe('List', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders children', () => {
    render(<List data-testid="list">Content</List>);

    expect(screen.getByTestId('list')).toHaveTextContent('Content');
  });

  it('forwards div attributes to the root element', () => {
    render(<List data-testid="list" title="List" />);

    expect(screen.getByTestId('list')).toHaveAttribute('title', 'List');
    expect(screen.getByTestId('list')).toHaveAttribute(LIST_ROOT_DATA_ATTRIBUTE, 'true');
  });

  it('forwards ref to the root element', () => {
    const ref = createRef<HTMLDivElement>();

    render(<List ref={ref} data-testid="list" />);

    expect(ref.current).toBe(screen.getByTestId('list'));
  });
});
