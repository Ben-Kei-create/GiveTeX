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
    playing = i;
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
