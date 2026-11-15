/* 画像が読み込めなかったとき（外部の画像が消えた・回線が切れたなど）に、壊れた画像の代わりに「NO IMAGE」を出す */
(function () {
  var PH = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160"><rect width="160" height="160" fill="#e6e3dc"/><path d="M52 104l22-28 16 20 12-14 22 22z" fill="#c7c2b8"/><circle cx="104" cy="58" r="10" fill="#c7c2b8"/><text x="80" y="140" font-family="sans-serif" font-size="13" fill="#8a857c" text-anchor="middle">NO IMAGE</text></svg>');
  document.addEventListener('error', function (e) {
    var t = e.target;
    if (!t || t.tagName !== 'IMG' || t.getAttribute('data-fb')) return;
    t.setAttribute('data-fb', '1');
    if (t.closest && t.closest('.st-msg')) { t.style.opacity = '.5'; }
    t.src = PH;
  }, true);
})();
