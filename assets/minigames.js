/* ホームのゲームコーナー（昔ながらのミニゲーム4本・すべてオリジナル）
   ブロックおとし／うちゅうげきたい／クレーンゲーム／じゃんけんポン
   操作：画面の下のボタン、またはゲーム画面をクリックしてからキーボード（← → ↑ ↓、スペース／Z） */
(function () {
  'use strict';
  var root = document.getElementById('mg'); if (!root) return;
  var W = 160, H = 240;
  var cv = root.querySelector('canvas'), ctx = cv.getContext('2d');
  var dpr = Math.min(window.devicePixelRatio || 1, 3);
  cv.width = W * dpr; cv.height = H * dpr; ctx.scale(dpr, dpr);
  var info = root.querySelector('.mg-info'), pad = root.querySelector('.mg-pad'), jpad = root.querySelector('.mg-janken');
  var calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function hiGet(k) { try { return +localStorage.getItem('gt-mg-' + k) || 0; } catch (e) { return 0; } }
  function hiSet(k, v) { try { localStorage.setItem('gt-mg-' + k, String(v)); } catch (e) {} }
  function txt(s, x, y, size, color, align) { ctx.fillStyle = color || '#fff'; ctx.font = (size || 10) + 'px "DotGothic16","VT323",monospace'; ctx.textAlign = align || 'center'; ctx.textBaseline = 'middle'; ctx.fillText(s, x, y); }
  function clear(c) { ctx.fillStyle = c || '#000'; ctx.fillRect(0, 0, W, H); }
  function rnd(n) { return Math.floor(Math.random() * n); }
  var held = {};

  /* ===== ブロックおとし ===== */
  var SH = [[[1,1,1,1]], [[1,1],[1,1]], [[0,1,0],[1,1,1]], [[1,0,0],[1,1,1]], [[0,0,1],[1,1,1]], [[1,1,0],[0,1,1]], [[0,1,1],[1,1,0]]];
  var COL = ['#3ef0ff', '#ffd23f', '#c77dff', '#ff9f1c', '#4d7cff', '#ff4d6d', '#6bff7a'];
  var block = {
    name: 'ブロックおとし', key: 'block', help: '← → いどう ／ ↑・A かいてん ／ ↓ はやく',
    reset: function () { this.g = []; for (var y = 0; y < 15; y++) this.g.push(new Array(10).fill(0)); this.score = 0; this.lines = 0; this.t = 0; this.over = false; this.next(); },
    next: function () { var i = rnd(7); this.p = { s: SH[i].map(function (r) { return r.slice(); }), c: i + 1, x: 3, y: 0 }; if (this.hit(this.p.s, this.p.x, this.p.y)) this.over = true; },
    hit: function (s, px, py) { for (var y = 0; y < s.length; y++) for (var x = 0; x < s[y].length; x++) if (s[y][x]) { var gx = px + x, gy = py + y; if (gx < 0 || gx > 9 || gy > 14 || (gy >= 0 && this.g[gy][gx])) return true; } return false; },
    rot: function () { var s = this.p.s, r = s[0].map(function (_, i) { return s.map(function (row) { return row[i]; }).reverse(); }); for (var k = 0; k < 3; k++) { var dx = [0, -1, 1][k]; if (!this.hit(r, this.p.x + dx, this.p.y)) { this.p.s = r; this.p.x += dx; return; } } },
    lock: function () { var p = this.p, g = this.g; p.s.forEach(function (row, y) { row.forEach(function (v, x) { if (v && p.y + y >= 0) g[p.y + y][p.x + x] = p.c; }); });
      var n = 0; for (var y = 14; y >= 0; y--) if (g[y].every(Boolean)) { g.splice(y, 1); g.unshift(new Array(10).fill(0)); n++; y++; }
      this.lines += n; this.score += [0, 100, 300, 500, 800][n]; this.next(); },
    down: function () { if (!this.hit(this.p.s, this.p.x, this.p.y + 1)) { this.p.y++; return true; } this.lock(); return false; },
    step: function (dt) { if (this.over) return; this.t += dt; var sp = Math.max(120, 650 - this.lines * 25); if (held.down) sp = 45; if (this.t > sp) { this.t = 0; this.down(); } },
    input: function (k) { if (this.over) return; if (k === 'left' && !this.hit(this.p.s, this.p.x - 1, this.p.y)) this.p.x--; if (k === 'right' && !this.hit(this.p.s, this.p.x + 1, this.p.y)) this.p.x++; if (k === 'up' || k === 'a') this.rot(); if (k === 'down') { this.down(); this.score++; } },
    draw: function () { clear('#0b0b1a'); var g = this.g, p = this.p;
      function cell(x, y, c) { ctx.fillStyle = COL[c - 1]; ctx.fillRect(x * 16 + 1, y * 16 + 1, 14, 14); ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fillRect(x * 16 + 1, y * 16 + 1, 14, 3); }
      for (var y = 0; y < 15; y++) for (var x = 0; x < 10; x++) if (g[y][x]) cell(x, y, g[y][x]);
      if (!this.over) p.s.forEach(function (row, y) { row.forEach(function (v, x) { if (v) cell(p.x + x, p.y + y, p.c); }); });
      return 'SCORE ' + this.score + '　LINE ' + this.lines; }
  };

  /* ===== うちゅうげきたい ===== */
  var space = {
    name: 'うちゅうげきたい', key: 'space', help: '← → いどう ／ A うつ',
    reset: function () { this.score = 0; this.life = 3; this.wave = 1; this.over = false; this.x = 72; this.wave0(); },
    wave0: function () { this.al = []; for (var r = 0; r < 4; r++) for (var c = 0; c < 6; c++) this.al.push({ x: 14 + c * 22, y: 24 + r * 16, r: r }); this.dir = 1; this.mt = 0; this.shot = null; this.eb = []; },
    step: function (dt) { if (this.over) return; var s = this;
      if (held.left) s.x = Math.max(2, s.x - dt * .09); if (held.right) s.x = Math.min(W - 18, s.x + dt * .09);
      if (s.shot) { s.shot.y -= dt * .25; if (s.shot.y < 0) s.shot = null; }
      s.mt += dt; var sp = Math.max(60, 520 - (24 - s.al.length) * 18 - s.wave * 30);
      if (s.mt > sp) { s.mt = 0; var edge = s.al.some(function (a) { return (s.dir > 0 && a.x > W - 18) || (s.dir < 0 && a.x < 4); });
        if (edge) { s.dir *= -1; s.al.forEach(function (a) { a.y += 6; }); } else s.al.forEach(function (a) { a.x += 4 * s.dir; }); }
      if (s.al.length && Math.random() < dt * .0012 * (1 + s.wave * .3)) { var a = s.al[rnd(s.al.length)]; s.eb.push({ x: a.x + 6, y: a.y + 8 }); }
      s.eb.forEach(function (b) { b.y += dt * .11; }); s.eb = s.eb.filter(function (b) { return b.y < H; });
      if (s.shot) for (var i = 0; i < s.al.length; i++) { var a = s.al[i]; if (s.shot.x > a.x - 1 && s.shot.x < a.x + 13 && s.shot.y > a.y && s.shot.y < a.y + 9) { s.al.splice(i, 1); s.shot = null; s.score += (4 - a.r) * 10; break; } }
      for (var j = 0; j < s.eb.length; j++) { var b = s.eb[j]; if (b.y > H - 22 && b.y < H - 10 && b.x > s.x && b.x < s.x + 16) { s.eb.splice(j, 1); s.life--; if (s.life <= 0) s.over = true; break; } }
      if (s.al.some(function (a) { return a.y > H - 34; })) s.over = true;
      if (!s.al.length) { s.wave++; s.wave0(); } },
    input: function (k) { if (k === 'a' && !this.shot && !this.over) this.shot = { x: this.x + 8, y: H - 24 }; },
    draw: function () { clear('#02010a'); var s = this;
      for (var i = 0; i < 30; i++) { ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fillRect((i * 53) % W, (i * 97) % H, 1, 1); }
      var colors = ['#ff4fd8', '#ffd23f', '#3ef0ff', '#6bff7a'], f = (Date.now() >> 8) & 1;
      s.al.forEach(function (a) { ctx.fillStyle = colors[a.r]; ctx.fillRect(a.x + 2, a.y, 8, 2); ctx.fillRect(a.x, a.y + 2, 12, 4); ctx.fillStyle = '#000'; ctx.fillRect(a.x + 3, a.y + 3, 2, 2); ctx.fillRect(a.x + 7, a.y + 3, 2, 2); ctx.fillStyle = colors[a.r]; ctx.fillRect(a.x + (f ? 0 : 2), a.y + 6, 2, 2); ctx.fillRect(a.x + (f ? 10 : 8), a.y + 6, 2, 2); });
      ctx.fillStyle = '#6bff7a'; ctx.fillRect(s.x, H - 16, 16, 6); ctx.fillRect(s.x + 6, H - 20, 4, 4);
      if (s.shot) { ctx.fillStyle = '#fff'; ctx.fillRect(s.shot.x - 1, s.shot.y, 2, 6); }
      ctx.fillStyle = '#ff5a5a'; s.eb.forEach(function (b) { ctx.fillRect(b.x - 1, b.y, 2, 5); });
      ctx.fillStyle = '#334'; ctx.fillRect(0, H - 8, W, 1);
      return 'SCORE ' + s.score + '　WAVE ' + s.wave + '　' + '♥'.repeat(Math.max(0, s.life)); }
  };

  /* ===== クレーンゲーム ===== */
  var PZ = ['#ff8fab', '#ffd23f', '#8ecae6', '#b8f2a6', '#cdb4db', '#ffb703'];
  var crane = {
    name: 'クレーンゲーム', key: 'crane', help: '← → うごかす ／ A アームを下ろす（5回まで）',
    reset: function () { this.x = 80; this.y = 30; this.st = 'move'; this.left = 5; this.got = 0; this.hold = null; this.over = false;
      this.pz = []; for (var i = 0; i < 7; i++) this.pz.push({ x: 46 + i * 15 + rnd(6), y: 214 - (i % 2) * 10, r: 9 + rnd(3), c: PZ[rnd(PZ.length)] }); },
    step: function (dt) { var s = this; if (s.over) return;
      if (s.st === 'move') { if (held.left) s.x = Math.max(40, s.x - dt * .07); if (held.right) s.x = Math.min(W - 14, s.x + dt * .07); }
      else if (s.st === 'down') { s.y += dt * .08; var t = null; s.pz.forEach(function (p) { if (Math.abs(p.x - s.x) < p.r + 4 && s.y + 10 > p.y - p.r) t = t || p; });
        if (t || s.y > 222) { s.st = 'up'; if (t && Math.abs(t.x - s.x) < t.r * .7 && Math.random() < .75) { s.hold = t; s.slip = Math.random() < .3 ? 60 + rnd(60) : -1; } } }
      else if (s.st === 'up') { s.y -= dt * .07; if (s.hold) { s.hold.x = s.x; s.hold.y = s.y + 18; if (s.slip > 0 && s.y < s.slip) { s.hold.y += 0; s.drop = s.hold; s.hold = null; } }
        if (s.y <= 30) { s.y = 30; s.st = 'back'; } }
      else if (s.st === 'back') { s.x -= dt * .07; if (s.hold) { s.hold.x = s.x; s.hold.y = s.y + 18; } if (s.x <= 20) { s.x = 20; if (s.hold) { s.got++; s.pz.splice(s.pz.indexOf(s.hold), 1); s.hold = null; } s.st = 'ret'; } }
      else if (s.st === 'ret') { s.x += dt * .09; if (s.x >= 80) { s.x = 80; s.left--; s.st = 'move'; if (s.left <= 0 || !s.pz.length) { s.over = true; s.score = s.got; } } }
      if (s.drop) { s.drop.y += dt * .15; if (s.drop.y >= 214) { s.drop.y = 214; s.drop = null; } }
      s.score = s.got; },
    input: function (k) { if (k === 'a' && this.st === 'move' && !this.over) this.st = 'down'; },
    draw: function () { var s = this; clear('#1d0f33');
      ctx.fillStyle = '#2d1b4e'; ctx.fillRect(0, 0, W, 20); for (var i = 0; i < 8; i++) { ctx.fillStyle = i % 2 ? '#ff4fd8' : '#ffd23f'; ctx.fillRect(i * 20 + 6, 6, 8, 8); }
      ctx.fillStyle = '#0f0820'; ctx.fillRect(4, 196, 30, 40); ctx.strokeStyle = '#ffd23f'; ctx.strokeRect(4.5, 196.5, 29, 39); txt('GET', 19, 190, 9, '#ffd23f');
      ctx.fillStyle = '#3a2a5a'; ctx.fillRect(36, 226, W - 36, 14);
      s.pz.forEach(function (p) { ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill(); ctx.beginPath(); ctx.arc(p.x - p.r * .6, p.y - p.r * .8, p.r * .35, 0, 7); ctx.arc(p.x + p.r * .6, p.y - p.r * .8, p.r * .35, 0, 7); ctx.fill(); ctx.fillStyle = '#000'; ctx.fillRect(p.x - 4, p.y - 2, 2, 2); ctx.fillRect(p.x + 2, p.y - 2, 2, 2); });
      ctx.strokeStyle = '#ccc'; ctx.beginPath(); ctx.moveTo(s.x, 20); ctx.lineTo(s.x, s.y); ctx.stroke();
      ctx.fillStyle = '#ddd'; ctx.fillRect(s.x - 8, s.y, 16, 5); var open = s.st === 'down' || s.st === 'move';
      ctx.fillRect(s.x - (open ? 11 : 7), s.y + 5, 3, 12); ctx.fillRect(s.x + (open ? 8 : 4), s.y + 5, 3, 12);
      return 'GET ' + s.got + '　のこり ' + Math.max(0, s.left) + ' 回'; }
  };

  /* ===== じゃんけんポン（メダルゲーム風）=====
     白い筐体・赤いルーレット・ネオンの手・青い回転灯。勝つとルーレットが回って、止まった数だけメダルが増える */
  var RING = [1, 2, 4, 1, 2, 7, 1, 2, 4, 1, 2, 20];
  var janken = {
    name: 'じゃんけんポン', key: 'janken', help: 'メダル1枚で勝負！ 勝つとルーレット',
    reset: function () { this.st = 'ready'; this.me = -1; this.cpu = rnd(3); this.res = ''; this.medal = 10; this.score = 10; this.best = 10; this.t = 0; this.over = false; this.aiko = false; this.pos = 0; this.win = 0; this.spin = 0; },
    step: function (dt) { var s = this; s.t += dt;
      if (s.st === 'shout' && s.t > 900) { s.st = 'show'; s.t = 0; s.cpu = rnd(3); var d = (s.me - s.cpu + 3) % 3;
        if (d === 0) { s.res = 'あいこ'; s.aiko = true; }
        else if (d === 2) { s.res = 'かち'; s.aiko = false; s.st = 'roul'; s.spin = 28 + rnd(12); s.rt = 0; }
        else { s.res = 'まけ'; s.aiko = false; if (s.medal <= 0) s.over = true; } }
      if (s.st === 'roul') { s.rt += dt; var iv = 40 + Math.max(0, 28 - s.spin) * 22; if (s.rt > iv) { s.rt = 0; s.pos = (s.pos + 1) % 12; s.spin--; if (s.spin <= 0) { s.win = RING[s.pos]; s.medal += s.win + 1; s.st = 'show'; s.t = 0; } } }
      s.best = Math.max(s.best, s.medal); s.score = s.best; },
    input: function (k) { var s = this; if (typeof k !== 'number' || s.over || s.st === 'shout' || s.st === 'roul') return;
      if (!s.aiko) { if (s.medal <= 0) { s.over = true; return; } s.medal--; } s.win = 0; s.me = k; s.st = 'shout'; s.t = 0; s.res = ''; },
    neon: function (h, cx, cy) { /* ネオン管の手（元のデザイン） */
      ctx.save(); ctx.translate(cx, cy); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      for (var pass = 0; pass < 2; pass++) {
        ctx.strokeStyle = pass ? '#fff' : '#ff3b3b'; ctx.lineWidth = pass ? 1.6 : 5; ctx.shadowColor = '#ff2020'; ctx.shadowBlur = pass ? 6 : 12;
        ctx.beginPath();
        if (h === 0) { ctx.moveTo(-16, 6); ctx.quadraticCurveTo(-18, -14, -6, -16); ctx.quadraticCurveTo(10, -18, 16, -8); ctx.quadraticCurveTo(20, 8, 6, 16); ctx.quadraticCurveTo(-12, 20, -16, 6);
          ctx.moveTo(-8, -8); ctx.lineTo(10, -8); ctx.moveTo(-8, 0); ctx.lineTo(10, 0); ctx.moveTo(-6, 8); ctx.lineTo(8, 8); }
        if (h === 1) { ctx.moveTo(-14, 18); ctx.quadraticCurveTo(-18, 0, -8, -2); ctx.lineTo(-14, -26); ctx.quadraticCurveTo(-10, -30, -6, -26); ctx.lineTo(0, -6); ctx.lineTo(6, -28); ctx.quadraticCurveTo(10, -31, 13, -27); ctx.lineTo(8, -2); ctx.quadraticCurveTo(18, 4, 12, 18); ctx.closePath();
          ctx.moveTo(-4, 6); ctx.lineTo(6, 6); }
        if (h === 2) { ctx.moveTo(-14, 20); ctx.lineTo(-16, 2); ctx.lineTo(-26, -10); ctx.quadraticCurveTo(-26, -15, -20, -12); ctx.lineTo(-12, -4);
          [[-12, -28], [-3, -32], [6, -30], [14, -22]].forEach(function (f, k) { var bx = -10 + k * 7; ctx.lineTo(bx, -6); ctx.lineTo(f[0], f[1]); ctx.quadraticCurveTo(f[0] + 3, f[1] - 4, f[0] + 6, f[1]); ctx.lineTo(bx + 5, -6); });
          ctx.lineTo(16, 4); ctx.lineTo(10, 20); ctx.closePath(); }
        ctx.stroke();
      }
      ctx.restore(); },
    draw: function () { var s = this, t = Date.now();
      ctx.fillStyle = '#f4f2ea'; ctx.fillRect(0, 0, W, H);
      /* 回転灯 */
      var lit = s.st === 'roul' || (s.st === 'show' && s.res === 'かち' && s.t < 2500);
      ctx.fillStyle = '#111'; ctx.fillRect(66, 18, 28, 6);
      ctx.fillStyle = lit ? '#3a7bff' : '#1b2f88'; ctx.beginPath(); ctx.moveTo(68, 18); ctx.lineTo(70, 4); ctx.quadraticCurveTo(80, -2, 90, 4); ctx.lineTo(92, 18); ctx.fill();
      if (lit) { var a = (t / 120) % (Math.PI * 2); ctx.fillStyle = 'rgba(120,170,255,.35)'; ctx.beginPath(); ctx.moveTo(80, 10); ctx.arc(80, 10, 60, a, a + .5); ctx.fill(); }
      /* 看板 */
      ctx.fillStyle = '#e8262b'; ctx.fillRect(8, 28, 144, 16); txt('じゃんけんポン', 50, 36, 10, '#fff'); ctx.fillStyle = '#ffd23f'; ctx.fillRect(98, 30, 50, 12); txt('メダル', 123, 36, 8, '#e8262b');
      /* 外側の「かち・まけ・あいこ」 */
      txt('かち', 22, 62, 10, s.res === 'かち' ? '#e8262b' : '#bbb'); txt('かち', 138, 62, 10, s.res === 'かち' ? '#e8262b' : '#bbb');
      txt('まけ', 22, 168, 10, s.res === 'まけ' ? '#1b2f88' : '#bbb'); txt('あいこ', 136, 168, 10, s.res === 'あいこ' ? '#0a8a3a' : '#bbb');
      /* ルーレット */
      var cx = 80, cy = 112, R = 54;
      ctx.fillStyle = '#7a0d10'; ctx.beginPath(); ctx.arc(cx, cy, R + 6, 0, 7); ctx.fill();
      ctx.fillStyle = '#c41c22'; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fill();
      for (var k = 0; k < 12; k++) { var ang = -Math.PI / 2 + k * Math.PI / 6, x = cx + Math.cos(ang) * (R - 10), y = cy + Math.sin(ang) * (R - 10);
        var on = (s.st === 'roul' || (s.st === 'show' && s.res === 'かち')) && k === s.pos;
        ctx.fillStyle = on ? '#fff36b' : (RING[k] >= 7 ? '#ff8a00' : '#ffd23f'); if (on) { ctx.shadowColor = '#fff36b'; ctx.shadowBlur = 10; }
        ctx.beginPath(); ctx.arc(x, y, 7.5, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
        txt(String(RING[k]), x, y + .5, RING[k] >= 10 ? 7 : 8, on ? '#c41c22' : '#7a0d10'); }
      ctx.fillStyle = '#2a0204'; ctx.beginPath(); ctx.arc(cx, cy, R - 20, 0, 7); ctx.fill();
      /* まんなかのネオンの手 */
      var hand = s.st === 'shout' ? Math.floor(t / 110) % 3 : (s.st === 'ready' ? Math.floor(t / 700) % 3 : s.cpu);
      if (s.st !== 'ready' || (t >> 9) & 1) s.neon(hand, cx, cy + 2);
      /* 文字 */
      if (s.st === 'shout') txt(s.aiko ? 'しょ！' : (s.t < 450 ? 'じゃん けん…' : 'ポン！'), 80, 182, 13, '#e8262b');
      else if (s.st === 'roul') txt('ルーレット！', 80, 182, 12, '#e8262b');
      else if (s.st === 'show') txt(s.res === 'かち' ? 'かち！ メダル ×' + s.win : s.res === 'まけ' ? 'まけ…' : 'あいこで…', 80, 182, 12, s.res === 'かち' ? '#e8262b' : s.res === 'まけ' ? '#1b2f88' : '#0a8a3a');
      else txt('ボタンをおしてね', 80, 182, 10, '#555');
      /* メダルの受け皿 */
      ctx.fillStyle = '#ddd8c8'; ctx.fillRect(10, 196, 140, 40); ctx.fillStyle = '#c9c2ad'; ctx.fillRect(14, 214, 132, 18);
      for (var m = 0; m < Math.min(s.medal, 24); m++) { ctx.fillStyle = '#d9b44a'; ctx.beginPath(); ctx.arc(22 + (m % 12) * 10, 228 - Math.floor(m / 12) * 6, 4, 0, 7); ctx.fill(); ctx.strokeStyle = '#8a6a10'; ctx.stroke(); }
      txt('MEDAL ' + s.medal, 80, 204, 9, '#333');
      return 'メダル ' + s.medal + ' 枚'; }
  };

  var GAMES = [block, space, crane, janken], cur = null, running = false, last = 0, visible = true, started = false;
  function hud(extra) { var hi = hiGet(cur.key); info.textContent = (extra || '') + (hi ? '　HI ' + hi : ''); }
  function frame(ts) {
    if (!running) return; var dt = Math.min(50, ts - (last || ts)); last = ts;
    if (started && !cur.over) cur.step(dt);
    var line = cur.draw();
    if (!started) { ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.fillRect(0, 86, W, 70); txt(cur.name, 80, 104, 13, '#ffd23f'); txt(cur.key === 'janken' ? 'ボタンをおしてスタート' : 'A ボタンでスタート', 80, 126, 10, '#fff'); txt(cur.help, 80, 144, 7.5, '#9fb3d9'); }
    if (cur.over) { if (cur.score > hiGet(cur.key)) hiSet(cur.key, cur.score); ctx.fillStyle = 'rgba(0,0,0,.65)'; ctx.fillRect(0, 92, W, 56); txt('GAME OVER', 80, 110, 14, '#ff5a5a'); txt(cur.key === 'janken' ? 'メダルがなくなった… ボタンでもう一回' : 'A でもう一回', 80, 132, cur.key === 'janken' ? 8.5 : 10, '#fff'); }
    hud(line);
    if ((!started || cur.over) && cur.key !== 'janken') { running = false; return; } // 止まっている画面は描きつづけない
    if (visible && !document.hidden) requestAnimationFrame(frame); else running = false;
  }
  function run() { if (!running && visible && !document.hidden) { running = true; last = 0; requestAnimationFrame(frame); } }
  function pick(i) {
    cur = GAMES[i]; cur.reset(); started = false;
    Array.prototype.forEach.call(root.querySelectorAll('.mg-tabs button'), function (b, k) { b.setAttribute('aria-pressed', k === i ? 'true' : 'false'); });
    pad.hidden = cur.key === 'janken'; jpad.hidden = cur.key !== 'janken';
    try { localStorage.setItem('gt-mg-last', String(i)); } catch (e) {}
    run();
  }
  function press(k) {
    if (!cur) return;
    if (cur.over) { if (k === 'a' || typeof k === 'number') { cur.reset(); started = true; if (typeof k === 'number') cur.input(k); } run(); return; }
    if (!started) { if (k === 'a' || typeof k === 'number') { started = true; try { if (window.gtag) gtag('event', 'minigame_play', { game: cur.key }); } catch (e) {} if (typeof k === 'number') cur.input(k); } run(); return; }
    cur.input(k); run();
  }
  Array.prototype.forEach.call(root.querySelectorAll('.mg-tabs button'), function (b, i) { b.addEventListener('click', function () { pick(i); }); });
  Array.prototype.forEach.call(root.querySelectorAll('[data-k]'), function (b) {
    var k = b.getAttribute('data-k'); k = /^\d$/.test(k) ? +k : k; var rep = null;
    function down(e) { e.preventDefault(); held[k] = true; press(k); if (k === 'left' || k === 'right' || k === 'down') { clearInterval(rep); rep = setInterval(function () { if (cur && cur.key === 'block' && started) press(k); }, 110); } }
    function up() { held[k] = false; clearInterval(rep); }
    b.addEventListener('pointerdown', down); b.addEventListener('pointerup', up); b.addEventListener('pointerleave', up); b.addEventListener('pointercancel', up);
    b.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); press(k); } });
  });
  var KEYS = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down', ' ': 'a', z: 'a', Z: 'a', Enter: 'a', '1': 0, '2': 1, '3': 2 };
  var screen = root.querySelector('.mg-screen');
  screen.addEventListener('keydown', function (e) { var k = KEYS[e.key]; if (k === undefined) return; e.preventDefault(); if (!held[k]) press(k); held[k] = true; });
  screen.addEventListener('keyup', function (e) { var k = KEYS[e.key]; if (k !== undefined) held[k] = false; });
  screen.addEventListener('blur', function () { held = {}; });
  screen.addEventListener('click', function () { screen.focus({ preventScroll: true }); if (!started || (cur && cur.over)) press(cur && cur.key === 'janken' ? 'noop' : 'a'); });
  if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; if (visible) run(); }).observe(root);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) run(); });
  var lastI = 0; try { lastI = Math.min(3, +localStorage.getItem('gt-mg-last') || 0); } catch (e) {}
  pick(lastI);
})();
