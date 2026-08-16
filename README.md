# DESK HARNESS

> DeepSeek Harness 的 Windows 桌面壳 —— 一个 Electron 应用，窗口内完整加载并保留网页版全部功能与界面，再叠加桌面专属体验。

**DESK HARNESS** 自动部署并拉起本地 `dsh web` 服务（127.0.0.1），让 DeepSeek Harness 像原生桌面应用一样运行：托盘驻留、自绘标题栏、终端/文档停靠面板、插件商店、任务进度条、系统通知，开箱即用——**目标机器无需预装 Node.js / pnpm / npx**。

## ✨ 特性

- **零环境依赖**：首次启动自动检测并一键部署（Node.js / pnpm / npx / `@deepseek-ai/dsh` 本机已有则直接复用不下载），随后自动拉起服务进入主界面
- **服务自管理**：在部署工作区（`<安装目录>\deepseekharness-desktop\workspace`）内以 `npx --yes dsh web` 拉起，与手动终端启动完全一致；失败自动降级（裸 `dsh` → 绝对路径短路径），全程无 PowerShell 间接层，进程退出秒级感知
- **科技感启动页**：环境/服务检查清单、倒计时/立即进入、首次引导、可自定义欢迎语与背景图
- **自绘标题栏**：渐变 + 毛玻璃，含菜单、会话标题、Token 胶囊、💰 余额胶囊（读取本地凭据，每 5 分钟更新）
- **终端 / 文档停靠面板**：单窗口右侧滑出（不压缩对话区），基于 node-pty 的真终端，`` Ctrl+` `` 唤起
- **插件商店 dsh-plugin**：全量索引（GitHub topic + Search API + npm 注册表多源聚合）、精选/全部/我的插件分区、README 双语翻译、更新检测（显式版本安装，兼容 pnpm 供应链策略）、安装/卸载后一键重启生效
- **桌面细节**：任务栏进度条、任务完成系统通知、`Ctrl+Alt+D` 全局唤起、单实例、深/浅主题自适应、窗口置顶、开机自启动
- **可自定义**：背景图（图片/视频，浓度可调）、界面图标与 exe 图标一体更换、端口、特效开关（视觉特效 / 标题栏 / Token 胶囊 / 进度条）

## 📦 安装

从 [Releases](https://github.com/llyyhh0487/desk-harness/releases) 下载最新 `desk-harness-setup-1.0.0.exe`：

1. 运行安装包：标准向导，**可选安装目录**（该目录即部署位置）、创建桌面快捷方式、完成后自动启动
2. 首次启动自动部署环境（有 Node/pnpm 的机器零下载；没有则自动下载安装），随后自动拉起服务进入主界面
3. 卸载：控制面板「应用和功能」或安装目录 `Uninstall DeepSeek Harness.exe`；卸载会删除部署目录与配置目录，`.dsh` 会话/插件数据保留

> 数据位置：部署环境在 `<安装目录>\deepseekharness-desktop\`（env 运行时 + workspace 依赖）；配置在 `%APPDATA%\deepseekharness-desktop\`；会话与插件沿用 DSH 官方目录 `C:\Users\<你>\.dsh`（与命令行版共享，凭据无需重新配置）。

## 🔨 从源码构建

```powershell
cd desktop
npm install            # Electron 下载慢可配置镜像：
                       #   $env:ELECTRON_MIRROR = "https://npmmirror.com/mirrors/electron/"
                       #   $env:ELECTRON_BUILDER_BINARIES_MIRROR = "https://npmmirror.com/mirrors/electron-builder-binaries/"

npm start              # 开发模式运行（直接复用仓库里的 dsh 后端）

npm run pack           # 打包 NSIS 安装包 → dist/desk-harness-setup-1.0.0.exe
```

开发模式会从 exe/工作目录**向上回溯**查找仓库的 `node_modules\@deepseek-ai\dsh`；打包版则使用部署工作区。

## 🚀 发布到 GitHub（含 dsh-plugin 主题）

1. 新建仓库（建议名 `desk-harness`），把本目录（`desktop/`）作为仓库根推上去；
2. 在 Releases 页发布 tag（如 `v1.0.0`）并上传 `dist/desk-harness-setup-1.0.0.exe`；
3. 给仓库添加主题：仓库主页右上角 **About → ⚙ → Topics** 输入 `dsh-plugin` 保存（主题规则：小写字母/数字/连字符、≤50 字符、≤20 个；详见 [GitHub 官方文档](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/classifying-your-repository-with-topics)）。添加后该仓库会出现在 [github.com/topics/dsh-plugin](https://github.com/topics/dsh-plugin)，并被 DESK HARNESS 的插件商店索引收录。

## 🔍 故障排查

服务拉起是全链路日志化的，拉不起来时打开 `%APPDATA%\deepseekharness-desktop\`：

| 文件 | 内容 |
| --- | --- |
| `launch.log` | 拉起全链路：环境快照 → 每次拉起命令/cwd → 端口探测每步结果 → 服务前 10 秒输出 → 最终结论 |
| `service-out.log` | 服务自身 stdout/stderr |
| `server.log` | 桌面端实际执行的启动命令 |
| `setup.log` | 首次部署过程 |

手动排查：在 `workspace` 目录打开终端执行 `npx dsh web` 即可拉起服务（与桌面端同款命令）。

## 🗂 目录结构

```
desktop/
  main.js           主进程（窗口/托盘/菜单/部署/服务监督式拉起/商店/终端/余额）
  preload.js        渲染层桥（contextIsolation + sandbox，仅暴露白名单 API）
  fx.js / fx.css    注入网页版的桌面运行时（特效/标题栏/商店/面板/命令面板）
  splash.html       启动页        setup.html      首次部署窗口
  dock.html / dock.js / term-helper.js   终端停靠面板（xterm + node-pty）
  prompt.html       端口设置      close-dialog.html  关闭确认
  build/            图标与 NSIS 脚本     scripts/restart-service.ps1（手动重启脚本）
```

## ⚖️ License

[MIT](./LICENSE)
