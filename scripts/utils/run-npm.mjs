import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';

const isWindows = process.platform === 'win32';

const getNpmCli = () => {
  if (process.env.npm_execpath && existsSync(process.env.npm_execpath)) {
    return process.env.npm_execpath;
  }

  if (isWindows) {
    const npmCli = join(dirname(process.execPath), 'node_modules', 'npm', 'bin', 'npm-cli.js');

    if (existsSync(npmCli)) {
      return npmCli;
    }
  }

  return null;
};

const npmCli = getNpmCli();

const getNpmCommand = () => {
  if (npmCli) {
    return {
      command: process.execPath,
      prefixArgs: [npmCli],
    };
  }

  if (!isWindows) {
    return {
      command: 'npm',
      prefixArgs: [],
    };
  }

  throw new Error('Unable to locate npm CLI. Run this script via npm or install Node.js with npm.');
};

const { command, prefixArgs } = getNpmCommand();

export const execNpmSync = (args, options = {}) => execFileSync(command, [...prefixArgs, ...args], options);

export const spawnNpmSync = (args, options = {}) => spawnSync(command, [...prefixArgs, ...args], options);
