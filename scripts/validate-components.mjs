#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const componentsDir = join(rootDir, 'src', 'components');
const rootIndexPath = join(rootDir, 'src', 'index.ts');
const packageJsonPath = join(rootDir, 'package.json');
const playgroundScenariosDir = join(rootDir, 'playground', 'scenarios');
const e2eDir = join(rootDir, 'tests', 'e2e');
const packageImport = '@admiral-ds/admiral3-primitives';
const internalExportSources = new Set(['./constants', './style']);
const publicComponentExportPattern = /^\.\/components\/[A-Z][A-Za-z0-9]*$/;
const styledPropsPattern = /^Styled[A-Za-z0-9]*Props$/;
const componentExportPattern = /^\.\/[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Переводит PascalCase-имя компонента в kebab-case для поиска playground/e2e файлов.
 */
const toKebabCase = (value) =>
  value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();

/**
 * Возвращает путь относительно корня проекта, чтобы сообщения об ошибках были короткими.
 */
const formatPath = (filePath) => relative(rootDir, filePath);

/**
 * Читает текстовый файл проекта.
 */
const readProjectFile = (filePath) => readFileSync(filePath, 'utf8');

/**
 * Читает JSON-файл проекта.
 */
const readProjectJson = (filePath) => JSON.parse(readProjectFile(filePath));

/**
 * Проверяет, есть ли в директории хотя бы один файл, включая вложенные директории.
 *
 * Это позволяет не считать пустые папки компонентами.
 */
const directoryHasFiles = (directoryPath) =>
  readdirSync(directoryPath, { withFileTypes: true }).some((entry) => {
    const entryPath = join(directoryPath, entry.name);

    return entry.isFile() || (entry.isDirectory() && directoryHasFiles(entryPath));
  });

/**
 * Находит непустые публичные директории с PascalCase-именем в `src/components`.
 *
 * Обычный компонент ниже определяется по наличию одноимённого файла реализации.
 * Папки без такого файла считаются группирующими публичными entrypoints.
 */
const getPublicDirectoryNames = () =>
  readdirSync(componentsDir, { withFileTypes: true })
    .filter((entry) => {
      const componentDir = join(componentsDir, entry.name);

      return entry.isDirectory() && /^[A-Z][A-Za-z0-9]*$/.test(entry.name) && directoryHasFiles(componentDir);
    })
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));

/**
 * Собирает Storybook stories и playground templates компонента.
 */
const getStoryFiles = (componentDir) => {
  const storiesDir = join(componentDir, 'stories');

  if (!existsSync(storiesDir)) {
    return [];
  }

  return readdirSync(storiesDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /\.(stories|template)\.tsx$/.test(entry.name))
    .map((entry) => join(storiesDir, entry.name));
};

/**
 * Извлекает публичные type exports компонента из его локального `index.ts`.
 *
 * Эти имена затем используются для проверки, что stories/templates импортируют
 * публичные props/types из root package, а не из внутренних файлов компонента.
 */
const getPublicTypeNames = (componentIndexContent) => {
  const typeNames = [];
  const exportTypePattern = /export\s+type\s+\{(?<names>[^}]+)\}\s+from\s+['"]\.\/types['"]/g;

  for (const match of componentIndexContent.matchAll(exportTypePattern)) {
    const names = match.groups?.names ?? '';

    for (const name of names.split(',')) {
      const publicName = name
        .trim()
        .split(/\s+as\s+/)[0]
        ?.trim();

      if (publicName) {
        typeNames.push(publicName);
      }
    }
  }

  return typeNames;
};

/**
 * Извлекает source всех export declarations из файла.
 */
const getExportSources = (content) => {
  const exportSources = [];
  const exportSourcePattern = /export\s+(?:type\s+)?(?:\*|\{[^}]*\})\s+from\s+['"](?<source>[^'"]+)['"]/g;

  for (const match of content.matchAll(exportSourcePattern)) {
    const source = match.groups?.source ?? '';

    if (source) {
      exportSources.push(source);
    }
  }

  return exportSources;
};

/**
 * Извлекает named value exports из файла.
 */
const getNamedValueExports = (content) => {
  const exportNames = [];
  const exportNamesPattern = /export\s+\{(?<names>[^}]+)\}\s+from\s+['"][^'"]+['"]/g;

  for (const match of content.matchAll(exportNamesPattern)) {
    const names = match.groups?.names ?? '';

    for (const name of names.split(',')) {
      const publicName = name
        .trim()
        .split(/\s+as\s+/)
        .at(-1)
        ?.trim();

      if (publicName) {
        exportNames.push(publicName);
      }
    }
  }

  return exportNames;
};

