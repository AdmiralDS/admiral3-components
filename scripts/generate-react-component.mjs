#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { createInterface } from 'node:readline/promises';
import { fileURLToPath } from 'node:url';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..');

/**
 * Печатает краткую справку по запуску генератора.
 */
const showUsage = () => {
  console.log('Usage: npm run generate:component -- ComponentName');
};

/**
 * Получает имя компонента из аргумента CLI или запрашивает его в интерактивном терминале.
 *
 * Если скрипт запущен не из TTY и аргумента нет, возвращает пустую строку,
 * чтобы основной поток мог показать usage и завершиться с ошибкой.
 */
const getComponentName = async () => {
  const componentNameArgument = process.argv[2];

  if (componentNameArgument) {
    return componentNameArgument;
  }

  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    return '';
  }

  const prompt = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    return (await prompt.question('Component name in PascalCase: ')).trim();
  } finally {
    prompt.close();
  }
};

const componentName = await getComponentName();

if (componentName === '--help' || componentName === '-h') {
  showUsage();
  process.exit(0);
}

if (!componentName) {
  showUsage();
  process.exit(1);
}

if (!/^[A-Z][A-Za-z0-9]*$/.test(componentName)) {
  console.error('Component name must be PascalCase, for example BadgeDot.');
  process.exit(1);
}

/**
 * Переводит PascalCase-имя компонента в kebab-case для файлов playground/e2e и scenario id.
 */
const toKebabCase = (value) =>
  value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();

/**
 * Переводит PascalCase-имя компонента в camelCase для именования runtime-переменных.
 */
const toCamelCase = (value) => value.charAt(0).toLowerCase() + value.slice(1);

const componentKebabName = toKebabCase(componentName);
const componentCamelName = toCamelCase(componentName);
const testId = componentKebabName;
const componentDir = join(rootDir, 'src', 'components', componentName);
const storiesDir = join(componentDir, 'stories');
const storySourcePath = join(componentDir, `${componentName}.stories.tsx`);
const playgroundTemplateSourcePath = join(componentDir, `${componentName}Playground.template.tsx`);
const storyTargetPath = join(storiesDir, `${componentName}.stories.tsx`);
const playgroundTemplateTargetPath = join(storiesDir, `${componentName}Playground.template.tsx`);
const playgroundScenarioPath = join(rootDir, 'playground', 'scenarios', `${componentKebabName}.tsx`);
const visualTemplatePath = join(rootDir, 'playground', 'scenarios', 'visual', `${componentName}Visual.template.tsx`);
const e2eDir = join(rootDir, 'tests', 'e2e', componentName);
const e2eSpecPath = join(e2eDir, `${componentKebabName}.spec.ts`);

const filesToProtect = [
  componentDir,
  playgroundScenarioPath,
  e2eSpecPath,
  storyTargetPath,
  playgroundTemplateTargetPath,
  visualTemplatePath,
];

// До запуска генератора проверяем все пути, которые могут быть перезаписаны.
const existingPaths = filesToProtect.filter((filePath) => existsSync(filePath));

if (existingPaths.length > 0) {
  console.error('Generation stopped because these paths already exist:');
  for (const filePath of existingPaths) {
    console.error(`- ${filePath}`);
  }
  process.exit(1);
}

// Основную структуру компонента создаёт generate-react-cli по локальным templates.
const generateReactBin = join(rootDir, 'node_modules', 'generate-react-cli', 'bin', 'generate-react.js');
const generateResult = spawnSync(process.execPath, [generateReactBin, 'component', componentName, '--type=primitive'], {
  cwd: rootDir,
  stdio: 'inherit',
});

if (generateResult.status !== 0) {
  process.exit(generateResult.status ?? 1);
}

mkdirSync(storiesDir, { recursive: true });
renameSync(storySourcePath, storyTargetPath);
renameSync(playgroundTemplateSourcePath, playgroundTemplateTargetPath);

/**
 * Читает файл относительно корня проекта.
 */
const readProjectFile = (filePath) => readFileSync(join(rootDir, filePath), 'utf8');

/**
 * Записывает файл относительно корня проекта.
 */
const writeProjectFile = (filePath, content) => writeFileSync(join(rootDir, filePath), content, 'utf8');

/**
 * Удаляет технический `@ts-nocheck`, который generate-react-cli добавляет в файлы из templates.
 */
const stripTemplateTsNoCheck = (filePath) => {
  const content = readFileSync(filePath, 'utf8');
  writeFileSync(filePath, content.replace(/^\/\/ @ts-nocheck\n/, ''), 'utf8');
};

stripTemplateTsNoCheck(storyTargetPath);
stripTemplateTsNoCheck(playgroundTemplateTargetPath);

