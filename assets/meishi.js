/* ホームの「名刺」ボタン → 名刺のダイアログ
   - ここだけは 90年代風ではなく、黒い背景のモダンな見せ方（ギャップ）
   - 画像は最高画質（/assets/meishi/front.jpg・back.jpg を圧縮しなおさずに使う）
   - 縦長の画面（スマホ）では、名刺を縦向きにして大きく見せる。「縦・横」ボタンで切りかえ
   - 裏返す：名刺をタップ・クリック、スワイプ、「裏返す」ボタン、矢印キー・スペース
   - QR は2つ：サイト（https://www.givetex.org/）と、名刺の画像を保存できるページ（/meishi/） */
(function () {
  'use strict';
  var opener = document.querySelector('[data-meishi]'); if (!opener) return;
  var IMG = { front: '/assets/meishi/front.jpg', back: '/assets/meishi/back.jpg' };
  var QR = {
    site: { src: '/assets/meishi/qr.svg', t: 'カメラで読み取ると GiveTex へ', u: 'www.givetex.org', alt: 'GiveTex（www.givetex.org）へ行く QR コード' },
    card: { src: '/assets/meishi/qr-card.svg', t: '読み取ると、この名刺の画像（表・裏）を保存できます', u: 'www.givetex.org/meishi/', alt: '名刺の画像を保存できるページへ行く QR コード' }
  };
  var W = 1612, H = 974;
  var calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)').matches;
  function ga(n, p) { try { if (window.gtag) gtag('event', n, p || {}); } catch (e) {} }

  /* ---- 下ごしらえ：CSS と画像は、ボタンに近づいたときから読み始める ---- */
  var cssReady = null, warmed = false;
  function loadCss() {
    if (cssReady) return cssReady;
    cssReady = new Promise(function (ok) {
      var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = '/assets/meishi.css?v=2';
      l.onload = ok; l.onerror = ok; document.head.appendChild(l);
      var f = document.createElement('link'); f.rel = 'stylesheet';
      f.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,500&family=Inter:wght@400;500&display=swap&text=' +
        encodeURIComponent('BUSINESSCARDGiveTexFrontBackwvgorlesbuinsardmhQR0123456789/.·—');
      document.head.appendChild(f);
    });
    return cssReady;
  }
  function warm() { if (warmed) return; warmed = true; loadCss(); [IMG.front, IMG.back].forEach(function (s) { var i = new Image(); i.decoding = 'async'; i.src = s; }); }
  opener.addEventListener('pointerenter', warm, { passive: true });
  opener.addEventListener('focus', warm);
  opener.addEventListener('touchstart', warm, { passive: true });

  var ICON = {
    flip: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 0 1 13.7-5.6M20 12a8 8 0 0 1-13.7 5.6"/><path d="M18 3v4h-4M6 21v-4h4"/></svg>',
    rot: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="3.5" width="10" height="17" rx="2"/><path d="M3 9.5v5M21 9.5v5"/></svg>',
    qr: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="6" height="6" rx="1"/><rect x="14.5" y="3.5" width="6" height="6" rx="1"/><rect x="3.5" y="14.5" width="6" height="6" rx="1"/><path d="M14.5 14.5h2.5v2.5M20.5 14.5v6h-3M14.5 20.5v-2"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>'
  };

  var dlg = null, card, tiltEl, gloss, side = 'front', qrOn = false, qrKind = 'site', sideLbl, btnQr, btnRot, vert = false, userRot = false;
  function build() {
    dlg = document.createElement('dialog'); dlg.className = 'ms'; dlg.setAttribute('aria-label', 'GiveTex の名刺');
    dlg.innerHTML =
      '<div class="ms-bg" aria-hidden="true"><i></i></div>' +
      '<header class="ms-top"><p class="ms-eyebrow"><span class="ms-dot"></span>Business Card</p>' +
        '<p class="ms-side"><span class="ms-side-n">01</span><span class="ms-side-sep"></span><span class="ms-side-t">Front</span></p>' +
        '<button type="button" class="ms-x" aria-label="閉じる">' + ICON.close + '</button></header>' +
      '<div class="ms-stage">' +
        '<div class="ms-lift"><div class="ms-rot"><div class="ms-tilt"><button type="button" class="ms-card" aria-label="名刺。押すと裏返ります（いまは表）">' +
          '<span class="ms-face ms-front"><img src="' + IMG.front + '" width="' + W + '" height="' + H + '" alt="名刺の表：真鍮の枠の大きな窓から、珊瑚の海をながめる二人" decoding="async" draggable="false"></span>' +
          '<span class="ms-face ms-back"><img src="' + IMG.back + '" width="' + W + '" height="' + H + '" alt="名刺の裏：珊瑚の海を泳ぐウミガメ。左下に GiveTex への QR コード" decoding="async" draggable="false"></span>' +
        '</button><span class="ms-gloss" aria-hidden="true"></span></div></div></div>' +
        '<div class="ms-qr" hidden><div class="ms-qr-card">' +
          '<div class="ms-seg" role="tablist" aria-label="QR コードの種類"><button type="button" role="tab" data-q="site" aria-selected="true">サイト</button><button type="button" role="tab" data-q="card" aria-selected="false">名刺の画像</button></div>' +
          '<img class="ms-qr-img" src="' + QR.site.src + '" alt="' + QR.site.alt + '" width="290" height="290">' +
          '<div class="ms-qr-txt"><p class="ms-qr-t">' + QR.site.t + '</p><p class="ms-qr-u">' + QR.site.u + '</p></div></div></div>' +
      '</div>' +
      '<p class="ms-hint">タップで裏返す<span class="ms-hint-k"> ・ 矢印キー</span></p>' +
      '<div class="ms-bar" role="toolbar" aria-label="名刺の操作">' +
        '<button type="button" class="ms-b ms-flip">' + ICON.flip + '<span>裏返す</span></button>' +
        '<button type="button" class="ms-b ms-rotb">' + ICON.rot + '<span class="ms-rot-l">横にする</span></button>' +
        '<button type="button" class="ms-b ms-qrb ms-b-gold" aria-pressed="false">' + ICON.qr + '<span>QR</span></button>' +
      '</div>';
    document.body.appendChild(dlg);
    tiltEl = dlg.querySelector('.ms-tilt'); card = dlg.querySelector('.ms-card'); gloss = dlg.querySelector('.ms-gloss');
    sideLbl = dlg.querySelector('.ms-side'); btnQr = dlg.querySelector('.ms-qrb'); btnRot = dlg.querySelector('.ms-rotb');
    // 先に読みこんでおく（QR を切りかえたとき一瞬白くならないように）
    new Image().src = QR.card.src;
    if (!finePointer) dlg.querySelector('.ms-hint-k').hidden = true;
    if (calm) dlg.classList.add('ms-calm');

    dlg.querySelector('.ms-x').addEventListener('click', close);
    dlg.addEventListener('cancel', function (e) { e.preventDefault(); if (qrOn) return setQr(false); close(); });
    dlg.addEventListener('click', function (e) { // 名刺の外（黒いところ）を押したら閉じる
      var t = e.target;
      if (t === dlg || t.classList.contains('ms-stage') || t.classList.contains('ms-bg')) { if (qrOn) setQr(false); else close(); }
    });
    dlg.querySelector('.ms-qr').addEventListener('click', function (e) { if (!e.target.closest('.ms-qr-card')) setQr(false); });
    dlg.querySelector('.ms-flip').addEventListener('click', function () { flip(1); });
    btnRot.addEventListener('click', function () { userRot = true; setVert(!vert); ga('meishi_rotate', { vertical: vert }); });
    btnQr.addEventListener('click', function () { setQr(!qrOn); });
    dlg.querySelector('.ms-seg').addEventListener('click', function (e) { var b = e.target.closest('[data-q]'); if (b) setKind(b.getAttribute('data-q')); });
    dlg.addEventListener('keydown', function (e) {
      if (/^Arrow/.test(e.key)) { e.preventDefault(); flip(e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 1); }
      else if ((e.key === 'q' || e.key === 'Q') && !e.metaKey && !e.ctrlKey) setQr(!qrOn);
    });
    bindCard();
  }

  /* ---- 縦・横 ---- */
  function portrait() { return window.innerHeight > window.innerWidth * 1.1; }
  function setVert(v) {
    vert = v; dlg.classList.toggle('ms-v', v);
    dlg.querySelector('.ms-rot-l').textContent = v ? '横にする' : '縦にする';
    btnRot.setAttribute('aria-label', v ? '名刺を横向きにする' : '名刺を縦向きにする');
    rx = ry = 0; queue();
  }
  window.addEventListener('resize', function () { if (dlg && dlg.open && !userRot && portrait() !== vert) setVert(portrait()); });

  /* ---- 名刺の手ざわり：マウスで少し傾いて光が走る／タップで裏返る／スワイプでも裏返る ---- */
  var turn = 0, rx = 0, ry = 0, raf = 0, sx = 0, sy = 0, dragX = 0, dragging = false, moved = false, pid = null;
  function paint() {
    raf = 0;
    tiltEl.style.transform = 'rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg)';
    card.style.transform = 'rotateY(' + (turn * 180 + dragX).toFixed(2) + 'deg)';
  }
  function queue() { if (!raf) raf = requestAnimationFrame(paint); }
  // 画面の上の位置 → 名刺の上での位置（0〜1）。縦向きのときは90度まわっている
  function local(e) {
    var r = card.getBoundingClientRect(), fx = (e.clientX - r.left) / r.width, fy = (e.clientY - r.top) / r.height;
    return vert ? { x: fy, y: 1 - fx } : { x: fx, y: fy };
  }
  function bindCard() {
    card.addEventListener('pointermove', function (e) {
      if (dragging) {
        // 名刺の横方向（縦向きのときは画面の上下）に動かすと、めくれる
        var d = vert ? e.clientY - sy : e.clientX - sx, len = vert ? card.getBoundingClientRect().height : card.getBoundingClientRect().width;
        if (Math.abs(d) > 6) moved = true;
        dragX = Math.max(-180, Math.min(180, d / len * 200)); card.classList.add('ms-drag'); queue(); return;
      }
      if (calm || e.pointerType !== 'mouse') return;
      var p = local(e);
      ry = (p.x - .5) * 10; rx = (.5 - p.y) * 8;
      gloss.style.setProperty('--gx', (p.x * 100).toFixed(1) + '%'); gloss.style.setProperty('--gy', (p.y * 100).toFixed(1) + '%');
      card.classList.add('ms-lit'); queue();
    });
    card.addEventListener('pointerleave', function () { if (dragging) return; rx = ry = 0; card.classList.remove('ms-lit'); queue(); });
    card.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      dragging = true; moved = false; sx = e.clientX; sy = e.clientY; dragX = 0; pid = e.pointerId;
      try { card.setPointerCapture(pid); } catch (x) {}
    });
    function end() {
      if (!dragging) return; dragging = false; card.classList.remove('ms-drag');
      try { card.releasePointerCapture(pid); } catch (x) {}
      var d = dragX; dragX = 0;
      if (moved && Math.abs(d) > 40) flip(d > 0 ? 1 : -1); else queue();
    }
    card.addEventListener('pointerup', end); card.addEventListener('pointercancel', end);
    card.addEventListener('click', function (e) { if (moved) { moved = false; e.preventDefault(); return; } flip(1); });
  }
  /* 裏返すときの手ざわり：紙がめくれる小さな音（右上の「音」が ON のとき）と、スマホなら軽い振動 */
  var SA = null;
  function swish() {
    try { if (localStorage.getItem('gt-click') === 'off') return; } catch (e) {}
    try {
      var C = window.AudioContext || window.webkitAudioContext; if (!C) return; if (!SA) SA = new C(); if (SA.state === 'suspended') SA.resume();
      var t = SA.currentTime, n = SA.createBuffer(1, SA.sampleRate * .22, SA.sampleRate), d = n.getChannelData(0);
      for (var i = 0; i < d.length; i++) { var k = i / d.length; d[i] = (Math.random() * 2 - 1) * Math.sin(Math.PI * k) * (1 - k * .6); }
      var src = SA.createBufferSource(), f = SA.createBiquadFilter(), g = SA.createGain();
      src.buffer = n; f.type = 'bandpass'; f.Q.value = .9; f.frequency.setValueAtTime(1800, t); f.frequency.exponentialRampToValueAtTime(5200, t + .2);
      g.gain.value = .07; src.connect(f); f.connect(g); g.connect(SA.destination); src.start(t);
    } catch (e) {}
    try { if (navigator.vibrate) navigator.vibrate(8); } catch (e) {}
  }
  function flip(dir) {
    swish();
    turn += dir || 1; side = Math.abs(turn) % 2 ? 'back' : 'front';
    card.classList.toggle('is-back', side === 'back');
    card.setAttribute('aria-label', '名刺。押すと裏返ります（いまは' + (side === 'back' ? '裏' : '表') + '）');
    sideLbl.querySelector('.ms-side-n').textContent = side === 'back' ? '02' : '01';
    sideLbl.querySelector('.ms-side-t').textContent = side === 'back' ? 'Back' : 'Front';
    sideLbl.classList.remove('ms-pop'); void sideLbl.offsetWidth; sideLbl.classList.add('ms-pop');
    queue();
    ga('meishi_flip', { side: side });
  }

  /* ---- QR（サイト／名刺の画像） ---- */
  function setKind(k) {
    qrKind = k; var q = QR[k], box = dlg.querySelector('.ms-qr-card'), img = box.querySelector('.ms-qr-img');
    Array.prototype.forEach.call(box.querySelectorAll('[data-q]'), function (b) { b.setAttribute('aria-selected', b.getAttribute('data-q') === k ? 'true' : 'false'); });
    img.src = q.src; img.alt = q.alt; box.querySelector('.ms-qr-t').textContent = q.t; box.querySelector('.ms-qr-u').textContent = q.u;
    ga('meishi_qr', { kind: k });
  }
  function setQr(on) {
    qrOn = on; var q = dlg.querySelector('.ms-qr');
    btnQr.setAttribute('aria-pressed', on ? 'true' : 'false');
    dlg.classList.toggle('ms-qr-on', on);
    if (on) { q.hidden = false; requestAnimationFrame(function () { q.classList.add('in'); }); ga('meishi_qr', { kind: qrKind }); }
    else { q.classList.remove('in'); setTimeout(function () { if (!qrOn) q.hidden = true; }, calm ? 0 : 320); }
  }

  /* ---- 開く・閉じる ---- */
  var scrollY = 0;
  function open() {
    warm();
    loadCss().then(function () {
      if (!dlg) build();
      side = 'front'; turn = 0; rx = ry = dragX = 0; card.classList.remove('is-back', 'ms-lit');
      sideLbl.querySelector('.ms-side-n').textContent = '01'; sideLbl.querySelector('.ms-side-t').textContent = 'Front';
      userRot = false; setVert(portrait()); setQr(false); setKind('site'); paint();
      scrollY = window.scrollY; document.documentElement.classList.add('ms-lock');
      if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
      dlg.classList.remove('ms-out'); void dlg.offsetWidth; dlg.classList.add('ms-in');
      card.focus({ preventScroll: true });
      ga('meishi_open', { vertical: vert });
    });
  }
  function close() {
    if (!dlg || !dlg.open) return;
    dlg.classList.remove('ms-in'); dlg.classList.add('ms-out');
    setTimeout(function () {
      if (dlg.close) dlg.close(); else dlg.removeAttribute('open');
      dlg.classList.remove('ms-out'); document.documentElement.classList.remove('ms-lock'); window.scrollTo(0, scrollY);
      opener.focus({ preventScroll: true });
    }, calm ? 0 : 280);
  }
  opener.addEventListener('click', open);
  if (/[?&#]meishi\b/.test(location.search + location.hash)) open(); // 例：https://www.givetex.org/?meishi で名刺から開く
})();
