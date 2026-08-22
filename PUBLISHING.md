# DESK HARNESS 发布指南（GitHub）

把 DESK HARNESS 发布到 GitHub 的完整步骤：仓库准备 → 自动发布（含 latest.yml）→ 代码签名 → 主题收录。

---

## 1. 准备仓库（首次）

```powershell
cd desktop
git init -b main
git add .
git commit -m "DESK HARNESS 1.0.0"
```

## 2. 创建 GitHub 仓库并推送（首次）

1. GitHub → **+** → **New repository**，名 `desk-harness`，Public，不勾自动 README；
2. 关联推送：

```powershell
git remote add origin https://github.com/<你的用户名>/desk-harness.git
git push -u origin main
```

3. 把 `package.json` 里 `repository` / `homepage` / `bugs` / `build.publish` 的
   `llyyhh0487` 替换成你的用户名，提交。

## 3. 自动发布（推荐，激活内置自动更新）

桌面端已内置 electron-updater，但需要发布时上传 `latest.yml` 才能让"检查更新"生效。

### 前置

1. GitHub Token：`repo` 权限（https://github.com/settings/tokens → Generate new token (classic) → 勾 `repo`）
2. 每次发布前把 `package.json` 的 `version` 加一（如 1.0.0 → 1.0.1）

### 执行

```powershell
cd desktop

# 国内镜像（防下载 Electron 二进制超时）
$env:ELECTRON_MIRROR = "https://npmmirror.com/mirrors/electron/"
$env:ELECTRON_BUILDER_BINARIES_MIRROR = "https://npmmirror.com/mirrors/electron-builder-binaries/"

$env:GH_TOKEN = "<repo 权限 token>"

npm run publish
```

`npm run publish` = `electron-builder --win nsis --publish always`，自动完成：
打包 exe → 生成 `latest.yml` → 上传到 GitHub Release（tag 与 version 对应）→ 无 tag 则自动创建。

发布后，旧版本用户点「检查更新」即收到新版本。

---

## 4. 代码签名（可选但强烈推荐）

未签名 exe 会被 SmartScreen 报"未知发布者"，且更新包校验失去安全意义。

### 证书获取

- **OV 证书**（推荐）：约 $200-300/年，DigiCert / Sectigo / 亚洲诚信等
- **EV 证书**：更贵，直接获得 SmartScreen 信誉不弹警告
- 自签名：免费但无 SmartScreen 信誉，仅内部分发测试

### 签名（用环境变量，不改代码）

```powershell
$env:CSC_LINK = "D:\path\to\cert.pfx"
$env:CSC_KEY_PASSWORD = "<证书密码>"

npm run publish   # 或 npm run pack
```

> 证书路径/密码是敏感信息，**不要写进 package.json 或提交 git**。

### 完整发布（签名 + 自动更新一步到位）

```powershell
$env:ELECTRON_MIRROR = "https://npmmirror.com/mirrors/electron/"
$env:ELECTRON_BUILDER_BINARIES_MIRROR = "https://npmmirror.com/mirrors/electron-builder-binaries/"
$env:GH_TOKEN = "<repo 权限 token>"
$env:CSC_LINK = "D:\path\to\cert.pfx"
$env:CSC_KEY_PASSWORD = "<证书密码>"

npm run publish
```

---

## 5. 添加 dsh-plugin 主题（让商店收录）

1. 仓库主页 → About 区 ⚙ → Topics 输入 `dsh-plugin`；
2. 可加 `deepseek` `deepseek-harness` `electron` `windows`；
3. Save changes。

规则：小写字母/数字/连字符，每个 ≤ 50 字符，最多 20 个。

---

## 注意事项

- 本仓库是**桌面壳**而非 dsh 插件包（无 `dsh.bundle` 声明），商店收录它是作为"发现入口"，用户点安装会作为普通依赖装，不会作为插件层加载——符合预期；不想进商店就别加 `dsh-plugin` 主题。
- 后端（dsh）仍叫 DeepSeek Harness，DESK HARNESS 是壳的名字，二者是壳与内核关系。
