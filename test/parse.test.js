'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { parseProgressChunk, parseAllowBuildSpec, lastErrorLine } = require('../lib/parse');

test('parseProgressChunk: git/pnpm 进度解析', () => {
  assert.deepEqual(parseProgressChunk('Receiving objects: 50%'), { percent: 35, stage: '下载代码 50%' });
  assert.deepEqual(parseProgressChunk('Resolving deltas: 100%'), { percent: 77, stage: '解析代码 100%' });
  assert.deepEqual(parseProgressChunk('Progress: resolved'), { percent: 78, stage: '解析依赖…' });
  assert.equal(parseProgressChunk('无关文本'), null);
});

test('parseAllowBuildSpec: pnpm allowBuilds 建议提取', () => {
  assert.equal(parseAllowBuildSpec('For example:\nallowBuilds:\n  some-pkg: true'), 'some-pkg');
  assert.equal(parseAllowBuildSpec('no match'), null);
  assert.equal(parseAllowBuildSpec(''), null);
});

test('lastErrorLine: 取 ERR_ 行或最后一行，截断 220', () => {
  assert.equal(lastErrorLine('[ERR_PNPM] something failed'), '[ERR_PNPM] something failed');
  assert.equal(lastErrorLine('line1\nline2'), 'line2');
  assert.equal(lastErrorLine('a\n[ERR_X] first\n[ERR_Y] last'), '[ERR_Y] last');
  assert.equal(lastErrorLine(''), '');
  assert.equal(lastErrorLine(undefined), '');
  assert.ok(lastErrorLine('x'.repeat(500)).length <= 220);
});
