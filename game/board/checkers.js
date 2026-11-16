/* チェッカー（8×8、取れるときは必ず取る、連続ジャンプあり、奥まで行くとキング） */
(function () {
  // 1=あなた(赤) 2=あなたのキング -1=CPU(黒) -2=CPUのキング
  function own(v, p) { return p > 0 ? v > 0 : v < 0; }
  function dirs(v) { return Math.abs(v) === 2 ? [[1, 1], [1, -1], [-1, 1], [-1, -1]] : v > 0 ? [[-1, 1], [-1, -1]] : [[1, 1], [1, -1]]; }
  function jumps(b, r, c) { var v = b[r][c], out = []; dirs(v).forEach(function (d) { var r1 = r + d[0], c1 = c + d[1], r2 = r + 2 * d[0], c2 = c + 2 * d[1];
    if (r2 >= 0 && r2 < 8 && c2 >= 0 && c2 < 8 && b[r1][c1] && !own(b[r1][c1], v) && !b[r2][c2]) out.push([r, c, r2, c2, r1, c1]); }); return out; }
  function steps(b, r, c) { var out = []; dirs(b[r][c]).forEach(function (d) { var r1 = r + d[0], c1 = c + d[1]; if (r1 >= 0 && r1 < 8 && c1 >= 0 && c1 < 8 && !b[r1][c1]) out.push([r, c, r1, c1]); }); return out; }
  function allMoves(b, p) { var J = [], S = []; for (var r = 0; r < 8; r++) for (var c = 0; c < 8; c++) if (b[r][c] && own(b[r][c], p)) { J = J.concat(jumps(b, r, c)); S = S.concat(steps(b, r, c)); } return J.length ? J : S; }
  function apply(b, m) { var n = b.map(function (x) { return x.slice(); }), v = n[m[0]][m[1]]; n[m[0]][m[1]] = 0; if (m.length > 4) n[m[4]][m[5]] = 0;
    if ((v === 1 && m[2] === 0) || (v === -1 && m[2] === 7)) v *= 2; n[m[2]][m[3]] = v; return n; }
  function seq(b, m) { // 連続ジャンプを最後までたどる（CPU用）：いちばん多く取れる道
    var n = apply(b, m); if (m.length <= 4 || Math.abs(n[m[2]][m[3]]) !== Math.abs(b[m[0]][m[1]])) return [n, [m]];
    var more = jumps(n, m[2], m[3]); if (!more.length) return [n, [m]]; var best = null; more.forEach(function (x) { var r = seq(n, x); if (!best || r[1].length > best[1].length) best = [r[0], [m].concat(r[1])]; }); return best; }
  function score(b) { var s = 0; b.forEach(function (row, r) { row.forEach(function (v) { if (!v) return; s += (Math.abs(v) === 2 ? 3 : 1.8) * (v > 0 ? -1 : 1); if (v === -1) s += r * .05; if (v === 1) s -= (7 - r) * .05; }); }); return s; }
  function mm(b, d, p, a, be) { var ms = allMoves(b, p); if (!ms.length) return p < 0 ? -1e6 : 1e6; if (!d) return score(b);
    if (p < 0) { var v = -1e9; for (var i = 0; i < ms.length; i++) { v = Math.max(v, mm(seq(b, ms[i])[0], d - 1, 1, a, be)); a = Math.max(a, v); if (a >= be) break; } return v; }
    v = 1e9; for (i = 0; i < ms.length; i++) { v = Math.min(v, mm(seq(b, ms[i])[0], d - 1, -1, a, be)); be = Math.min(be, v); if (a >= be) break; } return v; }
  BG.checkers = { name: 'チェッカー', rules: '駒は黒いマスをななめ前に1つ進みます。となりの相手の駒をとびこえると取れます（取れるときは必ず取る。続けて取れるなら続けて）。いちばん奥まで行くとキング（★）になって、後ろにも進めます。相手が動けなくなったら勝ち。あなたは赤（下）です。',
    mount: function (el, ui) {
      var b = []; for (var r = 0; r < 8; r++) { b.push([]); for (var c = 0; c < 8; c++) b[r].push((r + c) % 2 ? (r < 3 ? -1 : r > 4 ? 1 : 0) : 0); }
      var sel = null, chain = null, turn = 1, over = false;
      var g = document.createElement('div'); g.className = 'grid'; g.style.cssText = 'grid-template-columns:repeat(8,1fr);width:min(92vw,480px);aspect-ratio:1;border:6px solid #4a2a0a';
      var cells = []; for (var i = 0; i < 64; i++) { var c = document.createElement('button'); c.type = 'button'; c.className = 'cell'; c.style.background = ((i % 8) + (i / 8 | 0)) % 2 ? '#6b3f1d' : '#e9d3a9';
        (function (k) { c.addEventListener('click', function () { tap(k / 8 | 0, k % 8); }); })(i); g.appendChild(c); cells.push(c); }
      el.appendChild(g);
      function legal() { var ms = allMoves(b, 1); if (chain) ms = jumps(b, chain[0], chain[1]); return ms; }
      function draw() { var ms = turn === 1 && !over ? legal() : [], tos = {}; if (sel) ms.forEach(function (m) { if (m[0] === sel[0] && m[1] === sel[1]) tos[m[2] + ',' + m[3]] = m.length > 4; });
        cells.forEach(function (c, k) { var r = k / 8 | 0, cc = k % 8, v = b[r][cc]; c.textContent = ''; c.className = 'cell' + (sel && sel[0] === r && sel[1] === cc ? ' sel' : '') + ((r + ',' + cc) in tos ? ' to' : '');
          if (v) { var s = document.createElement('span'); s.className = 'stone ' + (v > 0 ? 'r' : 'b'); if (Math.abs(v) === 2) { s.style.cssText = 'display:grid;place-items:center;color:#ffd23f;font-size:18px'; s.textContent = '★'; } c.appendChild(s); } }); }
      function endIf() { var p = turn, ms = allMoves(b, p); if (!ms.length) { over = true; draw(); var w = p < 0; ui.status(w ? 'あなたの勝ち！' : 'CPU の勝ち…', w ? 'win' : 'lose'); ui.ga('board_game_end', { game: 'checkers', result: w ? 'win' : 'lose' }); return true; } return false; }
      function tap(r, c) { if (over || turn !== 1) return; var ms = legal();
        if (sel) { var m = ms.filter(function (x) { return x[0] === sel[0] && x[1] === sel[1] && x[2] === r && x[3] === c; })[0];
          if (m) { var wasKing = Math.abs(b[m[0]][m[1]]) === 2; b = apply(b, m); var crowned = !wasKing && Math.abs(b[m[2]][m[3]]) === 2;
            if (m.length > 4 && !crowned && jumps(b, m[2], m[3]).length) { chain = [m[2], m[3]]; sel = chain; draw(); ui.status('続けて取れます！'); return; }
            chain = null; sel = null; turn = -1; draw(); if (endIf()) return; ui.status('CPU が考え中…'); ui.later(cpu, 450); return; } }
        if (!chain && b[r][c] > 0 && ms.some(function (x) { return x[0] === r && x[1] === c; })) { sel = [r, c]; draw(); } }
      function cpu() { var ms = allMoves(b, -1), lvl = ui.level(), best = null, bv = -1e9; ms.forEach(function (m) { var s = seq(b, m), v = lvl === 1 ? Math.random() + (m.length > 4 ? 1 : 0) : mm(s[0], lvl === 2 ? 3 : 6, 1, -1e9, 1e9) + Math.random() * .01; if (v > bv) { bv = v; best = s; } });
        b = best[0]; turn = 1; draw(); if (endIf()) return; ui.status('あなたの番です（動かす駒をえらんでね）'); }
      draw(); ui.status('あなたの番です（動かす駒をえらんでね）');
      return { destroy: function () { over = true; } };
    } };
})();
