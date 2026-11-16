/* チェス（キャスリング・アンパッサン・昇格あり。50手ルールなどは省略） */
(function () {
  var V = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 0 };
  var PST = { p: [0, 0, 0, 0, 0, 0, 0, 0, 50, 50, 50, 50, 50, 50, 50, 50, 10, 10, 20, 30, 30, 20, 10, 10, 5, 5, 10, 25, 25, 10, 5, 5, 0, 0, 0, 20, 20, 0, 0, 0, 5, -5, -10, 0, 0, -10, -5, 5, 5, 10, 10, -20, -20, 10, 10, 5, 0, 0, 0, 0, 0, 0, 0, 0],
    n: [-50, -40, -30, -30, -30, -30, -40, -50, -40, -20, 0, 0, 0, 0, -20, -40, -30, 0, 10, 15, 15, 10, 0, -30, -30, 5, 15, 20, 20, 15, 5, -30, -30, 0, 15, 20, 20, 15, 0, -30, -30, 5, 10, 15, 15, 10, 5, -30, -40, -20, 0, 5, 5, 0, -20, -40, -50, -40, -30, -30, -30, -30, -40, -50] };
  var G = { K: '♚', Q: '♛', R: '♜', B: '♝', N: '♞', P: '♟', k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' }; // 白黒とも塗りの駒にして、色で分ける
  function white(p) { return p && p === p.toUpperCase(); }
  function side(p) { return !p ? 0 : white(p) ? 1 : -1; }
  function init() { var r = 'rnbqkbnr'.split(''); return { b: [r, 'pppppppp'.split(''), [], [], [], [], 'PPPPPPPP'.split(''), r.map(function (x) { return x.toUpperCase(); })].map(function (row) { var o = []; for (var i = 0; i < 8; i++) o.push(row[i] || ''); return o; }),
    turn: 1, cast: { K: 1, Q: 1, k: 1, q: 1 }, ep: null }; }
  function clone(s) { return { b: s.b.map(function (r) { return r.slice(); }), turn: s.turn, cast: { K: s.cast.K, Q: s.cast.Q, k: s.cast.k, q: s.cast.q }, ep: s.ep }; }
  function attacked(b, r, c, by) { // マス (r,c) が by 側から利いているか
    var pr = by > 0 ? r + 1 : r - 1; for (var dc = -1; dc <= 1; dc += 2) { var x = b[pr] && b[pr][c + dc]; if (x && x.toLowerCase() === 'p' && side(x) === by) return true; }
    var KN = [[1, 2], [2, 1], [-1, 2], [-2, 1], [1, -2], [2, -1], [-1, -2], [-2, -1]]; for (var i = 0; i < 8; i++) { x = b[r + KN[i][0]] && b[r + KN[i][0]][c + KN[i][1]]; if (x && x.toLowerCase() === 'n' && side(x) === by) return true; }
    for (var dr = -1; dr <= 1; dr++) for (dc = -1; dc <= 1; dc++) { if (!dr && !dc) continue; x = b[r + dr] && b[r + dr][c + dc]; if (x && x.toLowerCase() === 'k' && side(x) === by) return true;
      var rr = r + dr, cc = c + dc; while (rr >= 0 && rr < 8 && cc >= 0 && cc < 8) { x = b[rr][cc]; if (x) { if (side(x) === by) { var t = x.toLowerCase(); if (t === 'q' || (t === 'r' && (!dr || !dc)) || (t === 'b' && dr && dc)) return true; } break; } rr += dr; cc += dc; } }
    return false; }
  function king(b, s) { for (var r = 0; r < 8; r++) for (var c = 0; c < 8; c++) if (b[r][c] === (s > 0 ? 'K' : 'k')) return [r, c]; return null; }
  function inCheck(st, s) { var k = king(st.b, s); return k ? attacked(st.b, k[0], k[1], -s) : false; }
  function pseudo(st) { var b = st.b, s = st.turn, out = [];
    function add(r, c, r2, c2, extra) { out.push({ f: [r, c], t: [r2, c2], x: extra || null }); }
    for (var r = 0; r < 8; r++) for (var c = 0; c < 8; c++) { var p = b[r][c]; if (side(p) !== s) continue; var t = p.toLowerCase();
      if (t === 'p') { var d = s > 0 ? -1 : 1, start = s > 0 ? 6 : 1;
        if (!b[r + d][c]) { add(r, c, r + d, c); if (r === start && !b[r + 2 * d][c]) add(r, c, r + 2 * d, c, 'dbl'); }
        for (var dc = -1; dc <= 1; dc += 2) { var cc = c + dc; if (cc < 0 || cc > 7) continue; if (b[r + d][cc] && side(b[r + d][cc]) === -s) add(r, c, r + d, cc); if (st.ep && st.ep[0] === r + d && st.ep[1] === cc) add(r, c, r + d, cc, 'ep'); } }
      else if (t === 'n' || t === 'k') { var D = t === 'n' ? [[1, 2], [2, 1], [-1, 2], [-2, 1], [1, -2], [2, -1], [-1, -2], [-2, -1]] : [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
        D.forEach(function (q) { var a = r + q[0], e = c + q[1]; if (a >= 0 && a < 8 && e >= 0 && e < 8 && side(b[a][e]) !== s) add(r, c, a, e); });
        if (t === 'k') { var row = s > 0 ? 7 : 0, K = s > 0 ? 'K' : 'k', Q = s > 0 ? 'Q' : 'q';
          if (r === row && c === 4 && !inCheck(st, s)) {
            if (st.cast[K] && !b[row][5] && !b[row][6] && b[row][7].toLowerCase() === 'r' && !attacked(b, row, 5, -s) && !attacked(b, row, 6, -s)) add(r, c, row, 6, 'oo');
            if (st.cast[Q] && !b[row][3] && !b[row][2] && !b[row][1] && b[row][0].toLowerCase() === 'r' && !attacked(b, row, 3, -s) && !attacked(b, row, 2, -s)) add(r, c, row, 2, 'ooo'); } } }
      else { var DD = t === 'r' ? [[1, 0], [-1, 0], [0, 1], [0, -1]] : t === 'b' ? [[1, 1], [1, -1], [-1, 1], [-1, -1]] : [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
        DD.forEach(function (q) { var a = r + q[0], e = c + q[1]; while (a >= 0 && a < 8 && e >= 0 && e < 8) { if (side(b[a][e]) === s) break; add(r, c, a, e); if (b[a][e]) break; a += q[0]; e += q[1]; } }); } }
    return out; }
  function make(st, m, promo) { var n = clone(st), b = n.b, p = b[m.f[0]][m.f[1]], s = st.turn;
    b[m.t[0]][m.t[1]] = p; b[m.f[0]][m.f[1]] = '';
    if (m.x === 'ep') b[m.f[0]][m.t[1]] = '';
    if (m.x === 'oo') { b[m.t[0]][5] = b[m.t[0]][7]; b[m.t[0]][7] = ''; } if (m.x === 'ooo') { b[m.t[0]][3] = b[m.t[0]][0]; b[m.t[0]][0] = ''; }
    if (p.toLowerCase() === 'p' && (m.t[0] === 0 || m.t[0] === 7)) b[m.t[0]][m.t[1]] = s > 0 ? (promo || 'Q') : (promo || 'q').toLowerCase();
    n.ep = m.x === 'dbl' ? [(m.f[0] + m.t[0]) / 2, m.f[1]] : null;
    if (p === 'K') n.cast.K = n.cast.Q = 0; if (p === 'k') n.cast.k = n.cast.q = 0;
    [[7, 0, 'Q'], [7, 7, 'K'], [0, 0, 'q'], [0, 7, 'k']].forEach(function (x) { if ((m.f[0] === x[0] && m.f[1] === x[1]) || (m.t[0] === x[0] && m.t[1] === x[1])) n.cast[x[2]] = 0; });
    n.turn = -s; return n; }
  function legal(st) { return pseudo(st).filter(function (m) { return !inCheck(make(st, m), st.turn); }); }
  function evalS(st) { var s = 0; for (var r = 0; r < 8; r++) for (var c = 0; c < 8; c++) { var p = st.b[r][c]; if (!p) continue; var t = p.toLowerCase(), w = white(p);
    var v = V[t] + (PST[t] ? PST[t][w ? r * 8 + c : (7 - r) * 8 + c] : 0); s += w ? v : -v; } return s; }
  function order(st, ms) { return ms.map(function (m) { var cap = st.b[m.t[0]][m.t[1]]; return [cap ? V[cap.toLowerCase()] * 10 - V[st.b[m.f[0]][m.f[1]].toLowerCase()] : 0, m]; }).sort(function (a, b) { return b[0] - a[0]; }).map(function (x) { return x[1]; }); }
  function search(st, d, a, be) { var ms = legal(st); if (!ms.length) return inCheck(st, st.turn) ? -1e6 - d : 0; if (!d) return evalS(st) * st.turn;
    ms = order(st, ms); for (var i = 0; i < ms.length; i++) { var v = -search(make(st, ms[i]), d - 1, -be, -a); if (v > a) a = v; if (a >= be) break; } return a; }
  function name(r, c) { return 'abcdefgh'[c] + (8 - r); }
  var T = { init: init, legal: legal, make: make, inCheck: inCheck };
  BG.chess = { _t: T, name: 'チェス', sides: [['w', 'あなたが白（先手）'], ['b', 'あなたが黒（後手）']], rules: '駒をえらぶと、動けるマスに印が出ます。相手のキングを、どこにも逃げられない形（チェックメイト）にしたら勝ち。キャスリング・アンパッサン・ポーン昇格（クイーンなどを選べます）もあります。',
    mount: function (el, ui) {
      var st = init(), me = ui.side() === 'b' ? -1 : 1, sel = null, over = false, last = null, flip = me < 0;
      var g = document.createElement('div'); g.className = 'grid'; g.style.cssText = 'grid-template-columns:repeat(8,1fr);width:min(94vw,500px);aspect-ratio:1;border:6px solid #3a2a1a;font-size:min(9vw,52px);line-height:1';
      var cells = []; for (var i = 0; i < 64; i++) { var c = document.createElement('button'); c.type = 'button'; c.className = 'cell'; (function (k) { c.addEventListener('click', function () { var r = k / 8 | 0, cc = k % 8; if (flip) { r = 7 - r; cc = 7 - cc; } tap(r, cc); }); })(i); g.appendChild(c); cells.push(c); }
      el.appendChild(g);
      function draw() { var ms = sel ? legal(st).filter(function (m) { return m.f[0] === sel[0] && m.f[1] === sel[1]; }) : [], tos = {}; ms.forEach(function (m) { tos[m.t[0] + ',' + m.t[1]] = !!st.b[m.t[0]][m.t[1]] || m.x === 'ep'; });
        cells.forEach(function (c, k) { var r = k / 8 | 0, cc = k % 8; if (flip) { r = 7 - r; cc = 7 - cc; } var p = st.b[r][cc];
          c.style.background = (r + cc) % 2 ? '#b58863' : '#f0d9b5'; c.className = 'cell' + (sel && sel[0] === r && sel[1] === cc ? ' sel' : '') + ((r + ',' + cc) in tos ? ' to' + (tos[r + ',' + cc] ? ' cap' : '') : '') + (last && ((last.f[0] === r && last.f[1] === cc) || (last.t[0] === r && last.t[1] === cc)) ? ' last' : '');
          c.textContent = p ? G[p] + '︎' : ''; c.style.color = p ? (white(p) ? '#fff' : '#111') : ''; c.style.textShadow = p && white(p) ? '0 0 1px #000,0 0 1px #000,0 0 2px #000' : '0 0 1px #fff8';
          c.setAttribute('aria-label', name(r, cc) + (p ? ' ' + p : '')); }); }
      function finish() { var ms = legal(st); if (ms.length) { if (inCheck(st, st.turn)) ui.status((st.turn === me ? 'チェック！ あなたの番です' : 'チェック！'), st.turn === me ? 'lose' : ''); return false; }
        over = true; draw(); if (inCheck(st, st.turn)) { var w = st.turn !== me; ui.status('チェックメイト！ ' + (w ? 'あなたの勝ち！' : 'CPU の勝ち…'), w ? 'win' : 'lose'); ui.ga('board_game_end', { game: 'chess', result: w ? 'win' : 'lose' }); }
        else ui.status('ステイルメイト（引き分け）'); return true; }
      function move(m, promo) { st = make(st, m, promo); last = m; sel = null; draw(); if (finish()) return; if (st.turn !== me) { if (!inCheck(st, st.turn)) ui.status('CPU が考え中…'); ui.later(cpu, 300); } else if (!inCheck(st, st.turn)) ui.status('あなたの番です'); }
      function tap(r, c) { if (over || st.turn !== me) return; var p = st.b[r][c];
        if (sel) { var m = legal(st).filter(function (x) { return x.f[0] === sel[0] && x.f[1] === sel[1] && x.t[0] === r && x.t[1] === c; })[0];
          if (m) { var pc = st.b[m.f[0]][m.f[1]].toLowerCase(); if (pc === 'p' && (r === 0 || r === 7)) return ask(m); return move(m); } }
        sel = side(p) === me ? [r, c] : null; draw(); }
      function ask(m) { var box = document.createElement('div'); box.style.cssText = 'display:flex;gap:6px;align-items:center'; box.appendChild(document.createTextNode('昇格：'));
        [['Q', 'クイーン'], ['R', 'ルーク'], ['B', 'ビショップ'], ['N', 'ナイト']].forEach(function (x) { var b = document.createElement('button'); b.type = 'button'; b.className = 'btn'; b.textContent = x[1]; b.addEventListener('click', function () { box.remove(); move(m, x[0]); }); box.appendChild(b); });
        el.appendChild(box); }
      function cpu() { if (over) return; var lvl = ui.level(), ms = order(st, legal(st)), best = ms[0], bv = -1e9, d = lvl === 1 ? 1 : lvl === 2 ? 2 : 3;
        ms.forEach(function (m) { var v = -search(make(st, m), d - 1, -1e9, 1e9) + Math.random() * (lvl === 1 ? 80 : 8); if (v > bv) { bv = v; best = m; } }); move(best); }
      draw(); if (me === 1) ui.status('あなたの番です（白）'); else ui.later(cpu, 300);
      return { destroy: function () { over = true; } };
    } };
})();
