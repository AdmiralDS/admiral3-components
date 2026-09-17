#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import { execNpmSync } from './utils/run-npm.mjs';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const packageJson = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf8'));

/** Форматирует байты в KiB для читаемого вывода в консоли. */
const formatBytes = (bytes) => `${(bytes / 1024).toFixed(1)} KiB`;

/** Возвращает путь относительно корня проекта, чтобы сообщения не зависели от локальной машины. */
const formatProjectPath = (filePath) => relative(rootDir, filePath);

/**
 * Набор правил для файлов, которые не должны попадать в npm-пакет.
 *
 * Разрешённые корни дополнительно проверяются в validatePackageFiles, а эти
 * правила отлавливают служебные директории, тестовые артефакты и template-файлы,
 * даже если они случайно окажутся внутри разрешённого publish root.
 */
const forbiddenPackagePathRules = [
  { label: 'source files', matches: (path) => path === 'src' || path.startsWith('src/') },
  {
    label: 'Storybook build output',
    matches: (path) => path === 'storybook-static' || path.startsWith('storybook-static/'),
  },
  {
    label: 'Playwright report output',
    matches: (path) => path === 'playwright-report' || path.startsWith('playwright-report/'),
  },
  { label: 'test result output', matches: (path) => path === 'test-results' || path.startsWith('test-results/') },
  {
    label: 'template files',
    matches: (path) => path.includes('/templates/') || path.startsWith('templates/') || path.includes('.template.'),
  },
  {
    label: 'local service files',
    matches: (path) =>
      path.startsWith('.github/') ||
      path.startsWith('.storybook/') ||
      path.startsWith('playground/') ||
      path.startsWith('scripts/') ||
      path.startsWith('tests/'),
  },
];

/**
 * Запускает npm pack в dry-run режиме и возвращает метаданные будущего tarball.
 *
 * Эта проверка использует реальный механизм npm, поэтому список файлов совпадает
 * с тем, что будет опубликовано при npm publish.
 */
const readPackDryRun = () => {
  const output = execNpmSync(['pack', '--dry-run', '--json'], {
    cwd: rootDir,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  const packageInfo = JSON.parse(output).at(0);

  if (!packageInfo) throw new Error('npm pack --dry-run did not return package metadata.');
  return packageInfo;
};

/**
 * Проверяет состав npm-пакета по списку файлов из npm pack --dry-run.
 *
 * В пакет должны попадать только публичные файлы: README, LICENSE, package.json
 * и собранный dist. Исходники, storybook/playground, тесты, скрипты и временные
 * артефакты должны оставаться вне publish tarball.
 */
const validatePackageFiles = (files) => {
  const errors = [];

  for (const file of files) {
    const path = file.path.replaceAll('\\', '/');

    // Сначала проверяем общий allowlist publish roots.
    if (path !== 'LICENSE' && path !== 'README.md' && path !== 'package.json' && !path.startsWith('dist/')) {
      errors.push(`${path} is outside the allowed publish roots.`);
    }

    // Затем применяем точечные запреты на служебные и тестовые файлы.
    for (const rule of forbiddenPackagePathRules) {
      if (rule.matches(path)) errors.push(`${path} contains ${rule.label}.`);
    }
  }
  return errors;
};

/** Собирает все JS, type и служебные targets из package.json#exports. */
const getExportTargets = () =>
  Object.entries(packageJson.exports ?? {}).flatMap(([exportKey, exportValue]) => {
    if (typeof exportValue === 'string') return [[exportKey, exportValue]];
    return Object.values(exportValue).map((target) => [exportKey, target]);
  });

/**
 * Проверяет, что каждый публичный export существует после сборки и попадёт
 * в tarball. Проверки файловой системы недостаточно: publish-настройки могут
 * исключить существующий локально файл.
 */
const validateExportTargets = (files) => {
  const packageFiles = new Set(files.map((file) => file.path.replaceAll('\\', '/')));

  return getExportTargets().flatMap(([exportKey, target]) => {
    const targetPath = join(rootDir, target);
    const packageTarget = target.replaceAll('\\', '/').replace(/^\.\//, '');

    if (!existsSync(targetPath)) {
      return [`Export ${exportKey} points to missing ${formatProjectPath(targetPath)}.`];
    }

    return packageFiles.has(packageTarget)
      ? []
      : [`Export ${exportKey} target ${packageTarget} is missing from the npm tarball.`];
  });
};

const packageInfo = readPackDryRun();

// Собираем ошибки всех проверок, чтобы пользователь получил полный список проблем за один запуск.
const packageFiles = packageInfo.files ?? [];
const errors = [...validatePackageFiles(packageFiles), ...validateExportTargets(packageFiles)];

if (errors.length > 0) {
  console.error('Package validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `Package validation passed: ${packageInfo.files?.length ?? 0} files, ${formatBytes(packageInfo.unpackedSize ?? 0)} unpacked.`,
);
