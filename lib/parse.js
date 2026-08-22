'use strict';

/**
 * DESK HARNESS —— 插件安装/商店相关的字符串解析纯函数（无副作用，可单测）。
 */

/** 从 git/pnpm 输出解析安装进度（返回 {percent, stage} 或 null）。 */
function parseProgressChunk(chunk) {
  // git 下载进度
  const gm = chunk.match(/Receiving objects:\s+(\d+)%/);
  if (gm) return { percent: Math.round(10 + Number(gm[1]) * 0.5), stage: '\u4E0B\u8F7D\u4EE3\u7801 ' + gm[1] + '%' };
  const rm = chunk.match(/Resolving deltas:\s+(\d+)%/);
  if (rm) return { percent: 62 + Math.round(Number(rm[1]) * 0.15), stage: '\u89E3\u6790\u4EE3\u7801 ' + rm[1] + '%' };
  if (/Progress: resolved/.test(chunk)) return { percent: 78, stage: '\u89E3\u6790\u4F9D\u8D56\u2026' };
  if (/Packages: \+|Progress: downloaded|Downloading/.test(chunk)) return { percent: 86, stage: '\u4E0B\u8F7D\u4F9D\u8D56\u2026' };
  if (/Running .* script|building/i.test(chunk)) return { percent: 94, stage: '\u6267\u884C\u6784\u5EFA\u811A\u672C\u2026' };
  if (/Progress: resolved \d+/.test(chunk)) return { percent: 90, stage: '\u5B89\u88C5\u4F9D\u8D56\u2026' };
  return null;
}

/** 从 pnpm 报错输出解析 allowBuilds 建议的包名（无则返回 null）。 */
function parseAllowBuildSpec(output) {
  const m = String(output).match(/For example:\s*allowBuilds:\s*(?:\r?\n\s*)+([^\s]+):\s*true/);
  return m ? m[1] : null;
}

/** 从安装日志尾部提取最后一条错误行（无则取最后一行，截断 220 字符）。 */
function lastErrorLine(tail) {
  const m = String(tail || '').match(/\[ERR_[A-Z_]+\][^\n]*/g);
  if (m && m.length) return m[m.length - 1].trim().slice(0, 220);
  const lines = String(tail || '').split('\n').filter(Boolean);
  return lines.length ? lines[lines.length - 1].slice(0, 220) : '';
}

module.exports = { parseProgressChunk, parseAllowBuildSpec, lastErrorLine };
