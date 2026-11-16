/* ホームの起動画面（昔のゲーム機っぽい、オリジナルの演出）
   流れ：ブラウン管が点く → 光の粒（ドット）が集まってロゴになる → カチッと決まって光の輪 → 「GiveTex」→ 画面の奥へ抜けてホームへ
   - そのタブで最初にホームを開いたときだけ。2回目からは出ない（sessionStorage）
   - タップ・クリック・キーで飛ばせる。動きを減らす設定の人には出さない
   - ?boot を付けると毎回見られる（確認用） */
(function () {
  'use strict';
  var force = /[?&]boot\b/.test(location.search);
  try {
    if (!force) {
      if (navigator.webdriver) return;
      if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      if (sessionStorage.getItem('gt-booted')) return;
    }
    sessionStorage.setItem('gt-booted', '1');
  } catch (e) { if (!force) return; }

  var root = document.documentElement;
  root.classList.add('gt-booting');
  var css = document.createElement('style');
  css.textContent =
    'html.gt-booting{overflow:hidden}html.gt-booting::before{content:"";position:fixed;inset:0;background:#000;z-index:2147483646}' +
    '.gtb{position:fixed;inset:0;z-index:2147483647;background:#000;overflow:hidden;cursor:pointer;-webkit-tap-highlight-color:transparent;transition:opacity .5s ease,transform .55s cubic-bezier(.5,0,.8,.4),filter .5s ease}' +
    '.gtb.out{opacity:0;transform:scale(1.35);filter:blur(6px) brightness(1.6);pointer-events:none}' +
    /* 画面（ブラウン管）：横一本の光から、上下にひらく */
    '.gtb-scr{position:absolute;inset:0;display:grid;place-items:center;transform:scaleY(.004);opacity:0;animation:gtbOpen .5s .18s cubic-bezier(.2,.9,.2,1) forwards;' +
      'background:radial-gradient(ellipse 70% 55% at 50% 46%,#16236e 0%,#0a1040 45%,#030414 78%,#000 100%)}' +
    '.gtb-scr::before{content:"";position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(0deg,rgba(0,0,0,.28) 0 1px,transparent 1px 3px);mix-blend-mode:multiply}' +
    '.gtb-scr::after{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at 50% 50%,transparent 55%,rgba(0,0,0,.75) 100%)}' +
    '.gtb-line{position:absolute;left:50%;top:50%;width:0;height:2px;background:#fff;box-shadow:0 0 22px 5px rgba(160,200,255,.9);transform:translate(-50%,-50%);animation:gtbLine .42s ease-out forwards}' +
    '.gtb-in{position:relative;z-index:1;text-align:center;transform:translateY(-3vh)}' +
    '.gtb-logo{position:relative;width:var(--s);height:var(--s);margin:0 auto}' +
    '.gtb-logo canvas{position:absolute;left:50%;top:50%;width:calc(var(--s)*3.2);height:calc(var(--s)*3.2);transform:translate(-50%,-50%);transition:opacity .28s ease}' +
    '.gtb-logo img{position:absolute;inset:0;width:100%;height:100%;border-radius:20%;opacity:0;transform:scale(1.06);transition:opacity .25s ease,transform .5s cubic-bezier(.2,.9,.2,1),filter .6s ease;filter:drop-shadow(0 0 0 rgba(255,214,90,0))}' +
    '.gtb.lock .gtb-logo img{opacity:1;transform:none;filter:drop-shadow(0 0 26px rgba(255,214,90,.85))}.gtb.lock .gtb-logo canvas{opacity:0}' +
    '.gtb-ring{position:absolute;left:50%;top:50%;width:var(--s);height:var(--s);margin:calc(var(--s)/-2) 0 0 calc(var(--s)/-2);border-radius:50%;border:2px solid #ffe9a8;opacity:0;pointer-events:none}' +
    '.gtb.lock .gtb-ring{animation:gtbRing .9s cubic-bezier(.1,.7,.2,1) forwards}.gtb.lock .gtb-ring.b{animation-delay:.14s;border-color:#8fd8ff}' +
    '.gtb-flash{position:absolute;inset:0;background:#fff;opacity:0;pointer-events:none;z-index:2}.gtb.lock .gtb-flash{animation:gtbFlash .45s ease-out forwards}' +
    '.gtb-t{margin:26px 0 0;height:1em;font:400 clamp(44px,12vw,84px)/1 "VT323","DotGothic16",monospace;letter-spacing:.14em;text-indent:.14em;color:#ffe27a;white-space:nowrap}' +
    '.gtb-t span{display:inline-block;opacity:0}' +
    '.gtb.lock .gtb-t span{animation:gtbCh .42s cubic-bezier(.2,.9,.2,1) forwards}' +
    '.gtb-load{width:min(46vw,220px);height:6px;margin:18px auto 0;border:1px solid #6f7fd0;padding:1px;opacity:0;box-sizing:content-box}.gtb.lock .gtb-load{animation:gtbFade .3s .35s forwards}' +
    '.gtb-load i{display:block;height:100%;width:0;background:repeating-linear-gradient(90deg,#ffe27a 0 6px,transparent 6px 8px)}.gtb.lock .gtb-load i{animation:gtbBar 1s .45s steps(14) forwards}' +
    '.gtb-s{margin:14px 0 0;font:14px/1.6 "DotGothic16",sans-serif;color:#dfe6ff;letter-spacing:.3em;text-indent:.3em;opacity:0}.gtb.lock .gtb-s{animation:gtbFade .5s .6s forwards}' +
    '.gtb-c{position:absolute;z-index:1;bottom:calc(22px + env(safe-area-inset-bottom));left:0;right:0;margin:0;text-align:center;font:11px/1.6 "DotGothic16",monospace;color:#8f97c7;letter-spacing:.2em;opacity:0}.gtb.lock .gtb-c{animation:gtbFade .6s .7s forwards}' +
    '.gtb-skip{position:absolute;z-index:1;top:calc(14px + env(safe-area-inset-top));right:16px;margin:0;font:11px "DotGothic16",monospace;color:#6c74a8;letter-spacing:.15em;opacity:0;animation:gtbFade .4s .7s forwards}' +
    '@keyframes gtbLine{0%{width:0;opacity:1}70%{width:100vw;opacity:1}100%{width:100vw;opacity:0}}' +
    '@keyframes gtbOpen{0%{transform:scaleY(.004);opacity:1;filter:brightness(3)}100%{transform:none;opacity:1;filter:none}}' +
    '@keyframes gtbRing{0%{opacity:.9;transform:scale(.9)}100%{opacity:0;transform:scale(4.6);border-width:.5px}}' +
    '@keyframes gtbFlash{0%{opacity:.55}100%{opacity:0}}' +
    '@keyframes gtbCh{0%{opacity:0;transform:translateY(14px) scale(1.25);text-shadow:-9px 0 #ff2bd6,9px 0 #2bf0ff}55%{opacity:1;text-shadow:-3px 0 #ff2bd6,3px 0 #2bf0ff}100%{opacity:1;transform:none;text-shadow:0 0 14px rgba(255,205,70,.75),3px 3px 0 #7a4b00}}' +
    '@keyframes gtbBar{to{width:100%}}' +
    '@keyframes gtbFade{to{opacity:1}}';
  document.head.appendChild(css);

  /* 起動音：ブラウザが音を許してくれるときだけ鳴る（自動再生が止められていたら無音）。タップで飛ばしたときは鳴らせる */
  var chimed = false;
  function chime() {
    if (chimed) return; chimed = true;
    try {
      var C = window.AudioContext || window.webkitAudioContext; if (!C) return; var a = new C();
      var go = function () { var t = a.currentTime + .02;
        // 低い「ドーン」＋ きらっとした和音
        var b = a.createOscillator(), bg = a.createGain(); b.type = 'sine'; b.frequency.setValueAtTime(110, t); b.frequency.exponentialRampToValueAtTime(55, t + .9);
        bg.gain.setValueAtTime(0, t); bg.gain.linearRampToValueAtTime(.12, t + .03); bg.gain.exponentialRampToValueAtTime(.0001, t + 1.3); b.connect(bg); bg.connect(a.destination); b.start(t); b.stop(t + 1.35);
        [[523.3, 0], [659.3, .07], [784, .14], [1046.5, .22], [1318.5, .32]].forEach(function (n) {
          var o = a.createOscillator(), g = a.createGain(); o.type = 'triangle'; o.frequency.value = n[0];
          g.gain.setValueAtTime(0, t + n[1]); g.gain.linearRampToValueAtTime(.06, t + n[1] + .02); g.gain.exponentialRampToValueAtTime(.0001, t + n[1] + .9);
          o.connect(g); g.connect(a.destination); o.start(t + n[1]); o.stop(t + n[1] + .95); });
        setTimeout(function () { a.close(); }, 1900); };
      if (a.state === 'running') go(); else a.resume().then(function () { if (a.state === 'running') go(); else a.close(); })['catch'](function () {});
    } catch (e) {}
  }

  var done = false, box, raf = 0, locked = false;
  function finish(fast) {
    if (done) return; done = true; cancelAnimationFrame(raf);
    if (!box) { root.classList.remove('gt-booting'); return; }
    box.classList.add('out'); root.classList.remove('gt-booting');
    setTimeout(function () { if (box && box.parentNode) box.parentNode.removeChild(box); if (css.parentNode) css.parentNode.removeChild(css); }, fast ? 380 : 600);
  }
  function lock() { if (locked || done) return; locked = true; box.classList.add('lock'); chime(); setTimeout(function () { finish(false); }, 1450); }

  /* 光の粒が集まってロゴになる（アイコンを 22×22 のドットに分けて、外から飛んでくる） */
  function particles(cv, img, S) {
    var N = 22, off = document.createElement('canvas'); off.width = off.height = N;
    var o = off.getContext('2d'), data;
    try { o.drawImage(img, 0, 0, N, N); data = o.getImageData(0, 0, N, N).data; } catch (e) { return false; }
    var dpr = Math.min(window.devicePixelRatio || 1, 2), W = S * 3.2;
    cv.width = cv.height = Math.round(W * dpr); var c = cv.getContext('2d'); c.scale(dpr, dpr);
    var cell = S / N, ox = (W - S) / 2, P = [];
    for (var y = 0; y < N; y++) for (var x = 0; x < N; x++) {
      var i = (y * N + x) * 4; if (data[i + 3] < 40) continue;
      var ang = Math.random() * Math.PI * 2, rad = S * (1.0 + Math.random() * .55), dist = Math.hypot(x - N / 2, y - N / 2) / N;
      P.push({ tx: ox + x * cell, ty: ox + y * cell, sx: W / 2 + Math.cos(ang) * rad, sy: W / 2 + Math.sin(ang) * rad,
        col: 'rgb(' + data[i] + ',' + data[i + 1] + ',' + data[i + 2] + ')', d: 30 + dist * 300 + Math.random() * 110, sw: (Math.random() - .5) * S * .9 });
    }
    if (P.length < 20) return false;
    var DUR = 500, END = 30 + 300 * .71 + 110 + DUR, t0 = performance.now();
    (function frame(now) {
      if (done || locked) return;
      var t = now - t0; c.clearRect(0, 0, W, W);
      for (var k = 0; k < P.length; k++) {
        var p = P[k], u = (t - p.d) / DUR; if (u <= 0) continue; if (u > 1) u = 1;
        var e = 1 - Math.pow(1 - u, 3), bend = Math.sin(u * Math.PI) * p.sw; // 少し弧を描いて飛んでくる
        var px = p.sx + (p.tx - p.sx) * e + bend * (1 - e), py = p.sy + (p.ty - p.sy) * e - bend * .4 * (1 - e), sz = cell * (u < 1 ? .55 + .5 * e : 1.02);
        c.globalAlpha = Math.min(1, u * 3); c.fillStyle = u < .55 ? '#ffe9a8' : p.col;
        c.fillRect(px, py, sz, sz);
      }
      c.globalAlpha = 1;
      if (t > END + 60) { lock(); return; }
      raf = requestAnimationFrame(frame);
    })(t0);
    return true;
  }

  function build() {
    var S = Math.round(Math.min(window.innerWidth * .36, window.innerHeight * .24, 168));
    box = document.createElement('div'); box.className = 'gtb'; box.setAttribute('role', 'presentation'); box.setAttribute('aria-hidden', 'true'); box.style.setProperty('--s', S + 'px');
    box.innerHTML = '<div class="gtb-line"></div><div class="gtb-scr"><div class="gtb-in"><div class="gtb-logo"><canvas></canvas><span class="gtb-ring"></span><span class="gtb-ring b"></span><img alt=""></div>' +
      '<p class="gtb-t"></p><div class="gtb-load"><i></i></div><p class="gtb-s">GIVE教育！　教育 × IT</p></div><div class="gtb-flash"></div></div><p class="gtb-c">© 2026 GiveTex</p><p class="gtb-skip">TAP TO SKIP ▶</p>';
    var t = box.querySelector('.gtb-t');
    'GiveTex'.split('').forEach(function (ch, i) { var s = document.createElement('span'); s.textContent = ch; s.style.animationDelay = (.12 + i * 0.055) + 's'; t.appendChild(s); });
    (document.body || document.documentElement).appendChild(box);
    var img = box.querySelector('.gtb-logo img'), cv = box.querySelector('canvas'), started = false;
    function start() { if (started || done) return; started = true; if (!particles(cv, img, S)) setTimeout(lock, 500); }
    img.onload = function () { setTimeout(start, 380); }; // 画面が点いてから粒を飛ばす
    img.onerror = function () { setTimeout(lock, 700); };
    img.src = '/assets/icon/icon-512.png';
    setTimeout(function () { if (!started) lock(); }, 1500); // 画像が遅いときは、待たずに先へ
    function skip() { chime(); finish(true); }
    box.addEventListener('click', skip);
    document.addEventListener('keydown', function () { finish(true); }, { once: true });
    box.addEventListener('touchstart', skip, { passive: true, once: true });
    try { if (window.gtag) window.gtag('event', 'boot_screen'); } catch (e) {}
  }
  setTimeout(function () { finish(true); }, 6500); // 何かあっても必ず消える
  build(); // <body> ができるのを待たず、すぐ始める（<html> の直下に置く）
})();
