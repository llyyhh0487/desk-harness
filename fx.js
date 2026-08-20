/* DeepSeek Harness 桌面版 · 页面特效运行时（注入到网页版页面内）
 * 只添加覆盖层 DOM，不修改网页版自身结构。所有功能受 fx 配置控制。*/
(function () {
  'use strict';
  if (window.__dshFxInstalled) return;
  window.__dshFxInstalled = true;

  var desktop = window.desktop || {};
  var DEFAULTS = {
    effects: true, titlebar: true, tokenChip: true, progressBar: true,
    bgEnabled: true, bgOpacity: 0.45, bgAutoDim: true, bgDataUri: null, bgVideoData: null,
    logoDataUri: null, btnReserve: 150, themeId: 'aurora', lang: 'zh',
  };
  var cfg = {};
  Object.keys(DEFAULTS).forEach(function (k) { cfg[k] = DEFAULTS[k]; });

  // ---------------------------------------------------------------- 多语言（中文 / English）
  var LANG = {
    zh: {
      panel: '\u63A7\u5236\u9762\u677F', panelTip: '\u63A7\u5236\u9762\u677F\uFF08\u5FEB\u6377\u952E Ctrl+K\uFF09',
      loading: '\u6B63\u5728\u52A0\u8F7D\u5DE5\u4F5C\u533A\u2026',
      cpTheme: '\u{1F3A8} \u4E3B\u9898', cpBg: '\u{1F5BC} \u80CC\u666F\u56FE', cpUi: '\u{1F5A5} \u754C\u9762', cpWin: '\u{1F6AA} \u7A97\u53E3', cpTools: '\u{1F527} \u5DE5\u5177', cpLang: '\u{1F310} \u8BED\u8A00 / Language',
      bgChoose: '\u66F4\u6362\u80CC\u666F\u56FE / \u89C6\u9891\u58C1\u7EB8\u2026', bgChooseHint: '\u652F\u6301\u56FE\u7247 \u00B7 MP4 \u00B7 WebM \u00B7 GIF', bgClear: '\u6062\u590D\u9ED8\u8BA4\u80CC\u666F', bgDepth: '\u80CC\u666F\u6DF1\u5EA6', bgAutoDim: '\u81EA\u52A8\u9002\u5E94\uFF08\u8F93\u5165/\u9605\u8BFB\u65F6\u81EA\u52A8\u538B\u4F4E\u80CC\u666F\uFF09',
      uiTitlebar: '\u81EA\u7ED8\u6807\u9898\u680F', uiChip: 'Token \u80F6\u56CA', uiProgress: '\u4EFB\u52A1\u8FDB\u5EA6\u6761',
      winPin: '\u7A97\u53E3\u7F6E\u9876', winAutoStart: '\u5F00\u673A\u81EA\u542F\u52A8', winNotify: '\u4EFB\u52A1\u5B8C\u6210\u901A\u77E5',
      toolsRestart: '\u91CD\u542F\u672C\u5730\u670D\u52A1\u5E76\u91CD\u8F7D', toolsPort: '\u66F4\u6539\u670D\u52A1\u7AEF\u53E3\u2026', toolsConfig: '\u6253\u5F00\u914D\u7F6E\u6587\u4EF6\u5939', toolsLogs: '\u6253\u5F00\u670D\u52A1\u65E5\u5FD7', toolsInstallLog: '\u6253\u5F00\u63D2\u4EF6\u5B89\u88C5\u65E5\u5FD7', toolsTerminal: '\u5728\u5DE5\u4F5C\u533A\u6253\u5F00\u7EC8\u7AEF', toolsDevtools: '\u5F00\u53D1\u8005\u5DE5\u5177', toolsAbout: '\u5173\u4E8E\u684C\u9762\u7248',
      toolsLogo: '\u81EA\u5B9A\u4E49\u56FE\u6807\uFF08\u754C\u9762 + exe\uFF09\u2026', toolsIconReset: '\u6062\u590D\u9ED8\u8BA4\u56FE\u6807',
      paPlaceholder: '\u8F93\u5165\u547D\u4EE4\u6216\u641C\u7D22\u2026', paFoot: '\u2191\u2193 \u9009\u62E9 \u00B7 Enter \u6267\u884C \u00B7 Esc \u5173\u95ED',
      paStore: '\u63D2\u4EF6\u5546\u5E97',
      paBgChoose: '\u66F4\u6362\u80CC\u666F\u56FE / \u89C6\u9891\u58C1\u7EB8\u2026', paBgChooseH: '\u9009\u62E9\u672C\u5730\u56FE\u7247\u6216\u89C6\u9891\u4F5C\u4E3A\u80CC\u666F',
      paBgClear: '\u6062\u590D\u9ED8\u8BA4\u80CC\u666F', paBgClearH: '\u56DE\u5230\u7F51\u9875\u7248\u7EAF\u767D\u80CC\u666F',
      paFxToken: '\u5207\u6362\uFF1AToken \u80F6\u56CA', paFxProgress: '\u5207\u6362\uFF1A\u4EFB\u52A1\u8FDB\u5EA6\u6761',
      paPin: '\u5207\u6362\uFF1A\u7A97\u53E3\u7F6E\u9876', paNotify: '\u5207\u6362\uFF1A\u4EFB\u52A1\u5B8C\u6210\u901A\u77E5', paAutostart: '\u5207\u6362\uFF1A\u5F00\u673A\u81EA\u542F\u52A8',
      paRestart: '\u91CD\u542F\u672C\u5730\u670D\u52A1\u5E76\u91CD\u8F7D',
      paPort: '\u66F4\u6539\u670D\u52A1\u7AEF\u53E3\u2026', paConfig: '\u6253\u5F00\u914D\u7F6E\u6587\u4EF6\u5939', paLogs: '\u6253\u5F00\u670D\u52A1\u65E5\u5FD7', paInstallLog: '\u6253\u5F00\u63D2\u4EF6\u5B89\u88C5\u65E5\u5FD7',
      paTerminal: '\u5728\u5DE5\u4F5C\u533A\u6253\u5F00\u7EC8\u7AEF', paDevtools: '\u5F00\u53D1\u8005\u5DE5\u5177', paAbout: '\u5173\u4E8E\u684C\u9762\u7248',
      termTip: '\u6253\u5F00\u7EC8\u7AEF\u9762\u677F\uFF08\u5F53\u524D\u5DE5\u4F5C\u76EE\u5F55\uFF09',
      docTip: '\u6253\u5F00\u6587\u6863\u9605\u8BFB\uFF08Markdown/\u6587\u672C/\u4EE3\u7801\uFF09',
      cpSplash: '\u{1F680} \u542F\u52A8\u754C\u9762',
      splashBgChoose: '\u542F\u52A8\u9875\u80CC\u666F\u56FE\u2026', splashBgClear: '\u6062\u590D\u9ED8\u8BA4\u542F\u52A8\u9875\u80CC\u666F',
      splashMsg: '\u6B22\u8FCE\u8BED', splashMsgPh: '\u4F8B\u5982\uFF1A\u6B22\u8FCE\u4F7F\u7528 DESK HARNESS',
      splashCountdown: '\u542F\u52A8\u5012\u8BA1\u65F6 3 \u79D2', splashGuide: '\u91CD\u65B0\u67E5\u770B\u9996\u6B21\u4F7F\u7528\u5F15\u5BFC',
    },
    en: {
      panel: 'Control Panel', panelTip: 'Control Panel (shortcut Ctrl+K)',
      loading: 'Loading workspace\u2026',
      cpTheme: '\u{1F3A8} Theme', cpBg: '\u{1F5BC} Background', cpUi: '\u{1F5A5} Interface', cpWin: '\u{1F6AA} Window', cpTools: '\u{1F527} Tools', cpLang: '\u{1F310} Language / \u8BED\u8A00',
      bgChoose: 'Change background / video wallpaper\u2026', bgChooseHint: 'Image \u00B7 MP4 \u00B7 WebM \u00B7 GIF', bgClear: 'Restore default background', bgDepth: 'Background depth', bgAutoDim: 'Auto dim (lower background while typing/reading)',
      uiTitlebar: 'Custom titlebar', uiChip: 'Token chip', uiProgress: 'Task progress bar',
      winPin: 'Always on top', winAutoStart: 'Launch at startup', winNotify: 'Task completion notifications',
      toolsRestart: 'Restart local service & reload', toolsPort: 'Change server port\u2026', toolsConfig: 'Open config folder', toolsLogs: 'Open server log', toolsInstallLog: 'Open plugin install log', toolsTerminal: 'Open terminal in workspace', toolsDevtools: 'Developer tools', toolsAbout: 'About desktop app',
      toolsLogo: 'Custom icon (UI + exe)\u2026', toolsIconReset: 'Restore default icon',
      paPlaceholder: 'Type a command or search\u2026', paFoot: '\u2191\u2193 select \u00B7 Enter run \u00B7 Esc close',
      paStore: 'Plugin store',
      paBgChoose: 'Change background / video wallpaper\u2026', paBgChooseH: 'Pick a local image or video as background',
      paBgClear: 'Restore default background', paBgClearH: 'Back to the plain white web background',
      paFxToken: 'Toggle: token chip', paFxProgress: 'Toggle: task progress bar',
      paPin: 'Toggle: always on top', paNotify: 'Toggle: task notifications', paAutostart: 'Toggle: launch at startup',
      paRestart: 'Restart local service & reload',
      paPort: 'Change server port\u2026', paConfig: 'Open config folder', paLogs: 'Open server log', paInstallLog: 'Open plugin install log',
      paTerminal: 'Open terminal in workspace', paDevtools: 'Developer tools', paAbout: 'About desktop app',
      termTip: 'Open terminal panel (working directory)',
      docTip: 'Open document reader (Markdown/text/code)',
      cpSplash: '\u{1F680} Splash screen',
      splashBgChoose: 'Splash background\u2026', splashBgClear: 'Restore default splash background',
      splashMsg: 'Welcome message', splashMsgPh: 'e.g. Welcome to DESK HARNESS',
      splashCountdown: '3-second launch countdown', splashGuide: 'Show first-run guide again',
    },
  };
  var lang = 'zh';
  function T(key) {
    var d = LANG[lang] || LANG.zh;
    if (d[key] != null) return d[key];
    if (LANG.zh[key] != null) return LANG.zh[key];
    return key;
  }

  var root = null;          // 覆盖层容器
  var titlebarEl = null;    // 自绘标题栏
  var balanceBtnEl = null;  // 余额胶囊按钮（标题栏内）
  var balanceFabBtnEl = null; // 余额浮钮（无标题栏/简洁模式，位于按钮组）
  var balanceBtnEl = null;  // 余额胶囊按钮（标题栏内）
  var balanceFabBtnEl = null; // 余额浮钮（无标题栏/简洁模式，位于按钮组）
  var storeFabEl = null;    // dsh-plugin 商店浮动入口（无标题栏时，简洁模式也保留）
  var termFabEl = null;     // 终端浮动入口（无标题栏时）
  var docFabEl = null;      // 文档阅读浮动入口（无标题栏时）
  var filesFabEl = null;    // 工作区文件浮动入口（无标题栏时）
  var fabRowEl = null;      // 浮动按钮组容器（横向排列）
  var fabEl = null;         // 标题栏关闭时的浮动控制面板入口
  var tokenChip = null;     // token 胶囊
  var chipTextEl = null;    // token 胶囊文本区
  var tokenCard = null;     // token 明细卡
  var ctxBar = null;        // 上下文占用条
  var tbStatus = null;      // 标题栏状态点
  var tbTitle = null;       // 标题栏会话标题
  var progressEl = null;    // 底部任务进度条
  var progressFill = null;
  var progressLabel = null;

  var pollTimer = null, pollBusy = false;
  var themeObserver = null, dark = null;

  // ---------------------------------------------------------------- RPC
  function rpc(method, payload) {
    var rpcId = (window.crypto && crypto.randomUUID)
      ? crypto.randomUUID()
      : 'fx-' + Date.now() + '-' + Math.random().toString(16).slice(2);
    return fetch('/api/' + method, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ type: 'client-request', rpcId: rpcId, method: method, payload: payload || {} }),
    }).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    }).then(function (full) {
      if (full.rpcId !== rpcId) throw new Error('rpcId mismatch');
      if (full.result && full.result.ok === false) throw new Error((full.result.error && full.result.error.message) || 'rpc error');
      return full.result;
    });
  }

  // ---------------------------------------------------------------- 工具
  function $(tag, cls, parent) {
    var el = document.createElement(tag);
    if (cls) el.className = cls;
    if (parent) parent.appendChild(el);
    return el;
  }
  function fmt(n) {
    if (!isFinite(n)) return '0';
    if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
    if (n >= 1e3) return (n / 1e3).toFixed(1) + 'k';
    return String(Math.round(n));
  }
  function fmtDur(ms) {
    if (!ms) return '';
    var s = Math.round(ms / 1000);
    if (s < 60) return s + 's';
    var m = Math.floor(s / 60);
    return m + 'm' + (s % 60) + 's';
  }
  function on(el, ev, fn, opts) {
    el.addEventListener(ev, fn, opts);
    return function () { el.removeEventListener(ev, fn, opts); };
  }

  // ---------------------------------------------------------------- 覆盖层容器
  function ensureRoot() {
    if (root) return root;
    root = $('div', 'dsh-fx-root', document.body);
    return root;
  }

  // ---------------------------------------------------------------- 标题栏
  function ensureTitlebar() {
    if (titlebarEl) return;
    ensureRoot();
    titlebarEl = $('div', 'dsh-titlebar', root);
    var cpBtn = $('button', 'dsh-tb-menu dsh-cp-btn', titlebarEl);
    cpBtn.innerHTML = CP_ICONS.dial;
    cpBtn.classList.add('dsh-tb-icon-btn');
    cpBtn.title = '\u63A7\u5236\u9762\u677F';
    cpBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleControlPanel();
    });
    var logo = $('img', 'dsh-tb-logo', titlebarEl);
    logo.alt = 'DeepSeek';
    logo.draggable = false;
    logo.onerror = function () { logo.style.display = 'none'; };
    if (cfg.logoDataUri) logo.src = cfg.logoDataUri;
    var t = $('span', 'dsh-tb-name', titlebarEl);
    t.textContent = 'DESK HARNESS';
    // 中部弹性区：会话标题 + 状态，超宽时内部截断，绝不溢出窗口
    var mid = $('div', 'dsh-tb-mid', titlebarEl);
    tbTitle = $('span', 'dsh-tb-session', mid);
    tbStatus = $('span', 'dsh-tb-status', mid);
    var right = $('div', 'dsh-tb-right', titlebarEl);
    // 终端入口：位于简洁/个性模式按钮左侧
    var termBtn = $('button', 'dsh-tb-term', right);
    termBtn.textContent = '>_';
    termBtn.title = T('termTip');
    termBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleTerminal();
    });
    // 文档阅读入口：终端左侧
    var docBtn = $('button', 'dsh-tb-term dsh-tb-doc', right);
    docBtn.textContent = '\u{1F4C4}';
    docBtn.title = T('docTip');
    docBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleDoc();
    });
    // 工作区文件入口：文档左侧
    var filesBtn = $('button', 'dsh-tb-term dsh-tb-files', right);
    filesBtn.textContent = '\u{1F4C1}';
    filesBtn.title = lang === 'en' ? 'Workspace files (files/)' : '\u5DE5\u4F5C\u533A\u6587\u4EF6\uFF08files/\uFF09';
    filesBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      win('files-toggle');
    });
    var storeBtn = $('button', 'dsh-store-btn', right);
    storeBtn.textContent = '\u{1F9E9} dsh-plugin';
    storeBtn.title = '\u6253\u5F00 dsh-plugin \u63D2\u4EF6\u5546\u5E97';
    storeBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleStore();
    });
    tokenChip = $('div', 'dsh-token-chip', right);
    // 余额胶囊：显示 DeepSeek 账户余额（每 5 分钟查询一次）
    var balWrap = $('div', 'dsh-balance-chip', right);
    balanceBtnEl = $('button', 'dsh-balance-btn', balWrap);
    balanceBtnEl.textContent = '\u{1F4B0} \u2026';
    balanceBtnEl.title = lang === 'en' ? 'Open DeepSeek usage page' : '\u6253\u5F00 DeepSeek \u7528\u91CF\u9875';
    balanceBtnEl.addEventListener('click', function (e) {
      e.stopPropagation();
      win('open-usage');
    });
    var balHelp = $('span', 'dsh-help', balWrap);
    balHelp.textContent = '?';
    balHelp.setAttribute('data-tip', lang === 'en'
      ? 'Balance is queried every 5 minutes via the API key in .credentials.yaml; click to open the official usage page.'
      : '\u4F59\u989D\u6BCF\u4E94\u5206\u949F\u67E5\u8BE2\u4E00\u6B21\uFF08\u8BFB\u53D6 .credentials.yaml \u4E2D\u7684 API Key\uFF09\uFF1B\u70B9\u51FB\u6309\u94AE\u6253\u5F00\u5B98\u65B9\u7528\u91CF\u9875\u3002');
    refreshBalance();
    chipTextEl = $('span', 'dsh-chip-text', tokenChip);
    ctxBar = $('div', 'dsh-tb-ctx', tokenChip);
    tokenCard = $('div', 'dsh-token-card', tokenChip);
    // 无边框窗口：自绘窗口控制按钮（红黄绿圆点：最小化 / 最大化 / 关闭），与页面无缝融合
    var winCtrls = $('div', 'dsh-tb-winctrls', right);
    var winMin = $('button', 'dsh-tb-winbtn dsh-tb-min', winCtrls);
    winMin.title = '\u6700\u5C0F\u5316';
    winMin.addEventListener('click', function (e) { e.stopPropagation(); win('minimize'); });
    var winMax = $('button', 'dsh-tb-winbtn dsh-tb-max', winCtrls);
    winMax.title = '\u6700\u5927\u5316 / \u8FD8\u539F';
    winMax.addEventListener('click', function (e) { e.stopPropagation(); win('maximize'); });
    var winClose = $('button', 'dsh-tb-winbtn dsh-tb-close', winCtrls);
    winClose.title = '\u5173\u95ED';
    winClose.addEventListener('click', function (e) { e.stopPropagation(); win('close'); });
    titlebarEl.addEventListener('dblclick', function (e) {
      // 仅空白拖拽区双击最大化：所有可交互元素（按钮/输入框/链接/提示）均不触发
      var t = e.target;
      if (t.closest && t.closest('button, input, select, a, .dsh-help, .dsh-tb-right')) return;
      if (desktop.titlebarDblClick) desktop.titlebarDblClick();
    });
    // Token 卡片悬停：JS 管理开关 + 宽限期，快速移入不丢失
    var cardTimer = null;
    function openCard() { if (tokenCard) tokenCard.classList.add('dsh-open'); }
    function closeCard() { if (tokenCard) tokenCard.classList.remove('dsh-open'); }
    tokenChip.addEventListener('mouseenter', function () { if (cardTimer) clearTimeout(cardTimer); openCard(); });
    tokenChip.addEventListener('mouseleave', function () { cardTimer = setTimeout(closeCard, 280); });
    tokenCard.addEventListener('mouseenter', function () { if (cardTimer) clearTimeout(cardTimer); });
    tokenCard.addEventListener('mouseleave', function () { cardTimer = setTimeout(closeCard, 280); });
    document.body.classList.add('dsh-titlebar-on');
    document.documentElement.classList.add('dsh-titlebar-on');
  }
  function removeTitlebar() {
    if (titlebarEl && titlebarEl.parentNode) titlebarEl.parentNode.removeChild(titlebarEl);
    titlebarEl = tokenChip = chipTextEl = tokenCard = ctxBar = tbStatus = tbTitle = null;
    balanceBtnEl = null; // 余额胶囊随标题栏移除，避免悬空引用
    document.body.classList.remove('dsh-titlebar-on');
    document.documentElement.classList.remove('dsh-titlebar-on');
  }
  // 余额刷新（每 5 分钟查询一次；标题栏胶囊与浮动按钮共用同一结果）
  function applyBalance(el, b) {
    if (!el || !b) return;
    if (b.ok && b.total !== null && b.total !== undefined) {
      var v = Number(b.total);
      el.textContent = '\u{1F4B0} \u00A5' + (v >= 100 ? v.toFixed(0) : v.toFixed(2));
      el.classList.remove('dsh-balance-err');
    } else {
      el.textContent = '\u{1F4B0} ' + (b.reason === 'nokey' ? (lang === 'en' ? 'No key' : '\u672A\u914D Key') : 'N/A');
      el.classList.add('dsh-balance-err');
    }
  }
  function balanceEls() {
    return [balanceBtnEl, balanceFabBtnEl].filter(function (el) { return !!el; });
  }
  function refreshBalance() {
    var els = balanceEls();
    if (!els.length) return;
    if (!desktop.getBalance) { els.forEach(function (el) { el.textContent = '\u{1F4B0}'; }); return; }
    desktop.getBalance().then(function (b) {
      els.forEach(function (el) { applyBalance(el, b); });
    }).catch(function () {
      els.forEach(function (el) { el.textContent = '\u{1F4B0} N/A'; });
    });
  }
  // 浮动按钮组（标题栏关闭时，横向排列：控制面板 · 终端 · dsh-plugin · 余额）
  function ensureFabRow() {
    if (fabRowEl) return fabRowEl;
    fabRowEl = $('div', 'dsh-fab-row', document.body);
    return fabRowEl;
  }
  // 无边框窗口的浮动窗口控制按钮（标题栏关闭时，含简洁模式）：
  // macOS 红黄绿圆点，独立固定在右上角，不与浮钮行互相挤压
  var fabWinCtrlsEl = null;
  function ensureWinCtrlsFab() {
    if (fabWinCtrlsEl) return;
    fabWinCtrlsEl = $('div', 'dsh-fab-winctrls', document.body);
    var mk = function (cls, title, action) {
      var b = $('button', 'dsh-fab-winbtn ' + cls, fabWinCtrlsEl);
      b.title = title;
      b.addEventListener('click', function (e) { e.stopPropagation(); win(action); });
      return b;
    };
    mk('dsh-fab-min', '\u6700\u5C0F\u5316', 'minimize');
    mk('dsh-fab-max', '\u6700\u5927\u5316 / \u8FD8\u539F', 'maximize');
    mk('dsh-fab-close', '\u5173\u95ED', 'close');
  }
  // 无边框窗口的透明拖拽条（无标题栏时提供窗口拖拽区域：简洁/关闭标题栏模式）
  var dragStripEl = null;
  function ensureDragStrip() {
    if (dragStripEl) return;
    dragStripEl = $('div', 'dsh-dragstrip', document.body);
    dragStripEl.addEventListener('dblclick', function () {
      if (desktop.titlebarDblClick) desktop.titlebarDblClick();
    });
  }
  function removeDragStrip() {
    if (dragStripEl && dragStripEl.parentNode) dragStripEl.parentNode.removeChild(dragStripEl);
    dragStripEl = null;
  }
  // 自适应并排布局（无标题栏时）：网页头部右侧按钮（如 session log）为锚点——
  // 浮钮排在其左侧、窗口控制圆点排在其右侧，同一行垂直居中；无锚点时优雅回退。
  var floatLayoutTimer = null;
  var floatResizeHandler = null;
  var floatAnchorEl = null;
  function layoutFloats(fullScan) {
    if (!fabRowEl && !fabWinCtrlsEl) return;
    // 性能：全量扫描只在初始/锚点失效时执行；常规轮询只测锚点单个矩形
    if (fullScan || !floatAnchorEl || !floatAnchorEl.isConnected) {
      floatAnchorEl = null;
      var all = document.querySelectorAll('button, [role="button"]');
      var bx = Infinity;
      for (var i = 0; i < all.length; i++) {
        var el = all[i];
        if (el.closest && el.closest('.dsh-fab-row, .dsh-fab-winctrls, .dsh-titlebar')) continue;
        var r = el.getBoundingClientRect();
        if (r.top >= 0 && r.top < 64 && r.x < window.innerWidth && r.right > window.innerWidth * 0.5
          && r.width >= 16 && r.width <= 120 && r.height >= 14 && r.height <= 44 && r.x < bx) {
          bx = r.x;
          floatAnchorEl = el;
        }
      }
    }
    var mid = 28, ax = 0, aright = 0;
    if (floatAnchorEl) {
      var ar = floatAnchorEl.getBoundingClientRect();
      if (ar.x >= window.innerWidth || ar.width < 8) { floatAnchorEl = null; return; } // 失效 → 下周期重扫
      mid = ar.top + ar.height / 2;
      ax = ar.x;
      aright = ar.right;
    }
    // 窗口延伸模式下，网页锚点随 body margin 自动左移，浮钮跟随锚点即可（无需额外偏移）
    if (fabWinCtrlsEl) {
      // 圆点在锚点按钮右侧（右侧被挤到窗口外时贴边）
      var dotsRight = floatAnchorEl ? Math.max(4, window.innerWidth - aright - 10 - 55) : 8;
      fabWinCtrlsEl.style.top = Math.round(mid - 7) + 'px';
      fabWinCtrlsEl.style.right = Math.round(dotsRight) + 'px';
    }
    if (fabRowEl) {
      // 浮钮行在锚点按钮左侧
      var rowRight = floatAnchorEl ? (window.innerWidth - ax + 14) : 76;
      fabRowEl.style.top = Math.round(mid - 15) + 'px';
      fabRowEl.style.right = Math.round(rowRight) + 'px';
    }
  }
  function startFloatLayout() {
    stopFloatLayout();
    floatAnchorEl = null;
    layoutFloats(true);
    // 保存具名引用：removeEventListener 需要同一函数引用（匿名包装会泄漏监听器）
    floatResizeHandler = function () { floatAnchorEl = null; layoutFloats(true); };
    window.addEventListener('resize', floatResizeHandler);
    floatLayoutTimer = setInterval(function () { layoutFloats(false); }, 2000); // 抽屉开合/页面状态变化时自动适配
  }
  function stopFloatLayout() {
    if (floatLayoutTimer) { clearInterval(floatLayoutTimer); floatLayoutTimer = null; }
    if (floatResizeHandler) { window.removeEventListener('resize', floatResizeHandler); floatResizeHandler = null; }
    floatAnchorEl = null;
  }
  function removeFabRow() {
    if (fabRowEl && fabRowEl.parentNode) fabRowEl.parentNode.removeChild(fabRowEl);
    fabRowEl = null;
    storeFabEl = termFabEl = docFabEl = filesFabEl = fabEl = null;
    balanceFabBtnEl = null;
    if (fabWinCtrlsEl && fabWinCtrlsEl.parentNode) fabWinCtrlsEl.parentNode.removeChild(fabWinCtrlsEl);
    fabWinCtrlsEl = null;
  }
  // dsh-plugin 浮动入口（标题栏关闭时，含简洁模式）
  function ensureStoreFab() {
    ensureFabRow();
    if (storeFabEl) return;
    storeFabEl = $('button', 'dsh-store-fab', fabRowEl);
    storeFabEl.innerHTML = '\u{1F9E9} <span>dsh-plugin</span>';
    storeFabEl.title = T('paStore');
    storeFabEl.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleStore();
    });
  }
  // 终端浮动入口（位于 dsh-plugin 左侧）
  // 文档阅读浮动入口（终端左侧）
  function ensureDocFab() {
    ensureFabRow();
    if (docFabEl) return;
    docFabEl = $('button', 'dsh-term-fab dsh-doc-fab', fabRowEl);
    docFabEl.innerHTML = '\u{1F4C4} <span>' + (lang === 'en' ? 'Docs' : '\u6587\u6863') + '</span>';
    docFabEl.title = T('docTip');
    docFabEl.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleDoc();
    });
  }
  // 工作区文件浮动入口（文档左侧）
  function ensureFilesFab() {
    ensureFabRow();
    if (filesFabEl) return;
    filesFabEl = $('button', 'dsh-term-fab dsh-files-fab', fabRowEl);
    filesFabEl.innerHTML = '\u{1F4C1} <span>' + (lang === 'en' ? 'Files' : '\u6587\u4EF6') + '</span>';
    filesFabEl.title = lang === 'en' ? 'Workspace files (files/)' : '\u5DE5\u4F5C\u533A\u6587\u4EF6\uFF08files/\uFF09';
    filesFabEl.addEventListener('click', function (e) {
      e.stopPropagation();
      win('files-toggle');
    });
  }
  function ensureTermFab() {
    ensureFabRow();
    if (termFabEl) return;
    termFabEl = $('button', 'dsh-term-fab', fabRowEl);
    termFabEl.innerHTML = '>_ <span>' + (lang === 'en' ? 'Terminal' : '\u7EC8\u7AEF') + '</span>';
    termFabEl.title = T('termTip');
    termFabEl.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleTerminal();
    });
  }
  // 余额浮钮（无标题栏时，含简洁模式）：显示余额 + 问号提示，点击打开用量页
  function ensureBalanceFab() {
    ensureFabRow();
    if (balanceFabBtnEl) return;
    var wrap = $('div', 'dsh-balance-fab', fabRowEl);
    balanceFabBtnEl = $('button', 'dsh-balance-fab-btn', wrap);
    balanceFabBtnEl.textContent = '\u{1F4B0} \u2026';
    balanceFabBtnEl.title = lang === 'en' ? 'Open DeepSeek usage page' : '\u6253\u5F00 DeepSeek \u7528\u91CF\u9875';
    balanceFabBtnEl.addEventListener('click', function (e) {
      e.stopPropagation();
      win('open-usage');
    });
    var help = $('span', 'dsh-help', wrap);
    help.textContent = '?';
    help.setAttribute('data-tip', lang === 'en'
      ? 'Balance is queried every 5 minutes via the API key in .credentials.yaml; click to open the official usage page.'
      : '\u4F59\u989D\u6BCF\u4E94\u5206\u949F\u67E5\u8BE2\u4E00\u6B21\uFF08\u8BFB\u53D6 .credentials.yaml \u4E2D\u7684 API Key\uFF09\uFF1B\u70B9\u51FB\u6309\u94AE\u6253\u5F00\u5B98\u65B9\u7528\u91CF\u9875\u3002');
    refreshBalance();
  }

  // ---------------------------------------------------------------- 进度条
  function ensureProgress() {
    if (progressEl) return;
    ensureRoot();
    progressEl = $('div', 'dsh-progress', root);
    progressFill = $('div', 'dsh-progress-fill', progressEl);
    progressLabel = $('div', 'dsh-progress-label', root);
  }
  function removeProgress() {
    if (progressEl && progressEl.parentNode) progressEl.parentNode.removeChild(progressEl);
    if (progressLabel && progressLabel.parentNode) progressLabel.parentNode.removeChild(progressLabel);
    progressEl = progressFill = progressLabel = null;
    if (desktop.taskProgress) desktop.taskProgress({ mode: 'none' });
  }

  // ---------------------------------------------------------------- 插件商店
  var storeState = {
    open: false, repos: [], installed: [], versions: {}, page: 1, hasMore: false,
    filter: '', tag: null, selected: {}, busy: false, statuses: {}, restartable: false,
    mirrors: [], mirror: 'direct', pings: null, error: false, detail: null,
    source: '', pinged: false,
    sort: 'stars',            // 排序：stars 热门 | name 名称 | newest 最新
    instFilter: 'all',        // 安装状态筛选：all 全部 | not 未安装 | yes 已安装
    limit: 60,                // 渐进式渲染：每次最多渲染的插件数（滚动到底自动加载更多）
    section: 'all',           // 分区：featured 精选 | hot 热门 | all 全部 | mine 我的插件
    featured: [],             // 精选列表（主进程计算下发）
    updates: [],              // 已装插件的新版本信息 [{name,current,latest}]
    loadedOnce: false,        // 本地索引加载提示只显示一次（后续静默，秒开不打扰）
  };
  var storeEl = null, storeListEl = null, storeSearchEl = null, storeStatusEl = null;
  var storeBatchBtn = null, storeMoreBtn = null, storeSelectAllEl = null, storeCancelBtn = null;
  var tagsEl = null;
  var detailEl = null, detailTitleEl = null, detailBodyEl = null, detailInstallBtn = null, detailUninstallBtn = null;

  function ensureStore() {
    if (storeEl) return;
    ensureRoot();
    storeEl = $('div', 'dsh-store', root);
    var head = $('div', 'dsh-store-head', storeEl);
    var ht = $('div', null, head);
    var t = $('div', 'dsh-store-title', ht);
    t.textContent = 'dsh-plugin';
    // 可点击的索引源链接：跳到 GitHub 主题页
    var src = $('a', 'dsh-store-src', ht);
    src.textContent = 'github.com/topics/dsh-plugin · \u5168\u91CF\u7D22\u5F15';
    src.href = 'https://github.com/topics/dsh-plugin';
    src.title = lang === 'en' ? 'Open the dsh-plugin topic on GitHub' : '\u5728 GitHub \u6253\u5F00 dsh-plugin \u4E3B\u9898\u9875';
    src.addEventListener('click', function (e) {
      e.preventDefault();
      if (desktop.openExternal) desktop.openExternal('https://github.com/topics/dsh-plugin');
    });
    var close = $('button', 'dsh-store-close', head);
    close.textContent = '\u2715';
    close.title = '\u5173\u95ED';
    close.style.fontSize = '18px';
    close.style.width = '32px';
    close.style.height = '32px';
    close.addEventListener('click', function () { toggleStore(false); });
    var tools = $('div', 'dsh-store-tools', storeEl);
    storeSearchEl = $('input', 'dsh-store-search', tools);
    storeSearchEl.placeholder = '\u7B5B\u9009\u63D2\u4EF6\uFF08\u540D\u79F0/\u63CF\u8FF0/\u6807\u7B7E\uFF09';
    var searchDebounce = null;
    storeSearchEl.addEventListener('input', function () {
      // 性能：200ms 防抖，避免每次按键都全量过滤/打分（视觉无差异）
      if (searchDebounce) clearTimeout(searchDebounce);
      searchDebounce = setTimeout(function () {
        storeState.filter = storeSearchEl.value.trim().toLowerCase();
        renderStoreList();
      }, 200);
    });
    // 排序 + 安装状态筛选（镜像选择已移除：安装时按需选择）
    var sortSel = $('select', 'dsh-store-sel', tools);
    sortSel.title = '\u6392\u5E8F\u65B9\u5F0F';
    [['stars', '\u{1F525} \u70ED\u95E8'], ['name', '\u540D\u79F0 A-Z'], ['newest', '\u65F6\u95F4\u6700\u65B0']].forEach(function (o) {
      var op = document.createElement('option');
      op.value = o[0]; op.textContent = o[1];
      if (o[0] === storeState.sort) op.selected = true;
      sortSel.appendChild(op);
    });
    sortSel.addEventListener('change', function () { storeState.sort = sortSel.value; renderStoreList(); });
    var instSel = $('select', 'dsh-store-sel', tools);
    instSel.title = '\u5B89\u88C5\u72B6\u6001\u7B5B\u9009';
    [['all', '\u5168\u90E8'], ['not', '\u672A\u5B89\u88C5'], ['yes', '\u5DF2\u5B89\u88C5']].forEach(function (o) {
      var op = document.createElement('option');
      op.value = o[0]; op.textContent = o[1];
      if (o[0] === storeState.instFilter) op.selected = true;
      instSel.appendChild(op);
    });
    instSel.addEventListener('change', function () { storeState.instFilter = instSel.value; renderStoreList(); });
    // 镜像选择已移除：在安装确认（chooser）时按需选择镜像并测速
    var sa = $('label', 'dsh-store-selectall', tools);
    storeSelectAllEl = $('input', null, sa);
    storeSelectAllEl.type = 'checkbox';
    sa.appendChild(document.createTextNode(' \u5168\u9009'));
    storeSelectAllEl.addEventListener('change', function () {
      var visible = filteredRepos();
      if (storeSelectAllEl.checked) {
        visible.forEach(function (r) { storeState.selected[r.fullName] = true; });
      } else {
        visible.forEach(function (r) { delete storeState.selected[r.fullName]; });
      }
      renderStoreList();
    });
    // 分区标签：精选 / 全部 / 我的插件
    var sectBar = $('div', 'dsh-store-sects', storeEl);
    [
      ['featured', '\u{1F31F} ' + (lang === 'en' ? 'Featured' : '\u7CBE\u9009')],
      ['all', lang === 'en' ? 'All' : '\u5168\u90E8'],
      ['mine', '\u{1F4E6} ' + (lang === 'en' ? 'My plugins' : '\u6211\u7684\u63D2\u4EF6')],
    ].forEach(function (s) {
      var b = $('button', 'dsh-store-sect' + (storeState.section === s[0] ? ' on' : ''), sectBar);
      b.textContent = s[1];
      b.addEventListener('click', function () {
        storeState.section = s[0];
        var bs = sectBar.querySelectorAll('.dsh-store-sect');
        for (var i = 0; i < bs.length; i++) bs[i].classList.toggle('on', bs[i] === b);
        renderStoreList();
      });
    });
    // 手动安装：索引未收录的低星插件可直接输入 owner/repo 安装（如 xzyonline/dsh-chat-files）
    var manualRow = $('div', 'dsh-store-manual', storeEl);
    var manualInput = $('input', 'dsh-store-manual-input', manualRow);
    manualInput.placeholder = lang === 'en' ? 'Plugin not listed? Type owner/repo, npm pkg name, or GitHub URL, press Enter' : '\u627E\u4E0D\u5230\u63D2\u4EF6\uFF1F\u8F93\u5165 GitHub \u4ED3\u5E93\u540D\uFF08owner/repo\uFF09\u3001npm \u5305\u540D\u6216 GitHub \u94FE\u63A5\uFF0C\u56DE\u8F66\u5B89\u88C5';
    manualInput.setAttribute('spellcheck', 'false');
    manualInput.setAttribute('autocomplete', 'off');
    var manualBtn = $('button', 'dsh-store-manual-btn', manualRow);
    manualBtn.textContent = lang === 'en' ? 'Install' : '\u5B89\u88C5';
    var doManualInstall = function () {
      var raw = manualInput.value.trim();
      if (!raw) return;
      // 支持粘贴 GitHub URL：https://github.com/owner/repo → 提取 owner/repo
      var urlMatch = raw.match(/github\.com\/([^\/]+\/[^\/]+?)(?:\/|$|\.git)/i);
      if (urlMatch) raw = urlMatch[1];
      manualInput.value = raw;
      if (!/^[A-Za-z0-9@._-]+(\/[A-Za-z0-9@._-]+){0,2}$/.test(raw) || raw.length > 200) {
        showStoreStatus(lang === 'en' ? 'Invalid name format' : '\u63D2\u4EF6\u540D\u683C\u5F0F\u65E0\u6548\uFF0C\u5E94\u4E3A owner/repo \u6216 @scope/pkg', 'fail');
        return;
      }
      installPlugins([raw], undefined);
    };
    manualBtn.addEventListener('click', doManualInstall);
    manualInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') doManualInstall(); });
    tagsEl = $('div', 'dsh-store-tags', storeEl);
    storeListEl = $('div', 'dsh-store-list', storeEl);
    // 滚动到底自动加载更多（网页式自由浏览）
    storeListEl.addEventListener('scroll', function () {
      if (storeListEl.scrollTop + storeListEl.clientHeight > storeListEl.scrollHeight - 260) {
        var more = filteredRepos().length > storeState.limit;
        if (more) { storeState.limit += 60; renderStoreList(); }
      }
    });
    var foot = $('div', 'dsh-store-foot', storeEl);
    storeMoreBtn = $('button', 'dsh-store-more', foot);
    storeMoreBtn.textContent = '\u21BB \u5237\u65B0';
    storeMoreBtn.addEventListener('click', function () { refreshStore(); });
    storeBatchBtn = $('button', 'dsh-store-batch', foot);
    storeBatchBtn.addEventListener('click', batchInstall);
    storeCancelBtn = $('button', 'dsh-store-more', foot);
    storeCancelBtn.textContent = '\u53D6\u6D88\u5B89\u88C5';
    storeCancelBtn.style.display = 'none';
    storeCancelBtn.addEventListener('click', function () {
      if (desktop.storeCancel) desktop.storeCancel();
    });
    storeStatusEl = $('div', 'dsh-store-status', storeEl);
    updateBatchBtn();
  }

  function toggleStore(open) {
    ensureStore();
    var want = (open === undefined) ? !storeState.open : !!open;
    storeState.open = want;
    storeEl.classList.toggle('open', want);
    document.body.classList.toggle('dsh-store-open', want);
    var sb = titlebarEl ? titlebarEl.querySelector('.dsh-store-btn') : null;
    if (sb) sb.classList.toggle('dsh-active', want);
    if (want) {
      // 互斥：打开 dsh-plugin 时收起侧挂停靠窗口（主进程幂等处理，未开则无操作）
      win('dock-close');
      toggleControlPanel(false);
      togglePalette(false);
      if (!storeState.repos.length) loadStore();
    } else {
      closeDetail();
      // 释放商店搜索框焦点：避免关闭后打字落入隐藏输入框
      if (storeSearchEl && document.activeElement === storeSearchEl) storeSearchEl.blur();
    }
  }

  var fpCache = { key: '', list: null, installedSig: '' };
  function filteredRepos() {
    // 性能：结果记忆化——同参数/已安装状态不变时直接复用（renderStoreList 每次渲染多次调用）
    var instSig = storeState.installed.join(',');
    var key = storeState.filter + '|' + storeState.tag + '|' + storeState.instFilter + '|' + storeState.sort + '|' + storeState.repos.length + '|' + instSig;
    if (fpCache.key === key && fpCache.list) return fpCache.list;
    var list = storeState.repos;
    if (storeState.tag) {
      list = list.filter(function (r) { return (r.topics || []).indexOf(storeState.tag) >= 0; });
    }
    // 安装状态筛选
    if (storeState.instFilter === 'not') {
      list = list.filter(function (r) { return !isInstalled(r.fullName); });
    } else if (storeState.instFilter === 'yes') {
      list = list.filter(function (r) { return isInstalled(r.fullName); });
    }
    // 搜索：按相关度打分排序（名称前缀 > 名称包含 > 描述包含 > 标签包含）
    if (storeState.filter) {
      var q = storeState.filter;
      list = list.map(function (r) {
        var name = r.fullName.toLowerCase();
        var desc = (r.desc || '').toLowerCase();
        var score = -1;
        if (name.indexOf(q) === 0) score = 100;
        else if (name.indexOf(q) >= 0) score = 80;
        else if (desc.indexOf(q) >= 0) score = 60;
        else if ((r.topics || []).some(function (t) { return t.indexOf(q) >= 0; })) score = 40;
        return { r: r, score: score };
      }).filter(function (x) { return x.score > 0; })
        .sort(function (a, b) { return b.score - a.score; })
        .map(function (x) { return x.r; });
    }
    // 排序
    var sorted = list.slice();
    if (storeState.sort === 'name') {
      sorted.sort(function (a, b) { return a.fullName.toLowerCase() < b.fullName.toLowerCase() ? -1 : 1; });
    } else if (storeState.sort === 'newest') {
      sorted.sort(function (a, b) { return (b.updatedAt || 0) - (a.updatedAt || 0); });
    } else {
      sorted.sort(function (a, b) { return (b.stars || 0) - (a.stars || 0); });
    }
    fpCache = { key: key, list: sorted, installedSig: instSig };
    return sorted;
  }

  function applyStoreData(r) {
    storeState.error = false;
    var prevCount = storeState.repos ? storeState.repos.length : 0;
    storeState.repos = r.repos || [];
    storeState.installed = r.installed || [];
    storeState.versions = r.versions || {};
    storeState.mirrors = r.mirrors || [];
    storeState.mirror = r.mirror || 'direct';
    storeState.source = r.source || '';
    storeState.featured = r.featured || [];
    computeTags();
    renderStoreList();
    checkUpdates(false); // 后台检测已装插件更新（红点角标）
    // 增量更新提示：比上次多出的插件数量
    if (prevCount > 0 && storeState.repos.length > prevCount) {
      showStoreStatus('\u7D22\u5F15\u66F4\u65B0\uFF1A\u65B0\u589E ' + (storeState.repos.length - prevCount) + ' \u4E2A\u63D2\u4EF6\uFF08\u5171 ' + storeState.repos.length + ' \u4E2A\uFF09', 'delta');
    }
  }

  function loadStore() {
    if (storeState.busy) return;
    if (!desktop.storeIndex) {
      showStoreStatus('\u9700\u8981\u684C\u9762\u7248\u4E3B\u8FDB\u7A0B\u652F\u6301', 'fail');
      return;
    }
    storeState.busy = true;
    if (storeMoreBtn) storeMoreBtn.disabled = true;
    renderStoreList(); // 立即显示「加载中…」占位
    desktop.storeIndex().then(function (r) {
      storeState.busy = false;
      if (storeMoreBtn) storeMoreBtn.disabled = false;
      if (!r || r.ok === false) {
        storeState.error = ((r && r.error) || '\u7F51\u7EDC\u9519\u8BEF');
        showStoreStatus('\u52A0\u8F7D\u5931\u8D25\uFF1A' + storeState.error, 'fail');
        renderStoreList();
        return;
      }
      applyStoreData(r);
      if (r.source === 'cache') {
        // 本地索引秒开：只在首次或异常时提示，之后静默（不打扰）
        if (!storeState.loadedOnce) {
          storeState.loadedOnce = true;
          var warn = r.warn === 'refresh-failed' ? (lang === 'en' ? '（后台刷新失败，可稍后点 ↻ 刷新）' : '\uFF08\u540E\u53F0\u5237\u65B0\u5931\u8D25\uFF0C\u53EF\u7A0D\u540E\u70B9 \u21BB \u5237\u65B0\uFF09') : '';
          showStoreStatus('\u5DF2\u4ECE\u672C\u5730\u7D22\u5F15\u52A0\u8F7D ' + storeState.repos.length + ' \u4E2A\u63D2\u4EF6' + warn);
        } else if (r.warn === 'refresh-failed') {
          showStoreStatus(lang === 'en' ? 'Background refresh failed, showing local index' : '\u540E\u53F0\u5237\u65B0\u5931\u8D25\uFF0C\u663E\u793A\u672C\u5730\u7D22\u5F15', 'fail');
        }
      } else {
        showStoreStatus('\u5DF2\u52A0\u8F7D\u5168\u90E8 ' + storeState.repos.length + ' \u4E2A\u63D2\u4EF6\uFF08' + (r.source === 'search' ? 'Search API' : 'topic') + '\uFF09');
      }
    }).catch(function (e) {
      storeState.busy = false;
      if (storeMoreBtn) storeMoreBtn.disabled = false;
      storeState.error = (e && e.message) || '\u7F51\u7EDC\u9519\u8BEF';
      showStoreStatus('\u52A0\u8F7D\u5931\u8D25\uFF1A' + storeState.error, 'fail');
      renderStoreList();
    });
  }

  function refreshStore() {
    if (!desktop.storeRefresh || storeState.busy) return;
    storeState.busy = true;
    if (storeMoreBtn) storeMoreBtn.disabled = true;
    showStoreStatus('\u6B63\u5728\u4ECE\u7F51\u7EDC\u66F4\u65B0\u7D22\u5F15\u2026');
    desktop.storeRefresh().then(function (r) {
      storeState.busy = false;
      if (storeMoreBtn) storeMoreBtn.disabled = false;
      if (r && r.ok) {
        var before = storeState.repos ? storeState.repos.length : 0;
        applyStoreData(r);
        var after = storeState.repos.length;
        if (before > 0 && after > before) showStoreStatus('\u7D22\u5F15\u66F4\u65B0\uFF1A\u65B0\u589E ' + (after - before) + ' \u4E2A\u63D2\u4EF6\uFF08\u5171 ' + after + ' \u4E2A\uFF09', 'delta');
        else if (before > 0) showStoreStatus('\u7D22\u5F15\u5DF2\u66F4\u65B0\uFF1A\u5171 ' + after + ' \u4E2A\u63D2\u4EF6\uFF08\u65E0\u65B0\u589E\uFF09');
        else showStoreStatus('\u5DF2\u52A0\u8F7D ' + after + ' \u4E2A\u63D2\u4EF6');
      } else {
        showStoreStatus('\u66F4\u65B0\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u7F51\u7EDC', 'fail');
      }
    }).catch(function (e) {
      storeState.busy = false;
      if (storeMoreBtn) storeMoreBtn.disabled = false;
      showStoreStatus('\u66F4\u65B0\u5931\u8D25\uFF1A' + (e && e.message), 'fail');
    });
  }

  function computeTags() {
    var freq = {};
    storeState.repos.forEach(function (r) {
      (r.topics || []).forEach(function (t) { freq[t] = (freq[t] || 0) + 1; });
    });
    storeState.allTags = Object.keys(freq).sort(function (a, b) { return freq[b] - freq[a]; }).slice(0, 14);
    if (storeState.tag && storeState.allTags.indexOf(storeState.tag) < 0) storeState.tag = null;
  }

  function renderTags() {
    if (!tagsEl) return;
    tagsEl.innerHTML = '';
    if (!storeState.allTags || !storeState.allTags.length) return;
    var all = $('span', 'dsh-tag' + (!storeState.tag ? ' sel' : ''), tagsEl);
    all.textContent = '\u5168\u90E8';
    all.addEventListener('click', function () { storeState.tag = null; renderStoreList(); renderTags(); });
    storeState.allTags.forEach(function (t) {
      var chip = $('span', 'dsh-tag' + (storeState.tag === t ? ' sel' : ''), tagsEl);
      chip.textContent = t;
      chip.addEventListener('click', function () {
        storeState.tag = storeState.tag === t ? null : t;
        renderStoreList();
        renderTags();
      });
    });
  }

  function isInstalled(full) {
    var name = pluginBasename(full);
    return storeState.installed.some(function (d) {
      return d === full || pluginBasename(d) === name;
    });
  }

  // 插件名归一化：'npm/@scope/pkg' / '@scope/pkg' / 'owner/repo' → 最后一段 'pkg'|'repo'
  function pluginBasename(full) {
    var s = String(full || '');
    if (s.indexOf('npm/') === 0) s = s.slice(4);
    var seg = s.split('/');
    return seg[seg.length - 1] || s;
  }

  // 卡片对应的已装包全名（用于取当前版本号）
  function installedNameOf(full) {
    var base = pluginBasename(full);
    return storeState.installed.find(function (d) { return pluginBasename(d) === base; }) || '';
  }

  function updateBatchBtn() {
    if (!storeBatchBtn) return;
    var n = Object.keys(storeState.selected).length;
    storeBatchBtn.textContent = n ? ('\u6279\u91CF\u5B89\u88C5 (' + n + ')') : '\u6279\u91CF\u5B89\u88C5';
  }

  function renderStoreList() {
    if (!storeListEl) return;
    if (storeState.section !== 'all') { renderSectionCards(storeState.section); return; }
    if (tagsEl) tagsEl.style.display = '';
    renderTags();
    var all = filteredRepos();
    var list = all.slice(0, storeState.limit);
    storeListEl.innerHTML = '';
    // 结果计数（有搜索/筛选时显示）
    var showCount = (storeState.filter || storeState.tag || storeState.instFilter !== 'all') && all.length;
    if (showCount) {
      var cnt = $('div', 'dsh-store-count', storeListEl);
      cnt.textContent = lang === 'en' ? (all.length + ' results') : ('\u627E\u5230 ' + all.length + ' \u4E2A\u7ED3\u679C');
    }
    if (!all.length) {
      var em = $('div', 'dsh-store-empty', storeListEl);
      if (storeState.repos.length) {
        var emT = $('div', null, em);
        emT.textContent = '\u6CA1\u6709\u627E\u5230\u76F8\u5173\u63D2\u4EF6\u3002\u53EF\u4EE5\u8BD5\u8BD5\u66F4\u6362\u5173\u952E\u8BCD\uFF08\u652F\u6301\u540D\u79F0/\u63CF\u8FF0/\u6807\u7B7E\uFF09\uFF0C\u6216\u70B9\u5E95\u90E8\u300C\u21BB \u5237\u65B0\u300D\u83B7\u53D6\u6700\u65B0\u7D22\u5F15\uFF08\u5F53\u524D\u5171 ' + storeState.repos.length + ' \u4E2A\u63D2\u4EF6\uFF09\u3002';
      } else if (storeState.error) {
        em.textContent = '\u52A0\u8F7D\u5931\u8D25\uFF1A' + storeState.error;
        var retry = $('button', 'dsh-retry', em);
        retry.textContent = '\u21BB \u91CD\u65B0\u52A0\u8F7D';
        retry.addEventListener('click', function () { loadStore(); });
      } else if (storeState.busy) {
        em.textContent = '\u52A0\u8F7D\u4E2D\u2026';
      } else {
        em.textContent = '\u70B9\u51FB\u300C\u52A0\u8F7D\u66F4\u591A\u300D\u83B7\u53D6\u63D2\u4EF6';
      }
      return;
    }
    list.forEach(function (r) {
      var card = $('div', 'dsh-plug', storeListEl);
      var st = storeState.statuses[r.fullName];
      if (st && st.state === 'installing') card.classList.add('installing');
      card.addEventListener('click', function () { openDetail(r); });
      var top = $('div', 'dsh-plug-top', card);
      var cb = $('input', null, top);
      cb.type = 'checkbox';
      cb.checked = !!storeState.selected[r.fullName];
      cb.addEventListener('click', function (e) { e.stopPropagation(); });
      cb.addEventListener('change', function () {
        if (cb.checked) storeState.selected[r.fullName] = true;
        else delete storeState.selected[r.fullName];
        updateBatchBtn();
      });
      var name = $('span', 'dsh-plug-name', top);
      name.textContent = r.fullName;
      var stars = $('span', 'dsh-plug-stars', top);
      stars.textContent = r.fromNpm ? ('\u{1F4E6} ' + (r.starsText || '')) : ('\u2B50 ' + (r.starsText || '0'));
      var desc = $('div', 'dsh-plug-desc', card);
      desc.textContent = r.desc || r.description || '\uFF08\u65E0\u63CF\u8FF0\uFF09';
      // 标签行
      if (r.topics && r.topics.length) {
        var tagRow = $('div', 'dsh-plug-tags', card);
        r.topics.slice(0, 3).forEach(function (t) {
          var chip = $('span', 'dsh-plug-tag', tagRow);
          chip.textContent = t;
          chip.title = '\u7B5B\u9009\u8BE5\u6807\u7B7E';
          chip.addEventListener('click', function (e) {
            e.stopPropagation();
            storeState.tag = t;
            renderStoreList();
          });
        });
      }
      var bar = $('div', 'dsh-plug-progress', card);
      var fill = $('i', null, bar);
      var stageEl = $('div', 'dsh-plug-stage', card);
      if (st && st.state === 'installing') {
        fill.style.width = (st.percent !== undefined ? st.percent : 12) + '%';
        stageEl.textContent = st.stage || '';
      }
      var bot = $('div', 'dsh-plug-bot', card);
      var installed = isInstalled(r.fullName);
      if (installed) {
        var badge = $('span', 'dsh-badge', bot);
        badge.textContent = '\u5DF2\u5B89\u88C5';
      }
      var uninstalling = st && st.state === 'uninstalling';
      var btn = $('button', 'dsh-install' + ((installed || uninstalling) ? ' dsh-uninstall' : '') + (st && st.state === 'installing' ? ' dsh-cancel dsh-installing' : ''), bot);
      if (uninstalling) {
        btn.textContent = '\u5378\u8F7D\u4E2D\u2026';
        btn.disabled = true;
      } else if (installed) {
        btn.textContent = '\u5378\u8F7D';
        btn.disabled = !!storeState.busy;
      } else {
        btn.textContent = (st && st.state === 'installing') ? '\u53D6\u6D88\u5B89\u88C5' : (st && st.state === 'ok' ? '\u2713 \u5B89\u88C5\u6210\u529F' : '\u5B89\u88C5');
        btn.disabled = (st && st.state === 'installing') ? false : (!!storeState.busy || (st && st.state === 'ok'));
      }
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (uninstalling) return;
        if (st && st.state === 'installing') {
          if (desktop.storeCancel) desktop.storeCancel();
          return;
        }
        if (installed) { uninstallOne(r.fullName); return; }
        installPlugins([r.fullName]);
      });
    });
    // 渐进式浏览：还有更多时显示「加载更多」（滚动到底也会自动加载）
    if (all.length > list.length) {
      var moreBtn = $('button', 'dsh-store-loadmore', storeListEl);
      moreBtn.textContent = lang === 'en' ? ('Load more (' + (all.length - list.length) + ' more)') : ('\u52A0\u8F7D\u66F4\u591A\uFF08\u8FD8\u5269 ' + (all.length - list.length) + ' \u4E2A\uFF09');
      moreBtn.addEventListener('click', function () {
        storeState.limit += 60;
        renderStoreList();
      });
    }
    updateBatchBtn();
    if (storeMoreBtn) storeMoreBtn.disabled = storeState.busy; // 刷新按钮仅在忙时禁用（修复 hasMore 恒 false 导致的永久禁用）
    if (storeCancelBtn) storeCancelBtn.style.display = storeState.busy ? '' : 'none';
    if (storeSelectAllEl) {
      storeSelectAllEl.checked = list.length > 0 && list.every(function (r) { return !!storeState.selected[r.fullName]; });
    }
  }

  // ---------------- 分区视图（精选 / 我的插件）：卡片网格 ----------------
  function sectionCardList(section) {
    if (section === 'featured') {
      var feats = storeState.featured || [];
      if (feats.length) return feats;
      // 精选未下发时兜底：评分制前 24 个（与主进程口径一致）
      var now = Date.now();
      return (storeState.repos || []).slice().sort(function (a, b) {
        var sa = (a.stars || 0) + (a.updatedAt && now - new Date(a.updatedAt).getTime() < 30 * 86400000 ? 50 : 0) + (a.fromNpm ? 10 : 0);
        var sb = (b.stars || 0) + (b.updatedAt && now - new Date(b.updatedAt).getTime() < 30 * 86400000 ? 50 : 0) + (b.fromNpm ? 10 : 0);
        return sb - sa;
      }).slice(0, 24);
    }
    if (section === 'mine') {
      // 我的插件：已装列表（含版本/更新信息）；storeState.installed 为名字列表
      var mine = [];
      var nameToRepo = {};
      (storeState.repos || []).forEach(function (r) {
        nameToRepo[pluginBasename(r.fullName)] = r;
      });
      (storeState.installed || []).forEach(function (n) {
        var repo = nameToRepo[pluginBasename(n)] || {
          // 索引里没有的包：按 npm 语义构造卡片（更新/详情走 npm 注册表，作用域包也正确）
          fullName: 'npm/' + String(n), name: String(n), desc: '', stars: 0, starsText: '', topics: [], fromNpm: true,
          url: 'https://www.npmjs.com/package/' + String(n), updatedAt: null,
        };
        mine.push(repo);
      });
      return mine;
    }
    return [];
  }

  function renderSectionCards(section) {
    if (tagsEl) tagsEl.style.display = 'none';
    var cards = sectionCardList(section);
    storeListEl.innerHTML = '';
    var wrap = $('div', 'dsh-store-grid', storeListEl);
    if (section === 'mine') {
      var head = $('div', 'dsh-store-count', wrap);
      head.textContent = lang === 'en'
        ? ('Installed: ' + cards.length)
        : ('\u5DF2\u5B89\u88C5 ' + cards.length + ' \u4E2A\u63D2\u4EF6\uFF08\u66F4\u65B0/\u5378\u8F7D\u540E\u9700\u91CD\u542F\u670D\u52A1\u751F\u6548\uFF09');
      var checkBtn = $('button', 'dsh-store-more', head);
      checkBtn.textContent = lang === 'en' ? 'Check updates' : '\u68C0\u67E5\u66F4\u65B0';
      checkBtn.addEventListener('click', function () { checkUpdates(true); });
    }
    if (!cards.length) {
      var em = $('div', 'dsh-store-empty', wrap);
      em.textContent = section === 'mine'
        ? (lang === 'en' ? 'No plugins installed yet — install from Featured/Popular/All.' : '\u8FD8\u6CA1\u6709\u5B89\u88C5\u63D2\u4EF6\u2014\u2014\u53BB\u7CBE\u9009/\u70ED\u95E8/\u5168\u90E8\u91CC\u6311\u4E00\u4E2A\u5427\u3002')
        : (storeState.error ? ('\u52A0\u8F7D\u5931\u8D25\uFF1A' + storeState.error) : (storeState.busy ? '\u52A0\u8F7D\u4E2D\u2026' : '\u6682\u65E0\u6570\u636E'));
      return;
    }
    cards.forEach(function (r) { buildStoreCard(wrap, r, section === 'mine'); });
    updateBatchBtn();
  }

  function buildStoreCard(parent, r, isMine) {
    var card = $('div', 'dsh-plug-card', parent);
    var st = storeState.statuses[r.fullName];
    if (st && st.state === 'installing') card.classList.add('installing');
    card.addEventListener('click', function () { openDetail(r); });
    var top = $('div', 'dsh-plug-card-top', card);
    var name = $('span', 'dsh-plug-card-name', top);
    name.textContent = r.fullName;
    name.title = r.fullName;
    var src = $('span', 'dsh-src-badge' + (r.fromNpm ? ' npm' : ' git'), top);
    src.textContent = r.fromNpm ? 'npm' : 'GitHub';
    var installed = isInstalled(r.fullName);
    var instName = installedNameOf(r.fullName);
    var curVer = instName ? (storeState.versions[instName] || '') : '';
    if (installed) {
      var ib = $('span', 'dsh-badge', top);
      ib.textContent = '\u5DF2\u5B89\u88C5' + (curVer ? ' v' + curVer : '');
    }
    var repoBase = pluginBasename(r.fullName);
    var upd = storeState.updates.find(function (u) {
      return u.name && (pluginBasename(u.name) === repoBase || u.name === r.fullName);
    });
    if (upd && upd.hasUpdate) {
      var ub = $('span', 'dsh-badge upd', top);
      ub.textContent = '\u6709\u66F4\u65B0 v' + (upd.current || curVer || '?') + ' \u2192 v' + upd.latest;
    }
    var desc = $('div', 'dsh-plug-card-desc', card);
    desc.textContent = r.desc || r.description || (lang === 'en' ? '(No description)' : '\uFF08\u65E0\u63CF\u8FF0\uFF09');
    if (r.topics && r.topics.length) {
      var tags = $('div', 'dsh-plug-card-tags', card);
      r.topics.slice(0, 3).forEach(function (t) {
        var chip = $('span', 'dsh-plug-tag', tags);
        chip.textContent = t;
        chip.title = '\u7B5B\u9009\u8BE5\u6807\u7B7E';
        chip.addEventListener('click', function (e) {
          e.stopPropagation();
          storeState.tag = t;
          storeState.section = 'all';
          var bs = document.querySelectorAll('.dsh-store-sect');
          for (var i = 0; i < bs.length; i++) bs[i].classList.toggle('on', bs[i].textContent.indexOf('\u5168\u90E8') >= 0 || bs[i].textContent === 'All');
          renderStoreList();
        });
      });
    }
    var meta = $('div', 'dsh-plug-card-meta', card);
    meta.textContent = [
      installed ? ('\u{1F4E6} \u5F53\u524D v' + (curVer || '?')) : (r.fromNpm ? ('\u{1F4E6} v' + (r.version || r.starsText || '')) : ('\u2B50 ' + (r.starsText || '0'))),
      r.language ? r.language : '',
      r.updatedAt ? (String(r.updatedAt).slice(0, 10)) : '',
    ].filter(Boolean).join(' \u00B7 ');
    // 底部操作：已安装 → 常驻「卸载」；检测到新版本 → 额外出现「更新」
    var bot = $('div', 'dsh-plug-bot', card);
    var uninstalling = st && st.state === 'uninstalling';
    if (upd && upd.hasUpdate && installed) {
      var upBtn = $('button', 'dsh-install dsh-update', bot);
      upBtn.textContent = '\u66F4\u65B0 v' + upd.latest;
      upBtn.disabled = !!storeState.busy;
      upBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        // 更新携带明确目标版本：绕过 pnpm 供应链 minimumReleaseAge 对新版本的拦截
        doInstall([{ fullName: r.fullName, updateTo: upd.latest }], null);
      });
    }
    var btn = $('button', 'dsh-install' + ((installed || uninstalling) ? ' dsh-uninstall' : '') + (st && st.state === 'installing' ? ' dsh-cancel dsh-installing' : ''), bot);
    if (uninstalling) {
      btn.textContent = '\u5378\u8F7D\u4E2D\u2026';
      btn.disabled = true;
    } else if (installed) {
      btn.textContent = '\u5378\u8F7D';
      btn.disabled = !!storeState.busy;
    } else {
      btn.textContent = (st && st.state === 'installing') ? '\u53D6\u6D88\u5B89\u88C5' : (st && st.state === 'ok' ? '\u2713 \u5B89\u88C5\u6210\u529F' : '\u5B89\u88C5');
      btn.disabled = (st && st.state === 'installing') ? false : (!!storeState.busy || (st && st.state === 'ok'));
    }
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (uninstalling) return;
      if (st && st.state === 'installing') { if (desktop.storeCancel) desktop.storeCancel(); return; }
      if (installed) { uninstallOne(r.fullName); return; }
      installPlugins([r.fullName], undefined);
    });
  }

  // ---------------- 更新检测 ----------------
  function checkUpdates(force) {
    if (!desktop.storeUpdates) return;
    desktop.storeUpdates().then(function (list) {
      storeState.updates = list || [];
      if (force) {
        showStoreStatus(list && list.length
          ? (lang === 'en' ? (list.length + ' plugin(s) have updates') : ('\u53D1\u73B0 ' + list.length + ' \u4E2A\u63D2\u4EF6\u6709\u65B0\u7248\u672C'))
          : (lang === 'en' ? 'All plugins up to date' : '\u6240\u6709\u63D2\u4EF6\u5DF2\u662F\u6700\u65B0\u7248\u672C'));
      }
      if (storeState.section === 'mine' && storeEl && storeEl.classList.contains('open')) renderStoreList();
    }).catch(function () { /* ignore */ });
  }

  function installPlugins(list, mirrorOverride) {
    if (!list.length || !desktop.storeInstall) return;
    if (!mirrorOverride) {
      showInstallChooser(list);
      return;
    }
    doInstall(list, mirrorOverride);
  }

  var chooserEl = null, chooserList = null;
  function showInstallChooser(list) {
    ensureRoot();
    if (chooserEl) chooserEl.parentNode.removeChild(chooserEl);
    chooserEl = $('div', 'dsh-chooser', root);
    var box = $('div', 'dsh-palette-box dsh-chooser-box', chooserEl);
    var head = $('div', 'dsh-chooser-head', box);
    var t = $('span', 'dsh-chooser-title', head);
    t.textContent = '\u{1F4E6} \u9009\u62E9\u5B89\u88C5\u65B9\u5F0F\uFF08' + list.length + ' \u4E2A\u63D2\u4EF6\uFF09';
    var close = $('button', 'dsh-store-close', head);
    close.textContent = '\u2715';
    close.addEventListener('click', function () { closeChooser(); });
    var body = $('div', 'dsh-chooser-body', box);
    var opts = [{ key: 'direct', label: 'GitHub \u5B98\u65B9\u76F4\u8FDE', hint: '\u539F\u59CB\u4ED3\u5E93\uFF0C\u901F\u5EA6\u53D7\u7F51\u7EDC\u5F71\u54CD' }]
      .concat((storeState.mirrors || []).filter(function (m) { return m.key !== 'direct'; }).map(function (m) {
        return { key: m.key, label: m.label, hint: '\u7B2C\u4E09\u65B9\u52A0\u901F\u955C\u50CF' };
      }));
    opts.forEach(function (o) {
      var row = $('div', 'dsh-chooser-row', body);
      var nameEl = $('span', 'dsh-chooser-name', row);
      nameEl.textContent = o.label;
      var pingEl = $('span', 'dsh-chooser-ping', row);
      var p = storeState.pings ? storeState.pings.find(function (x) { return x.key === o.key; }) : null;
      pingEl.textContent = p ? (p.ok ? p.ms + 'ms' : '\u4E0D\u53EF\u8FBE') : '...';
      if (p && p.ok && p.ms < 300) pingEl.classList.add('fast');
      if (p && !p.ok) pingEl.classList.add('dead');
      var hint = $('span', 'dsh-chooser-hint', row);
      hint.textContent = o.hint || '';
      row.addEventListener('click', function () {
        closeChooser();
        doInstall(list, o.key);
      });
    });
    var foot = $('div', 'dsh-chooser-foot', box);
    var cancelBtn = $('button', 'dsh-chooser-cancel', foot);
    cancelBtn.textContent = '\u53D6\u6D88\u5B89\u88C5';
    cancelBtn.addEventListener('click', function () { closeChooser(); });
    chooserEl.addEventListener('mousedown', function (e) {
      if (e.target === chooserEl) closeChooser();
    });
    // 安装时镜像测速（商店里的镜像选择已移除，选择发生在安装这一刻）
    if (desktop.storePing) {
      desktop.storePing().then(function (r) {
        if (!r || r.ok === false || !chooserEl) return;
        storeState.pings = r.results || [];
        var rows = chooserEl.querySelectorAll('.dsh-chooser-row');
        opts.forEach(function (o, i) {
          var pingEl = rows[i] ? rows[i].querySelector('.dsh-chooser-ping') : null;
          if (!pingEl) return;
          var p = storeState.pings.find(function (x) { return x.key === o.key; });
          pingEl.textContent = p ? (p.ok ? p.ms + 'ms' : '\u4E0D\u53EF\u8FBE') : '...';
          if (p && p.ok && p.ms < 300) pingEl.classList.add('fast');
          if (p && !p.ok) pingEl.classList.add('dead');
        });
      }).catch(function () { /* ignore */ });
    }
  }
  function closeChooser() {
    if (chooserEl && chooserEl.parentNode) chooserEl.parentNode.removeChild(chooserEl);
    chooserEl = null;
  }

  // 引导重启横幅（安装/卸载共用）：一键「重启服务并重启桌面端」
  function showRestartNote(okCount, noBundleNames) {
    if (!storeEl) return;
    var old = storeEl.querySelector('.dsh-store-note');
    if (old && old.parentNode) old.parentNode.removeChild(old);
    var note = $('div', 'dsh-store-note dsh-store-restart-note', storeEl);
    note.innerHTML = '';
    var okLine = $('div', 'dsh-store-note-ok', note);
    okLine.textContent = '\u2705 \u5DF2\u5904\u7406 ' + okCount + ' \u4E2A\u63D2\u4EF6\u3002\u9700\u91CD\u542F\u670D\u52A1\u540E\u751F\u6548\uFF1A';
    if (noBundleNames && noBundleNames.length) {
      var nb = $('div', 'dsh-store-note-sub', note);
      nb.textContent = '\u63D0\u793A\uFF1A' + noBundleNames.join('\u3001') + ' \u672A\u58F0\u660E dsh.bundle\uFF0C\u4F5C\u4E3A\u666E\u901A\u4F9D\u8D56/Skill \u5165\u5E93\uFF0C\u4E0D\u4F1A\u51FA\u73B0\u5728\u300C\u8BBE\u7F6E \u2192 \u63D2\u4EF6\u300D\u5217\u8868\u3002';
    }
    var actBtn = $('button', 'dsh-store-more dsh-store-restart-btn', note);
    actBtn.textContent = '\u{1F504} \u91CD\u542F\u670D\u52A1\u5E76\u91CD\u542F\u684C\u9762\u7AEF';
    actBtn.style.width = '100%';
    actBtn.style.marginTop = '6px';
    actBtn.addEventListener('click', function () { win('restart-app'); });
    var actSub = $('div', 'dsh-store-note-sub', note);
    actSub.textContent = '\u70B9\u51FB\u540E\u81EA\u52A8\u91CD\u542F\u672C\u5730\u670D\u52A1\u5E76\u91CD\u65B0\u6253\u5F00\u684C\u9762\u7AEF\uFF0C\u63D2\u4EF6\u7ACB\u5373\u751F\u6548\uFF0C\u5168\u7A0B\u65E0\u9700\u624B\u52A8\u64CD\u4F5C\u3002';
    var openBtn = $('button', 'dsh-store-more', note);
    openBtn.textContent = '\u6253\u5F00\u63D2\u4EF6 profile \u76EE\u5F55';
    openBtn.style.width = '100%';
    openBtn.style.marginTop = '6px';
    openBtn.addEventListener('click', function () { win('open-profile-dir'); });
  }

  function doInstall(list, mirrorOverride) {
    storeState.busy = true;
    storeState.installMirror = mirrorOverride;
    renderStoreList();
    var payload = { list: list };
    if (mirrorOverride && mirrorOverride !== 'direct') payload.mirror = mirrorOverride;
    desktop.storeInstall(payload).then(function (r) {
      storeState.busy = false;
      storeState.restartable = !!(r && r.restartable);
      var ok = 0, fail = 0;
      ((r && r.results) || []).forEach(function (x) {
        if (x.ok) { ok++; delete storeState.selected[x.fullName]; } else fail++;
      });
      showStoreStatus('\u5B8C\u6210\uFF1A\u6210\u529F ' + ok + ' \u4E2A\uFF0C\u5931\u8D25 ' + fail + ' \u4E2A', fail ? 'warn' : 'ok');
      if (ok > 0) {
        var noBundle = ((r && r.results) || []).filter(function (x) { return x.ok && !x.hasBundle; }).map(function (x) { return x.fullName; });
        showRestartNote(ok, noBundle);
      }
      loadStore();
    }).catch(function (e) {
      storeState.busy = false;
      showStoreStatus('\u5B89\u88C5\u5931\u8D25\uFF1A' + (e && e.message), 'fail');
      renderStoreList();
    });
  }

  // 卸载插件：确认 → pnpm remove（dsh 转发）→ 引导重启横幅（与安装同一流程）
  function uninstallOne(fullName) {
    if (!desktop.storeUninstall || storeState.busy) return;
    storeState.busy = true;
    storeState.statuses[fullName] = { state: 'uninstalling' };
    renderStoreList();
    showStoreStatus('\u6B63\u5728\u5378\u8F7D ' + fullName + ' \u2026');
    desktop.storeUninstall([fullName]).then(function (r) {
      storeState.busy = false;
      delete storeState.statuses[fullName];
      if (r && r.ok) {
        showStoreStatus(fullName + ' \u5DF2\u5378\u8F7D\uFF08\u91CD\u542F\u670D\u52A1\u540E\u5B8C\u5168\u79FB\u9664\uFF09', 'ok');
        showRestartNote(1, null);
        loadStore();
      } else {
        showStoreStatus(fullName + ' \u5378\u8F7D\u5931\u8D25\uFF1A' + ((r && r.error) || ''), 'fail');
        renderStoreList();
      }
    }).catch(function (e) {
      storeState.busy = false;
      delete storeState.statuses[fullName];
      showStoreStatus('\u5378\u8F7D\u5931\u8D25\uFF1A' + (e && e.message), 'fail');
      renderStoreList();
    });
  }

  function batchInstall() {
    installPlugins(Object.keys(storeState.selected));
  }

  function showStoreStatus(text, cls) {
    if (!storeStatusEl) return;
    var line = $('div', 'dsh-st-line' + (cls ? ' ' + cls : ''), storeStatusEl);
    line.textContent = text;
    while (storeStatusEl.children.length > 6) storeStatusEl.removeChild(storeStatusEl.firstChild);
  }

  // 全局页面内 toast（右下角）：✔ 前缀 + 2.6 秒自动消失
  var toastEl = null;
  function showAppToast(text) {
    ensureRoot();
    if (!toastEl) toastEl = $('div', 'dsh-toast', root);
    toastEl.textContent = '\u2714 ' + text;
    toastEl.classList.add('show');
    if (toastEl._t) clearTimeout(toastEl._t);
    toastEl._t = setTimeout(function () { toastEl.classList.remove('show'); }, 2600);
  }

  // ---------------- 插件详情（二次展开）----------------
  function ensureDetail() {
    if (detailEl) return;
    ensureRoot();
    detailEl = $('div', 'dsh-store-detail', root);
    var head = $('div', 'dsh-dt-head', detailEl);
    var back = $('button', 'dsh-dt-back', head);
    back.textContent = '\u2039';
    back.title = '\u8FD4\u56DE\u5217\u8868';
    back.addEventListener('click', function () { closeDetail(); });
    detailTitleEl = $('div', 'dsh-dt-title', head);
    detailTitleEl.textContent = '\u63D2\u4EF6\u8BE6\u60C5';
    detailBodyEl = $('div', 'dsh-dt-body', detailEl);
    var foot = $('div', 'dsh-dt-foot', detailEl);
    detailInstallBtn = $('button', 'dsh-dt-install', foot);
    detailUninstallBtn = $('button', 'dsh-dt-install dsh-uninstall', foot);
    detailUninstallBtn.style.display = 'none';
  }
  function closeDetail() {
    storeState.detail = null;
    if (detailEl) detailEl.classList.remove('open');
  }
  function openDetail(repo) {
    ensureDetail();
    storeState.detail = repo;
    renderDetail(repo);
    if (desktop.storeDetail) {
      desktop.storeDetail(repo.fullName).then(function (d) {
        if (!d || d.ok === false || storeState.detail !== repo) return;
        // 选择性合并：仅用非空字段覆盖，避免简介被空值清空
        var merged = Object.assign({}, repo);
        if (d.desc) merged.desc = d.desc;
        if (d.topics && d.topics.length) merged.topics = d.topics;
        if (d.starsText) merged.starsText = d.starsText;
        if (d.language) merged.language = d.language;
        if (d.license) merged.license = d.license;
        if (d.homepage) merged.homepage = d.homepage;
        if (d.updatedAt) merged.updatedAt = d.updatedAt;
        renderDetail(merged);
      }).catch(function () { /* 忽略详情补充失败 */ });
    }
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { detailEl.classList.add('open'); });
    });
  }
  // 轻量 markdown 渲染：先预处理 HTML（徽章噪音/包装标签/实体），再转义转换
  function renderMarkdown(md) {
    var raw = String(md || '');
    // 1) 常见 HTML 实体解码（转义前）
    raw = raw.replace(/&nbsp;/gi, ' ').replace(/&lt;/gi, '<').replace(/&gt;/gi, '>')
      .replace(/&quot;/gi, '"').replace(/&#39;/g, "'").replace(/&amp;/gi, '&')
      .replace(/&copy;/gi, '\u00A9').replace(/&mdash;/gi, '\u2014');
    // 2) 去注释与 shields.io 徽章图片（纯噪音）
    raw = raw.replace(/<!--[\s\S]*?-->/g, '');
    raw = raw.replace(/<img[^>]*shields\.io[^>]*>/gi, '');
    // 3) 图片 → 链接（保留文字说明；属性顺序无关）
    raw = raw.replace(/<img[^>]*>/gi, function (tag) {
      var srcM = tag.match(/src=["']([^"']+)["']/i);
      if (!srcM) return '';
      var altM = tag.match(/alt=["']([^"']*)["']/i);
      return '[\u{1F5BC} ' + (altM ? altM[1] : '\u56FE\u7247') + '](' + srcM[1] + ')';
    });
    // 4) 链接 → markdown 链接
    raw = raw.replace(/<a[^>]*?href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)');
    // 5) 整行纯 HTML 包装标签 → 删除（<div align=...>、</div>、<p> 等）
    raw = raw.replace(/^\s*<\s*\/?\s*(div|p|br|center|span|section|font|table|thead|tbody|tr|td|th|ul|ol|li|blockquote|details|summary|h[1-6])\b[^>]*>\s*$/gim, '');
    // 6) 行内标签 → markdown 等价物
    raw = raw.replace(/<br\s*\/?>/gi, '\n');
    raw = raw.replace(/<\/?(b|strong)>/gi, '**');
    raw = raw.replace(/<\/?(i|em)>/gi, '*');
    raw = raw.replace(/<\/?code>/gi, '`');
    // 7) 残留未知标签：剥标签保文本
    raw = raw.replace(/<[^>]+>/g, '');
    // 8) 转义 + markdown 转换（引号一并转义：防止链接 href 属性逃逸）
    var esc = raw.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    var out = [];
    var inCode = false;
    esc.split(/\r?\n/).forEach(function (line) {
      if (/^```/.test(line)) {
        inCode = !inCode;
        out.push(inCode ? '<pre class="dsh-md-pre">' : '</pre>');
        return;
      }
      if (inCode) { out.push(line + '\n'); return; }
      var t = line
        .replace(/^######\s+(.*)$/, '<h6>$1</h6>')
        .replace(/^#####\s+(.*)$/, '<h5>$1</h5>')
        .replace(/^####\s+(.*)$/, '<h4>$1</h4>')
        .replace(/^###\s+(.*)$/, '<h3>$1</h3>')
        .replace(/^##\s+(.*)$/, '<h2>$1</h2>')
        .replace(/^#\s+(.*)$/, '<h1>$1</h1>');
      if (/^<h\d>/.test(t)) { out.push(t); return; }
      if (/^\s*[-*+]\s+/.test(t)) {
        out.push('<li class="dsh-md-li">' + t.replace(/^\s*[-*+]\s+/, '') + '</li>');
        return;
      }
      if (/^\s*\d+\.\s+/.test(t)) {
        out.push('<li class="dsh-md-li">' + t.replace(/^\s*\d+\.\s+/, '') + '</li>');
        return;
      }
      t = t
        .replace(/`([^`]+)`/g, '<code class="dsh-md-code">$1</code>')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function (m, txt, href) {
          // 链接协议白名单：仅 http(s)/锚点/相对路径可点；其他（javascript: 等）降级为纯文本
          return /^(https?:|#|\/|\.\/|\.\.\/)/i.test(href)
            ? '<a class="dsh-md-a" href="' + href + '">' + txt + '</a>'
            : txt + ' (' + href + ')';
        });
      if (t.trim()) out.push('<p class="dsh-md-p">' + t + '</p>');
    });
    return out.join('\n');
  }

  function loadReadme(repo) {
    var wrap = detailBodyEl.querySelector('.dsh-dt-readme');
    if (!wrap) return;
    wrap.innerHTML = '';
    var headRow = $('div', 'dsh-dt-readme-head', wrap);
    var sec = $('div', 'dsh-dt-sec', headRow);
    sec.textContent = lang === 'en' ? 'README · About this plugin' : 'README \u00B7 \u63D2\u4EF6\u4ECB\u7ECD\u4E0E\u7528\u9014';
    var langBtns = $('div', 'dsh-dt-langbtns', headRow);
    var body = $('div', 'dsh-dt-readme-body', wrap);
    if (!desktop.storeReadme) {
      body.textContent = lang === 'en' ? 'Unavailable' : '\u4E0D\u53EF\u7528';
      return;
    }
    body.textContent = lang === 'en' ? 'Loading README…' : '\u52A0\u8F7D README\u2026';
    var curMd = null;
    var curZh = null;
    var readmeMode = 'en';
    var wireLinks = function () {
      Array.prototype.forEach.call(body.querySelectorAll('a'), function (a) {
        a.addEventListener('click', function (e) {
          e.preventDefault();
          var u = a.getAttribute('href') || '';
          if (/^https?:/i.test(u) && desktop.openExternal) desktop.openExternal(u);
        });
      });
    };
    var renderReadme = function () {
      var md = readmeMode === 'zh' && curZh ? curZh : curMd;
      body.innerHTML = renderMarkdown(md || '');
      wireLinks();
      var bs = langBtns.querySelectorAll('button');
      for (var i = 0; i < bs.length; i++) bs[i].classList.toggle('on', bs[i].getAttribute('data-lang') === readmeMode);
    };
    desktop.storeReadme(repo).then(function (r) {
      if (!detailBodyEl.isConnected) return;
      if (r && r.ok) {
        curMd = r.markdown || '';
        curZh = r.markdownZh || null;
        // 双语 README：提供 EN/中文 切换
        if (curZh) {
          [['en', 'EN'], ['zh', '\u4E2D\u6587']].forEach(function (o) {
            var b = $('button', 'dsh-dt-langbtn' + (o[0] === readmeMode ? ' on' : ''), langBtns);
            b.textContent = o[1];
            b.setAttribute('data-lang', o[0]);
            b.addEventListener('click', function () {
              readmeMode = o[0];
              renderReadme();
            });
          });
        }
        renderReadme();
      } else {
        body.textContent = (r && r.error) || (lang === 'en' ? 'No README' : '\u65E0 README');
      }
    }).catch(function () {
      if (detailBodyEl.isConnected) body.textContent = lang === 'en' ? 'Failed to load README' : 'README \u52A0\u8F7D\u5931\u8D25';
    });
  }

  function renderDetail(repo) {
    detailTitleEl.textContent = repo.fullName;
    var st = storeState.statuses[repo.fullName];
    var installed = isInstalled(repo.fullName);
    var repoBase = pluginBasename(repo.fullName);
    var instName = installedNameOf(repo.fullName);
    var curVer = instName ? (storeState.versions[instName] || '') : '';
    var upd = storeState.updates.find(function (u) {
      return u.name && (pluginBasename(u.name) === repoBase || u.name === repo.fullName);
    });
    var metaParts = [];
    metaParts.push(repo.fromNpm
      ? '\u{1F4E6} npm \u53D1\u5E03 · v' + escapeHtml(String(repo.version || repo.starsText || ''))
      : '\u{1F517} GitHub \u6E90\u7801 · \u2B50 ' + escapeHtml(String(repo.starsText || '0')));
    if (repo.language) metaParts.push(escapeHtml(String(repo.language)));
    if (repo.updatedAt) metaParts.push('\u66F4\u65B0 ' + escapeHtml(String(repo.updatedAt).slice(0, 10)));
    metaParts.push(installed ? ('\u5DF2\u5B89\u88C5' + (curVer ? ' v' + escapeHtml(String(curVer)) : '')) : '\u672A\u5B89\u88C5');
    if (upd && upd.hasUpdate) metaParts.push('\u6709\u65B0\u7248 v' + escapeHtml(String(upd.latest)));
    var html = '<div class="dsh-dt-name">' + escapeHtml(repo.fullName) + '</div>'
      + '<div class="dsh-dt-meta">' + metaParts.join(' · ') + '</div>'
      + '<div class="dsh-dt-sec">\u7B80\u4ECB</div>'
      + '<div class="dsh-dt-desc">' + escapeHtml(repo.desc || '\uFF08\u65E0\u63CF\u8FF0\uFF09') + '</div>'
      + '<div class="dsh-dt-trans" style="display:none"></div>';
    if (repo.topics && repo.topics.length) {
      html += '<div class="dsh-dt-sec">\u6807\u7B7E</div><div class="dsh-dt-topics">'
        + repo.topics.map(function (t) { return '<span class="dsh-dt-topic">' + escapeHtml(t) + '</span>'; }).join('')
        + '</div>';
    }
    html += '<div class="dsh-dt-sec">\u8DF3\u8F6C\u94FE\u63A5</div>';
    html += '<button class="dsh-dt-link" data-url="' + escapeHtml(repo.url) + '">\u{1F517} ' + (repo.fromNpm ? 'npm \u4ED3\u5E93' : 'GitHub \u4ED3\u5E93') + '\uFF1A' + escapeHtml(repo.fullName) + '</button>';
    if (repo.homepage) {
      html += '<button class="dsh-dt-link" data-url="' + escapeHtml(repo.homepage) + '">\u{1F310} \u9879\u76EE\u4E3B\u9875</button>';
    }
    if (!repo.fromNpm) {
      html += '<button class="dsh-dt-link" data-url="' + escapeHtml('https://github.com/' + repo.fullName + '/releases') + '">\u{1F4E6} Releases</button>';
    }
    // 复制给 AI：粘贴给任意 AI 即可帮你安装/排查（含安装命令与日志）
    html += '<button class="dsh-dt-link dsh-dt-copyhelp">\u{1F4CB} ' + (lang === 'en' ? 'Copy for AI (install help)' : '\u590D\u5236\u7ED9 AI\uFF08\u7C98\u8D34\u5373\u53EF\u5E2E\u4F60\u5B89\u88C5\uFF09') + '</button>';
    html += '<div class="dsh-dt-readme"></div>';
    detailBodyEl.innerHTML = html;
    Array.prototype.forEach.call(detailBodyEl.querySelectorAll('.dsh-dt-link'), function (el) {
      el.addEventListener('click', function () {
        if (el.classList.contains('dsh-dt-copyhelp')) {
          if (desktop.storeCopyHelp) {
            desktop.storeCopyHelp({
              fullName: repo.fullName,
              fromNpm: !!repo.fromNpm,
              npmName: repo.fromNpm ? repo.fullName.replace(/^npm\//, '') : '',
              desc: repo.desc || '',
              homepage: repo.homepage || null,
              url: repo.url || '',
              installSpec: repo.fromNpm ? ('npm/' + repo.fullName.replace(/^npm\//, '')) : ('github:' + repo.fullName),
            }).then(function (r) {
              if (r && r.ok) showStoreStatus(lang === 'en' ? 'Copied \u2014 paste it to an AI to install/troubleshoot' : '\u5DF2\u590D\u5236\uFF0C\u7C98\u8D34\u7ED9 AI \u5373\u53EF\u5E2E\u4F60\u5B89\u88C5/\u6392\u67E5', 'ok');
            }).catch(function () { /* ignore */ });
          }
          return;
        }
        var u = el.getAttribute('data-url');
        if (desktop.openExternal) desktop.openExternal(u);
        else window.open(u, '_blank');
      });
    });
    loadReadme(repo);
    // 简介按需双译（用用户 API Key 调 DeepSeek，7 天缓存；无 Key 静默跳过）
    if (repo.desc && desktop.storeTranslate) {
      var transEl = detailBodyEl.querySelector('.dsh-dt-trans');
      desktop.storeTranslate(repo.desc).then(function (r) {
        if (!detailBodyEl.isConnected || !transEl) return;
        if (r && r.ok && r.translated) {
          transEl.textContent = '\u8BD1\uFF1A' + r.translated;
          transEl.style.display = '';
        }
      }).catch(function () { /* ignore */ });
    }
    var uninstalling = st && st.state === 'uninstalling';
    if (upd && upd.hasUpdate && installed) {
      // 有更新 + 已安装：主按钮「更新」+ 第二个按钮「卸载」
      detailInstallBtn.classList.remove('dsh-uninstall');
      detailInstallBtn.textContent = lang === 'en' ? ('Update to v' + upd.latest) : ('\u66F4\u65B0\u5230 v' + upd.latest);
      detailInstallBtn.disabled = !!storeState.busy;
      detailInstallBtn.onclick = function () {
        // 更新携带明确目标版本：绕过 pnpm 供应链 minimumReleaseAge 对新版本的拦截
        doInstall([{ fullName: repo.fullName, updateTo: upd.latest }], null);
      };
      detailUninstallBtn.style.display = '';
      detailUninstallBtn.textContent = uninstalling ? '\u5378\u8F7D\u4E2D\u2026' : '\u5378\u8F7D\u8BE5\u63D2\u4EF6';
      detailUninstallBtn.disabled = !!storeState.busy || uninstalling;
      detailUninstallBtn.onclick = function () { if (!uninstalling) uninstallOne(repo.fullName); };
    } else if (installed) {
      // 已安装（无更新）：主按钮变为「卸载」（红色），卸载完成后走重启引导
      detailUninstallBtn.style.display = 'none';
      detailInstallBtn.classList.add('dsh-uninstall');
      detailInstallBtn.textContent = uninstalling ? '\u5378\u8F7D\u4E2D\u2026' : '\u5378\u8F7D\u8BE5\u63D2\u4EF6';
      detailInstallBtn.disabled = !!storeState.busy;
      detailInstallBtn.onclick = function () { if (!uninstalling) uninstallOne(repo.fullName); };
    } else {
      detailUninstallBtn.style.display = 'none';
      detailInstallBtn.classList.remove('dsh-uninstall');
      detailInstallBtn.textContent = (st && st.state === 'installing') ? '\u5B89\u88C5\u4E2D\u2026' : '\u5B89\u88C5\u8BE5\u63D2\u4EF6';
      detailInstallBtn.disabled = !!storeState.busy || (st && st.state === 'installing');
      detailInstallBtn.onclick = function () { installPlugins([repo.fullName], undefined); };
    }
  }

  // ---------------------------------------------------------------- 数据轮询 + 渲染
  function sessionTotals(items) {
    var t = { in: 0, out: 0, cacheR: 0, cacheW: 0 };
    items.forEach(function (s) {
      var u = s.projections && s.projections.values && s.projections.values.tokenUsage;
      if (!u) return;
      t.in += u.uncachedInputTokens || 0;
      t.out += u.outputTokens || 0;
      t.cacheR += u.cacheReadTokens || 0;
      t.cacheW += u.cacheWriteTokens || 0;
    });
    return t;
  }
  function activeSession(items) {
    for (var i = 0; i < items.length; i++) if (items[i].running) return items[i];
    // 取最近更新的
    var best = null;
    items.forEach(function (s) { if (!best || s.updatedAt > best.updatedAt) best = s; });
    return best || null;
  }
  function hitRate(u) {
    if (!u) return null;
    var denom = (u.cacheReadTokens || 0) + (u.uncachedInputTokens || 0);
    if (!denom) return null;
    return Math.round(100 * (u.cacheReadTokens || 0) / denom);
  }
  function helpTip(text) {
    return '<span class="dsh-help" data-tip="' + escapeHtml(text) + '">?</span>';
  }
  function renderTokens(items) {
    if (!tokenChip || !cfg.tokenChip) return;
    var act = activeSession(items);
    var pressure = act && act.projections && act.projections.values && act.projections.values.contextPressure;
    var stats = act && act.projections && act.projections.values && act.projections.values.sessionStats;
    var cur = act && act.projections && act.projections.values && act.projections.values.tokenUsage;
    var tot = sessionTotals(items);
    var hit = hitRate(cur);
    var isCurrent = !!act;

    // ---- 胶囊（紧凑态）：明确统计口径 ----
    var scopeLabel = isCurrent ? '\u5F53\u524D\u4F1A\u8BDD' : '\u5168\u5C40\u7D2F\u8BA1';
    var chipHtml = '<span class="dsh-scope">' + scopeLabel + '</span>';
    if (isCurrent && cur) {
      chipHtml += '\u{1FA99} \u5165 ' + fmt(cur.uncachedInputTokens + (cur.cacheWriteTokens || 0))
        + ' · \u51FA ' + fmt(cur.outputTokens)
        + ' · \u547D\u4E2D ' + (hit === null ? '\u2014' : hit + '%');
    } else {
      chipHtml += '\u{1FA99} \u5165 ' + fmt(tot.in + tot.cacheR + tot.cacheW) + ' · \u51FA ' + fmt(tot.out);
    }
    chipHtml += helpTip('\u8F93\u5165\uFF1A\u53D1\u9001\u7ED9\u6A21\u578B\u7684\u4E0A\u6587\u4E0E\u5DE5\u5177\u7ED3\u679C token\uFF08\u542B\u7F13\u5B58\u8BFB\u53D6\uFF09\u3002\u8F93\u51FA\uFF1A\u6A21\u578B\u751F\u6210\u7684\u5185\u5BB9 token\u3002\u547D\u4E2D\uFF1A\u7F13\u5B58\u8BFB\u53D6 \u00F7\uFF08\u7F13\u5B58\u8BFB\u53D6 + \u672A\u7F13\u5B58\u8F93\u5165\uFF09\u3002\u60AC\u505C\u672C\u80F6\u56CA\u53EF\u770B\u660E\u7EC6\u3002');
    // 变更签名守卫：数据未变化时跳过 innerHTML 写入（避免每 4 秒一次强制回流）
    if (chipTextEl && chipTextEl.__dshSig !== chipHtml) {
      chipTextEl.innerHTML = chipHtml;
      chipTextEl.__dshSig = chipHtml;
    }

    if (ctxBar) {
      if (pressure && pressure.contextWindow) {
        var pct = Math.min(100, Math.round(100 * (pressure.projectedTokens || 0) / pressure.contextWindow));
        ctxBar.style.setProperty('--dsh-ctx-pct', pct + '%');
        ctxBar.classList.toggle('dsh-ctx-warn', pct > 85);
        ctxBar.style.display = '';
      } else {
        ctxBar.style.display = 'none';
      }
    }

    // ---- 明细卡：当前会话（带口径说明）+ 全局累计 ----
    if (tokenCard) {
      var cardHtml = '<div class="dsh-tc-head">Token \u7EDF\u8BA1\uFF08\u5F53\u524D\u4F1A\u8BDD\u4E3A\u4E3B\uFF09</div>';
      if (isCurrent && cur) {
        var title = act.projections && act.projections.values && act.projections.values.title;
        cardHtml += '<div class="dsh-tc-kv"><span class="dsh-tc-k">\u4F1A\u8BDD</span><span class="dsh-tc-v">' + escapeHtml(title || act.sessionId.slice(-8)) + '</span></div>';
        cardHtml += '<div class="dsh-tc-kv"><span class="dsh-tc-k">\u8F93\u5165\uFF08\u672A\u7F13\u5B58\uFF09' + helpTip('\u672A\u547D\u4E2D\u7F13\u5B58\u7684\u8F93\u5165 token\uFF1A\u53D1\u9001\u7ED9\u6A21\u578B\u7684\u4E0A\u6587\u3001\u5DE5\u5177\u7ED3\u679C\u7B49\uFF0C\u6309\u5168\u4EF7\u8BA1\u7B97') + '</span><span class="dsh-tc-v">' + fmt(cur.uncachedInputTokens) + '</span></div>';
        cardHtml += '<div class="dsh-tc-kv"><span class="dsh-tc-k">\u8F93\u5165\uFF08\u7F13\u5B58\u8BFB\u53D6\uFF09' + helpTip('\u547D\u4E2D\u670D\u52A1\u7AEF\u7F13\u5B58\u76F4\u63A5\u590D\u7528\u7684\u8F93\u5165 token\uFF0C\u901A\u5E38\u4EF7\u683C\u66F4\u4F4E') + '</span><span class="dsh-tc-v">' + fmt(cur.cacheReadTokens) + '</span></div>';
        cardHtml += '<div class="dsh-tc-kv"><span class="dsh-tc-k">\u8F93\u51FA' + helpTip('\u6A21\u578B\u751F\u6210\u7684\u5185\u5BB9 token\uFF0C\u542B\u601D\u8003\u4E0E\u5DE5\u5177\u8C03\u7528\u6587\u672C') + '</span><span class="dsh-tc-v">' + fmt(cur.outputTokens) + '</span></div>';
        cardHtml += '<div class="dsh-tc-kv"><span class="dsh-tc-k">\u7F13\u5B58\u547D\u4E2D\u7387' + helpTip('\u7F13\u5B58\u8BFB\u53D6 \u00F7\uFF08\u7F13\u5B58\u8BFB\u53D6 + \u672A\u7F13\u5B58\u8F93\u5165\uFF09\u3002\u8D8A\u9AD8\u8D8A\u7701 token') + '</span><span class="dsh-tc-v">' + (hit === null ? '\u2014' : hit + '%') + '</span></div>';
        if (hit !== null) cardHtml += '<div class="dsh-hitbar"><i style="width:' + Math.min(100, hit) + '%"></i></div>';
        if (pressure && pressure.contextWindow) {
          cardHtml += '<div class="dsh-tc-pressure">\u4E0A\u4E0B\u6587\u5360\u7528\uFF1A' + fmt(pressure.projectedTokens || 0) + ' / ' + fmt(pressure.contextWindow)
            + ' (' + Math.min(100, Math.round(100 * (pressure.projectedTokens || 0) / pressure.contextWindow)) + '%)</div>';
        }
        if (stats) {
          cardHtml += '<div class="dsh-tc-kv"><span class="dsh-tc-k">\u6D3B\u52A8</span><span class="dsh-tc-v">'
            + stats.turns + ' \u8F6E · ' + stats.steps + ' \u6B65 · ' + fmtDur(stats.llmMs) + '</span></div>';
        }
      } else {
        cardHtml += '<div class="dsh-tc-kv"><span class="dsh-tc-k">\u5F53\u524D\u65E0\u6D3B\u8DC3\u4F1A\u8BDD</span><span class="dsh-tc-v">\u2014</span></div>';
      }
      cardHtml += '<div class="dsh-tc-sec">\u5168\u5C40\u7D2F\u8BA1\uFF08\u6240\u6709\u4F1A\u8BDD\uFF09</div>';
      cardHtml += '<div class="dsh-tc-kv"><span class="dsh-tc-k">\u8F93\u5165\u5408\u8BA1' + helpTip('\u6240\u6709\u4F1A\u8BDD\u7684\u672A\u7F13\u5B58\u8F93\u5165 + \u7F13\u5B58\u8BFB\u53D6 + \u7F13\u5B58\u5199\u5165') + '</span><span class="dsh-tc-v">' + fmt(tot.in + tot.cacheR + tot.cacheW) + '</span></div>';
      cardHtml += '<div class="dsh-tc-kv"><span class="dsh-tc-k">\u8F93\u51FA\u5408\u8BA1' + helpTip('\u6240\u6709\u4F1A\u8BDD\u7684\u6A21\u578B\u751F\u6210 token \u603B\u548C') + '</span><span class="dsh-tc-v">' + fmt(tot.out) + '</span></div>';
      // 会话明细：按父对话归组——subagent/fork 产生的子会话（origin=subagent，parentSessionId
      // 指向同一父对话）合并进所属对话，只显示对话级记录，不逐条列出子任务
      var byId = {};
      items.forEach(function (s) { if (s && s.sessionId) byId[s.sessionId] = s; });
      function rootIdOf(sid) {
        var cur = byId[sid];
        var guard = 0;
        while (cur && cur.parentSessionId && byId[cur.parentSessionId] && guard < 20) {
          cur = byId[cur.parentSessionId];
          guard++;
        }
        return cur ? cur.sessionId : sid;
      }
      var actId = act ? act.sessionId : null;
      var actRoot = actId ? rootIdOf(actId) : null;
      var groups = {}; // rootId -> { title, in, out, cache, turns, steps, llmMs, updatedAt, running, subCount }
      items.forEach(function (s) {
        if (!s || !s.sessionId) return;
        var rid = rootIdOf(s.sessionId);
        if (actRoot && rid === actRoot) return; // 当前会话所属对话已在上面单独展示
        var u = s.projections && s.projections.values && s.projections.values.tokenUsage;
        var st = s.projections && s.projections.values && s.projections.values.sessionStats;
        var root = byId[rid];
        var t = (root && root.projections && root.projections.values && root.projections.values.title) || '';
        if (!groups[rid]) {
          groups[rid] = { title: t, in: 0, out: 0, cache: 0, turns: 0, steps: 0, llmMs: 0, updatedAt: 0, running: false, subCount: 0 };
        }
        var g = groups[rid];
        if (rid !== s.sessionId) g.subCount++; // 统计子任务数
        if (u) {
          g.in += u.uncachedInputTokens || 0;
          g.out += u.outputTokens || 0;
          g.cache += u.cacheReadTokens || 0;
        }
        if (st) {
          g.turns += st.turns || 0;
          g.steps += st.steps || 0;
          g.llmMs += st.llmMs || 0;
        }
        if ((s.updatedAt || 0) > g.updatedAt) g.updatedAt = s.updatedAt || 0;
        if (s.running) g.running = true;
      });
      var merged = Object.keys(groups).map(function (k) { return groups[k]; });
      merged.sort(function (a, b) { return (b.updatedAt || 0) - (a.updatedAt || 0); });
      var totalMerged = merged.length;
      merged = merged.slice(0, 5);
      merged.forEach(function (g) {
        var name = g.title || '\uFF08\u65E0\u6807\u9898\uFF09';
        if (g.subCount > 0) name += ' \u00B7 ' + g.subCount + ' \u5B50\u4EFB\u52A1';
        cardHtml += '<div class="dsh-tc-row' + (g.running ? ' dsh-tc-running' : '') + '">'
          + '<span class="dsh-tc-name">' + escapeHtml(name) + '</span>'
          + '<span class="dsh-tc-nums">\u5165 ' + fmt(g.in) + ' · \u51FA ' + fmt(g.out) + (g.cache ? ' · \u7F13\u5B58 ' + fmt(g.cache) : '') + '</span>'
          + '<span class="dsh-tc-meta">' + (g.turns ? g.turns + ' \u8F6E · ' + g.steps + ' \u6B65 · ' + fmtDur(g.llmMs) : '') + (g.running ? ' · \u8FDB\u884C\u4E2D' : '') + '</span>'
          + '</div>';
      });
      if (totalMerged > 5) {
        cardHtml += '<div class="dsh-tc-more">\u2026\u8FD8\u6709 ' + (totalMerged - 5) + ' \u4E2A\u5BF9\u8BDD\uFF08\u5DF2\u6298\u53E0\uFF09</div>';
      }
      if (tokenCard.__dshSig !== cardHtml) {
        tokenCard.innerHTML = cardHtml;
        tokenCard.__dshSig = cardHtml;
      }
    }

    if (tbStatus) {
      var hasRunning = items.some(function (s) { return s.running; });
      tbStatus.textContent = hasRunning ? '\u8FDB\u884C\u4E2D' : '\u7A7A\u95F2';
      tbStatus.classList.toggle('dsh-tb-busy', hasRunning);
    }
    if (tbTitle && act) {
      var title = act.projections && act.projections.values && act.projections.values.title;
      tbTitle.textContent = title || '';
      tbTitle.style.display = title ? '' : 'none';
    }
  }
  function renderProgress(items) {
    if (!progressEl || !cfg.progressBar) return;
    var act = activeSession(items);
    var todos = act && act.projections && act.projections.values && act.projections.values.todos;
    var total = todos ? todos.length : 0;
    var done = todos ? todos.filter(function (t) { return t.status === 'completed'; }).length : 0;
    var cur = todos ? todos.find(function (t) { return t.status === 'in_progress'; }) : null;

    if (act && act.running) {
      if (total > 0) {
        progressEl.classList.remove('dsh-indeterminate');
        progressFill.style.width = Math.round(100 * done / total) + '%';
        if (desktop.taskProgress) desktop.taskProgress({ mode: 'fraction', fraction: done / total });
        if (progressLabel) progressLabel.textContent = (cur ? cur.content : '') + '  [' + done + '/' + total + ']';
        progressLabel.style.display = '';
      } else {
        progressEl.classList.add('dsh-indeterminate');
        progressFill.style.width = '30%';
        if (desktop.taskProgress) desktop.taskProgress({ mode: 'indeterminate' });
        if (progressLabel) { progressLabel.textContent = '\u4EFB\u52A1\u8FDB\u884C\u4E2D'; progressLabel.style.display = ''; }
      }
    } else {
      progressEl.classList.remove('dsh-indeterminate');
      progressFill.style.width = '0%';
      if (progressLabel) progressLabel.style.display = 'none';
      if (desktop.taskProgress) desktop.taskProgress({ mode: 'none' });
    }
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function poll() {
    if (pollBusy) { schedulePoll(); return; }
    pollBusy = true;
    rpc('session.list', {}).then(function (result) {
      var items = (result && result.value && result.value.items) || [];
      renderTokens(items);
      renderProgress(items);
    }).catch(function () { /* 服务未就绪时静默 */ })
      .then(function () { pollBusy = false; schedulePoll(); });
  }
  function schedulePoll() {
    if (pollTimer) clearTimeout(pollTimer);
    if (!cfg.tokenChip && !cfg.progressBar) { pollTimer = null; return; }
    if (document.hidden) { pollTimer = setTimeout(schedulePoll, 4000); return; }
    pollTimer = setTimeout(poll, 4000);
  }

  // ---------------------------------------------------------------- 动态壁纸
  var bgVideoEl = null;

  function applyBg() {
    ensureRoot();
    var body = document.body;
    var bgActive = !!(cfg.bgEnabled && (cfg.bgDataUri || cfg.bgVideoData));
    // 背景深度：静态/视频统一由覆盖层呈现（单层壁纸，杜绝重影），深度直连滑杆
    var depth = bgActive ? (Number(cfg.bgOpacity) || 0.45) : 0;
    document.documentElement.style.setProperty('--dsh-bg-opacity', String(depth));
    // 动态壁纸（视频）：挂到 body 顶层，与静态覆盖层同级（z-index 2147482980）
    if (cfg.bgVideoData && cfg.bgEnabled) {
      if (!bgVideoEl) {
        bgVideoEl = $('video', 'dsh-fx-video', document.body);
        bgVideoEl.muted = true;
        bgVideoEl.loop = true;
        bgVideoEl.autoplay = true;
        bgVideoEl.crossOrigin = 'anonymous';
        bgVideoEl.setAttribute('playsinline', '');
      }
      // 仅当 src 变化才重设：任何设置切换都会触发 applyCfg，重设会导致视频从头播放
      if (bgVideoEl.getAttribute('src') !== cfg.bgVideoData) bgVideoEl.src = cfg.bgVideoData;
      bgVideoEl.style.display = 'block';
      document.documentElement.style.setProperty('--dsh-bg-image', 'none');
      body.classList.add('dsh-bg-on', 'dsh-video-on');
      try { var p = bgVideoEl.play(); if (p && p.catch) p.catch(function () { /* 自动播放被拦截则静默 */ }); } catch (e) { /* ignore */ }
      return;
    }
    body.classList.remove('dsh-video-on');
    if (bgVideoEl) {
      try { bgVideoEl.pause(); } catch (e) { /* ignore */ }
      bgVideoEl.removeAttribute('src');
      bgVideoEl.style.display = 'none';
    }
    if (cfg.bgDataUri && cfg.bgEnabled) {
      // 单层壁纸：仅覆盖层（body::after）显示，无任何自动晃动
      document.documentElement.style.setProperty('--dsh-bg-image', 'url("' + cfg.bgDataUri + '")');
      body.classList.add('dsh-bg-on');
    } else {
      // 恢复默认背景 = 网页版纯白
      document.documentElement.style.setProperty('--dsh-bg-image', 'none');
      document.documentElement.style.setProperty('--dsh-bg-opacity', '0');
      body.classList.remove('dsh-bg-on', 'dsh-video-on');
    }
  }

  // ---------------------------------------------------------------- 主题适配
  function detectDark() {
    var attr = document.body.getAttribute('data-ds-dark-theme');
    if (attr === null) {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return attr !== '';
  }
  function applyTheme() {
    var d = detectDark();
    if (d === dark) return;
    dark = d;
    document.body.classList.toggle('dsh-fx-dark', d);
    document.body.classList.toggle('dsh-fx-light', !d);
    if (desktop.fxTheme) desktop.fxTheme({ dark: d });
  }
  function watchTheme() {
    if (themeObserver) return;
    themeObserver = new MutationObserver(applyTheme);
    themeObserver.observe(document.body, { attributes: true, attributeFilter: ['data-ds-dark-theme'] });
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);
    }
  }

  // ---------------------------------------------------------------- 配置应用
  var detachers = [];
  function detachAll() {
    detachers.forEach(function (d) { try { d(); } catch (e) { /* ignore */ } });
    detachers = [];
  }
  function applyCfg(next) {
    var prevLogo = cfg.logoDataUri;
    Object.keys(DEFAULTS).forEach(function (k) {
      if (next && next[k] !== undefined) cfg[k] = next[k];
    });
    // 性能：主进程仅在 logo 变化时才下发；null 表示沿用旧值
    if (next && !next.logoDataUri) cfg.logoDataUri = prevLogo;
    lang = (cfg.lang === 'en') ? 'en' : 'zh';
    document.documentElement.style.setProperty('--dsh-btn-reserve', (Number(cfg.btnReserve) || 150) + 'px');
    // UI 主题
    var tid = (cfg.themeId && ['aurora', 'cyber', 'emerald', 'midnight'].indexOf(cfg.themeId) >= 0) ? cfg.themeId : 'aurora';
    document.body.classList.remove('dsh-theme-aurora', 'dsh-theme-cyber', 'dsh-theme-emerald', 'dsh-theme-midnight');
    document.body.classList.add('dsh-theme-' + tid);
    detachAll();
    document.body.classList.toggle('dsh-aurora-on', !!cfg.effects);

    var bgActive = !!(cfg.bgEnabled && (cfg.bgDataUri || cfg.bgVideoData));
    // 各分支都已完备处理关闭态（壁纸/视频/事件监听器），不再走整树拆除的提前返回，
    // 保证简洁模式下：浮动按钮在、面板在、壁纸与视频类彻底清干净
    ensureRoot();

    // 背景
    applyBg();
    // 背景自动调暗：输入聚焦 / 鼠标位于对话区域 / 滚动浏览对话内容时，压低壁纸保证文字清晰
    if (cfg.bgAutoDim && bgActive) {
      document.body.classList.remove('dsh-bg-dim');
      var dimGrace = null;
      var aeOk = function () {
        var ae = document.activeElement;
        return !(ae && (ae.tagName === 'TEXTAREA' || ae.isContentEditable));
      };
      var dimOn = function () {
        if (dimGrace) { clearTimeout(dimGrace); dimGrace = null; }
        document.body.classList.add('dsh-bg-dim');
      };
      var dimOff = function () {
        if (!aeOk()) return; // 正在输入不恢复
        document.body.classList.remove('dsh-bg-dim');
      };
      // 离开对话区不立即恢复：进入 1.2s 宽限期，期间任何"进入"动作都会取消恢复。
      // 点击左侧会话等瞬移操作不会造成壁纸"闪一下原色又压暗"的突兀感。
      var scheduleDimOff = function (delay) {
        if (!aeOk()) return;
        if (dimGrace) clearTimeout(dimGrace);
        dimGrace = setTimeout(dimOff, delay || 1200);
      };
      detachers.push(on(document, 'focusin', function (e) {
        if (e.target && (e.target.tagName === 'TEXTAREA' || e.target.isContentEditable)) dimOn();
      }, true));
      detachers.push(on(document, 'focusout', function (e) {
        if (e.target && (e.target.tagName === 'TEXTAREA' || e.target.isContentEditable)) scheduleDimOff(900);
      }, true));
      // 鼠标悬停在对话区域 → 调暗；移出 → 宽限期后恢复。
      // 对话区边界按输入框（textarea）实测矩形动态计算，左侧工作区/右侧面板不误伤。
      var chatRect = null, chatRectTs = 0;
      function getChatZone() {
        var now = Date.now();
        if (chatRect && now - chatRectTs < 1000) return chatRect;
        chatRectTs = now;
        var ta = document.querySelector('textarea');
        if (ta) {
          var r = ta.getBoundingClientRect();
          chatRect = { left: Math.max(0, r.left - 120), right: Math.min(window.innerWidth, r.right + 120) };
        } else {
          chatRect = { left: window.innerWidth * 0.3, right: window.innerWidth * 0.7 };
        }
        return chatRect;
      }
      detachers.push(on(window, 'mousemove', function (e) {
        var z = getChatZone();
        if (e.clientX > z.left && e.clientX < z.right) dimOn();
        else scheduleDimOff(1200);
      }, { passive: true }));
      // 滚动浏览对话内容 → 调暗；停止滚动 1.6s 后恢复
      detachers.push(on(window, 'wheel', function () {
        dimOn();
        scheduleDimOff(1600);
      }, { passive: true }));
    } else {
      document.body.classList.remove('dsh-bg-dim');
    }

    // 标题栏 + token + 进度
    if (cfg.titlebar) {
      ensureTitlebar();
      removeDragStrip(); // 标题栏自身即为拖拽区
      stopFloatLayout();
      if (cfg.logoDataUri && titlebarEl) {
        var lg = titlebarEl.querySelector('.dsh-tb-logo');
        if (lg && lg.getAttribute('src') !== cfg.logoDataUri) lg.src = cfg.logoDataUri;
      }
      applyTheme();
      removeFabRow();
    } else {
      removeTitlebar();
      ensureDragStrip(); // 无标题栏：顶部透明拖拽条（不挡网页按钮，双击最大化）
      ensureFab(); // 控制面板入口（组内最左）
      ensureFilesFab(); // 工作区文件（文档左侧）
      ensureDocFab();   // 文档阅读（终端左侧）
      ensureTermFab();   // 终端（dsh-plugin 左侧）
      ensureStoreFab();  // dsh-plugin
      ensureBalanceFab(); // 余额
      ensureWinCtrlsFab(); // 窗口控制按钮（无边框窗口在标题栏关闭时依然可用，最右）
      startFloatLayout(); // 与网页头部按钮并排的自适应布局（session log 左浮钮右圆点）
    }
    if (cfg.tokenChip) { if (!cfg.titlebar) removeTitlebar(); }
    if (cfg.progressBar) { ensureProgress(); } else { removeProgress(); }
    if (cfg.titlebar && !cfg.tokenChip && tokenChip) { tokenChip.style.display = 'none'; if (ctxBar) ctxBar.style.display = 'none'; }
    if (cfg.titlebar && cfg.tokenChip && tokenChip) { tokenChip.style.display = ''; if (ctxBar) ctxBar.style.display = ''; }

    watchTheme();
    applyTheme();
    if (cfg.tokenChip || cfg.progressBar) { poll(); schedulePoll(); }
    else if (pollTimer) { clearTimeout(pollTimer); pollTimer = null; }
  }

  // ---------------------------------------------------------------- 终端/文档停靠面板（侧挂独立窗口，由主进程统一管理开合）
  function toggleTerminal() { win('term-toggle'); }
  function toggleDoc() { win('doc-toggle'); }

  // ---------------- 控制面板（替代左上角菜单） ----------------
  var cpEl = null;
  var cpState = { open: false, cfg: null, themes: [
    { id: 'aurora', label: '\u6781\u5149\u84DD\uFF08\u9ED8\u8BA4\uFF09' },
    { id: 'cyber', label: '\u8D5B\u535A\u7D2B' },
    { id: 'emerald', label: '\u7FE1\u7FE0\u7EE0' },
    { id: 'midnight', label: '\u5348\u591C\u91D1' },
  ] };

  // 控制面板按钮图标（内联 SVG，随主题色着色）
  var CP_ICONS = {
    dial: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="4" y1="7" x2="20" y2="7"/><circle cx="14" cy="7" r="2.4"/><line x1="4" y1="12" x2="20" y2="12"/><circle cx="9" cy="12" r="2.4"/><line x1="4" y1="17" x2="20" y2="17"/><circle cx="16" cy="17" r="2.4"/></svg>',
    image: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="M3 17l5.2-5.2 4 4L16.5 11 21 15.4"/></svg>',
    reset: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 12a9 9 0 1 0 3-6.7"/><polyline points="3 4 3 9 8 9"/></svg>',
    file: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><polyline points="14 3 14 8 19 8"/></svg>',
    reload: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-2.6-6.3"/><polyline points="21 3 21 9 15 9"/></svg>',
    x: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>',
    depth: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4"/></svg>',
    auto: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.8 4.6L18.5 9l-4.7 1.4L12 15l-1.8-4.6L5.5 9l4.7-1.4z"/><path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9z"/></svg>',
  };

  function cpAddSection(body, title) {
    // 卡片式分组：每组一张玻璃卡片，标题带图标
    var card = $('div', 'dsh-cp-card', body);
    var head = $('div', 'dsh-cp-card-head', card);
    var t = $('div', 'dsh-cp-card-title', head);
    t.textContent = title;
    return card;
  }
  function cpRow(sec, labelText, kind, opts, onToggle) {
    var row = $('div', 'dsh-cp-row', sec);
    var input = null;
    if (kind === 'check') {
      input = $('input', 'dsh-cp-check', row);
      input.type = 'checkbox';
      input.checked = !!opts.checked;
      input.addEventListener('change', function () { onToggle(input.checked); });
    } else if (kind === 'radio') {
      input = $('input', 'dsh-cp-radio', row);
      input.type = 'radio';
      input.name = opts.group;
      input.checked = !!opts.checked;
      input.addEventListener('change', function () { if (input.checked) onToggle(); });
    } else if (kind === 'btn') {
      var btn = $('button', 'dsh-cp-btn-row', row);
      if (opts.icon) btn.innerHTML = CP_ICONS[opts.icon] + '<span>' + labelText + '</span>';
      else btn.textContent = labelText;
      btn.addEventListener('click', onToggle);
      if (opts && opts.hint) {
        var bHint = $('span', 'dsh-cp-hint', row);
        bHint.textContent = opts.hint;
      }
      return row;
    }
    var lab = $('span', 'dsh-cp-label', row);
    if (opts && opts.icon) lab.innerHTML = CP_ICONS[opts.icon] + '<span>' + labelText + '</span>';
    else lab.textContent = labelText;
    if (opts && opts.hint) {
      var hint = $('span', 'dsh-cp-hint', row);
      hint.textContent = opts.hint;
    }
    // 整行可点击：点击行任意位置切换选项（点击控件本身不重复触发）
    row.addEventListener('click', function (e) {
      if (e.target !== input) input.click();
    });
    return row;
  }

  function renderControlPanel(cfg) {
    cpState.cfg = cfg;
    var box = cpEl.querySelector('.dsh-cpanel-box');
    var body = box.querySelector('.dsh-cpanel-body');
    body.innerHTML = '';
    // 主题
    var sec = cpAddSection(body, T('cpTheme'));
    var themeLabels = {
      aurora: lang === 'en' ? 'Aurora Blue (default)' : '\u6781\u5149\u84DD\uFF08\u9ED8\u8BA4\uFF09',
      cyber: lang === 'en' ? 'Cyber Purple' : '\u8D5B\u535A\u7D2B',
      emerald: lang === 'en' ? 'Emerald Green' : '\u7FE1\u7FE0\u7EE0',
      midnight: lang === 'en' ? 'Midnight Gold' : '\u5348\u591C\u91D1',
    };
    cpState.themes.forEach(function (t) {
      var row = cpRow(sec, themeLabels[t.id] || t.label, 'radio', { group: 'dsh-theme', checked: cfg.themeId === t.id }, function () {
        win('theme-set', t.id);
        cpState.cfg.themeId = t.id;
      });
      var lab = row.querySelector('.dsh-cp-label');
      if (lab) lab.innerHTML = '<span class="dsh-theme-dot ' + t.id + '"></span>' + lab.textContent;
    });
    // 背景
    sec = cpAddSection(body, T('cpBg'));
    cpRow(sec, T('bgChoose'), 'btn', { icon: 'image', hint: T('bgChooseHint') }, function () { win('bg-choose'); });
    cpRow(sec, T('bgClear'), 'btn', { icon: 'reset' }, function () { win('bg-clear'); });
    // 背景深度滑杆：控制壁纸透明度，解决壁纸色彩干扰对话文字
    var depthRow = $('div', 'dsh-cp-row dsh-cp-range-row', sec);
    var dLab = $('span', 'dsh-cp-label', depthRow);
    dLab.innerHTML = CP_ICONS.depth + '<span>' + T('bgDepth') + '</span>';
    var rng = $('input', 'dsh-cp-range', depthRow);
    rng.type = 'range'; rng.min = '10'; rng.max = '100'; rng.step = '5';
    rng.value = String(Math.round((Number(cfg.bgOpacity) || 0.45) * 100));
    var rv = $('span', 'dsh-cp-hint dsh-cp-range-val', depthRow);
    rv.textContent = rng.value + '%';
    // 拖动即时生效（直接改 CSS 变量，不走配置往返，避免拖动中断）；松手才持久化
    rng.addEventListener('input', function () {
      rv.textContent = rng.value + '%';
      var dv = Number(rng.value) / 100;
      document.documentElement.style.setProperty('--dsh-bg-opacity', String(dv));
      cpState.cfg.bgOpacity = dv;
    });
    rng.addEventListener('change', function () { win('bg-opacity', rng.value); });
    // 自动适应：输入/阅读时自动压低背景
    cpRow(sec, T('bgAutoDim'), 'check', { checked: !!cfg.bgAutoDim, icon: 'auto' }, function (on) { win('bg-autodim', on ? '1' : '0'); cpState.cfg.bgAutoDim = on; });
    // 启动界面：背景图 / 欢迎语 / 倒计时 / 首次引导
    sec = cpAddSection(body, T('cpSplash'));
    cpRow(sec, T('splashBgChoose'), 'btn', { icon: 'image' }, function () { win('splash-bg-choose'); });
    cpRow(sec, T('splashBgClear'), 'btn', { icon: 'reset' }, function () { win('splash-bg-clear'); });
    var msgRow = $('div', 'dsh-cp-row dsh-cp-input-row', sec);
    var mLab = $('span', 'dsh-cp-label', msgRow);
    mLab.innerHTML = CP_ICONS.auto + '<span>' + T('splashMsg') + '</span>';
    var mInp = $('input', 'dsh-cp-text', msgRow);
    mInp.type = 'text';
    mInp.maxLength = 100;
    mInp.placeholder = T('splashMsgPh');
    mInp.value = cfg.splashMessage || '';
    mInp.addEventListener('change', function () { win('splash-message', mInp.value); });
    cpRow(sec, T('splashCountdown'), 'check', { checked: cfg.splashCountdown !== false }, function (on) {
      win('splash-countdown', on ? '1' : '0');
      cpState.cfg.splashCountdown = on;
    });
    cpRow(sec, T('splashGuide'), 'btn', {}, function () { win('onboard-reset'); });
    // 界面
    sec = cpAddSection(body, T('cpUi'));
    [
      ['effects', lang === 'en' ? 'Visual effects (aurora)' : '\u89C6\u89C9\u7279\u6548\uFF08\u6781\u5149\u5C42\uFF09'],
      ['titlebar', T('uiTitlebar')],
      ['tokenChip', T('uiChip')],
      ['progressBar', T('uiProgress')],
    ].forEach(function (f) {
      cpRow(sec, f[1], 'check', { checked: !!cfg.fx[f[0]] }, function (on) {
        win('fx-toggle', f[0]);
        cpState.cfg.fx[f[0]] = on;
      });
    });
    // 语言
    sec = cpAddSection(body, T('cpLang'));
    cpRow(sec, '\u4E2D\u6587 / Chinese', 'radio', { group: 'dsh-lang', checked: cfg.lang !== 'en' }, function () { win('lang-set', 'zh'); cpState.cfg.lang = 'zh'; });
    cpRow(sec, 'English / \u82F1\u8BED', 'radio', { group: 'dsh-lang', checked: cfg.lang === 'en' }, function () { win('lang-set', 'en'); cpState.cfg.lang = 'en'; });
    // 窗口
    sec = cpAddSection(body, T('cpWin'));
    cpRow(sec, T('winPin'), 'check', { checked: !!cfg.pinTop }, function () { win('pin-toggle'); });
    cpRow(sec, T('winAutoStart'), 'check', { checked: !!cfg.autoStart }, function () { win('autostart-toggle'); });
    cpRow(sec, T('winNotify'), 'check', { checked: !!cfg.notify }, function () { win('notify-toggle'); });
    cpRow(sec, lang === 'en' ? 'Disable hardware acceleration (restart required)' : '\u7981\u7528\u786C\u4EF6\u52A0\u901F\uFF08\u91CD\u542F\u540E\u751F\u6548\uFF09', 'check', { checked: cfg.hwAccel === false }, function (on) {
      win('hwaccel-toggle');
      cpState.cfg.hwAccel = on ? false : true;
    });
    // 工具
    sec = cpAddSection(body, T('cpTools'));
    cpRow(sec, T('toolsRestart'), 'btn', {}, function () { win('restart-service'); });
    cpRow(sec, T('toolsPort'), 'btn', {}, function () { win('port'); });
    cpRow(sec, T('toolsConfig'), 'btn', {}, function () { win('open-config'); });
    cpRow(sec, T('toolsLogo'), 'btn', {}, function () { win('icon-choose'); });
    cpRow(sec, T('toolsIconReset'), 'btn', {}, function () { win('icon-reset'); });
    cpRow(sec, T('toolsLogs'), 'btn', {}, function () { win('open-logs'); });
    cpRow(sec, T('toolsInstallLog'), 'btn', {}, function () { win('open-install-log'); });
    cpRow(sec, T('toolsTerminal'), 'btn', {}, function () { win('open-terminal'); });
    cpRow(sec, lang === 'en' ? 'Make Node available in system terminals (add to user PATH)' : '\u7CFB\u7EDF\u7EC8\u7AEF\u4E5F\u80FD\u7528 Node\uFF08\u52A0\u5165\u7528\u6237 PATH\uFF09', 'btn', {}, function () { win('path-add'); });
    cpRow(sec, T('toolsDevtools'), 'btn', {}, function () { win('devtools'); });
    cpRow(sec, T('toolsAbout'), 'btn', {}, function () { win('about'); });
  }

  function ensureControlPanel() {
    if (cpEl) return;
    ensureRoot();
    cpEl = $('div', 'dsh-cpanel', root);
    var box = $('div', 'dsh-cpanel-box', cpEl);
    var head = $('div', 'dsh-cpanel-head', box);
    var t = $('span', 'dsh-cpanel-title', head);
    t.innerHTML = CP_ICONS.dial + '<span>' + T('panel') + '</span>';
    var close = $('button', 'dsh-store-close', head);
    close.innerHTML = CP_ICONS.x;
    close.addEventListener('click', function () { toggleControlPanel(false); });
    $('div', 'dsh-cpanel-body', box);
    // 点击面板外关闭
    document.addEventListener('mousedown', function (e) {
      if (!cpState.open || !cpEl) return;
      if (!cpEl.contains(e.target) && !(e.target.closest && e.target.closest('.dsh-cp-btn'))) {
        toggleControlPanel(false);
      }
    });
  }

  function ensureFab() {
    if (fabEl) return;
    ensureFabRow();
    fabEl = $('button', 'dsh-cp-fab', fabRowEl);
    fabEl.innerHTML = CP_ICONS.dial;
    fabEl.title = T('panelTip');
    fabEl.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleControlPanel();
    });
  }
  function removeFab() {
    if (fabEl && fabEl.parentNode) fabEl.parentNode.removeChild(fabEl);
    fabEl = null;
  }

  function toggleControlPanel(open) {
    ensureControlPanel();
    var want = (open === undefined) ? !cpState.open : !!open;
    cpState.open = want;
    var tb = document.querySelector('.dsh-tb-icon-btn');
    if (tb) tb.classList.toggle('active', want);
    var fb = document.querySelector('.dsh-cp-fab');
    if (fb) fb.classList.toggle('active', want);
    window.__dshCpT = (window.__dshCpT || []);
    window.__dshCpT.push('toggle:' + want + ':getCfg=' + !!desktop.getCfg);
    cpEl.classList.toggle('open', want);
    if (want) {
      toggleStore(false);
      window.__dshCpT.push('afterStore');
      togglePalette(false);
      window.__dshCpT.push('afterPalette');
      if (desktop.getCfg) {
        window.__dshCpT.push('callingGetCfg');
        desktop.getCfg().then(function (c) {
          window.__dshCfg = c || null;
          window.__dshCfgErr = null;
          window.__dshCpT.push('getCfgResolved');
          if (c) renderControlPanel(c);
        }).catch(function (e) { window.__dshCfgErr = String((e && e.message) || e); window.__dshCpT.push('getCfgRejected:' + window.__dshCfgErr); });
      }
    }
  }

  // ---------------- 命令面板（Ctrl+K）----------------
  var paletteEl = null, paletteInputEl = null, paletteListEl = null;
  var paletteOpen = false, paletteIndex = 0, paletteMatches = [];

  function win(cmd, arg) {
    if (desktop.winAction) desktop.winAction(arg === undefined ? cmd : cmd + ':' + arg);
  }
  // 命令面板条目 = 控制面板已有功能的子集（与 CP 内容一一对应）
  var PALETTE_ACTIONS = [
    { id: 'bg-choose', label: 'paBgChoose', hint: 'paBgChooseH', run: function () { win('bg-choose'); } },
    { id: 'bg-clear', label: 'paBgClear', hint: 'paBgClearH', run: function () { win('bg-clear'); } },
    { id: 'fx-token', label: 'paFxToken', run: function () { win('fx-toggle', 'tokenChip'); } },
    { id: 'fx-progress', label: 'paFxProgress', run: function () { win('fx-toggle', 'progressBar'); } },
    { id: 'pin', label: 'paPin', run: function () { win('pin-toggle'); } },
    { id: 'notify', label: 'paNotify', run: function () { win('notify-toggle'); } },
    { id: 'autostart', label: 'paAutostart', run: function () { win('autostart-toggle'); } },
    { id: 'restart', label: 'paRestart', run: function () { win('restart-service'); } },
    { id: 'port', label: 'paPort', run: function () { win('port'); } },
    { id: 'config', label: 'paConfig', run: function () { win('open-config'); } },
    { id: 'logs', label: 'paLogs', run: function () { win('open-logs'); } },
    { id: 'install-log', label: 'paInstallLog', run: function () { win('open-install-log'); } },
    { id: 'terminal', label: 'paTerminal', run: function () { win('open-terminal'); } },
    { id: 'devtools', label: 'paDevtools', run: function () { win('devtools'); } },
    { id: 'about', label: 'paAbout', run: function () { win('about'); } },
  ];

  function ensurePalette() {
    if (paletteEl) return;
    ensureRoot();
    paletteEl = $('div', 'dsh-palette', root);
    var box = $('div', 'dsh-palette-box', paletteEl);
    paletteInputEl = $('input', 'dsh-palette-input', box);
    paletteInputEl.placeholder = T('paPlaceholder');
    paletteListEl = $('div', 'dsh-palette-list', box);
    var foot = $('div', 'dsh-palette-foot', box);
    foot.textContent = T('paFoot');
    paletteInputEl.addEventListener('input', function () {
      paletteIndex = 0;
      renderPalette();
    });
    paletteInputEl.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); paletteIndex = Math.min(paletteIndex + 1, paletteMatches.length - 1); renderPalette(true); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); paletteIndex = Math.max(paletteIndex - 1, 0); renderPalette(true); }
      else if (e.key === 'Enter') { e.preventDefault(); if (paletteMatches[paletteIndex]) executePalette(paletteMatches[paletteIndex]); }
      else if (e.key === 'Escape') { e.preventDefault(); togglePalette(false); }
    });
    paletteEl.addEventListener('mousedown', function (e) {
      if (e.target === paletteEl) togglePalette(false);
    });
  }

  function renderPalette(keepFocus) {
    var q = (paletteInputEl.value || '').trim().toLowerCase();
    paletteMatches = PALETTE_ACTIONS.filter(function (a) {
      var lt = T(a.label), ht = a.hint ? T(a.hint) : '';
      return !q || (lt + ' ' + ht).toLowerCase().indexOf(q) >= 0;
    });
    if (!paletteMatches.length) {
      paletteMatches = PALETTE_ACTIONS;
      q = '';
    }
    paletteListEl.innerHTML = '';
    paletteMatches.forEach(function (a, i) {
      var row = $('div', 'dsh-palette-row' + (i === paletteIndex ? ' sel' : ''), paletteListEl);
      var lab = $('span', 'dsh-palette-label', row);
      lab.textContent = T(a.label);
      if (a.hint) {
        var hint = $('span', 'dsh-palette-hint', row);
        hint.textContent = T(a.hint);
      }
      row.addEventListener('click', function () { executePalette(a); });
    });
  }

  function executePalette(action) {
    togglePalette(false);
    try { action.run(); } catch (e) { /* ignore */ }
  }

  function togglePalette(open) {
    ensurePalette();
    var want = (open === undefined) ? !paletteOpen : !!open;
    paletteOpen = want;
    paletteEl.classList.toggle('open', want);
    if (want) {
      paletteInputEl.value = '';
      paletteIndex = 0;
      renderPalette();
      setTimeout(function () { paletteInputEl.focus(); }, 60);
    } else {
      paletteInputEl.blur();
    }
  }

  // ---------------------------------------------------------------- 启动
  function boot() {
    // 余额定时刷新（每 5 分钟查询一次）
    setInterval(refreshBalance, 5 * 60 * 1000);
    // 启动加载门控：页面彻底就绪前显示遮罩（避免进入后一直处于加载状态）
    if (location.protocol !== 'file:') {
      var bootOv = $('div', 'dsh-boot', document.body);
      var logoHtml = cfg.logoDataUri ? '<img src="' + cfg.logoDataUri + '" alt="">' : '';
      bootOv.innerHTML = '<div class="dsh-boot-box">' + logoHtml + '<div class="dsh-boot-name">DESK HARNESS</div><div class="dsh-boot-spin"></div><div class="dsh-boot-hint">' + T('loading') + '</div></div>';
      var bootTries = 0;
      function bootCheck() {
        bootTries++;
        var rootEl = document.getElementById('root');
        var ta = document.querySelector('textarea');
        var ready = window.__dshBootReady || (rootEl && rootEl.childElementCount > 3) || !!ta;
        if (ready || bootTries > 66) {
          document.body.classList.add('dsh-app-ready');
          bootOv.classList.add('dsh-boot-gone');
          setTimeout(function () { if (bootOv.parentNode) bootOv.parentNode.removeChild(bootOv); }, 650);
        } else {
          setTimeout(bootCheck, 300);
        }
      }
      bootCheck();
    }
    // 性能：窗口隐藏/最小化时暂停壁纸视频，恢复可见后继续播放
    document.addEventListener('visibilitychange', function () {
      if (!bgVideoEl || !bgVideoEl.getAttribute('src')) return;
      if (document.hidden) {
        try { bgVideoEl.pause(); } catch (e) { /* ignore */ }
      } else {
        try { var pp = bgVideoEl.play(); if (pp && pp.catch) pp.catch(function () { /* ignore */ }); } catch (e) { /* ignore */ }
      }
    });
    // Ctrl+K 命令面板
    document.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && !e.altKey && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        e.stopPropagation();
        togglePalette();
      }
      // Ctrl+`：切换终端停靠面板（VS Code 习惯）
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && !e.altKey && e.key === '`') {
        e.preventDefault();
        e.stopPropagation();
        toggleTerminal();
      }
    }, true);
    // 性能：窗口隐藏/最小化时暂停全部装饰动画（CSS animation-play-state），恢复可见后继续
    document.addEventListener('visibilitychange', function () {
      document.body.classList.toggle('dsh-idle', document.hidden);
    });
    if (desktop.onFxConfig) {
      var cpSyncTimer = null;
      desktop.onFxConfig(function () {
        // 面板打开时实时同步开关状态（性能模式联动等）
        if (!cpState.open || !desktop.getCfg) return;
        if (cpSyncTimer) clearTimeout(cpSyncTimer);
        cpSyncTimer = setTimeout(function () {
          desktop.getCfg().then(function (c) {
            if (c && cpState.open) renderControlPanel(c);
          }).catch(function () { /* ignore */ });
        }, 160);
      });
    }
    // 页面内提示（「已更换成功 ✔」等）：右下角 toast，自动消失，不打扰
    if (desktop.onAppToast) {
      desktop.onAppToast(function (t) { showAppToast(t); });
    }
    // 停靠面板已改为侧挂独立窗口：开合/标签由主进程直接管理，页内不再监听
    if (desktop.onDockOpened) {
      // 互斥：侧挂窗口打开时收起 dsh-plugin 商店
      desktop.onDockOpened(function () { toggleStore(false); });
    }
    if (desktop.onStoreProgress) {
      // 索引刷新实时进度：三源各自完成即提示，不再「只转圈无回应」
      desktop.onStoreProgress(function (m) {
        if (!m) return;
        if (m.phase === 'start') showStoreStatus(lang === 'en' ? 'Updating index (GitHub topic / search / npm in parallel)…' : '\u6B63\u5728\u66F4\u65B0\u7D22\u5F15\uFF08GitHub \u4E3B\u9898 / \u641C\u7D22 / npm \u4E09\u6E90\u5E76\u53D1\uFF09\u2026');
        else if (m.phase === 'source') {
          var srcName = m.src === 'topic' ? 'GitHub \u4E3B\u9898' : (m.src === 'search' ? 'GitHub \u641C\u7D22' : 'npm \u6CE8\u518C\u8868');
          showStoreStatus('\u7D22\u5F15\u6E90\u5B8C\u6210\uFF1A' + srcName + '\uFF08' + (m.count || 0) + ' \u4E2A\uFF09');
        } else if (m.phase === 'done') showStoreStatus('\u7D22\u5F15\u66F4\u65B0\u5B8C\u6210\uFF1A\u5171 ' + m.count + ' \u4E2A\u63D2\u4EF6', 'ok');
        else if (m.phase === 'fail') showStoreStatus('\u7D22\u5F15\u66F4\u65B0\u5931\u8D25\uFF1A\u5404\u6E90\u5747\u65E0\u54CD\u5E94\uFF08\u53EF\u80FD\u662F GitHub \u9650\u6D41\uFF0C\u7A0D\u540E\u518D\u8BD5\uFF09', 'fail');
      });
    }
    if (desktop.onStoreRefresh) {
      desktop.onStoreRefresh(function (s) {
        if (!s || !s.repos || !s.repos.length) return;
        // 后台全量索引刷新完成：无缝替换列表（安装进行中不打断）
        if (!storeState.busy) {
          applyStoreData({
            repos: s.repos,
            installed: storeState.installed,
            mirrors: storeState.mirrors,
            mirror: storeState.mirror,
            source: s.source,
            featured: s.featured || storeState.featured,
          });
        }
      });
    }
    if (desktop.onStoreStatus) {
      desktop.onStoreStatus(function (s) {
        if (!s || !s.fullName) return;
        if (s.state === 'progress') {
          storeState.statuses[s.fullName] = { state: 'installing', stage: s.stage || '', percent: s.percent };
          var now = Date.now();
          if (storeEl && storeState.open && (!storeState.lastProgressTs || now - storeState.lastProgressTs > 350)) {
            storeState.lastProgressTs = now;
            renderStoreList();
          }
          return;
        }
        if (s.state === 'installing') {
          storeState.statuses[s.fullName] = { state: 'installing' };
          showStoreStatus(s.fullName + ' \u5B89\u88C5\u4E2D\u2026');
        } else if (s.state === 'ok') {
          storeState.statuses[s.fullName] = { state: 'ok' };
          showStoreStatus(s.fullName + ' \u5B89\u88C5\u6210\u529F', 'ok');
        } else {
          storeState.statuses[s.fullName] = { state: 'fail' };
          showStoreStatus(s.fullName + ' \u5931\u8D25\uFF1A' + (s.detail || ''), 'fail');
        }
        if (storeEl && storeState.open) renderStoreList();
      });
    }
    // 重启服务实时状态：横幅按钮实时反馈（stopping → starting → ready/fail）
    if (desktop.onRestartState) {
      desktop.onRestartState(function (s) {
        if (!s) return;
        var btn = storeEl ? storeEl.querySelector('.dsh-store-restart-btn') : null;
        var subs = storeEl ? storeEl.querySelectorAll('.dsh-store-restart-note .dsh-store-note-sub') : [];
        var sub = subs.length ? subs[subs.length - 1] : null;
        if (s.phase === 'stopping' || s.phase === 'starting') {
          if (btn) { btn.disabled = true; btn.textContent = '\u23F3 ' + (s.text || '\u6B63\u5728\u91CD\u542F\u2026'); }
          if (sub) sub.textContent = s.text || '';
        } else if (s.phase === 'ready') {
          if (btn) { btn.disabled = true; btn.textContent = '\u2713 ' + (s.text || '\u670D\u52A1\u5DF2\u5C31\u7EEA'); }
          if (sub) sub.textContent = s.text || '';
        } else if (s.phase === 'fail') {
          if (btn) { btn.disabled = false; btn.textContent = '\u274C ' + (s.text || '\u91CD\u542F\u5931\u8D25\uFF0C\u70B9\u51FB\u91CD\u8BD5'); }
          if (sub) sub.textContent = s.text || '';
        }
      });
    }
    // 悬浮提示系统：fixed 定位 + 视口钳制，避免被容器/窗口边界截断
    var tipEl = null, tipTimer = null;
    function ensureTip() {
      if (tipEl) return tipEl;
      tipEl = document.createElement('div');
      tipEl.className = 'dsh-fx-tip hide';
      document.body.appendChild(tipEl);
      return tipEl;
    }
    function showTip(target) {
      var text = target.getAttribute('data-tip');
      if (!text) return;
      var tip = ensureTip();
      tip.textContent = text;
      tip.classList.remove('hide');
      var r = target.getBoundingClientRect();
      var w = tip.offsetWidth, h = tip.offsetHeight;
      var left = Math.min(Math.max(8, r.left + r.width / 2 - w / 2), window.innerWidth - w - 8);
      var above = r.top - h - 8;
      var top = above >= 4 ? above : Math.min(r.bottom + 8, window.innerHeight - h - 8);
      tip.style.left = Math.round(left) + 'px';
      tip.style.top = Math.round(top) + 'px';
    }
    function hideTip() { if (tipEl) tipEl.classList.add('hide'); }
    document.addEventListener('mouseover', function (e) {
      var t = e.target && e.target.closest ? e.target.closest('.dsh-help') : null;
      if (t) { if (tipTimer) clearTimeout(tipTimer); showTip(t); }
      else { tipTimer = setTimeout(hideTip, 150); }
    });
    document.addEventListener('mouseout', function (e) {
      var t = e.target && e.target.closest ? e.target.closest('.dsh-help') : null;
      if (t) tipTimer = setTimeout(hideTip, 150);
    });
    document.addEventListener('DOMContentLoaded', function () {
      if (desktop.onFxConfig) {
        desktop.onFxConfig(function (c) { applyCfg(c); });
      }
      if (desktop.getFxConfig) {
        try {
          desktop.getFxConfig().then(function (c) { applyCfg(c); });
        } catch (e) { applyCfg(null); }
      } else {
        applyCfg(null);
      }
    });
    if (document.readyState !== 'loading') {
      // DOMContentLoaded 已过：直接应用
      setTimeout(function () {
        if (desktop.onFxConfig) desktop.onFxConfig(function (c) { applyCfg(c); });
        if (desktop.getFxConfig) desktop.getFxConfig().then(function (c) { applyCfg(c); }).catch(function () { applyCfg(null); });
        else applyCfg(null);
      }, 50);
    }
  }
  boot();
})();
