# PROJECT-MAP.md

Документ описывает структуру репозитория `@admiral-ds/admiral3-primitives` и назначение файлов, которые видит Git.

Перечень файлов ниже построен по команде:

```bash
git ls-files --cached --others --exclude-standard
```

Это значит, что в карту включены уже отслеживаемые файлы и новые неигнорируемые файлы, которые сейчас могут попасть в коммит. Локальные служебные файлы, build output, `node_modules`, отчеты тестов и другие игнорируемые артефакты здесь не описываются.

Template-файлы для Storybook и playground в этом документе учитываются как файлы-примеры. Их внутренняя разметка и демонстрационная логика не разбираются подробно, потому что они не являются source of truth для публичного API компонента или конфигурации пакета.

## Назначение проекта

Репозиторий содержит пакет React-примитивов для дизайн-системы Admiral 3.0.

Пакет отвечает за:

- экспорт базовых UI-компонентов через root API и явные component entrypoints;
- использование дизайн-токенов из `@admiral-ds/admiral3-tokens` для тем, типографики, цветов и радиусов;
- работу компонентов от CSS custom properties из `@admiral-ds/admiral3-tokens/css` без обязательного `styled-components` `ThemeProvider`;
- демонстрацию компонентов через Storybook;
- internal playground для ручных и e2e проверок browser/runtime сценариев;
- unit/e2e проверки контрактов компонентов, публичного entrypoint и playground-сценариев.

## Верхнеуровневая структура

```text
.
├── .github/workflows/        # GitHub Actions для проверок, GitHub Pages и npm publish
├── .storybook/               # Конфигурация Storybook и синхронизация тем
├── bundle-size-baseline.json # Committed baseline размеров component bundles
├── playground/               # Internal playground для ручных и e2e проверок
├── scripts/                  # Node scripts для проектной автоматизации
├── src/                      # Исходный код публичного API, компонентов и тестовых настроек
│   ├── components/           # Компоненты библиотеки
│   │   └── _internal/        # Общие внутренние styled-примитивы компонентов
│   ├── test/                 # Vitest setup
│   ├── theme/                # Helpers для CSS token fallback
│   └── utils/                # Внутренние переиспользуемые TypeScript-утилиты
├── tests/                    # E2E-тесты Playwright и документация по тестам
├── package.json              # npm package manifest, exports, scripts, dependencies
├── vite.config.ts            # Vite library build
├── vite.playground.config.ts # Vite build/dev config для playground
├── vitest.config.ts          # Vitest config
├── playwright.config.ts      # Playwright config
└── tsconfig*.json            # TypeScript project references и scoped configs
```

## Ключевые потоки данных

### TypeScript API

`src/index.ts` является root entrypoint пакета. Сейчас он реэкспортирует компонентные barrels из `src/components`.

Основной поток:

```text
src/components/* component source
  -> src/index.ts + component barrels
  -> dist/index.js + dist/components/<ComponentName>/index.js
  -> matching declaration entrypoints
```

`package.json#exports` содержит root API, `package.json` и явные kebab-case component subpaths. Wildcard exports не
используются, поэтому внутренние styles, constants, tests и stories не являются публичным API. Переиспользуемые mixins
могут экспортироваться явно из component barrel как часть поддерживаемого API.

### CSS theme integration

Компоненты должны читать визуальные значения из CSS custom properties tokens package. Для одиночных визуальных токенов используется bridge-паттерн `var(--token, ${p.theme...})`: CSS custom property является основным источником, а `styled-components` theme object служит fallback, если CSS-токены не подключены. Это позволяет потребителям подключать CSS-токены и переключать тему через `data-admiral-theme` без обязательного `styled-components` `ThemeProvider`.

Основной поток:

```text
@admiral-ds/admiral3-tokens/css
  -> CSS custom properties
  -> component styles
```

`styled-components` сейчас используется как способ описания component styles, но не должен быть обязательным источником темы для потребителя. Typography может использовать TypeScript API токенов там, где значение не зависит от runtime theme и является набором связанных одиночных токенов.

