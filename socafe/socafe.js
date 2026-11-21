/* 素カフェ（素材カフェ）
   無料：socafe/free.js（tools/build_socafe.py が作る）＋ 学習キット（bookmarks/downloads.js）
   有料：socafe/menu.js（手で書く）＋ LINE スタンプ（stamp/stamps.js）
   メニューのタブでしぼりこみ。効果音はその場で試聴できる */
(function () {
  'use strict';
  function $(s, r) { return (r || document).querySelector(s); }
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  function ga(n, p) { try { if (window.gtag) gtag('event', n, p || {}); } catch (e) {} }
  function kb(n) { return n < 1048576 ? Math.max(1, Math.round(n / 1024)) + ' KB' : (n / 1048576).toFixed(1) + ' MB'; }
  var grid = $('#sc-grid'), tabs = $('.sc-tabs');

  var FREE = (window.SOCAFE_FREE || []).map(function (x) { return { free: true, id: x.id, cat: x.cat, title: x.title, desc: x.desc, fmt: x.fmt, img: x.prev, url: '/socafe/dl/' + x.file, size: x.bytes, sounds: x.sounds || null }; });
  (window.DOWNLOADS || []).forEach(function (d) { FREE.push({ free: true, id: d.file, cat: 'kit', title: d.title, desc: d.desc, fmt: 'zip（' + d.files + 'ファイル）', img: '', url: '/downloads/' + d.file, size: d.bytes, emoji: '📚' }); });
  var PAID = (window.SOCAFE_PAID || []).map(function (x) { return { free: false, id: x.id, cat: x.cat || 'icon', title: x.title, desc: x.desc, fmt: x.fmt, img: x.img || '', url: x.url || '', price: x.price || '', shop: x.shop || '', soon: !!x.soon }; });
  var ST = window.STAMP || {};
  (ST.sets || []).slice().reverse().forEach(function (s) {
    if (!s.storeUrl) return;
    PAID.push({ free: false, id: s.id, cat: 'stamp', title: s.title, desc: 'LINE スタンプ ' + (s.stickers || []).length + '種類。トークで使えます。', fmt: 'LINE スタンプ', img: s.main || '', url: s.storeUrl, price: '有料', shop: 'LINE STORE', stamp: true });
  });
  var ALL = FREE.concat(PAID);
  $('#n-free').textContent = FREE.length; $('#n-paid').textContent = PAID.filter(function (p) { return !p.soon; }).length;

  var CATS = [['all', 'すべて', '☕'], ['free', '無料だけ', '🆓'], ['icon', 'アイコン・バナー', '🍪'], ['bg', '背景・壁紙', '🍰'], ['sound', 'サウンド', '🎵'], ['kit', '学習キット', '📚'], ['stamp', 'LINEスタンプ', '💬']];
  var cur = 'all';
  CATS.forEach(function (c) {
    var n = c[0] === 'all' ? ALL.length : c[0] === 'free' ? FREE.length : ALL.filter(function (x) { return x.cat === c[0]; }).length; if (!n) return;
    var b = el('button'); b.type = 'button'; b.setAttribute('role', 'tab'); b.setAttribute('data-c', c[0]); b.setAttribute('aria-selected', c[0] === cur ? 'true' : 'false');
    b.appendChild(el('span', 'ic', c[2])); b.appendChild(document.createTextNode(c[1])); b.appendChild(el('i', null, String(n)));
    b.addEventListener('click', function () { cur = c[0]; Array.prototype.forEach.call(tabs.children, function (x) { x.setAttribute('aria-selected', x === b ? 'true' : 'false'); }); render(); ga('socafe_tab', { c: cur }); });
    tabs.appendChild(b);
  });

  var audio = null, playing = null;
  function play(u, btn) {
    if (audio) { audio.pause(); if (playing) playing.classList.remove('on'); }
    if (playing === btn) { playing = null; return; }
    audio = new Audio(u); audio.volume = .6; audio.play().catch(function () {}); playing = btn; btn.classList.add('on');
    audio.onended = function () { btn.classList.remove('on'); playing = null; };
  }

  function card(x, i) {
    var a = el('article', 'sc-item' + (x.free ? ' is-free' : ' is-paid') + (x.soon ? ' is-soon' : '') + (x.stamp ? ' is-stamp' : '')); a.style.setProperty('--d', Math.min(i, 12) * 40 + 'ms');
    var plate = el('div', 'sc-plate');
    if (x.img) { var im = el('img'); im.src = x.img; im.alt = x.title + 'の見本'; im.loading = 'lazy'; im.decoding = 'async'; plate.appendChild(im); }
    else if (x.sounds) { var w = el('div', 'sc-wave'); for (var k = 0; k < 18; k++) { var bar = el('i'); bar.style.height = (20 + ((k * 37) % 60)) + '%'; w.appendChild(bar); } plate.appendChild(w); }
    else plate.appendChild(el('span', 'sc-emoji', x.emoji || (x.soon ? '🍩' : '☕')));
    var tag = el('span', x.free ? 'tag-free' : 'tag-paid', x.free ? 'FREE' : (x.soon ? '準備中' : x.price && x.price !== '有料' ? '¥ ' + x.price.replace(/^¥\s*/, '') : '¥ 有料')); plate.appendChild(tag);
    a.appendChild(plate);
    var body = el('div', 'sc-body');
    body.appendChild(el('h3', null, x.title));
    if (x.desc) body.appendChild(el('p', 'sc-desc', x.desc));
    var meta = [x.fmt, x.size ? kb(x.size) : '', x.shop ? x.shop : ''].filter(Boolean).join('　・　'); if (meta) body.appendChild(el('p', 'sc-meta', meta));
    if (x.sounds) {
      var sw = el('div', 'sc-sounds');
      x.sounds.forEach(function (s) { var b = el('button', null, '▶ ' + s.n); b.type = 'button'; b.addEventListener('click', function () { play(s.u, b); }); sw.appendChild(b); });
      body.appendChild(sw);
    }
    var act;
    if (x.soon) act = el('span', 'sc-btn sc-soon', 'ただいま準備中');
    else if (x.free) { act = el('a', 'sc-btn sc-dl', 'ダウンロード ↓'); act.href = x.url; act.setAttribute('download', ''); act.addEventListener('click', function () { ga('socafe_dl', { id: x.id }); }); }
    else { act = el('a', 'sc-btn sc-buy', (x.shop || 'お店') + 'で見る ↗'); act.href = x.url; act.target = '_blank'; act.rel = 'noopener'; act.addEventListener('click', function () { ga('socafe_buy', { id: x.id }); }); }
    body.appendChild(act);
    a.appendChild(body);
    return a;
  }
  function render() {
    grid.textContent = '';
    var list = ALL.filter(function (x) { return cur === 'all' || (cur === 'free' ? x.free : x.cat === cur); });
    if (cur === 'all') { // すべて：無料 → 有料 の順に、見出しをはさむ
      var f = list.filter(function (x) { return x.free; }), p = list.filter(function (x) { return !x.free; });
      if (f.length) { grid.appendChild(el('h2', 'sc-sec', '無料のメニュー')); f.forEach(function (x, i) { grid.appendChild(card(x, i)); }); }
      if (p.length) { grid.appendChild(el('h2', 'sc-sec paid', '有料のメニュー')); p.forEach(function (x, i) { grid.appendChild(card(x, i)); }); }
    } else list.forEach(function (x, i) { grid.appendChild(card(x, i)); });
  }
  render();
})();