/**
 * Проверяет, экспортирует ли локальный barrel сам компонент.
 */
const exportsComponent = (componentIndexContent, componentName) => {
  return getNamedValueExports(componentIndexContent).includes(componentName);
};

/**
 * Проверяет, есть ли wildcard export из файла реализации компонента.
 */
const exportsComponentWildcard = (componentIndexContent, componentName) => {
  const componentNamePattern = componentName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const componentWildcardExport = new RegExp(`export\\s+\\*\\s+from\\s+['"]\\.\\/${componentNamePattern}['"]`);

  return componentWildcardExport.test(componentIndexContent);
};

/**
 * Извлекает import-блоки из файла в минимальном виде, достаточном для локальных проверок.
 */
const getImports = (content) => {
  const imports = [];
  const importPattern = /import\s+(?<clause>type\s+)?(?<imports>[\s\S]*?)\s+from\s+['"](?<source>[^'"]+)['"]/g;

  for (const match of content.matchAll(importPattern)) {
    imports.push({
      clause: match.groups?.clause ?? '',
      imports: match.groups?.imports ?? '',
      source: match.groups?.source ?? '',
    });
  }

  return imports;
};

/**
 * Проверяет, упоминается ли конкретный публичный тип в import clause.
 */
const importMentionsType = (importText, typeName) => {
  const typePattern = new RegExp(`(^|[^A-Za-z0-9_$])${typeName}([^A-Za-z0-9_$]|$)`);

  return typePattern.test(importText);
};

const errors = [];
const publicDirectoryNames = getPublicDirectoryNames();
const componentNames = publicDirectoryNames.filter((name) => existsSync(join(componentsDir, name, `${name}.tsx`)));
const componentGroupNames = publicDirectoryNames.filter((name) => !componentNames.includes(name));
const rootIndexContent = readProjectFile(rootIndexPath);
const packageJson = readProjectJson(packageJsonPath);
const packageExportKeys = Object.keys(packageJson.exports ?? {});
const rootExportSources = getExportSources(rootIndexContent);

const sortedRootExportSources = [...rootExportSources].sort((first, second) => first.localeCompare(second));
if (JSON.stringify(rootExportSources) !== JSON.stringify(sortedRootExportSources)) {
  errors.push(`${formatPath(rootIndexPath)} component exports must be sorted alphabetically.`);
}

const expectedPackageExportOrder = [
  '.',
  './package.json',
  ...packageExportKeys
    .filter((exportKey) => exportKey !== '.' && exportKey !== './package.json')
    .sort((first, second) => first.localeCompare(second)),
];
if (JSON.stringify(packageExportKeys) !== JSON.stringify(expectedPackageExportOrder)) {
  errors.push(
    `${formatPath(packageJsonPath)} exports must keep root and package.json first, then sort subpaths alphabetically.`,
  );
}

for (const exportKey of packageExportKeys) {
  if (exportKey !== '.' && exportKey !== './package.json' && !componentExportPattern.test(exportKey)) {
    errors.push(
      `${formatPath(packageJsonPath)} exposes unsupported export "${exportKey}". Only root, package.json and kebab-case component entrypoints are allowed.`,
    );
  }
}

for (const exportSource of rootExportSources) {
  if (!publicComponentExportPattern.test(exportSource)) {
    errors.push(
      `${formatPath(rootIndexPath)} exports "${exportSource}". Root API must re-export only component barrels from src/components/ComponentName.`,
    );
  }
}

