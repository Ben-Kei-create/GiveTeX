/* マンカラ（カラハ：6穴×4粒） */
(function () {
  // 0-5: あなたの穴、6: あなたのゴール、7-12: CPU の穴、13: CPU のゴール
  function sow(s, i, p) { var n = s.slice(), k = n[i]; n[i] = 0; var j = i; while (k) { j = (j + 1) % 14; if (j === (p === 0 ? 13 : 6)) continue; n[j]++; k--; }
    var own = p === 0 ? j >= 0 && j <= 5 : j >= 7 && j <= 12; if (own && n[j] === 1 && n[12 - j]) { n[p === 0 ? 6 : 13] += n[12 - j] + 1; n[12 - j] = 0; n[j] = 0; }
    var again = j === (p === 0 ? 6 : 13); return [n, again]; }
  function done(s) { var a = 0, b = 0; for (var i = 0; i < 6; i++) { a += s[i]; b += s[7 + i]; } return !a || !b; }
  function fin(s) { var n = s.slice(); for (var i = 0; i < 6; i++) { n[6] += n[i]; n[i] = 0; n[13] += n[7 + i]; n[7 + i] = 0; } return n; }
  function mm(s, d, p, a, be) { if (done(s)) { var f = fin(s); return (f[13] - f[6]) * 100; } if (!d) return s[13] - s[6];
    var best = p === 1 ? -1e9 : 1e9; for (var i = 0; i < 6; i++) { var h = p === 1 ? 7 + i : i; if (!s[h]) continue; var r = sow(s, h, p), v = mm(r[0], d - 1, r[1] ? p : 1 - p, a, be);
      if (p === 1) { best = Math.max(best, v); a = Math.max(a, v); } else { best = Math.min(best, v); be = Math.min(be, v); } if (a >= be) break; } return best; }
  BG.mancala = { name: 'マンカラ', rules: '自分の側（手前）の穴をえらぶと、中の種を反時計まわりに1つずつまいていきます。最後の種が自分のゴール（右はし）に入ったら、もう1回。最後の種が自分の側の空っぽの穴に入ったら、向かいの穴の種もまとめて取れます。片方の穴がぜんぶ空になったら終わり。ゴールの種が多いほうの勝ち。',
    mount: function (el, ui) {
      var s = [4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 0], turn = 0, over = false;
      var box = document.createElement('div'); box.style.cssText = 'display:grid;grid-template-columns:1fr repeat(6,1fr) 1fr;grid-template-rows:1fr 1fr;gap:6px;width:min(96vw,620px);background:#7a4a1e;border:6px solid #4a2a0a;border-radius:40px;padding:10px';
      var holes = [];
      function pit(i, cls) { var b = document.createElement('button'); b.type = 'button'; b.className = 'cell'; b.style.cssText = 'aspect-ratio:1;border-radius:50%;background:#4a2a0a;box-shadow:inset 0 4px 8px rgba(0,0,0,.6);color:#ffe7b0;font-size:20px;font-weight:bold';
        if (cls === 'goal') { b.style.aspectRatio = 'auto'; b.style.borderRadius = '30px'; b.style.gridRow = '1 / span 2'; } b.addEventListener('click', function () { tap(i); }); holes[i] = b; return b; }
      box.appendChild(pit(13, 'goal')); for (var i = 12; i >= 7; i--) box.appendChild(pit(i)); box.appendChild(pit(6, 'goal'));
      for (i = 0; i < 6; i++) { var p = pit(i); p.style.gridRow = '2'; p.style.gridColumn = String(i + 2); box.appendChild(p); }
      holes[13].style.gridColumn = '1'; holes[6].style.gridColumn = '8'; for (i = 12; i >= 7; i--) { holes[i].style.gridRow = '1'; holes[i].style.gridColumn = String(14 - i); }
      el.appendChild(box); var lab = document.createElement('p'); lab.style.cssText = 'margin:0;font-size:13px;color:var(--sub)'; lab.textContent = '上が CPU、下があなた。左はしが CPU のゴール、右はしがあなたのゴール'; el.appendChild(lab);
      function draw() { holes.forEach(function (h, k) { h.textContent = s[k]; h.disabled = over || turn !== 0 || k > 5 || !s[k]; h.style.outline = !h.disabled ? '2px solid #ffd23f' : 'none'; h.setAttribute('aria-label', (k === 6 ? 'あなたのゴール' : k === 13 ? 'CPUのゴール' : (k < 6 ? 'あなたの穴' : 'CPUの穴')) + ' ' + s[k] + 'こ'); }); }
      function check() { if (done(s)) { s = fin(s); over = true; draw(); var w = s[6] > s[13]; ui.status('あなた ' + s[6] + ' − CPU ' + s[13] + '　' + (w ? 'あなたの勝ち！' : s[6] < s[13] ? 'CPU の勝ち…' : '引き分け'), w ? 'win' : s[6] < s[13] ? 'lose' : ''); ui.ga('board_game_end', { game: 'mancala', result: w ? 'win' : 'lose' }); return true; } return false; }
      function tap(i) { if (over || turn !== 0 || i > 5 || !s[i]) return; var r = sow(s, i, 0); s = r[0]; draw(); if (check()) return; if (r[1]) { ui.status('ゴールに入った！ もう1回どうぞ'); return; } turn = 1; draw(); ui.status('CPU が考え中…'); ui.later(cpu, 600); }
      function cpu() { var lvl = ui.level(), best = -1, bv = -1e9; for (var i = 0; i < 6; i++) { var h = 7 + i; if (!s[h]) continue; var r = sow(s, h, 1), v = lvl === 1 ? Math.random() : mm(r[0], lvl === 2 ? 4 : 8, r[1] ? 1 : 0, -1e9, 1e9) + Math.random() * .1; if (v > bv) { bv = v; best = h; } }
        var r2 = sow(s, best, 1); s = r2[0]; draw(); if (check()) return; if (r2[1]) { ui.status('CPU がもう1回…'); ui.later(cpu, 700); return; } turn = 0; draw(); ui.status('あなたの番です（下の穴をえらんでね）'); }
      draw(); ui.status('あなたの番です（下の穴をえらんでね）');
      return { destroy: function () { over = true; } };
    } };
})();
