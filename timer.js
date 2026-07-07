// ============================================================================
// 小丸號獨立計時器 (MaruCube Standalone Timer)
// ============================================================================
const STORE_KEY = 'maruTimer_solves';
const EVENT_KEY = 'maruTimer_event';
const MAX_STORED = 100; // 每項目保存筆數(顯示仍取最近 5 筆)

class CubeTimer {
    constructor() {
        this.timerState = 'idle'; // idle, preparing, ready, timing, finished
        this.currentTime = 0;
        this.startTime = 0;
        this.currentScramble = '';
        this.spacePressed = false;
        this.mobilePressed = false;
        this.prepareTimeoutId = null;
        this.timerIntervalId = null;
        this._scrambleReqId = 0;

        this.translationManager = new TranslationManager();
        this.store = this._loadStore();
        this.selectedEvent = this._loadSelectedEvent();

        this.initializeElements();
        this.setupEventListeners();

        this.elements.eventSelect.value = this.selectedEvent;
        this.refreshRecords();       // 依目前項目繪製統計/歷史
        this.generateNewScramble();  // 產生第一個打亂

        // cubing.js 於載入前，首個打亂會先用本地生成；載入完成後若使用者尚未開始計時，換成 cubing 版本
        window.addEventListener('cubing-ready', () => {
            if (this.timerState === 'idle') this.generateNewScramble();
        }, { once: true });
    }

    // ------------------------------------------------------------------
    // localStorage 資料層 (§4)
    // ------------------------------------------------------------------
    _loadStore() {
        try {
            const raw = localStorage.getItem(STORE_KEY);
            return raw ? JSON.parse(raw) : {};
        } catch (e) {
            console.warn('讀取記錄失敗，改用記憶體暫存', e);
            return {};
        }
    }

    _saveStore() {
        try {
            localStorage.setItem(STORE_KEY, JSON.stringify(this.store));
        } catch (e) {
            console.warn('寫入記錄失敗(可能為隱私模式)，僅保留記憶體', e);
        }
    }

    _loadSelectedEvent() {
        try {
            return localStorage.getItem(EVENT_KEY) || '333';
        } catch (e) {
            return '333';
        }
    }

    _saveSelectedEvent() {
        try { localStorage.setItem(EVENT_KEY, this.selectedEvent); } catch (e) { /* 靜默降級 */ }
    }

    getSolves(eventId = this.selectedEvent) {
        return this.store[eventId] || [];
    }

    // ------------------------------------------------------------------
    initializeElements() {
        this.elements = {
            languageSelect: document.getElementById('languageSelect'),
            eventSelect: document.getElementById('eventSelect'),
            scrambleText: document.getElementById('scrambleText'),
            newScrambleBtn: document.getElementById('newScrambleBtn'),
            timerText: document.getElementById('timerText'),
            instructionText: document.getElementById('instructionText'),
            ao5Display: document.getElementById('ao5Display'),
            ao5Value: document.getElementById('ao5Value'),
            mo5Display: document.getElementById('mo5Display'),
            mo5Value: document.getElementById('mo5Value'),
            noStatsMessage: document.getElementById('noStatsMessage'),
            solveHistoryList: document.getElementById('solveHistoryList'),
            lastScrambleSection: document.getElementById('lastScrambleSection'),
            lastScrambleText: document.getElementById('lastScrambleText'),
            clearRecordsBtn: document.getElementById('clearRecordsBtn')
        };
        this.elements.languageSelect.value = this.translationManager.getCurrentLanguage();
    }

