# 🖥️ DESK HARNESS

> **DeepSeek Harness 的 Windows 桌面壳** —— 一个把网页版"装进"原生窗口的 Electron 魔法盒子 ✨

你以为你打开的是一个网页？不，你双击的是一个**桌面应用**。窗口里跑的是原汁原味的 DeepSeek Harness 网页版，外面套的是一层丝滑的桌面皮肤 🧥：托盘驻留、真终端、插件商店、任务栏进度条……全都开箱即用，目标机器上**什么都不用装**，双击 exe 就是全部。

> 没有 Node.js？没关系，它自己下 📦
> 没有 pnpm？没关系，它自己装 🛠️
> 连服务都是它自己拉起来的 🚀 —— 你只管坐下聊天。

---

## ✨ 它能干什么（aka 亮点速览）

| 能力 | 有多强 |
| --- | --- |
| 🪄 **零环境依赖** | 首次启动自动检测 → 一键部署（Node/pnpm/npx/dsh 全自动，已有就复用、不重复下载） |
| 🚀 **服务自管理** | 在 workspace 里 `npx --yes dsh web` 拉起，和你在终端手动敲的**一字不差**；失败自动降级三连：裸 `dsh` → 绝对路径短路径，全程零 PowerShell 黑箱 |
| 🌌 **科技感启动页** | 打字机状态、检查清单、倒计时/立即进入、自定义欢迎语和背景图 |
| 🎨 **自绘标题栏** | 渐变 + 毛玻璃 + 霓虹分界线，Token 胶囊、💰 余额胶囊（本地读凭据，5 分钟一刷） |
| 🖥️ **真·终端停靠面板** | 不是花架子——基于 node-pty 的**真终端**，侧边滑出不挤对话区，`` Ctrl+` `` 秒开 |
| 🧩 **dsh-plugin 插件商店** | 全量索引（GitHub topic + Search API + npm 三源聚合）、精选/全部/我的插件、README 双语翻译、更新检测、装完一键重启生效 |
| 🔔 **桌面细节控** | 任务栏进度条、完成通知、`Ctrl+Alt+D` 全局唤起、单实例、深浅主题自适应、置顶、开机自启 |
| 🖼️ **想怎么美就怎么美** | 换壁纸（图/视频都行）、换图标（界面 + exe 一体）、特效开关 |

---

## 📦 安装（给用户看的，就 3 步）

1. 去 [Releases](https://github.com/llyyhh0487/desk-harness/releases) 下载 `desk-harness-setup-1.0.0.exe`
2. 双击 → 选个目录 → 装完自动启动
3. 等它自己部署完（有 Node 的机器**零下载**秒过）→ 开聊 💬

卸载？控制面板 → 卸载。干净利落，只留你的会话数据（`.dsh`）在原地等你。

> 📂 数据去哪了：部署环境在 `<安装目录>\deepseekharness-desktop\`，配置在 `%APPDATA%\deepseekharness-desktop\`，会话/插件与命令行版共享 `C:\Users\<你>\.dsh`——**凭据不用重新配**。

---

## 🔨 从源码构建（给开发者看的）

```powershell
cd desktop
npm install            # 慢的话挂镜像：
                       #   $env:ELECTRON_MIRROR = "https://npmmirror.com/mirrors/electron/"
                       #   $env:ELECTRON_BUILDER_BINARIES_MIRROR = "https://npmmirror.com/mirrors/electron-builder-binaries/"

npm start              # 开发模式：直接复用仓库里的 dsh 后端，边改边跑
npm run pack           # 打包 → dist/desk-harness-setup-1.0.0.exe
```

小彩蛋 🥚：开发模式下它会**向上回溯目录树**找仓库的 `node_modules\@deepseek-ai\dsh`——把 exe 丢进仓库任意角落都能认出家。

---

## 🚀 发布到 GitHub（dsh-plugin 主题）

想让它出现在 [github.com/topics/dsh-plugin](https://github.com/topics/dsh-plugin) 并被商店索引收录？跟着 [PUBLISHING.md](./PUBLISHING.md) 走一遍：建仓 → Release 传安装包 → About→⚙→Topics 里加 `dsh-plugin`。主题规则记住三句话：小写字母数字连字符、每个 ≤50 字符、最多 20 个（详见 [GitHub 官方文档](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/classifying-your-repository-with-topics)）。

---

## 🔍 拉不起服务？先别慌

这套桌面端是**全链路日志化**的，`%APPDATA%\deepseekharness-desktop\` 里躺着四个侦探 🕵️：

| 文件 | 它在说什么 |
| --- | --- |
| `launch.log` | 拉起全链路：环境快照 → 每次命令/cwd → 端口探测每步 → 服务前 10 秒输出 → 结论 |
| `service-out.log` | 服务自己的 stdout/stderr（报错都在这） |
| `server.log` | 桌面端实际执行的启动命令 |
| `setup.log` | 首次部署全过程 |

手动排查口诀：打开 `workspace` 目录 → 终端敲 `npx dsh web`。桌面端用的就是这条命令，一模一样。

---

## 🗂 目录结构

```
desktop/
  main.js           主进程大脑（窗口/托盘/菜单/部署/监督式拉起/商店/终端/余额）
  preload.js        渲染层桥梁（contextIsolation + sandbox，只放行白名单 API）
  fx.js / fx.css    注入网页版的桌面皮肤（特效/标题栏/商店/面板/命令面板）
  splash.html       启动页        setup.html      首次部署窗口
  dock.html / dock.js / term-helper.js   终端停靠面板（xterm + node-pty）
  prompt.html       端口设置      close-dialog.html  关闭确认
  build/            图标与 NSIS 脚本     scripts/restart-service.ps1（手动重启脚本）
```

---

## ⚖️ License

[MIT](./LICENSE) —— 拿去用，玩得开心 🎉