/** Добавляет root export и сохраняет component exports в алфавитном порядке. */
const addSortedComponentExport = (content, exportLine) => {
  const lines = content.trimEnd().split('\n');

  if (!lines.includes(exportLine)) {
    lines.push(exportLine);
  }

  const exportIndexes = lines
    .map((line, index) => (/^export \* from '\.\/components\/[A-Z][A-Za-z0-9]*';$/.test(line) ? index : -1))
    .filter((index) => index >= 0);
  const sortedExports = exportIndexes.map((index) => lines[index]).sort((first, second) => first.localeCompare(second));

  exportIndexes.forEach((lineIndex, index) => {
    lines[lineIndex] = sortedExports[index];
  });

  return `${lines.join('\n')}\n`;
};

/** Добавляет visual scenario id и сортирует manifest по имени ключа. */
const addSortedVisualScenarioId = (content, propertyLine) => {
  const lines = content.trimEnd().split('\n');
  const closingIndex = lines.findIndex((line) => line === '} as const;');

  if (closingIndex < 0) {
    throw new Error('Cannot find VISUAL_SCENARIO_IDS closing line');
  }

  if (!lines.includes(propertyLine)) {
    lines.splice(closingIndex, 0, propertyLine);
  }

  const propertyIndexes = lines
    .map((line, index) => (/^ {2}[A-Za-z][A-Za-z0-9]*: 'visual\/[a-z0-9-]+',$/.test(line) ? index : -1))
    .filter((index) => index >= 0);
  const sortedProperties = propertyIndexes
    .map((index) => lines[index])
    .sort((first, second) => first.localeCompare(second));

  propertyIndexes.forEach((lineIndex, index) => {
    lines[lineIndex] = sortedProperties[index];
  });

  return `${lines.join('\n')}\n`;
};

/**
 * Подключает новый playground-сценарий к общему списку сценариев.
 *
 * Функция отдельно добавляет import и расширяет массив `playgroundScenarios`,
 * чтобы сгенерированный компонент сразу был доступен в playground.
 */
const addPlaygroundScenarioToIndex = () => {
  const indexPath = 'playground/scenarios/index.ts';
  const scenarioIdentifier = `${componentCamelName}Scenarios`;
  const importLine = `import { ${scenarioIdentifier} } from './${componentKebabName}';`;
  const content = readProjectFile(indexPath);

  if (content.includes(importLine) || content.includes(scenarioIdentifier)) {
    return;
  }

  const lines = content.split('\n');
  const lastImportIndex = lines.findLastIndex((line) => line.startsWith('import '));
  lines.splice(lastImportIndex + 1, 0, importLine);

  // Обычные component-сценарии сортируем по имени, а visual regression сценарии оставляем отдельной последней группой.
  const nextContent = lines
    .join('\n')
    .replace(/export const playgroundScenarios = \[(?<items>[\s\S]*?)\];/, (_match, items) => {
      const scenarioLines = items
        .trim()
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);
      const visualScenarioLine = scenarioLines.find((line) => line === '...visualScenarios,');
      const componentScenarioLines = [
        ...scenarioLines.filter((line) => line !== visualScenarioLine),
        `...${scenarioIdentifier},`,
      ]
        .sort((first, second) => {
          const firstComponentName = first.slice(3, -'Scenarios,'.length);
          const secondComponentName = second.slice(3, -'Scenarios,'.length);

          return firstComponentName.localeCompare(secondComponentName);
        })
        .map((line) => `  ${line}`);

      if (visualScenarioLine) {
        componentScenarioLines.push(`  ${visualScenarioLine}`);
      }

      return `export const playgroundScenarios = [\n${componentScenarioLines.join('\n')}\n];`;
    });

  writeProjectFile(indexPath, nextContent);
};

/** Подключает visual template компонента к списку Chromium snapshot-сценариев. */
const addVisualScenarioToIndex = () => {
  const indexPath = 'playground/scenarios/visual/index.tsx';
  const manifestPath = 'playground/scenarios/visual/manifest.ts';
  const templateIdentifier = `${componentName}VisualTemplate`;
  const importLine = `import { ${templateIdentifier} } from './${componentName}Visual.template';`;
  const scenarioLine = `  { id: VISUAL_SCENARIO_IDS.${componentCamelName}, title: 'Visual / ${componentName}', visual: true, render: () => <${templateIdentifier} /> },`;
  const content = readProjectFile(indexPath);

  if (content.includes(importLine) || content.includes(`VISUAL_SCENARIO_IDS.${componentCamelName}`)) {
    return;
  }

  const lines = content.split('\n');
  const lastImportIndex = lines.findLastIndex((line) => line.startsWith('import '));
  lines.splice(lastImportIndex + 1, 0, importLine);

  const visualScenariosStart = lines.findIndex((line) => line.startsWith('export const visualScenarios'));
  const visualScenariosEnd = lines.findIndex((line, index) => index > visualScenariosStart && line === '];');

  if (visualScenariosStart < 0 || visualScenariosEnd < 0) {
    throw new Error(`Cannot find visualScenarios in ${indexPath}`);
  }

  lines.splice(visualScenariosEnd, 0, scenarioLine);
  writeProjectFile(indexPath, lines.join('\n'));

  const manifestContent = readProjectFile(manifestPath);
  const manifestLine = `  ${componentCamelName}: 'visual/${componentKebabName}',`;

  writeProjectFile(manifestPath, addSortedVisualScenarioId(manifestContent, manifestLine));
};

