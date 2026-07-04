# index.html 建置規格（施工圖）

> 本檔是 `index.html` 的完整實作規格。原始需求見 `daily-speaking-coach-spec.md`，
> 但**以本檔為準**（已依使用者 A2-B1 程度與四項決策調整）。
> 使用者決策（2026-07-03）：完整鷹架／加跟讀+streak+錄音回放+自動難度／先英美腔八月轉愛爾蘭腔／週日重練原情境。

## 0. 硬性限制（違反即打回）

- **單一檔案** `index.html`，HTML+CSS+JS 全包。零外部依賴：不准用 CDN、不准用任何框架/函式庫。
- **必須能從 `file://` 直接雙擊開啟**。因此**禁止 `fetch()` 本地 JSON**；情境庫用 `<script src="content/current-week.js"></script>` 載入（該檔定義 `window.WEEK_DATA`）。
- 介面文字一律**繁體中文（台灣用語）**；情境內容本身是英文。
- 目標瀏覽器：Windows 10 上的 Chrome / Edge。語音辨識用 `webkitSpeechRecognition`（`lang` 跟隨腔調設定），朗讀用 `speechSynthesis`。
- 所有狀態存 `localStorage`（key 前綴 `sc_`），無後端。
- 若 `window.WEEK_DATA` 不存在，顯示友善錯誤頁（「找不到本週內容，請先執行每週內容產生」），不能白屏。

## 1. 資料 Schema（content/current-week.js 提供，App 只讀）

```js
window.WEEK_DATA = {
  week: "2026-W27",
  scenarios: [{
    id: "med-2026w27-01",
    theme: "medical",            // medical | smalltalk | travel
    title: "Presenting a patient at morning rounds",
    titleZh: "晨會報告病人",
    difficulty: 1,               // 1–3
    grammarFocus: ["past-simple"],
    phraseCards: [               // 每情境 3 張，開場先教
      { en: "The patient presented with chest pain.", zh: "病人以胸痛來就診。" }
    ],
    turns: [{
      coach: "Good morning. Can you tell me about your patient?",
      coachZh: "早安，可以跟我說說你的病人嗎？",   // 字幕輔助（中文小字）
      expected: {
        modelAnswer: "This is a 60-year-old man. He came in with chest pain last night.",
        starter: "This is a ...",              // 提示第 1 層
        mustInclude: ["chest pain"],           // 模糊比對句型
        keywords: ["patient", "last night"],   // 加分字彙
        grammar: "past-simple"                 // 淺文法檢查標籤
      }
    }]
  }]
};
```

`grammar` 標籤固定集合（App 只需實作這 6 種偵測器，規則可以淺）：
`past-simple`（常見不規則過去式清單 + `\w+ed\b`）、`present-perfect`（have/has + p.p.）、
`present-simple`、`future-will`（will/going to）、`modal-would`（would/could/should）、
`comparative`（more + adj / `\w+er than`）。

## 2. 畫面流程（單頁 App，用畫面切換）

### 2.1 首頁（儀表板）
- 大字顯示：今天日期、**今日主題**（一 醫學／二 閒聊／三 旅行／四 醫學／五 閒聊／六 旅行／日 複習日）、「開始今天的練習」大按鈕。
- **Streak**：連續練習天數（有完成 session 的連續日曆天）＋本週完成度（7 格點亮）。
- 近 7 天平均分趨勢（用 CSS/inline SVG 畫簡單長條或折線即可）。
- 各主題平均分、最常出現弱點標籤 Top 5。
- 右上角：⚙ 設定、📤 匯出弱點、📄 匯出逐字稿（匯出最近一次 session）。

### 2.2 練習流程（當日 session）
1. **選情境**：從 `WEEK_DATA.scenarios` 取今日主題、且 `difficulty` 最接近「目前難度」者；優先取本週還沒練過的。週日改為：取本週分數最低的那個情境重練（原封不動）。
2. **句型卡暖身（跟讀模式)**：逐張顯示 3 張 phraseCards（英文大字＋中文小字）。每張：🔊 播放（TTS）→ 使用者按麥克風跟讀 → 辨識文字與卡片英文做相似度比對（詞重疊率 ≥ 60% 算通過，顯示 ✅/再試一次，最多重試 2 次後可跳過）。
3. **對話回合**（每情境 3 回合）：
   - 教練 TTS 唸 `coach`；螢幕顯示英文字幕＋中文小字（字幕可在設定關閉，關閉時仍可按「顯示字幕」臨時看）。
   - 控制鈕：🔁 重播、🐢 慢速重播（rate×0.7）。
   - 使用者**按住麥克風鈕說話**（放開結束；快速點一下＝切換模式，再點一下結束，350ms 閾值）。錄音同時進行（見 §4，僅桌機）。
   - 辨識用**連續模式**（`continuous + interimResults`）：句中停頓不截斷、累積所有片段、即時顯示逐字稿；辨識器就緒時提示「請開始說話」（避免啟動延遲吃掉開頭）。
   - 想不出來 →「💡 提示」鈕：第 1 次按顯示 `starter`，第 2 次按顯示完整 `modelAnswer`（用了第 2 層提示該回合句型覆蓋分打 5 折，計分時標注）。
   - 辨識結果即時顯示逐字稿 → 依 §3 評分 → 顯示該回合回饋卡（五維＋具體訊息）→「下一回合」。
   - 每回合可「再說一次」重試（取較高分）。
