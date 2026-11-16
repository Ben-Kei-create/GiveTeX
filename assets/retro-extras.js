/* 昔のホームページの「おまけ」いろいろ（90年代風のページで読みこむ）
   - BGM プレイヤー（オリジナル曲を Web Audio で演奏。押したときだけ鳴る）
   - 今日のおみくじ（1日1回）
   - Web拍手
   - 隠しコマンド（↑↑↓↓←→←→BA、スマホはロゴを7回タップ）
   - 右クリックしたときのジョーク（禁止はしません） */
(function () {
  'use strict';
  function $(id) { return document.getElementById(id); }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  function ga(n, p) { try { if (window.gtag) gtag('event', n, p || {}); } catch (e) {} }
  function toast(msg, ms) {
    var t = document.createElement('div'); t.className = 'r-toast'; t.textContent = msg; t.setAttribute('role', 'status');
    document.body.appendChild(t); setTimeout(function () { t.className += ' out'; }, ms || 2600); setTimeout(function () { t.remove(); }, (ms || 2600) + 500);
  }

  /* ===== BGM（オリジナル曲。ファミコン風の音で演奏） ===== */
  var AC = null;
  function ac() { if (!AC) { var C = window.AudioContext || window.webkitAudioContext; if (!C) return null; AC = new C(); } if (AC.state === 'suspended') AC.resume(); return AC; }
  var N = { C4: 261.6, D4: 293.7, E4: 329.6, F4: 349.2, G4: 392, A4: 440, B4: 493.9, C5: 523.3, D5: 587.3, E5: 659.3, F5: 698.5, G5: 784, A5: 880, C3: 130.8, F3: 174.6, G3: 196, A3: 220, E3: 164.8, D3: 146.8 };
  var SONGS = [
    { name: 'GiveTex のテーマ', bpm: 132, lead: 'E5 E5 G5 E5 C5 D5 E5 - G5 A5 G5 E5 D5 C5 D5 - E5 E5 G5 A5 G5 E5 C5 D5 E5 D5 C5 D5 C5 - - -', bass: 'C3 G3 C3 G3 F3 C4 F3 C4 A3 E4 A3 E4 G3 D4 G3 D4' },
    { name: 'ほしぞらワルツ', bpm: 108, lead: 'C5 E5 G5 A5 G5 E5 F5 E5 D5 C5 - - D5 F5 A5 G5 F5 D5 E5 D5 C5 B4 - - C5 E5 G5 C5 - G5 A5 G5 F5 E5 - -', bass: 'C3 G3 G3 F3 C4 C4 G3 D4 D4 C3 G3 G3' },
    { name: 'ほうかごチップチューン', bpm: 150, lead: 'A4 C5 E5 C5 A4 C5 E5 A5 G5 E5 C5 E5 G5 - - - F5 A5 C5 A4 F5 E5 D5 C5 B4 D5 G5 D5 B4 - - -', bass: 'A3 A3 E4 A3 C4 C4 G3 C4 F3 F3 C4 F3 G3 G3 D4 G3' }
  ];
  var playing = null, timer = null, songIdx = 0;
  function tone(f, t, d, type, vol) {
    var a = ac(); if (!a || !f) return;
    var o = a.createOscillator(), g = a.createGain(); o.type = type; o.frequency.value = f;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .01); g.gain.exponentialRampToValueAtTime(.0001, t + d);
    o.connect(g); g.connect(a.destination); o.start(t); o.stop(t + d + .02);
  }
  function play(i) {
    stop(); var a = ac(); if (!a) return; var s = SONGS[i], beat = 60 / s.bpm / 2, lead = s.lead.split(' '), bass = s.bass.split(' '), k = 0, t0 = a.currentTime + .05;
    playing = i; try { window.dispatchEvent(new CustomEvent('gt-sound', { detail: 'bgm' })); } catch (e) {}
    function sched() {
      while (t0 < a.currentTime + .3) {
        var n = lead[k % lead.length]; if (n !== '-') tone(N[n], t0, beat * .9, 'square', .035);
        if (k % 2 === 0) { var b = bass[(k / 2) % bass.length]; tone(N[b], t0, beat * 1.8, 'triangle', .06); }
        t0 += beat; k++;
      }
    }
    sched(); timer = setInterval(sched, 100);
  }
  function stop() { clearInterval(timer); timer = null; playing = null; }
  var bgm = $('r-bgm');
  if (bgm) {
    var sel = bgm.querySelector('select'), btn = bgm.querySelector('button'), now = bgm.querySelector('.r-bgm-now');
    SONGS.forEach(function (s, i) { var o = document.createElement('option'); o.value = i; o.textContent = s.name; sel.appendChild(o); });
    function ui() { btn.textContent = playing === null ? '▶ さいせい' : '■ ストップ'; now.textContent = playing === null ? 'BGM は OFF です' : '♪ ' + SONGS[playing].name + ' をさいせい中…'; bgm.classList.toggle('on', playing !== null); }
    btn.addEventListener('click', function () { if (playing === null) { play(+sel.value); ga('bgm_play', { song: SONGS[+sel.value].name }); } else stop(); ui(); });
    sel.addEventListener('change', function () { if (playing !== null) play(+sel.value); ui(); });
    document.addEventListener('visibilitychange', function () { if (document.hidden && playing !== null) { stop(); ui(); } });
    window.addEventListener('gt-sound', function (e) { if (e.detail === 'game' && playing !== null) { stop(); ui(); } });
    ui();
  }

  /* ===== 今日のおみくじ（1日1回、日付がかわるとまた引ける） ===== */
  var omi = $('r-omikuji');
  if (omi) {
    var R = [['大吉', '#d10056', 'なにをやってもうまくいく日。新しいことをはじめよう！'], ['中吉', '#e05a00', 'いい流れ。気になっていたことに手をつけてみて。'], ['小吉', '#b08000', 'ちいさな発見がある日。寄り道がおすすめ。'],
             ['吉', '#008000', 'いつもどおりが一番。コツコツいこう。'], ['末吉', '#0060a0', 'あとからいいことがやってくる。あせらずに。'], ['凶', '#555', 'こんな日もある。早めに寝ればだいじょうぶ！']];
    var LUCKY = [['ドパ読！', '/books/'], ['どろん', '/doron/'], ['ゲームコーナー', '/#mg'], ['開発日記', '/diary/'], ['スタンプブース', '/stamp/'], ['映画ブース', '/movie/'], ['ラーメンブース', '/ramen/'], ['ゲストブック', '/guestbook/'], ['美術館ブース', '/museum/'], ['note ブース', '/note/']];
    var day = new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10);
    var res = omi.querySelector('.r-omi-res'), b = omi.querySelector('button');
    function show(v) {
      var r = R[v[0]], l = LUCKY[v[1]]; res.innerHTML = '';
      var big = document.createElement('p'); big.className = 'r-omi-big'; big.style.color = r[1]; big.textContent = r[0]; res.appendChild(big);
      var p = document.createElement('p'); p.textContent = r[2]; res.appendChild(p);
      var p2 = document.createElement('p'); p2.className = 'r-small'; p2.appendChild(document.createTextNode('ラッキーブース：')); var a = document.createElement('a'); a.href = l[1]; a.textContent = l[0]; p2.appendChild(a); res.appendChild(p2);
      b.disabled = true; b.textContent = 'また明日ひいてね';
    }
    var saved = (store('gt-omikuji') || '').split('|');
    if (saved[0] === day) show([+saved[1], +saved[2]]);
    b.addEventListener('click', function () {
      if (b.disabled) return; b.disabled = true; var k = 0, w = [10, 20, 25, 25, 12, 8];
      var spin = setInterval(function () { res.textContent = 'ガラガラ…　' + R[k++ % R.length][0]; }, 70);
      setTimeout(function () {
        clearInterval(spin); var x = Math.random() * 100, v = 0; for (; v < w.length - 1; v++) { x -= w[v]; if (x < 0) break; }
        var lk = Math.floor(Math.random() * LUCKY.length); store('gt-omikuji', day + '|' + v + '|' + lk); show([v, lk]); ga('omikuji', { result: R[v][0] });
      }, 900);
    });
  }

  /* ===== Web拍手 ===== */
  Array.prototype.forEach.call(document.querySelectorAll('.r-clap'), function (box) {
    var page = box.getAttribute('data-page'), btn = box.querySelector('button'), cnt = box.querySelector('.r-clap-n'), msg = box.querySelector('input'), out = box.querySelector('.r-clap-out');
    fetch('/api/clap?page=' + encodeURIComponent(page)).then(function (r) { return r.json(); }).then(function (j) { if (j.ok) cnt.textContent = j.n; else box.hidden = true; })['catch'](function () { box.hidden = true; });
    btn.addEventListener('click', function () {
      btn.disabled = true;
      fetch('/api/clap', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ page: page, msg: msg ? msg.value : '' }) })
        .then(function (r) { return r.json(); })
        .then(function (j) { if (j.ok) { cnt.textContent = j.n; out.textContent = j.thanks; if (msg) msg.value = ''; ga('web_clap', { page: page }); } else out.textContent = j.error || 'いまは拍手できませんでした'; })
        ['catch'](function () { out.textContent = 'いまは拍手できませんでした'; })
        .then(function () { setTimeout(function () { btn.disabled = false; }, 1500); });
    });
  });

  /* ===== 隠しコマンド ===== */
  function secret() {
    if (document.querySelector('.r-secret')) return;
    var first = !store('gt-secret'); store('gt-secret', '1');
    var o = document.createElement('div'); o.className = 'r-secret'; o.setAttribute('role', 'dialog'); o.setAttribute('aria-label', '隠しコマンド');
    o.innerHTML = '<div class="r-secret-in"><p class="r-secret-t">★ 隠しコマンド せいこう！ ★</p><p>よくぞ見つけたね！<br>きみは今日から <b>GiveTex 裏技マスター</b> だ。</p><p class="r-small">（このことは、ほかの人にはないしょだよ）</p><button type="button" class="r-btn">とじる</button></div>';
    for (var i = 0; i < 40; i++) { var s = document.createElement('i'); s.style.left = Math.random() * 100 + '%'; s.style.animationDelay = Math.random() * 2 + 's'; s.style.background = ['#ffd23f', '#ff4fd8', '#3ef0ff', '#6bff7a'][i % 4]; o.appendChild(s); }
    document.body.appendChild(o);
    o.querySelector('button').addEventListener('click', function () { o.remove(); });
    o.addEventListener('click', function (e) { if (e.target === o) o.remove(); });
    var a = ac(); if (a) { var t = a.currentTime; ['C5', 'E5', 'G5', 'C5', 'E5', 'G5', 'A5'].forEach(function (n, k) { tone(N[n] * (k > 2 ? 2 : 1), t + k * .09, .12, 'square', .04); }); }
    ga('secret_found', { first: first });
    badge();
  }
  function badge() { var c = $('r-count-label'); if (c && store('gt-secret') && !$('r-master')) { var m = document.createElement('div'); m.id = 'r-master'; m.className = 'r-small r-red'; m.textContent = '★ 裏技マスター ★'; c.parentNode.appendChild(m); } }
  badge();
  var CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'], pos = 0;
  document.addEventListener('keydown', function (e) {
    if (e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
    var k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    pos = k === CODE[pos] ? pos + 1 : (k === CODE[0] ? 1 : 0);
    if (pos === CODE.length) { pos = 0; secret(); }
  });
  var logo = document.querySelector('.r-logo'), taps = 0, tapT = 0;
  if (logo) logo.addEventListener('click', function (e) {
    var now = Date.now(); taps = now - tapT < 600 ? taps + 1 : 1; tapT = now;
    if (location.pathname === '/' || taps >= 3) e.preventDefault(); // ホームではロゴを押しても再読みこみしない
    if (taps >= 7) { taps = 0; secret(); }
  });

  /* ===== 右クリック（禁止はしない、ジョークだけ） ===== */
  document.addEventListener('contextmenu', function (e) {
    if (e.target && /INPUT|TEXTAREA/.test(e.target.tagName)) return;
    var said = false; try { said = sessionStorage.getItem('gt-rc') === '1'; sessionStorage.setItem('gt-rc', '1'); } catch (x) {}
    if (!said) toast('右クリック禁止！……なんてね。ご自由にどうぞ (^^)');
  });
})();

