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
    try { tag = new URLSearchParams(location.search).get('tag') || ''; } catch (e) {}
    var tags = {};
    POSTS.forEach(function (p) { (p.tags || []).forEach(function (t) { tags[t] = (tags[t] || 0) + 1; }); });
    var chips = $('#nb-chips');
    var tagNames = Object.keys(tags).sort(function (a, b) { return tags[b] - tags[a]; }).slice(0, 24);
    if (tag && tagNames.indexOf(tag) < 0 && tags[tag]) tagNames.unshift(tag);
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
        var h2 = el('h2', null, p.title);
        if (p.paid) h2.appendChild(el('span', 'nb-badge', '有料'));
        else if (p.noteUrl && (CONF.teaserDays == null ? 14 : CONF.teaserDays) > 0 && Date.now() < Date.parse(p.date + 'T00:00:00+09:00') + (CONF.teaserDays == null ? 14 : CONF.teaserDays) * 864e5) h2.appendChild(el('span', 'nb-badge', 'note 先行'));
        a.appendChild(h2);
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
    // 新着記事は note で先行公開：最初の数日は冒頭だけ見せて note へ（日数は posts.js の NOTE_CONFIG.teaserDays）
    var meT = null; POSTS.forEach(function (p) { if (p.slug === slug) meT = p; });
    var DAYS = CONF.teaserDays == null ? 14 : CONF.teaserDays;
    if (meT && meT.noteUrl && !meT.paid && prose && DAYS > 0) {
      var pub = Date.parse(meT.date + 'T00:00:00+09:00'), open = pub + DAYS * 864e5;
      if (Date.now() < open) {
        var kids = Array.prototype.slice.call(prose.children), chars = 0, keep = 0;
        for (var c = 0; c < kids.length; c++) { chars += (kids[c].textContent || '').length; keep = c + 1; if (chars >= (CONF.teaserChars || 600) && keep >= 2) break; }
        if (keep < kids.length) {
          for (var h = keep; h < kids.length; h++) kids[h].hidden = true;
          prose.classList.add('is-teaser');
          var d = new Date(open), md = (d.getMonth() + 1) + '月' + d.getDate() + '日';
          var box = el('div', 'nb-teaser');
          box.appendChild(el('b', null, 'この記事は note で先行公開中です'));
          box.appendChild(el('span', null, '続きは note でどうぞ。' + md + 'からは、ここでも全文を読めます。'));
          var go = el('a', 'nb-btn primary', 'note で続きを読む ↗'); go.href = meT.noteUrl; go.target = '_blank'; go.rel = 'noopener';
          box.appendChild(go);
          prose.parentNode.insertBefore(box, prose.nextSibling);
          var fin = $('.nb-fin'), org0 = $('.nb-origin');
          if (fin) fin.hidden = true;
          if (org0) org0.hidden = true;
        }
      }
    }
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
    // あわせて読みたい（note へ）— 同じタグが多い順、同点なら日付が近い順に3本
    var me = i >= 0 ? POSTS[i] : null;
    if (me && pager) {
      var mine = me.tags || [], t0 = Date.parse(me.date) || 0;
      var picks = POSTS.filter(function (p) { return p.slug !== me.slug && p.noteUrl; })
        .map(function (p) {
          var shared = (p.tags || []).filter(function (t) { return mine.indexOf(t) >= 0; }).length;
          return { p: p, score: shared * 1e12 - Math.abs((Date.parse(p.date) || 0) - t0) };
        })
        .sort(function (x, y) { return y.score - x.score; }).slice(0, 3);
      if (picks.length) {
        var sec = el('section', 'nb-more'); sec.setAttribute('aria-labelledby', 'nb-more-h');
        var h = el('h2', null, 'あわせて読みたい'); h.id = 'nb-more-h'; sec.appendChild(h);
        sec.appendChild(el('p', 'nb-more-lead', 'NingentteWinner の note から'));
        var grid = el('div', 'nb-more-grid');
        picks.forEach(function (x) {
          var p = x.p, a = el('a', 'nb-more-card'); a.href = p.noteUrl; a.target = '_blank'; a.rel = 'noopener';
          if (p.cover) { var im = el('img'); im.src = p.cover; im.alt = ''; im.loading = 'lazy'; a.appendChild(im); }
          else a.appendChild(el('span', 'nb-more-noimg', '✒'));
          var tx = el('span', 'nb-more-tx');
          tx.appendChild(el('time', null, fmt(p.date)));
          tx.appendChild(el('b', null, p.title));
          tx.appendChild(el('span', 'nb-more-go', 'note で読む ↗'));
          a.appendChild(tx); grid.appendChild(a);
        });
        sec.appendChild(grid);
        if (CONF.profileUrl) {
          var cta = el('div', 'nb-follow');
          cta.appendChild(el('p', null, 'ほかの記事や新しい投稿は、note でどうぞ。スキ・フォローもうれしいです。'));
          var fa = el('a', 'nb-btn primary', 'NingentteWinner の note を見る ↗'); fa.href = CONF.profileUrl; fa.target = '_blank'; fa.rel = 'noopener';
          cta.appendChild(fa); sec.appendChild(cta);
        }
        pager.parentNode.insertBefore(sec, pager);
      }
    }
    // note の元記事
    var origin = $('.nb-origin');
    if (origin) {
      if (me && me.noteUrl) { var oa = $('a', origin); oa.href = me.noteUrl; } else origin.hidden = true;
      if ($('.nb-teaser')) origin.hidden = true;
    }
  }
})();
