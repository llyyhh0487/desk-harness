# 发布指南（GitHub）

把 DESK HARNESS 发布到 GitHub 并让它出现在 [github.com/topics/dsh-plugin](https://github.com/topics/dsh-plugin) 的完整步骤。

## 1. 准备仓库

```powershell
cd desktop
git init -b main
git add .                    # .gitignore 已排除 node_modules / dist / 日志
git commit -m "DESK HARNESS 1.0.0"
```

## 2. 创建 GitHub 仓库并推送

1. 登录 GitHub → 右上角 **+** → **New repository**；
2. 仓库名建议 `desk-harness`，可见性 Public，**不要**勾选自动生成 README（本目录已有）；
3. 关联并推送：

```powershell
git remote add origin https://github.com/<你的用户名>/desk-harness.git
git push -u origin main
```

4. 推送后把 `package.json` 里 `repository` / `homepage` / `bugs` 三处的
   `<你的用户名>/desk-harness` 占位符替换成真实地址，再提交一次。

## 3. 发布安装包（Release）

1. 仓库页 → **Releases** → **Draft a new release**；
2. Tag 填 `v1.0.0`（或 **Create new tag**），标题 `DESK HARNESS 1.0.0`；
3. 把 `dist/desk-harness-setup-1.0.0.exe` 拖入附件区；
4. 勾选 **Set as the latest release** → **Publish release**。

## 4. 添加 dsh-plugin 主题

1. 仓库主页右上角 **About** 区域点 ⚙（齿轮）；
2. 在 **Topics** 输入框键入 `dsh-plugin`（匹配到既有主题直接点击即可）；
3. 可再加几个：`deepseek` `deepseek-harness` `electron` `windows`；
4. 点 **Save changes**。

主题规则（官方文档：[Classifying your repository with topics](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/classifying-your-repository-with-topics)）：
- 只用小写字母、数字、连字符；每个 ≤ 50 字符；最多 20 个。

## 5. 效果确认

- 打开 https://github.com/topics/dsh-plugin 能看到你的仓库；
- DESK HARNESS 插件商店的索引来源之一就是 GitHub topic `dsh-plugin` 与
  Search API（`topic:dsh-plugin`），索引 15 分钟冷却 + 打开商店时后台刷新，
  新仓库一般在数分钟到数小时内进入商店索引；
- 商店 README 双语翻译与描述抓取也来自该仓库的 README 与 About 描述。

## 注意事项

- 本仓库是**桌面壳**而非 dsh 插件包：它没有 `dsh.bundle` 声明，商店索引按
  DSH 信号过滤后仍会收录它（名字/描述含 deepseek-harness），用户点"安装"时
  会作为普通依赖安装、不会作为插件层加载——这符合预期（商店同时是发现入口）；
  若不想出现在商店索引里，就不要添加 `dsh-plugin` 主题，仅保留其他主题。
- 图标与品牌：`build/icon.ico`、`build/logo-256.png`、启动页/标题栏名称为
  **DESK HARNESS**；后端（dsh）仍叫 DeepSeek Harness，二者是壳与内核的关系。
