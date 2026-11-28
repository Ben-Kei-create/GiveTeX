/* GiveTex UI キット — ホーム以外のブースで使う、さわって気持ちいい小さな部品（すべて自作・素の JS）
   beui.dev のような「動く部品」や recent.design のような「ギャラリーの見せ方」を参考に、GiveTex 風に作ったもの
   - すべるタブ    ：タブ・しぼりこみのボタンを押すと、光るわくが前の場所から「すーっ」と移動する
   - ばね押し      ：ボタンを押すと、ばねのように縮んで戻る（CSS）
   - 磁石ボタン    ：大事なボタンに近づくと、指先へ少し吸いよせられる（マウスのみ）
   - スポットライト：カードの上で、カーソルのまわりがふわっと明るくなる。リンクのカードには右下に ↗ が出る
   - 数字ロール    ：「96冊」「18品」などの数字が、見えたときに 0 から数えあがる
   - 保存ボタン    ：ダウンロードを押すと、ボタンの中をバーが走って「✓ 保存しました」に変わる
   - トースト      ：下からお知らせが出る。重なって積まれ、横にスワイプで消せる（window.GTUI.toast）
   - 本棚          ：ドパ読！の表紙のならびの下に、背表紙の本棚をもうひとつ置く
   ホーム・90年代風のページでは動かない。動きを減らす設定の人には動きを出さない。音はサイトの音の設定（gt-click）に合わせる */