for (const componentName of componentNames) {
  const componentDir = join(componentsDir, componentName);
  const componentKebabName = toKebabCase(componentName);
  const componentIndexPath = join(componentDir, 'index.ts');
  const componentExportKey = `./${componentKebabName}`;
  const expectedComponentExport = {
    types: `./dist/components/${componentName}/index.d.ts`,
    import: `./dist/components/${componentName}/index.js`,
  };
  const requiredFiles = [
    'index.ts',
    'types.ts',
    'style.ts',
    `${componentName}.test.tsx`,
    join('stories', `${componentName}.stories.tsx`),
  ];

  // Проверяем базовый набор файлов, без которого компонент не соответствует проектному шаблону.
  for (const fileName of requiredFiles) {
    const filePath = join(componentDir, fileName);

    if (!existsSync(filePath)) {
      errors.push(`${componentName}: missing ${formatPath(filePath)}`);
    }
  }

  // Каждый компонент должен быть доступен из root entrypoint пакета.
  const rootExportLine = `export * from './components/${componentName}';`;

  if (!rootIndexContent.includes(rootExportLine)) {
    errors.push(`${componentName}: missing root export "${rootExportLine}" in ${formatPath(rootIndexPath)}`);
  }

  if (JSON.stringify(packageJson.exports?.[componentExportKey]) !== JSON.stringify(expectedComponentExport)) {
    errors.push(
      `${componentName}: ${formatPath(packageJsonPath)} must expose ${componentExportKey} with its public JS and type entrypoints.`,
    );
  }

  const playgroundScenarioPath = join(playgroundScenariosDir, `${componentKebabName}.tsx`);

  // Если есть playground-сценарий, рядом должен быть e2e smoke-тест для этого сценария.
  if (existsSync(playgroundScenarioPath)) {
    const e2eSpecPath = join(e2eDir, componentName, `${componentKebabName}.spec.ts`);

    if (!existsSync(e2eSpecPath)) {
      errors.push(
        `${componentName}: playground scenario ${formatPath(
          playgroundScenarioPath,
        )} exists, but ${formatPath(e2eSpecPath)} is missing`,
      );
    }
  }

  if (!existsSync(componentIndexPath)) {
    continue;
  }

  const publicTypeNames = getPublicTypeNames(readProjectFile(componentIndexPath));
  const componentIndexContent = readProjectFile(componentIndexPath);
  const componentExportSources = getExportSources(componentIndexContent);

  if (!exportsComponent(componentIndexContent, componentName)) {
    errors.push(`${componentName}: ${formatPath(componentIndexPath)} must export the ${componentName} component.`);
  }

  if (!publicTypeNames.includes(`${componentName}Props`)) {
    errors.push(`${componentName}: ${formatPath(componentIndexPath)} must export ${componentName}Props from ./types.`);
  }

  for (const exportSource of componentExportSources) {
    if (exportSource === `./${componentName}` && exportsComponentWildcard(componentIndexContent, componentName)) {
      errors.push(
        `${componentName}: ${formatPath(componentIndexPath)} must use named component export instead of export * from ./${componentName}.`,
      );
    }

    if (internalExportSources.has(exportSource)) {
      errors.push(
        `${componentName}: ${formatPath(componentIndexPath)} exports internal module "${exportSource}". Keep constants and styles internal.`,
      );
    }
  }

  const internalTypeNames = publicTypeNames.filter((typeName) => styledPropsPattern.test(typeName));

  if (internalTypeNames.length > 0) {
    errors.push(
      `${componentName}: ${formatPath(componentIndexPath)} exports internal styled props ${internalTypeNames.join(
        ', ',
      )}.`,
    );
  }

  if (publicTypeNames.length === 0) {
    continue;
  }

  // Stories и templates должны использовать потребительский импорт публичных props/types.
  for (const storyFilePath of getStoryFiles(componentDir)) {
    const content = readProjectFile(storyFilePath);
    const imports = getImports(content);

    for (const item of imports) {
      if (item.source === packageImport) {
        continue;
      }

      if (!item.source.startsWith('..')) {
        continue;
      }

      const importedPublicTypes = publicTypeNames.filter((typeName) => importMentionsType(item.imports, typeName));

      if (importedPublicTypes.length > 0) {
        errors.push(
          `${formatPath(storyFilePath)} imports public type ${importedPublicTypes.join(
            ', ',
          )} from internal path "${item.source}". Use ${packageImport} instead.`,
        );
      }
    }
  }
}

const expectedPackageExportKeys = new Set([
  '.',
  './package.json',
  ...componentGroupNames.map((name) => `./${toKebabCase(name)}`),
  ...componentNames.map((name) => `./${toKebabCase(name)}`),
]);

for (const exportKey of packageExportKeys) {
  if (!expectedPackageExportKeys.has(exportKey)) {
    errors.push(`${formatPath(packageJsonPath)} exposes "${exportKey}" without a matching component directory.`);
  }
}

if (errors.length > 0) {
  console.error('Component validation failed:');

  for (const error of errors) {
    console.error(`- ${error}`);
  }

  process.exit(1);
}

console.log(`Component validation passed for ${componentNames.length} components.`);
