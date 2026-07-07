# 小丸號魔術方塊計時器 / MaruCube Standalone Timer

完全獨立的魔術方塊計時練習網頁，純前端（HTML/CSS/JS），無需建置工具或後端，直接上傳檔案即可部署。

## 功能特色 / Features

- ✅ WCA 標準計時流程（按住空白鍵 0.5 秒變綠後放開開始計時；手機/平板為觸控長按）
- ✅ **random-state 打亂**：優先使用 cubing.js（官方等級亂序），離線或載入失敗時**自動降級**為本地生成器，功能不中斷
- ✅ 支援 **13 種項目**：WCA 官方 11 項 + FTO（轉面八面體）+ 楓葉方塊（Ivy Cube）
- ✅ AO5（五次平均）與 MO5（五次均值）自動計算
- ✅ **解題記錄本地保存**：以項目分開儲存於 localStorage，重新整理後仍保留；切換項目顯示各自記錄
- ✅ 7 種語言（繁中、簡中、英、日、韓、西、越），介面全面翻譯
- ✅ 響應式設計，桌面 / 手機 / 平板皆適配

## 支援的項目 / Supported Events

| # | 項目 | Event |
|---|------|-------|
| 1 | 3x3x3 魔術方塊 | 3x3x3 |
| 2 | 2x2x2 魔術方塊 | 2x2x2 |
| 3 | 4x4x4 魔術方塊 | 4x4x4 |
| 4 | 5x5x5 魔術方塊 | 5x5x5 |
| 5 | 6x6x6 魔術方塊 | 6x6x6 |
| 6 | 7x7x7 魔術方塊 | 7x7x7 |
| 7 | 金字塔 | Pyraminx |
| 8 | 斜轉 | Skewb |
| 9 | 十二面體 | Megaminx |
| 10 | SQ1 | Square-1 |
| 11 | 魔錶 | Clock |
| 12 | 轉面八面體 | FTO |
| 13 | 楓葉方塊 | Ivy Cube |

> Ivy（楓葉方塊）由本地生成器提供；其餘項目在連網時走 cubing.js，離線時走本地生成器。

## 打亂引擎 / Scramble Engine

採方案 C 雙層架構：

- `scramble-engine.js`：對外唯一入口 `ScrambleEngine.generate(eventId)`，回傳 Promise。
- 連網時優先呼叫 cubing.js（`cdn.cubing.net/v0`）產生 random-state 打亂；首次呼叫需下載 WASM，較大方塊可能數秒，期間「新SC」按鈕停用並顯示「打亂生成中…」。
- 設 8 秒逾時；逾時或失敗即改用本地 `scrambles.js`，且該工作階段內對該項目不再重試 cubing.js。
- 完全離線（`file://` 或無網路）時全程使用本地生成器，頁面功能不受影響。

## 安裝步驟 / Installation

### 方法一：直接上傳到 WordPress
1. 將所有檔案上傳到網站目錄。
2. 後台新增頁面，插入「自訂 HTML」區塊：
```html
<iframe src="/timer/index.html" width="100%" height="800px" frameborder="0"></iframe>
```

### 方法二：作為獨立網頁
上傳所有檔案至伺服器，直接訪問 `index.html`。

### 方法三：本地使用
解壓縮後直接以瀏覽器開啟 `index.html`（離線亦可用，打亂自動走本地生成器）。

## 檔案結構 / File Structure

```
standalone-timer/
├── index.html          # 主頁面
├── styles.css          # 樣式
├── timer.js            # 計時器邏輯 + localStorage 資料層
├── scrambles.js        # 本地 fallback 打亂生成器
├── scramble-engine.js  # 引擎調度層（cubing.js 優先 + fallback）
├── translations.js     # 七語言翻譯
└── README.md           # 說明文件
```

## 使用說明 / How to Use

1. **選擇項目**：頁面頂部下拉選單。
2. **生成打亂**：點「新SC」。
3. **計時（電腦）**：按住空白鍵 → 0.5 秒變綠 → 放開開始 → 再按空白鍵停止。
4. **計時（手機/平板）**：長按下方按鈕 → 變綠放開開始 → 點一下停止。
5. **統計**：同一項目完成 5 次後顯示 AO5 / MO5；1~4 次顯示提示。
6. **記錄**：自動保存於瀏覽器，可用「清除本項目記錄」重置該項目。
7. **語言**：右上角切換，記錄與偏好保存於本機。

## 技術特點 / Technical

- 純 HTML/CSS/JavaScript，無框架、無 bundler。
- localStorage 保存語言、上次項目、各項目最近 100 筆記錄（`maruTimer_` 前綴）。
- 高精度計時（10 毫秒）。
- 瀏覽器支援：Chrome 60+ / Firefox 55+ / Safari 12+ / Edge 79+。

## 自訂 / Customization

- `styles.css`：外觀與主題色。
- `translations.js`：新增或修改語言。
- `scrambles.js`：調整本地打亂生成規則。

## 新增項目 SOP

1. `scrambles.js` 加生成函式與 `generate()` 分支。
2. `scramble-engine.js` 確認 cubing.js 是否支援（不支援則加入本地白名單 `ALWAYS_LOCAL`）。
3. `translations.js` 於七語言 `events` 加名稱、`EVENT_ORDER` 加入順序。
4. 完成（下拉選單由翻譯系統動態生成，無需改 HTML）。

## 版權 / Copyright

© 2026 小丸號 MaruCube — https://maru.tw

供個人練習與學習使用。
