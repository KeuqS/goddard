import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cli = path.join(root, 'bin', 'goddard.js');
const sqliteRejectingLoader = pathToFileURL(path.join(root, 'test', 'fixtures', 'reject-sqlite-loader.mjs')).href;

for (const args of [['--version'], ['-v'], ['--help'], ['-h'], ['help'], []]) {
  test(`lightweight command ${args.join(' ') || '(no arguments)'} does not load SQLite`, () => {
    const result = spawnSync(process.execPath, [
      '--experimental-loader', sqliteRejectingLoader,
      cli,
      ...args,
    ], { cwd: root, encoding: 'utf8', windowsHide: true });

    assert.equal(result.status, 0, result.stderr);
    assert.doesNotMatch(result.stderr, /SQLite must not be loaded/);
    if (args[0] === '--version' || args[0] === '-v') assert.equal(result.stdout.trim(), '0.4.0');
    else assert.match(result.stdout, /Usage: goddard/);
  });
}