/** Добавляет явный публичный subpath компонента в package exports. */
const addComponentPackageExport = () => {
  const packageJsonPath = join(rootDir, 'package.json');
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
  const componentExportKey = `./${componentKebabName}`;

  packageJson.exports[componentExportKey] = {
    types: `./dist/components/${componentName}/index.d.ts`,
    import: `./dist/components/${componentName}/index.js`,
  };

  packageJson.exports = Object.fromEntries([
    ['.', packageJson.exports['.']],
    ['./package.json', packageJson.exports['./package.json']],
    ...Object.entries(packageJson.exports)
      .filter(([exportKey]) => exportKey !== '.' && exportKey !== './package.json')
      .sort(([firstKey], [secondKey]) => firstKey.localeCompare(secondKey)),
  ]);

  writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`, 'utf8');
};

// Создаём consumer-like playground scenario для первичной ручной и e2e-проверки компонента.
mkdirSync(dirname(playgroundScenarioPath), { recursive: true });
writeFileSync(
  playgroundScenarioPath,
  `import type { PlaygroundScenario } from './index';
import type { ${componentName}Props } from '../../src/components/${componentName}';
import { ${componentName}PlaygroundTemplate } from '../../src/components/${componentName}/stories/${componentName}Playground.template';

const defaultArgs: ${componentName}Props = {
  children: '${componentName}',
};

export const ${componentCamelName}Scenarios: PlaygroundScenario[] = [
  {
    id: '${componentKebabName}/default',
    title: '${componentName} Default',
    render: () => <${componentName}PlaygroundTemplate {...defaultArgs} data-testid="${testId}" />,
  },
];
`,
  'utf8',
);

// Создаём отдельный template для visual regression сразу в матричной структуре. После уточнения API компонента
// списки вариантов и состояний нужно расширить всеми размерами, appearance и значимыми состояниями.
writeFileSync(
  visualTemplatePath,
  `import type { ComponentProps } from 'react';

import { ${componentName} } from '@admiral-ds/admiral3-primitives';

import {
  VisualGroup,
  VisualGroups,
  VisualGroupTitle,
  VisualLabel,
  VisualLayout,
  VisualSample,
  VisualSamples,
  VisualSection,
  VisualTitle,
} from './VisualLayout';

type VisualVariant = {
  label: string;
  props: ComponentProps<typeof ${componentName}>;
};

// Replace the starter entries with every supported size and appearance.
const VARIANTS: VisualVariant[] = [{ label: 'default', props: {} }];

// Add every visually distinct interactive and disabled state.
const STATES: VisualVariant[] = [{ label: 'default', props: {} }];

const renderMatrix = (items: VisualVariant[]) => (
  <VisualGroups>
    {items.map(({ label, props }) => (
      <VisualGroup key={label}>
        <VisualGroupTitle>{label}</VisualGroupTitle>
        <VisualSamples>
          <VisualSample>
            <VisualLabel>{label}</VisualLabel>
            <${componentName} {...props}>${componentName}</${componentName}>
          </VisualSample>
        </VisualSamples>
      </VisualGroup>
    ))}
  </VisualGroups>
);

export const ${componentName}VisualTemplate = () => (
  <VisualLayout>
    <VisualSection>
      <VisualTitle>Sizes and appearances</VisualTitle>
      {renderMatrix(VARIANTS)}
    </VisualSection>
    <VisualSection>
      <VisualTitle>States</VisualTitle>
      {renderMatrix(STATES)}
    </VisualSection>
  </VisualLayout>
);
`,
  'utf8',
);

// Создаём минимальный smoke e2e-тест для сценария, который был добавлен выше.
mkdirSync(e2eDir, { recursive: true });
writeFileSync(
  e2eSpecPath,
  `import { expect, test } from '@playwright/test';

import { getPlaygroundScenarioPath } from '../utils';

const defaultScenarioId = '${componentKebabName}/default';

test.describe('${componentName} playground', () => {
  test('renders default playground scenario', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(defaultScenarioId));

    const component = page.getByTestId('${testId}');

    await expect(component).toBeVisible();
    await expect(component).toHaveText('${componentName}');
  });
});
`,
  'utf8',
);

writeProjectFile(
  'src/index.ts',
  addSortedComponentExport(readProjectFile('src/index.ts'), `export * from './components/${componentName}';`),
);
addComponentPackageExport();

// После создания файлов подключаем компонент к публичному API и playground aggregator.
addPlaygroundScenarioToIndex();
addVisualScenarioToIndex();

console.log(`Generated ${componentName}.`);
