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
      <button style="display: none">Display none</button>
      <div style="display: none"><button>Display none subtree</button></div>
      <button style="visibility: hidden">Visibility hidden</button>
      <div style="visibility: hidden"><button>Visibility hidden subtree</button></div>
      <div style="visibility: hidden"><button id="visible-override" style="visibility: visible">Visible override</button></div>
    `;

    expect(getTabbableElements(document).map((element) => element.id)).toEqual([
      'link',
      'button',
      'custom',
      'visible-override',
    ]);
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

  it('excludes a floating subtree when it searches for the next tabbable element', () => {
    const trigger = document.createElement('button');
    const floating = document.createElement('div');
    const floatingButton = document.createElement('button');
    const next = document.createElement('button');
    floating.append(floatingButton);
    document.body.append(trigger, floating, next);

    expect(getNextTabbableElement(trigger)).toBe(floatingButton);
    expect(getNextTabbableElement(trigger, floating)).toBe(next);
  });

  it('returns no next element when only the excluded floating subtree follows the supplied element', () => {
    const trigger = document.createElement('button');
    const floating = document.createElement('div');
    floating.append(document.createElement('button'));
    document.body.append(trigger, floating);

    expect(getNextTabbableElement(trigger, floating)).toBeUndefined();
  });
});
