import { describe, expect, it } from 'vitest';

import { getDropdownLayout } from './utils';

const rect = (left: number, top: number, width: number, height: number): DOMRect =>
  ({
    x: left,
    y: top,
    left,
    top,
    width,
    height,
    right: left + width,
    bottom: top + height,
    toJSON: () => ({}),
  }) as DOMRect;

describe('getDropdownLayout', () => {
  it('opens downward by default when there is enough space', () => {
    expect(getDropdownLayout('auto', rect(100, 100, 120, 40), rect(0, 0, 200, 100), 800, 600)).toEqual({
      position: 'bottom',
      alignSelf: 'flex-start',
      translateX: 0,
      translateY: 0,
      targetDetached: false,
    });
  });

  it('opens upward when only the space above can fit the dropdown', () => {
    expect(getDropdownLayout('end', rect(500, 500, 100, 40), rect(0, 0, 180, 200), 800, 600)).toEqual({
      position: 'top',
      alignSelf: 'flex-end',
      translateX: 0,
      translateY: 0,
      targetDetached: false,
    });
  });

  it('selects end in auto mode when only end fits', () => {
    expect(getDropdownLayout('auto', rect(750, 100, 30, 20), rect(0, 0, 200, 100), 800, 600)).toEqual({
      position: 'bottom',
      alignSelf: 'flex-end',
      translateX: 0,
      translateY: 0,
      targetDetached: false,
    });
  });

  it('keeps explicit horizontal alignment and shifts it inside the viewport', () => {
    expect(getDropdownLayout('start', rect(760, 100, 30, 20), rect(0, 0, 200, 100), 800, 600)).toMatchObject({
      alignSelf: 'flex-start',
      translateX: -176,
    });
  });

  it('prefers start in auto mode when both candidates fit', () => {
    expect(getDropdownLayout('auto', rect(300, 100, 100, 20), rect(0, 0, 200, 100), 800, 600)).toMatchObject({
      alignSelf: 'flex-start',
      translateX: 0,
    });
  });

  it('chooses the auto candidate with the smaller shift when neither candidate fits', () => {
    expect(getDropdownLayout('auto', rect(-150, 100, 550, 20), rect(0, 0, 300, 100), 400, 600)).toMatchObject({
      alignSelf: 'flex-end',
      translateX: -16,
    });
  });

  it('chooses the vertical candidate with the smaller shift when neither side fits', () => {
    expect(getDropdownLayout('center', rect(350, 380, 100, 40), rect(0, 0, 200, 300), 800, 600)).toMatchObject({
      position: 'top',
      translateY: 0,
    });
  });

  it('prefers bottom when vertical candidates require the same shift', () => {
    expect(getDropdownLayout('center', rect(350, 280, 100, 40), rect(0, 0, 200, 400), 800, 600)).toMatchObject({
      position: 'bottom',
      translateY: -144,
    });
  });

  it('shifts the dropdown vertically inside the viewport after choosing a position', () => {
    expect(getDropdownLayout('start', rect(100, 500, 100, 40), rect(0, 0, 200, 500), 800, 600)).toMatchObject({
      position: 'top',
      translateY: 24,
    });
  });

  it('reports a completely hidden target as detached', () => {
    expect(getDropdownLayout('auto', rect(100, -40, 100, 40), rect(0, 0, 200, 100), 800, 600).targetDetached).toBe(
      true,
    );
  });

  it('does not report a partially visible target as detached', () => {
    expect(getDropdownLayout('auto', rect(100, -39, 100, 40), rect(0, 0, 200, 100), 800, 600).targetDetached).toBe(
      false,
    );
  });
});
