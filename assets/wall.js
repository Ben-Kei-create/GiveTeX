/* 階段の下の落書きの壁（ホームの窓の裏）：チョークで描く（消えない）／消しゴムは汚れが残る
   🔑に4桁コードを入れると、そのページを開いている間だけ消しゴムが「完全消し」になる */
(function () {
  'use strict';
  var dirt = document.getElementById('wl-dirt'), chalk = document.getElementById('wl-chalk');
  if (!dirt || !chalk) return;
  var W = 960, H = 540;
  var dctx = dirt.getContext('2d'), cctx = chalk.getContext('2d');
  var tool = 'chalk', color = '#ffffff', unlocked = false;
  var known = 0, tk = '', tkAt = 0, drawing = false, cur = null, lastPt = null;

  function rng(seed) { var s = (seed * 2654435761) % 4294967296; return function () { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296; }; }
  function path(ctx, pts) {
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (var i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    if (pts.length === 1) ctx.lineTo(pts[0][0] + 0.1, pts[0][1] + 0.1);
  }
  function drawChalk(pts, col, seed) {
    var r = rng(seed || 7);
    cctx.save();
    cctx.lineCap = 'round'; cctx.lineJoin = 'round';
    for (var pass = 0; pass < 3; pass++) {
      cctx.strokeStyle = col;
      cctx.globalAlpha = pass === 0 ? 0.55 : 0.3;
      cctx.lineWidth = pass === 0 ? 5 : 3.4;
      cctx.save();
      cctx.translate((r() - 0.5) * 1.6, (r() - 0.5) * 1.6);
      path(cctx, pts); cctx.stroke();
      cctx.restore();
    }
    cctx.globalAlpha = 0.35; cctx.fillStyle = col;
    for (var i = 0; i < pts.length; i++) {
      for (var j = 0; j < 2; j++) {
        cctx.fillRect(pts[i][0] + (r() - 0.5) * 6, pts[i][1] + (r() - 0.5) * 6, 1.4, 1.4);
      }
    }
    cctx.restore();
  }
  function drawErase(pts, seed) {
    var r = rng(seed || 13);
    cctx.save();
    cctx.globalCompositeOperation = 'destination-out';
    cctx.lineCap = 'round'; cctx.lineJoin = 'round';
    cctx.globalAlpha = 0.92; cctx.lineWidth = 36;
    path(cctx, pts); cctx.stroke();
    cctx.restore();
    /* 汚れは残る */
    dctx.save();
    dctx.lineCap = 'round'; dctx.lineJoin = 'round';
    for (var pass = 0; pass < 3; pass++) {
      dctx.strokeStyle = pass === 2 ? 'rgba(60,52,40,0.05)' : 'rgba(215,205,185,0.055)';
      dctx.lineWidth = 44 - pass * 6;
      dctx.save();
      dctx.translate((r() - 0.5) * 8, (r() - 0.5) * 8);
      path(dctx, pts); dctx.stroke();
      dctx.restore();
    }
    dctx.restore();
  }
  function drawTrueErase(pts) {
    [cctx, dctx].forEach(function (ctx) {
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.globalAlpha = 1; ctx.lineWidth = 38;
      path(ctx, pts); ctx.stroke();
      ctx.restore();
    });
  }
  function applyOp(op, seed) {
    if (!op || !op.p || !op.p.length) return;
    if (op.k === 'x') drawTrueErase(op.p);
    else if (op.k === 'e') drawErase(op.p, seed);
    else drawChalk(op.p, op.c || '#ffffff', seed);
  }
  function getJSON(u, o) {
    return fetch(u, o).then(function (r) { return r.json().catch(function () { return {}; }); }).catch(function () { return { ok: false }; });
  }
  function token() {
    if (tk && Date.now() - tkAt < 7200e3) return Promise.resolve(tk);
    return getJSON('/api/wall?tk=1', { cache: 'no-store' }).then(function (j) { if (j.ok) { tk = j.tk; tkAt = Date.now(); } return tk; });
  }
  function loadNew() {
    getJSON('/api/wall?off=' + known, { cache: 'no-store' }).then(function (j) {
      if (!j.ok) return;
      (j.ops || []).forEach(function (op, i) { applyOp(op, known + i + 1); });
      known = Math.max(known, (j.off || 0) + (j.ops || []).length);
      if ((j.ops || []).length >= 500 && known < (j.total || 0)) loadNew();
    });
  }

  function pos(e) {
    var r = chalk.getBoundingClientRect();
    return [Math.round((e.clientX - r.left) * W / r.width), Math.round((e.clientY - r.top) * H / r.height)];
  }
  function curKind() { return tool === 'erase' ? (unlocked ? 'x' : 'e') : 'c'; }
  chalk.addEventListener('pointerdown', function (e) {
    e.preventDefault();
    chalk.setPointerCapture(e.pointerId);
    drawing = true;
    var p = pos(e); lastPt = p;
    cur = { k: curKind(), c: color, p: [p] };
    applyOp(cur, Date.now() % 100000);
  });
  chalk.addEventListener('pointermove', function (e) {
    if (!drawing || !cur) return;
    var p = pos(e);
    var dx = p[0] - lastPt[0], dy = p[1] - lastPt[1];
    if (dx * dx + dy * dy < 9) return;
    cur.p.push(p);
    var seg = { k: cur.k, c: color, p: [lastPt, p] };
    applyOp(seg, p[0] * 31 + p[1]);
    lastPt = p;
    if (cur.p.length >= 400) finish();
  });
  function finish() {
    if (!cur) return;
    var op = cur; cur = null; drawing = false;
    var kind = op.k === 'x' ? 'trueerase' : op.k === 'e' ? 'erase' : 'chalk';
    token().then(function (t) {
      return getJSON('/api/wall', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ act: 'stroke', kind: kind, color: op.c, pts: op.p, tk: t }) });
    }).then(function (j) { if (j.ok && typeof j.total === 'number') known = Math.max(known, j.total); });
  }
  chalk.addEventListener('pointerup', finish);
  chalk.addEventListener('pointercancel', finish);

  var bar = document.getElementById('wl-tools');
  var keyPanel = document.getElementById('wl-key');
  var keyBtn = document.getElementById('wl-keybtn');
  bar.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('button'); if (!b) return;
    if (b.hasAttribute('data-color')) { tool = 'chalk'; color = b.getAttribute('data-color'); }
    if (b.hasAttribute('data-tool')) tool = b.getAttribute('data-tool');
    if (b.id === 'wl-keybtn' && keyPanel) keyPanel.hidden = !keyPanel.hidden;
    Array.prototype.forEach.call(bar.querySelectorAll('button'), function (x) {
      var on = (x.hasAttribute('data-color') && tool === 'chalk' && x.getAttribute('data-color') === color) ||
               (x.hasAttribute('data-tool') && x.getAttribute('data-tool') === tool);
      x.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    chalk.style.cursor = tool === 'erase' ? 'cell' : 'crosshair';
  });

  var unlockBtn = document.getElementById('wl-unlock');
  if (unlockBtn) unlockBtn.addEventListener('click', function () {
    var code = (document.getElementById('wl-code').value || '').trim();
    var msg = document.getElementById('wl-keymsg');
    if (!/^\d{4}$/.test(code)) { msg.textContent = '数字4桁を入れてね。'; return; }
    msg.textContent = '確認中…';
    getJSON('/api/wall', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ act: 'unlock', code: code }) }).then(function (j) {
      if (j.ok) {
        unlocked = true;
        msg.textContent = '🔓 合いました！ 消しゴムが「完全消し」になりました（このページを閉じるまで）。';
        if (keyBtn) keyBtn.textContent = '🔓';
        var eb = bar.querySelector('[data-tool="erase"]');
        if (eb) eb.textContent = '▭ 消しゴム（完全）';
      } else {
        msg.textContent = 'ちがうみたい…。数字は裏口の上のほうに。';
      }
    });
  });

  loadNew();
  setInterval(function () { if (!drawing) loadNew(); }, 30000);
})();