    setupEventListeners() {
        this.elements.languageSelect.addEventListener('change', (e) => {
            this.translationManager.loadLanguage(e.target.value);
            this.updateDisplay();
            this.refreshRecords(); // 重繪以套用翻譯後的空狀態文字
        });

        this.elements.eventSelect.addEventListener('change', (e) => {
            this.selectedEvent = e.target.value;
            this._saveSelectedEvent();
            this.refreshRecords();      // 顯示該項目自己的記錄
            this.generateNewScramble();
        });

        this.elements.newScrambleBtn.addEventListener('click', () => this.generateNewScramble());

        if (this.elements.clearRecordsBtn) {
            this.elements.clearRecordsBtn.addEventListener('click', () => this.clearCurrentRecords());
        }

        // 鍵盤(handleKeyDown 已對 Space preventDefault，不再重複註冊 listener)
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));

        // 手機/平板計時按鈕
        const mobileTimerBtn = document.getElementById('mobileTimerBtn');
        if (mobileTimerBtn) {
            mobileTimerBtn.addEventListener('mousedown', (e) => this.handleMobileStart(e));
            mobileTimerBtn.addEventListener('mouseup', (e) => this.handleMobileEnd(e));
            mobileTimerBtn.addEventListener('touchstart', (e) => this.handleMobileStart(e));
            mobileTimerBtn.addEventListener('touchend', (e) => this.handleMobileEnd(e));
            mobileTimerBtn.addEventListener('contextmenu', (e) => e.preventDefault());
        }
    }

    // ------------------------------------------------------------------
    // 鍵盤 / 觸控
    // ------------------------------------------------------------------
    handleKeyDown(event) {
        if (event.code !== 'Space') return;
        event.preventDefault();

        if (this.timerState === 'timing') { this.stopTimer(); return; }
        if (this.timerState === 'finished') { this.resetTimer(); return; }

        if (!this.spacePressed && (this.timerState === 'idle' || this.timerState === 'ready')) {
            this.spacePressed = true;
            this.startPreparePhase();
        }
    }

    handleKeyUp(event) {
        if (event.code !== 'Space') return;
        event.preventDefault();

        if (this.spacePressed && this.timerState === 'ready') this.startTimer();
        this.spacePressed = false;
        if (this.timerState === 'preparing') this.cancelPreparePhase();
    }

    handleMobileStart(event) {
        event.preventDefault();
        event.stopPropagation();

        if (this.timerState === 'timing') { this.stopTimer(); return; }
        if (this.timerState === 'finished') { this.resetTimer(); return; }

        if (!this.mobilePressed && (this.timerState === 'idle' || this.timerState === 'ready')) {
            this.mobilePressed = true;
            this.startPreparePhase();
        }
    }

    handleMobileEnd(event) {
        event.preventDefault();
        event.stopPropagation();

        if (this.mobilePressed && this.timerState === 'ready') this.startTimer();
        this.mobilePressed = false;
        if (this.timerState === 'preparing') this.cancelPreparePhase();
    }

    startPreparePhase() {
        this.timerState = 'preparing';
        this.updateDisplay();
        this.prepareTimeoutId = setTimeout(() => {
            if ((this.spacePressed || this.mobilePressed) && this.timerState === 'preparing') {
                this.timerState = 'ready';
                this.updateDisplay();
            }
        }, 500);
    }

    cancelPreparePhase() {
        if (this.prepareTimeoutId) { clearTimeout(this.prepareTimeoutId); this.prepareTimeoutId = null; }
        if (this.timerState === 'preparing') {
            this.timerState = 'idle';
            this.spacePressed = false;
            this.mobilePressed = false;
            this.updateDisplay();
        }
    }

    startTimer() {
        this.timerState = 'timing';
        this.startTime = Date.now();
        this.currentTime = 0;
        this.timerIntervalId = setInterval(() => {
            this.currentTime = Date.now() - this.startTime;
            this.updateDisplay();
        }, 10);
        this.updateDisplay();
    }

    stopTimer() {
        if (this.timerIntervalId) { clearInterval(this.timerIntervalId); this.timerIntervalId = null; }
        this.timerState = 'finished';

        // 寫入該項目記錄(newest-first)，保留最近 MAX_STORED 筆
        if (!this.store[this.selectedEvent]) this.store[this.selectedEvent] = [];
        this.store[this.selectedEvent].unshift({
            t: this.currentTime,
            sc: this.currentScramble,
            ts: new Date().toISOString()
        });
        if (this.store[this.selectedEvent].length > MAX_STORED) {
            this.store[this.selectedEvent].length = MAX_STORED;
        }
        this._saveStore();

        this.updateDisplay();
        this.refreshRecords();
    }

    resetTimer() {
        this.timerState = 'idle';
        this.currentTime = 0;
        this.generateNewScramble();
        this.updateDisplay();
    }

    // ------------------------------------------------------------------
    // 打亂生成(async，方案 C 引擎) — §2.3
    // ------------------------------------------------------------------
    async generateNewScramble() {
        const reqId = ++this._scrambleReqId;
        this.elements.newScrambleBtn.disabled = true;
        this.elements.scrambleText.textContent = this.translationManager.getText('generatingScramble');
        this.elements.scrambleText.removeAttribute('data-source');

        try {
            const scramble = await window.ScrambleEngine.generate(this.selectedEvent);
            if (reqId !== this._scrambleReqId) return; // 舊請求，丟棄
            this.currentScramble = scramble;
            this.elements.scrambleText.textContent = scramble;
            this.elements.scrambleText.setAttribute('data-source', window.ScrambleEngine.lastSource || 'local');
        } catch (error) {
            if (reqId !== this._scrambleReqId) return;
            console.error('打亂生成失敗，使用本地生成器', error);
            this.currentScramble = ScrambleGenerator.generate(this.selectedEvent);
            this.elements.scrambleText.textContent = this.currentScramble;
            this.elements.scrambleText.setAttribute('data-source', 'local');
        } finally {
            if (reqId === this._scrambleReqId) this.elements.newScrambleBtn.disabled = false;
        }
    }

    // ------------------------------------------------------------------
    // 顯示
    // ------------------------------------------------------------------
    updateDisplay() {
        const t = (k) => this.translationManager.getText(k);
        const timerText = this.getTimerDisplayText();
        const instructionText = this.getInstructionText();

        this.elements.timerText.textContent = timerText;
        this.elements.instructionText.textContent = instructionText;
        this.elements.timerText.className = `timer-text ${this.timerState}`;

        const mobileTimerText = document.getElementById('mobileTimerText');
        const mobileInstructionText = document.getElementById('mobileInstructionText');
        const mobileTimerBtn = document.getElementById('mobileTimerBtn');

        if (mobileTimerText) mobileTimerText.textContent = timerText;
        if (mobileInstructionText) mobileInstructionText.textContent = instructionText;

        if (mobileTimerBtn) {
            mobileTimerBtn.className = 'mobile-timer-btn';
            const btnText = mobileTimerBtn.querySelector('.mobile-timer-text');
            const btnInstr = mobileTimerBtn.querySelector('.mobile-timer-instruction');
            let textKey, instrKey;

            switch (this.timerState) {
                case 'preparing':
                    mobileTimerBtn.classList.add('preparing');
                    textKey = 'mobilePreparing'; instrKey = 'mobileKeepHolding'; break;
                case 'ready':
                    mobileTimerBtn.classList.add('ready');
                    textKey = 'mobileReady'; instrKey = 'mobileRelease'; break;
                case 'timing':
                    textKey = 'mobileTapStop'; instrKey = 'mobileTiming'; break;
                case 'finished':
                    textKey = 'mobileTapReset'; instrKey = 'mobileRestart'; break;
                default:
                    textKey = 'mobileStart'; instrKey = 'mobileHoldInstruction';
            }
            if (btnText) btnText.textContent = t(textKey);
            if (btnInstr) btnInstr.textContent = t(instrKey);
        }
    }

    getTimerDisplayText() {
        if (this.timerState === 'timing' || this.timerState === 'finished') {
            return this.formatTime(this.currentTime);
        }
        switch (this.timerState) {
            case 'preparing': return this.translationManager.getText('preparing');
            case 'ready': return this.translationManager.getText('ready');
            default: return this.translationManager.getText('pressSpace');
        }
    }

    getInstructionText() {
        switch (this.timerState) {
            case 'preparing': return this.translationManager.getText('holdSpaceToStart');
            case 'ready': return this.translationManager.getText('ready');
            case 'timing': return this.translationManager.getText('timing');
            case 'finished': return this.translationManager.getText('finished');
            default: return this.translationManager.getText('holdSpaceToStart');
        }
    }

    formatTime(milliseconds) {
        if (milliseconds < 0) return '0.00';
        const totalSeconds = milliseconds / 1000;
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = (totalSeconds % 60).toFixed(2);
        return minutes > 0 ? `${minutes}:${seconds.padStart(5, '0')}` : seconds;
    }

    // ------------------------------------------------------------------
    // 統計 / 歷史 (依目前項目)
    // ------------------------------------------------------------------
    calculateStatistics() {
        const solves = this.getSolves();
        if (solves.length < 5) return { ao5: null, mo5: null };

        const times = solves.slice(0, 5).map(s => s.t);
        const sorted = [...times].sort((a, b) => a - b);
        const ao5 = sorted.slice(1, 4).reduce((s, t) => s + t, 0) / 3; // 去頭尾取中間三
        const mo5 = times.reduce((s, t) => s + t, 0) / 5;
        return { ao5, mo5 };
    }

    refreshRecords() {
        this.updateStatistics();
        this.updateSolveHistory();
    }

    updateStatistics() {
        const solves = this.getSolves();
        const { ao5, mo5 } = this.calculateStatistics();

        if (solves.length < 5) {
            // 1~4 次(含 0)：顯示提示，隱藏數字
            this.elements.ao5Display.style.display = 'none';
            this.elements.mo5Display.style.display = 'none';
            this.elements.noStatsMessage.style.display = 'block';
        } else {
            this.elements.ao5Display.style.display = 'flex';
            this.elements.ao5Value.textContent = this.formatTime(ao5);
            this.elements.mo5Display.style.display = 'flex';
            this.elements.mo5Value.textContent = this.formatTime(mo5);
            this.elements.noStatsMessage.style.display = 'none';
        }
    }

    updateSolveHistory() {
        const container = this.elements.solveHistoryList;
        const solves = this.getSolves().slice(0, 5);

        if (solves.length === 0) {
            container.innerHTML = `<div class="no-records">${this.translationManager.getText('noRecords')}</div>`;
            this.elements.lastScrambleSection.style.display = 'none';
            if (this.elements.clearRecordsBtn) this.elements.clearRecordsBtn.style.display = 'none';
            return;
        }

        container.innerHTML = '';
        solves.forEach((solve, index) => {
            const item = document.createElement('div');
            item.className = 'solve-item';
            const time = new Date(solve.ts).toLocaleTimeString();
            item.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span class="solve-number">#${index + 1}</span>
                    <span class="solve-time">${this.formatTime(solve.t)}</span>
                </div>
                <span class="solve-timestamp">${time}</span>`;
            container.appendChild(item);
        });

        // 上一轉打亂 = 最近一筆
        this.elements.lastScrambleSection.style.display = 'block';
        this.elements.lastScrambleText.textContent = solves[0].sc || '--';
        if (this.elements.clearRecordsBtn) this.elements.clearRecordsBtn.style.display = 'inline-block';
    }

    clearCurrentRecords() {
        const msg = this.translationManager.getText('clearConfirm');
        if (!window.confirm(msg)) return;
        delete this.store[this.selectedEvent];
        this._saveStore();
        this.refreshRecords();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.cubeTimer = new CubeTimer();
});