4. **成績單**：五維雷達或條列分數、本次弱點標籤、每回合「你說的 vs 範例答案」對照、🔊 回放你的錄音。按「完成」寫入歷史。

### 2.3 設定頁
- 腔調：`en-US` / `en-GB` / `en-IE`（挑該 lang 最匹配的可用 voice；找不到 en-IE voice 時退 en-GB 並顯示提示）。**預設值**：2026-08-01 前 `en-GB`，之後 `en-IE`；使用者手動改過就永遠尊重手動值。
- TTS 語速（0.7–1.1，預設 0.9）、字幕預設開/關（預設開）、WPM 目標區間（預設 80–120）、錄音回放開/關（預設開）。

## 3. 本地評分（每回合，滿分 100 = 5 維各 20）

| 維度 | 規則 |
|---|---|
| 句型覆蓋 | `mustInclude` 命中比例。比對前雙方都：轉小寫、去標點、壓空白；用正規化後子字串比對。 |
| 關鍵字彙 | `keywords` 命中數比例（同上正規化）。 |
| 發音信心 | 辨識 `confidence`：≥0.85 滿分，線性遞減，<0.5 得 0。Android 常回傳 0/缺值 → 只平均有值的片段，全缺用中性值 0.75。 |
| 語速 | 詞數 ÷ 說話秒數 ×60 = WPM。落在目標區間滿分，區間外每差 10 WPM 扣 25%。說話秒數用麥克風按下到辨識 final 的時間。 |
| 贅詞 | 數 um/uh/er/like/you know/so 開頭連用；0 個滿分，每個扣 5 分（該維最低 0）。 |

- 淺文法檢查（§1 的 6 種偵測器）：沒偵測到目標文法 → 不扣分，但回饋卡提醒「這回合目標是過去式，試試 came / presented」並打標籤 `grammar:<tag>`。
- 弱點標籤規則：任一維 <12 分打對應標籤（`phrase:low`、`vocab:low`、`pronunciation:low`、`pace:low`、`filler:high`），加上未命中的 grammar 標籤與 `theme:<主題>`。

## 4. 錄音回放

- **僅限桌機**：行動裝置（Android/iOS UA）一律不啟動 MediaRecorder——2026-07-03 Android 實測與語音辨識搶麥克風，造成辨識部分缺失或整段收不到。設定頁在手機上顯示說明並鎖定開關。
- 桌機上麥克風按下時同時啟動 `MediaRecorder`（`getUserMedia audio`）與 `webkitSpeechRecognition`。
- **相容性防線**：若兩者並用導致 recognition 觸發 `error`（部分機器會搶麥克風），自動停用錄音功能、顯示一次性提示「此裝置不支援同時錄音，已自動關閉錄音回放」，且該設定記住。辨識永遠優先於錄音。
- 錄音 blob 只存在當次 session 記憶體（成績單頁回放用），**不寫進 localStorage**（會爆容量）。

## 5. 歷史與自動難度

- 每次完成 session 寫入 `sc_history`（array）：`{date, weekId, scenarioId, theme, scores:{5維+total}, weakTags[], transcript:[{turn, said, model, usedHint}], difficulty}`。
- localStorage 防爆：`sc_history` 只留最近 120 筆。
- **自動難度** `sc_level`（1–3，初始 1）：最近 2 次 session 總分皆 ≥80 → +1；皆 <50 → −1。升降時在成績單顯示「難度提升／調降」訊息。
- **匯出弱點**：下載 `_weak.json` — `{exportedAt, level, topWeakTags:[{tag,count}], recentAvg, byTheme:{...}}`（近 14 天統計）。UI 註明「請把下載的檔案放進專案的 content/ 資料夾」。
- **匯出逐字稿**：下載最近一次 session 的完整 JSON（含五維分、每回合你說的/範例）。

## 6. UI 風格

- 手機優先（Google Drive 上她可能用手機開），最大寬 640px 置中，大按鈕、大字。
- 乾淨明亮風，一個主色（建議 teal/藍綠），圓角卡片。麥克風鈕要大（≥72px 圓鈕），按住時有明顯視覺回饋（放大＋脈動）。
- 分數用顏色：≥80 綠、50–79 黃、<50 紅。

## 7. 驗收條件（完工自檢清單）

1. 直接以 `file://` 開啟不白屏；缺 `content/current-week.js` 時顯示友善錯誤。
2. 假想今天是週一～週日各天，主題輪替與週日複習邏輯正確（可用 URL 參數 `?day=0..6` 覆寫今天星期幾，方便測試；`?date=YYYY-MM-DD` 覆寫日期）。
3. 無語音權限/不支援的瀏覽器：顯示明確提示而非卡死；TTS 無 en-IE voice 時退 en-GB 有提示。
4. localStorage 空的第一次開啟不報錯；儀表板顯示空狀態文案。
5. 所有按鈕在無麥克風環境下點擊不會拋出未捕捉例外（console 乾淨）。
