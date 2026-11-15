/* 映画ブース（C-Log Web） */
(function () {
  'use strict';
  var M = ((window.CLOG || {}).movies || []).slice().sort(function (a, b) { return String(b.watched).localeCompare(String(a.watched)); });
  function $(s) { return document.querySelector(s); }
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  function hash(s) { var h = 0; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }
  function poster(m) {
    var p = el('div', 'poster');
    if (m.poster) { var im = el('img'); im.src = m.poster; im.alt = m.title + 'のポスター'; im.loading = 'lazy'; p.appendChild(im); }
    else { var h = hash(m.title || ''), a = h % 360, b = (a + 40 + (h >> 8) % 80) % 360; p.style.background = 'linear-gradient(160deg,hsl(' + a + ' 45% 32%),hsl(' + b + ' 55% 14%))'; p.appendChild(el('span', 'pt', m.title)); }
    if (m.year) p.appendChild(el('span', 'yr', String(m.year)));
    return p;
  }
  function stars(r) { var s = el('span', 'stars'); s.setAttribute('aria-label', '評価 ' + r + ' / 5'); for (var i = 1; i <= 5; i++) s.appendChild(el('span', r >= i ? '' : (r >= i - .5 ? '' : 'off'), r >= i ? '★' : (r >= i - .5 ? '☆' : '★'))); return s; }
  function fmt(d) { return String(d || '').replace(/-/g, '.'); }
  /* 詳細 */
  var dlg = $('dialog.detail');
  function open(m) {
    var b = $('.dt'); b.innerHTML = ''; b.appendChild(poster(m));
    var t = el('div'); t.appendChild(el('h3', null, m.title));
    var meta = el('div', 'meta'); meta.textContent = [m.year, m.watched ? fmt(m.watched) + ' に鑑賞' : '', m.where].filter(Boolean).join('　'); t.appendChild(meta);
    if (m.rating) t.appendChild(stars(m.rating));
    t.appendChild(el('p', null, m.text || m.short || ''));
    if (m.tags && m.tags.length) { var tg = el('div', 'tags'); m.tags.forEach(function (x) { tg.appendChild(el('span', null, '#' + x)); }); t.appendChild(tg); }
    b.appendChild(t);
    if (dlg.showModal) dlg.showModal();
  }
  $('.dt-close').addEventListener('click', function () { dlg.close(); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  /* Impression（最近の4本） */
  var imp = $('#imp');
  if (!M.length) { var e = el('div', 'empty'); e.style.gridColumn = '1/-1'; e.appendChild(el('b', null, 'まだ感想はありません')); e.appendChild(el('span', null, '観た映画の感想を、ここに残していきます。')); imp.appendChild(e); }
  M.slice(0, 4).forEach(function (m) {
    var c = el('button', 'mc'); c.type = 'button'; c.appendChild(poster(m));
    var tx = el('div', 'mc-tx'); tx.appendChild(el('b', null, m.title)); if (m.short) tx.appendChild(el('p', null, m.short)); if (m.rating) tx.appendChild(stars(m.rating)); c.appendChild(tx);
    c.addEventListener('click', function () { open(m); }); imp.appendChild(c);
  });
  /* マイノート（さがす・しぼりこむ） */
  var list = $('#notes'), q = '', minR = 0, tag = '';
  var tags = {}; M.forEach(function (m) { (m.tags || []).forEach(function (t) { tags[t] = (tags[t] || 0) + 1; }); });
  var fl = $('#filters');
  function chip(label, fn, on) { var b = el('button', null, label); b.type = 'button'; b.setAttribute('aria-pressed', on ? 'true' : 'false'); b.addEventListener('click', function () { fn(); Array.prototype.forEach.call(fl.children, function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); }); render(); }); fl.appendChild(b); }
  if (M.length) {
    chip('すべて', function () { minR = 0; tag = ''; }, true);
    chip('★4以上', function () { minR = 4; tag = ''; });
    Object.keys(tags).sort(function (a, b) { return tags[b] - tags[a]; }).slice(0, 10).forEach(function (t) { chip('#' + t, function () { tag = t; minR = 0; }); });
  }
  $('#q').addEventListener('input', function (e) { q = e.target.value.trim().toLowerCase(); render(); });
  function render() {
    list.innerHTML = '';
    var hit = M.filter(function (m) { return (m.rating || 0) >= minR && (!tag || (m.tags || []).indexOf(tag) >= 0) && (!q || (m.title + ' ' + (m.short || '') + ' ' + (m.text || '') + ' ' + (m.tags || []).join(' ')).toLowerCase().indexOf(q) >= 0); });
    $('#count').textContent = M.length ? hit.length + ' 本' : '';
    if (!hit.length) { var e = el('div', 'empty'); e.appendChild(el('b', null, M.length ? '見つかりませんでした' : 'マイノートはまだ白紙です')); e.appendChild(el('span', null, M.length ? 'ことばを変えて、もう一度さがしてみてください。' : '映画を観たら、ここに一行ずつ書いていきます。')); list.appendChild(e); return; }
    hit.forEach(function (m) {
      var r = el('article', 'nl'); r.appendChild(poster(m)); var t = el('div');
      t.appendChild(el('h3', null, m.title));
      t.appendChild(el('div', 'meta', [m.year, m.watched ? fmt(m.watched) : '', m.where].filter(Boolean).join('　')));
      if (m.rating) t.appendChild(stars(m.rating));
      if (m.short || m.text) t.appendChild(el('p', null, m.short || m.text));
      r.appendChild(t); r.style.cursor = 'pointer'; r.tabIndex = 0;
      r.addEventListener('click', function () { open(m); }); r.addEventListener('keydown', function (e) { if (e.key === 'Enter') open(m); });
      list.appendChild(r);
    });
  }
  render();
})();
