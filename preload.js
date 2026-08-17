'use strict';
const { contextBridge, ipcRenderer, webUtils } = require('electron');

contextBridge.exposeInMainWorld('desktop', {
  // 启动页 / 端口弹窗
  submitPort: (value) => ipcRenderer.send('port-submit', value),
  onStatus: (cb) => ipcRenderer.on('splash-status', (_e, msg) => cb(msg)),
  // fx 特效运行时
  getFxConfig: () => ipcRenderer.invoke('fx:get-config'),
  getLogo: () => ipcRenderer.invoke('fx:get-logo'),
  onFxConfig: (cb) => ipcRenderer.on('fx:config', (_e, cfg) => cb(cfg)),
  fxTheme: (d) => ipcRenderer.send('fx:theme', d),
  taskProgress: (p) => ipcRenderer.send('fx:task-progress', p),
  // 窗口控制（自绘标题栏 / 启动页）
  winAction: (a) => ipcRenderer.send('win:action', a),
  titlebarDblClick: () => ipcRenderer.send('win:titlebar-dblclick'),
  openMenu: (x, y) => ipcRenderer.send('win:open-menu', { x, y }),
  // 插件商店
  storeFetch: (page) => ipcRenderer.invoke('store:fetch', page),
  storeIndex: () => ipcRenderer.invoke('store:index'),
  storeRefresh: () => ipcRenderer.invoke('store:refresh'),
  onStoreRefresh: (cb) => ipcRenderer.on('store:refreshed', (_e, s) => cb(s)),
  onStoreProgress: (cb) => ipcRenderer.on('store:progress', (_e, m) => cb(m)),
  storeDetail: (fullName) => ipcRenderer.invoke('store:detail', fullName),
  storeUpdates: () => ipcRenderer.invoke('store:updates'),
  storeReadme: (repo) => ipcRenderer.invoke('store:readme', repo),
  storeTranslate: (text) => ipcRenderer.invoke('store:translate', text),
  storeCopyHelp: (repo) => ipcRenderer.invoke('store:copy-help', repo),
  storeInstall: (list) => ipcRenderer.invoke('store:install', list),
  storeUninstall: (list) => ipcRenderer.invoke('store:uninstall', list),
  onRestartState: (cb) => ipcRenderer.on('restart:state', (_e, s) => cb(s)),
  storeRestart: () => ipcRenderer.send('store:restart'),
  setStoreMirror: (key) => ipcRenderer.send('store:mirror', key),
  storePing: () => ipcRenderer.invoke('store:ping'),
  storeCancel: () => ipcRenderer.send('store:cancel'),
  onStoreStatus: (cb) => ipcRenderer.on('store:status', (_e, s) => cb(s)),
  // 配置
  getCfg: () => ipcRenderer.invoke('cfg:get'),
  // 终端面板
  termCwd: () => ipcRenderer.invoke('term:cwd'),
  termCd: (target) => ipcRenderer.invoke('term:cd', target),
  termRun: (payload) => ipcRenderer.invoke('term:run', payload),
  termKill: () => ipcRenderer.send('term:kill'),
  termInit: (dim) => ipcRenderer.invoke('term:init', dim),
  termWrite: (data) => ipcRenderer.send('term:write', data),
  termResize: (dim) => ipcRenderer.send('term:resize-pty', dim),
  onTermData: (cb) => ipcRenderer.on('term:data', (_e, d) => cb(d)),
  onTermDone: (cb) => ipcRenderer.on('term:done', (_e, d) => cb(d)),
  onTermDock: (cb) => ipcRenderer.on('term:dock', (_e, d) => cb(d)),
  onDockOpened: (cb) => ipcRenderer.on('dock:opened', () => cb()),
  docOpen: () => ipcRenderer.invoke('doc:open'),
  docSave: (payload) => ipcRenderer.invoke('doc:save', payload),
  docRead: (path) => ipcRenderer.invoke('doc:read', path),
  getPathForFile: (file) => { try { return webUtils.getPathForFile(file); } catch (e) { return null; } },
  // 工作区文件（files/ 目录：复制进入后 agent 可直接读取）
  workspaceAdd: () => ipcRenderer.invoke('ws:add'),
  workspaceAddPaths: (paths) => ipcRenderer.invoke('ws:add-paths', paths),
  workspaceList: () => ipcRenderer.invoke('ws:list'),
  workspaceDelete: (path) => ipcRenderer.invoke('ws:delete', path),
  // 余额 / 启动页
  getBalance: () => ipcRenderer.invoke('balance:get'),
  splashEnter: () => ipcRenderer.send('splash:enter'),
  splashSet: (d) => ipcRenderer.send('splash:set', d || {}),
  onSplashCfg: (cb) => ipcRenderer.on('splash:cfg', (_e, c) => cb(c)),
  // 首次运行环境部署
  setupStart: () => ipcRenderer.send('setup:start'),
  setupQuit: () => ipcRenderer.send('setup:quit'),
  setupOpenLog: () => ipcRenderer.send('setup:open-log'),
  onSetupState: (cb) => ipcRenderer.on('setup:state', (_e, s) => cb(s)),
  // 外链 / 关闭选择
  openExternal: (url) => ipcRenderer.send('win:open-external', url),
  closeChoice: (payload) => ipcRenderer.send('close:choice', payload),
  // 页面内提示（「已更换成功」toast）
  onAppToast: (cb) => ipcRenderer.on('app:toast', (_e, t) => cb(t)),
  // 会话总览
  sessionsList: () => ipcRenderer.invoke('sessions:list'),
});
