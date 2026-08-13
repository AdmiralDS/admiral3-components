import { createRef } from 'react';

import { SystemStarSolid } from '@admiral-ds/admiral3-icons';
import { themes } from '@admiral-ds/admiral3-tokens';
import { cleanup, render, screen } from '@testing-library/react';
import type { ExecutionContext } from 'styled-components';
import { afterEach, describe, expect, it } from 'vitest';

import { LIST_DIMENSIONS, LIST_DIMENSION_PARAMETERS, LIST_GAP } from './constants';
import { ListIcon } from './ListIcon';
import { ListItem } from './ListItem';
import { OrderedList } from './OrderedList';
import { listIconColor, listItemColor } from './style';
import { UnorderedList } from './UnorderedList';

const resolveToken = (token: (context: ExecutionContext) => string, theme = themes.light) => {
  return token({ theme } as ExecutionContext);
};

describe('List components', () => {
  afterEach(() => {
    cleanup();
  });

  describe('OrderedList', () => {
    it('renders an ordered list and forwards attributes and ref', () => {
      const ref = createRef<HTMLOListElement>();

      render(
        <OrderedList ref={ref} data-testid="ordered-list" title="Steps">
          <ListItem>First step</ListItem>
        </OrderedList>,
      );

      const list = screen.getByRole('list', { name: 'Steps' });
      expect(list.tagName).toBe('OL');
      expect(list).toHaveAttribute('role', 'list');
      expect(list).toBe(screen.getByTestId('ordered-list'));
      expect(ref.current).toBe(list);
    });

    it('uses the default dimension and gap', () => {
      render(
        <OrderedList data-testid="ordered-list">
          <ListItem>Item</ListItem>
        </OrderedList>,
      );

      expect(screen.getByTestId('ordered-list')).toHaveAttribute('data-dimension', 'm');
      expect(screen.getByTestId('ordered-list')).toHaveStyle({ gap: `${LIST_GAP}px` });
    });

    it.each(LIST_DIMENSIONS)('applies the %s dimension styles', (dimension) => {
      const { typography } = LIST_DIMENSION_PARAMETERS[dimension];

      render(
        <OrderedList dimension={dimension} data-testid="ordered-list">
          <ListItem data-testid="item">Item</ListItem>
        </OrderedList>,
      );

      expect(screen.getByTestId('ordered-list')).toHaveAttribute('data-dimension', dimension);
      expect(screen.getByTestId('item')).toHaveStyle({
        fontSize: typography.fontSize,
        lineHeight: typography.lineHeight,
      });
    });

    it('accepts a CSS string as gap', () => {
      render(
        <OrderedList data-testid="ordered-list" gap="1.5rem">
          <ListItem>Item</ListItem>
        </OrderedList>,
      );

      expect(screen.getByTestId('ordered-list')).toHaveStyle({ gap: '1.5rem' });
    });

    it('starts numbering from the start attribute', () => {
      render(
        <OrderedList data-testid="ordered-list" start={5}>
          <ListItem>Item</ListItem>
        </OrderedList>,
      );

      expect(screen.getByTestId('ordered-list')).toHaveAttribute('start', '5');
      expect(screen.getByTestId('ordered-list')).toHaveStyle({ counterReset: 'admiral-list-counter 4' });
    });

    it('supports reversed numbering', () => {
      render(
        <OrderedList data-testid="ordered-list" reversed>
          <ListItem>Item</ListItem>
        </OrderedList>,
      );

      expect(screen.getByTestId('ordered-list')).toHaveAttribute('reversed');
      expect(screen.getByTestId('ordered-list')).toHaveStyle({ counterReset: 'admiral-list-counter 2' });
    });

    it('starts reversed numbering from the start attribute', () => {
      render(
        <OrderedList data-testid="ordered-list" reversed start={5}>
          <ListItem>Item</ListItem>
        </OrderedList>,
      );

      expect(screen.getByTestId('ordered-list')).toHaveStyle({ counterReset: 'admiral-list-counter 6' });
    });

    it('counts rendered list item elements for reversed numbering', () => {
      render(
        <OrderedList data-testid="ordered-list" reversed>
          ignored text
          <>
            <ListItem>First item</ListItem>
            {null}
            <ListItem>Second item</ListItem>
          </>
          <ListItem>Third item</ListItem>
          <button type="button">Not a list item</button>
          <li>Native list item</li>
          {false}
        </OrderedList>,
      );

      expect(screen.getByTestId('ordered-list')).toHaveStyle({ counterReset: 'admiral-list-counter 5' });
    });
  });

  describe('UnorderedList', () => {
    it('renders an unordered list and forwards attributes and ref', () => {
      const ref = createRef<HTMLUListElement>();

      render(
        <UnorderedList ref={ref} data-testid="unordered-list" aria-label="Products">
          <ListItem>Milk</ListItem>
        </UnorderedList>,
      );

      const list = screen.getByRole('list', { name: 'Products' });
      expect(list.tagName).toBe('UL');
      expect(list).toHaveAttribute('role', 'list');
      expect(list).toBe(screen.getByTestId('unordered-list'));
      expect(ref.current).toBe(list);
    });

    it('uses the default dimension and gap', () => {
      render(<UnorderedList data-testid="unordered-list" />);

      expect(screen.getByTestId('unordered-list')).toHaveAttribute('data-dimension', 'm');
      expect(screen.getByTestId('unordered-list')).toHaveStyle({ gap: `${LIST_GAP}px` });
    });

    it('converts a numeric gap to pixels', () => {
      render(<UnorderedList data-testid="unordered-list" gap={12} />);

      expect(screen.getByTestId('unordered-list')).toHaveStyle({ gap: '12px' });
    });

    it.each(LIST_DIMENSIONS)('applies the %s dimension styles', (dimension) => {
      const { typography } = LIST_DIMENSION_PARAMETERS[dimension];

      render(
        <UnorderedList dimension={dimension} data-testid="unordered-list">
          <ListItem data-testid="item">Item</ListItem>
        </UnorderedList>,
      );

      expect(screen.getByTestId('unordered-list')).toHaveAttribute('data-dimension', dimension);
      expect(screen.getByTestId('item')).toHaveStyle({
        fontSize: typography.fontSize,
        lineHeight: typography.lineHeight,
      });
    });
  });

  describe('ListItem', () => {
    it('renders a list item, wraps its content and forwards attributes and ref', () => {
      const ref = createRef<HTMLLIElement>();

      render(
        <UnorderedList>
          <ListItem ref={ref} data-testid="item" title="Product">
            Milk
          </ListItem>
        </UnorderedList>,
      );

      const item = screen.getByRole('listitem');
      expect(item).toBe(screen.getByTestId('item'));
      expect(item).toHaveAttribute('role', 'listitem');
      expect(item).toHaveAttribute('title', 'Product');
      expect(item.firstElementChild).toHaveTextContent('Milk');
      expect(ref.current).toBe(item);
    });

    it.each(LIST_DIMENSIONS)('inherits typography for the %s list dimension', (dimension) => {
      render(
        <UnorderedList dimension={dimension}>
          <ListItem data-testid="item">Item</ListItem>
        </UnorderedList>,
      );

      const typography = LIST_DIMENSION_PARAMETERS[dimension].typography;
      expect(screen.getByTestId('item')).toHaveStyle({
        fontSize: typography.fontSize,
        lineHeight: typography.lineHeight,
      });
    });

    it('uses the default text color', () => {
      render(
        <UnorderedList>
          <ListItem data-testid="item">Item</ListItem>
        </UnorderedList>,
      );

      expect(screen.getByTestId('item')).toHaveStyle({ color: resolveToken(listItemColor) });
    });

    it('forwards value for ordered list numbering', () => {
      render(
        <OrderedList>
          <ListItem data-testid="item" value={10}>
            Item
          </ListItem>
        </OrderedList>,
      );

      expect(screen.getByTestId('item')).toHaveAttribute('value', '10');
      expect(screen.getByTestId('item')).toHaveStyle({ counterSet: 'admiral-list-counter 10' });
    });

    it('supports a string value inherited from LiHTMLAttributes', () => {
      render(
        <OrderedList>
          <ListItem data-testid="item" value="10">
            Item
          </ListItem>
        </OrderedList>,
      );

      expect(screen.getByTestId('item')).toHaveAttribute('value', '10');
      expect(screen.getByTestId('item')).toHaveStyle({ counterSet: 'admiral-list-counter 10' });
    });
  });

  describe('ListIcon', () => {
    it('renders a hidden decorative icon and forwards SVG attributes and ref', () => {
      const ref = createRef<SVGSVGElement>();

      render(
        <UnorderedList styleType="icon">
          <ListItem>
            <ListIcon ref={ref} as={SystemStarSolid} data-testid="icon" />
            Item
          </ListItem>
        </UnorderedList>,
      );

      const icon = screen.getByTestId('icon');
      expect(icon.tagName.toLowerCase()).toBe('svg');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
      expect(icon).toHaveAttribute('focusable', 'false');
      expect(ref.current).toBe(icon);
    });

    it('uses the default icon color', () => {
      render(
        <UnorderedList styleType="icon">
          <ListItem>
            <ListIcon as={SystemStarSolid} data-testid="icon" />
            Item
          </ListItem>
        </UnorderedList>,
      );

      expect(screen.getByTestId('icon')).toHaveStyle({
        color: resolveToken(listIconColor),
      });
    });

    it('applies a custom icon color', () => {
      render(
        <UnorderedList styleType="icon">
          <ListItem>
            <ListIcon as={SystemStarSolid} data-testid="icon" color="tomato" />
            Item
          </ListItem>
        </UnorderedList>,
      );

      expect(screen.getByTestId('icon')).toHaveStyle({ color: 'rgb(255, 99, 71)' });
    });

    it.each(LIST_DIMENSIONS)('uses marker metrics for the %s list dimension', (dimension) => {
      const { markerSize, gap } = LIST_DIMENSION_PARAMETERS[dimension];

      render(
        <UnorderedList dimension={dimension} styleType="icon">
          <ListItem>
            <ListIcon as={SystemStarSolid} data-testid="icon" />
            Item
          </ListItem>
        </UnorderedList>,
      );

      expect(screen.getByTestId('icon')).toHaveStyle({
        width: `${markerSize}px`,
        height: `${markerSize}px`,
        marginInlineEnd: `${gap}px`,
      });
    });
  });
});
