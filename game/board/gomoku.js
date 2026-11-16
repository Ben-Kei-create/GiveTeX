/* 五目ならべ（15×15・禁じ手なし） */
(function () {
  var N = 15, D = [[1, 0], [0, 1], [1, 1], [1, -1]];
  function line(b, x, y, c) { var best = 0; D.forEach(function (d) { var n = 1; for (var s = -1; s <= 1; s += 2) { var i = x + d[0] * s, j = y + d[1] * s; while (i >= 0 && i < N && j >= 0 && j < N && b[j][i] === c) { n++; i += d[0] * s; j += d[1] * s; } } if (n > best) best = n; }); return best; }
  function score(b, x, y, c) { var t = 0; D.forEach(function (d) { var n = 1, open = 0; for (var s = -1; s <= 1; s += 2) { var i = x + d[0] * s, j = y + d[1] * s; while (i >= 0 && i < N && j >= 0 && j < N && b[j][i] === c) { n++; i += d[0] * s; j += d[1] * s; } if (i >= 0 && i < N && j >= 0 && j < N && !b[j][i]) open++; }
    t += n >= 5 ? 1e6 : n === 4 ? (open === 2 ? 5e4 : open ? 4e3 : 0) : n === 3 ? (open === 2 ? 3e3 : open ? 300 : 0) : n === 2 ? (open === 2 ? 120 : open ? 20 : 0) : open; }); return t; }
  BG.gomoku = { name: '五目ならべ', sides: [['b', 'あなたが黒（先手）'], ['w', 'あなたが白（後手）']], rules: 'たて・よこ・ななめのどれかに、自分の石を5つ以上ならべたら勝ち。このゲームでは禁じ手はありません。',
    mount: function (el, ui) {
      var b = []; for (var y = 0; y < N; y++) { b.push([]); for (var x = 0; x < N; x++) b[y].push(0); }
      var me = ui.side() === 'w' ? 2 : 1, ai = 3 - me, turn = 1, over = false, last = null, moves = 0;
      var g = document.createElement('div'); g.className = 'grid'; g.style.cssText = 'grid-template-columns:repeat(15,1fr);width:min(94vw,540px);aspect-ratio:1;background:#d9a85b;border:6px solid #8a5a20;border-radius:4px;' +
        'background-image:linear-gradient(#5a3a10 1px,transparent 1px),linear-gradient(90deg,#5a3a10 1px,transparent 1px);background-size:calc(100%/15) calc(100%/15);background-position:calc(50%/15) calc(50%/15)';
      var cells = []; for (var i = 0; i < N * N; i++) { var c = document.createElement('button'); c.type = 'button'; c.className = 'cell'; (function (k) { c.addEventListener('click', function () { tap(k % N, k / N | 0); }); })(i); g.appendChild(c); cells.push(c); }
      el.appendChild(g);
      function put(x, y, c) { b[y][x] = c; last = [x, y]; moves++; var cell = cells[y * N + x], s = document.createElement('span'); s.className = 'stone ' + (c === 1 ? 'b' : 'w'); cell.appendChild(s);
        cells.forEach(function (q) { q.classList.remove('last'); }); cell.classList.add('last');
        if (line(b, x, y, c) >= 5) { over = true; var w = c === me; ui.status(w ? 'あなたの勝ち！' : 'CPU の勝ち…', w ? 'win' : 'lose'); ui.ga('board_game_end', { game: 'gomoku', result: w ? 'win' : 'lose' }); return true; }
        if (moves >= N * N) { over = true; ui.status('引き分け'); return true; } return false; }
      function tap(x, y) { if (over || turn !== me || b[y][x]) return; if (put(x, y, me)) return; turn = ai; ui.status('CPU が考え中…'); ui.later(cpu, 300); }
      function cpu() { var best = null, bv = -1, lvl = ui.level();
        for (var y = 0; y < N; y++) for (var x = 0; x < N; x++) { if (b[y][x]) continue; var near = false; for (var j = -2; j <= 2 && !near; j++) for (var i = -2; i <= 2; i++) { var q = b[y + j] && b[y + j][x + i]; if (q) { near = true; break; } }
          if (!near && moves) continue; var v = score(b, x, y, ai) * (lvl === 3 ? 1.1 : 1) + score(b, x, y, me) * (lvl === 1 ? .5 : 1) + Math.random() * (lvl === 1 ? 200 : 8); if (v > bv) { bv = v; best = [x, y]; } }
        if (!best) best = [7, 7]; if (!put(best[0], best[1], ai)) { turn = me; ui.status('あなたの番です'); } }
      if (me === 1) ui.status('あなたの番です（黒）'); else { turn = ai; ui.later(cpu, 300); }
      return { destroy: function () { over = true; } };
    } };
})();
