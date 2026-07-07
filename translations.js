// ============================================================================
// 七語言翻譯 (Multi-language translations)
// 支援：繁中 / 簡中 / 英 / 日 / 韓 / 西 / 越
// ============================================================================
const translations = {
    'zh-TW': {
        pageTitle: '小丸號魔術方塊計時器 - MaruCube Timer',
        event: '項目：',
        currentScramble: '目前轉法：',
        newScramble: '新SC',
        generatingScramble: '打亂生成中…',
        pressSpace: '按住空白鍵',
        holdSpaceToStart: '按住空白鍵0.5秒開始計時',
        preparing: '準備中…',
        ready: '準備好了！放開開始計時',
        timing: '計時中…按空白鍵停止',
        finished: '完成！按空白鍵下一次',
        mobileStart: '按住開始',
        mobileHoldInstruction: '觸摸並按住 0.5 秒',
        mobilePreparing: '準備中…',
        mobileKeepHolding: '繼續按住',
        mobileReady: '準備好了！',
        mobileRelease: '放開開始計時',
        mobileTapStop: '按一下停止',
        mobileTiming: '計時中…',
        mobileTapReset: '按一下重置',
        mobileRestart: '重新開始',
        statistics: '統計',
        ao5: '五次平均 (AO5)',
        mo5: '五次均值 (MO5)',
        noStatistics: '完成 5 次解題來查看統計',
        recentSolves: '最近解題',
        noRecords: '尚無解題記錄',
        clearRecords: '清除本項目記錄',
        clearConfirm: '確定要清除此項目的所有記錄嗎？',
        lastScramble: '上一轉SC (Last SC)',
        footerLine1: '小丸號 獨立計時器',
        footerLine2: '支援 WCA 官方項目及 FTO、楓葉方塊',
        events: {
            '333': '3x3x3 魔術方塊', '222': '2x2x2 魔術方塊', '444': '4x4x4 魔術方塊',
            '555': '5x5x5 魔術方塊', '666': '6x6x6 魔術方塊', '777': '7x7x7 魔術方塊',
            'pyram': '金字塔方塊', 'skewb': '斜轉方塊', 'mega': '正十二面體方塊',
            'sq1': 'SQ1扇形方塊', 'clock': '魔錶',
            'fto': '轉面八面體 (FTO)', 'ivy': '楓葉方塊'
        }
    },
    'zh-CN': {
        pageTitle: '小丸号魔方计时器 - MaruCube Timer',
        event: '项目：',
        currentScramble: '当前打乱：',
        newScramble: '新SC',
        generatingScramble: '打乱生成中…',
        pressSpace: '按住空格键',
        holdSpaceToStart: '按住空格键0.5秒开始计时',
        preparing: '准备中…',
        ready: '准备好了！松开开始计时',
        timing: '计时中…按空格键停止',
        finished: '完成！按空格键下一次',
        mobileStart: '按住开始',
        mobileHoldInstruction: '触摸并按住 0.5 秒',
        mobilePreparing: '准备中…',
        mobileKeepHolding: '继续按住',
        mobileReady: '准备好了！',
        mobileRelease: '松开开始计时',
        mobileTapStop: '按一下停止',
        mobileTiming: '计时中…',
        mobileTapReset: '按一下重置',
        mobileRestart: '重新开始',
        statistics: '统计',
        ao5: '五次平均 (AO5)',
        mo5: '五次均值 (MO5)',
        noStatistics: '完成 5 次解题来查看统计',
        recentSolves: '最近解题',
        noRecords: '尚无解题记录',
        clearRecords: '清除本项目记录',
        clearConfirm: '确定要清除此项目的所有记录吗？',
        lastScramble: '上一转SC (Last SC)',
        footerLine1: '小丸号 独立计时器',
        footerLine2: '支持 WCA 官方项目及 FTO、枫叶魔方',
        events: {
            '333': '3x3x3 魔方', '222': '2x2x2 魔方', '444': '4x4x4 魔方',
            '555': '5x5x5 魔方', '666': '6x6x6 魔方', '777': '7x7x7 魔方',
            'pyram': '金字塔', 'skewb': '斜转', 'mega': '五魔方',
            'sq1': 'SQ1', 'clock': '魔表',
            'fto': '转面八面体 (FTO)', 'ivy': '枫叶魔方'
        }
    },
    'en': {
        pageTitle: 'Cube Timer Practice - MaruCube Timer',
        event: 'Event:',
        currentScramble: 'Current Scramble:',
        newScramble: 'New SC',
        generatingScramble: 'Generating scramble…',
        pressSpace: 'Hold Spacebar',
        holdSpaceToStart: 'Hold spacebar for 0.5s to start timer',
        preparing: 'Preparing…',
        ready: 'Ready! Release to start timing',
        timing: 'Timing… Press spacebar to stop',
        finished: 'Complete! Press spacebar for next solve',
        mobileStart: 'Hold to Start',
        mobileHoldInstruction: 'Touch and hold 0.5s',
        mobilePreparing: 'Preparing…',
        mobileKeepHolding: 'Keep holding',
        mobileReady: 'Ready!',
        mobileRelease: 'Release to start',
        mobileTapStop: 'Tap to stop',
        mobileTiming: 'Timing…',
        mobileTapReset: 'Tap to reset',
        mobileRestart: 'Restart',
        statistics: 'Statistics',
        ao5: 'Average of 5 (AO5)',
        mo5: 'Mean of 5 (MO5)',
        noStatistics: 'Complete 5 solves to see statistics',
        recentSolves: 'Recent Solves',
        noRecords: 'No solve records yet',
        clearRecords: 'Clear records for this event',
        clearConfirm: 'Clear all records for this event?',
        lastScramble: 'Last SC',
        footerLine1: 'MaruCube Standalone Timer',
        footerLine2: 'Supports WCA events plus FTO & Ivy Cube',
        events: {
            '333': '3x3x3 Cube', '222': '2x2x2 Cube', '444': '4x4x4 Cube',
            '555': '5x5x5 Cube', '666': '6x6x6 Cube', '777': '7x7x7 Cube',
            'pyram': 'Pyraminx', 'skewb': 'Skewb', 'mega': 'Megaminx',
            'sq1': 'Square-1', 'clock': 'Clock',
            'fto': 'FTO (Face-Turning Octahedron)', 'ivy': 'Ivy Cube'
        }
    },
    'ja': {
        pageTitle: 'キューブタイマー練習 - MaruCube Timer',
        event: '種目：',
        currentScramble: '現在のスクランブル：',
        newScramble: '新SC',
        generatingScramble: 'スクランブル生成中…',
        pressSpace: 'スペースキーを押す',
        holdSpaceToStart: 'スペースキーを0.5秒押してタイマー開始',
        preparing: '準備中…',
        ready: '準備完了！離してタイマー開始',
        timing: 'タイマー中…スペースキーで停止',
        finished: '完了！スペースキーで次のソルブ',
        mobileStart: '長押しで開始',
        mobileHoldInstruction: '0.5秒タッチし続ける',
        mobilePreparing: '準備中…',
        mobileKeepHolding: '押し続けてください',
        mobileReady: '準備完了！',
        mobileRelease: '離してスタート',
        mobileTapStop: 'タップで停止',
        mobileTiming: '計測中…',
        mobileTapReset: 'タップでリセット',
        mobileRestart: '再スタート',
        statistics: '統計',
        ao5: '5回平均 (AO5)',
        mo5: '5回平均値 (MO5)',
        noStatistics: '統計を見るには5回ソルブしてください',
        recentSolves: '最近のソルブ',
        noRecords: 'ソルブ記録がありません',
        clearRecords: 'この種目の記録を消去',
        clearConfirm: 'この種目の記録をすべて消去しますか？',
        lastScramble: '前のSC (Last SC)',
        footerLine1: 'MaruCube スタンドアロンタイマー',
        footerLine2: 'WCA種目と FTO・アイビーキューブに対応',
        events: {
            '333': '3x3x3キューブ', '222': '2x2x2キューブ', '444': '4x4x4キューブ',
            '555': '5x5x5キューブ', '666': '6x6x6キューブ', '777': '7x7x7キューブ',
            'pyram': 'ピラミンクス', 'skewb': 'スキューブ', 'mega': 'メガミンクス',
            'sq1': 'スクエア1', 'clock': 'クロック',
            'fto': 'FTO（面回転八面体）', 'ivy': 'アイビーキューブ'
        }
    },
    'ko': {
        pageTitle: '큐브 타이머 연습 - MaruCube Timer',
        event: '종목：',
        currentScramble: '현재 스크램블：',
        newScramble: '새 SC',
        generatingScramble: '스크램블 생성 중…',
        pressSpace: '스페이스바 누르기',
        holdSpaceToStart: '스페이스바를 0.5초 눌러 타이머 시작',
        preparing: '준비 중…',
        ready: '준비됨! 놓아서 타이밍 시작',
        timing: '타이밍 중… 스페이스바로 정지',
        finished: '완료! 스페이스바로 다음 솔브',
        mobileStart: '길게 눌러 시작',
        mobileHoldInstruction: '0.5초 동안 누르기',
        mobilePreparing: '준비 중…',
        mobileKeepHolding: '계속 누르세요',
        mobileReady: '준비됨!',
        mobileRelease: '놓으면 시작',
        mobileTapStop: '탭하여 정지',
        mobileTiming: '측정 중…',
        mobileTapReset: '탭하여 리셋',
        mobileRestart: '다시 시작',
        statistics: '통계',
        ao5: '5회 평균 (AO5)',
        mo5: '5회 평균값 (MO5)',
        noStatistics: '통계를 보려면 5회 솔브를 완료하세요',
        recentSolves: '최근 솔브',
        noRecords: '솔브 기록이 없습니다',
        clearRecords: '이 종목 기록 삭제',
        clearConfirm: '이 종목의 모든 기록을 삭제할까요?',
        lastScramble: '이전 SC (Last SC)',
        footerLine1: 'MaruCube 독립 타이머',
        footerLine2: 'WCA 종목과 FTO·아이비 큐브 지원',
        events: {
            '333': '3x3x3 큐브', '222': '2x2x2 큐브', '444': '4x4x4 큐브',
            '555': '5x5x5 큐브', '666': '6x6x6 큐브', '777': '7x7x7 큐브',
            'pyram': '피라밍크스', 'skewb': '스큐브', 'mega': '메가밍크스',
            'sq1': '스퀘어1', 'clock': '클록',
            'fto': 'FTO (옥타헤드론)', 'ivy': '아이비 큐브'
        }
    },
    'es': {
        pageTitle: 'Práctica de Temporizador - MaruCube Timer',
        event: 'Evento:',
        currentScramble: 'Mezcla Actual:',
        newScramble: 'Nuevo SC',
        generatingScramble: 'Generando mezcla…',
        pressSpace: 'Mantener Espacio',
        holdSpaceToStart: 'Mantén la barra espaciadora 0.5s para iniciar',
        preparing: 'Preparando…',
        ready: '¡Listo! Suelta para empezar',
        timing: 'Cronometrando… Presiona espacio para parar',
        finished: '¡Completo! Presiona espacio para el siguiente',
        mobileStart: 'Mantén para iniciar',
        mobileHoldInstruction: 'Toca y mantén 0.5s',
        mobilePreparing: 'Preparando…',
        mobileKeepHolding: 'Sigue presionando',
        mobileReady: '¡Listo!',
        mobileRelease: 'Suelta para empezar',
        mobileTapStop: 'Toca para parar',
        mobileTiming: 'Cronometrando…',
        mobileTapReset: 'Toca para reiniciar',
        mobileRestart: 'Reiniciar',
        statistics: 'Estadísticas',
        ao5: 'Promedio de 5 (AO5)',
        mo5: 'Media de 5 (MO5)',
        noStatistics: 'Completa 5 resoluciones para ver estadísticas',
        recentSolves: 'Resoluciones Recientes',
        noRecords: 'Aún no hay registros de resolución',
        clearRecords: 'Borrar registros de este evento',
        clearConfirm: '¿Borrar todos los registros de este evento?',
        lastScramble: 'Último SC (Last SC)',
        footerLine1: 'MaruCube Temporizador Independiente',
        footerLine2: 'Soporta eventos WCA más FTO e Ivy Cube',
        events: {
            '333': 'Cubo 3x3x3', '222': 'Cubo 2x2x2', '444': 'Cubo 4x4x4',
            '555': 'Cubo 5x5x5', '666': 'Cubo 6x6x6', '777': 'Cubo 7x7x7',
            'pyram': 'Pyraminx', 'skewb': 'Skewb', 'mega': 'Megaminx',
            'sq1': 'Square-1', 'clock': 'Clock',
            'fto': 'FTO (Octaedro)', 'ivy': 'Ivy Cube'
        }
    },
    'vi': {
        pageTitle: 'Luyện Tập Đếm Giờ - MaruCube Timer',
        event: 'Nội dung:',
        currentScramble: 'Công Thức Xáo Hiện Tại:',
        newScramble: 'SC Mới',
        generatingScramble: 'Đang tạo công thức xáo…',
        pressSpace: 'Giữ Phím Cách',
        holdSpaceToStart: 'Giữ phím cách 0.5 giây để bắt đầu',
        preparing: 'Đang chuẩn bị…',
        ready: 'Sẵn sàng! Thả để bắt đầu',
        timing: 'Đang tính giờ… Nhấn phím cách để dừng',
        finished: 'Hoàn thành! Nhấn phím cách cho lần tiếp theo',
        mobileStart: 'Giữ để bắt đầu',
        mobileHoldInstruction: 'Chạm và giữ 0.5 giây',
        mobilePreparing: 'Đang chuẩn bị…',
        mobileKeepHolding: 'Tiếp tục giữ',
        mobileReady: 'Sẵn sàng!',
        mobileRelease: 'Thả để bắt đầu',
        mobileTapStop: 'Chạm để dừng',
        mobileTiming: 'Đang tính giờ…',
        mobileTapReset: 'Chạm để đặt lại',
        mobileRestart: 'Bắt đầu lại',
        statistics: 'Thống Kê',
        ao5: 'Trung Bình 5 (AO5)',
        mo5: 'Trung Vị 5 (MO5)',
        noStatistics: 'Hoàn thành 5 lần giải để xem thống kê',
        recentSolves: 'Lần Giải Gần Đây',
        noRecords: 'Chưa có kỷ lục giải nào',
        clearRecords: 'Xóa kỷ lục nội dung này',
        clearConfirm: 'Xóa tất cả kỷ lục của nội dung này?',
        lastScramble: 'SC Trước (Last SC)',
        footerLine1: 'MaruCube Bộ Đếm Giờ Độc Lập',
        footerLine2: 'Hỗ trợ nội dung WCA cùng FTO & Ivy Cube',
        events: {
            '333': 'Rubik 3x3x3', '222': 'Rubik 2x2x2', '444': 'Rubik 4x4x4',
            '555': 'Rubik 5x5x5', '666': 'Rubik 6x6x6', '777': 'Rubik 7x7x7',
            'pyram': 'Pyraminx', 'skewb': 'Skewb', 'mega': 'Megaminx',
            'sq1': 'Square-1', 'clock': 'Clock',
            'fto': 'FTO (Bát diện xoay mặt)', 'ivy': 'Ivy Cube'
        }
    }
};

