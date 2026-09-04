import type { ReactNode } from 'react';

/** Checks whether an optional ReactNode slot has content that should participate in layout. */
export function hasSlotContent(content: ReactNode): boolean {
  return content !== null && content !== undefined && typeof content !== 'boolean' && content !== '';
}