/* ===== 昔のマウスのクリック音（さわったとき）・音のオン／オフ・ホームの「TOP」と「お助けツール」 ===== */
(function () {
  'use strict';
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  var on = store('gt-click') !== 'off', A = null, noise = null;
  function ctx() { if (!A) { var C = window.AudioContext || window.webkitAudioContext; if (!C) return null; A = new C(); } if (A.state === 'suspended') A.resume(); return A; }
  function click(up) {
    if (!on) return; var a = ctx(); if (!a) return;
    if (!noise) { noise = a.createBuffer(1, a.sampleRate * .03, a.sampleRate); var d = noise.getChannelData(0); for (var i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 6); }
    var t = a.currentTime, s = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain();
    s.buffer = noise; f.type = 'bandpass'; f.frequency.value = up ? 3200 : 2200; f.Q.value = 1.2; g.gain.value = up ? .05 : .09;  // ひかえめな音量
    s.connect(f); f.connect(g); g.connect(a.destination); s.start(t);
    var o = a.createOscillator(), og = a.createGain(); o.type = 'square'; o.frequency.setValueAtTime(up ? 1900 : 1300, t); o.frequency.exponentialRampToValueAtTime(400, t + .015);
    og.gain.setValueAtTime(.02, t); og.gain.exponentialRampToValueAtTime(.0001, t + .02); o.connect(og); og.connect(a.destination); o.start(t); o.stop(t + .025);
  }
  document.addEventListener('pointerdown', function (e) { if (e.isPrimary !== false && !(e.target.closest && e.target.closest('.r-snd'))) click(false); }, { passive: true });
  document.addEventListener('pointerup', function (e) { if (e.isPrimary !== false && !(e.target.closest && e.target.closest('.r-snd'))) click(true); }, { passive: true });

  function btn(cls, label, text) { var b = document.createElement('button'); b.type = 'button'; b.className = 'r-fixbtn ' + cls; b.setAttribute('aria-label', label); b.textContent = text; document.body.appendChild(b); return b; }
  function ready(fn) { if (document.body) fn(); else document.addEventListener('DOMContentLoaded', fn); }
  ready(function () {
    /* 音のオン／オフ（右上） */
    var snd = btn('r-snd', 'クリック音のオン・オフ', '');
    function paint() { snd.textContent = on ? '♪ 音 ON' : '♪ 音 OFF'; snd.setAttribute('aria-pressed', on ? 'true' : 'false'); }
    snd.addEventListener('click', function () { on = !on; store('gt-click', on ? 'on' : 'off'); paint(); if (on) click(false); try { window.dispatchEvent(new CustomEvent('gt-sound-toggle', { detail: on })); } catch (e) {} });
    paint();
    if (location.pathname !== '/') return;
    /* ▲ TOP（右下） */
    var top = btn('r-top', 'ページのいちばん上へ', '▲ TOP'); top.hidden = true;
    top.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); });
    addEventListener('scroll', function () { top.hidden = scrollY < 500; }, { passive: true });
    /* お助けツール（左下）：手書きメモと電卓 */
    var tb = btn('r-tools', 'お助けツール（手書きメモ・電卓）', '🧰 お助けツール');
    var win = null;
    tb.addEventListener('click', function () { if (win) { win.hidden = !win.hidden; return; } win = makeTools(); });
  });

  function makeTools() {
    var w = document.createElement('div'); w.className = 'win r-toolwin'; w.setAttribute('role', 'dialog'); w.setAttribute('aria-label', 'お助けツール');
    w.innerHTML = '<div class="win-t"><span class="ico">🧰</span><span class="ttl">お助けツール</span><button class="bt r-tw-x" type="button" aria-label="とじる">×</button></div>' +
      '<div class="win-b"><div class="r-tw-tabs"><button type="button" aria-pressed="true">手書きメモ</button><button type="button" aria-pressed="false">電卓</button></div>' +
      '<div class="r-tw-memo"><canvas width="560" height="380" aria-label="手書きメモ。指やマウスで書けます"></canvas><div class="r-tw-row"><button type="button" data-c="#000">黒</button><button type="button" data-c="#d10000">赤</button><button type="button" data-c="#0040d0">青</button><button type="button" data-c="eraser">消しゴム</button><button type="button" class="r-tw-clear">ぜんぶ消す</button></div><p class="r-small">書いたメモは、このブラウザにだけ保存されます。</p></div>' +
      '<div class="r-tw-calc" hidden><div class="r-calc-disp" aria-live="polite">0</div><div class="r-calc-keys"></div></div></div>';
    document.body.appendChild(w);
    w.querySelector('.r-tw-x').addEventListener('click', function () { w.hidden = true; });
    var tabs = w.querySelectorAll('.r-tw-tabs button'), memo = w.querySelector('.r-tw-memo'), calc = w.querySelector('.r-tw-calc');
    tabs[0].addEventListener('click', function () { memo.hidden = false; calc.hidden = true; tabs[0].setAttribute('aria-pressed', 'true'); tabs[1].setAttribute('aria-pressed', 'false'); });
    tabs[1].addEventListener('click', function () { memo.hidden = true; calc.hidden = false; tabs[1].setAttribute('aria-pressed', 'true'); tabs[0].setAttribute('aria-pressed', 'false'); });
    /* 手書きメモ */
    var cv = w.querySelector('canvas'), g = cv.getContext('2d'), color = '#000', drawing = false, last = null;
    g.fillStyle = '#fff'; g.fillRect(0, 0, cv.width, cv.height);
    try { var saved = localStorage.getItem('gt-memo'); if (saved) { var im = new Image(); im.onload = function () { g.drawImage(im, 0, 0); }; im.src = saved; } } catch (e) {}
    function pos(e) { var r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * cv.width / r.width, (e.clientY - r.top) * cv.height / r.height]; }
    function save() { try { localStorage.setItem('gt-memo', cv.toDataURL('image/png')); } catch (e) {} }
    cv.addEventListener('pointerdown', function (e) { drawing = true; last = pos(e); cv.setPointerCapture(e.pointerId); e.preventDefault(); });
    cv.addEventListener('pointermove', function (e) { if (!drawing) return; var p = pos(e); g.strokeStyle = color === 'eraser' ? '#fff' : color; g.lineWidth = color === 'eraser' ? 22 : 3.5; g.lineCap = 'round'; g.beginPath(); g.moveTo(last[0], last[1]); g.lineTo(p[0], p[1]); g.stroke(); last = p; });
    cv.addEventListener('pointerup', function () { if (drawing) { drawing = false; save(); } });
    cv.style.touchAction = 'none';
    Array.prototype.forEach.call(w.querySelectorAll('[data-c]'), function (b) { b.addEventListener('click', function () { color = b.getAttribute('data-c'); Array.prototype.forEach.call(w.querySelectorAll('[data-c]'), function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); }); }); });
    w.querySelector('[data-c="#000"]').setAttribute('aria-pressed', 'true');
    w.querySelector('.r-tw-clear').addEventListener('click', function () { if (!confirm('メモをぜんぶ消しますか？')) return; g.fillStyle = '#fff'; g.fillRect(0, 0, cv.width, cv.height); save(); });
    /* 電卓（eval を使わない、ふつうの電卓の動き） */
    var disp = w.querySelector('.r-calc-disp'), keys = w.querySelector('.r-calc-keys'), cur = '0', acc = null, op = null, fresh = true;
    function fmt(n) { if (!isFinite(n)) return 'エラー'; var s = String(Math.round(n * 1e10) / 1e10); return s.length > 14 ? n.toExponential(8) : s; }
    function calcOp(a, b, o) { return o === '+' ? a + b : o === '−' ? a - b : o === '×' ? a * b : o === '÷' ? (b === 0 ? NaN : a / b) : b; }
    function press(k) {
      if (/^[0-9]$/.test(k)) { cur = fresh || cur === '0' ? k : (cur.length < 14 ? cur + k : cur); fresh = false; }
      else if (k === '.') { if (fresh) { cur = '0.'; fresh = false; } else if (cur.indexOf('.') < 0) cur += '.'; }
      else if (k === 'C') { cur = '0'; acc = null; op = null; fresh = true; }
      else if (k === '←') { if (!fresh) cur = cur.length > 1 ? cur.slice(0, -1) : '0'; }
      else if (k === '±') { cur = cur.charAt(0) === '-' ? cur.slice(1) : (cur === '0' ? cur : '-' + cur); }
      else if (k === '%') { cur = fmt(parseFloat(cur) / 100); fresh = true; }
      else if (k === '=') { if (op !== null) { cur = fmt(calcOp(acc, parseFloat(cur), op)); acc = null; op = null; fresh = true; } }
      else { if (op !== null && !fresh) cur = fmt(calcOp(acc, parseFloat(cur), op)); acc = parseFloat(cur); op = k; fresh = true; }
      disp.textContent = cur;
    }
    ['C', '←', '%', '÷', '7', '8', '9', '×', '4', '5', '6', '−', '1', '2', '3', '+', '±', '0', '.', '='].forEach(function (k) {
      var b = document.createElement('button'); b.type = 'button'; b.textContent = k; if (/[÷×−+=]/.test(k)) b.className = 'op'; if (k === 'C') b.className = 'clr';
      b.addEventListener('click', function () { press(k); }); keys.appendChild(b);
    });
    w.addEventListener('keydown', function (e) { if (calc.hidden) return; var m = { '/': '÷', '*': '×', '-': '−', '+': '+', Enter: '=', '=': '=', Backspace: '←', Escape: 'C', '.': '.', '%': '%' }; var k = /^[0-9]$/.test(e.key) ? e.key : m[e.key]; if (k) { e.preventDefault(); press(k); } });
    w.tabIndex = -1; w.focus();
    return w;
  }
})();
