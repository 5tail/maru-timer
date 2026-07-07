# 更新紀錄 CHANGELOG

依 `SPEC_20260706.md`（規格 v1.0）進行的全面改版。格式參考 Keep a Changelog。

---

## [1.0.0] — 2026-07-06

首次依規格書全面改版。以下對照規格 13 個項目。

### 新增 Added
- **方案 C 打亂引擎**（`scramble-engine.js`）：cubing.js（random-state）優先，斷網／CDN 失敗／逾時自動降級本地生成器；離線時 13 個項目全部仍可用。
- **FTO（Face-Turning Octahedron）** 與 **楓葉方塊（Ivy Cube）** 兩個新項目；ivy 永遠走本地（cubing.js 不支援）。
- **記錄保存**：以 localStorage 各項目各存最近 100 筆解答（`{ t, sc, ts }`），還原上次選用項目。
- **清除本項目記錄**按鈕（附 confirm 二次確認）。
- 打亂區塊 `data-source` 屬性（`cubing` / `local`）供除錯。
- cubing.js 就緒後（idle 狀態）自動把當前本地打亂換成 random-state 版本。

### 變更 Changed
- **品牌全面統一為「小丸號 / MaruCube」**，移除舊名 CubeArena 全部殘留。
- **七語言**（zh-TW / zh-CN / en / ja / ko / es / vi）補齊 16 個新字串鍵；手機按鈕五種狀態文字全面翻譯化。
- 統計顯示邏輯：該項目 <5 筆顯示提示、≥5 筆顯示 AO5／MO5。
- `sq1` 改為形狀模擬（cut-point 模型），只產生可切且非 (0,0) 的打亂。
- 打亂生成改為非同步流程，加入請求競態防護與生成中按鈕停用狀態。
- 頁尾改為兩行可翻譯文字＋靜態版權「© 2026 小丸號 MaruCube」，maru.tw 圖標永久保留、切語言不再被覆蓋。

### 修正 Fixed
- `parseMove()` 遇到 `3Uw` 等帶前綴數字的轉法回傳空字串的 bug。
- 打亂出現同軸連續重複（如 `R L R`、`Rw R Rw`）的 bug。
- pyraminx 出現相鄰同面、tips 相鄰同面問題。
- 切換語言會弄掉頁尾 maru.tw 圖標的問題（改為不覆蓋 footer innerHTML）。
- 語言偏好舊 key 遷移：`cubeTimerLanguage` → `maruTimer_language`。
- 移除正式碼所有 `console.log`；移除重複的 Space 鍵 preventDefault 監聽。

### 驗證 Verified
- `test-scrambles.js`：13 項各 200 筆，步數／同軸規則／pyram 無相鄰同面／sq1 每步可切／fto 無 ABA／clock 14 針皆 0–6，**0 失敗**。
- `test-dom.js`（jsdom 模擬離線）：13 項離線生成、七語言切換保留 maru.tw、手機按鈕翻譯、統計 <5／≥5、切項目各自記錄、localStorage 持久化與 ISO 時戳、清除記錄、舊 key 遷移，**全數通過**。
- 靜態檢查：`CubeArena` = 0、正式碼 `console.log` = 0、四支 JS 語法檢查通過。

---

<!--
下一版請照這個格式往上加，例如：
## [1.1.0] — YYYY-MM-DD
### Added
- ...
-->
