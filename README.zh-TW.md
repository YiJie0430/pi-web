# HT WIKI

[English](./README.md) | [简体中文](./README.zh-CN.md) | [日本語](./README.ja.md) | [Русский](./README.ru.md)

HT WIKI 是 [pi 程式開發智能體](https://github.com/badlogic/pi-mono) 的本機網頁介面。它會讀取你本機的 pi 會話檔案，在瀏覽器裡提供會話管理、即時對話、模型設定、技能管理和專案檔案預覽。

![HT WIKI 在瀏覽器中展示結構化 Markdown、工具呼叫和專案導覽](https://raw.githubusercontent.com/agegr/pi-web/main/docs/screenshot2.png)

同一個 pi 會話在終端機和 HT WIKI 中的呈現：結構化的工具呼叫、可讀的 Markdown、會話瀏覽和更清晰的結果。

## 快速開始

HT WIKI 需要 Node.js 22.19.0 或更新版本。可用 `node --version` 檢查目前版本。

**無需安裝，直接執行：**

```bash
npx @agegr/pi-web@latest
```

**或全域安裝後使用：**

```bash
npm install -g @agegr/pi-web
pi-web
```

啟動後打開 [http://127.0.0.1:30141](http://127.0.0.1:30141)。命令列會在伺服器就緒後嘗試自動開啟瀏覽器。HT WIKI 預設僅監聽 `127.0.0.1`。

**可選參數：**

```bash
pi-web --port 8080              # 自訂埠號
pi-web --hostname 0.0.0.0       # 在可信網路中開放存取
pi-web -p 8080 -H 0.0.0.0       # 組合使用
pi-web --no-open                # 不自動開啟瀏覽器

PORT=8080 pi-web                # 也支援環境變數
PI_WEB_HOSTNAME=0.0.0.0 pi-web  # 顯式開放網路存取
PI_WEB_ALLOWED_HOSTS=pi-web.internal pi-web  # 允許指定的代理或自訂主機名稱
PI_WEB_PASSWORD='足夠長的隨機密碼' pi-web  # 啟用 Basic Auth（使用者名稱固定為 pi）
PI_WEB_NO_OPEN=1 pi-web         # 適用於背景服務或開機自啟
```

設定 `PI_WEB_PASSWORD` 後，網頁和所有 API 端點都會啟用 HTTP Basic Auth，使用者名稱固定為 `pi`。未設定或設定為空值時不啟用認證。

> **安全性提醒**：HT WIKI 可以呼叫高權限智能體。Basic Auth 不會加密傳輸中的密碼，因此不要把明文 HTTP 暴露到網際網路。遠端存取時應使用可信反向代理提供 HTTPS，或透過可信 VPN 存取。

API 請求僅接受 loopback 名稱、IP 字面值、目前監聽主機名稱，以及 `PI_WEB_ALLOWED_HOSTS` 中以逗號分隔的精確主機名稱。可信反向代理使用不同的外部主機名稱時，請設定該變數。

## HTTP 代理

HT WIKI 的伺服器端模型請求和 API 請求會讀取標準的 `HTTP_PROXY`、`HTTPS_PROXY` 和 `NO_PROXY` 環境變數。

**macOS 或 Linux：**

```bash
HTTP_PROXY=http://127.0.0.1:7890 \
HTTPS_PROXY=http://127.0.0.1:7890 \
NO_PROXY=localhost,127.0.0.1 \
npx @agegr/pi-web@latest
```

**Windows PowerShell：**

```powershell
$env:HTTP_PROXY = "http://127.0.0.1:7890"
$env:HTTPS_PROXY = "http://127.0.0.1:7890"
$env:NO_PROXY = "localhost,127.0.0.1"
npx @agegr/pi-web@latest
```

## 功能介紹

- **接續歷史工作**：打開網頁就能按專案找到以前的 pi 對話，不必在終端機裡翻檔案或記住會話路徑。
- **安全探索不同方向**：可以從某條歷史訊息重新開始，也可以複製出一條獨立的新路線，探索方案時不怕弄亂原來的對話。
- **跨分支工作**：在側邊欄切換 Git worktree，讓新會話和檔案總管跟隨你選擇的 checkout。
- **邊聊邊看專案檔案**：左側瀏覽專案檔案，右側開啟原始碼、文件、圖片、音訊和 PDF；檔案變化會自動重新整理，適合邊讓 agent 修改邊檢查結果。
- **隨時掌握會話狀態**：在頂部就能看到上下文佔用、花費、壓縮狀態和系統提示詞，長會話不再像黑箱。
- **在網頁中完成設定**：模型、登入/API key、模型測試和技能開關都能在網頁裡處理，設定 agent 時不用在多個工具之間來回切換。
- **多語言介面**：支援英文和繁體中文介面，可從頂部欄位切換。

## 注意事項

- **資料目錄**：預設讀取 `~/.pi/agent/sessions` 下的會話檔案。可透過環境變數 `PI_CODING_AGENT_DIR` 指定其他 pi agent 目錄。
- **會話檔案**：路徑格式為 `~/.pi/agent/sessions/<編碼後的工作目錄>/<時間戳>_<uuid>.jsonl`。
- **模型設定**：Models 面板讀寫 pi agent 目錄下的 `models.json`，模型列表和預設模型由 pi 的設定解析得到。
- **檔案存取**：檔案瀏覽和預覽限於目前選擇的專案目錄，以及會話中已出現過的工作目錄。
- **Git Worktree**：何時顯示切換器、新建目錄在哪裡、刪除會影響什麼，請見 [HT WIKI 中的 Worktree](./docs/worktrees.zh-CN.md)。
- **Fork 與會話內分支的區別**：Fork 會建立新的 `.jsonl` 檔案；「從此處編輯」是同一個會話檔案內的分支。
- **介面語言**：預設使用繁體中文（zh-TW）。可在頂部語言選單切換為英文。語言偏好會儲存在瀏覽器的 `localStorage` 中。

## 開發

```bash
npm install
npm run dev -- --hostname 0.0.0.0
```

本機開發伺服器執行在 [http://127.0.0.1:30141](http://127.0.0.1:30141)。加上 `--hostname 0.0.0.0` 可讓同網段的其他裝置存取。若只需本機存取，執行 `npm run dev` 即可。

常用檢查：

```bash
node_modules/.bin/tsc --noEmit
npm run lint
```

開發時不要執行 `next build` / `npm run build`，它會寫入 `.next/`，容易影響正在執行的 dev server。釋出流程再執行建置。

## 專案結構

```text
app/
  api/
    agent/          # 建立/驅動 AgentSession，提供 SSE 事件串流
    auth/           # OAuth 和 API key 管理
    cwd/browse/     # 伺服器端目錄瀏覽
    cwd/validate/   # 自訂工作目錄驗證
    default-cwd/    # 取得 pi 預設工作目錄
    files/          # 檔案列表、讀取、預覽、監控
    home/           # 目前使用者 home 目錄
    models/         # 可用模型、預設模型、thinking levels
    models-config/  # 讀寫 models.json、測試模型
    sessions/       # 會話讀取、重新命名、刪除、上下文、HTML 匯出
    skills/         # 技能列表、搜尋、安裝、啟用/停用
    worktrees/      # Git worktree 管理
components/
  AppShell.tsx        # 主版面配置、URL 狀態、頂部面板、檔案頁籤
  SessionSidebar.tsx  # 專案選擇、會話樹、檔案總管
  DirectoryPicker.tsx # 支援瀏覽和路徑輸入的工作目錄選擇器
  ChatWindow.tsx      # 訊息區、SSE、拖曳圖片、minimap
  ChatInput.tsx       # 輸入欄、模型/工具/thinking/compact/slash 控制項
  MessageView.tsx     # 訊息、thinking、tool call/result 呈現
  ModelsConfig.tsx    # 模型和認證設定面板
  SkillsConfig.tsx    # 技能管理面板
  FileExplorer.tsx    # 檔案樹
  FileViewer.tsx      # 原始碼、diff、圖片、音訊、PDF、DOCX 預覽
lib/
  directory-browser.ts # 目錄規範化和安全列舉工具
  http-dispatcher.ts  # 伺服器端 fetch 的 HTTP(S) 代理設定
  rpc-manager.ts      # AgentSessionWrapper 生命週期和全域 registry
  session-reader.ts   # 解析 .jsonl 會話檔案和分支上下文
  normalize.ts        # 規範化 toolCall 欄位名稱
  file-access.ts      # 檔案讀取安全邊界
  file-paths.ts       # 檔案路徑編碼/相對路徑工具
  markdown.ts         # Markdown/Mermaid/KaTeX 外掛設定
  pi-types.ts         # pi 相關型別
  worktree.ts         # 專案/worktree 解析和 Git worktree 操作
hooks/
  useAgentSession.ts  # 會話載入、傳送命令、SSE 狀態機
  useAudio.ts         # 完成提示音
  useDragDrop.ts      # 圖片拖曳
  useTheme.ts         # 主題切換
bin/
  pi-web.js           # npm CLI 進入點
instrumentation.ts    # 初始化伺服器端 HTTP dispatcher
```

## 技術棧

- **前端**：Next.js 16 + React 19 + Tailwind CSS 4
- **後端**：Next.js API Routes + SSE（Server-Sent Events）
- **核心**：@earendil-works/pi-agent-core / pi-coding-agent / pi-ai / pi-tui
- **Markdown**：react-markdown + remark-gfm + rehype-katex + mermaid
- **語言**：TypeScript 5
