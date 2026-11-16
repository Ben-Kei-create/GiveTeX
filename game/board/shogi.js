/* 将棋（持ち駒・成り・二歩・打ち歩詰め・行きどころのない駒の禁止あり。千日手・入玉宣言は省略）
   あなた＝先手（下・▲）、CPU＝後手（上・△）。後手を選ぶと入れかわります */
(function () {
  var KANJI = { K: ['玉', '玉'], G: ['金', '金'], S: ['銀', '全'], N: ['桂', '圭'], L: ['香', '杏'], P: ['歩', 'と'], B: ['角', '馬'], R: ['飛', '龍'] };
  var VAL = { P: 1, L: 3, N: 4, S: 5, G: 6, B: 8, R: 10, K: 0 }, PVAL = { P: 7, L: 6, N: 6, S: 6, B: 12, R: 14 };
  var GOLD = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, 0]], KING = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
  var STEP = { K: KING, G: GOLD, S: [[-1, -1], [-1, 0], [-1, 1], [1, -1], [1, 1]], N: [[-2, -1], [-2, 1]], P: [[-1, 0]] };
  var HANDS = ['R', 'B', 'G', 'S', 'N', 'L', 'P'];
  function steps(p) { if (p.p && 'PLNS'.indexOf(p.t) >= 0) return GOLD; if (p.p && p.t === 'B') return [[-1, 0], [0, -1], [0, 1], [1, 0]]; if (p.p && p.t === 'R') return [[-1, -1], [-1, 1], [1, -1], [1, 1]]; return STEP[p.t] || []; }
  function slides(p) { if (p.t === 'R') return [[-1, 0], [1, 0], [0, -1], [0, 1]]; if (p.t === 'B') return [[-1, -1], [-1, 1], [1, -1], [1, 1]]; if (p.t === 'L' && !p.p) return [[-1, 0]]; return []; }
  function init() { var b = []; for (var r = 0; r < 9; r++) { b.push([]); for (var c = 0; c < 9; c++) b[r].push(null); }
    var back = ['L', 'N', 'S', 'G', 'K', 'G', 'S', 'N', 'L'];
    for (c = 0; c < 9; c++) { b[0][c] = { t: back[c], o: -1, p: false }; b[8][c] = { t: back[c], o: 1, p: false }; b[2][c] = { t: 'P', o: -1, p: false }; b[6][c] = { t: 'P', o: 1, p: false }; }
    b[1][1] = { t: 'R', o: -1, p: false }; b[1][7] = { t: 'B', o: -1, p: false }; b[7][1] = { t: 'B', o: 1, p: false }; b[7][7] = { t: 'R', o: 1, p: false };
    return { b: b, h: { '1': {}, '-1': {} }, turn: 1 }; }
  function clone(s) { return { b: s.b.map(function (r) { return r.map(function (p) { return p ? { t: p.t, o: p.o, p: p.p } : null; }); }), h: { '1': Object.assign({}, s.h['1']), '-1': Object.assign({}, s.h['-1']) }, turn: s.turn }; }
  function inB(r, c) { return r >= 0 && r < 9 && c >= 0 && c < 9; }
  function attacked(b, r, c, by) { // (r,c) に by 側の駒が利いているか
    for (var dr = -2; dr <= 2; dr++) for (var dc = -1; dc <= 1; dc++) { var rr = r - dr * by, cc = c - dc; if (!inB(rr, cc)) continue; var p = b[rr][cc]; if (!p || p.o !== by) continue;
      var st = steps(p); for (var i = 0; i < st.length; i++) if (st[i][0] === dr && st[i][1] === dc) return true; }
    var D = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]];
    for (i = 0; i < 8; i++) { var d = D[i]; rr = r - d[0] * by; cc = c - d[1]; var n = 1;
      while (inB(rr, cc)) { p = b[rr][cc]; if (p) { if (p.o === by && n > 1) { var sl = slides(p); for (var k = 0; k < sl.length; k++) if (sl[k][0] === d[0] && sl[k][1] === d[1]) return true; } else if (p.o === by && n === 1) { sl = slides(p); for (k = 0; k < sl.length; k++) if (sl[k][0] === d[0] && sl[k][1] === d[1]) return true; } break; }
        rr -= d[0] * by; cc -= d[1]; n++; } }
    return false; }
  function king(b, o) { for (var r = 0; r < 9; r++) for (var c = 0; c < 9; c++) { var p = b[r][c]; if (p && p.t === 'K' && p.o === o) return [r, c]; } return null; }
  function inCheck(s, o) { var k = king(s.b, o); return k ? attacked(s.b, k[0], k[1], -o) : false; }
  function zone(r, o) { return o > 0 ? r <= 2 : r >= 6; }
  function lastRows(t, r, o) { var rr = o > 0 ? r : 8 - r; return ((t === 'P' || t === 'L') && rr === 0) || (t === 'N' && rr <= 1); }
  function pseudo(s, noDrops) { var b = s.b, o = s.turn, out = [];
    for (var r = 0; r < 9; r++) for (var c = 0; c < 9; c++) { var p = b[r][c]; if (!p || p.o !== o) continue;
      var add = function (r2, c2) { var canP = !p.p && p.t !== 'G' && p.t !== 'K' && (zone(r, o) || zone(r2, o)), must = !p.p && lastRows(p.t, r2, o);
        if (!must) out.push({ f: [r, c], t: [r2, c2], pr: false }); if (canP) out.push({ f: [r, c], t: [r2, c2], pr: true }); };
      steps(p).forEach(function (d) { var r2 = r + d[0] * o, c2 = c + d[1]; if (inB(r2, c2) && (!b[r2][c2] || b[r2][c2].o !== o)) add(r2, c2); });
      slides(p).forEach(function (d) { var r2 = r + d[0] * o, c2 = c + d[1]; while (inB(r2, c2)) { if (b[r2][c2] && b[r2][c2].o === o) break; add(r2, c2); if (b[r2][c2]) break; r2 += d[0] * o; c2 += d[1]; } }); }
    if (!noDrops) { var hand = s.h[o];
      HANDS.forEach(function (t) { if (!hand[t]) return; for (var r = 0; r < 9; r++) for (var c = 0; c < 9; c++) { if (b[r][c] || lastRows(t, r, o)) continue;
        if (t === 'P') { var two = false; for (var k = 0; k < 9; k++) { var q = b[k][c]; if (q && q.o === o && q.t === 'P' && !q.p) { two = true; break; } } if (two) continue; }
        out.push({ d: t, t: [r, c] }); } }); }
    return out; }
  function make(s, m) { var n = clone(s), b = n.b, o = s.turn;
    if (m.d) { b[m.t[0]][m.t[1]] = { t: m.d, o: o, p: false }; n.h[o][m.d]--; }
    else { var p = b[m.f[0]][m.f[1]], cap = b[m.t[0]][m.t[1]]; if (cap) n.h[o][cap.t] = (n.h[o][cap.t] || 0) + 1; b[m.t[0]][m.t[1]] = { t: p.t, o: o, p: p.p || m.pr }; b[m.f[0]][m.f[1]] = null; }
    n.turn = -o; return n; }
  function legal(s, noDrops) { return pseudo(s, noDrops).filter(function (m) { var n = make(s, m); if (inCheck(n, s.turn)) return false;
    if (m.d === 'P') { var k = king(n.b, -s.turn); if (k && inCheck(n, -s.turn) && !legal(n).length) return false; } // 打ち歩詰め
    return true; }); }
  function evalS(s) { var v = 0; for (var r = 0; r < 9; r++) for (var c = 0; c < 9; c++) { var p = s.b[r][c]; if (!p) continue; var x = p.p ? PVAL[p.t] : VAL[p.t]; v += x * p.o; if (p.t !== 'K' && !p.p) v += .02 * p.o * (p.o > 0 ? 8 - r : r); }
    HANDS.forEach(function (t) { v += (s.h['1'][t] || 0) * VAL[t] * 1.1 - (s.h['-1'][t] || 0) * VAL[t] * 1.1; }); return v; }
  function ordered(s, ms) { return ms.map(function (m) { var cap = !m.d && s.b[m.t[0]][m.t[1]]; return [(cap ? (cap.p ? PVAL[cap.t] : VAL[cap.t]) * 10 : 0) + (m.pr ? 5 : 0) - (m.d ? 1 : 0), m]; }).sort(function (a, b) { return b[0] - a[0]; }).map(function (x) { return x[1]; }); }
  var deadline = 0;
  function search(s, d, a, be) { if (Date.now() > deadline) return evalS(s) * s.turn;
    var ms = legal(s, d < 2); if (!ms.length) { if (!legal(s).length) return -1e5 - d; } if (!d) return evalS(s) * s.turn;
    ms = ordered(s, ms); if (ms.length > 40) ms = ms.slice(0, 40);
    for (var i = 0; i < ms.length; i++) { var v = -search(make(s, ms[i]), d - 1, -be, -a); if (v > a) a = v; if (a >= be) break; } return a; }
  var COLS = '９８７６５４３２１', ROWS = '一二三四五六七八九';
  BG.shogi = { _t: { init: init, legal: legal, make: make, inCheck: inCheck }, name: '将棋', sides: [['1', 'あなたが先手（▲）'], ['-1', 'あなたが後手（△）']],
    rules: '駒をえらぶと、動けるマスに印が出ます。取った駒は持ち駒になり、自分の番に盤の空いているマスに打てます。敵陣（相手側の3段）に入ったり出たりすると「成る」かえらべます。相手の玉をどこにも逃げられなくしたら勝ち。二歩・打ち歩詰め・行きどころのない駒はできません。',
    mount: function (el, ui) {
      var s = init(), me = +ui.side() || 1, sel = null, drop = null, over = false, last = null, ply = 0, flip = me < 0;
      var hc = document.createElement('div'), hm = document.createElement('div'); [hc, hm].forEach(function (h) { h.style.cssText = 'display:flex;flex-wrap:wrap;gap:4px;min-height:40px;align-items:center;width:min(94vw,520px)'; });
      var g = document.createElement('div'); g.className = 'grid'; g.style.cssText = 'grid-template-columns:repeat(9,1fr);width:min(94vw,520px);aspect-ratio:1;background:#e8c27a;border:6px solid #8a5a20;gap:1px;padding:1px;font-family:"Hiragino Mincho ProN","Yu Mincho","Noto Serif JP",serif';
      var cells = []; for (var i = 0; i < 81; i++) { var c = document.createElement('button'); c.type = 'button'; c.className = 'cell'; c.style.cssText = 'background:#f2d08f;color:#111;font-size:min(5.6vw,30px);font-weight:bold';
        (function (k) { c.addEventListener('click', function () { var r = k / 9 | 0, cc = k % 9; if (flip) { r = 8 - r; cc = 8 - cc; } tap(r, cc); }); })(i); g.appendChild(c); cells.push(c); }
      el.appendChild(hc); el.appendChild(g); el.appendChild(hm);
      function legalNow() { return legal(s); }
      function hand(box, o, label) { box.textContent = ''; var t = document.createElement('span'); t.style.cssText = 'font-size:13px;color:var(--sub);margin-right:4px'; t.textContent = label; box.appendChild(t);
        HANDS.forEach(function (k) { var n = s.h[o][k]; if (!n) return; var b = document.createElement('button'); b.type = 'button'; b.className = 'btn'; b.textContent = KANJI[k][0] + (n > 1 ? '×' + n : '');
          if (o === me) { if (drop === k) b.style.background = '#ffd23f', b.style.color = '#000'; b.addEventListener('click', function () { if (over || s.turn !== me) return; drop = drop === k ? null : k; sel = null; draw(); }); } else b.disabled = true; box.appendChild(b); });
        if (box.children.length === 1) { var e = document.createElement('span'); e.style.cssText = 'font-size:13px;color:#776'; e.textContent = 'なし'; box.appendChild(e); } }
      function draw() { var ms = (sel || drop) && s.turn === me ? legalNow().filter(function (m) { return drop ? m.d === drop : !m.d && m.f[0] === sel[0] && m.f[1] === sel[1]; }) : [], tos = {}; ms.forEach(function (m) { tos[m.t[0] + ',' + m.t[1]] = 1; });
        cells.forEach(function (c, k) { var r = k / 9 | 0, cc = k % 9; if (flip) { r = 8 - r; cc = 8 - cc; } var p = s.b[r][cc];
          c.className = 'cell' + (sel && sel[0] === r && sel[1] === cc ? ' sel' : '') + ((r + ',' + cc) in tos ? ' to' : '') + (last && last[0] === r && last[1] === cc ? ' last' : '');
          c.textContent = p ? KANJI[p.t][p.p ? 1 : 0] : ''; c.style.color = p && p.p ? '#c00' : '#111'; c.style.transform = p && p.o !== me ? 'rotate(180deg)' : 'none';
          c.setAttribute('aria-label', COLS[cc] + ROWS[r] + (p ? ' ' + (p.o === me ? 'あなたの' : 'CPUの') + KANJI[p.t][p.p ? 1 : 0] : '')); });
        hand(hc, -me, 'CPU の持ち駒'); hand(hm, me, 'あなたの持ち駒'); }
      function after() { ply++; draw(); var ms = legalNow();
        if (!ms.length) { over = true; var w = s.turn !== me; ui.status((inCheck(s, s.turn) ? '詰み！ ' : '指せる手がありません。') + (w ? 'あなたの勝ち！' : 'CPU の勝ち…'), w ? 'win' : 'lose'); ui.ga('board_game_end', { game: 'shogi', result: w ? 'win' : 'lose' }); return true; }
        if (ply >= 400) { over = true; ui.status('手数が長くなったので引き分け'); return true; }
        if (s.turn === me) ui.status(inCheck(s, me) ? '王手！ あなたの番です' : 'あなたの番です', inCheck(s, me) ? 'lose' : ''); else ui.status(inCheck(s, -me) ? '王手！ CPU が考え中…' : 'CPU が考え中…');
        return false; }
      function play(m) { s = make(s, m); last = m.t; sel = null; drop = null; if (after()) return; if (s.turn !== me) ui.later(cpu, 200); }
      function tap(r, c) { if (over || s.turn !== me) return; var ms = legalNow();
        if (drop) { var dm = ms.filter(function (m) { return m.d === drop && m.t[0] === r && m.t[1] === c; })[0]; if (dm) return play(dm); drop = null; }
        if (sel) { var cand = ms.filter(function (m) { return !m.d && m.f[0] === sel[0] && m.f[1] === sel[1] && m.t[0] === r && m.t[1] === c; });
          if (cand.length === 1) return play(cand[0]); if (cand.length === 2) return ask(cand); }
        var p = s.b[r][c]; sel = p && p.o === me ? [r, c] : null; draw(); }
      function ask(cand) { var box = document.createElement('div'); box.style.cssText = 'display:flex;gap:8px;align-items:center'; box.appendChild(document.createTextNode('成りますか？'));
        [[true, '成る'], [false, '成らない']].forEach(function (x) { var b = document.createElement('button'); b.type = 'button'; b.className = 'btn' + (x[0] ? ' y' : ''); b.textContent = x[1];
          b.addEventListener('click', function () { box.remove(); play(cand.filter(function (m) { return m.pr === x[0]; })[0]); }); box.appendChild(b); }); el.insertBefore(box, hm); }
      function cpu() { if (over) return; var lvl = ui.level(), ms = ordered(s, legalNow()), best = ms[0], bv = -1e9, d = lvl === 1 ? 1 : lvl === 2 ? 2 : 3;
        deadline = Date.now() + (lvl === 3 ? 2500 : 1500);
        for (var i = 0; i < ms.length; i++) { var v = -search(make(s, ms[i]), d - 1, -1e9, 1e9) + Math.random() * (lvl === 1 ? 3 : .3); if (v > bv) { bv = v; best = ms[i]; } }
        play(best); }
      draw(); if (me === 1) ui.status('あなたの番です（▲先手）'); else { ui.status('CPU が考え中…'); ui.later(cpu, 300); }
      return { destroy: function () { over = true; } };
    } };
})();
