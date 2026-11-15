/* 404 ページ：サイト内をさがす（assets/site-index.js を部分一致で） */
(function () {
  var IDX = window.SITE_INDEX || [];
  function norm(t) { return String(t || '').normalize('NFKC').toLowerCase().replace(/[ァ-ヶ]/g, function (c) { return String.fromCharCode(c.charCodeAt(0) - 0x60); }).replace(/[\s・、。,.!！?？「」『』（）()〜~ー\-_:：\/]/g, ''); }
  IDX.forEach(function (x) { x.n = norm(x.t); });
  var q = document.getElementById('nf-q'), out = document.getElementById('nf-out');
  function render() {
    var n = norm(q.value); out.innerHTML = '';
    if (n.length < 2) return;
    var hit = IDX.filter(function (x) { return x.n.indexOf(n) >= 0; }).slice(0, 12);
    var p = document.createElement('p'); p.textContent = hit.length ? hit.length + ' 件みつかりました' + (hit.length === 12 ? '（上位12件）' : '') : '見つかりませんでした。ことばを変えてみてください。'; out.appendChild(p);
    var ul = document.createElement('ul'); ul.className = 'r-list';
    hit.forEach(function (x) { var li = document.createElement('li'), a = document.createElement('a'); a.href = x.u; if (/^https?:/.test(x.u)) { a.target = '_blank'; a.rel = 'noopener'; } a.textContent = '［' + x.k + '］' + x.t; li.appendChild(a); ul.appendChild(li); });
    out.appendChild(ul);
  }
  q.addEventListener('input', render);
  // 打ち間違えたURLの最後の部分を、検索の初期値に
  try { var seg = decodeURIComponent(location.pathname).split('/').filter(Boolean).pop() || ''; seg = seg.replace(/\.html?$/, '').replace(/[-_]/g, ' '); if (seg.length >= 2 && seg.length <= 40) { q.value = seg; render(); } } catch (e) {}
})();
