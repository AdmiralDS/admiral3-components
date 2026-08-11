# Testing

## Общая информация

В проекте используются три контура тестирования:

1. `Vitest`

- используется для unit-тестов компонентов и утилит;
- unit-тесты должны лежать рядом с исходниками компонента.

2. `Playwright`

- используется для e2e и smoke-проверок через internal playground;
- e2e-тесты должны лежать в папке `tests/e2e`.

3. `Playwright visual snapshots`

- отслеживает изменения внешнего вида всех зарегистрированных playground-сценариев;
- запускается только в Chromium в Docker;
- visual-тесты и эталонные изображения хранятся в `tests/visual`.

## Обязательная структура тестов

Для каждого компонента должна существовать своя тестовая область.

Обязательные правила:

1. Unit-тесты компонента должны лежать в папке самого компонента.
2. E2E-тесты компонента должны лежать в отдельной папке внутри `tests/e2e`, названной по имени компонента.
3. Нельзя складывать e2e-спеки разных компонентов в корень `tests/e2e`.
4. Нельзя хранить тесты компонента в папке другого компонента.

Эталонная структура:

```text
src/components/BadgeDot/BadgeDot.test.tsx
src/components/BadgeDot/stories/BadgeDot.stories.tsx
src/components/BadgeDot/stories/BadgeDotPlayground.template.tsx
playground/scenarios/badge-dot.tsx
tests/e2e/BadgeDot/badge-dot.spec.ts
```

Для новых компонентов используйте эталонную структуру выше.

`npm run generate:component -- ComponentName` также создаёт
`playground/scenarios/visual/ComponentNameVisual.template.tsx` и регистрирует сценарий `visual/component-name`.
Сгенерированный default-вариант является только стартовой точкой: перед завершением компонента visual template нужно
расширить до матрицы всех поддерживаемых размеров, appearance и значимых состояний.

## Обязательная структура Storybook stories

Если компонент покрывается через Storybook, stories должны быть организованы по следующему правилу:

1. В папке компонента должна существовать папка `stories`.
2. В папке `stories` должен быть один входной CSF-файл `ComponentName.stories.tsx`.
3. Входной `*.stories.tsx` файл должен оставаться тонким: в нем должен находиться `meta` и экспорт историй.
4. Переиспользуемые `render`, `args`, template-конфиги и вспомогательные части stories должны выноситься в отдельные файлы внутри той же папки `stories`.
5. Дополнительные template-файлы не должны называться `*.stories.tsx`, чтобы Storybook не индексировал их как отдельные entry points.

Эталонный пример:

```text
src/components/BadgeDot/stories/BadgeDot.stories.tsx
src/components/BadgeDot/stories/BadgeDotPlayground.template.tsx
src/components/BadgeDot/stories/BadgeDotDirty.template.tsx
```

`*.template.tsx` могут использоваться по-разному:

- публичные templates могут импортироваться в `*.stories.tsx` и попадать в Storybook;
- внутренние templates могут не импортироваться в `*.stories.tsx` и использоваться только в internal playground для e2e.

Правила импортов для `*.template.tsx`:

1. Публичные компоненты, props и публичные типы в `*.stories.tsx` и `*.template.tsx` импортируются из `@admiral-ds/admiral3-primitives`.
2. Локальные импорты из папки компонента допустимы только для внутренних служебных сущностей, которые не нужны финальному пользователю библиотеки, например компонентных `constants`.
3. Template не должен импортировать публичные props напрямую из файла реализации компонента.

Структурные ожидания по компонентам проверяются командой:

```shell
npm run validate:components
```

Команда входит в `npm run check:full` и проверяет, что для компонента есть обязательные файлы, story entrypoint, root export и e2e-спека для добавленного playground-сценария.

Общие вспомогательные сущности для e2e должны храниться в shared-файлах внутри `tests/e2e`.

- `utils.ts` - для общих helper-функций;
- `constants.ts` - для общих констант.

Если для e2e-тестов понадобятся новые общие helper-функции или константы, их нужно добавлять в shared-файлы внутри `tests/e2e`, а не дублировать по компонентным папкам. Не добавляйте shared-файлы "на будущее": они должны появляться только при реальном переиспользовании.

## Установка браузеров для Playwright

```shell
npx playwright install --with-deps
```

Дополнительная информация есть в официальной документации:
https://playwright.dev/docs/browsers

## Запуск тестов

### Playwright

```shell
npm run test:e2e
```

Запуск в UI-режиме:

```shell
npm run test:e2e-ui
```

### Visual snapshots

Проверка текущего визуала по committed baseline:

```shell
npm run test:visual
```

Обновление baseline после подтвержденного изменения дизайна:

```shell
npm run test:visual:update
```

После прогона подробный список проверенных секций выводится в терминал, а HTML-report сохраняется в
`playwright-visual-report`. Открыть его локально можно командой:

```shell
npm run test:visual:report
```

Visual-тест снимает только playground-сценарии с явным флагом `visual`. Для каждого компонента такой сценарий использует
отдельный `*Visual.template.tsx` с матрицей размеров, appearance и значимых состояний. Обычные Storybook/playground
templates в snapshot-контур автоматически не попадают.

