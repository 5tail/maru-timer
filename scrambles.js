// ============================================================================
// 本地 fallback 打亂生成器 (Local fallback scramble generator)
// 對外介面：ScrambleGenerator.generate(eventId) -> string (同步)
// cubing.js 可用時由 scramble-engine.js 優先呼叫；此為離線/降級時使用。
// ============================================================================
class ScrambleGenerator {
    static generate(eventId) {
        switch (eventId) {
            case '333':   return this.generate3x3();
            case '222':   return this.generate2x2();
            case '444':   return this.generate4x4();
            case '555':   return this.generate5x5();
            case '666':   return this.generate6x6();
            case '777':   return this.generate7x7();
            case 'pyram': return this.generatePyraminx();
            case 'skewb': return this.generateSkewb();
            case 'mega':  return this.generateMegaminx();
            case 'sq1':   return this.generateSquare1();
            case 'clock': return this.generateClock();
            case 'fto':   return this.generateFTO();
            case 'ivy':   return this.generateIvy();
            default:      return this.generate3x3();
        }
    }

    // ------------------------------------------------------------------
    // §3.1 通用工具：層(layer) + 軸(axis) 雙層判斷
    // ------------------------------------------------------------------

    // 解析一個「基礎 move」(不含修飾)，例：'R' / 'Uw' / '3Rw'
    // 先剝離開頭數字，再取面字母，徹底修掉 3Uw 的 bug。
    static parseMove(baseMove) {
        let m = baseMove;
        let width = 1;
        const lead = m.match(/^(\d+)/);
        if (lead) {
            width = parseInt(lead[1], 10);
            m = m.slice(lead[1].length);
        }
        if (m.indexOf('w') !== -1 && width === 1) {
            width = 2; // 'Uw' → 寬度 2
        }
        const face = m[0];
        const axis = this.faceAxis(face);
        return { move: baseMove, face, width, axis, key: face + width };
    }

    static faceAxis(face) {
        switch (face) {
            case 'U': case 'D': return 'UD';
            case 'R': case 'L': return 'RL';
            case 'F': case 'B': return 'FB';
            default: return '';
        }
    }

    // WCA random-move：
    //  1. 不得與上一步同面同寬(同層重複)
    //  2. 同軸連續時，不得重複「當前同軸序列中已出現過的 face+width」
    //     → 同時擋掉 R L R 與 Rw R Rw；換軸時清空 axisRun。
    static randomMoveScramble(baseMoves, modifiers, length) {
        const parsed = baseMoves.map(bm => this.parseMove(bm));
        const scramble = [];
        let currentAxis = null;
        let axisRun = new Set();

        for (let i = 0; i < length; i++) {
            const candidates = parsed.filter(p => {
                if (p.axis === currentAxis) {
                    return !axisRun.has(p.key);
                }
                return true; // 不同軸(或第一步)一律合法
            });
            const pick = candidates[Math.floor(Math.random() * candidates.length)];
            const mod = modifiers[Math.floor(Math.random() * modifiers.length)];
            scramble.push(pick.move + mod);

            if (pick.axis === currentAxis) {
                axisRun.add(pick.key);
            } else {
                currentAxis = pick.axis;
                axisRun = new Set([pick.key]);
            }
        }
        return scramble;
    }

    // 把 flat 陣列格式化為每行 20 步
    static formatLines(scramble, perLine = 20) {
        const lines = [];
        for (let i = 0; i < scramble.length; i += perLine) {
            lines.push(scramble.slice(i, i + perLine).join(' '));
        }
        return lines.join('\n');
    }

    // ------------------------------------------------------------------
    // §3.2 各項目
    // ------------------------------------------------------------------

    static generate3x3() {
        const moves = ['U', 'D', 'R', 'L', 'F', 'B'];
        const mods = ['', "'", '2'];
        return this.randomMoveScramble(moves, mods, 20).join(' ');
    }

    static generate2x2() {
        const moves = ['U', 'R', 'F'];
        const mods = ['', "'", '2'];
        const len = 9 + Math.floor(Math.random() * 3); // 9~11
        return this.randomMoveScramble(moves, mods, len).join(' ');
    }

