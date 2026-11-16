/* 麻雀（CPUと2人打ち・簡易ルール）
   牌：萬子・筒子・索子（1〜9）と字牌（東南西北白發中）を4枚ずつ。鳴き・リーチ・役・点数はなし。
   4面子1雀頭（または七対子・国士無双）がそろったら、ツモかロンであがり。 */
(function () {
  var HON = ['東', '南', '西', '北', '白', '發', '中'], NUM = ['一', '二', '三', '四', '五', '六', '七', '八', '九'], PIN = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨'], SOU = ['１', '２', '３', '４', '５', '６', '７', '８', '９'];
  function cnt(h) { var c = new Array(34).fill(0); h.forEach(function (t) { c[t]++; }); return c; }
  function melds(c, i) { while (i < 34 && !c[i]) i++; if (i >= 34) return true;
    if (c[i] >= 3) { c[i] -= 3; var ok = melds(c, i); c[i] += 3; if (ok) return true; }
    if (i < 27 && i % 9 <= 6 && c[i + 1] && c[i + 2]) { c[i]--; c[i + 1]--; c[i + 2]--; ok = melds(c, i); c[i]++; c[i + 1]++; c[i + 2]++; if (ok) return true; }
    return false; }
  var YAO = [0, 8, 9, 17, 18, 26, 27, 28, 29, 30, 31, 32, 33];
  function complete(h) { if (h.length !== 14) return false; var c = cnt(h);
    var pairs = c.filter(function (x) { return x === 2; }).length; if (pairs === 7) return '七対子';
    if (YAO.every(function (t) { return c[t] >= 1; }) && YAO.some(function (t) { return c[t] === 2; })) return '国士無双';
    for (var i = 0; i < 34; i++) if (c[i] >= 2) { c[i] -= 2; var ok = melds(c, 0); c[i] += 2; if (ok) return 'あがり'; } return false; }
  function shanten(h) { var c = cnt(h), best = 8;
    function dfs(i, m, t, p) { while (i < 34 && !c[i]) i++;
      if (i >= 34) { var tt = Math.min(t, 4 - m); var s = 8 - 2 * m - tt - p; if (s < best) best = s; return; }
      if (c[i] >= 3) { c[i] -= 3; dfs(i, m + 1, t, p); c[i] += 3; }
      if (i < 27 && i % 9 <= 6 && c[i + 1] && c[i + 2]) { c[i]--; c[i + 1]--; c[i + 2]--; dfs(i, m + 1, t, p); c[i]++; c[i + 1]++; c[i + 2]++; }
      if (c[i] >= 2) { c[i] -= 2; if (!p) dfs(i, m, t, 1); dfs(i, m, t + 1, p); c[i] += 2; }
      if (i < 27 && i % 9 <= 7 && c[i + 1]) { c[i]--; c[i + 1]--; dfs(i, m, t + 1, p); c[i]++; c[i + 1]++; }
      if (i < 27 && i % 9 <= 6 && c[i + 2]) { c[i]--; c[i + 2]--; dfs(i, m, t + 1, p); c[i]++; c[i + 2]++; }
      c[i]--; dfs(i, m, t, p); c[i]++; }
    dfs(0, 0, 0, 0);
    var pr = 0, kinds = 0; c.forEach(function (x) { if (x >= 2) pr++; if (x) kinds++; }); var chi = 6 - pr + Math.max(0, 7 - kinds);
    return Math.min(best, chi); }
  function tileEl(t, small) { var e = document.createElement('span'); e.className = 'mj-t' + (small ? ' s' : '');
    if (t < 9) { e.innerHTML = '<b style="color:#111">' + NUM[t] + '</b><i style="color:#c00">萬</i>'; } else if (t < 18) { e.innerHTML = '<b style="color:#0a50c0;font-size:1.25em">' + PIN[t - 9] + '</b>'; }
    else if (t < 27) { e.innerHTML = '<b style="color:#087a2e">' + SOU[t - 18] + '</b><i style="color:#087a2e">索</i>'; } else { var h = HON[t - 27]; e.innerHTML = '<b style="color:' + (h === '中' ? '#c00' : h === '發' ? '#087a2e' : h === '白' ? '#99a' : '#111') + ';font-size:1.2em">' + (h === '白' ? '□' : h) + '</b>'; }
    e.setAttribute('aria-label', tname(t)); return e; }
  function tname(t) { return t < 9 ? NUM[t] + '萬' : t < 18 ? (t - 8) + '筒' : t < 27 ? (t - 17) + '索' : HON[t - 27]; }
  var css = false;
  BG.mahjong = { _t: { complete: complete, shanten: shanten }, name: '麻雀（2人打ち）', rules: 'CPU と1対1の、かんたんな麻雀です。牌を1枚ひいて（ツモ）、いらない牌を1枚すてます。4つの面子（同じ牌3枚、または同じ種類の数字3つ並び）と、1つの雀頭（同じ牌2枚）がそろったらあがり。自分でひいてそろったら「ツモ」、CPU がすてた牌でそろったら「ロン」。七対子・国士無双もあり。鳴き・リーチ・役・点数はありません。牌がなくなったら流局（引き分け）。',
    mount: function (el, ui) {
      if (!css) { css = true; var st = document.createElement('style'); st.textContent = '.mj-t{display:inline-flex;flex-direction:column;align-items:center;justify-content:center;width:34px;height:46px;background:linear-gradient(#fff,#efe9d8);border:1px solid #999;border-bottom:4px solid #c9b98a;border-radius:5px;font:bold 17px/1 "Hiragino Mincho ProN","Yu Mincho",serif;color:#111;box-shadow:0 1px 2px rgba(0,0,0,.4)}.mj-t i{font-style:normal;font-size:11px;margin-top:2px}.mj-t.s{width:24px;height:32px;font-size:12px;border-bottom-width:3px}.mj-t.s i{font-size:8px}.mj-hand{display:flex;flex-wrap:wrap;gap:3px;justify-content:center}.mj-hand button{padding:0;border:0;background:none;cursor:pointer}.mj-hand button:hover .mj-t,.mj-hand button:focus-visible .mj-t{transform:translateY(-6px)}.mj-pond{display:flex;flex-wrap:wrap;gap:2px;min-height:34px;max-width:min(94vw,560px);justify-content:center}.mj-back{display:inline-block;width:20px;height:30px;background:linear-gradient(#2a8a5a,#1c5e3c);border-radius:3px;border:1px solid #0d3d22}.mj-table{background:radial-gradient(ellipse at center,#1d6b45,#0f3d27);border-radius:14px;padding:12px;display:flex;flex-direction:column;gap:10px;align-items:center;width:min(96vw,640px)}.mj-lab{font-size:12px;color:#cfe;align-self:flex-start}'; document.head.appendChild(st); }
      var wall = []; for (var t = 0; t < 34; t++) for (var k = 0; k < 4; k++) wall.push(t);
      for (var i = wall.length - 1; i > 0; i--) { var j = Math.random() * (i + 1) | 0, x = wall[i]; wall[i] = wall[j]; wall[j] = x; }
      var me = wall.splice(0, 13).sort(function (a, b) { return a - b; }), cp = wall.splice(0, 13), pondMe = [], pondCp = [], drawn = null, over = false, state = 'draw';
      var tbl = document.createElement('div'); tbl.className = 'mj-table';
      var cpH = document.createElement('div'), cpP = document.createElement('div'), info = document.createElement('div'), meP = document.createElement('div'), meH = document.createElement('div'), btns = document.createElement('div');
      cpH.className = 'mj-hand'; cpP.className = 'mj-pond'; meP.className = 'mj-pond'; meH.className = 'mj-hand'; info.style.cssText = 'font-size:13px;color:#ffd23f'; btns.style.cssText = 'display:flex;gap:8px;min-height:38px';
      [['CPU', cpH], ['CPU の捨て牌', cpP], ['', info], ['あなたの捨て牌', meP], ['あなたの手牌（タップですてる）', meH]].forEach(function (x) { if (x[0]) { var l = document.createElement('div'); l.className = 'mj-lab'; l.textContent = x[0]; tbl.appendChild(l); } tbl.appendChild(x[1]); });
      el.appendChild(tbl); el.appendChild(btns);
      function draw() { cpH.textContent = ''; for (var i = 0; i < cp.length; i++) { var b = document.createElement('span'); b.className = 'mj-back'; cpH.appendChild(b); }
        cpP.textContent = ''; pondCp.forEach(function (t, k) { var e = tileEl(t, true); if (k === pondCp.length - 1 && state === 'ron?') e.style.outline = '3px solid #ffd23f'; cpP.appendChild(e); });
        meP.textContent = ''; pondMe.forEach(function (t) { meP.appendChild(tileEl(t, true)); });
        meH.textContent = ''; me.forEach(function (t, k) { var b = document.createElement('button'); b.type = 'button'; b.appendChild(tileEl(t)); b.addEventListener('click', function () { discard(k); }); b.disabled = state !== 'discard'; meH.appendChild(b); });
        if (drawn !== null) { var sp = document.createElement('span'); sp.style.width = '10px'; meH.appendChild(sp); var b2 = document.createElement('button'); b2.type = 'button'; b2.appendChild(tileEl(drawn)); b2.addEventListener('click', function () { discard(-1); }); b2.disabled = state !== 'discard'; b2.title = 'ツモ牌'; meH.appendChild(b2); }
        info.textContent = '山のこり ' + wall.length + ' 枚　／　あなたのシャンテン数：' + Math.max(0, shanten(drawn !== null ? me.concat([drawn]) : me) ) + (shanten(me) === 0 && drawn === null ? '（テンパイ！）' : ''); }
      function button(label, fn, y) { var b = document.createElement('button'); b.type = 'button'; b.className = 'btn' + (y ? ' y' : ''); b.textContent = label; b.addEventListener('click', fn); btns.appendChild(b); }
      function end(msg, cls, res) { over = true; state = 'over'; btns.textContent = ''; draw(); cpH.textContent = ''; cp.sort(function (a, b) { return a - b; }).forEach(function (t) { cpH.appendChild(tileEl(t, true)); }); ui.status(msg, cls); ui.ga('board_game_end', { game: 'mahjong', result: res }); }
      function myTurn() { if (!wall.length) return end('流局（牌がなくなりました）', '', 'draw'); drawn = wall.shift(); state = 'discard'; btns.textContent = '';
        var c = complete(me.concat([drawn])); if (c) button('ツモ！（' + c + '）', function () { end('ツモ！ あなたの勝ち！（' + c + '）', 'win', 'win'); }, true);
        draw(); ui.status(c ? 'あがれます！ ツモを押すか、すてる牌をえらんでね' : 'すてる牌をえらんでね'); }
      function discard(k) { if (state !== 'discard' || over) return; var t; if (k < 0) { t = drawn; } else { t = me[k]; me.splice(k, 1); me.push(drawn); }
        drawn = null; me.sort(function (a, b) { return a - b; }); pondMe.push(t); btns.textContent = ''; state = 'cpu'; draw();
        if (complete(cp.concat([t]))) return end('ロン！ CPU の勝ち…（' + tname(t) + ' であがられた）', 'lose', 'lose');
        ui.status('CPU の番…'); ui.later(cpuTurn, 600); }
      function cpuTurn() { if (over) return; if (!wall.length) return end('流局（牌がなくなりました）', '', 'draw');
        var d = wall.shift(); cp.push(d); var c = complete(cp); if (c) return end('ツモ！ CPU の勝ち…（' + c + '）', 'lose', 'lose');
        var lvl = ui.level(), bestI = 0, bv = 1e9; cp.forEach(function (t, i) { var rest = cp.slice(0, i).concat(cp.slice(i + 1)), s = lvl === 1 ? Math.random() * 3 + shanten(rest) * .5 : shanten(rest) * 10 + (t >= 27 ? -.5 : (t % 9 === 0 || t % 9 === 8) ? -.3 : 0) + Math.random() * .2; if (s < bv) { bv = s; bestI = i; } });
        var out = cp.splice(bestI, 1)[0]; pondCp.push(out);
        var r = complete(me.concat([out]));
        if (r) { state = 'ron?'; draw(); btns.textContent = ''; button('ロン！（' + r + '）', function () { end('ロン！ あなたの勝ち！（' + r + '）', 'win', 'win'); }, true); button('見送る', function () { btns.textContent = ''; myTurn(); }); ui.status('CPU の ' + tname(out) + ' であがれます！'); return; }
        myTurn(); }
      myTurn();
      return { destroy: function () { over = true; } };
    } };
})();
