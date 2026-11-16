/* 四目ならべ（7列×6段・下から積む） */
(function () {
  var C = 7, R = 6;
  function drop(b, col) { for (var r = R - 1; r >= 0; r--) if (!b[r][col]) return r; return -1; }
  function win(b, p) { for (var r = 0; r < R; r++) for (var c = 0; c < C; c++) { if (b[r][c] !== p) continue; var D = [[0, 1], [1, 0], [1, 1], [1, -1]];
    for (var k = 0; k < 4; k++) { var ok = true; for (var n = 1; n < 4; n++) { var rr = r + D[k][0] * n, cc = c + D[k][1] * n; if (rr < 0 || rr >= R || cc < 0 || cc >= C || b[rr][cc] !== p) { ok = false; break; } } if (ok) return true; } } return false; }
  function evalW(w, p) { var m = 0, o = 0, e = 0; w.forEach(function (v) { if (v === p) m++; else if (v) o++; else e++; }); if (m === 4) return 1000; if (m === 3 && e === 1) return 6; if (m === 2 && e === 2) return 2; if (o === 3 && e === 1) return -5; return 0; }
  function evalB(b, p) { var s = 0; for (var r = 0; r < R; r++) s += (b[r][3] === p ? 3 : 0);
    for (r = 0; r < R; r++) for (var c = 0; c < C; c++) { if (c + 3 < C) s += evalW([b[r][c], b[r][c + 1], b[r][c + 2], b[r][c + 3]], p); if (r + 3 < R) s += evalW([b[r][c], b[r + 1][c], b[r + 2][c], b[r + 3][c]], p);
      if (r + 3 < R && c + 3 < C) s += evalW([b[r][c], b[r + 1][c + 1], b[r + 2][c + 2], b[r + 3][c + 3]], p); if (r - 3 >= 0 && c + 3 < C) s += evalW([b[r][c], b[r - 1][c + 1], b[r - 2][c + 2], b[r - 3][c + 3]], p); } return s; }
  var ORDER = [3, 2, 4, 1, 5, 0, 6];
  function ab(b, d, a, be, p, ai) { var me = 3 - ai; if (win(b, ai)) return 1e6 + d; if (win(b, me)) return -1e6 - d;
    var ms = ORDER.filter(function (c) { return drop(b, c) >= 0; }); if (!d || !ms.length) return evalB(b, ai);
    if (p === ai) { var v = -1e9; for (var i = 0; i < ms.length; i++) { var r = drop(b, ms[i]); b[r][ms[i]] = p; v = Math.max(v, ab(b, d - 1, a, be, 3 - p, ai)); b[r][ms[i]] = 0; a = Math.max(a, v); if (a >= be) break; } return v; }
    v = 1e9; for (i = 0; i < ms.length; i++) { r = drop(b, ms[i]); b[r][ms[i]] = p; v = Math.min(v, ab(b, d - 1, a, be, 3 - p, ai)); b[r][ms[i]] = 0; be = Math.min(be, v); if (a >= be) break; } return v; }
  BG.connect4 = { name: '四目ならべ', sides: [['1', 'あなたが赤（先手）'], ['2', 'あなたが黄（後手）']], rules: '列をえらぶと、いちばん下まで石が落ちます。たて・よこ・ななめに4つそろえたら勝ち。',
    mount: function (el, ui) {
      var b = []; for (var r = 0; r < R; r++) b.push([0, 0, 0, 0, 0, 0, 0]);
      var me = +ui.side() || 1, ai = 3 - me, turn = 1, over = false;
      var g = document.createElement('div'); g.className = 'grid'; g.style.cssText = 'grid-template-columns:repeat(7,1fr);width:min(94vw,470px);aspect-ratio:7/6;background:#1846c8;border-radius:12px;padding:6px;gap:4px';
      var cells = []; for (var i = 0; i < R * C; i++) { var c = document.createElement('button'); c.type = 'button'; c.className = 'cell'; c.style.cssText = 'background:#0b1e5a;border-radius:50%';
        (function (k) { c.addEventListener('click', function () { tap(k % C); }); })(i); c.setAttribute('aria-label', (i % C + 1) + '列目'); g.appendChild(c); cells.push(c); }
      el.appendChild(g);
      function draw() { cells.forEach(function (c, k) { var v = b[k / C | 0][k % C]; c.textContent = ''; if (v) { var s = document.createElement('span'); s.className = 'stone ' + (v === 1 ? 'r' : 'yl'); c.appendChild(s); } }); }
      function after(p) { draw(); if (win(b, p)) { over = true; var w = p === me; ui.status(w ? 'あなたの勝ち！' : 'CPU の勝ち…', w ? 'win' : 'lose'); ui.ga('board_game_end', { game: 'connect4', result: w ? 'win' : 'lose' }); return true; }
        if (b[0].every(Boolean)) { over = true; ui.status('引き分け'); return true; } return false; }
      function tap(col) { if (over || turn !== me) return; var r = drop(b, col); if (r < 0) return; b[r][col] = me; if (after(me)) return; turn = ai; ui.status('CPU が考え中…'); ui.later(cpu, 250); }
      function cpu() { var lvl = ui.level(), d = lvl === 1 ? 2 : lvl === 2 ? 5 : 7, best = 3, bv = -1e12;
        ORDER.forEach(function (c) { var r = drop(b, c); if (r < 0) return; b[r][c] = ai; var v = ab(b, d - 1, -1e12, 1e12, me, ai) + Math.random() * (lvl === 1 ? 30 : 1); b[r][c] = 0; if (v > bv) { bv = v; best = c; } });
        b[drop(b, best)][best] = ai; if (!after(ai)) { turn = me; ui.status('あなたの番です'); } }
      draw(); if (me === 1) ui.status('あなたの番です（赤）'); else { turn = ai; ui.later(cpu, 250); }
      return { destroy: function () { over = true; } };
    } };
})();
