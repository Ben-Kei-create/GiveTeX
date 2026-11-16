/* どのブースからでもホームや他のブースへ行ける、スマホ用のまるいメニューボタン
   置き方：<script src="/assets/gt-menu.js" defer></script>
   位置を変えたいページは <html data-gt-menu="bottom:84px"> のように、下からの距離を指定（映画ブースのタブの上など） */
(function () {
  'use strict';
  if (window.__gtMenu) return; window.__gtMenu = true;
  // [表示名, リンク先, フォント]：それぞれのブースの雰囲気に合わせて、全部ちがうフォント
  var LINKS = [['GiveTex ホーム', '/', '"DotGothic16"'], ['アプリ', '/apps/', '"WDXL Lubrifont JP N"'], ['ドパ読！', '/books/', '"Dela Gothic One"'],
    ['どろん', '/doron/', '"GT Osorosige"'], ['note', '/note/', '"Noto Serif JP"'], ['スタンプ', '/stamp/', '"M PLUS Rounded 1c"'],
    ['ゲーム', '/game/', '"RocknRoll One"'], ['美術館', '/museum/', '"Shippori Mincho"'], ['ラーメン', '/ramen/', '"Mochiy Pop One"'],
    ['映画（C-Log）', '/movie/', '"Zen Antique"'], ['開発日記', '/diary/', '"Klee One"'], ['お問い合わせ', '/contact/', '"Kiwi Maru"']];
  var FAMILIES = 'family=DotGothic16&family=WDXL+Lubrifont+JP+N&family=Dela+Gothic+One&family=Noto+Serif+JP:wght@700&family=M+PLUS+Rounded+1c:wght@800' +
    '&family=RocknRoll+One&family=Shippori+Mincho:wght@700&family=Mochiy+Pop+One&family=Zen+Antique&family=Klee+One:wght@600&family=Kiwi+Maru:wght@500';
  var fontsLoaded = false;
  function loadFonts() {
    if (fontsLoaded) return; fontsLoaded = true;
    // メニューに出る文字だけを取り寄せるので、とても軽い
    var text = LINKS.map(function (l) { return l[0]; }).join('');
    var ln = document.createElement('link'); ln.rel = 'stylesheet';
    ln.href = 'https://fonts.googleapis.com/css2?' + FAMILIES + '&display=swap&text=' + encodeURIComponent(text);
    document.head.appendChild(ln);
    var ff = document.createElement('style'); // どろんの「おそろしげ明朝」は自サイトから
    ff.textContent = '@font-face{font-family:"GT Osorosige";src:url("/doron/fonts/osorosige-core.woff2") format("woff2");font-display:swap}';
    document.head.appendChild(ff);
  }
  var here = location.pathname;
  /* ---- ブースめぐり（スタンプラリー）：行ったブースをこの端末だけに覚えておく ---- */
  var TOUR = [['apps', 'アプリ'], ['books', 'ドパ読！'], ['doron', 'どろん'], ['note', 'note'], ['stamp', 'スタンプ'], ['game', 'ゲーム'], ['museum', '美術館'], ['ramen', 'ラーメン'], ['movie', '映画']];
  var seen = []; try { seen = JSON.parse(localStorage.getItem('gt-tour') || '[]') || []; } catch (e) {}
  var booth = (here.match(/^\/([a-z]+)\//) || [])[1], isBooth = TOUR.some(function (t) { return t[0] === booth; }), justDone = false;
  if (isBooth && seen.indexOf(booth) < 0) { seen.push(booth); justDone = seen.length === TOUR.length; try { localStorage.setItem('gt-tour', JSON.stringify(seen)); } catch (e) {} }
  var nSeen = TOUR.filter(function (t) { return seen.indexOf(t[0]) >= 0; }).length;
  var bottom = (document.documentElement.getAttribute('data-gt-menu') || '').replace(/^bottom:/, '') || '16px';
  var css = '.gtm{position:fixed;left:14px;bottom:calc(' + bottom + ' + env(safe-area-inset-bottom));z-index:2147483000;font:14px/1.4 -apple-system,BlinkMacSystemFont,"Hiragino Sans","Noto Sans JP",sans-serif}' +
    '.gtm-btn{width:50px;height:50px;border-radius:50%;border:2px solid rgba(255,255,255,.85);background:rgba(18,18,22,.86);color:#fff;display:grid;place-items:center;box-shadow:0 4px 14px rgba(0,0,0,.35);cursor:pointer;padding:0;-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}' +
    '.gtm-btn i{display:block;width:20px;height:2px;background:#fff;border-radius:2px;position:relative}.gtm-btn i::before,.gtm-btn i::after{content:"";position:absolute;left:0;width:20px;height:2px;background:#fff;border-radius:2px;transition:transform .2s}' +
    '.gtm-btn i::before{top:-6px}.gtm-btn i::after{top:6px}.gtm.open .gtm-btn i{background:transparent}.gtm.open .gtm-btn i::before{transform:translateY(6px) rotate(45deg)}.gtm.open .gtm-btn i::after{transform:translateY(-6px) rotate(-45deg)}' +
    '.gtm-btn:focus-visible{outline:3px solid #ffd23f;outline-offset:2px}' +
    '.gtm-panel{position:absolute;left:0;bottom:60px;width:min(250px,calc(100vw - 28px));max-height:min(70vh,560px);overflow:auto;background:#fff;color:#1d1d1f;border-radius:14px;box-shadow:0 10px 34px rgba(0,0,0,.35);padding:6px;display:none}' +
    '.gtm.open .gtm-panel{display:block}.gtm-panel p{margin:4px 10px 6px;font-size:11.5px;color:#6e6e73;letter-spacing:.08em}' +
    '.gtm-panel a{display:flex;align-items:center;padding:9px 14px;border-radius:9px;color:#1d1d1f;text-decoration:none;font-size:17px;line-height:1.35}.gtm-panel a:hover,.gtm-panel a:focus-visible{background:#f0f0f3;outline:none}' +
    '.gtm-panel a[aria-current]{background:#eef3ff;color:#0a4fd6}' +
    '.gtm-panel a:first-of-type{border-bottom:1px solid #eee;border-radius:9px 9px 0 0;margin-bottom:4px}' +
    '.gtm-panel a i{margin-left:auto;font:normal 11px/1 -apple-system,sans-serif;color:#1a9a4a;padding-left:10px}' +
    '@media (min-width:901px){.gtm{display:none}}@media print{.gtm,.gtt{display:none}}' +
    '.gtt{box-sizing:border-box;width:min(720px,calc(100% - 28px));margin:36px auto 28px;padding:16px 18px;border-radius:16px;background:#15151a;color:#fff;font:14px/1.6 -apple-system,BlinkMacSystemFont,"Hiragino Sans","Noto Sans JP",sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.25);position:relative;z-index:5;text-align:left}' +
    '@media (max-width:900px){.gtt{margin-bottom:calc(' + bottom + ' + 78px + env(safe-area-inset-bottom))}}' +
    '.gtt-h{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:0 0 10px;font-size:12.5px;letter-spacing:.08em;color:#c9c9d4}.gtt-h b{color:#ffd23f;font-size:14px;letter-spacing:.04em}' +
    '.gtt-dots{display:flex;gap:6px;flex-wrap:wrap;margin:0 0 12px;padding:0;list-style:none}.gtt-dots li{margin:0;padding:0}' +
    '.gtt-dots a{display:block;padding:5px 10px;border-radius:999px;border:1.5px dashed #55556a;color:#b9b9c8;text-decoration:none;font-size:12.5px;line-height:1.3}' +
    '.gtt-dots a.on{border:1.5px solid #ffd23f;background:#ffd23f;color:#15151a;font-weight:700}.gtt-dots a.cur{box-shadow:0 0 0 2px #15151a,0 0 0 4px #ffd23f}.gtt-dots a:hover{border-color:#fff;color:#fff}.gtt-dots a.on:hover{color:#15151a}' +
    '.gtt-next{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 16px;border-radius:12px;background:#fff;color:#15151a;text-decoration:none;font-weight:700;font-size:15px}.gtt-next small{display:block;font-weight:400;font-size:11.5px;color:#6e6e73}.gtt-next:hover{background:#ffd23f}' +
    '.gtt-next:focus-visible,.gtt-dots a:focus-visible{outline:3px solid #ffd23f;outline-offset:2px}' +
    '.gtt-toast{position:fixed;left:50%;top:18px;transform:translateX(-50%);z-index:2147483001;background:#ffd23f;color:#15151a;font:700 14px/1.5 -apple-system,"Hiragino Sans",sans-serif;padding:10px 18px;border-radius:999px;box-shadow:0 8px 24px rgba(0,0,0,.3);white-space:nowrap}';
  function tourStrip() {
    if (!isBooth || booth === 'stamp' || !new RegExp('^/' + booth + '/(index\\.html)?$').test(here)) return; // ブースの入口のページの、いちばん下にだけ出す
    var box = document.createElement('nav'); box.className = 'gtt'; box.setAttribute('aria-label', 'ブースめぐり');
    var h = document.createElement('p'); h.className = 'gtt-h'; h.innerHTML = '<b>ブースめぐり</b>';
    h.appendChild(document.createTextNode(nSeen >= TOUR.length ? '全ブース制覇！ おめでとう！' : TOUR.length + 'つのうち ' + nSeen + 'つ まわりました'));
    box.appendChild(h);
    var ul = document.createElement('ul'); ul.className = 'gtt-dots';
    TOUR.forEach(function (t) { var li = document.createElement('li'), a = document.createElement('a'); a.href = '/' + t[0] + '/'; a.textContent = (seen.indexOf(t[0]) >= 0 ? '✓ ' : '') + t[1];
      if (seen.indexOf(t[0]) >= 0) a.className = 'on'; if (t[0] === booth) { a.className += ' cur'; a.setAttribute('aria-current', 'page'); } li.appendChild(a); ul.appendChild(li); });
    box.appendChild(ul);
    var i = TOUR.map(function (t) { return t[0]; }).indexOf(booth), nx = null;
    for (var k = 1; k < TOUR.length; k++) { var c = TOUR[(i + k) % TOUR.length]; if (seen.indexOf(c[0]) < 0) { nx = c; break; } }
    var a = document.createElement('a'); a.className = 'gtt-next';
    if (nx) { a.href = '/' + nx[0] + '/'; a.innerHTML = '<span><small>まだ行っていないブース</small></span><span aria-hidden="true">→</span>'; a.firstChild.appendChild(document.createTextNode('つぎは「' + nx[1] + '」へ')); }
    else { a.href = '/guestbook/'; a.innerHTML = '<span><small>ぜんぶ見てくれてありがとう！</small>ゲストブックに足あとを残す</span><span aria-hidden="true">→</span>'; }
    box.appendChild(a);
    var foots = document.querySelectorAll('body > footer, body > .foot, body > .mu-foot'), f = foots[foots.length - 1];
    if (f) f.parentNode.insertBefore(box, f); else document.body.appendChild(box);
    if (justDone) { var t = document.createElement('div'); t.className = 'gtt-toast'; t.setAttribute('role', 'status'); t.textContent = '全ブース制覇！ おめでとう！'; document.body.appendChild(t); setTimeout(function () { t.remove(); }, 4200); try { if (window.gtag) window.gtag('event', 'tour_complete'); } catch (e) {} }
  }
  function init() {
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    var box = document.createElement('nav'); box.className = 'gtm'; box.setAttribute('aria-label', 'サイトメニュー');
    var btn = document.createElement('button'); btn.type = 'button'; btn.className = 'gtm-btn'; btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-controls', 'gtm-panel'); btn.setAttribute('aria-label', 'メニュー（ホームへ戻る・ほかのブースへ）');
    btn.appendChild(document.createElement('i'));
    var pn = document.createElement('div'); pn.className = 'gtm-panel'; pn.id = 'gtm-panel';
    var cap = document.createElement('p'); cap.textContent = 'GiveTex のブース　めぐり ' + nSeen + ' / ' + TOUR.length; pn.appendChild(cap);
    LINKS.forEach(function (l) {
      var a = document.createElement('a'); a.href = l[1]; a.textContent = l[0];
      a.style.fontFamily = l[2] + ',-apple-system,"Hiragino Sans",sans-serif';
      if (l[1] !== '/' && here.indexOf(l[1]) === 0) a.setAttribute('aria-current', 'page');
      var key = l[1].replace(/\//g, ''); if (seen.indexOf(key) >= 0) { var ck = document.createElement('i'); ck.textContent = '✓'; ck.setAttribute('aria-label', '見た'); a.appendChild(ck); }
      pn.appendChild(a);
    });
    // 先頭の「ホーム」は一番下（ボタンの近く）にも置きたいので、パネルを下から開く並びのまま
    box.appendChild(pn); box.appendChild(btn); document.body.appendChild(box);
    function set(open) { box.classList.toggle('open', open); btn.setAttribute('aria-expanded', open ? 'true' : 'false'); if (open) { var f = pn.querySelector('a'); if (f) f.focus({ preventScroll: true }); } }
    btn.addEventListener('pointerdown', loadFonts, { passive: true });
    if ('requestIdleCallback' in window) requestIdleCallback(loadFonts, { timeout: 4000 }); else setTimeout(loadFonts, 2500);
    btn.addEventListener('click', function (e) { loadFonts(); e.stopPropagation(); set(!box.classList.contains('open')); try { if (window.gtag) window.gtag('event', 'menu_open', { page: here }); } catch (x) {} });
    document.addEventListener('click', function (e) { if (!box.contains(e.target)) set(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && box.classList.contains('open')) { set(false); btn.focus(); } });
    tourStrip();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
