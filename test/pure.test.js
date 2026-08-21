'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { nodeVerOk, sanitizeShellArg, htmlDecode, parseStarsText } = require('../lib/pure');

test('nodeVerOk: 版本门槛 v22.19.0', () => {
  assert.equal(nodeVerOk('v22.19.0'), true);
  assert.equal(nodeVerOk('v22.20.0'), true);
  assert.equal(nodeVerOk('v23.0.0'), true);
  assert.equal(nodeVerOk('v25.1.0'), true);
  assert.equal(nodeVerOk('22.19.0'), true);      // 无 v 前缀
  assert.equal(nodeVerOk('v22.18.9'), false);    // 低于门槛
  assert.equal(nodeVerOk('v20.0.0'), false);
  assert.equal(nodeVerOk('v18.19.0'), false);
  assert.equal(nodeVerOk(''), false);
  assert.equal(nodeVerOk(undefined), false);
  assert.equal(nodeVerOk('garbage'), false);
});

test('sanitizeShellArg: 剔除命令分隔元字符与引号', () => {
  assert.equal(sanitizeShellArg('npx'), 'npx');
  assert.equal(sanitizeShellArg('a"b'), 'ab');
  assert.equal(sanitizeShellArg('a&b|c<d>e^f%g!h'), 'abcdefgh');
  assert.equal(sanitizeShellArg('D:\\path with space\\x.exe'), 'D:\\path with space\\x.exe'); // 空格保留
  assert.equal(sanitizeShellArg(123), '123');   // 非字符串强制转
});

test('htmlDecode: 常见实体解码', () => {
  assert.equal(htmlDecode('a&amp;b'), 'a&b');
  assert.equal(htmlDecode('&lt;div&gt;'), '<div>');
  assert.equal(htmlDecode('&quot;x&quot;'), '"x"');
  assert.equal(htmlDecode("&#39;x&#39;"), "'x'");
  assert.equal(htmlDecode('&nbsp;'), ' ');
  assert.equal(htmlDecode('plain'), 'plain');
  assert.equal(htmlDecode(''), '');
});

test('parseStarsText: 星标文本解析', () => {
  assert.deepEqual(parseStarsText('0'), { stars: 0, starsText: '0' });
  assert.deepEqual(parseStarsText('123'), { stars: 123, starsText: '123' });
  assert.deepEqual(parseStarsText('1.2k'), { stars: 1200, starsText: '1.2k' });
  assert.deepEqual(parseStarsText('1.5K'), { stars: 1500, starsText: '1.5k' });
  assert.deepEqual(parseStarsText('1000'), { stars: 1000, starsText: '1k' });
  assert.deepEqual(parseStarsText('1,234'), { stars: 1234, starsText: '1.2k' });
  assert.deepEqual(parseStarsText('2k'), { stars: 2000, starsText: '2k' });
  assert.deepEqual(parseStarsText('abc'), { stars: 0, starsText: '0' });
  assert.deepEqual(parseStarsText(''), { stars: 0, starsText: '0' });
  assert.deepEqual(parseStarsText(undefined), { stars: 0, starsText: '0' });
  assert.deepEqual(parseStarsText(' 3.0k '), { stars: 3000, starsText: '3k' });
});
