/* リバーシ（8×8） */
(function () {
  var W = [[100, -20, 10, 5, 5, 10, -20, 100], [-20, -50, -2, -2, -2, -2, -50, -20], [10, -2, 1, 1, 1, 1, -2, 10], [5, -2, 1, 0, 0, 1, -2, 5], [5, -2, 1, 0, 0, 1, -2, 5], [10, -2, 1, 1, 1, 1, -2, 10], [-20, -50, -2, -2, -2, -2, -50, -20], [100, -20, 10, 5, 5, 10, -20, 100]];
  var D = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
  function flips(b, x, y, c) { if (b[y][x]) return []; var all = []; D.forEach(function (d) { var r = [], i = x + d[0], j = y + d[1];
    while (i >= 0 && i < 8 && j >= 0 && j < 8 && b[j][i] === -c) { r.push([i, j]); i += d[0]; j += d[1]; }
    if (r.length && i >= 0 && i < 8 && j >= 0 && j < 8 && b[j][i] === c) all = all.concat(r); }); return all; }
  function moves(b, c) { var m = []; for (var y = 0; y < 8; y++) for (var x = 0; x < 8; x++) { var f = flips(b, x, y, c); if (f.length) m.push([x, y, f]); } return m; }
  function play(b, m, c) { var n = b.map(function (r) { return r.slice(); }); n[m[1]][m[0]] = c; m[2].forEach(function (p) { n[p[1]][p[0]] = c; }); return n; }
  function evalB(b, c) { var s = 0, cnt = 0; for (var y = 0; y < 8; y++) for (var x = 0; x < 8; x++) { s += b[y][x] * c * W[y][x]; if (b[y][x]) cnt++; }
    return s + (moves(b, c).length - moves(b, -c).length) * (cnt < 50 ? 4 : 0); }
  function search(b, c, d, a, be) { var ms = moves(b, c); if (!d) return evalB(b, c); if (!ms.length) { if (!moves(b, -c).length) { var t = 0; b.forEach(function (r) { r.forEach(function (v) { t += v * c; }); }); return t * 1000; } return -search(b, -c, d - 1, -be, -a); }
    for (var i = 0; i < ms.length; i++) { var v = -search(play(b, ms[i], c), -c, d - 1, -be, -a); if (v > a) a = v; if (a >= be) break; } return a; }
  BG.reversi = { name: 'リバーシ', sides: [['b', 'あなたが黒（先手）'], ['w', 'あなたが白（後手）']], rules: 'はさんだ相手の石をひっくり返します。置ける場所がないときはパス。最後に石が多いほうの勝ち。うすい丸が置ける場所です。',
    mount: function (el, ui) {
      var b = []; for (var y = 0; y < 8; y++) b.push([0, 0, 0, 0, 0, 0, 0, 0]); b[3][3] = b[4][4] = -1; b[3][4] = b[4][3] = 1;
      var me = ui.side() === 'w' ? -1 : 1, turn = 1, last = null, busy = false, over = false;
      var g = document.createElement('div'); g.className = 'grid'; g.style.cssText = 'grid-template-columns:repeat(8,1fr);width:min(92vw,480px);aspect-ratio:1;background:#1b7a3e;border:6px solid #0d3d1f;border-radius:6px;gap:2px;padding:2px';
      var cells = []; for (var i = 0; i < 64; i++) { var c = document.createElement('button'); c.type = 'button'; c.className = 'cell'; c.style.background = '#249a50'; (function (k) { c.addEventListener('click', function () { tap(k % 8, k / 8 | 0); }); })(i); g.appendChild(c); cells.push(c); }
      el.appendChild(g);
      function count() { var B = 0, Wt = 0; b.forEach(function (r) { r.forEach(function (v) { if (v === 1) B++; if (v === -1) Wt++; }); }); return [B, Wt]; }
      function draw() { var ms = turn === me && !over ? moves(b, me) : [], hint = {}; ms.forEach(function (m) { hint[m[0] + ',' + m[1]] = 1; });
        cells.forEach(function (c, k) { var x = k % 8, y = k / 8 | 0; c.textContent = ''; c.className = 'cell' + (hint[x + ',' + y] ? ' hint' : '') + (last && last[0] === x && last[1] === y ? ' last' : '');
          c.setAttribute('aria-label', String.fromCharCode(97 + x) + (y + 1) + (b[y][x] ? (b[y][x] === 1 ? ' 黒' : ' 白') : ''));
          if (b[y][x]) { var s = document.createElement('span'); s.className = 'stone ' + (b[y][x] === 1 ? 'b' : 'w'); c.appendChild(s); } });
        var n = count(); if (!over) ui.status('黒 ' + n[0] + ' − 白 ' + n[1] + '　' + (turn === me ? 'あなたの番です' : 'CPU が考え中…')); }
      function next() {
        turn = -turn;
        if (!moves(b, turn).length) { if (!moves(b, -turn).length) return end(); ui.status((turn === me ? 'あなた' : 'CPU') + 'は置ける場所がないのでパス'); turn = -turn; }
        draw(); if (turn !== me) { busy = true; ui.later(cpu, 450); }
      }
      function end() { over = true; draw(); var n = count(), mine = me === 1 ? n[0] : n[1], his = me === 1 ? n[1] : n[0];
        ui.status('黒 ' + n[0] + ' − 白 ' + n[1] + '　' + (mine > his ? 'あなたの勝ち！' : mine < his ? 'CPU の勝ち…' : '引き分け'), mine > his ? 'win' : mine < his ? 'lose' : ''); ui.ga('board_game_end', { game: 'reversi', result: mine > his ? 'win' : mine < his ? 'lose' : 'draw' }); }
      function tap(x, y) { if (busy || over || turn !== me) return; var f = flips(b, x, y, me); if (!f.length) return; b = play(b, [x, y, f], me); last = [x, y]; next(); }
      function cpu() { var ms = moves(b, turn), lvl = ui.level(), best = ms[0], bv = -1e9;
        ms.forEach(function (m) { var v = lvl === 1 ? W[m[1]][m[0]] + Math.random() * 60 : -search(play(b, m, turn), -turn, lvl === 2 ? 2 : 4, -1e9, 1e9) + Math.random(); if (v > bv) { bv = v; best = m; } });
        b = play(b, best, turn); last = [best[0], best[1]]; busy = false; next(); }
      turn = -1; next();
      return { destroy: function () { over = true; } };
    } };
})();
