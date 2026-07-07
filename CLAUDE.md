# CLAUDE.md — 小丸號 MaruCube 獨立計時器

> 這份檔案是本專案的**持久記憶**。每次 `/clear` 或開新對話後，Claude Code 會先讀它。
> 更新任何架構、慣例、事件、儲存格式時，**請同步改這份檔**，否則後續維護會失準。

---

## 1. 這是什麼

小丸號官網用的**獨立速解方塊計時器**（單頁應用）。純 `HTML/CSS/JS`，**無打包工具、無框架、無 build 步驟**——直接用瀏覽器開 `index.html` 就能跑。部署方式即把這幾支靜態檔上傳。

**品牌鐵則**：全站一律「小丸號 / MaruCube」。禁止出現舊名 `CubeArena`。頁尾聯絡圖標永遠指向 `https://maru.tw`，任何語言切換都不得覆蓋掉它。

---

## 2. 檔案職責（改動前先認清邊界）

| 檔案 | 職責 | 不該做的事 |
|---|---|---|
| `index.html` | 版面結構、載入順序、頁尾 | 不寫商業邏輯 |
| `styles.css` | 全部樣式（含 `.history-header`、`.clear-records-btn`、`.footer-copyright`） | — |
| `scrambles.js` | **本地**打亂生成器 `ScrambleGenerator`（離線後盾） | 不碰 DOM、不碰 localStorage |
| `scramble-engine.js` | 調度層 `ScrambleEngine.generate()` — 決定用 cubing.js 還是本地 | 不碰 DOM |
| `translations.js` | 七語言字典＋`TranslationManager`＋`EVENT_ORDER` | 不寫計時邏輯 |
| `timer.js` | 計時狀態機、記錄儲存、統計、DOM 綁定（`CubeTimer`） | 打亂一律經 `ScrambleEngine`，不直接呼叫 `ScrambleGenerator` |

**載入順序（index.html 底部，順序不可亂）**：
`scrambles.js` → `scramble-engine.js` → `translations.js` → `timer.js`
（engine 依賴 `ScrambleGenerator`；timer 依賴前三者。）

`<head>` 內另有一段 `<script type="module">` 動態 import cubing.js；失敗時設 `window.cubingScramble = null`，成功時 `dispatchEvent('cubing-ready')`。

---

## 3. 打亂引擎（方案 C）決策流程

對外唯一入口：`ScrambleEngine.generate(eventId) → Promise<string>`。

```
ivy?                       → 本地（cubing.js 不支援楓葉方塊）
本事件本階段曾失敗/逾時?     → 本地（記憶體 flag，不再重試）
window.cubingScramble 未載? → 本地
否則                       → cubing.js（random-state），8 秒逾時則降級本地並標記
```

- `EVENT_MAP = { mega: 'minx' }`：本站 id → cubing.js id 對照，未列出者視為相同。
- `ALWAYS_LOCAL = { ivy }`。
- `_disabled`：本工作階段失敗過的事件（純記憶體，重整頁面即清空）。
- `lastSource`（`'cubing'` / `'local'`）：`timer.js` 讀它寫到打亂區塊的 `data-source` 屬性，方便除錯。
- **設計原則：離線／斷網／CDN 失敗時，13 個項目全部仍可用**（靠 `scrambles.js` 本地生成）。

---

## 4. 支援的 13 個項目

順序由 `translations.js` 的 `EVENT_ORDER` 定義，下拉選單與 `window.MARU_EVENT_ORDER` 都以它為準：

```
333, 222, 444, 555, 666, 777, pyram, skewb, mega, sq1, clock, fto, ivy
```

`fto` = FTO（Face-Turning Octahedron），`ivy` = 楓葉方塊（Ivy Cube）。兩者為本次新增。

### 本地生成器要點（scrambles.js）
- `parseMove()`：先剝開頭數字再取面字母（修正 `3Uw` 曾回傳空字串的 bug）。
- `randomMoveScramble()`：用「同軸連續 run」規則擋掉 `R L R`、`Rw R Rw` 這類同軸重複。
- 步數：333=20、222=9–11、444=40、555=60、666=80、777=100、pyram 主體 8–11＋tips、skewb=11、fto=30、ivy=9–11。
- `sq1`：12 格 boolean cut-point 形狀模擬，只產「可切且非 (0,0)」的打亂。
- `clock`：14 針各 0–6，WCA 單行格式。
- `fto`：不得同面連續、不得 A B A（對面來回）。

