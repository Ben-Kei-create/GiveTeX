/* ホームの「名刺」ボタン → 名刺のダイアログ
   - ここだけは 90年代風ではなく、黒い背景のモダンな見せ方（ギャップ）
   - 画像は最高画質（/assets/meishi/front.jpg・back.jpg を圧縮しなおさずに使う）
   - 裏返す：名刺をタップ・クリック、横にスワイプ、「裏返す」ボタン、← → / スペースキー
   - QR：名刺の裏の QR を、読み取りやすい大きな QR で表示（行き先は https://www.givetex.org/）
   - 共有：スマホは共有シート（画像つき）、それ以外は表・裏・両面1枚の画像を保存、リンクのコピー */
(function () {
  'use strict';
  var opener = document.querySelector('[data-meishi]'); if (!opener) return;
  var SITE = 'https://www.givetex.org/';
  var IMG = { front: '/assets/meishi/front.jpg', back: '/assets/meishi/back.jpg', qr: '/assets/meishi/qr.svg' };
  var W = 1612, H = 974;
  var calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)').matches;
  function ga(n, p) { try { if (window.gtag) gtag('event', n, p || {}); } catch (e) {} }

  /* ---- 下ごしらえ：CSS と画像は、ボタンに近づいたときから読み始める ---- */
  var cssReady = null, warmed = false;
  function loadCss() {
    if (cssReady) return cssReady;
    cssReady = new Promise(function (ok) {
      var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = '/assets/meishi.css?v=1';
      l.onload = ok; l.onerror = ok; document.head.appendChild(l);
      var f = document.createElement('link'); f.rel = 'stylesheet';
      f.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,500&family=Inter:wght@400;500&display=swap&text=' +
        encodeURIComponent('BUSINESSCARDGiveTexFrontBackwvgorlesbuinsardQRShareCopy01234567892/.·—');
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
    qr: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="6" height="6" rx="1"/><rect x="14.5" y="3.5" width="6" height="6" rx="1"/><rect x="3.5" y="14.5" width="6" height="6" rx="1"/><path d="M14.5 14.5h2.5v2.5M20.5 14.5v6h-3M14.5 20.5v-2"/></svg>',
    share: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 15V3.5M7.5 8 12 3.5 16.5 8"/><path d="M5 12.5v6A2 2 0 0 0 7 20.5h10a2 2 0 0 0 2-2v-6"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    img: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="14" rx="2"/><path d="m4 16 4.5-4.5 4 4 2.5-2.5 5 5"/></svg>',
    both: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3" width="17" height="8" rx="1.5"/><rect x="3.5" y="13" width="17" height="8" rx="1.5"/></svg>',
    link: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1"/><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1"/></svg>',
    send: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 3 10 14M21 3l-7 18-4-7-7-4z"/></svg>'
  };

  var dlg = null, card, stage, tiltEl, gloss, side = 'front', qrOn = false, sheet, live, sideLbl, btnFlip, btnQr, btnShare, toastT;
  function build() {
    dlg = document.createElement('dialog'); dlg.className = 'ms'; dlg.setAttribute('aria-label', 'GiveTex の名刺');
    dlg.innerHTML =
      '<div class="ms-bg" aria-hidden="true"><i></i></div>' +
      '<header class="ms-top"><p class="ms-eyebrow"><span class="ms-dot"></span>Business Card</p>' +
        '<p class="ms-side"><span class="ms-side-n">01</span><span class="ms-side-sep"></span><span class="ms-side-t">Front</span></p>' +
        '<button type="button" class="ms-x" aria-label="閉じる">' + ICON.close + '</button></header>' +
      '<div class="ms-stage">' +
        '<div class="ms-lift"><div class="ms-tilt"><button type="button" class="ms-card" aria-label="名刺。押すと裏返ります（いまは表）">' +
          '<span class="ms-face ms-front"><img src="' + IMG.front + '" width="' + W + '" height="' + H + '" alt="名刺の表：真鍮の枠の大きな窓から、珊瑚の海をながめる二人" decoding="async" draggable="false"></span>' +
          '<span class="ms-face ms-back"><img src="' + IMG.back + '" width="' + W + '" height="' + H + '" alt="名刺の裏：珊瑚の海を泳ぐウミガメ。左下に GiveTex への QR コード" decoding="async" draggable="false"></span>' +
        '</button><span class="ms-gloss" aria-hidden="true"></span></div></div>' +
        '<div class="ms-qr" hidden><div class="ms-qr-card"><img src="' + IMG.qr + '" alt="GiveTex（www.givetex.org）へ行く QR コード" width="290" height="290">' +
          '<p class="ms-qr-t">カメラで読み取ると GiveTex へ</p><p class="ms-qr-u">www.givetex.org</p></div></div>' +
      '</div>' +
      '<p class="ms-hint">タップで裏返す<span class="ms-hint-k"> ・ ← → キー</span></p>' +
      '<div class="ms-bar" role="toolbar" aria-label="名刺の操作">' +
        '<button type="button" class="ms-b ms-flip">' + ICON.flip + '<span>裏返す</span></button>' +
        '<button type="button" class="ms-b ms-qrb" aria-pressed="false">' + ICON.qr + '<span>QR</span></button>' +
        '<button type="button" class="ms-b ms-share ms-b-gold" aria-haspopup="true" aria-expanded="false">' + ICON.share + '<span>共有・保存</span></button>' +
      '</div>' +
      '<div class="ms-sheet" hidden role="menu" aria-label="共有・保存">' +
        '<p class="ms-sheet-h">Share</p>' +
        '<button type="button" role="menuitem" data-act="share" class="ms-si ms-si-native" hidden>' + ICON.send + '<span>画像で送る<small>メッセージ・SNS・写真に保存</small></span></button>' +
        '<button type="button" role="menuitem" data-act="front">' + ICON.img + '<span>表面を保存<small>JPEG ・ ' + W + '×' + H + '</small></span></button>' +
        '<button type="button" role="menuitem" data-act="back">' + ICON.img + '<span>裏面を保存<small>JPEG ・ ' + W + '×' + H + '</small></span></button>' +
        '<button type="button" role="menuitem" data-act="both">' + ICON.both + '<span>両面を1枚で保存<small>表と裏をならべた画像</small></span></button>' +
        '<button type="button" role="menuitem" data-act="link">' + ICON.link + '<span>リンクをコピー<small>www.givetex.org</small></span></button>' +
      '</div>' +
      '<p class="ms-toast" role="status" aria-live="polite"></p>';
    document.body.appendChild(dlg);
    stage = dlg.querySelector('.ms-stage'); tiltEl = dlg.querySelector('.ms-tilt'); card = dlg.querySelector('.ms-card'); gloss = dlg.querySelector('.ms-gloss');
    sheet = dlg.querySelector('.ms-sheet'); live = dlg.querySelector('.ms-toast'); sideLbl = dlg.querySelector('.ms-side');
    btnFlip = dlg.querySelector('.ms-flip'); btnQr = dlg.querySelector('.ms-qrb'); btnShare = dlg.querySelector('.ms-share');
    if (canShareFiles()) sheet.querySelector('.ms-si-native').hidden = false;
    if (!finePointer) dlg.querySelector('.ms-hint-k').hidden = true;
    if (calm) dlg.classList.add('ms-calm');

    dlg.querySelector('.ms-x').addEventListener('click', close);
    dlg.addEventListener('cancel', function (e) { e.preventDefault(); if (!sheet.hidden) return toggleSheet(false); if (qrOn) return setQr(false); close(); });
    dlg.addEventListener('click', function (e) { // 名刺の外（黒いところ）を押したら閉じる
      if (!sheet.hidden && !sheet.contains(e.target) && !btnShare.contains(e.target)) { toggleSheet(false); return; }
      if (e.target === dlg || e.target === stage || e.target.classList.contains('ms-bg')) { if (qrOn) setQr(false); else close(); }
    });
    dlg.querySelector('.ms-qr').addEventListener('click', function (e) { if (!e.target.closest('.ms-qr-card')) setQr(false); });
    btnFlip.addEventListener('click', function () { flip(1); });
    btnQr.addEventListener('click', function () { setQr(!qrOn); });
    btnShare.addEventListener('click', function () { toggleSheet(sheet.hidden); });
    sheet.addEventListener('click', function (e) { var b = e.target.closest('[data-act]'); if (b) act(b.getAttribute('data-act')); });
    dlg.addEventListener('keydown', function (e) {
      if (e.target.closest && e.target.closest('.ms-sheet')) return;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); flip(e.key === 'ArrowRight' ? 1 : -1); }
      else if ((e.key === 'q' || e.key === 'Q') && !e.metaKey && !e.ctrlKey) setQr(!qrOn);
    });
    bindCard();
  }

  /* ---- 名刺の手ざわり：マウスで少し傾いて光が走る／タップで裏返る／スワイプでも裏返る ---- */
  var turn = 0, rx = 0, ry = 0, raf = 0, sx = 0, sy = 0, dragX = 0, dragging = false, moved = false, pid = null;
  function paint() {
    raf = 0;
    var base = turn * 180;
    tiltEl.style.transform = 'rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg)';
    card.style.transform = 'rotateY(' + (base + dragX).toFixed(2) + 'deg)';
  }
  function queue() { if (!raf) raf = requestAnimationFrame(paint); }
  function bindCard() {
    card.addEventListener('pointermove', function (e) {
      if (dragging) {
        var dx = e.clientX - sx; if (Math.abs(dx) > 6) moved = true;
        dragX = Math.max(-180, Math.min(180, dx / card.offsetWidth * 200)); card.classList.add('ms-drag'); queue(); return;
      }
      if (calm || e.pointerType !== 'mouse') return;
      var r = card.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      ry = (px - .5) * 10; rx = (.5 - py) * 8;
      gloss.style.setProperty('--gx', (px * 100).toFixed(1) + '%'); gloss.style.setProperty('--gy', (py * 100).toFixed(1) + '%');
      card.classList.add('ms-lit'); queue();
    });
    card.addEventListener('pointerleave', function () { if (dragging) return; rx = ry = 0; card.classList.remove('ms-lit'); queue(); });
    card.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      dragging = true; moved = false; sx = e.clientX; sy = e.clientY; dragX = 0; pid = e.pointerId;
      try { card.setPointerCapture(pid); } catch (x) {}
    });
    function end(e) {
      if (!dragging) return; dragging = false; card.classList.remove('ms-drag');
      try { card.releasePointerCapture(pid); } catch (x) {}
      var d = dragX; dragX = 0;
      if (moved && Math.abs(d) > 40) { flip(d > 0 ? 1 : -1); } else queue();
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
  function setQr(on) {
    qrOn = on; var q = dlg.querySelector('.ms-qr');
    btnQr.setAttribute('aria-pressed', on ? 'true' : 'false');
    dlg.classList.toggle('ms-qr-on', on);
    if (on) { q.hidden = false; requestAnimationFrame(function () { q.classList.add('in'); }); ga('meishi_qr'); }
    else { q.classList.remove('in'); setTimeout(function () { if (!qrOn) q.hidden = true; }, calm ? 0 : 320); }
  }
  function toggleSheet(open) {
    sheet.hidden = !open; btnShare.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) { var f = sheet.querySelector('[data-act]:not([hidden])'); if (f) f.focus(); }
  }
  function toast(msg) {
    live.textContent = msg; live.classList.add('in'); clearTimeout(toastT);
    toastT = setTimeout(function () { live.classList.remove('in'); }, 2400);
  }

  /* ---- 共有・保存 ---- */
  function blobOf(url) { return fetch(url).then(function (r) { if (!r.ok) throw new Error('fetch'); return r.blob(); }); }
  function canShareFiles() {
    try { return !!(navigator.canShare && window.File && navigator.canShare({ files: [new File([''], 'a.jpg', { type: 'image/jpeg' })] })); } catch (e) { return false; }
  }
  function save(blob, name) {
    var u = URL.createObjectURL(blob), a = document.createElement('a'); a.href = u; a.download = name; a.rel = 'noopener';
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(u); }, 4000);
  }
  function both() { // 表と裏を、黒い台紙に上下にならべた1枚（印刷しても見やすいように余白つき）
    return Promise.all([IMG.front, IMG.back].map(function (s) {
      return new Promise(function (ok, ng) { var i = new Image(); i.onload = function () { ok(i); }; i.onerror = ng; i.src = s; });
    })).then(function (im) {
      var m = 72, g = 56, cv = document.createElement('canvas'); cv.width = W + m * 2; cv.height = H * 2 + g + m * 2 + 40;
      var c = cv.getContext('2d'); c.fillStyle = '#0a0a0b'; c.fillRect(0, 0, cv.width, cv.height);
      im.forEach(function (img, k) { var y = m + k * (H + g); c.save(); c.shadowColor = 'rgba(0,0,0,.6)'; c.shadowBlur = 40; c.shadowOffsetY = 14; c.fillStyle = '#000'; c.fillRect(m, y, W, H); c.restore(); c.drawImage(img, m, y, W, H); });
      c.fillStyle = 'rgba(233,211,154,.75)'; c.font = '500 22px Inter, "Helvetica Neue", Arial, sans-serif'; c.textAlign = 'center';
      c.fillText('GiveTex  ·  www.givetex.org', cv.width / 2, cv.height - m / 2 - 6);
      return new Promise(function (ok) { cv.toBlob(ok, 'image/jpeg', 0.95); });
    });
  }
  function act(k) {
    ga('meishi_share', { method: k });
    if (k === 'link') {
      var done = function () { toast('リンクをコピーしました'); toggleSheet(false); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(SITE).then(done, function () { prompt('このリンクをコピーしてください', SITE); });
      else { prompt('このリンクをコピーしてください', SITE); }
      return;
    }
    if (k === 'share') {
      Promise.all([blobOf(IMG.front), blobOf(IMG.back)]).then(function (b) {
        var files = [new File([b[0]], 'givetex-meishi-front.jpg', { type: 'image/jpeg' }), new File([b[1]], 'givetex-meishi-back.jpg', { type: 'image/jpeg' })];
        var data = { files: files, title: 'GiveTex の名刺', text: 'GiveTex ' + SITE };
        if (!navigator.canShare(data)) data = { files: files };
        return navigator.share(data);
      }).then(function () { toggleSheet(false); }, function (e) { if (e && e.name === 'AbortError') return; toast('共有できなかったので、画像を保存してください'); });
      return;
    }
    toast('画像を用意しています…');
    var p = k === 'both' ? both() : blobOf(k === 'back' ? IMG.back : IMG.front);
    p.then(function (b) { save(b, 'givetex-meishi-' + k + '.jpg'); toast('保存しました'); toggleSheet(false); }, function () { toast('うまく保存できませんでした'); });
  }

  /* ---- 開く・閉じる ---- */
  var scrollY = 0;
  function open() {
    warm();
    loadCss().then(function () {
      if (!dlg) build();
      side = 'front'; turn = 0; rx = ry = dragX = 0; card.classList.remove('is-back', 'ms-lit'); sideLbl.querySelector('.ms-side-n').textContent = '01'; sideLbl.querySelector('.ms-side-t').textContent = 'Front';
      setQr(false); toggleSheet(false); paint();
      scrollY = window.scrollY; document.documentElement.classList.add('ms-lock');
      if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
      dlg.classList.remove('ms-out'); void dlg.offsetWidth; dlg.classList.add('ms-in');
      card.focus({ preventScroll: true });
      ga('meishi_open');
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
