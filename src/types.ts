import type { CSSProperties } from 'react';

import type { css } from 'styled-components';

/** Способы пользовательской стилизации элемента компонента. */
export interface ComponentStyleConfig {
  /** CSS-класс элемента. */
  className?: string;
  /** Inline-стили элемента. */
  style?: CSSProperties;
  /** CSS-миксин, созданный с помощью styled-components. */
  cssMixin?: ReturnType<typeof css>;
}
