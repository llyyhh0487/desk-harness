'use strict';

/**
 * DESK HARNESS —— 插件商店「精选区」排名逻辑（纯函数，无副作用）。
 *
 * 从 main.js 提取：精选种子清单 + DSH 相关性信号 + 客观评分 + 补齐排序。
 * 评分依据客观信号：星标 + 维护活跃度 + DSH 相关性 + npm 发布（无人为干预）。
 */

// 精选区人工种子清单（评分自动补齐到 FEATURED_TOTAL 个）
const FEATURED_PLUGINS = [
  'deepseek-ai/deepseek-harness',
  'npm/deepseek-vision',
  'npm/a4phone',
  'npm/@yun520-1/deepseek-heartflow',
  'npm/dsh-webgate',
  'npm/dsh-plugin-writing-guard',
  'npm/dsh-image-pathify',
  'npm/dsh-persist',
  'npm/dsh-plugin-file-explorer',
  'npm/dsh-balance-monitor',
  'npm/jingqing',
  'npm/create-dsh-plugin',
];
const FEATURED_TOTAL = 24;

/** 判断一个仓库是否明确是 DSH 插件（描述/名字/标签含 DSH 信号）。 */
function dshSignal(r) {
  const topics = ((r.topics || []).join(' ').toLowerCase());
  const desc = String(r.desc || '').toLowerCase();
  const name = String(r.fullName || '').toLowerCase();
  return /(^|[^a-z])dsh([^a-z]|$)/.test(desc + ' ' + name)
    || desc.indexOf('deepseek harness') >= 0
    || topics.indexOf('dsh-plugin') >= 0
    || topics.indexOf('deepseek-harness') >= 0;
}

/** 给单个仓库打客观评分。 */
function featuredScore(r) {
  let s = 0;
  const desc = String(r.desc || '').toLowerCase();
  const name = String(r.fullName || '').toLowerCase();
  // DSH 相关性为主
  if (/(^|[^a-z])dsh([^a-z]|$)/.test(desc + ' ' + name) || desc.indexOf('deepseek harness') >= 0) s += 80;
  const topics = ((r.topics || []).join(' ').toLowerCase());
  if (topics.indexOf('dsh-plugin') >= 0 || topics.indexOf('deepseek-harness') >= 0) s += 60;
  // 维护活跃度
  const days = r.updatedAt ? (Date.now() - new Date(r.updatedAt).getTime()) / 86400000 : 9999;
  if (days <= 30) s += 50;
  else if (days <= 90) s += 30;
  // 星标（封顶 200，避免大牌仓库霸榜）
  s += Math.min(r.stars || 0, 200);
  // npm 官方发布
  if (r.fromNpm) s += 10;
  return s;
}

/** 精选区最终名单：种子优先 + 评分补齐到 FEATURED_TOTAL 个。 */
function computeFeatured(repos) {
  const curated = FEATURED_PLUGINS.map((f) => f.toLowerCase());
  const byCurated = repos.filter((r) => curated.indexOf(String(r.fullName).toLowerCase()) >= 0);
  const rest = repos
    .filter((r) => curated.indexOf(String(r.fullName).toLowerCase()) < 0 && dshSignal(r))
    .map((r) => ({ r, s: featuredScore(r) }))
    .sort((a, b) => b.s - a.s)
    .slice(0, Math.max(0, FEATURED_TOTAL - byCurated.length))
    .map((x) => x.r);
  return byCurated.concat(rest).slice(0, FEATURED_TOTAL);
}

module.exports = { FEATURED_PLUGINS, FEATURED_TOTAL, dshSignal, featuredScore, computeFeatured };