(function () {
  'use strict';
  if (window.GTUI) return;
  var path = location.pathname;
  if (path === '/' || path.indexOf('/meishi/') === 0 || document.querySelector('.r-head')) return; // 名刺のページは、そのままのしずかな見た目に
  var calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)').matches;
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function on(path_re) { return path_re.test(path); }

  /* ---------- ブースごとの設定 ---------- */
  var CARDS = [ // [ページ, カードのセレクタ]
    [/^\/apps\//, '.ax-tile, .card'],
    [/^\/game\//, '.cart, .gcard'],
    [/^\/movie\//, '.mc, .bf, .nl'],
    [/^\/museum\//, '.mu-card'],
    [/^\/note\//, '.nb-item, .nb-more-card, .nb-tale'],
    [/^\/socafe\//, '.sc-item'],
    [/^\/gakko\//, '.gk-r'],
    [/^\/hiphop\//, '.hh-el, .lk'],
    [/^\/doron\//, '.rep, .ph'],
    [/^\/ramen\//, '.ticket'],
    [/^\/books\//, '.kb, .box, .mode'],
    [/^\/sousaku\//, '.sk-card, .sk-event'],
    [/^\/stage\//, 'a.card, .card']
  ];
  var MAGNET = [
    [/^\/apps\//, '.ax-cta, .btn'], [/^\/movie\//, '.btn-y, #bf-send, .hl .btn'], [/^\/socafe\//, '.sc-btn'],
    [/^\/note\//, '.nb-btn'], [/^\/books\//, '.btn, .cg-form button'], [/^\/game\//, '.start'],
    [/^\/ramen\//, '.done button'], [/^\/doron\//, '.back']
  ];
  var COUNT = [
    [/^\/apps\//, '.ax-stat b, .stats b, .stat b'], [/^\/books\//, '.stat b, .hero .pill b, .cnt'], [/^\/socafe\//, '#n-free, #n-paid'],
    [/^\/ramen\//, '.rm-count'], [/^\/note\//, '.nb-count, .nb-stat b'], [/^\/museum\//, '.mu-count']
  ];
  function pick(list) { var s = []; list.forEach(function (r) { if (on(r[0])) s.push(r[1]); }); return s.join(', '); }

  /* ---------- 小さな音（サイトの音の設定がオンのときだけ） ---------- */
  var AC = null;
  function soundOn() { try { return localStorage.getItem('gt-click') === 'on'; } catch (e) { return false; } }
  function tick(f, d, v) {
    if (!soundOn()) return;
    try {
      AC = AC || new (window.AudioContext || window.webkitAudioContext)();
      var o = AC.createOscillator(), g = AC.createGain(), t = AC.currentTime;
      o.type = 'triangle'; o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(f * 1.5, t + d);
      g.gain.setValueAtTime(v || .05, t); g.gain.exponentialRampToValueAtTime(.0001, t + d);
      o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t + d + .02);
    } catch (e) {}
  }

  /* ---------- すべるタブ ---------- */
  var ACTIVE = '[aria-pressed="true"],[aria-selected="true"],.on,.active,.is-on,.cur';
  function isGroup(g) {
    if (!g || g === document.body) return false;
    var bs = $$(':scope > button, :scope > [role=tab], :scope > a[role=tab]', g);
    return bs.length >= 2 && bs.some(function (b) { return b.hasAttribute('aria-pressed') || b.hasAttribute('aria-selected') || b.classList.contains('on'); });
  }
  function rectIn(el, g) { var a = el.getBoundingClientRect(), b = g.getBoundingClientRect(); return { x: a.left - b.left + g.scrollLeft, y: a.top - b.top + g.scrollTop, w: a.width, h: a.height }; }
  function glide(g, from, to) {
    if (calm || !from || !to || from === to) return;
    if (getComputedStyle(g).position === 'static') g.style.position = 'relative';
    var a = rectIn(from, g), b = rectIn(to, g), cs = getComputedStyle(to);
    var r = document.createElement('i'); r.className = 'gu-ring'; r.setAttribute('aria-hidden', 'true');
    r.style.borderRadius = cs.borderRadius; r.style.setProperty('--gu-c', cs.backgroundColor !== 'rgba(0, 0, 0, 0)' ? cs.backgroundColor : cs.color);
    r.style.transform = 'translate(' + a.x + 'px,' + a.y + 'px)'; r.style.width = a.w + 'px'; r.style.height = a.h + 'px';
    g.appendChild(r);
    requestAnimationFrame(function () { requestAnimationFrame(function () {
      r.style.transform = 'translate(' + b.x + 'px,' + b.y + 'px)'; r.style.width = b.w + 'px'; r.style.height = b.h + 'px'; r.classList.add('go');
    }); });
    setTimeout(function () { r.classList.add('out'); }, 420); setTimeout(function () { r.remove(); }, 800);
    to.classList.remove('gu-land'); void to.offsetWidth; to.classList.add('gu-land');
    tick(660, .06, .035);
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('button, [role=tab]'); if (!b) return;
    var g = b.parentElement; if (!isGroup(g)) return;
    var prev = g.querySelector(':scope > ' + ACTIVE.split(',').join(', :scope > '));
    setTimeout(function () { var now = g.querySelector(':scope > ' + ACTIVE.split(',').join(', :scope > ')) || b; if (now !== prev) glide(g, prev, now); }, 0);
  }, true);

  /* ---------- 磁石ボタン ---------- */
  function magnet(el) {
    if (el.__guM || calm || !fine) return; el.__guM = 1; el.classList.add('gu-mag');
    el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect(), x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
      el.style.transform = 'translate(' + (x * .22).toFixed(1) + 'px,' + (y * .3).toFixed(1) + 'px)';
    });
    el.addEventListener('pointerleave', function () { el.style.transform = ''; });
  }

  /* ---------- スポットライトのカード ---------- */
  function spot(el) {
    if (el.__guS) return; el.__guS = 1; el.classList.add('gu-card');
    if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
    var s = document.createElement('span'); s.className = 'gu-spot'; s.setAttribute('aria-hidden', 'true'); el.appendChild(s);
    var link = el.matches('a[href]') || el.querySelector(':scope > a[href]:only-child');
    if (link) { var ar = document.createElement('span'); ar.className = 'gu-arrow'; ar.setAttribute('aria-hidden', 'true'); ar.textContent = '↗'; el.appendChild(ar); }
    if (!fine || calm) return;
    el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      el.style.setProperty('--mx', (x * 100).toFixed(1) + '%'); el.style.setProperty('--my', (y * 100).toFixed(1) + '%');
    });
  }

  /* ---------- 数字ロール ---------- */
  function roll(el) {
    if (el.__guR || calm) return; el.__guR = 1;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return; io.disconnect();
        var txt = el.textContent, m = txt.match(/\d[\d,]*/); if (!m) return;
        var n = parseInt(m[0].replace(/,/g, ''), 10); if (!(n > 1) || n > 100000) return;
        var pre = txt.slice(0, m.index), post = txt.slice(m.index + m[0].length), t0 = performance.now(), D = Math.min(1400, 500 + n * 6), last = txt;
        el.classList.add('gu-rolling');
        (function step(t) {
          if (el.textContent !== last) { el.classList.remove('gu-rolling'); return; } // ブースの JS が書きかえたら、そちらを優先
          var k = Math.min(1, (t - t0) / D), e = 1 - Math.pow(1 - k, 4);
          last = pre + Math.round(n * e).toLocaleString('ja-JP').replace(/,/g, m[0].indexOf(',') >= 0 ? ',' : '') + post; el.textContent = last;
          if (k < 1) requestAnimationFrame(step); else { el.textContent = txt; el.classList.remove('gu-rolling'); }
        })(t0);
      });
    }, { threshold: .6 });
    io.observe(el);
  }

  /* ---------- トースト ---------- */
  var tray = null;
  function toast(msg, opt) {
    opt = opt || {};
    if (!tray) { tray = document.createElement('div'); tray.className = 'gu-tray'; tray.setAttribute('role', 'status'); tray.setAttribute('aria-live', 'polite'); document.body.appendChild(tray); }
    var t = document.createElement('div'); t.className = 'gu-toast';
    t.innerHTML = '<i aria-hidden="true"></i><span></span>'; t.firstChild.textContent = opt.icon || '✓'; t.lastChild.textContent = msg;
    tray.insertBefore(t, tray.firstChild);
    var kids = tray.children; for (var i = 4; i < kids.length; i++) kids[i].remove();
    function bye(dir) { if (t.__bye) return; t.__bye = 1; t.style.setProperty('--dx', (dir || 0) * 120 + '%'); t.classList.add('bye'); setTimeout(function () { t.remove(); }, 380); }
    var x0 = null;
    t.addEventListener('pointerdown', function (e) { x0 = e.clientX; t.setPointerCapture(e.pointerId); t.classList.add('drag'); });
    t.addEventListener('pointermove', function (e) { if (x0 != null) t.style.transform = 'translateX(' + (e.clientX - x0) + 'px)'; });
    t.addEventListener('pointerup', function (e) { var d = e.clientX - x0; x0 = null; t.classList.remove('drag'); if (Math.abs(d) > 60) bye(d > 0 ? 1 : -1); else t.style.transform = ''; });
    setTimeout(function () { bye(0); }, opt.ms || 3200);
    return t;
  }

  /* ---------- 保存ボタン ---------- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[download], .sc-dl, [data-gu-dl]'); if (!a || a.__guBusy) return;
    if (a.closest('.gu-shelf')) return;
    a.__guBusy = 1; a.classList.add('gu-dl'); tick(520, .08, .04);
    var name = (a.getAttribute('download') || a.getAttribute('href') || '').split('/').pop();
    setTimeout(function () { a.classList.add('gu-done'); tick(990, .12, .045); toast(name ? '「' + decodeURIComponent(name) + '」の保存をはじめました' : '保存をはじめました', { icon: '↓' }); }, calm ? 0 : 750);
    setTimeout(function () { a.classList.remove('gu-dl', 'gu-done'); a.__guBusy = 0; }, 2600);
  }, true);

  /* ---------- 本棚（ドパ読！のトップ。いつもの表紙のならびの下に、もうひとつ置く） ---------- */
  function shelfMode() {
    if (path !== '/books/' && path !== '/books/index.html') return;
    var secs = $$('.sec').filter(function (s) { return s.querySelector(':scope > .shelf .kb'); }); if (secs.length < 2) return;
    var last = secs[secs.length - 1];
    var box = document.createElement('section'); box.className = 'sec gu-shelves'; box.id = 'hondana'; box.setAttribute('aria-labelledby', 'hondana-h');
    box.innerHTML = '<div class="sec-hd"><h2 id="hondana-h">📚 ドパ読！の本棚 <span class="cnt"></span></h2></div><p class="gu-shelf-lead">ジャンルごとに背表紙でならべました。ふれると本が引きだされて、表紙が見えます。</p>';
    var cv = document.createElement('canvas'); cv.width = cv.height = 8; var cx = cv.getContext('2d', { willReadFrequently: true });
    function tint(kb) { // 背表紙の色：表紙の絵の平均の色
      var im = kb.querySelector('img'); if (!im) return;
      function go() { try { cx.drawImage(im, 0, 0, 8, 8); var d = cx.getImageData(0, 0, 8, 8).data, r = 0, g = 0, b = 0; for (var i = 0; i < d.length; i += 4) { r += d[i]; g += d[i + 1]; b += d[i + 2]; } r /= 64; g /= 64; b /= 64;
        kb.style.setProperty('--sp', 'rgb(' + (r | 0) + ',' + (g | 0) + ',' + (b | 0) + ')'); kb.style.setProperty('--spi', (r * .3 + g * .59 + b * .11) > 150 ? '#141414' : '#fff'); } catch (e) {} }
      if (im.complete && im.naturalWidth) go(); else im.addEventListener('load', go, { once: true });
    }
    var n = 0;
    secs.forEach(function (sec) {
      var h = sec.querySelector('.sec-hd h2'), label = document.createElement('p'); label.className = 'gu-shelf-name';
      label.textContent = h ? h.childNodes[0].textContent.trim() : ''; box.appendChild(label);
      var sh = document.createElement('div'); sh.className = 'shelf gu-shelf';
      $$(':scope > .shelf .kb', sec).forEach(function (orig, i) {
        var kb = orig.cloneNode(true); n++;
        $$('.gu-spot, .gu-arrow', kb).forEach(function (x) { x.parentNode.removeChild(x); }); kb.classList.remove('gu-card');
        kb.style.setProperty('--sh', (196 + ((i * 37) % 5) * 9) + 'px');
        kb.addEventListener('click', function (e) { // さわれる画面は、1回目で本を引きだし、2回目でひらく
          if (fine || kb.classList.contains('out')) return;
          e.preventDefault(); $$('.kb.out', box).forEach(function (x) { x.classList.remove('out'); }); kb.classList.add('out'); tick(400, .07, .04);
        });
        kb.addEventListener('mouseenter', function () { tick(300 + (i % 5) * 40, .05, .02); });
        sh.appendChild(kb); tint(kb);
      });
      box.appendChild(sh);
    });
    box.querySelector('.cnt').textContent = n + '冊';
    last.parentNode.insertBefore(box, last.nextSibling);
  }

  /* ---------- まとめて取りつける ---------- */
  function scan() {
    var c = pick(CARDS), m = pick(MAGNET), n = pick(COUNT);
    if (c) $$(c).forEach(function (el) { if (!el.closest('.gu-shelves')) spot(el); });
    if (m) $$(m).forEach(magnet);
    if (n) $$(n).forEach(roll);
  }
  function start() {
    document.documentElement.classList.add('gu');
    scan(); shelfMode();
    // ブースの JS があとからカードを足すので、変化があったら取りつけなおす（まとめて1回）
    var pend = 0;
    new MutationObserver(function () { if (pend) return; pend = setTimeout(function () { pend = 0; scan(); }, 120); }).observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();

  window.GTUI = { toast: toast, glide: glide, tick: tick };
})();
