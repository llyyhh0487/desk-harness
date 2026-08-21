'use strict';

/**
 * DESK HARNESS —— 纯函数工具模块（无闭包依赖、无副作用，可独立单测）。
 *
 * 从 main.js 提取出的第一批纯函数，用于：
 * 1. 拆薄 main.js（逐步模块化）；
 * 2. 提供可单元测试的确定性逻辑（node --test test/pure.test.js）。
 *
 * 提取原则：只放"同输入必同输出、不触碰 cfg/mainWin/进程环境"的纯函数。
 * 依赖 spawnSync/fetch/进程环境的函数（shortPath、resolveInstallSpec 等）暂留 main.js。
 */

/** 校验 Node 版本是否 ≥ v22.19.0（部署门槛）。 */
function nodeVerOk(v) {
  const m = String(v || '').match(/^v?(\d+)\.(\d+)/);
  if (!m) return false;
  const maj = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  return maj > 22 || (maj === 22 && min >= 19);
}

/**
 * 清洗 shell 参数：统一走 cmd /d /s /c 时，剔除命令分隔元字符与引号，
 * 杜绝拼接注入。cmd 中 `\"` 不是转义符，引号直接剔除。
 * （Windows 合法路径/包名本就不含 "，故可安全剔除）
 */
function sanitizeShellArg(s) {
  return String(s).replace(/["&|<>^%!]/g, '');
}

/** HTML 实体解码（商店 README/描述字段用）。 */
function htmlDecode(s) {
  return String(s)
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&#x27;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

/**
 * 解析 GitHub 星标文本（如 "1.2k users starred" → 1200）。
 * 返回 { stars: number(整数), starsText: string(展示用) }。
 */
function parseStarsText(text) {
  const t = String(text).replace(/,/g, '').trim();
  const m = t.match(/^([\d.]+)([kK])?$/);
  if (!m) return { stars: 0, starsText: '0' };
  let n = parseFloat(m[1]);
  if (m[2]) n = Math.round(n * 1000);
  const starsText = n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k' : String(n);
  return { stars: Math.round(n), starsText };
}

module.exports = { nodeVerOk, sanitizeShellArg, htmlDecode, parseStarsText };