---

## 5. 記錄儲存（localStorage）

| key | 內容 |
|---|---|
| `maruTimer_solves` | 物件，以 eventId 為 key，各存**最近 100 筆**（顯示只取最近 5 筆）。每筆 `{ t: 毫秒, sc: 打亂字串, ts: ISO 時間 }`，newest-first |
| `maruTimer_event` | 上次選的項目，用於還原 |
| `maruTimer_language` | 目前語言 |

- 常數在 `timer.js`：`STORE_KEY`、`EVENT_KEY`、`MAX_STORED = 100`。
- **舊 key 遷移**：`translations.js` 讀語言時若發現舊 `cubeTimerLanguage`，會搬到 `maruTimer_language` 並刪掉舊的。
- 所有 localStorage 存取都包 try-catch（隱私模式靜默降級，不可讓它壞掉整頁）。
- 統計：該項目 **<5 筆顯示提示**，**≥5 筆顯示 AO5／MO5**。切換項目要各自重繪記錄。

---

## 6. 翻譯（translations.js）

- 七語言：`zh-TW`、`zh-CN`、`en`、`ja`、`ko`、`es`、`vi`。**新增字串必須七語言同步補齊，缺一不可。**
- 本次新增鍵（維護時勿漏）：`generatingScramble`、`mobileStart / mobileHoldInstruction / mobilePreparing / mobileKeepHolding / mobileReady / mobileRelease / mobileTapStop / mobileTiming / mobileTapReset / mobileRestart`、`clearRecords`、`clearConfirm`、`footerLine1`、`footerLine2`、`pageTitle`，以及事件名 `fto`、`ivy`。
- `TranslationManager` **不再覆蓋 footer 的 innerHTML**（避免弄掉 maru.tw 圖標）；標題走 `pageTitle` 鍵。
- 手機按鈕五種狀態文字**全走翻譯鍵**，不可寫死中文。

---

## 7. 新增一個項目的 SOP

1. `scrambles.js`：在 `generate()` 的 switch 加 `case`，實作 `generateXxx()`。
2. `translations.js`：`EVENT_ORDER` 加入新 id；七語言字典各補該 id 的顯示名稱。
3. `index.html`：`#eventSelect` 加靜態 `<option>`（順序對齊 `EVENT_ORDER`）。
4. `scramble-engine.js`：若 cubing.js 有對應 → 需要時加進 `EVENT_MAP`；若 cubing.js 不支援 → 加進 `ALWAYS_LOCAL`。
5. `test-scrambles.js` 補該項目的規則驗證，跑過再交付。

---

## 8. 測試指令

> 測試檔（`test-scrambles.js`、`test-dom.js`）與 `node_modules/` **不進版控**，見 `.gitignore`。

```bash
node test-scrambles.js   # 13 項各 200 筆，驗步數/同軸/pyram/sq1/fto/clock 規則
npm install jsdom        # DOM 測試需要
node test-dom.js         # 模擬離線：13 項生成、七語言、記錄、統計、清除、舊 key 遷移
```

交付前必過的靜態檢查：
```bash
grep -rn "CubeArena" . --include=*.js --include=*.html --include=*.css --include=*.md   # 應為 0
grep -rn "console.log" scrambles.js scramble-engine.js translations.js timer.js index.html  # 應為 0
for f in scrambles.js scramble-engine.js translations.js timer.js; do node --check $f; done  # 語法
```

**慣例**：正式碼不留 `console.log`（`console.warn/error` 可留）。

---

## 9. 開發流程（五尾的習慣）

- 用 **Claude Code on the Web**，雲端沙箱從 GitHub clone，換電腦時重開同一瀏覽器 session 續作。
- **GitHub 是唯一真實來源**。建議每完成一個功能 **commit 一次**，訊息用 `feat:` / `fix:` 前綴。
- 完成一項功能就 `/clear`，靠這份 `CLAUDE.md` 保住記憶、避免 token 被長對話吃掉。
- 回覆一律**繁體中文**、直接簡潔；稱呼「五尾」。
