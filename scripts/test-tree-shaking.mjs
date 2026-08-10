#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
import ts from 'typescript';
import { build } from 'vite';

// Все пути строятся относительно самого скрипта, а не текущей рабочей директории.
// Благодаря этому проверку можно запускать не только из корня репозитория.
const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const distIndexPath = join(rootDir, 'dist', 'index.js');
const bundleSizeBaselinePath = join(rootDir, 'bundle-size-baseline.json');
const maxGzipGrowthRatio = 0.1;
const maxGzipGrowthBytes = 1024;

// Consumer создаётся внутри корневого node_modules: установленный tarball остаётся
// изолированным, а его peer dependencies разрешаются из родительского проекта.
const consumerRoot = mkdtempSync(join(rootDir, 'node_modules', '.tmp', 'tree-shaking-'));
const fixtureDir = join(consumerRoot, 'fixtures');
const outputRoot = join(consumerRoot, 'bundles');
const packageName = '@admiral-ds/admiral3-primitives';
const packageJson = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf8'));
const installedPackageDir = join(consumerRoot, 'node_modules', ...packageName.split('/'));

// Peer dependencies не должны попадать в измеряемые consumer bundles: проверка
// оценивает только собственный код библиотеки и её локальные зависимости. Список
// берётся из package.json, чтобы новые peer dependencies автоматически учитывались.
const peerDependencies = Object.keys(packageJson.peerDependencies ?? {});
const previousBundleSizeBaseline = existsSync(bundleSizeBaselinePath)
  ? JSON.parse(readFileSync(bundleSizeBaselinePath, 'utf8'))
  : { components: {}, version: 1 };

// Скрипт проверяет уже собранный публичный пакет. Без dist импорт packageName
// разрешился бы некорректно или проверял бы не тот код, который получит consumer.
if (!existsSync(distIndexPath)) {
  rmSync(consumerRoot, { recursive: true, force: true });
  console.error('Tree-shaking test requires dist. Run npm run build first.');
  process.exit(1);
}

mkdirSync(fixtureDir, { recursive: true });

/**
 * Упаковывает библиотеку тем же механизмом, что используется при публикации,
 * и устанавливает tarball в изолированный consumer project.
 *
 * --legacy-peer-deps не устанавливает peers повторно: consumer использует версии
 * из корневого node_modules, как это делает локальное приложение-разработчик.
 */
