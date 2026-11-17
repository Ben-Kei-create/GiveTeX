/* サイト全体の「動き」の仕上げ（gt-fx.css と組。全ページで読みこむ）
   - ページの切りかえ：対応ブラウザは CSS（ブラウン管のチャンネル切りかえ風）。ほかは短い暗転
   - リンク先の先読み：リンクに触れた時点で読み始めるので、押した瞬間に開く
   - 読み進みのバー／スクロールで現れる／星のカーソル（90年代風ページ）／表紙の傾き／タップの波紋
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
