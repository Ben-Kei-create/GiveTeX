/* ゲームブース — コイン・実績・隠しコマンド・カートリッジ・つぶやき */
(function () {
  'use strict';
  var G = window.GAME || { games: [], posts: [] };
  function $(s, e) { return (e || document).querySelector(s); }
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  var calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var KIND = { digital: 'デジタル', boardgame: 'ボドゲ', madamis: 'マダミス', escape: '脱出', event: 'イベント', other: 'そのほか' };

  /* ---------- スコア・コイン・実績 ---------- */
  var score = 0, coins = 0, hi = parseInt(store('gm-hi') || '0', 10), got = {};
  try { got = JSON.parse(store('gm-ach') || '{}'); } catch (e) { got = {}; }
  function pad(n) { return String(n).padStart(6, '0'); }
  function hud() { $('#sc').textContent = pad(score); $('#hi').textContent = pad(Math.max(hi, score)); $('#cn').textContent = '×' + coins; }
  function add(n) { score += n; if (score > hi) { hi = score; store('gm-hi', String(hi)); } hud(); }
  var toastT = null;
  function ach(id, name) {
    if (got[id]) return; got[id] = 1; store('gm-ach', JSON.stringify(got));
    var t = $('.toast'); if (!t) { t = el('div', 'toast'); t.setAttribute('role', 'status'); document.body.appendChild(t); }
    t.innerHTML = ''; t.appendChild(el('span', null, '🏆')); var s = el('span'); s.appendChild(el('b', null, 'ACHIEVEMENT')); s.appendChild(document.createTextNode('実績解除：' + name)); t.appendChild(s);
    t.hidden = false; clearTimeout(toastT); toastT = setTimeout(function () { t.hidden = true; }, 2800);
    try { if (window.gtag) window.gtag('event', 'game_achievement', { id: id }); } catch (e) {}
  }
  var TOTAL_COINS = 0;
  function placeCoins(box, n) {
    for (var i = 0; i < n; i++) {
      var c = el('button', 'coin'); c.type = 'button'; c.setAttribute('aria-label', 'コイン');
      c.style.left = (6 + Math.random() * 86) + '%'; c.style.top = (8 + Math.random() * 78) + '%';
      c.addEventListener('click', function (e) {
        var b = e.currentTarget; if (b.classList.contains('got')) return;
        b.classList.add('got'); coins++; add(100);
        var p = el('span', 'plus', '+100'); p.style.left = b.style.left; p.style.top = b.style.top; b.parentNode.appendChild(p);
        setTimeout(function () { p.remove(); b.remove(); }, 800);
        if (coins === 1) ach('first', 'はじめてのコイン');
        if (coins === 10) ach('ten', 'コイン10まい');
        if (coins === TOTAL_COINS) ach('all', 'ぜんぶ見つけた！');
      });
      box.appendChild(c); TOTAL_COINS++;
    }
  }
  placeCoins($('.title'), 5);
  Array.prototype.forEach.call(document.querySelectorAll('.stage'), function (s) { placeCoins(s, 3); });
  // スクロールでも少しだけ点数
  var maxY = 0; window.addEventListener('scroll', function () { var y = Math.floor(scrollY / 200); if (y > maxY) { add((y - maxY) * 10); maxY = y; } if (innerHeight + scrollY >= document.body.scrollHeight - 4) ach('goal', 'さいごまで スクロール'); }, { passive: true });
  hud();
  // 隠しコマンド ↑↑↓↓←→←→BA
  var code = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'], ci = 0;
  document.addEventListener('keydown', function (e) {
    if (e.target.tagName === 'INPUT') return;
    var k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    ci = k === code[ci] ? ci + 1 : (k === code[0] ? 1 : 0);
    if (ci === code.length) { ci = 0; document.body.classList.toggle('mega'); add(10000); ach('konami', 'MEGA MODE'); }
  });

  /* ---------- カートリッジ ---------- */
  var carts = $('#carts'), games = (G.games || []).slice().sort(function (a, b) { return (b.pick ? 1 : 0) - (a.pick ? 1 : 0); });
  if (!games.length) {
    var em = el('div', 'empty'); em.appendChild(el('b', null, 'NO CARTRIDGE')); em.appendChild(el('span', null, 'Apple 以外のゲームを、ここに並べていきます。COMING SOON...'));
    carts.appendChild(em);
  } else games.forEach(function (g, i) {
    var a = el('a', 'cart' + (g.pick ? ' pick' : '')); a.href = /^https?:\/\//.test(g.url || '') ? g.url : '#'; a.target = '_blank'; a.rel = 'noopener';
    var lb = el('div', 'label'); if (g.img) { var im = el('img'); im.src = g.img; im.alt = ''; im.loading = 'lazy'; lb.appendChild(im); } else { lb.textContent = g.title; lb.style.background = ['#ffd23f', '#3ef0ff', '#ff4fd8', '#6bff7a'][i % 4]; }
    if (g.pick) a.appendChild(el('span', 'pick-badge', '★ PICK UP ★'));
    a.appendChild(lb); a.appendChild(el('h3', null, g.title)); if (g.desc) a.appendChild(el('p', null, g.desc));
    a.appendChild(el('span', 'pf', (g.platform || 'GAME') + (g.year ? ' / ' + g.year : ''))); a.appendChild(el('span', 'play', 'PLAY ▶'));
    a.addEventListener('click', function () { try { if (window.gtag) window.gtag('event', 'outbound_click', { link_url: a.href, place: 'game_cart' }); } catch (e) {} });
    carts.appendChild(a);
  });
  if (G.unityroomUrl) { var all = el('a', 'ur-all', 'unityroom で ぜんぶ見る ▶'); all.href = G.unityroomUrl; all.target = '_blank'; all.rel = 'noopener'; carts.parentNode.insertBefore(all, carts.nextSibling); }

  /* ---------- つぶやき（RPGのウインドウ・文字送り） ---------- */
  var box = $('#msgs'), posts = (G.posts || []).slice().sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); }), cur = '';
  var io = 'IntersectionObserver' in window && !calm ? new IntersectionObserver(function (es) {
    es.forEach(function (x) { if (!x.isIntersecting) return; io.unobserve(x.target); type(x.target.querySelector('.tx')); });
  }, { rootMargin: '0px 0px -10% 0px' }) : null;
  function type(node) {
    var full = node.getAttribute('data-full'); node.textContent = ''; var i = 0;
    (function step() { i += 2; node.textContent = full.slice(0, i); if (i < full.length) setTimeout(step, 18); })();
  }
  function render() {
    box.innerHTML = '';
    var list = posts.filter(function (p) { return !cur || p.kind === cur; });
    if (!list.length) {
      var e = el('div', 'win'); e.appendChild(el('span', 'who', 'ナレーション'));
      e.appendChild(el('p', 'tx', posts.length ? 'この ジャンルの きろくは まだ ないようだ……' : 'まだ なにも ない ようだ……\nデジタルゲーム、ボドゲ、マダミス、脱出ゲームのことを ここに かいていく。'));
      box.appendChild(e); return;
    }
    list.forEach(function (p) {
      var w = el('article', 'win'); w.appendChild(el('span', 'who', KIND[p.kind] || 'ゲーム'));
      if (p.title) w.appendChild(el('h3', null, p.title));
      var tx = el('p', 'tx', p.text || ''); tx.setAttribute('data-full', p.text || ''); w.appendChild(tx);
      var m = el('div', 'meta'); m.appendChild(el('time', null, String(p.date).replace(/-/g, '.')));
      (p.tags || []).forEach(function (t) { m.appendChild(el('span', null, '#' + t)); });
      if (p.url) { var a = el('a', null, 'リンク ↗'); a.href = p.url; a.target = '_blank'; a.rel = 'noopener'; m.appendChild(a); }
      w.appendChild(m); w.appendChild(el('span', 'next', '▼'));
      box.appendChild(w); if (io) io.observe(w);
    });
  }
  Array.prototype.forEach.call(document.querySelectorAll('.tabs button'), function (b) {
    b.addEventListener('click', function () { cur = b.getAttribute('data-kind'); Array.prototype.forEach.call(document.querySelectorAll('.tabs button'), function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); }); render(); });
  });
  render();
})();
