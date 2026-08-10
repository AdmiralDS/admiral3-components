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
const e2eDir = join(rootDir, 'tests', 'e2e', componentName);
const e2eSpecPath = join(e2eDir, `${componentKebabName}.spec.ts`);

const filesToProtect = [
  componentDir,
  playgroundScenarioPath,
  e2eSpecPath,
  storyTargetPath,
  playgroundTemplateTargetPath,
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

  // Добавляем spread нового набора сценариев в существующий export без перестройки файла.
  const nextContent = lines
    .join('\n')
    .replace(
      /export const playgroundScenarios = \[(?<items>[\s\S]*?)\];/,
      (_match, items) => `export const playgroundScenarios = [${items.trimEnd()}, ...${scenarioIdentifier}];`,
    );

  writeProjectFile(indexPath, nextContent);
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

console.log(`Generated ${componentName}.`);
