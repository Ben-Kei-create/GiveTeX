/* note ブース — 表示設定・記事一覧・読書の進み具合・前後の記事 */
(function () {
  'use strict';
  var root = document.documentElement;
  var POSTS = (Array.isArray(window.NOTE_POSTS) ? window.NOTE_POSTS : []).slice()
    .sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); });
  var CONF = window.NOTE_CONFIG || {};

  function $(s, el) { return (el || document).querySelector(s); }
  function $$(s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function fmt(d) { var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(d || ''); return m ? m[1] + '.' + m[2] + '.' + m[3] : (d || ''); }
  function save(k, v) { try { localStorage.setItem('givetex-note-' + k, v); } catch (e) {} }
  function postUrl(p) { return '/note/posts/' + p.slug + '.html'; }

  /* ---------- 表示設定（テーマ・文字サイズ・書体） ---------- */
  var btn = $('.nb-settings-btn'), panel = $('.nb-settings');
  function syncSettings() {
    $$('.nb-settings [data-set]').forEach(function (b) {
      var k = b.getAttribute('data-set'), v = b.getAttribute('data-val');
      var cur = root.getAttribute('data-' + k) || (k === 'theme' ? 'auto' : k === 'size' ? 'm' : 'serif');
      b.setAttribute('aria-pressed', cur === v ? 'true' : 'false');
    });
  }
  if (btn && panel) {
    btn.addEventListener('click', function () {
      var open = panel.hidden;
      panel.hidden = !open; btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', function (e) {
      if (!panel.hidden && !panel.contains(e.target) && !btn.contains(e.target)) { panel.hidden = true; btn.setAttribute('aria-expanded', 'false'); }
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) { panel.hidden = true; btn.setAttribute('aria-expanded', 'false'); btn.focus(); } });
    $$('.nb-settings [data-set]').forEach(function (b) {
      b.addEventListener('click', function () {
        var k = b.getAttribute('data-set'), v = b.getAttribute('data-val');
        if (v === 'auto' || (k === 'size' && v === 'm') || (k === 'face' && v === 'serif')) root.removeAttribute('data-' + k);
        else root.setAttribute('data-' + k, v);
        save(k, v); syncSettings();
      });
    });
    syncSettings();
  }

  /* ---------- note のプロフィールへのリンク ---------- */
  $$('[data-note-profile]').forEach(function (a) {
    if (CONF.profileUrl) { a.href = CONF.profileUrl; a.hidden = false; } else { a.hidden = true; }
  });

  /* ---------- 記事一覧（ブースのトップ） ---------- */
  var listBox = $('#nb-list');
  if (listBox) {
    var q = '', tag = '';
    var tags = {};
    POSTS.forEach(function (p) { (p.tags || []).forEach(function (t) { tags[t] = (tags[t] || 0) + 1; }); });
    var chips = $('#nb-chips');
    var tagNames = Object.keys(tags).sort(function (a, b) { return tags[b] - tags[a]; });
    function chip(label, val) {
      var c = el('button', 'nb-chip', label); c.type = 'button'; c.setAttribute('aria-pressed', val === tag ? 'true' : 'false');
      c.addEventListener('click', function () { tag = val; $$('.nb-chip', chips).forEach(function (x) { x.setAttribute('aria-pressed', 'false'); }); c.setAttribute('aria-pressed', 'true'); render(); });
      return c;
    }
    if (chips) {
      if (tagNames.length) { chips.appendChild(chip('すべて', '')); tagNames.forEach(function (t) { chips.appendChild(chip(t, t)); }); }
      else chips.hidden = true;
    }
    var search = $('#nb-q');
    if (search) search.addEventListener('input', function () { q = search.value.trim().toLowerCase(); render(); });

    function render() {
      listBox.innerHTML = '';
      var hit = POSTS.filter(function (p) {
        if (tag && (p.tags || []).indexOf(tag) < 0) return false;
        if (!q) return true;
        return (p.title + ' ' + (p.excerpt || '') + ' ' + (p.tags || []).join(' ')).toLowerCase().indexOf(q) >= 0;
      });
      var count = $('#nb-count');
      if (count) count.textContent = POSTS.length ? (q || tag ? hit.length + ' 件 / 全 ' + POSTS.length + ' 件' : '全 ' + POSTS.length + ' 件') : '';
      var years = $('#nb-years'); if (years) years.innerHTML = '';
      if (!hit.length) {
        var e = el('div', 'nb-empty');
        e.appendChild(el('b', null, POSTS.length ? '見つかりませんでした' : 'まだ記事はありません'));
        e.appendChild(el('span', null, POSTS.length ? 'ことばを変えて、もう一度さがしてみてください。' : 'note からの移植を準備中です。'));
        listBox.appendChild(e); return;
      }
      var lastYear = null, ul = null;
      hit.forEach(function (p) {
        var y = String(p.date).slice(0, 4);
        if (y !== lastYear) {
          lastYear = y;
          var h = el('h2', 'nb-year', y); h.id = 'y' + y; listBox.appendChild(h);
          ul = el('ul', 'nb-list'); listBox.appendChild(ul);
          if (years) { var ya = el('a', null, y + '年'); ya.href = '#y' + y; years.appendChild(ya); }
        }
        var li = el('li', 'nb-item'), a = el('a'); a.href = postUrl(p);
        var t = el('time', null, fmt(p.date)); t.dateTime = p.date; a.appendChild(t);
        a.appendChild(el('h2', null, p.title));
        if (p.excerpt) a.appendChild(el('p', null, p.excerpt));
        if (p.cover) { var im = el('img', 'nb-thumb'); im.src = p.cover; im.alt = ''; im.loading = 'lazy'; a.appendChild(im); }
        if (p.tags && p.tags.length) { var tg = el('div', 'nb-tags'); p.tags.forEach(function (x) { tg.appendChild(el('span', null, x)); }); a.appendChild(tg); }
        li.appendChild(a); ul.appendChild(li);
      });
    }
    render();
  }

  /* ---------- 記事ページ ---------- */
  var article = $('.nb-article');
  if (article) {
    var slug = article.getAttribute('data-slug');
    var prose = $('.nb-prose', article);
    // 読了時間（日本語 約500字／分）
    var rt = $('[data-readtime]');
    if (rt && prose) {
      var n = (prose.textContent || '').replace(/\s+/g, '').length;
      rt.textContent = Math.max(1, Math.round(n / 500)) + '分で読めます（約' + n.toLocaleString() + '字）';
    }
    // 進み具合バー
    var bar = $('.nb-progress span');
    if (bar && prose) {
      var tick = false;
      var update = function () {
        tick = false;
        var r = prose.getBoundingClientRect(), vh = window.innerHeight;
        var total = r.height - vh * 0.6, done = -r.top + vh * 0.25;
        var pct = total > 0 ? Math.min(100, Math.max(0, done / total * 100)) : 100;
        bar.style.width = pct + '%';
      };
      window.addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(update); } }, { passive: true });
      window.addEventListener('resize', update); update();
    }
    // 前後の記事
    var pager = $('.nb-pager');
    var i = -1; POSTS.forEach(function (p, k) { if (p.slug === slug) i = k; });
    if (pager) {
      var newer = i > 0 ? POSTS[i - 1] : null, older = i >= 0 && i < POSTS.length - 1 ? POSTS[i + 1] : null;
      function card(p, cls, label) {
        var a = el('a', cls); a.href = postUrl(p); a.appendChild(el('small', null, label)); a.appendChild(el('b', null, p.title)); return a;
      }
      if (older) pager.appendChild(card(older, 'prev', '← 前の記事'));
      if (newer) pager.appendChild(card(newer, 'next', '次の記事 →'));
      var all = el('a', 'all', '記事の一覧へ'); all.href = '/note/'; pager.appendChild(all);
    }
    // note の元記事
    var me = i >= 0 ? POSTS[i] : null, origin = $('.nb-origin');
    if (origin) {
      if (me && me.noteUrl) { var oa = $('a', origin); oa.href = me.noteUrl; } else origin.hidden = true;
    }
  }
})();
