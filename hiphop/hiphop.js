/* HIP HOP ブース
   ・ターンテーブル：レコードをドラッグすると、まわした速さに合わせてスクラッチの音が出る
   ・年表：世界／日本でしぼりこみ
   ・教科書：開いた章に ✓（この端末の localStorage だけに記録）
   ・ビートラボ：ブーンバップとトラップを、ブラウザで合成したドラムとベースで鳴らす（録音は使わない・オリジナルのパターン） */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function ga(n, p) { try { if (window.gtag) gtag('event', n, p || {}); } catch (e) {} }

  /* ---------- 音のしくみ ---------- */
  var AC = null, master = null, noiseBuf = null;
  function ctx() {
    if (AC) { if (AC.state === 'suspended') AC.resume(); return AC; }
    AC = new (window.AudioContext || window.webkitAudioContext)();
    var comp = AC.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 4;
    master = AC.createGain(); master.gain.value = .7; master.connect(comp); comp.connect(AC.destination);
    noiseBuf = AC.createBuffer(1, AC.sampleRate, AC.sampleRate); var d = noiseBuf.getChannelData(0); for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return AC;
  }
  function env(g, t, a, peak, dec) { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + dec); }
  function noise(t, dur, type, freq, peak, q) {
    var s = AC.createBufferSource(); s.buffer = noiseBuf; var f = AC.createBiquadFilter(); f.type = type; f.frequency.value = freq; if (q) f.Q.value = q;
    var g = AC.createGain(); env(g, t, .002, peak, dur); s.connect(f); f.connect(g); g.connect(master); s.start(t, Math.random() * .5); s.stop(t + dur + .05);
  }
  function tone(t, type, f0, f1, glide, dur, peak) {
    var o = AC.createOscillator(), g = AC.createGain(); o.type = type; o.frequency.setValueAtTime(f0, t); if (f1) o.frequency.exponentialRampToValueAtTime(f1, t + glide);
    env(g, t, .004, peak, dur); o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + .05);
  }
  var VOICES = {
    boombap: {
      kick: function (t) { tone(t, 'sine', 140, 46, .11, .42, 1); noise(t, .02, 'lowpass', 2500, .25); },
      snare: function (t) { noise(t, .2, 'highpass', 1400, .55); tone(t, 'triangle', 210, 160, .05, .09, .35); },
      hat: function (t, acc) { noise(t, acc ? .06 : .035, 'highpass', 7200, acc ? .22 : .13); },
      bass: function (t, n) { tone(t, 'triangle', n, 0, 0, .32, .55); }
    },
    trap: {
      kick: function (t) { tone(t, 'sine', 170, 50, .06, .22, .9); },
      snare: function (t) { [0, .011, .022].forEach(function (o) { noise(t + o, .09, 'bandpass', 1600, .45, .8); }); noise(t + .03, .22, 'highpass', 1200, .25); },
      hat: function (t, acc) { noise(t, .025, 'highpass', 8500, acc ? .2 : .12); },
      bass: function (t, n) { tone(t, 'sine', n * 1.5, n, .07, .85, .8); tone(t, 'sine', n * 2, n * 2, 0, .15, .12); }
    }
  };
  /* パターン：16ステップ。数字はベースの音の高さ（Hz）。h2 は、そのステップをさらに細かく刻む（トラップのハイハット・ロール） */
  var A1 = 55, C2 = 65.41, D2 = 73.42, E2 = 82.41, G1 = 49, F1 = 43.65;
  var PAT = {
    boombap: { bpm: 90, swing: .58, kick: [0, 7, 10], snare: [4, 12], hat: [0, 2, 4, 6, 8, 10, 12, 14], acc: [0, 8],
      bass: { 0: A1, 7: C2, 10: A1 } },
    trap: { bpm: 140, swing: .5, kick: [0, 3, 7, 10, 14], snare: [8], hat: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], acc: [0, 4, 8, 12], roll: [6, 7, 14, 15],
      bass: { 0: D2, 3: D2, 7: F1, 10: G1, 14: E2 } }
  };
  var PARTS = [['kick', 'キック', '#ffd21f'], ['snare', 'スネア', '#ff4fa3'], ['hat', 'ハイハット', '#00d1ff'], ['bass', 'ベース（808）', '#7dff6a']];
  var style = 'boombap', on = { kick: true, snare: true, hat: true, bass: true }, playing = false, step = 0, nextT = 0, timer = null, queue = [];

  var grid = $('#hh-grid'), cells = {};
  function drawGrid() {
    grid.textContent = ''; var P = PAT[style];
    PARTS.forEach(function (pt) {
      var lab = document.createElement('span'); lab.className = 'lab'; lab.textContent = pt[1].replace('（808）', ''); grid.appendChild(lab); cells[pt[0]] = [];
      for (var i = 0; i < 16; i++) {
        var c = document.createElement('i'), has = pt[0] === 'bass' ? P.bass[i] != null : P[pt[0]].indexOf(i) >= 0;
        if (has) { c.className = 'on'; c.style.setProperty('--k', pt[2]); } if (!on[pt[0]]) c.classList.add('off');
        grid.appendChild(c); cells[pt[0]].push(c);
      }
    });
  }
  var partsBox = $('.hh-parts');
  PARTS.forEach(function (pt) {
    var b = document.createElement('button'); b.type = 'button'; b.textContent = pt[1]; b.style.setProperty('--k', pt[2]); b.setAttribute('aria-pressed', 'true');
    b.addEventListener('click', function () { on[pt[0]] = !on[pt[0]]; b.setAttribute('aria-pressed', on[pt[0]] ? 'true' : 'false'); cells[pt[0]].forEach(function (c) { c.classList.toggle('off', !on[pt[0]]); }); });
    partsBox.appendChild(b);
  });
  $$('.hh-styles button').forEach(function (b) {
    b.addEventListener('click', function () {
      style = b.getAttribute('data-s'); $$('.hh-styles button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      drawGrid(); ga('hiphop_beat', { style: style });
    });
  });
  function schedule(i, t) {
    var P = PAT[style], V = VOICES[style], s16 = 60 / P.bpm / 4;
    if (on.kick && P.kick.indexOf(i) >= 0) V.kick(t);
    if (on.snare && P.snare.indexOf(i) >= 0) V.snare(t);
    if (on.hat && P.hat.indexOf(i) >= 0) { V.hat(t, P.acc.indexOf(i) >= 0); if (P.roll && P.roll.indexOf(i) >= 0) { V.hat(t + s16 / 3, false); V.hat(t + s16 * 2 / 3, false); } }
    if (on.bass && P.bass[i] != null) V.bass(t, P.bass[i]);
    queue.push([i, t]);
  }
  function loop() {
    var P = PAT[style], s16 = 60 / P.bpm / 4;
    while (nextT < AC.currentTime + .12) {
      var sw = step % 2 ? (P.swing - .5) * 2 * s16 : 0; // 裏のステップを少しうしろへ（ブーンバップのはね）
      schedule(step, nextT + sw); nextT += s16; step = (step + 1) % 16;
    }
    timer = setTimeout(loop, 25);
  }
  var lastLit = -1;
  function paint() {
    if (!playing) return;
    while (queue.length && queue[0][1] <= AC.currentTime) { var i = queue.shift()[0]; if (lastLit >= 0) PARTS.forEach(function (pt) { cells[pt[0]][lastLit].classList.remove('now'); }); PARTS.forEach(function (pt) { cells[pt[0]][i].classList.add('now'); }); lastLit = i; }
    requestAnimationFrame(paint);
  }
  var play = $('#hh-play');
  play.addEventListener('click', function () {
    if (playing) { playing = false; clearTimeout(timer); queue = []; if (lastLit >= 0) PARTS.forEach(function (pt) { cells[pt[0]][lastLit].classList.remove('now'); }); lastLit = -1;
      play.setAttribute('aria-pressed', 'false'); $('.i', play).textContent = '▶'; $('.t', play).textContent = '再生'; return; }
    ctx(); playing = true; step = 0; nextT = AC.currentTime + .06; loop(); paint();
    play.setAttribute('aria-pressed', 'true'); $('.i', play).textContent = '■'; $('.t', play).textContent = 'ストップ'; ga('hiphop_play', { style: style });
  });
  document.addEventListener('visibilitychange', function () { if (document.hidden && playing) play.click(); });
  drawGrid();

  /* ---------- ターンテーブル（スクラッチ） ---------- */
  var vinyl = $('#hh-vinyl');
  if (vinyl) {
    var dragging = false, lastA = 0, rot = 0, src = null, bp = null, sg = null, lastT = 0;
    function angle(e) { var r = vinyl.getBoundingClientRect(); return Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180 / Math.PI; }
    vinyl.addEventListener('pointerdown', function (e) {
      dragging = true; vinyl.setPointerCapture(e.pointerId);
      var m = getComputedStyle(vinyl).transform; if (m && m !== 'none') { var v = m.split('(')[1].split(')')[0].split(','); rot = Math.atan2(+v[1], +v[0]) * 180 / Math.PI; }
      vinyl.classList.add('grab'); vinyl.style.transform = 'rotate(' + rot + 'deg)'; lastA = angle(e); lastT = performance.now();
      try {
        ctx(); src = AC.createBufferSource(); src.buffer = noiseBuf; src.loop = true; bp = AC.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 3; bp.frequency.value = 400;
        sg = AC.createGain(); sg.gain.value = 0; src.connect(bp); bp.connect(sg); sg.connect(master); src.start();
      } catch (err) {}
    });
    vinyl.addEventListener('pointermove', function (e) {
      if (!dragging) return; var a = angle(e), d = a - lastA; if (d > 180) d -= 360; if (d < -180) d += 360; lastA = a; rot += d; vinyl.style.transform = 'rotate(' + rot + 'deg)';
      var now = performance.now(), v = Math.abs(d) / Math.max(8, now - lastT) * 16; lastT = now;
      if (sg) { var t = AC.currentTime; sg.gain.setTargetAtTime(Math.min(.9, v * .09), t, .015); bp.frequency.setTargetAtTime(250 + Math.min(3000, v * 260) * (d > 0 ? 1 : .7), t, .015); }
    });
    function up() {
      if (!dragging) return; dragging = false; vinyl.classList.remove('grab'); vinyl.style.transform = '';
      if (sg) { sg.gain.setTargetAtTime(0, AC.currentTime, .02); var s = src; setTimeout(function () { try { s.stop(); } catch (e) {} }, 150); src = bp = sg = null; }
      ga('hiphop_scratch');
    }
    vinyl.addEventListener('pointerup', up); vinyl.addEventListener('pointercancel', up);
  }

  /* ---------- 年表のしぼりこみ ---------- */
  $$('.hh-filter button').forEach(function (b) {
    b.addEventListener('click', function () {
      var f = b.getAttribute('data-f'); $$('.hh-filter button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      $$('.hh-tl li').forEach(function (li, i) { var show = f === 'all' || li.getAttribute('data-k') === f; li.hidden = !show; li.classList.remove('in'); if (show && !calm) { void li.offsetWidth; li.style.animationDelay = (i * .03) + 's'; li.classList.add('in'); } });
    });
  });

  /* ---------- 教科書：読んだ章 ---------- */
  var read = []; try { read = JSON.parse(localStorage.getItem('hh-read') || '[]') || []; } catch (e) {}
  var tracks = $$('.hh-track'), nOut = $('#hh-read-n');
  function paintRead() { tracks.forEach(function (d) { d.classList.toggle('read', read.indexOf(d.getAttribute('data-n')) >= 0); }); if (nOut) nOut.textContent = read.length ? '（' + read.length + ' / ' + tracks.length + ' 章 読んだ' + (read.length === tracks.length ? '！ 全部読破 🎉' : '') + '）' : ''; }
  tracks.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (!d.open) return; var n = d.getAttribute('data-n');
      if (read.indexOf(n) < 0) { read.push(n); try { localStorage.setItem('hh-read', JSON.stringify(read)); } catch (e) {} paintRead(); ga('hiphop_read', { ch: n }); }
    });
  });
  paintRead();
})();