    static generate4x4() {
        // WCA 4x4 只用 Uw Rw Fw 三個寬層
        const moves = ['U', 'D', 'R', 'L', 'F', 'B', 'Uw', 'Rw', 'Fw'];
        const mods = ['', "'", '2'];
        return this.formatLines(this.randomMoveScramble(moves, mods, 40));
    }

    static generate5x5() {
        const moves = ['U', 'D', 'R', 'L', 'F', 'B', 'Uw', 'Dw', 'Rw', 'Lw', 'Fw', 'Bw'];
        const mods = ['', "'", '2'];
        return this.formatLines(this.randomMoveScramble(moves, mods, 60));
    }

    static generate6x6() {
        // 三層只用 3Uw 3Rw 3Fw
        const moves = ['U', 'D', 'R', 'L', 'F', 'B',
                       'Uw', 'Dw', 'Rw', 'Lw', 'Fw', 'Bw',
                       '3Uw', '3Rw', '3Fw'];
        const mods = ['', "'", '2'];
        return this.formatLines(this.randomMoveScramble(moves, mods, 80));
    }

    static generate7x7() {
        const moves = ['U', 'D', 'R', 'L', 'F', 'B',
                       'Uw', 'Dw', 'Rw', 'Lw', 'Fw', 'Bw',
                       '3Uw', '3Rw', '3Fw'];
        const mods = ['', "'", '2'];
        return this.formatLines(this.randomMoveScramble(moves, mods, 100));
    }

    // Pyraminx：主體不得同面連續(修掉 R R' 抵銷)，tips 最後追加(各 50% 出現一次)
    static generatePyraminx() {
        const faces = ['U', 'L', 'R', 'B'];
        const mods = ['', "'"];
        const len = 8 + Math.floor(Math.random() * 4); // 8~11
        const tokens = [];
        let lastFace = '';

        for (let i = 0; i < len; i++) {
            let f;
            do { f = faces[Math.floor(Math.random() * faces.length)]; } while (f === lastFace);
            tokens.push(f + mods[Math.floor(Math.random() * mods.length)]);
            lastFace = f;
        }

        // tips：亂序遍歷 u l r b，各 50% 機率追加一次，且不與前一步同面(避免任何相鄰同面)
        const tips = this.shuffle(['u', 'l', 'r', 'b']);
        for (const t of tips) {
            if (Math.random() < 0.5) {
                if (t.toUpperCase() === lastFace) continue; // 避免 R 後接 r
                tokens.push(t + mods[Math.floor(Math.random() * mods.length)]);
                lastFace = t.toUpperCase();
            }
        }
        return tokens.join(' ');
    }

    static generateSkewb() {
        const faces = ['U', 'L', 'R', 'B'];
        const mods = ['', "'"];
        const len = 11;
        const tokens = [];
        let lastFace = '';
        for (let i = 0; i < len; i++) {
            let f;
            do { f = faces[Math.floor(Math.random() * faces.length)]; } while (f === lastFace);
            tokens.push(f + mods[Math.floor(Math.random() * mods.length)]);
            lastFace = f;
        }
        return tokens.join(' ');
    }

    // Megaminx：現有實作正確，保留
    static generateMegaminx() {
        const scramble = [];
        for (let line = 0; line < 7; line++) {
            const lineMoves = [];
            for (let move = 0; move < 10; move++) {
                const rotation = Math.random() < 0.5 ? '++' : '--';
                lineMoves.push((move % 2 === 0 ? 'R' : 'D') + rotation);
            }
            lineMoves.push(Math.random() < 0.5 ? 'U' : "U'");
            scramble.push(lineMoves.join(' '));
        }
        return scramble.join('\n');
    }

