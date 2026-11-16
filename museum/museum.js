/* 美術館ブース */
(function () {
  'use strict';
  var P = ((window.MUSEUM || {}).posts || []).slice().sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); });
  function $(s) { return document.querySelector(s); }
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  function fmt(d) { return String(d || '').replace(/-/g, '.'); }
  var wall = $('#wall'), year = '';
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) { es.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }); }, { rootMargin: '0px 0px -8% 0px' }) : null;
  function frame(inner) { var f = el('div', 'frame'), m = el('div', 'mat'), c = el('div', 'canvas'); inner.forEach(function (n) { c.appendChild(n); }); m.appendChild(c); f.appendChild(m); return f; }
  function render() {
    wall.innerHTML = '';
    var list = P.filter(function (p) { return !year || String(p.date).slice(0, 4) === year; });
    if (!list.length) {
      var e = el('div', 'mu-empty'); e.style.gridColumn = '1/-1';
      e.appendChild(frame([el('span', null, '― 準備中 ―')]));
      e.appendChild(el('p', null, 'まだ展示はありません。美術館を訪れたら、ここに一枚ずつ掛けていきます。'));
      wall.appendChild(e); return;
    }
    list.forEach(function (p) {
      var art = el('article', 'piece'), inner = [];
      if (p.img) { var im = el('img'); im.src = p.img; im.alt = (p.exhibition || p.museum || '') + 'の写真'; im.loading = 'lazy'; inner.push(im); }
      inner.push(el('p', null, p.text || ''));
      art.appendChild(frame(inner));
      var pl = el('div', 'plaque'); pl.appendChild(el('b', null, p.exhibition || p.museum || ''));
      if (p.exhibition && p.museum) pl.appendChild(el('span', null, p.museum + (p.place ? '（' + p.place + '）' : '')));
      var t = el('time', null, fmt(p.date)); t.dateTime = p.date; pl.appendChild(t);
      var mp = window.GTPlace && GTPlace.chip(p, { query: p.museum ? p.museum + (p.place ? ' ' + p.place : '') : '', label: p.museum || '' }); if (mp) { pl.appendChild(document.createTextNode('　')); pl.appendChild(mp); }
      if (p.url) { pl.appendChild(document.createTextNode('　')); var a = el('a', null, '展覧会のページ ↗'); a.href = p.url; a.target = '_blank'; a.rel = 'noopener'; pl.appendChild(a); }
      art.appendChild(pl); wall.appendChild(art); if (io) io.observe(art); else art.classList.add('in');
    });
  }
  // 年で絞り込み
  var years = []; P.forEach(function (p) { var y = String(p.date).slice(0, 4); if (years.indexOf(y) < 0) years.push(y); });
  var fl = $('#filter');
  if (years.length > 1) {
    [['', 'ALL']].concat(years.map(function (y) { return [y, y]; })).forEach(function (o) {
      var b = el('button', null, o[1]); b.type = 'button'; b.setAttribute('aria-pressed', o[0] === year ? 'true' : 'false');
      b.addEventListener('click', function () { year = o[0]; Array.prototype.forEach.call(fl.children, function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); }); render(); });
      fl.appendChild(b);
    });
  } else fl.hidden = true;
  render();
  // 来館記録
  var tb = $('#log tbody');
  if (!P.length) $('#log').hidden = true;
  else P.forEach(function (p) {
    var tr = el('tr'); tr.appendChild(el('td', null, fmt(p.date))); tr.appendChild(el('td', null, p.museum || '')); tr.appendChild(el('td', 'ex', p.exhibition || '')); tb.appendChild(tr);
  });

  /* ---------- 所蔵品（毎日9点を入れかえ） ---------- */
  var C = window.MUSEUM_COLLECTION || [], cw = document.getElementById('coll-wall');
  if (cw && C.length) {
    var day = Math.floor((Date.now() + 9 * 3600e3) / 864e5), seed = day * 9301 + 49297, pick = [], used = {};
    function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
    while (pick.length < Math.min(9, C.length)) { var k = Math.floor(rnd() * C.length); if (!used[k]) { used[k] = 1; pick.push(C[k]); } }
    pick.forEach(function (c, i) {
      var art = el('article', 'piece'), a = el('a', 'mu-coll-link'); a.href = c.href;
      var im = el('img'); im.src = c.img; im.alt = c.t; im.loading = 'lazy'; im.decoding = 'async'; im.style.aspectRatio = c.ratio; im.style.objectFit = 'cover'; im.style.width = '100%';
      a.appendChild(frame([im])); art.appendChild(a);
      var pl = el('div', 'plaque'); pl.appendChild(el('b', null, c.t)); pl.appendChild(el('span', null, c.s));
      pl.appendChild(el('time', null, 'No.' + String(i + 1).padStart(2, '0') + '　本日の展示')); art.appendChild(pl);
      cw.appendChild(art); if (io) io.observe(art); else art.classList.add('in');
    });
  }
})();