### Storybook и playground

Storybook использует `src/**/*.stories.tsx`, а playground использует сценарии из `playground/scenarios`.

Общее правило проекта: Storybook не нужно зеркалить в playground целиком. Playground-сценарии добавляются для тех примеров и edge cases, которые осмысленно покрывать через e2e или проверять как browser/runtime integration.

Storybook и playground импортируют пакет через alias `@admiral-ds/admiral3-primitives`, который указывает на `src/index.ts`. Это сохраняет consumer-like импорт и при этом позволяет работать с исходниками в dev-режиме.

## Файлы в корне

- `.env.example` - пример переменных окружения для локальных запусков. Сейчас используется как безопасный шаблон, который можно держать в Git, в отличие от реального `.env`.
- `.gitignore` - список локальных файлов, build outputs, зависимостей и отчетов, которые не должны попадать в Git.
- `.prettierignore` - исключения для Prettier, чтобы форматтер не обходил generated/build artifacts и другие нерелевантные директории.
- `.prettierrc` - конфигурация Prettier, задает единый формат кода и markdown.
- `CONTRIBUTING.md` - краткий стартовый чек-лист и обязательные правила внесения изменений: commit style, проверки перед PR, release flow, accessibility, порядок добавления новых компонентов, Storybook/playground/e2e правила.
- `generate-react-cli.json` - конфигурация `generate-react-cli` для scaffolding primitive-компонентов по локальным templates.
- `LICENSE` - лицензионный файл пакета.
- `bundle-size-baseline.json` - автоматически пересчитываемый committed baseline raw/gzip размеров публичных component
  subpaths; существенным считается одновременный рост gzip более чем на 10% и более чем на 1 KiB.
- `PROJECT-MAP.md` - текущая карта структуры проекта и назначений файлов.
- `README.md` - пользовательская документация пакета: установка, peer dependencies, выбор между root import и публичным component subpath import и ссылки на contributor/test docs. README не перечисляет все компоненты пакета.
- `eslint.config.js` - flat config ESLint. Подключает TypeScript, import rules, React hooks, React Refresh, Storybook, Prettier и задает правила сортировки импортов, запрет `any`, циклов и дублей импортов.
- `package-lock.json` - lockfile npm. Фиксирует точные версии зависимостей и должен меняться только вместе с изменениями зависимостей или npm metadata.
- `package.json` - manifest npm-пакета. Описывает root/component `exports`, публикуемые файлы, side effects, scripts, peer/dev dependencies, repository metadata и publish config.
- `playwright.config.ts` - конфигурация e2e тестов Playwright. Указывает `tests/e2e`, базовый URL playground, браузерные проекты, timeout, reporter и webServer `npm run playground:serve`.
- `scripts/check-full.mjs` - последовательно запускает все проверки из `check:full`, останавливается на первой ошибке и выводит общую длительность прогона.
- `scripts/generate-react-component.mjs` - обвязка над `generate-react-cli`, которая создает component/story/playground/e2e scaffolding и обновляет root export, component subpath и playground aggregator.
- `scripts/test-tree-shaking.mjs` - consumer integration check, который создаёт и устанавливает npm tarball в изолированный
  consumer project, проверяет TypeScript resolution всех component subpaths и сравнивает Rollup module graphs
  root/component imports; TypeScript parser читает публичные component barrels, после чего один consumer fixture проверяет
  все найденные value/type exports, перед итоговой таблицей печатается общий список модулей совпавших сборок или оба списка
  при расхождении, выводится standalone raw/gzip размер каждого публичного component subpath без peer dependencies,
  обновляется `bundle-size-baseline.json`, проверяется существенная регрессия gzip и напоминается вручную проверить состав
  графов.
- `scripts/validate-components.mjs` - проверка структуры компонентов, root barrels и полного соответствия явных component subpaths реальным component directories.
- `scripts/validate-package.mjs` - проверка состава npm tarball, существования всех публичных export targets и их
  присутствия в tarball без абсолютных size limits.
