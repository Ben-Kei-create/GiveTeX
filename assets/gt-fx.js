/* サイト全体の「動き」の仕上げ（gt-fx.css と組。全ページで読みこむ）
   - ページの切りかえ：対応ブラウザは CSS（ブラウン管のチャンネル切りかえ風）。ほかは短い暗転
   - リンク先の先読み：リンクに触れた時点で読み始めるので、押した瞬間に開く
   - 読み進みのバー／スクロールで現れる／星のカーソル（90年代風ページ）／表紙の傾き／タップの波紋
   - 同じページの中のリンクは、ぬるっと優しくスクロール（window.gtGlide でも呼べる）
   - タブを離れると、タイトルがひとこと話しかける
   動きを減らす設定の人には、動きものは出さない。JS が動かなくてもページは普通に見える */
(function () {
  'use strict';
  if (window.__gtFx) return; window.__gtFx = true;
  var d = document, root = d.documentElement;
  var calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)').matches;
  function ready(fn) { if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', fn); else fn(); }
  function sameSite(a) { return a && a.href && a.origin === location.origin && !a.hasAttribute('download') && a.target !== '_blank' && !/^\/api\//.test(a.pathname); }

  /* ---- リンク先の先読み ---- */
  try {
    if (HTMLScriptElement.supports && HTMLScriptElement.supports('speculationrules')) {
      var sr = d.createElement('script'); sr.type = 'speculationrules';
      sr.textContent = JSON.stringify({ prefetch: [{ where: { and: [{ href_matches: '/*' }, { not: { href_matches: '/api/*' } }, { not: { selector_matches: '[download]' } }] }, eagerness: 'moderate' }] });
      d.head.appendChild(sr);
    } else {
      var done = {};
      var warm = function (e) {
        var a = e.target.closest && e.target.closest('a'); if (!sameSite(a) || a.pathname === location.pathname) return;
        var u = a.pathname + a.search; if (done[u]) return; done[u] = 1;
        var l = d.createElement('link'); l.rel = 'prefetch'; l.href = u; d.head.appendChild(l);
      };
      d.addEventListener('pointerenter', warm, { capture: true, passive: true });
      d.addEventListener('touchstart', warm, { capture: true, passive: true });
    }
  } catch (e) {}

  /* ---- ページの切りかえ：未対応ブラウザは短い暗転 ---- */
  if (!('CSSViewTransitionRule' in window) && !calm) {
    d.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target.closest && e.target.closest('a'); if (!sameSite(a)) return;
      if (a.pathname === location.pathname && a.search === location.search) return; // ページ内リンク
      e.preventDefault(); root.classList.add('gtx-leave');
      setTimeout(function () { location.href = a.href; }, 150);
    });
    window.addEventListener('pageshow', function () { root.classList.remove('gtx-leave'); });
  }

  /* ---- 同じページの中の移動：一瞬で飛ばずに、ぬるっと優しくスクロール ----
     「#booths」「#top」「▲ ページの先頭へ」など、同じページの中へのリンクを押したとき。
     動きはじめと止まるところをゆっくりにして、遠いほど少しだけ長く（0.5〜1.2秒）。
     上に固定のメニューがあるページは、その下にちょうど来るように合わせる。
     とちゅうでホイールや指でスクロールしたら、そこで止める。動きを減らす設定の人には使わない */
  var anim = null;
  function fixedTop() { // 画面の上に貼りついているもの（固定のメニューなど）の高さ
    var h = 0, els = d.querySelectorAll('header, nav, .nb-bar, .hd, .bar, [class*="head"], [class*="top"]');
    for (var i = 0; i < els.length && i < 60; i++) {
      var c = getComputedStyle(els[i]); if (c.position !== 'fixed' && c.position !== 'sticky') continue;
      var r = els[i].getBoundingClientRect(); if (r.top <= 2 && r.bottom > 0 && r.bottom < innerHeight * .4 && r.width > innerWidth * .6) h = Math.max(h, r.bottom);
    }
    return h;
  }
  function targetY(el) {
    if (!el) return 0;
    var sm = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
    return Math.max(0, Math.min(root.scrollHeight - innerHeight, el.getBoundingClientRect().top + scrollY - Math.max(fixedTop() + 8, sm)));
  }
  function stop() { if (anim) { cancelAnimationFrame(anim.raf); root.style.scrollBehavior = anim.sb; anim = null; } }
  function glide(getY, done) {
    stop();
    var y0 = scrollY, y1 = getY(), dist = Math.abs(y1 - y0);
    if (calm || dist < 2) { window.scrollTo(0, y1); if (done) done(); return; }
    var dur = Math.min(1200, Math.max(500, 420 + dist * .18)), t0 = performance.now();
    anim = { sb: root.style.scrollBehavior, raf: 0 }; root.style.scrollBehavior = 'auto'; // CSS のなめらかスクロールと二重にならないように
    function ease(u) { return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; }
    (function f(now) {
      if (!anim) return;
      var u = Math.min(1, (now - t0) / dur);
      if (u > .6) { var ny = getY(); if (Math.abs(ny - y1) > 4) y1 = ny; } // 画像が読みこまれて位置がずれても、ちゃんと着く
      window.scrollTo(0, y0 + (y1 - y0) * ease(u));
      if (u < 1) anim.raf = requestAnimationFrame(f); else { stop(); if (done) done(); }
    })(t0);
  }
  ['wheel', 'touchstart', 'keydown'].forEach(function (ev) { window.addEventListener(ev, function () { if (anim) stop(); }, { passive: true }); });
  window.gtGlide = function (elOrY) { glide(function () { return typeof elOrY === 'number' ? elOrY : targetY(elOrY); }); };
  d.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest('a[href*="#"]'); if (!a || a.target === '_blank') return;
    if (a.origin !== location.origin || a.pathname !== location.pathname || a.search !== location.search) return; // ほかのページへの移動は、そのまま
    if (a.closest('[role="tablist"], [role="tab"]') || a.getAttribute('role') === 'tab') return; // タブの切りかえ（どろんなど）はそのまま
    var id = decodeURIComponent(a.hash.slice(1)), el = null;
    if (id && id !== 'top') { el = d.getElementById(id) || d.querySelector('a[name="' + id.replace(/"/g, '') + '"]'); if (!el) return; }
    e.preventDefault();
    if (location.hash !== a.hash) { try { history.pushState(null, '', a.hash || location.pathname + location.search); } catch (x) {} }
    glide(function () { return el ? targetY(el) : 0; }, function () {
      if (!el) return; // 移動したところへ、キーボードの位置も合わせる（読み上げソフト向け）
      if (!el.hasAttribute('tabindex') && !/^(A|BUTTON|INPUT|SELECT|TEXTAREA)$/.test(el.tagName)) { el.setAttribute('tabindex', '-1'); el.style.outline = 'none'; }
      try { el.focus({ preventScroll: true }); } catch (x) {}
    });
  });

  /* ---- タブを離れたら、タイトルがひとこと ---- */
  var title = d.title, AWAY = ['(・ω・) もどってきてね', '(=_=) まってるよ…', '☆ つづきはこちら ☆'];
  d.addEventListener('visibilitychange', function () {
    if (d.hidden) { title = d.title; d.title = AWAY[Math.floor(Math.random() * AWAY.length)] + '｜GiveTex'; } else d.title = title;
  });

  ready(function () {
    var retro = !!d.querySelector('.r-head');

    /* ---- 読み進みのバー（画面2.2枚ぶんより長いページだけ） ---- */
    var bar = null, tick = false;
    function prog() {
      tick = false; var max = root.scrollHeight - innerHeight;
      if (max < innerHeight * 1.2) { if (bar) bar.style.transform = 'scaleX(0)'; return; }
      if (!bar) { bar = d.createElement('div'); bar.className = 'gtx-bar'; bar.setAttribute('aria-hidden', 'true'); d.body.appendChild(bar); }
      bar.style.transform = 'scaleX(' + Math.min(1, Math.max(0, scrollY / max)).toFixed(4) + ')';
    }
    if (!d.querySelector('dialog.ms[open]')) { prog(); window.addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(prog); } }, { passive: true }); window.addEventListener('resize', prog); }

    if (calm) return;

    /* ---- スクロールで現れる（最初の画面より下にあるものだけ。上にあるものは最初から見せる） ---- */
    if ('IntersectionObserver' in window && !retro) {
      var SEL = '.kb, .ax-tile, .cart, .gcard, .ticket, .nb-item, .bk-nav, .gtt, .hyaku-in, .manners-in'; // 90年代風ページの窓は対象にしない（最初から本来の大きさで見せる）
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('gtx-in'); io.unobserve(x.target); var t = x.target; setTimeout(function () { t.classList.remove('gtx-rv', 'gtx-in'); t.style.removeProperty('--gtx-d'); }, 1200); } });
      }, { rootMargin: '0px 0px -6% 0px' });
      var arm = function (scope) {
        var list = (scope || d).querySelectorAll(SEL), vh = innerHeight, col = 0, lastTop = -1;
        for (var i = 0; i < list.length; i++) {
          var el = list[i]; if (el.__gtx || el.closest('.gone,[hidden]')) continue; el.__gtx = 1;
          var r = el.getBoundingClientRect(); if (r.top < vh * .92 || r.width === 0) continue;
          var top = Math.round(r.top + scrollY); col = Math.abs(top - lastTop) < 8 ? col + 1 : 0; lastTop = top; // 横に並んだものは、少しずつ遅らせる
          el.style.setProperty('--gtx-d', Math.min(col, 5) * 60 + 'ms'); el.classList.add('gtx-rv'); io.observe(el);
        }
      };
      arm();
      // あとから足される要素（note の「もっと見る」、ラーメンの食券など）にも
      if ('MutationObserver' in window) { var mt = 0; new MutationObserver(function (ms) { var real = ms.some(function (m) { for (var i = 0; i < m.addedNodes.length; i++) { var n = m.addedNodes[i]; if (n.nodeType === 1 && !/^gtx-/.test(n.className || '')) return true; } return false; }); if (!real) return; clearTimeout(mt); mt = setTimeout(function () { arm(); }, 120); }).observe(d.body, { childList: true, subtree: true }); }
    }

    /* ---- 星のカーソル（90年代風ページ・マウスだけ） ---- */
    if (retro && fine) {
      var COL = ['#ffff66', '#ff7bd5', '#7df9ff', '#9dff8a', '#ffffff'], CH = ['✦', '★', '✧', '*'], last = 0, n = 0, lx = 0, ly = 0;
      d.addEventListener('pointermove', function (e) {
        if (e.pointerType && e.pointerType !== 'mouse') return;
        var now = e.timeStamp; if (now - last < 45 || n > 18) return;
        if (Math.abs(e.clientX - lx) + Math.abs(e.clientY - ly) < 14) return; last = now; lx = e.clientX; ly = e.clientY;
        var s = d.createElement('span'); s.className = 'gtx-star'; s.setAttribute('aria-hidden', 'true'); s.textContent = CH[n % CH.length];
        s.style.color = COL[Math.floor(Math.random() * COL.length)];
        s.style.setProperty('--x', (e.clientX + 8) + 'px'); s.style.setProperty('--y', (e.clientY + 10) + 'px'); s.style.setProperty('--dx', (Math.random() * 20 - 10).toFixed(0) + 'px');
        d.body.appendChild(s); n++; setTimeout(function () { s.remove(); n--; }, 720);
      }, { passive: true });
    }

    /* ---- 本の表紙の傾き（ドパ読！・マウスだけ） ---- */
    if (fine) {
      d.addEventListener('pointermove', function (e) {
        var c = e.target.closest && e.target.closest('.kb-cover, .bk-cover'); if (!c) return;
        var r = c.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
        c.classList.add('gtx-tilt', 'gtx-on'); c.style.transform = 'perspective(600px) rotateY(' + (px * 14).toFixed(1) + 'deg) rotateX(' + (-py * 12).toFixed(1) + 'deg) translateY(-3px)';
        if (!c.__gtxL) { c.__gtxL = 1; c.addEventListener('pointerleave', function () { c.classList.remove('gtx-on'); c.style.transform = ''; }); }
      }, { passive: true });
    }

    /* ---- タップの波紋（リンク・ボタンを押したとき） ---- */
    d.addEventListener('pointerdown', function (e) {
      var t = e.target.closest && e.target.closest('a, button, [role=button]'); if (!t || e.button) return;
      if (t.closest('dialog.ms, .mg, .gtb, #board, canvas')) return; // 名刺・ゲームの中では出さない
      var r = d.createElement('span'); r.className = 'gtx-rip'; r.setAttribute('aria-hidden', 'true'); r.style.left = e.clientX + 'px'; r.style.top = e.clientY + 'px';
      var c = getComputedStyle(t).color; if (c) r.style.setProperty('--gtx-rip', retro ? '#ffff66' : c);
      d.body.appendChild(r); setTimeout(function () { r.remove(); }, 520);
    }, { passive: true });
  });
})();
