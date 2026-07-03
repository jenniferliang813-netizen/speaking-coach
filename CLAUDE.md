# 英文口說教練（給下一個 session 的 Claude）

每日 5 分鐘英文口說練習 App。使用者是梁婷瑋醫師（麻醉科，英文 A2–B1），**2026-09 底要去愛爾蘭做學術報告**——練醫學報告口說＋研討會 small talk＋旅行英文。平日零 API 純本地跑；每週用 Claude Code 產新題庫、按需深度批改。

## 系統拓撲

純前端、無後端、無部署：`index.html`（單一檔案）＋ `content/current-week.js`（題庫）→ 直接以 `file://` 雙擊開啟於 Chrome/Edge。練習紀錄在 localStorage（key 前綴 `sc_`）。改 `index.html` 存檔即生效，重新整理頁面就好，**沒有任何部署步驟**。

## 檔案地圖

| 檔案 | 職責 |
|---|---|
| `BUILD_SPEC.md` | **真相來源**：App 完整規格（Schema、評分規則、驗收條件）。改功能前先讀它、改完同步更新它 |
| `daily-speaking-coach-spec.md` | 最初需求藍圖（歷史文件，已被 BUILD_SPEC 取代，難度已依 A2-B1 下修） |
| `index.html` | App 本體（HTML+CSS+JS 全包，禁外部依賴） |
| `content/current-week.js` | 本週題庫，`window.WEEK_DATA`。每週由 generate-week 流程覆寫（舊的先存成 `archive-<週次>.js`） |
| `content/_used.json` | 出過的題目 id/title，防重複。產新週後要追加 |
| `content/_weak.json` | 使用者從 App 匯出的弱點統計（可能不存在） |
| `prompts/generate-week.md` | 每週產題 SOP（含難度規則、品質紅線） |
| `prompts/deep-review.md` | 深度批改 SOP |

## 已踩過的坑（別再踩）

1. **`file://` 下 `fetch()` 本地 JSON 會被瀏覽器擋** → 題庫改用 `<script src>` 載入 `.js` 檔（`window.WEEK_DATA`）。任何新資料檔都要走這個模式，不要用 fetch。
2. **Windows Chrome 常沒有 en-IE 語音** → App 已做退回 en-GB 的防線。改 TTS 相關功能時保留這個 fallback。
3. **`webkitSpeechRecognition` 與 `MediaRecorder` 併用可能搶麥克風** → 規格要求辨識優先、錄音失敗自動停用。動麥克風流程時別破壞這個防線。
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
- 已知未驗項（需真人實機）：TTS 實際發聲、真麥克風辨識、錄音回放、辨識+錄音併用防線。使用者第一次實測時留意。
- `.claude/launch.json` 是測試用 dev server 設定（`py -m http.server 8123`），日常使用不需要它。

## Backlog（提過或預留的方向）

- [ ] 8 月起產題時加入愛爾蘭用語/腔調聽力元素（generate-week.md 已寫入此方向）
- [ ] 難度 3 的題目要更貼近真實學術 Q&A（愈接近 9 月愈重要）

## 測試 / 驗證（改 index.html 後必跑）

1. `file://` 直開不白屏；把 `content/current-week.js` 暫時改名，確認顯示友善錯誤頁後改回來。
2. `?day=1`（週一=醫學）與 `?day=0`（週日=複習）主題正確。
3. 開 DevTools Console：從首頁點到成績單一輪，無紅字錯誤（無麥克風環境按鈕也不能拋例外）。
4. 產新題庫後：`node --check` 過、且 App 重新整理後能載入新週次。