- `scripts/templates/generate-react-component/*` - templates для `generate-react-cli`, из которых создаются source-файлы компонента, локальный barrel, constants/types/style, unit test и Storybook playground template.
- `tsconfig.json` - корневой TypeScript build config с project references на scoped configs.
- `tsconfig.lib.json` - TypeScript config для библиотечных declaration outputs. Используется в `npm run build` для генерации `.d.ts`.
- `tsconfig.node.json` - TypeScript config для Node-side файлов: Vite/Vitest/Playwright configs.
- `tsconfig.playground.json` - TypeScript config для internal playground.
- `tsconfig.storybook.json` - TypeScript config для Storybook и story files.
- `tsconfig.test.json` - TypeScript config для unit/e2e тестового контура.
- `vite.config.ts` - Vite multi-entry library build. Автоматически добавляет component barrels, сохраняет стабильные entry
  filenames, выносит общую реализацию в chunks и оставляет все peer dependencies вместе с их subpaths external на основе
  `package.json`.
- `vite.playground.config.ts` - Vite config для playground. Задает root `playground`, React/SVGR plugins, aliases на source API и output `dist-playground`.
- `vitest.config.ts` - Vitest config. Настраивает React/SVGR plugins, aliases, `jsdom`, setup file, include/exclude patterns и coverage reporter.

## GitHub Actions

- `.github/dependabot.yml` - настройки Dependabot для npm-зависимостей и GitHub Actions.
- `.github/workflows/build.yml` - CI workflow для pull request/main проверок. Ставит зависимости, запускает `check:full`, собирает Storybook artifact и деплоит GitHub Pages из `main`.
- `.github/workflows/npm_release.yaml` - release workflow для публикации в npm после GitHub Release или ручного запуска. Повторно прогоняет `check:full`, build, `npm pack --dry-run` и публикует пакет при успешной верификации.

## Storybook

- `.storybook/DocsThemeContainer.tsx` - custom docs container. Синхронизирует тему docs со Storybook global `theme`, поддерживает `system`, `light`, `dark`, `lightNeutral`, `darkNeutral` и резолвит внешнюю тему Storybook docs в простой `light`/`dark`.
- `.storybook/css-imports.d.ts` - TypeScript declarations для CSS import subpaths в storybook-конфигурации.
- `.storybook/main.ts` - основная конфигурация Storybook. Ищет `src/**/*.stories.*`, подключает docs/a11y addons, React Vite framework, react-docgen TypeScript и Vite aliases для root entrypoint пакета.
- `.storybook/manager.ts` - manager-side настройки Storybook UI. Синхронизирует внешний manager theme с выбранной Admiral theme через простой `light`/`dark` shell.
- `.storybook/preview.css` - глобальные стили preview iframe: базовый font-family, color-scheme, фон и цвет для light/dark Storybook shell.
- `.storybook/preview.tsx` - preview config. Добавляет decorators, `ThemeProvider`, fonts из tokens package, переключатель темы, a11y strict mode, fullscreen layout и docs container.
- `.storybook/storybookThemes.ts` - общий helper для Storybook theme toolbar: валидирует Admiral theme modes и мапит `lightNeutral`/`darkNeutral` на простую внешнюю оболочку `light`/`dark`.

## Playground

- `playground/css-imports.d.ts` - TypeScript declarations для импортов CSS subpaths tokens package в playground.
- `playground/index.html` - HTML entrypoint Vite playground.
- `playground/main.tsx` - React entrypoint playground. Монтирует приложение, подключает CSS tokens, font helpers, сценарии, общий `ThemeProvider`, переключатель theme mode и navigation по `?scenario=...`.
- `playground/styles.css` - глобальные стили playground: layout, header, sidebar navigation, preview area и базовые визуальные состояния на generated CSS token variables.

### Playground scenarios

- `playground/scenarios/*.tsx` - component-level playground сценарии для ручных и e2e browser/runtime проверок. Конкретные сценарии компонентов здесь не расписываются.
- `playground/scenarios/index.ts` - агрегатор playground scenarios. Держит список сценариев в одном entrypoint для `playground/main.tsx`.

