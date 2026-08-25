# @admiral-ds/admiral3-components

React-примитивы для дизайн-системы Admiral 3.0.

Пакет содержит базовые UI-блоки с публичным root entry point и модульной ESM-сборкой.

## Установка

```shell
npm install @admiral-ds/admiral3-components
```

Peer dependencies:

- `@admiral-ds/admiral3-icons`
- `@admiral-ds/admiral3-tokens`
- `react`
- `react-dom`
- `styled-components`

Если они ещё не установлены:

```shell
npm install @admiral-ds/admiral3-icons @admiral-ds/admiral3-tokens react react-dom styled-components
```

## Использование

### Root import

Импортируйте компоненты и типы из корня пакета:

```tsx
import { Badge, type BadgeProps } from '@admiral-ds/admiral3-components';

export function Demo() {
  return <Badge appearance="info">5</Badge>;
}
```

Root import рекомендуется для современных сборщиков с поддержкой ESM tree shaking, например Vite/Rollup, webpack 5,
esbuild и основанных на них фреймворков. Он предоставляет единый публичный API, а production-сборка исключает
неиспользуемые компоненты.

### Component subpath import

Компонент и его типы также доступны через явный публичный entrypoint:

```tsx
import { Badge, type BadgeProps } from '@admiral-ds/admiral3-components/badge';

export function Demo() {
  return <Badge appearance="info">5</Badge>;
}
```

Если ваш сборщик не поддерживает tree shaking через root import или вы не уверены в его настройках, используйте импорт
через публичный component subpath. Такой импорт явно выбирает entrypoint конкретного компонента и не зависит от обработки
root barrel потребительским сборщиком.

Названия component entrypoints записываются в kebab-case: например, `BadgeDot` импортируется из
`@admiral-ds/admiral3-components/badge-dot`.

Переиспользуемые публичные utilities компонента доступны из того же component entrypoint. Например:

```tsx
import { skeletonAnimationMixin } from '@admiral-ds/admiral3-components/skeleton';
```

Тему компонентов можно подключить двумя способами: через CSS custom properties из
`@admiral-ds/admiral3-tokens/css` или через `ThemeProvider` из `styled-components` с темой из
`@admiral-ds/admiral3-tokens`. CSS-токены удобны для переключения темы через атрибуты и CSS, а `ThemeProvider` — для
React-приложений, где тема управляется через контекст `styled-components`.

## Экспорт

Публичный root API и явные component entrypoints поддерживают tree shaking.

## Разработка

Правила разработки и workflow репозитория описаны отдельно:

- [Соглашения по внесению изменений](CONTRIBUTING.md)
- [Руководство по unit, e2e и визуальному тестированию](tests/TESTING_README.md)

## Лицензия

См. [LICENSE](LICENSE).