Локальные команды напрямую запускают Docker с `mcr.microsoft.com/playwright:v1.60.0-noble` и явно фиксируют платформу
`linux/amd64`; отдельный CI job использует тот же image и архитектуру. `node_modules` монтируется отдельным анонимным
volume и не меняет локальные зависимости. Поэтому committed baseline создается в одинаковом Linux Chromium независимо
от ОС и архитектуры компьютера разработчика. Перед обновлением baseline нужно вручную просмотреть изменившиеся
изображения. В CI тот же HTML-report загружается как artifact
`playwright-visual-report`.

Visual template должен напрямую рендерить компонент и строить собственную матрицу всех конечных размеров, preset
appearance/colorMode и значимых состояний. Нельзя собирать visual template из существующих Storybook templates. Для
произвольных CSS-значений достаточно отдельного representative custom-варианта.

Для воспроизводимости зафиксированы viewport `1440x900` и reduced motion. В каждом visual-сценарии Playwright снимает
отдельно каждый ряд `VisualSamples` во всех theme modes, доступных в playground (`light`, `dark`, `lightNeutral`,
`darkNeutral`); небольшая custom-секция без ряда снимается целиком. Снимки сравниваются пиксель в пиксель без допуска.
На время снимка Playwright также отключает CSS-анимации и скрывает caret.

### Vitest

Одноразовый прогон:

```shell
npm run test:run
```

Режим наблюдения:

```shell
npm run test:watch
```

Дополнительно доступна явная команда:

```shell
npm run test
```

`npm run test` сейчас также запускает одноразовый `vitest run`; для читаемости в документации и CI
предпочтительнее использовать явную команду `npm run test:run`.

## Workers

Количество workers для Playwright можно настроить через переменную `PW_WORKERS` в `.env` в корне проекта.

Пример:

```dotenv
PW_WORKERS='3'
```

По умолчанию используется `1`.

## Подход к e2e через internal playground

Для e2e используется отдельный internal playground:

1. Пакет собирается через `npm run build`, чтобы проверить published-like React entrypoint и декларации типов.
2. Playground собирается через `npm run playground:build`.
3. Готовая сборка поднимается статически через `npm run playground:serve`.
4. Playwright ходит в сценарии playground по query-параметру `scenario`.

Storybook при этом остаётся витриной компонентов, docs-слоем и местом для a11y-проверок, но не рантаймом для e2e.

E2E-проверки должны покрывать только browser/runtime контракты, которые плохо проверяются unit-тестами:

1. компоненты монтируются из consumer-like сценариев без runtime errors;
2. компоненты корректно работают с темой из `styled-components` `ThemeProvider`;
3. переключение тем меняет computed styles, а не только текст или атрибуты;
4. ключевые playground-сценарии монтируются без runtime errors;
5. интерактивные состояния компонента доступны через реальные browser-события.

### Как добавлять сценарии в playground

Структура сценариев в `playground/scenarios` разделена по компонентам.
Playground не является полной копией Storybook: добавляйте сюда только те templates и сценарии, которые нужно покрывать через e2e или использовать для browser/runtime integration checks.

Текущий паттерн:

```text
playground/scenarios/
  badge-dot.tsx
  index.ts
```

Правила:

1. Для каждого компонента или группы связанных сценариев нужно заводить отдельный файл в `playground/scenarios`.
2. `playground/scenarios/index.ts` должен оставаться реестром и только собирать общий массив `playgroundScenarios`.
3. В файл сценариев нужно импортировать нужные templates и описывать массив сценариев компонента.
4. `id` сценария должен быть уникальным и стабильным, потому что именно он используется в `?scenario=...` и в Playwright-тестах.
5. `title` сценария используется в левом меню playground.

Пример:

```tsx
export const badgeDotScenarios: PlaygroundScenario[] = [
  {
    id: 'badge-dot/default',
    title: 'BadgeDot Default',
    render: () => <BadgeDotPlaygroundTemplate {...defaultArgs} />,
  },
];
```

После добавления нового сценария нужно:

1. Подключить файл сценариев в `playground/scenarios/index.ts`.
2. Добавить или обновить e2e-спеку в `tests/e2e/...`.

Если новый Storybook template не требует e2e-покрытия, добавлять его в playground не нужно.

## Рекомендации

Каждый тест должен быть независимым:

1. Не зависеть от порядка выполнения.
2. Не делить состояние с другими тестами.
3. Самостоятельно подготавливать нужные данные.
4. Не опираться на побочные эффекты других сценариев.

Каждый тест должен проверять одну конкретную вещь:

1. Если тест падает, должно быть сразу понятно, что сломалось.
2. Не стоит объединять в один сценарий много разных проверок без необходимости.

## Вспомогательные функции

Общие helper-функции для e2e находятся в `tests/e2e/utils.ts`.

Описание назначения и правил использования helper-функций должно поддерживаться в документации прямо рядом с их реализацией, в самом файле `utils.ts`.

## Константы

Общие константы для e2e находятся в `tests/e2e/constants.ts`.

Описание констант должно поддерживаться в документации прямо рядом с их объявлениями, в самом файле `constants.ts`.

Перед добавлением новых констант стоит проверять, что они действительно используются текущими тестами, а не добавляются "на будущее".
