'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { dshSignal, featuredScore, computeFeatured } = require('../lib/store-ranking');

test('dshSignal: 识别 DSH 插件信号', () => {
  assert.equal(dshSignal({ fullName: 'x/dsh-plugin-foo', desc: 'a dsh plugin', topics: [] }), true);
  assert.equal(dshSignal({ fullName: 'x/y', desc: 'deepseek harness tool', topics: [] }), true);
  assert.equal(dshSignal({ fullName: 'x/y', desc: 'nothing', topics: ['dsh-plugin'] }), true);
  assert.equal(dshSignal({ fullName: 'x/y', desc: 'nothing', topics: ['deepseek-harness'] }), true);
  assert.equal(dshSignal({ fullName: 'x/y', desc: 'unrelated', topics: [] }), false);
});

test('featuredScore: 客观评分递增且星标封顶', () => {
  const base = { desc: 'a dsh plugin', fullName: 'x/y', topics: ['dsh-plugin'], stars: 0, fromNpm: false, updatedAt: new Date().toISOString() };
  const low = featuredScore(base);
  const high = featuredScore({ ...base, stars: 1000 }); // 星标封顶 200
  assert.ok(high > low);
  assert.ok(high - low <= 200); // 星标差值不超过封顶
});

test('computeFeatured: 种子优先 + 总数封顶 24', () => {
  const repos = Array.from({ length: 40 }, (_, i) => ({
    fullName: 'user/repo' + i,
    desc: 'a dsh plugin',
    topics: ['dsh-plugin'],
    stars: i,
    fromNpm: false,
    updatedAt: new Date().toISOString(),
  }));
  const out = computeFeatured(repos);
  assert.ok(out.length <= 24);
  // 所有返回项都是 DSH 相关（种子可能不在输入里，这里全 DSH 所以只校验数量与去重）
  assert.equal(new Set(out.map((r) => r.fullName)).size, out.length);
});
