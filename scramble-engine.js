// ============================================================================
// 打亂引擎調度層 (Scramble Engine) — 方案 C
// 對外唯一入口：ScrambleEngine.generate(eventId) -> Promise<string>
// 內部決定用 cubing.js(random-state) 或本地 ScrambleGenerator(fallback)。
//
// 決策流程：
//   ivy?                → 本地 (cubing.js 不支援楓葉)
//   本事件曾失敗/逾時?    → 本地 (本工作階段不再重試)
//   cubing.js 未載入?    → 本地
//   否則                 → cubing.js，8 秒逾時則本地並標記不再重試
// ============================================================================
class ScrambleEngine {
    // 本站 event ID → cubing.js event ID 對照。未列出者視為相同。
    //   mega → minx。fto 直接以 'fto' 嘗試；若當前 cubing.js 版本不支援，
    //   randomScrambleForEvent 會拋錯 → 自動降級本地並標記(見 catch)。
    static EVENT_MAP = { mega: 'minx' };

    // 永遠走本地生成器的項目(cubing.js 無對應)
    static ALWAYS_LOCAL = new Set(['ivy']);

    static TIMEOUT_MS = 8000;

    // 本工作階段中，cubing.js 失敗/逾時過的事件(記憶體 flag，不存 localStorage)
    static _disabled = new Set();

    // 最近一次生成來源，供 timer.js 設定 data-source 除錯屬性
    static lastSource = 'local';

    static _mapId(eventId) {
        return this.EVENT_MAP[eventId] || eventId;
    }

    static async generate(eventId) {
        const useLocal =
            this.ALWAYS_LOCAL.has(eventId) ||
            this._disabled.has(eventId) ||
            typeof window === 'undefined' ||
            !window.cubingScramble;

        if (useLocal) {
            this.lastSource = 'local';
            return ScrambleGenerator.generate(eventId);
        }

        try {
            const mapped = this._mapId(eventId);
            const alg = await this._withTimeout(window.cubingScramble(mapped), this.TIMEOUT_MS);
            this.lastSource = 'cubing';
            return alg.toString();
        } catch (e) {
            console.warn(`cubing.js 生成 "${eventId}" 失敗/逾時，改用本地生成器`, e);
            this._disabled.add(eventId); // 本工作階段內對該事件不再重試 cubing.js
            this.lastSource = 'local';
            return ScrambleGenerator.generate(eventId);
        }
    }

    static _withTimeout(promise, ms) {
        let timer;
        const timeout = new Promise((_, reject) => {
            timer = setTimeout(() => reject(new Error('cubing.js timeout')), ms);
        });
        return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
    }
}

if (typeof window !== 'undefined') {
    window.ScrambleEngine = ScrambleEngine;
}
