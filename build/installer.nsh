; DESK HARNESS 卸载自定义逻辑：
; 部署目录固定为安装目录下的 deepseekharness-desktop（env/node、workspace 依赖等），
; 卸载时一并删除；旧版本的自定义部署目录记录在 %APPDATA%\deepseekharness-desktop\deploy.ini
; （[deploy] 段），读取后同样删除。两者都只删 deepseekharness 自己的子目录，绝不越界。
; 注意：userData 被 main.js 固定为 %APPDATA%\deepseekharness-desktop（不随 productName 变化），
; 因此这里显式清理该目录（electron-builder 的 deleteAppDataOnUninstall 只删 %APPDATA%\DESK HARNESS）
!macro customUnInstall
  ReadINIStr $0 "$APPDATA\deepseekharness-desktop\deploy.ini" "deploy" "deployDir"
  RMDir /r "$INSTDIR\deepseekharness-desktop"
  StrCmp $0 "" +2 0
  RMDir /r "$0"
  RMDir /r "$APPDATA\deepseekharness-desktop"
!macroend