const installPackedLibrary = () => {
  writeFileSync(
    join(consumerRoot, 'package.json'),
    `${JSON.stringify({ name: 'admiral-tree-shaking-consumer', private: true }, null, 2)}\n`,
    'utf8',
  );

  const packOutput = execFileSync('npm', ['pack', '--json', '--pack-destination', consumerRoot], {
    cwd: rootDir,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  const packedFileName = JSON.parse(packOutput).at(0)?.filename;

  if (!packedFileName) {
    throw new Error('npm pack did not return the generated tarball name.');
  }

  execFileSync(
    'npm',
    [
      'install',
      '--ignore-scripts',
      '--legacy-peer-deps',
      '--no-audit',
      '--no-fund',
      '--no-package-lock',
      '--no-save',
      join(consumerRoot, packedFileName),
    ],
    {
      cwd: consumerRoot,
      stdio: 'ignore',
    },
  );
};

/**
 * Создаёт минимальный consumer entrypoint для одного компонента.
 *
 * console.log намеренно использует импортированное значение: иначе Rollup мог бы
 * удалить неиспользуемый импорт, и проверка получила бы пустой module graph.
 */
const createFixture = (name, importSource, componentName) => {
  const fixturePath = join(fixtureDir, `${name}.tsx`);
  writeFileSync(
    fixturePath,
    `import { ${componentName} } from '${importSource}';\nconsole.log(${componentName});\n`,
    'utf8',
  );
  return fixturePath;
};

// package.json#exports является источником истины для публичных component subpaths.
// Корневой entrypoint и package.json не являются компонентами, поэтому исключаются.
const componentEntries = Object.entries(packageJson.exports ?? {})
  .filter(([exportKey]) => exportKey !== '.' && exportKey !== './package.json')
  .map(([exportKey, exportValue]) => {
    // Из export target вида ./dist/components/Button/index.js извлекается Button.
    // Имя нужно и для импорта React-компонента, и для поиска его исходного barrel.
    const componentName = exportValue.import.match(/\/components\/(?<componentName>[^/]+)\/index\.js$/)?.groups
      ?.componentName;
    return {
      componentName,
      sourcePath: join(rootDir, 'src', 'components', componentName ?? '', 'index.ts'),
      subpath: exportKey.slice(2),
    };
  })
  .sort((first, second) => first.subpath.localeCompare(second.subpath));

// Ошибка здесь означает, что публичный subpath не соответствует принятой структуре
// компонента. Продолжать нельзя: последующие фикстуры были бы неполными или ложными.
if (componentEntries.some(({ componentName, sourcePath }) => !componentName || !existsSync(sourcePath))) {
  throw new Error('Every component export must point to dist/components/ComponentName/index.js.');
}

/**
 * Читает named exports из исходного component barrel через TypeScript AST.
 *
 * Экспорты делятся на runtime-значения и type-only контракты, потому что в
 * синтетической consumer-фикстуре для них требуется разный синтаксис импорта.
 */
const getPublicExports = (sourcePath) => {
  const sourceFile = ts.createSourceFile(
    sourcePath,
    readFileSync(sourcePath, 'utf8'),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  const valueExports = [];
  const typeExports = [];

  for (const statement of sourceFile.statements) {
    // Импорты и другие объявления barrel-файла не описывают публичный контракт.
    if (!ts.isExportDeclaration(statement)) continue;

    // export * намеренно запрещён: проверка должна точно знать список контрактов,
    // а публичный API компонента по правилам проекта оформляется named exports.
    if (!statement.exportClause || !ts.isNamedExports(statement.exportClause)) {
      throw new Error(`${relative(rootDir, sourcePath)} must use named exports.`);
    }

    for (const element of statement.exportClause.elements) {
      // type может быть указан как для всей декларации, так и для одного элемента:
      // export type { Props } и export { type Props, Component }.
      const target = statement.isTypeOnly || element.isTypeOnly ? typeExports : valueExports;
      target.push(element.name.text);
    }
  }

  return { typeExports, valueExports };
};

const publicEntries = componentEntries.map((entry) => {
  // Имя папки обычно совпадает с основным runtime-экспортом, но публичные группирующие
  // entrypoints могут называться иначе. Например, HelperComponents экспортирует
  // SelectionControlInformer, поэтому имя для consumer fixture берётся из barrel.
  const publicExportName = getPublicExports(entry.sourcePath).valueExports.at(0);

  if (!publicExportName) {
    throw new Error(`${relative(rootDir, entry.sourcePath)} must export at least one runtime value.`);
  }

  return { ...entry, publicExportName };
});

/**
 * Создаёт одну TypeScript-фикстуру, импортирующую каждый публичный контракт из
 * соответствующего component subpath.
 *
 * Это отдельная проверка от Rollup-сборок ниже: она подтверждает, что опубликованные
 * subpaths корректно разрешаются TypeScript и отдают заявленные values и types.
 */
const createTypeFixture = () => {
  const fixturePath = join(fixtureDir, 'component-types.tsx');
  const contracts = [];
  const imports = componentEntries.map(({ componentName, sourcePath, subpath }) => {
    const { typeExports, valueExports } = getPublicExports(sourcePath);
    const importSpecifiers = [
      ...valueExports.map((exportName) => {
        // Алиасы исключают конфликты одинаковых имён экспортов разных компонентов.
        const localName = `${componentName}_${exportName}`;
        // Runtime-значение добавляется в массив ниже, чтобы импорт не был формальным.
        contracts.push(localName);
        return `${exportName} as ${localName}`;
      }),
      ...typeExports.map((exportName) => {
        const localName = `${componentName}_${exportName}`;
        // Type-only контракт используется в type assertion и тоже проверяется tsc.
        contracts.push(`{} as ${localName}`);
        return `type ${exportName} as ${localName}`;
      }),
    ];

    return `import { ${importSpecifiers.join(', ')} } from '${packageName}/${subpath}';`;
  });

  writeFileSync(
    fixturePath,
    `${imports.join('\n')}\n\nconst publicContracts: unknown[] = [${contracts.join(', ')}];\nconsole.log(publicContracts);\n`,
    'utf8',
  );

  return fixturePath;
};

/**
 * Собирает consumer entrypoint, возвращает фактически включённые модули и размер emitted JS.
 * Peer dependencies остаются external, поэтому отчёт отражает код выбранного компонента и его локальных зависимостей.
 *
 * Сборка выполняется программно через Vite без конфигурации проекта, чтобы тест
 * моделировал независимый consumer bundle и контролировал только нужные параметры.
 */
const buildConsumer = async (name, fixturePath) => {
  const moduleIds = new Set();
  let sizeBytes = 0;
  let gzipSizeBytes = 0;

  await build({
    configFile: false,
    root: consumerRoot,
    logLevel: 'error',
    build: {
      outDir: join(outputRoot, name),
      emptyOutDir: true,
      rollupOptions: {
        input: fixturePath,
        // Учитываются также subpath-импорты peer dependency, например react-dom/client.
        external: (id) => peerDependencies.some((dependency) => id === dependency || id.startsWith(`${dependency}/`)),
        plugins: [
          {
            name: 'collect-consumer-output',
            generateBundle(_options, bundle) {
              for (const output of Object.values(bundle)) {
                // Assets не содержат module graph и не участвуют в размере JS.
                if (output.type !== 'chunk') continue;
                // Set устраняет повторы, если модуль встречается в нескольких chunks.
                for (const id of Object.keys(output.modules)) moduleIds.add(id.replaceAll('\\', '/'));
                sizeBytes += Buffer.byteLength(output.code);
                gzipSizeBytes += gzipSync(output.code).byteLength;
              }
            },
          },
        ],
      },
    },
  });

  return { gzipSizeBytes, moduleIds, sizeBytes };
};

const formatKiB = (bytes) => `${(bytes / 1024).toFixed(2)} KiB`;
const formatSizeChange = (previousBytes, currentBytes) => {
  if (previousBytes === undefined) return 'new';

  const difference = currentBytes - previousBytes;
  const ratio = previousBytes === 0 ? 0 : difference / previousBytes;
  const sign = difference > 0 ? '+' : '';
  return `${sign}${formatKiB(difference)} (${sign}${(ratio * 100).toFixed(1)}%)`;
};
const formatModuleId = (id) => {
  const packageRelativeId = relative(installedPackageDir, id);
  if (!packageRelativeId.startsWith('..')) return `${packageName}/${packageRelativeId}`;

  const relativeId = relative(rootDir, id);
  // Файлы проекта показываются компактно, внешние абсолютные пути сохраняются,
  // чтобы не скрывать случайно попавшую в bundle зависимость.
  return relativeId.startsWith('..') ? id : relativeId;
};

/**
 * Печатает одну ветвь module graph в древовидном виде.
 *
 * prefix и isLast нужны только для корректных соединительных линий, когда рядом
 * выводятся два несовпадающих графа: root import и component subpath import.
 */
const printModuleBranch = (label, moduleIds, { isLast, prefix }) => {
  console.log(`${prefix}${isLast ? '└──' : '├──'} ${label}`);
  const modulePrefix = `${prefix}${isLast ? '    ' : '│   '}`;
  moduleIds.forEach((id, index) => {
    const isLastModule = index === moduleIds.length - 1;
    console.log(`${modulePrefix}${isLastModule ? '└──' : '├──'} ${formatModuleId(id)}`);
  });
};

try {
  // Все дальнейшие проверки резолвят библиотеку из npm tarball, а не через
  // package self-reference рабочего репозитория.
  installPackedLibrary();

  // Сначала проверяется TypeScript-контракт всех component subpaths. execFileSync
  // наследует stdout/stderr, поэтому диагностика tsc сразу видна пользователю.
  const typeFixture = createTypeFixture();
  execFileSync(
    join(rootDir, 'node_modules', 'typescript', 'bin', 'tsc'),
    [
      '--noEmit',
      '--skipLibCheck',
      '--module',
      'ESNext',
      '--moduleResolution',
      'bundler',
      '--target',
      'ES2023',
      '--jsx',
      'react-jsx',
      typeFixture,
    ],
    { cwd: consumerRoot, stdio: 'inherit' },
  );

  const componentSizes = [];
  const currentBundleSizeBaseline = { components: {}, version: 1 };
  const bundleSizeRegressions = [];
  const componentModuleGraphs = [];
  let hasTreeShakingErrors = false;
  for (const { componentName, publicExportName, subpath } of publicEntries) {
    // Для одного и того же компонента создаются два эквивалентных consumer imports:
    // из корня пакета и из его публичного component subpath.
    const rootFixturePath = createFixture(`root-${subpath}`, packageName, publicExportName);
    const componentFixturePath = createFixture(`component-${subpath}`, `${packageName}/${subpath}`, publicExportName);
    const rootResult = await buildConsumer(`root-${subpath}`, rootFixturePath);
    const componentResult = await buildConsumer(`component-${subpath}`, componentFixturePath);

    // Синтетический entrypoint присутствует в каждом графе, но не относится к
    // библиотеке, поэтому исключается перед сравнением.
    const getLibraryModules = (moduleIds) =>
      [...moduleIds].filter((id) => !id.startsWith(fixtureDir.replaceAll('\\', '/'))).sort();
    const rootModules = getLibraryModules(rootResult.moduleIds);
    const componentModules = getLibraryModules(componentResult.moduleIds);

    // После сортировки строковое сравнение даёт строгую проверку состава графов.
    // Если графы равны, root barrel не притащил лишние компоненты.
    const hasMatchingModuleGraphs = JSON.stringify(rootModules) === JSON.stringify(componentModules);

    if (!hasMatchingModuleGraphs) hasTreeShakingErrors = true;
    const previousSize = previousBundleSizeBaseline.components?.[subpath];
    const gzipGrowthBytes = componentResult.gzipSizeBytes - (previousSize?.gzipBytes ?? componentResult.gzipSizeBytes);
    const gzipGrowthRatio = previousSize?.gzipBytes ? gzipGrowthBytes / previousSize.gzipBytes : 0;
    const hasSizeRegression =
      previousSize !== undefined && gzipGrowthBytes > maxGzipGrowthBytes && gzipGrowthRatio > maxGzipGrowthRatio;

    currentBundleSizeBaseline.components[subpath] = {
      gzipBytes: componentResult.gzipSizeBytes,
      rawBytes: componentResult.sizeBytes,
    };
    if (hasSizeRegression) {
      bundleSizeRegressions.push(
        `${componentName}: gzip grew by ${formatKiB(gzipGrowthBytes)} (${(gzipGrowthRatio * 100).toFixed(1)}%).`,
      );
    }
    componentModuleGraphs.push({
      component: componentName,
      componentModules,
      hasMatchingModuleGraphs,
      rootModules,
      subpath,
    });
    componentSizes.push({
      component: componentName,
      // При ошибке показываются оба количества модулей, чтобы расхождение было
      // заметно и в итоговой таблице, а не только в дереве выше.
      modules: hasMatchingModuleGraphs ? rootModules.length : `${rootModules.length} / ${componentModules.length}`,
      status: hasMatchingModuleGraphs ? 'OK' : 'NOT OK',
      // Размер component subpath bundle используется как стабильный standalone
      // показатель. Изменение сравнивается с committed baseline.
      raw: formatKiB(componentResult.sizeBytes),
      gzip: formatKiB(componentResult.gzipSizeBytes),
      gzipChange: formatSizeChange(previousSize?.gzipBytes, componentResult.gzipSizeBytes),
    });
  }

  // Baseline обновляется при каждом запуске, включая check:full. Благодаря этому
  // ожидаемое изменение размера сразу видно разработчику в git diff.
  writeFileSync(bundleSizeBaselinePath, `${JSON.stringify(currentBundleSizeBaseline, null, 2)}\n`, 'utf8');

  // Совпадающий граф печатается один раз. При расхождении оба варианта выводятся
  // рядом, чтобы можно было вручную найти лишний или отсутствующий модуль.
  console.log('Component module graphs (peer dependencies and fixture entry code excluded):');
  for (const { component, componentModules, hasMatchingModuleGraphs, rootModules, subpath } of componentModuleGraphs) {
    console.log(`${component} (${packageName}/${subpath})`);
    if (hasMatchingModuleGraphs) {
      printModuleBranch('root import = component subpath import', rootModules, { isLast: true, prefix: '' });
    } else {
      printModuleBranch('root import', rootModules, { isLast: false, prefix: '' });
      printModuleBranch('component subpath import', componentModules, { isLast: true, prefix: '' });
    }
    console.log('');
  }

  console.log('Component tree shaking and standalone bundle sizes (peer dependencies excluded):');
  console.table(componentSizes);

  if (hasTreeShakingErrors) {
    throw new Error('Tree shaking check failed: root and component subpath imports have different module graphs.');
  }

  if (bundleSizeRegressions.length > 0) {
    throw new Error(
      `Bundle size regression detected (gzip growth must exceed both 10% and 1 KiB):\n- ${bundleSizeRegressions.join(
        '\n- ',
      )}\nThe baseline was updated; review its diff and commit it only when the growth is expected.`,
    );
  }

  // Равенство графов доказывает эквивалентность двух способов импорта, но не может
  // определить бизнес-смысл каждого модуля. Поэтому после автоматики остаётся
  // обязательная ручная проверка напечатанного состава.
  console.log(
    '⚠️  MANUAL REVIEW REQUIRED: Automatic bundle checks passed. Review the module graphs above and confirm that each component contains only expected modules.',
  );
} finally {
  // Очистка выполняется и при ошибке tsc/Vite или несовпадении графов, чтобы
  // установленный tarball, фикстуры и bundles не влияли на последующие запуски.
  rmSync(consumerRoot, { recursive: true, force: true });
}
