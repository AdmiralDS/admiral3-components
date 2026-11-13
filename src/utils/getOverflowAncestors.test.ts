import { describe, expect, it } from 'vitest';

import { getOverflowAncestors } from './getOverflowAncestors';

describe('getOverflowAncestors', () => {
  it('returns overflow ancestors from nearest to farthest and window last', () => {
    const outerOverflowAncestor = document.createElement('div');
    const regularAncestor = document.createElement('div');
    const innerOverflowAncestor = document.createElement('div');
    const element = document.createElement('div');

    outerOverflowAncestor.style.overflow = 'hidden';
    innerOverflowAncestor.style.overflowY = 'auto';
    outerOverflowAncestor.append(regularAncestor);
    regularAncestor.append(innerOverflowAncestor);
    innerOverflowAncestor.append(element);
    document.body.append(outerOverflowAncestor);

    expect(getOverflowAncestors(element)).toEqual([innerOverflowAncestor, outerOverflowAncestor, window]);

    outerOverflowAncestor.remove();
  });

  it.each(['auto', 'scroll', 'overlay', 'hidden', 'clip'])('recognizes overflow: %s', (overflow) => {
    const ancestor = document.createElement('div');
    const element = document.createElement('div');

    ancestor.style.overflow = overflow;
    ancestor.append(element);

    expect(getOverflowAncestors(element)).toEqual([ancestor, window]);
  });

  it('returns only window when the element has no overflow ancestors', () => {
    const ancestor = document.createElement('div');
    const element = document.createElement('div');
    ancestor.append(element);

    expect(getOverflowAncestors(element)).toEqual([window]);
  });

  it('returns an empty array when the owner document has no window', () => {
    const detachedDocument = document.implementation.createHTMLDocument();
    const element = detachedDocument.createElement('div');

    expect(getOverflowAncestors(element)).toEqual([]);
  });
});
