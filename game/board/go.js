/* 囲碁（9路盤・中国ルールで数える・コミ6目半・コウあり）。あなた＝黒 */
(function () {
  var N = 9, KOMI = 6.5;
  function nb(i) { var x = i % N, y = i / N | 0, r = []; if (x) r.push(i - 1); if (x < N - 1) r.push(i + 1); if (y) r.push(i - N); if (y < N - 1) r.push(i + N); return r; }
  var NB = []; for (var i = 0; i < N * N; i++) NB.push(nb(i));
  function group(b, i) { var c = b[i], st = [i], seen = {}, g = [], libs = {}; seen[i] = 1;
    while (st.length) { var k = st.pop(); g.push(k); NB[k].forEach(function (j) { if (!b[j]) libs[j] = 1; else if (b[j] === c && !seen[j]) { seen[j] = 1; st.push(j); } }); }
    return { g: g, libs: Object.keys(libs).length, lib: Object.keys(libs) }; }
  function play(b, i, c, ko) { if (b[i] || i === ko) return null; var n = b.slice(); n[i] = c; var cap = [];
    NB[i].forEach(function (j) { if (n[j] === -c) { var gr = group(n, j); if (!gr.libs) gr.g.forEach(function (k) { n[k] = 0; cap.push(k); }); } });
    if (!group(n, i).libs) return null; // 自殺手は禁止
    var newKo = -1; if (cap.length === 1 && group(n, i).g.length === 1 && group(n, i).libs === 1) newKo = cap[0];
    return { b: n, cap: cap.length, ko: newKo }; }
  function score(b) { var bl = 0, wh = 0, seen = {}; for (var i = 0; i < N * N; i++) { if (b[i] === 1) bl++; else if (b[i] === -1) wh++; else if (!seen[i]) {
      var st = [i], area = [], touch = {}; seen[i] = 1; while (st.length) { var k = st.pop(); area.push(k); NB[k].forEach(function (j) { if (!b[j] && !seen[j]) { seen[j] = 1; st.push(j); } else if (b[j]) touch[b[j]] = 1; }); }
      if (touch[1] && !touch[-1]) bl += area.length; if (touch[-1] && !touch[1]) wh += area.length; } } return [bl, wh + KOMI]; }
  function eye(b, i, c) { return NB[i].every(function (j) { return b[j] === c; }); }
  function ai(b, c, ko, moves, lvl) { var best = -1, bv = 0.5;
    for (var i = 0; i < N * N; i++) { if (b[i] || i === ko || eye(b, i, c)) continue; var r = play(b, i, c, ko); if (!r) continue;
      var v = r.cap * 12, me = group(r.b, i);
      if (me.libs === 1) v -= 10 + me.g.length * 3; else v += Math.min(me.libs, 4) * .6;
      NB[i].forEach(function (j) { if (b[j] === -c) { var g = group(b, j); if (g.libs === 2) v += 3; if (g.libs === 1) v += 6; } if (b[j] === c) { var g2 = group(b, j); if (g2.libs === 1) v += 8 + g2.g.length; } });
      var x = i % N, y = i / N | 0, edge = Math.min(x, y, N - 1 - x, N - 1 - y); if (moves < 12) v += edge === 2 ? 2.5 : edge === 1 ? .3 : edge === 0 ? -2 : 1;
      if (edge === 0) v -= .8;
      var near = NB[i].some(function (j) { return b[j]; }); if (near) v += .8;
      v += Math.random() * (lvl === 1 ? 6 : lvl === 2 ? 1.5 : .6);
      if (v > bv) { bv = v; best = i; } }
    return best; }
  BG.go = { name: '囲碁（9路）', rules: '黒（あなた）と白（CPU）が交互に石を置きます。相手の石をすき間なく囲むと取れます。2人とも続けて「パス」したら終わり。自分の石と、自分の石だけで囲んだ陣地の合計が多いほうの勝ち（白にはコミ6目半）。すぐに取り返す形（コウ）は、1手待たないとだめです。',
    mount: function (el, ui) {
      var b = []; for (var i = 0; i < N * N; i++) b.push(0);
      var turn = 1, ko = -1, passes = 0, over = false, moves = 0, last = -1, cap = [0, 0];
      var g = document.createElement('div'); g.className = 'grid'; g.style.cssText = 'grid-template-columns:repeat(9,1fr);width:min(92vw,480px);aspect-ratio:1;background:#e0b25c;border:8px solid #b07a30;' +
        'background-image:linear-gradient(#3a2a10 1.5px,transparent 1.5px),linear-gradient(90deg,#3a2a10 1.5px,transparent 1.5px);background-size:calc(100%/9) calc(100%/9);background-position:calc(50%/9 - .75px) calc(50%/9 - .75px)';
      var cells = []; for (i = 0; i < N * N; i++) { var c = document.createElement('button'); c.type = 'button'; c.className = 'cell'; (function (k) { c.addEventListener('click', function () { tap(k); }); })(i); g.appendChild(c); cells.push(c); }
      var bar = document.createElement('div'); bar.style.cssText = 'display:flex;gap:8px';
      var passB = document.createElement('button'); passB.type = 'button'; passB.className = 'btn'; passB.textContent = 'パス'; passB.addEventListener('click', function () { if (!over && turn === 1) pass(); });
      var resB = document.createElement('button'); resB.type = 'button'; resB.className = 'btn'; resB.textContent = '投了'; resB.addEventListener('click', function () { if (!over && confirm('投了しますか？')) { over = true; ui.status('投了しました。CPU の勝ち', 'lose'); } });
      bar.appendChild(passB); bar.appendChild(resB); el.appendChild(g); el.appendChild(bar);
      function draw() { cells.forEach(function (c, k) { c.textContent = ''; c.className = 'cell' + (k === last ? ' last' : ''); if (b[k]) { var s = document.createElement('span'); s.className = 'stone ' + (b[k] === 1 ? 'b' : 'w'); c.appendChild(s); }
        c.setAttribute('aria-label', String.fromCharCode(65 + k % N) + (N - (k / N | 0)) + (b[k] ? (b[k] === 1 ? ' 黒' : ' 白') : '')); }); }
      function end() { over = true; var s = score(b), w = s[0] > s[1]; draw(); ui.status('黒 ' + s[0] + ' − 白 ' + s[1] + '（コミ込み）　' + (w ? 'あなたの勝ち！' : 'CPU の勝ち…'), w ? 'win' : 'lose'); ui.ga('board_game_end', { game: 'go', result: w ? 'win' : 'lose' }); }
      function pass() { passes++; ko = -1; if (passes >= 2) return end(); turn = -turn; draw(); if (turn === -1) { ui.status('あなたはパス。CPU が考え中…'); ui.later(cpu, 400); } else ui.status('CPU はパスしました。あなたの番です（終わるならパス）'); }
      function put(i, c) { var r = play(b, i, c, ko); if (!r) return false; b = r.b; ko = r.ko; last = i; moves++; passes = 0; if (c === 1) cap[0] += r.cap; else cap[1] += r.cap; turn = -c; draw(); return true; }
      function tap(i) { if (over || turn !== 1) return; if (!put(i, 1)) { ui.status(i === ko ? 'コウなので、すぐには取り返せません' : 'そこには置けません'); return; } ui.status('CPU が考え中…'); ui.later(cpu, 350); }
      function cpu() { if (over) return; var i = ai(b, -1, ko, moves, ui.level()); if (i < 0 || (moves > 50 && passes === 1)) { if (i < 0) return pass(); }
        if (i < 0) return pass(); put(i, -1); ui.status('あなたの番です（アゲハマ：あなた ' + cap[0] + '・CPU ' + cap[1] + '）'); }
      draw(); ui.status('あなたの番です（黒）');
      return { destroy: function () { over = true; } };
    } };
})();
