// DeepSeek Harness Desktop — PTY 托管进程
// 由桌面端用「部署环境的 node.exe」启动（与 workspace 内 node-pty 的 ABI 一致），
// 通过 stdio JSON 行协议与主进程通信：
//   入站（stdin，每行一个 JSON）：{t:'write',d} {t:'resize',cols,rows} {t:'kill'}
//   出站（stdout，每行一个 JSON）：{t:'data',d} {t:'exit',code}
// argv: [node-pty所在目录, 起始目录, cols, rows]
'use strict';
const path = require('path');
const os = require('os');

const ptyDir = process.argv[2];
const startCwd = process.argv[3] || os.homedir();
const cols = Math.max(2, Number(process.argv[4]) || 80);
const rows = Math.max(1, Number(process.argv[5]) || 24);

let pty;
try {
  pty = require(path.join(ptyDir, 'node-pty'));
} catch (e) {
  process.stdout.write(JSON.stringify({ t: 'fatal', msg: 'node-pty load failed: ' + (e && e.message) }) + '\n');
  process.exit(1);
}

const out = (obj) => { try { process.stdout.write(JSON.stringify(obj) + '\n'); } catch (e) { /* ignore */ } };
const shell = process.env.ComSpec || 'cmd.exe';

let term;
try {
  term = pty.spawn(shell, [], {
    name: 'xterm-color',
    cols,
    rows,
    cwd: startCwd,
    env: Object.assign({}, process.env, { FORCE_COLOR: '1', TERM: 'xterm-256color', GIT_TERMINAL_PROMPT: '1' }),
  });
} catch (e) {
  // ConPTY 不可用（老版本 Windows 10 等）→ 通知主进程回退兼容模式
  out({ t: 'fatal', msg: 'pty spawn failed: ' + ((e && e.message) || e) });
  process.exit(1);
}

term.onData((d) => out({ t: 'data', d }));
term.onExit((e) => { out({ t: 'exit', code: e.exitCode }); process.exit(0); });
// 就绪握手：PTY 建好即通知主进程（主进程据此判定 pty/兼容模式）
out({ t: 'ready', cols, rows });

let buf = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (c) => {
  buf += c;
  let i;
  while ((i = buf.indexOf('\n')) >= 0) {
    const line = buf.slice(0, i);
    buf = buf.slice(i + 1);
    if (!line.trim()) continue;
    try {
      const m = JSON.parse(line);
      if (m.t === 'write') term.write(String(m.d == null ? '' : m.d));
      else if (m.t === 'resize') term.resize(Math.max(2, m.cols | 0), Math.max(1, m.rows | 0));
      else if (m.t === 'kill') { try { term.kill(); } catch (e) { /* ignore */ } process.exit(0); }
    } catch (e) { /* 忽略坏行 */ }
  }
});
process.stdin.on('end', () => { try { term.kill(); } catch (e) { /* ignore */ } process.exit(0); });
