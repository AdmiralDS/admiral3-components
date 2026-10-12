import { afterEach, describe, expect, it } from 'vitest';

import { getNextTabbableElement, getTabbableElements } from './tabbableElements';

describe('tabbableElements', () => {
  afterEach(() => document.body.replaceChildren());

  it('returns only elements available through sequential keyboard navigation', () => {
    document.body.innerHTML = `
      <a>Link without href</a>
      <a href="#target" id="link">Link</a>
      <input type="hidden" />
      <button id="button">Button</button>
      <button disabled>Disabled</button>
      <div tabindex="0" id="custom">Custom control</div>
      <div tabindex="-1">Programmatically focusable</div>
      <div hidden><button>Hidden subtree</button></div>
      <div inert><button>Inert subtree</button></div>
    `;

    expect(getTabbableElements(document).map((element) => element.id)).toEqual(['link', 'button', 'custom']);
  });

  it('returns the next tabbable element after the supplied element', () => {
    const trigger = document.createElement('button');
    const skipped = document.createElement('button');
    const next = document.createElement('button');
    skipped.disabled = true;
    document.body.append(trigger, skipped, next);

    expect(getNextTabbableElement(trigger)).toBe(next);
    expect(getNextTabbableElement(next)).toBeUndefined();
  });
});
