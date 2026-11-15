/* 創作ブース — 一覧／マンガリーダー／小説リーダー／会場用QRコード */
(function () {
  'use strict';
  var DATA = window.SOUSAKU || { works: [], events: [] };
  var WORKS = DATA.works || [];
  var params = new URLSearchParams(location.search);
  function $(s, el) { return (el || document).querySelector(s); }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  function track(name, p) { try { if (window.gtag) window.gtag('event', name, p || {}); } catch (e) {} }

  // プレビュー（下書きも表示）は ?preview=1 で有効、?preview=0 で解除。このタブの中だけ有効
  try {
    if (params.get('preview') === '1') sessionStorage.setItem('sk-preview', '1');
    if (params.get('preview') === '0') sessionStorage.removeItem('sk-preview');
  } catch (e) {}
  var PREVIEW = false; try { PREVIEW = sessionStorage.getItem('sk-preview') === '1'; } catch (e) {}
  if (PREVIEW) {
    var pb = el('div', 'sk-preview'); pb.innerHTML = 'プレビュー表示中（下書き・限定公開の作品も表示しています）　<a href="?preview=0">解除</a>';
    document.body.insertBefore(pb, document.body.firstChild);
  }
  function readable(w) { return w && (w.status !== 'draft' || PREVIEW); }
  function readUrl(w) { return '/sousaku/read/?w=' + encodeURIComponent(w.id); }
  var STATE = { public: '', unlisted: '限定公開', draft: '下書き' };

  /* ---------- 会場用QRコード ---------- */
  var qrLib = null;
  function loadQR(cb) {
    if (window.QRCode) return cb();
    if (qrLib) { qrLib.addEventListener('load', cb); return; }
    qrLib = document.createElement('script');
    qrLib.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
    qrLib.onload = cb; document.head.appendChild(qrLib);
  }
  function showQR(w) {
    var url = location.origin + readUrl(w);
    var d = $('dialog.sk-qr');
    if (!d) {
      d = el('dialog', 'sk-qr');
      d.innerHTML = '<h2></h2><p class="u"></p><div class="sk-qr-code" aria-label="QRコード"></div><p>スマホのカメラで読み込むと、その場で読めます。</p><button class="rd-btn" type="button">閉じる</button>';
      d.querySelector('button').addEventListener('click', function () { d.close(); });
      d.addEventListener('click', function (e) { if (e.target === d) d.close(); });
      document.body.appendChild(d);
    }
    d.querySelector('h2').textContent = w.title;
    d.querySelector('.u').textContent = url;
    var box = d.querySelector('.sk-qr-code'); box.innerHTML = '読み込み中…';
    d.showModal();
    loadQR(function () {
      box.innerHTML = '';
      try { new window.QRCode(box, { text: url, width: 240, height: 240, correctLevel: window.QRCode.CorrectLevel.M }); }
      catch (e) { box.textContent = 'QRコードを作れませんでした'; }
    });
    track('sousaku_qr', { work: w.id });
  }

  /* =========================================================
     ブースのトップ
     ========================================================= */
  var grid = $('#sk-grid');
  if (grid) {
    // 出展情報
    var evBox = $('#sk-events');
    var today = new Date(); today.setHours(0, 0, 0, 0);
    var events = (DATA.events || []).slice().sort(function (a, b) { return String(a.date).localeCompare(String(b.date)); });
    var upcoming = events.filter(function (e) { return new Date(e.date + 'T23:59:59') >= today; });
    if (evBox) {
      if (!upcoming.length) {
        var em = el('div', 'sk-empty'); em.appendChild(el('b', null, '出展予定は、決まりしだいここでお知らせします'));
        em.appendChild(el('span', null, 'コミケなどのイベントで、マンガや小説を頒布する予定です。')); evBox.appendChild(em);
      } else upcoming.forEach(function (e) {
        var c = el('article', 'sk-event'), d = new Date(e.date + 'T00:00:00');
        var day = el('div', 'day'); day.appendChild(el('small', null, d.getFullYear() + '年')); day.appendChild(document.createTextNode((d.getMonth() + 1) + '/' + d.getDate()));
        day.appendChild(el('small', null, '（' + '日月火水木金土'[d.getDay()] + '）')); c.appendChild(day);
        c.appendChild(el('h3', null, e.name));
        var p1 = el('p'); if (e.space) p1.appendChild(el('span', 'space', e.space)); p1.appendChild(document.createTextNode(e.place || '')); c.appendChild(p1);
        if (e.note) c.appendChild(el('p', null, e.note));
        evBox.appendChild(c);
      });
    }
    // 作品一覧（公開のみ。プレビュー時は全部）
    var type = '';
    var list = WORKS.filter(function (w) { return w.status === 'public' || PREVIEW; });
    function render() {
      grid.innerHTML = '';
      var shown = list.filter(function (w) { return !type || w.type === type; });
      if (!shown.length) {
        var em = el('div', 'sk-empty'); em.style.gridColumn = '1/-1';
        em.appendChild(el('b', null, '公開中の作品はまだありません'));
        em.appendChild(el('span', null, '出展にあわせて、ここで読めるようにしていきます。')); grid.appendChild(em); return;
      }
      shown.forEach(function (w) {
        var a = el('a', 'sk-work'); a.href = readUrl(w);
        var cv = el('div', 'sk-cover');
        if (w.cover) { var im = el('img'); im.src = w.cover; im.alt = ''; im.loading = 'lazy'; cv.appendChild(im); }
        else cv.appendChild(el('div', 'ph', w.title));
        cv.appendChild(el('span', 'sk-type' + (w.type === 'novel' ? ' novel' : ''), w.type === 'novel' ? '小説' : 'マンガ'));
        if (STATE[w.status]) cv.appendChild(el('span', 'sk-state', STATE[w.status]));
        a.appendChild(cv); a.appendChild(el('h3', null, w.title));
        if (w.desc) a.appendChild(el('p', null, w.desc));
        grid.appendChild(a);
      });
    }
    Array.prototype.forEach.call(document.querySelectorAll('.sk-filter button'), function (b) {
      b.addEventListener('click', function () {
        type = b.getAttribute('data-type');
        Array.prototype.forEach.call(document.querySelectorAll('.sk-filter button'), function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        render();
      });
    });
    render();
  }

  /* =========================================================
     リーダー
     ========================================================= */
  var reader = $('#rd');
  if (!reader) return;
  var work = null; WORKS.forEach(function (w) { if (w.id === params.get('w')) work = w; });
  if (!readable(work)) {
    document.body.classList.remove('reader');
    reader.innerHTML = '<div class="sk-wrap" style="padding-top:80px"><div class="sk-empty"><b>この作品は、いまは読めません</b><span>URLをもう一度ご確認ください。</span><p><a href="/sousaku/">創作ブースへ</a></p></div></div>';
    return;
  }
  document.title = work.title + ' | 創作ブース';
  $('.rd-title').textContent = work.title;
  $('[data-qr]').addEventListener('click', function () { showQR(work); });
  track('sousaku_open', { work: work.id, type: work.type });

  // 設定パネル
  var panelBtn = $('[data-panel]'), panel = $('.sk-panel');
  panelBtn.addEventListener('click', function () { panel.hidden = !panel.hidden; panelBtn.setAttribute('aria-expanded', panel.hidden ? 'false' : 'true'); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) { panel.hidden = true; panelBtn.setAttribute('aria-expanded', 'false'); } });
  document.addEventListener('click', function (e) { if (!panel.hidden && !panel.contains(e.target) && !panelBtn.contains(e.target)) { panel.hidden = true; panelBtn.setAttribute('aria-expanded', 'false'); } });
  function seg(title, opts, cur, onPick) {
    panel.appendChild(el('p', null, title));
    var row = el('div', 'sk-seg');
    opts.forEach(function (o) {
      var b = el('button', 'rd-btn', o[1]); b.type = 'button'; b.setAttribute('aria-pressed', o[0] === cur ? 'true' : 'false');
      b.addEventListener('click', function () { Array.prototype.forEach.call(row.children, function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); }); onPick(o[0]); });
      row.appendChild(b);
    });
    panel.appendChild(row);
  }

  if (work.type === 'manga') manga(work); else novel(work);

  /* ---------- マンガ ---------- */
  function manga(w) {
    var pages = w.pages || [], rtl = (w.dir || 'rtl') === 'rtl';
    $('.nv-progress').hidden = true; $('.nv').remove();
    var stage = $('.mg-stage'), slider = $('.mg-slider'), count = $('.mg-count'), endBox = $('.mg-end');
    stage.classList.toggle('rtl', rtl); slider.classList.toggle('rtl', rtl);
    var spreadPref = store('sk-spread'); // 'on' / 'off' / null(自動)
    var views = [], vi = 0;
    function autoSpread() { return window.innerWidth >= 900 && window.innerWidth > window.innerHeight; }
    function spreadOn() { return spreadPref === 'on' ? true : spreadPref === 'off' ? false : autoSpread(); }
    function build() {
      var cur = views.length ? views[vi][0] : 0;
      views = [];
      if (spreadOn()) {
        var i = 0;
        if (w.firstSingle !== false && pages.length) { views.push([0]); i = 1; }
        for (; i < pages.length; i += 2) views.push(i + 1 < pages.length ? [i, i + 1] : [i]);
      } else for (var j = 0; j < pages.length; j++) views.push([j]);
      vi = 0; views.forEach(function (v, k) { if (v.indexOf(cur) >= 0) vi = k; });
      stage.classList.toggle('spread', spreadOn());
      slider.max = views.length; show();
    }
    function show() {
      stage.innerHTML = '';
      views[vi].forEach(function (p) { var im = el('img'); im.src = pages[p]; im.alt = (p + 1) + 'ページ'; im.draggable = false; stage.appendChild(im); });
      var v = views[vi];
      count.textContent = (v.length > 1 ? (v[0] + 1) + '-' + (v[1] + 1) : (v[0] + 1)) + ' / ' + pages.length;
      slider.value = vi + 1;
      store('sk-pos-' + w.id, String(v[0]));
      [vi + 1, vi + 2].forEach(function (k) { if (views[k]) views[k].forEach(function (p) { var pre = new Image(); pre.src = pages[p]; }); });
    }
    function go(k) {
      if (k >= views.length) { endBox.hidden = false; track('sousaku_read_end', { work: w.id }); return; }
      endBox.hidden = true; vi = Math.max(0, k); show();
    }
    function next() { go(vi + 1); hideUI(); }
    function prev() { if (!endBox.hidden) { endBox.hidden = true; return; } go(vi - 1); }
    $('.mg-zone.left').addEventListener('click', function () { rtl ? next() : prev(); });
    $('.mg-zone.right').addEventListener('click', function () { rtl ? prev() : next(); });
    $('.mg-zone.left').setAttribute('aria-label', rtl ? '次のページ' : '前のページ');
    $('.mg-zone.right').setAttribute('aria-label', rtl ? '前のページ' : '次のページ');
    stage.addEventListener('click', function () { document.body.classList.toggle('ui-hidden'); });
    slider.addEventListener('input', function () { go(+slider.value - 1); });
    document.addEventListener('keydown', function (e) {
      if (document.body.classList.contains('scroll-mode') || e.target.tagName === 'INPUT') return;
      var k = e.key;
      if (k === 'ArrowLeft') { e.preventDefault(); rtl ? next() : prev(); }
      else if (k === 'ArrowRight') { e.preventDefault(); rtl ? prev() : next(); }
      else if (k === ' ' || k === 'PageDown') { e.preventDefault(); next(); }
      else if (k === 'PageUp') { e.preventDefault(); prev(); }
      else if (k === 'Home') go(0); else if (k === 'End') go(views.length - 1);
    });
    // スワイプ
    var sx = null, sy = null;
    document.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') { sx = e.clientX; sy = e.clientY; } });
    document.addEventListener('pointerup', function (e) {
      if (sx == null || document.body.classList.contains('scroll-mode')) return;
      var dx = e.clientX - sx, dy = e.clientY - sy; sx = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.3) { (dx > 0) === rtl ? next() : prev(); }
    });
    var uiTimer = null;
    function hideUI() { clearTimeout(uiTimer); uiTimer = setTimeout(function () { document.body.classList.add('ui-hidden'); }, 400); }
    window.addEventListener('resize', function () { if (spreadPref == null) build(); });
    // 設定：見開き・縦スクロール
    seg('ページの表示', [['auto', '自動'], ['off', '1ページ'], ['on', '見開き']], spreadPref || 'auto', function (v) {
      spreadPref = v === 'auto' ? null : v; store('sk-spread', v === 'auto' ? '' : v); if (v === 'auto') try { localStorage.removeItem('sk-spread'); } catch (e) {} build();
    });
    var scroller = $('.mg-scroll'), scrollBuilt = false;
    seg('読み方', [['page', 'めくる'], ['scroll', '縦スクロール']], store('sk-mode') === 'scroll' ? 'scroll' : 'page', function (v) { setMode(v); store('sk-mode', v); });
    function setMode(v) {
      document.body.classList.toggle('scroll-mode', v === 'scroll');
      document.body.classList.remove('ui-hidden');
      if (v === 'scroll' && !scrollBuilt) {
        scrollBuilt = true;
        pages.forEach(function (p, i) { var im = el('img'); im.src = p; im.alt = (i + 1) + 'ページ'; im.loading = 'lazy'; scroller.appendChild(im); });
        var e2 = el('div', 'mg-end-in'); e2.style.margin = '40px auto'; e2.appendChild(el('b', null, 'おわり'));
        var back = el('a', 'rd-btn', '創作ブースへ戻る'); back.href = '/sousaku/'; e2.appendChild(back); scroller.appendChild(e2);
      }
    }
    if (store('sk-mode') === 'scroll') setMode('scroll');
    // 全画面
    var fs = $('[data-fs]');
    if (fs && document.documentElement.requestFullscreen) fs.addEventListener('click', function () { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen().catch(function () {}); });
    else if (fs) fs.hidden = true;
    // おわり画面
    $('[data-restart]').addEventListener('click', function () { go(0); });
    $('[data-qr-end]').addEventListener('click', function () { showQR(w); });
    // 前回の続きから（保存位置は build() で上書きされる前に読む）
    var last = parseInt(store('sk-pos-' + w.id) || '0', 10);
    build();
    if (last > 0 && last < pages.length - 1) {
      views.forEach(function (v, k) { if (v.indexOf(last) >= 0) vi = k; }); show();
      var hint = el('div', 'mg-hint', '前回の続き（' + (last + 1) + 'ページ）から表示しています'); document.body.appendChild(hint);
      setTimeout(function () { hint.style.opacity = '0'; }, 2600); setTimeout(function () { hint.remove(); }, 3400);
    }
  }

  /* ---------- 小説 ---------- */
  function novel(w) {
    document.body.classList.add('novel-mode');
    ['.mg-stage', '.mg-zone.left', '.mg-zone.right', '.mg-scroll', '.mg-end', '.mg-count', '.mg-slider'].forEach(function (s) { var x = $(s); if (x) x.remove(); });
    $('.nv').hidden = false;
    var box = $('.nv'), text = $('.nv-text'), bar = $('.nv-progress span');
    $('.nv-head h1').textContent = w.title;
    $('.nv-head p').textContent = w.author || '';
    var vertical = store('sk-novel-v'); vertical = vertical == null ? w.vertical !== false : vertical === '1';
    var theme = store('sk-novel-theme') || 'light', size = store('sk-novel-size') || 'm';
    function apply() {
      box.className = 'nv ' + (vertical ? 'nv-v' : 'nv-h');
      if (theme === 'light') document.body.removeAttribute('data-theme'); else document.body.setAttribute('data-theme', theme);
      if (size === 'm') document.body.removeAttribute('data-size'); else document.body.setAttribute('data-size', size);
      restore();
    }
    seg('組み方', [['v', '縦書き'], ['h', '横書き']], vertical ? 'v' : 'h', function (v) { save(); vertical = v === 'v'; store('sk-novel-v', vertical ? '1' : '0'); apply(); });
    seg('文字の大きさ', [['s', '小'], ['m', '中'], ['l', '大']], size, function (v) { save(); size = v; store('sk-novel-size', v); apply(); });
    seg('背景', [['light', '白'], ['sepia', 'セピア'], ['dark', '黒']], theme, function (v) { theme = v; store('sk-novel-theme', v); apply(); });
    // 縦書きでは数字2桁を縦中横に
    function tcy(root) {
      var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach(function (n) {
        if (!/(^|[^0-9!?！？])([0-9]{2}|!!|!\?|\?!)(?![0-9])/.test(n.nodeValue) || n.parentNode.closest('rt')) return;
        var f = document.createDocumentFragment(), s = n.nodeValue, re = /([0-9]{2}|!!|!\?|\?!)/g, last = 0, m;
        while ((m = re.exec(s))) {
          var before = s.charAt(m.index - 1), after = s.charAt(m.index + m[0].length);
          if (/[0-9]/.test(before) || /[0-9]/.test(after)) continue;
          f.appendChild(document.createTextNode(s.slice(last, m.index)));
          var sp = el('span', 'tcy', m[0]); f.appendChild(sp); last = m.index + m[0].length;
        }
        f.appendChild(document.createTextNode(s.slice(last))); n.parentNode.replaceChild(f, n);
      });
    }
    // 進み具合と、前回の位置
    function ratio() {
      if (vertical) { var max = box.scrollWidth - box.clientWidth; return max > 0 ? Math.min(1, Math.abs(box.scrollLeft) / max) : 1; }
      var mh = document.documentElement.scrollHeight - innerHeight; return mh > 0 ? Math.min(1, scrollY / mh) : 1;
    }
    function upd() { bar.style.width = (ratio() * 100) + '%'; if (ratio() > 0.98 && !upd.done) { upd.done = true; track('sousaku_read_end', { work: w.id }); } }
    function save() { store('sk-npos-' + w.id, String(ratio())); }
    function restore() {
      var r = parseFloat(store('sk-npos-' + w.id) || '0');
      requestAnimationFrame(function () {
        if (vertical) { var max = box.scrollWidth - box.clientWidth; box.scrollLeft = -max * r; window.scrollTo(0, 0); }
        else { box.scrollLeft = 0; window.scrollTo(0, (document.documentElement.scrollHeight - innerHeight) * r); }
        upd();
      });
    }
    var t = null;
    function onScroll() { upd(); clearTimeout(t); t = setTimeout(save, 300); }
    box.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    // 縦書き：ホイールで横に進む・矢印キー
    box.addEventListener('wheel', function (e) {
      if (!vertical || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      e.preventDefault(); box.scrollBy({ left: -e.deltaY });
    }, { passive: false });
    document.addEventListener('keydown', function (e) {
      if (!vertical) return;
      var step = box.clientWidth * 0.85;
      if (e.key === 'ArrowLeft' || e.key === ' ' || e.key === 'PageDown') { e.preventDefault(); box.scrollBy({ left: -step, behavior: 'smooth' }); }
      else if (e.key === 'ArrowRight' || e.key === 'PageUp') { e.preventDefault(); box.scrollBy({ left: step, behavior: 'smooth' }); }
    });
    fetch(w.text).then(function (r) { if (!r.ok) throw 0; return r.text(); }).then(function (h) {
      var tpl = document.createElement('template'); tpl.innerHTML = h;
      Array.prototype.forEach.call(tpl.content.querySelectorAll('script,style,iframe,object'), function (x) { x.remove(); });
      text.innerHTML = ''; text.appendChild(tpl.content); tcy(text); apply();
    }).catch(function () { text.innerHTML = '<p>本文を読み込めませんでした。</p>'; apply(); });
  }
})();
