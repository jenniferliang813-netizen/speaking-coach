# 每週內容產生提示（貼進 Claude Code 用）

> 用法：每週日或週一，在本專案資料夾開 Claude Code，直接說「照 prompts/generate-week.md 產生下一週內容」即可。

---

你是英文口說教材編寫者。請為「每日英文口說練習 App」產生下一週的情境庫。

## 使用者背景（不變的前提）

- 台灣麻醉科醫師，英文程度 **A2–B1**（會隨週數慢慢進步）。
- **2026 年 9 月底要去愛爾蘭做學術報告**：練習目標 = 醫學報告口說 + 研討會 small talk + 旅行英文。
- 愈接近 9 月，內容要愈貼近真實場景：學術報告 Q&A、愛爾蘭用語、都柏林地名。

## 執行步驟

1. **讀 `content/_used.json`**：新情境的標題與場景**絕不重複**清單裡出現過的。
2. **讀 `content/_weak.json`**（若存在）：
   - `topWeakTags` 裡的 `grammar:*` 標籤 → 新情境的 `grammarFocus` 至少一半要覆蓋這些文法點。
   - 最弱的 `theme:*` → 該主題多產 1 個情境。
   - 若檔案不存在（使用者還沒匯出），就平均分配。
3. **產生 9–10 個情境**：medical / smalltalk / travel 各至少 3 個，schema 完全照 `BUILD_SPEC.md` 第 1 節（含 `titleZh`、`coachZh`、`phraseCards`、`expected.starter`）。
4. **難度規則**：
   - 看 `_weak.json` 的 `recentAvg`：≥75 → difficulty 主力 2、放 1–2 個 3；<60 → 主力 1；其間 → 主力 1–2 混合。
   - 每句 modelAnswer 控制在該難度：difficulty 1 = 每句 ≤ 12 個字、常用字彙；2 = 兩句話、可用子句；3 = 接近真實報告語速與用詞。
   - `grammar` 標籤只能用固定集合：past-simple / present-perfect / present-simple / future-will / modal-would / comparative。
5. **寫檔**：
   - 先把現有 `content/current-week.js` 另存為 `content/archive-<週次>.js`（保留歷史）。
   - 新內容覆寫 `content/current-week.js`（格式：`window.WEEK_DATA = {...};`，week 欄位填新週次）。
   - 把新情境的 id/title **追加**進 `content/_used.json`。
6. **驗證**：用 `node --check`（或等效方式）確認 current-week.js 語法正確；列出每個情境的 id / theme / difficulty / grammarFocus 給使用者過目。
7. **推上 GitHub**（手機吃的是線上版，不 push 手機看不到新題目）：
   ```
   git add content/ && git commit -m "content: week <週次>" && git pull --rebase && git push
   ```
   push 完提醒使用者：手機把 App 完全關掉重開（或重新整理）就會載入新題庫。

## 品質紅線

- modelAnswer 必須是自然口語，不是書面語；A2-B1 讀得出來、記得住。
- `mustInclude` 必須真的出現在 modelAnswer 裡（App 靠它評分）。
- `phraseCards` 的句子要在該情境的對話中真的用得上。
- 醫學內容要臨床正確；不確定的藥名、劑量、處置**寧可不寫**。
