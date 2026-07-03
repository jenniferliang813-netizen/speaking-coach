# 每日英文口說練習 App — 設計藍圖 (給 Claude Code 執行用)

> 目標使用者:九月底赴愛爾蘭做學術報告,需同時練「醫學報告口說 + 日常 small talk + 旅行英文」。
> 每天 < 5 分鐘,開口說(麥克風),即時本地回饋;平日零 API,深度批改時才用 Claude Code。

---

## 1. 核心架構(混合式)

分成三塊,平日跑的那塊完全不呼叫任何 LLM:

| 區塊 | 何時跑 | 花不花 API | 做什麼 |
|---|---|---|---|
| **A. 每日練習 App** (`index.html`) | 每天早上,開瀏覽器 | 完全免費 | 用瀏覽器內建 Web Speech API 開口說 + 即時本地評分 |
| **B. 每週內容產生** (Claude Code) | 每週一次 | 用你的 Claude 訂閱 | 產生一批全新、不重複的情境 JSON,並針對你的弱點加重 |
| **C. 深度批改** (Claude Code, 按需) | 想要精修某次對話時 | 用你的 Claude 訂閱 | 貼上 App 匯出的逐字稿,拿到逐句文法修正與改寫 |

平日只碰 A。B 和 C 都在 Claude Code 裡,用的是你已付費的訂閱,不是另外計費的 API。

---

## 2. 檔案結構

```
speaking-coach/
├─ index.html            # 單一檔案的每日練習 App(HTML+CSS+JS 全包)
├─ content/
│  ├─ week-2026-27.json   # 本週情境庫(每週由 Claude Code 產生)
│  ├─ _used.json          # 已出過的情境 id/title 清單(防重複)
│  └─ _weak.json          # App 匯出的弱點標籤(給下週產生時參考)
├─ prompts/
│  ├─ generate-week.md    # 「產生一週內容」的提示模板(貼進 Claude Code)
│  └─ deep-review.md      # 「深度批改逐字稿」的提示模板
└─ README.md
```

App 用 `localStorage` 存歷史,不需要後端、不需要伺服器,直接雙擊 `index.html` 開。

> 瀏覽器建議 **Chrome 或 Edge**:語音辨識用 `webkitSpeechRecognition`,朗讀用 `speechSynthesis`。Firefox / Safari 辨識支援較弱。

---

## 3. 每日流程 (< 5 分鐘)

1. 開 `index.html` → 顯示「今天主題」。
2. **主題輪替**(每天一個):
   - 週一 醫學報告 / 週二 small talk / 週三 旅行 / 週四 醫學 / 週五 small talk / 週六 旅行 / **週日 = 複習日**(重練本週最弱的項目)。
3. 當天抽 1 個情境,含 3–5 回合對話。
4. 每回合:教練語音說一句(TTS)→ 你按住麥克風開口回答 → 語音辨識轉文字 → App 即時評分 + 回饋 → 下一句。
5. 結束顯示小成績單,並把弱點寫進歷史。

---

## 4. 情境 JSON 資料格式 (Schema)

```json
{
  "id": "med-2026w27-01",
  "theme": "medical",
  "title": "Presenting a case at morning rounds",
  "difficulty": 2,
  "grammarFocus": ["past-simple", "passive-voice"],
  "turns": [
    {
      "coach": "Morning. Can you walk me through your patient?",
      "ttsHint": { "rate": 0.95, "accent": "en-IE" },
      "expected": {
        "modelAnswer": "This is a 54-year-old man who presented with chest pain...",
        "mustInclude": ["presented with", "history of"],
        "keywords": ["onset", "differential", "management"],
        "grammar": "past-simple"
      }
    }
  ]
}
```

- `theme`: `medical` | `smalltalk` | `travel`
- `mustInclude`: 一定要講到的關鍵句型(模糊比對)
- `keywords`: 該領域字彙(講到加分)
- `grammar`: 該回合鎖定的文法點(給規則檢查用)
- `ttsHint.accent`: 建議用愛爾蘭腔 `en-IE`(貼近你九月的情境)

---

## 5. 本地評分邏輯(無 LLM,純規則)

每回合針對辨識出的逐字稿算五個維度,即時顯示:

| 維度 | 怎麼算 | 回饋範例 |
|---|---|---|
| **句型覆蓋** | 逐字稿是否命中 `mustInclude`(模糊比對) | ✅ 用了 "presented with" |
| **關鍵字彙** | 命中 `keywords` 的數量 | 👍 用到 differential、onset |
| **發音信心** | 語音辨識回傳的 `confidence` 分數 | ⚠️ "differential" 信心偏低,再唸一次 |
| **語速** | 字數 / 秒數 (WPM),落在 110–160 為佳 | 🐢 稍慢,試著更流暢 |
| **贅詞** | 數 um / uh / like / you know | 🎯 這回合 0 贅詞 |

> 文法檢查是「淺規則」:例如該回合 `grammar: past-simple`,就檢查有沒有出現過去式動詞型態。抓得到「明顯沒用到目標句型」,但抓不到細緻文法錯誤——那個交給第 7 節的深度批改。

每回合結束把觸發的弱點打上標籤(如 `grammar:past-simple`、`theme:medical`、`pronunciation:low`),累積存進歷史。

---

## 6. 歷史 & 複習功能

- `localStorage` 存每次 session:日期、主題、五維分數、弱點標籤、逐字稿。
- **首頁儀表板**:近 7 天趨勢、各主題平均、最常出現的弱點標籤 Top 5。
- **週日複習日**:自動把「本週最弱標籤」對應的情境重抽出來再練一次(可以是同情境或變體)。
- **弱點回饋到內容產生**:App 有「匯出弱點」按鈕 → 寫出 `content/_weak.json` → 下週在 Claude Code 產生新內容時讀它,讓新情境針對你的弱項加重。這就實現了你要的「下週用比較弱的文法或情境再次練習」。

---

## 7. 每週內容產生 (Claude Code, `prompts/generate-week.md`)

每週開 Claude Code 貼這個提示,產出下一週的 `week-XXXX.json`:

- 讀 `_used.json` → **絕不重複**已出過的情境。
- 讀 `_weak.json` → 對弱點主題/文法**加重比例**。
- 每主題產 N 個情境(建議每主題 3–4 個,夠一週輪替 + 週日複習)。
- 產完把新 id/title 追加進 `_used.json`。
- 難度隨週數微升(愈接近九月底愈貼近真實報告場景與愛爾蘭腔用語)。

---

## 8. 深度批改 (Claude Code, `prompts/deep-review.md`)

App 每次 session 有「匯出逐字稿」按鈕 → 下載 JSON。想精修時,開 Claude Code 貼上逐字稿 + 這個提示,拿到:

- 逐句文法修正(標出錯在哪、為什麼)
- 更道地 / 更專業的改寫版本
- 針對醫學報告場景的用詞升級建議
- 產生 3 句「同義但更自然」的替代說法讓你記

這是「本地規則抓不到細緻文法」的補強路徑。

---

## 9. 建議建置順序(給 Claude Code 的 checklist)

1. 先做 `index.html` 骨架:主題輪替 + 讀 `content/*.json` + 一個假情境跑通對話迴圈。
2. 接 Web Speech API:`speechSynthesis`(教練說話)+ `webkitSpeechRecognition`(你回答),確認麥克風權限流程。
3. 實作第 5 節五維評分 + 即時回饋 UI。
4. 實作 `localStorage` 歷史 + 首頁儀表板 + 週日複習邏輯。
5. 「匯出逐字稿」「匯出弱點」兩個按鈕。
6. 寫 `prompts/generate-week.md` 與 `prompts/deep-review.md`,並手動產第一週 `week-2026-27.json`(每主題 3 個情境)。
7. 端到端測一輪:早上開 → 說一段 → 看回饋 → 看歷史。

---

## 10. 待你決定的細節(可之後再調)

- 每個情境要幾回合?(建議 3–4 回合 ≈ 4 分鐘)
- 教練腔調固定用愛爾蘭腔 `en-IE`,還是想混美/英腔?
- 週日複習要「重練原情境」還是「同弱點的新變體」?
- 語速目標區間(預設 110–160 WPM)要不要調。
```

Would you like me to build a working prototype now, or is this spec enough to take to Claude Code?