    // §3.3 Square-1：形狀模擬，只產出物理上可執行的打亂
    static generateSquare1() {
        // 每層以 12 格 boolean 表示：cut[i] = 第 i 格前是否為塊邊界
        // solved：角塊佔 2 格、邊塊佔 1 格 → cut = T F T T F T T F T T F T
        const solved = () => [true, false, true, true, false, true,
                              true, false, true, true, false, true];
        const rotate = (arr, k) => {
            k = ((k % 12) + 12) % 12;
            const r = new Array(12);
            for (let i = 0; i < 12; i++) r[i] = arr[(i - k + 12) % 12];
            return r;
        };
        // 12 點(cut[0]) 與 6 點(cut[6]) 都需為邊界才可切
        const sliceable = (t, b) => t[0] && t[6] && b[0] && b[6];

        let top = solved();
        let bottom = solved();
        const groups = [];
        const N = 12;

        for (let i = 0; i < N; i++) {
            const needSlice = i < N - 1; // 最後一組不切、不加 /
            let x, y, nt, nb, ok = false, attempts = 0;
            while (!ok && attempts < 100) {
                attempts++;
                x = Math.floor(Math.random() * 12) - 5; // -5..6
                y = Math.floor(Math.random() * 12) - 5; // -5..6
                if (x === 0 && y === 0) continue;
                nt = rotate(top, x);
                nb = rotate(bottom, y);
                ok = needSlice ? sliceable(nt, nb) : true;
            }
            top = nt; bottom = nb;
            groups.push(`(${x},${y})`);
            if (needSlice) {
                for (let s = 0; s < 6; s++) {
                    const tmp = top[s]; top[s] = bottom[s]; bottom[s] = tmp;
                }
            }
        }

        const withSlash = groups.map((g, idx) => idx < groups.length - 1 ? g + ' /' : g);
        const line1 = withSlash.slice(0, 6).join(' ');
        const line2 = withSlash.slice(6, 12).join(' ');
        return `${line1}\n${line2}`;
    }

    // Clock：轉針數 0~6，WCA 現行單行格式(與 cubing.js 一致)
    static generateClock() {
        const dial = () => `${Math.floor(Math.random() * 7)}${Math.random() < 0.5 ? '+' : '-'}`;
        const parts = [];
        for (const p of ['UR', 'DR', 'DL', 'UL', 'U', 'R', 'D', 'L', 'ALL']) parts.push(p + dial());
        parts.push('y2');
        for (const p of ['U', 'R', 'D', 'L', 'ALL']) parts.push(p + dial());
        return parts.join(' ');
    }

    // FTO(轉面八面體)：8 面，不得同面連續、不得 A B A(A B 為對面)
    static generateFTO() {
        const faces = ['U', 'D', 'R', 'L', 'F', 'B', 'BR', 'BL'];
        const opposite = { U: 'D', D: 'U', F: 'B', B: 'F', R: 'BL', BL: 'R', L: 'BR', BR: 'L' };
        const mods = ['', "'"];
        const len = 30;
        const faceSeq = [];
        const tokens = [];
        for (let i = 0; i < len; i++) {
            let f, attempts = 0;
            do {
                f = faces[Math.floor(Math.random() * faces.length)];
                attempts++;
            } while (attempts < 200 && (
                f === faceSeq[i - 1] ||
                (i >= 2 && faceSeq[i - 1] === opposite[f] && faceSeq[i - 2] === f)
            ));
            faceSeq.push(f);
            tokens.push(f + mods[Math.floor(Math.random() * mods.length)]);
        }
        return tokens.join(' ');
    }

    // Ivy(楓葉方塊)：不得同面連續。永遠走本地生成器。
    static generateIvy() {
        const faces = ['R', 'L', 'D', 'B'];
        const mods = ['', "'"];
        const len = 9 + Math.floor(Math.random() * 3); // 9~11
        const tokens = [];
        let lastFace = '';
        for (let i = 0; i < len; i++) {
            let f;
            do { f = faces[Math.floor(Math.random() * faces.length)]; } while (f === lastFace);
            tokens.push(f + mods[Math.floor(Math.random() * mods.length)]);
            lastFace = f;
        }
        return tokens.join(' ');
    }

    // Fisher-Yates
    static shuffle(arr) {
        const a = arr.slice();
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }
}

// Export
if (typeof window !== 'undefined') {
    window.ScrambleGenerator = ScrambleGenerator;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ScrambleGenerator; // for Node self-test
}
