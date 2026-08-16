// dock.js — 侧挂窗口逻辑（终端 xterm / 文档阅读 / 工作区文件）
(function () {
  'use strict';
  var lang = 'zh';
  var T = function (zh, en) { return lang === 'en' ? en : zh; };
  var $ = function (tag, cls, parent) {
    var el = document.createElement(tag);
    if (cls) el.className = cls;
    (parent || document.body).appendChild(el);
    return el;
  };

  // ---------------- 标签切换 ----------------
  var tabBtns = { term: document.getElementById('tab-term'), doc: document.getElementById('tab-doc'), files: document.getElementById('tab-files') };
  var views = { term: document.getElementById('view-term'), doc: document.getElementById('view-doc'), files: document.getElementById('view-files') };
  var curTab = 'term';
  function showTab(name) {
    curTab = name;
    Object.keys(tabBtns).forEach(function (k) { tabBtns[k].classList.toggle('on', k === name); });
    Object.keys(views).forEach(function (k) { views[k].classList.toggle('on', k === name); });
    if (name === 'term' && term) setTimeout(function () { term.focus(); fitTerm(); }, 60);
    if (name === 'files') renderFiles();
  }
  tabBtns.term.addEventListener('click', function () { showTab('term'); });
  tabBtns.doc.addEventListener('click', function () { showTab('doc'); });
  tabBtns.files.addEventListener('click', function () { showTab('files'); });
  document.getElementById('btn-close').addEventListener('click', function () { desktop.winAction('dock-close'); });

  // ---------------- 终端 ----------------
  var term = null;
  var termMode = 'line';
  var termStatus = document.getElementById('term-status');
  var modeBadge = document.getElementById('mode-badge');

  function setupLineMode(cwd) {
    var tv = views.term;
    tv.innerHTML = '';
    var out = $('div', null, tv); out.id = 'lineout';
    var row = $('div', 'line-row', tv);
    var inp = $('input', null, row);
    inp.placeholder = T('输入命令，回车执行（cd 可保持）', 'Run a command, Enter to execute (cd persists)');
    inp.spellcheck = false;
    var hist = []; var hi = -1;
    var append = function (t) { out.textContent += t; out.scrollTop = out.scrollHeight; };
    var run = function () {
      var cmd = inp.value.trim();
      if (!cmd) return;
      hist.push(cmd); hi = hist.length;
      append(T('> ', '> ') + cmd + '\n');
      inp.value = '';
      desktop.termRun({ cmd: cmd, cwd: cwd }).then(function (r) {
        if (r && r.error) append(T('(错误) ', '(error) ') + r.error + '\n');
      });
    };
    inp.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') run();
      else if (e.key === 'ArrowUp') { e.preventDefault(); if (hi > 0) { hi--; inp.value = hist[hi] || ''; } }
      else if (e.key === 'ArrowDown') { e.preventDefault(); if (hi < hist.length - 1) { hi++; inp.value = hist[hi] || ''; } else { hi = hist.length; inp.value = ''; } }
    });
    desktop.onTermData(function (d) { if (d && d.text !== undefined) append(d.text); });
    desktop.onTermDone(function () { /* 兼容模式结束标记，无需动作 */ });
    document.getElementById('btn-clear').addEventListener('click', function () { out.textContent = ''; });
    document.getElementById('btn-kill').addEventListener('click', function () { desktop.termKill(); });
    row.querySelector('input').focus();
  }

  function setupXterm(cwd, cols, rows) {
    var el = document.getElementById('term');
    term = new Terminal({
      convertEol: false,
      cursorBlink: true,
      fontSize: 12.5,
      fontFamily: 'Consolas, "Cascadia Mono", monospace',
      theme: {
        background: '#0c101e',
        foreground: '#c9d4e8',
        cursor: '#00e5ff',
        cursorAccent: '#0c101e',
        selectionBackground: 'rgba(77, 107, 254, 0.4)',
        black: '#1e2438', red: '#ff7b8a', green: '#34d399', yellow: '#fbbf24',
        blue: '#6d8dff', magenta: '#c084fc', cyan: '#22d3ee', white: '#c9d4e8',
        brightBlack: '#5a6490',
      },
    });
    term.open(el);
    term.onData(function (d) { desktop.termWrite(d); });
    term.onResize(function (s) { desktop.termResize({ cols: s.cols, rows: s.rows }); });
    desktop.onTermData(function (d) { if (d && d.text !== undefined && term) term.write(d.text); });
    desktop.onTermDone(function (d) {
      if (!term) return;
      if (d && d.code !== null) {
        // 会话退出 → 自动重启 PTY（回车即可继续使用，不会「无输出」）
        term.write('\r\n\x1b[90m[会话已退出，正在重启…]\x1b[0m\r\n');
        setTimeout(function () {
          desktop.termInit({ cols: term.cols, rows: term.rows }).then(function (r) {
            if (r && r.mode === 'pty' && term) term.write('\x1b[90m[会话已就绪]\x1b[0m\r\n');
            else if (term) term.write('\r\n\x1b[90m[会话已结束]\x1b[0m\r\n');
          }).catch(function () { /* ignore */ });
        }, 300);
      }
    });
    document.getElementById('btn-clear').addEventListener('click', function () { if (term) term.clear(); });
    document.getElementById('btn-kill').addEventListener('click', function () { desktop.termKill(); });
    fitTerm();
    term.focus();
    term.write('\x1b[90mDESK HARNESS 终端 — ' + cwd + '\x1b[0m\r\n');
  }

  function fitTerm() {
    if (!term) return;
    try {
      var el = document.getElementById('term');
      var fh = term._core._renderService.dimensions.actualCellHeight || 19;
      var fw = term._core._renderService.dimensions.actualCellWidth || 8.2;
      var cols = Math.max(10, Math.floor((el.clientWidth - 16) / fw));
      var rows = Math.max(4, Math.floor((el.clientHeight - 12) / fh));
      term.resize(cols, rows);
    } catch (e) { /* ignore */ }
  }
  window.addEventListener('resize', function () { fitTerm(); });

  // ---------------- 文档 ----------------
  var docPathEl = document.getElementById('docpath');
  var docTabsEl = document.getElementById('doctabs');
  var docEditor = document.getElementById('editor');
  var docStatus = document.getElementById('docstatus');
  var dockDocs = [], docActive = -1;

  function docName(p) { var parts = String(p).split(/[\\/]/); return parts[parts.length - 1] || p; }
  function updateDocs() {
    docTabsEl.innerHTML = '';
    var empty = docActive < 0 || !dockDocs.length;
    if (empty) {
      docEditor.value = '';
      docPathEl.textContent = T('尚未打开文档', 'No document open');
      docStatus.textContent = '';
      return;
    }
    dockDocs.forEach(function (d, i) {
      var t = $('div', 'doctab' + (i === docActive ? ' on' : ''), docTabsEl);
      var tn = $('span', 'tn', t); tn.textContent = (d.dirty ? '● ' : '') + docName(d.path);
      tn.title = d.path;
      var x = $('button', 'tx', t); x.textContent = '✕';
      x.addEventListener('click', function (e) { e.stopPropagation(); closeDoc(i); });
      t.addEventListener('click', function () { activateDoc(i); });
    });
    var d = dockDocs[docActive];
    docEditor.value = d.text;
    docEditor.scrollTop = 0;
    docPathEl.textContent = d.path;
    docStatus.textContent = d.dirty ? T('● 有未保存修改', '● Unsaved') : '';
    docStatus.className = 'docstatus' + (d.dirty ? ' err' : '');
  }
  function openDoc(path, text) {
    var found = -1;
    dockDocs.forEach(function (d, i) { if (d.path === path) found = i; });
    if (found >= 0) { dockDocs[found].text = text; docActive = found; }
    else { dockDocs.push({ path: path, text: text, dirty: false }); docActive = dockDocs.length - 1; }
    showTab('doc');
    updateDocs();
  }
  function activateDoc(i) { if (i < 0 || i >= dockDocs.length) return; docActive = i; updateDocs(); }
  function closeDoc(i) {
    if (i < 0 || i >= dockDocs.length) return;
    dockDocs.splice(i, 1);
    if (docActive >= dockDocs.length) docActive = dockDocs.length - 1;
    else if (docActive > i) docActive--;
    updateDocs();
  }
  docEditor.addEventListener('input', function () {
    if (docActive >= 0 && dockDocs[docActive]) {
      dockDocs[docActive].text = docEditor.value;
      if (!dockDocs[docActive].dirty) { dockDocs[docActive].dirty = true; updateDocs(); }
    }
  });
  document.getElementById('btn-opendoc').addEventListener('click', function () {
    desktop.docOpen().then(function (r) { if (r && r.ok) openDoc(r.path, r.text); }).catch(function () { /* ignore */ });
  });
  document.getElementById('btn-save').addEventListener('click', function () {
    if (docActive < 0 || !dockDocs[docActive]) { desktop.docOpen().then(function (r) { if (r && r.ok) openDoc(r.path, r.text); }); return; }
    var d = dockDocs[docActive];
    desktop.docSave({ path: d.path, text: d.text }).then(function (r) {
      if (r && r.ok) { d.dirty = false; docStatus.textContent = T('✓ 已保存 ', '✓ Saved '); docStatus.className = 'docstatus'; updateDocs(); }
      else { docStatus.textContent = (r && r.error) || 'save failed'; docStatus.className = 'docstatus err'; }
    }).catch(function (e) { docStatus.textContent = String((e && e.message) || e); docStatus.className = 'docstatus err'; });
  });
  document.getElementById('btn-reload').addEventListener('click', function () {
    if (docActive < 0 || !dockDocs[docActive]) return;
    var d = dockDocs[docActive];
    desktop.docRead(d.path).then(function (r) { if (r && r.ok) { d.text = r.text; d.dirty = false; updateDocs(); } }).catch(function () { /* ignore */ });
  });

  // ---------------- 工作区文件 ----------------
  var filesListEl = document.getElementById('files-list');
  function fmtSize(n) {
    n = Number(n) || 0;
    if (n < 1024) return n + ' B';
    if (n < 1048576) return (n / 1024).toFixed(1) + ' KB';
    return (n / 1048576).toFixed(1) + ' MB';
  }
  function renderFiles() {
    desktop.workspaceList().then(function (files) {
      filesListEl.innerHTML = '';
      if (!files || !files.length) {
        var emp = $('div', 'empty', filesListEl);
        emp.innerHTML = T('工作区还没有文件。<br>拖入文件或点击「＋添加文件」；<br>文件会复制到工作区 files/ 目录，<br>可直接让 DeepSeek 读取。', 'No workspace files yet.<br>Drop files or click "+ Add files";<br>files are copied into files/,<br>readable by DeepSeek directly.');
        return;
      }
      files.forEach(function (f) {
        var chip = $('div', 'fchip', filesListEl);
        var name = $('span', 'name', chip); name.textContent = '📄 ' + f.name; name.title = f.path;
        var size = $('span', 'size', chip); size.textContent = fmtSize(f.size);
        var del = $('button', 'del', chip); del.textContent = '✕';
        del.addEventListener('click', function (ev) {
          ev.stopPropagation();
          if (!window.confirm(T('删除工作区文件 ', 'Remove workspace file ') + f.name + ' ?')) return;
          desktop.workspaceDelete(f.path).then(function (r) { if (r && r.ok) renderFiles(); }).catch(function () { /* ignore */ });
        });
        chip.addEventListener('dblclick', function () {
          desktop.docRead(f.path).then(function (r) { if (r && r.ok) openDoc(r.path, r.text); }).catch(function () { /* ignore */ });
        });
      });
    }).catch(function () { /* ignore */ });
  }
  document.getElementById('btn-addfiles').addEventListener('click', function () {
    desktop.workspaceAdd().then(function (r) {
      if (r && r.ok && r.added && r.added.length) {
        renderFiles();
        var last = r.added[r.added.length - 1];
        desktop.docRead(last.path).then(function (rr) { if (rr && rr.ok) openDoc(rr.path, rr.text); }).catch(function () { /* ignore */ });
      }
    }).catch(function () { /* ignore */ });
  });

  // ---------------- 拖放 ----------------
  var dragDepth = 0;
  document.addEventListener('dragenter', function (e) { e.preventDefault(); dragDepth++; document.body.classList.add('drag-over'); });
  document.addEventListener('dragover', function (e) { e.preventDefault(); if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy'; });
  document.addEventListener('dragleave', function () { dragDepth--; if (dragDepth <= 0) { dragDepth = 0; document.body.classList.remove('drag-over'); } });
  document.addEventListener('drop', function (e) {
    e.preventDefault();
    dragDepth = 0;
    document.body.classList.remove('drag-over');
    var files = e.dataTransfer && e.dataTransfer.files;
    if (!files || !files.length) return;
    var paths = [];
    for (var i = 0; i < files.length; i++) {
      var p = desktop.getPathForFile ? desktop.getPathForFile(files[i]) : null;
      if (p) paths.push(p);
    }
    if (!paths.length) return;
    if (curTab === 'files') {
      desktop.workspaceAddPaths(paths).then(function (r) {
        if (r && r.ok && r.added && r.added.length) {
          renderFiles();
          var last = r.added[r.added.length - 1];
          desktop.docRead(last.path).then(function (rr) { if (rr && rr.ok) openDoc(rr.path, rr.text); }).catch(function () { /* ignore */ });
        }
      }).catch(function () { /* ignore */ });
      return;
    }
    desktop.docRead(paths[0]).then(function (r) {
      if (r && r.ok) openDoc(r.path, r.text);
    }).catch(function () { /* ignore */ });
  });

  // ---------------- 启动 ----------------
  function boot() {
    // 主进程切换标签（如点击文档/终端入口）→ 同步侧窗标签
    if (desktop.onTermDock) {
      desktop.onTermDock(function (d) {
        if (d && d.open && d.tab && tabBtns[d.tab]) showTab(d.tab);
      });
    }
    var cfgQ = Promise.resolve(desktop.getCfg ? desktop.getCfg() : {});
    var cwdQ = Promise.resolve(desktop.termCwd ? desktop.termCwd() : '');
    cfgQ.then(function (cfg) { if (cfg && cfg.lang === 'en') lang = 'en'; }).catch(function () { /* ignore */ });
    cwdQ.then(function (cwd) {
      var cwdEl = document.getElementById('cwd');
      if (cwdEl && cwd) { cwdEl.textContent = cwd; cwdEl.title = cwd; }
      desktop.termInit({ cols: 80, rows: 24 }).then(function (r) {
        if (r && r.ok && r.mode === 'pty') {
          termMode = 'pty';
          modeBadge.textContent = T('PTY 真终端', 'PTY');
          modeBadge.className = 'badge pty';
          setupXterm(cwd || '', r.cols || 80, r.rows || 24);
        } else {
          termMode = 'line';
          modeBadge.textContent = T('兼容模式', 'Line mode');
          modeBadge.className = 'badge line';
          setupLineMode(cwd || '');
        }
        termStatus.textContent = T('就绪', 'Ready');
      }).catch(function () {
        termMode = 'line';
        modeBadge.textContent = T('兼容模式', 'Line mode');
        modeBadge.className = 'badge line';
        setupLineMode(cwd || '');
      });
    }).catch(function () { setupLineMode(''); });
  }
  boot();
})();
