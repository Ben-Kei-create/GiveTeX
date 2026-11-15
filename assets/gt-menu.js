/* どのブースからでもホームや他のブースへ行ける、スマホ用のまるいメニューボタン
   置き方：<script src="/assets/gt-menu.js" defer></script>
   位置を変えたいページは <html data-gt-menu="bottom:84px"> のように、下からの距離を指定（映画ブースのタブの上など） */
(function () {
  'use strict';
  if (window.__gtMenu) return; window.__gtMenu = true;
  var LINKS = [['🏠', 'GiveTex ホーム', '/'], ['💾', 'アプリ', '/apps/'], ['📚', 'ドパ読！', '/books/'], ['👻', 'どろん', '/doron/'], ['✒', 'note', '/note/'],
    ['💬', 'スタンプ', '/stamp/'], ['🎮', 'ゲーム', '/game/'], ['🖼', '美術館', '/museum/'], ['🍜', 'ラーメン', '/ramen/'], ['🎬', '映画（C-Log）', '/movie/'],
    ['📝', '開発日記', '/diary/'], ['✉', 'お問い合わせ', '/contact/']];
  var here = location.pathname;
  var bottom = (document.documentElement.getAttribute('data-gt-menu') || '').replace(/^bottom:/, '') || '16px';
  var css = '.gtm{position:fixed;left:14px;bottom:calc(' + bottom + ' + env(safe-area-inset-bottom));z-index:2147483000;font:14px/1.4 -apple-system,BlinkMacSystemFont,"Hiragino Sans","Noto Sans JP",sans-serif}' +
    '.gtm-btn{width:50px;height:50px;border-radius:50%;border:2px solid rgba(255,255,255,.85);background:rgba(18,18,22,.86);color:#fff;display:grid;place-items:center;box-shadow:0 4px 14px rgba(0,0,0,.35);cursor:pointer;padding:0;-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}' +
    '.gtm-btn i{display:block;width:20px;height:2px;background:#fff;border-radius:2px;position:relative}.gtm-btn i::before,.gtm-btn i::after{content:"";position:absolute;left:0;width:20px;height:2px;background:#fff;border-radius:2px;transition:transform .2s}' +
    '.gtm-btn i::before{top:-6px}.gtm-btn i::after{top:6px}.gtm.open .gtm-btn i{background:transparent}.gtm.open .gtm-btn i::before{transform:translateY(6px) rotate(45deg)}.gtm.open .gtm-btn i::after{transform:translateY(-6px) rotate(-45deg)}' +
    '.gtm-btn:focus-visible{outline:3px solid #ffd23f;outline-offset:2px}' +
    '.gtm-panel{position:absolute;left:0;bottom:60px;width:min(250px,calc(100vw - 28px));max-height:min(70vh,560px);overflow:auto;background:#fff;color:#1d1d1f;border-radius:14px;box-shadow:0 10px 34px rgba(0,0,0,.35);padding:6px;display:none}' +
    '.gtm.open .gtm-panel{display:block}.gtm-panel p{margin:4px 10px 6px;font-size:11.5px;color:#6e6e73;letter-spacing:.08em}' +
    '.gtm-panel a{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:9px;color:#1d1d1f;text-decoration:none;font-size:15px}.gtm-panel a:hover,.gtm-panel a:focus-visible{background:#f0f0f3;outline:none}' +
    '.gtm-panel a[aria-current]{background:#eef3ff;color:#0a4fd6;font-weight:700}.gtm-panel a span{width:1.4em;text-align:center}' +
    '.gtm-panel a:first-of-type{font-weight:700;border-bottom:1px solid #eee;border-radius:9px 9px 0 0;margin-bottom:4px}' +
    '@media (min-width:901px){.gtm{display:none}}@media print{.gtm{display:none}}';
  function init() {
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    var box = document.createElement('nav'); box.className = 'gtm'; box.setAttribute('aria-label', 'サイトメニュー');
    var btn = document.createElement('button'); btn.type = 'button'; btn.className = 'gtm-btn'; btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-controls', 'gtm-panel'); btn.setAttribute('aria-label', 'メニュー（ホームへ戻る・ほかのブースへ）');
    btn.appendChild(document.createElement('i'));
    var pn = document.createElement('div'); pn.className = 'gtm-panel'; pn.id = 'gtm-panel';
    var cap = document.createElement('p'); cap.textContent = 'GiveTex のブース'; pn.appendChild(cap);
    LINKS.forEach(function (l) {
      var a = document.createElement('a'); a.href = l[2];
      var ic = document.createElement('span'); ic.setAttribute('aria-hidden', 'true'); ic.textContent = l[0]; a.appendChild(ic); a.appendChild(document.createTextNode(l[1]));
      if (l[2] !== '/' && here.indexOf(l[2]) === 0) a.setAttribute('aria-current', 'page');
      pn.appendChild(a);
    });
    // 先頭の「ホーム」は一番下（ボタンの近く）にも置きたいので、パネルを下から開く並びのまま
    box.appendChild(pn); box.appendChild(btn); document.body.appendChild(box);
    function set(open) { box.classList.toggle('open', open); btn.setAttribute('aria-expanded', open ? 'true' : 'false'); if (open) { var f = pn.querySelector('a'); if (f) f.focus({ preventScroll: true }); } }
    btn.addEventListener('click', function (e) { e.stopPropagation(); set(!box.classList.contains('open')); try { if (window.gtag) window.gtag('event', 'menu_open', { page: here }); } catch (x) {} });
    document.addEventListener('click', function (e) { if (!box.contains(e.target)) set(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && box.classList.contains('open')) { set(false); btn.focus(); } });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
