# 英文口說教練（給下一個 session 的 Claude）

每日 5 分鐘英文口說練習 App。使用者是梁婷瑋醫師（麻醉科，英文 A2–B1），**2026-09 底要去愛爾蘭做學術報告**——練醫學報告口說＋研討會 small talk＋旅行英文。平日零 API 純本地跑；每週用 Claude Code 產新題庫、按需深度批改。

## 系統拓撲

純前端 PWA：`index.html`（單一檔案）＋ `content/current-week.js`（題庫）＋ `manifest.webmanifest`/`sw.js`/`icons/`（PWA 三件套）。

- **正式入口 = GitHub Pages**：https://jenniferliang813-netizen.github.io/speaking-coach/ （repo：`jenniferliang813-netizen/speaking-coach`，main branch 根目錄直接發佈，**`git push` 即部署**，約 1 分鐘生效）。
- 使用者主要在**手機**用（加入主畫面當 App）。練習紀錄在 localStorage（key 前綴 `sc_`），每台裝置各自獨立。
- **`file://` 直開不能用麥克風**（瀏覽器封鎖），App 會顯示警告 banner。所以**任何改動都要 push 才算交付**。
- Service worker（`sw.js`）網路優先、離線退快取；改版若沒生效，請使用者完全關閉 App 重開。快取名 `sc-v1`，改 SHELL 清單時記得升版本號。

## 檔案地圖

| 檔案 | 職責 |
|---|---|
| `BUILD_SPEC.md` | **真相來源**：App 完整規格（Schema、評分規則、驗收條件）。改功能前先讀它、改完同步更新它 |
| `manifest.webmanifest` / `sw.js` / `icons/` | PWA：安裝資訊、離線快取、App 圖示（icons 由 PowerShell System.Drawing 生成） |
| `daily-speaking-coach-spec.md` | 最初需求藍圖（歷史文件，已被 BUILD_SPEC 取代，難度已依 A2-B1 下修） |
| `index.html` | App 本體（HTML+CSS+JS 全包，禁外部依賴） |
| `content/current-week.js` | 本週題庫，`window.WEEK_DATA`。每週由 generate-week 流程覆寫（舊的先存成 `archive-<週次>.js`） |
| `content/_used.json` | 出過的題目 id/title，防重複。產新週後要追加 |
| `content/_weak.json` | 使用者從 App 匯出的弱點統計（可能不存在） |
| `prompts/generate-week.md` | 每週產題 SOP（含難度規則、品質紅線） |
| `prompts/deep-review.md` | 深度批改 SOP |

## 已踩過的坑（別再踩）

0. **`file://` 直開時瀏覽器封鎖麥克風**（getUserMedia 與語音辨識都拿不到權限）——使用者 2026-07-03 實測「電腦上無法收到聲音」的根因。解法＝走 GitHub Pages（HTTPS）。不要再教使用者雙擊 index.html。
1. **`file://` 下 `fetch()` 本地 JSON 會被瀏覽器擋** → 題庫改用 `<script src>` 載入 `.js` 檔（`window.WEEK_DATA`）。任何新資料檔都要走這個模式，不要用 fetch。
2. **Windows Chrome 常沒有 en-IE 語音** → App 已做退回 en-GB 的防線。改 TTS 相關功能時保留這個 fallback。
3. **`webkitSpeechRecognition` 與 `MediaRecorder` 併用會搶麥克風**——Android 2026-07-03 實測「偶爾錄得到但部分缺失／顯示沒偵測到聲音」的根因之一 → 手機一律不啟動錄音（`isMobileDevice` 判斷），桌機保留辨識優先＋錯誤自動停用防線。
5. **Android 對非連續辨識的停頓極敏感**（句中停一下就截斷）＋**啟動延遲會吃掉開頭幾個字**＋ **confidence 常回傳 0** → `micFlow` 已改連續模式（continuous + interimResults、onstart 才提示開始說話、conf 0 當缺值）。改辨識流程時不要退回單次模式。
6. **連續模式下 Android 會反覆回報同一段的「遞增完整內容」**（"I"→"I have"→"I have a reservation"），若用 push 累積會串成 "I I have I have a reservation..." → `micFlow` 已改用 **result 絕對索引覆蓋**（`resultSlots[i]`）而非 push，同一段無論回報幾次只占一槽。deliver 優先取 final、沒 final 用 interim 兜底。不要改回 push。
4. 資料夾在 Google Drive 同步區 → 通用同步坑見 `~/.claude/PITFALLS.md`。

## 常用操作

```powershell
# 檢查題庫語法（node 不在 PATH 時見全域 CLAUDE.md）
& "C:\Program Files\nodejs\node.exe" --check "content\current-week.js"
```

- 每週產題：照 `prompts/generate-week.md` 全部步驟跑（讀 _used → 讀 _weak → 產 9-10 情境 → 封存舊檔 → 覆寫 current-week.js → 追加 _used.json → node --check）。
- 深度批改：照 `prompts/deep-review.md`，逐字稿通常在 `C:\Users\jenni\Downloads\`。

## 目前狀態（2026-07-03 快照）

- 使用者已決策：完整鷹架（字幕+句型卡+提示鈕+慢速重播，WPM 目標 80–120）；加跟讀、streak、錄音回放、自動難度；腔調預設 en-GB、2026-08-01 起自動轉 en-IE（手動設定優先）；週日複習=重練本週最低分原情境。
- 第一週題庫 `2026-W27` 已建（9 情境，difficulty 1–2，我=Fable 5 親自寫的，A2-B1 分級）。
- `index.html` 完工並驗收通過（sonnet 實作、Fable 5 逐項驗收：實際瀏覽器跑過首頁/暖身/設定/週日複習/缺檔錯誤頁，console 乾淨；無麥克風環境按鈕不拋例外）。麥克風鈕支援「按住說話」與「點一下切換」雙模式（350ms 閾值，Fable 5 修正）。
- 已知未驗項（需真人實機）：TTS 實際發聲、真麥克風辨識、錄音回放、辨識+錄音併用防線。設定頁有「🔊 測試教練聲音」按鈕輔助 debug。
- 2026-07-03 晚：已 PWA 化並部署 GitHub Pages（見系統拓撲）。使用者回報 file:// 模式收不到聲音 → 根因是瀏覽器封鎖，已用線上版解決＋加警告 banner。
- `.claude/launch.json` 是測試用 dev server 設定（`py -m http.server 8123`），日常使用不需要它。

## Backlog（提過或預留的方向）

- [ ] 8 月起產題時加入愛爾蘭用語/腔調聽力元素（generate-week.md 已寫入此方向）
- [ ] 難度 3 的題目要更貼近真實學術 Q&A（愈接近 9 月愈重要）

## 測試 / 驗證（改 index.html 後必跑）

1. 抽出 `<script>` 內容跑 `node --check`（見常用操作）。
2. 本機 preview（`.claude/launch.json` 的 `py -m http.server 8123`）：`?day=1`（週一=醫學）與 `?day=0`（週日=複習）主題正確。
3. 開 DevTools Console：從首頁點到成績單一輪，無紅字錯誤（無麥克風環境按鈕也不能拋例外）。
4. **push 後開正式網址確認生效**（SW 快取關係，可能要強制重新整理）。
5. 產新題庫後：`node --check` 過、push、線上版載入新週次。