// 事件下拉選單順序
const EVENT_ORDER = ['333', '222', '444', '555', '666', '777',
                     'pyram', 'skewb', 'mega', 'sq1', 'clock', 'fto', 'ivy'];

// ============================================================================
// 翻譯管理器 (Translation manager)
// ============================================================================
class TranslationManager {
    constructor() {
        this.currentLanguage = this._loadInitialLanguage();
        this.loadLanguage(this.currentLanguage);
    }

    // 讀取語言並執行舊 key 遷移：cubeTimerLanguage → maruTimer_language
    _loadInitialLanguage() {
        try {
            let lang = localStorage.getItem('maruTimer_language');
            const legacy = localStorage.getItem('cubeTimerLanguage');
            if (!lang && legacy) {
                lang = legacy;
                localStorage.setItem('maruTimer_language', legacy);
                localStorage.removeItem('cubeTimerLanguage');
            }
            return lang || 'zh-TW';
        } catch (e) {
            return 'zh-TW';
        }
    }

    loadLanguage(languageCode) {
        this.currentLanguage = languageCode;
        try { localStorage.setItem('maruTimer_language', languageCode); } catch (e) { /* 隱私模式：靜默降級 */ }
        this.updatePageTranslations();
        this.updateEventOptions();
    }

    getText(key) {
        const lookup = (langObj) => {
            let v = langObj;
            for (const k of key.split('.')) {
                if (v && Object.prototype.hasOwnProperty.call(v, k)) v = v[k];
                else return undefined;
            }
            return v;
        };
        const val = lookup(translations[this.currentLanguage]);
        if (val !== undefined) return val;
        const fallback = lookup(translations['zh-TW']); // fallback 繁中
        return fallback !== undefined ? fallback : key;
    }

    updatePageTranslations() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            el.textContent = this.getText(el.getAttribute('data-i18n'));
        });
        // 頁面標題走各語言 pageTitle
        document.title = this.getText('pageTitle');
        // 注意：不再覆蓋 footer.innerHTML，maru.tw 連結由 HTML 靜態保留
    }

    updateEventOptions() {
        const eventSelect = document.getElementById('eventSelect');
        if (!eventSelect) return;
        const currentValue = eventSelect.value;
        eventSelect.innerHTML = '';
        EVENT_ORDER.forEach(eventId => {
            const option = document.createElement('option');
            option.value = eventId;
            option.textContent = this.getText(`events.${eventId}`);
            eventSelect.appendChild(option);
        });
        if (currentValue) eventSelect.value = currentValue;
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }
}

if (typeof window !== 'undefined') {
    window.TranslationManager = TranslationManager;
    window.MARU_EVENT_ORDER = EVENT_ORDER;
}
