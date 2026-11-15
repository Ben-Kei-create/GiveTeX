/* つぶやきの「場所」チップ（📍）— Google マップの検索ページにリンクするだけ（APIキー不要・無料）
   使い方：GTPlace.chip(post, { query: "店名など", label: "表示名" }) → <a> または null
   - post.map が文字列なら、それを地図で検索（例 map: "国立西洋美術館"）
   - post.map === false なら出さない
   - それ以外は、本文に出てくる都道府県名を探して「📍 東京都」のように出す（市区町村より細かくは出さない）
   個人の家や待ち合わせ場所など、特定されたくない場所は map に書かないこと。 */
(function () {
  'use strict';
  var PREF = ['北海道', '青森', '岩手', '宮城', '秋田', '山形', '福島', '茨城', '栃木', '群馬', '埼玉', '千葉', '東京', '神奈川', '新潟', '富山', '石川', '福井', '山梨', '長野', '岐阜', '静岡', '愛知', '三重', '滋賀', '京都', '大阪', '兵庫', '奈良', '和歌山', '鳥取', '島根', '岡山', '広島', '山口', '徳島', '香川', '愛媛', '高知', '福岡', '佐賀', '長崎', '熊本', '大分', '宮崎', '鹿児島', '沖縄'];
  function full(p) { return p === '北海道' ? p : p === '東京' ? '東京都' : (p === '京都' || p === '大阪') ? p + '府' : p + '県'; }
  function detect(text) {
    text = String(text || ''); var best = null, at = 1e9;
    PREF.forEach(function (p) { var i = text.indexOf(p); if (i >= 0 && i < at) { at = i; best = p; } });
    return best ? full(best) : null;
  }
  var css = false;
  function style() {
    if (css) return; css = true;
    var s = document.createElement('style');
    s.textContent = '.gt-place{display:inline-flex;align-items:center;gap:3px;max-width:100%;font-size:.82em;line-height:1.5;text-decoration:none;color:inherit;border:1px solid currentColor;border-radius:999px;padding:0 9px;opacity:.85;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;vertical-align:middle}.gt-place:hover{opacity:1;text-decoration:underline}';
    document.head.appendChild(s);
  }
  function chip(post, opt) {
    post = post || {}; opt = opt || {};
    if (post.map === false) return null;
    var q = typeof post.map === 'string' && post.map.trim() ? post.map.trim() : (opt.query || '');
    var label = q;
    if (!q && opt.detect !== false) { var p = detect([post.title, post.text, post.area, post.place].join(' ')); if (p) { q = p; label = p; } }
    if (!q) return null;
    q = q.slice(0, 80); label = (opt.label || label).slice(0, 40);
    style();
    var a = document.createElement('a'); a.className = 'gt-place';
    a.href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q);
    a.target = '_blank'; a.rel = 'noopener'; a.textContent = '📍 ' + label;
    a.setAttribute('aria-label', label + ' を地図で見る（Google マップ）');
    a.addEventListener('click', function () { try { if (window.gtag) window.gtag('event', 'place_click', { place: label }); } catch (e) {} });
    return a;
  }
  window.GTPlace = { chip: chip, detect: detect };
})();
