import { performance } from 'node:perf_hooks';

import { spawnNpmSync } from './utils/run-npm.mjs';

// Проверки перечислены в том же порядке, в котором они должны выполняться в полном прогоне.
// Следующая проверка запускается только после успешного завершения предыдущей.
const checks = [
  'format:check',
  'lint',
  'validate:components',
  'typecheck',
  'test:run',
  'test:e2e',
  'pack:check',
  'test:bundle',
];

// Замер начинается перед первой проверкой и охватывает весь полный прогон.
const startedAt = performance.now();
let exitCode = 0;

for (const check of checks) {
  // stdio: 'inherit' оставляет вывод каждой npm-команды доступным в текущем терминале.
  const result = spawnNpmSync(['run', check], {
    stdio: 'inherit',
  });

  // result.error означает, что сам дочерний процесс не удалось запустить.
  if (result.error) {
    console.error(result.error.message);
    exitCode = 1;
    break;
  }

  // При падении проверки сохраняем её код и не запускаем оставшиеся команды.
  if (result.status !== 0) {
    exitCode = result.status ?? 1;
    break;
  }
}

// Длительность выводится как после успеха, так и после досрочной остановки на ошибке.
const durationSeconds = (performance.now() - startedAt) / 1000;
console.log(`\nFull check duration: ${durationSeconds.toFixed(1)}s`);

// Передаём итоговый код вызывающему процессу, чтобы npm и CI корректно определили результат.
process.exitCode = exitCode;