## npm scripts

- `check:fix` - автоисправление форматирования и ESLint.
- `check:full` - полный обязательный локальный прогон: format, lint, structure, types, unit/e2e, consumer bundle и package checks; в конце выводит общую длительность.
- `generate:component` - scaffolding нового компонента: `npm run generate:component -- ComponentName`; при запуске без аргумента в интерактивном терминале спрашивает имя компонента.
- `validate:components` - проверка структуры всех компонентов в `src/components` и публичного root API.
- `storybook` - запуск Storybook из исходников.
- `playground` - запуск Vite playground с hot reload.
- `release` - подготовка версии и changelog через `standard-version`.
- `build`, `storybook:build`, `playground:build`, `playground:serve`, `pack:check`, `test:*`, `lint:*`, `format:*`, `typecheck`, `dev` - служебные команды для CI, e2e, разработки, проверки publish-состава npm-пакета и составных потоков.

## Source root

- `src/index.ts` - root public API. Реэкспортирует публичные component barrels; наружу попадают компоненты, props и публичные типы, но не внутренние constants, style helpers и styled props.
- `src/theme/cssToken.ts` - helper для CSS custom property с fallback на значение из `styled-components` theme.
- `src/utils/refSetter.ts` - внутренняя утилита для синхронизации нескольких object/callback refs с одним DOM-элементом.
- `src/utils/refSetter.test.ts` - unit-тесты синхронизации и очистки refs.
- `src/components/stories/StoryContainers.tsx` - внутренние shared helpers для story templates и playground-сценариев: общий demo canvas, dirty/e2e container и demo description. Не является публичным API библиотеки.
- `src/vite-env.d.ts` - Vite ambient declarations для TypeScript.

## Components

- `src/components/<ComponentName>/` - папка отдельного primitive-компонента. Обычно содержит implementation, публичный barrel, типы, constants, styles, unit tests и Storybook templates/stories.
- `src/components/<ComponentName>/index.ts` - локальный публичный barrel компонента. Через него экспортируются сам компонент, props и публичные типы.
- Реализации компонентов задают дефолтные DOM- и accessibility-атрибуты до spread пользовательских props; после spread
  остаются только обязательные внутренние props, защищающие контракт компонента.
- Disabled-состояния интерактивных компонентов используют `cursor: not-allowed` на всей интерактивной области.
- Boolean `data-*`-состояния представлены маркерами: атрибут присутствует только в активном состоянии, а CSS использует
  селектор по наличию.
- `src/components/<ComponentName>/stories/` - Storybook CSF и render templates компонента. Templates могут переиспользоваться в playground, но их внутренняя демонстрационная разметка здесь не разбирается.
- `src/components/stories/` - shared helpers для story templates и playground-сценариев. Не является публичным API библиотеки.
- `src/components/HelperComponents/` - публичные вспомогательные компоненты для внешней композиции, включая
  `SelectionControlInformer` и `SelectionControlLayout`.
- `src/components/_internal/InputAtoms/` - внутренняя layout-композиция и общие размерные параметры полей выбора. Не
  экспортируется из публичного API библиотеки.

## Test setup

- `src/test/setup.ts` - setup file для Vitest. Подключает `@testing-library/jest-dom` matchers.

## Tests

- `tests/TESTING_README.md` - документация по тестовой структуре: unit рядом с компонентом, e2e в `tests/e2e`, правила Storybook templates, playground-сценариев, shared helpers и Playwright workers.
- `tests/e2e/constants.ts` - общие константы e2e: таймауты, задержки и платформенно-зависимый undo shortcut.
- `tests/e2e/utils.ts` - общие helper-функции e2e: генерация playground scenario path, resolve CSS color token в текущей playground theme и click helper с паузой.
- `tests/e2e/<ComponentName>/*.spec.ts` - component-level Playwright e2e проверки playground-сценариев. Конкретные сценарии компонентов здесь не расписываются.
