/* どろん — タブ切り替え・記録の描画・写真ライトボックス */
(function () {
  'use strict';
  var GROUPS = ['relics', 'reikai', 'c-circle'];
  var LABEL = { relics: 'RELIC', reikai: '受付', 'c-circle': '発表' };
  var EMPTY = {
    relics: ['i-relics', 'まだ遺物は収蔵されていません。', '最初の座談会の記録を準備中です。灯りがともるまで、もうしばらく。'],
    reikai: ['i-reikai', 'ただいま受付準備中。', '最初の行き先は、まもなくご案内します。'],
    'c-circle': ['i-c', '発表資料を準備中。', '最初の発表が終わったら、スライドと写真をここに。']
  };
  var reports = Array.isArray(window.DORON_REPORTS) ? window.DORON_REPORTS : [];

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function icon(id) {
    var ns = 'http://www.w3.org/2000/svg';
    var s = document.createElementNS(ns, 'svg');
    s.setAttribute('aria-hidden', 'true');
    var u = document.createElementNS(ns, 'use');
    u.setAttribute('href', '#' + id);
    s.appendChild(u);
    return s;
  }
  function fmtDate(d) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(d || '');
    return m ? m[1] + '.' + m[2] + '.' + m[3] : (d || '');
  }
  function pad(n, w) { n = String(n); while (n.length < w) n = '0' + n; return n; }

  /* ---------- 写真ライトボックス ---------- */
  var lb = document.querySelector('dialog.lb');
  function openPhoto(p) {
    if (!lb || typeof lb.showModal !== 'function') { window.open(p.src, '_blank', 'noopener'); return; }
    lb.querySelector('img').src = p.src;
    lb.querySelector('img').alt = p.caption || '';
    lb.querySelector('p').textContent = p.caption || '';
    lb.showModal();
  }
  if (lb) {
    lb.querySelector('button').addEventListener('click', function () { lb.close(); });
    lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
  }

  /* ---------- 記録カード ---------- */
  function card(r, no, group) {
    var a = el('article', 'rep');
    a.appendChild(el('div', 'rep-no', LABEL[group] + ' No.' + pad(no, group === 'reikai' ? 4 : 3)));
    if (group === 'c-circle') a.appendChild(el('span', 'stamp', '発表'));
    a.appendChild(el('h4', null, r.title || '（無題）'));

    var meta = el('ul', 'rep-meta');
    [['日付', fmtDate(r.date)], [group === 'reikai' ? '行き先' : '場所', r.place], ['参加', r.members]].forEach(function (m) {
      if (!m[1]) return;
      var li = el('li'); li.appendChild(el('b', null, m[0])); li.appendChild(document.createTextNode(m[1])); meta.appendChild(li);
    });
    a.appendChild(meta);

    if (r.summary) {
      var body = el('div', 'rep-body');
      String(r.summary).split(/\n{2,}/).forEach(function (para) { body.appendChild(el('p', null, para)); });
      a.appendChild(body);
    }
    if (Array.isArray(r.topics) && r.topics.length) {
      a.appendChild(el('p', 'rep-sub', '語られた話'));
      var ul = el('ul', 'rep-list');
      r.topics.forEach(function (t) { ul.appendChild(el('li', null, t)); });
      a.appendChild(ul);
    }
    if (r.presentation) {
      var pr = el('div', 'pres');
      if (r.presentation.theme) pr.appendChild(el('p', null, 'テーマ：' + r.presentation.theme));
      if (r.presentation.presenter) pr.appendChild(el('p', null, '発表者：' + r.presentation.presenter));
      if (Array.isArray(r.presentation.points) && r.presentation.points.length) {
        var pl = el('ul', 'rep-list');
        r.presentation.points.forEach(function (t) { pl.appendChild(el('li', null, t)); });
        pr.appendChild(pl);
      }
      a.appendChild(pr);
    }
    if (Array.isArray(r.photos) && r.photos.length) {
      var g = el('div', 'photos');
      r.photos.forEach(function (p) {
        if (!p || !p.src) return;
        var b = el('button'); b.type = 'button';
        b.setAttribute('aria-label', '写真を拡大' + (p.caption ? '：' + p.caption : ''));
        var img = el('img'); img.src = p.src; img.alt = p.caption || ''; img.loading = 'lazy';
        b.appendChild(img);
        b.addEventListener('click', function () { openPhoto(p); });
        g.appendChild(b);
      });
      a.appendChild(g);
    }
    if (Array.isArray(r.tags) && r.tags.length) {
      var tg = el('div', 'rep-tags');
      r.tags.forEach(function (t) { tg.appendChild(el('span', null, '#' + t)); });
      a.appendChild(tg);
    }
    return a;
  }

  GROUPS.forEach(function (g) {
    var box = document.querySelector('.reports[data-group="' + g + '"]');
    var cnt = document.querySelector('[data-count="' + g + '"]');
    if (!box) return;
    var list = reports.filter(function (r) { return r && r.group === g; })
      .sort(function (x, y) { return String(y.date).localeCompare(String(x.date)); });
    if (cnt) cnt.textContent = list.length ? list.length + ' 件' : '';
    if (!list.length) {
      var e = EMPTY[g], d = el('div', 'empty');
      d.appendChild(icon(e[0])); d.appendChild(el('b', null, e[1])); d.appendChild(el('p', null, e[2]));
      box.appendChild(d);
      return;
    }
    list.forEach(function (r, i) { box.appendChild(card(r, list.length - i, g)); });
  });

  /* ---------- タブ ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[role=tab]'));
  function select(name, focus, push) {
    if (GROUPS.indexOf(name) < 0) name = GROUPS[0];
    document.body.setAttribute('data-tab', name);
    tabs.forEach(function (t) {
      var on = t.getAttribute('data-tab') === name;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      if (on && focus) t.focus();
    });
    GROUPS.forEach(function (g) {
      var p = document.getElementById('p-' + g);
      if (!p) return;
      var on = g === name;
      p.hidden = !on;
      if (on) { p.classList.remove('enter'); void p.offsetWidth; p.classList.add('enter'); }
    });
    var meta = document.querySelector('meta[name=theme-color]');
    if (meta) meta.setAttribute('content', getComputedStyle(document.body).getPropertyValue('--bg').trim() || '#07060b');
    if (push && history.replaceState) history.replaceState(null, '', '#' + name);
    if (push) {
      var bar = document.querySelector('.tabs');
      if (bar && window.scrollY > bar.offsetTop) window.scrollTo({ top: bar.offsetTop, behavior: 'smooth' });
    }
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { select(t.getAttribute('data-tab'), false, true); });
    t.addEventListener('keydown', function (e) {
      var k = e.key, n = null;
      if (k === 'ArrowRight') n = (i + 1) % tabs.length;
      else if (k === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
      else if (k === 'Home') n = 0;
      else if (k === 'End') n = tabs.length - 1;
      if (n === null) return;
      e.preventDefault();
      select(tabs[n].getAttribute('data-tab'), true, true);
    });
  });
  var bar = document.querySelector('.tabs');
  if (bar) {
    var onScroll = function () { bar.classList.toggle('stuck', bar.getBoundingClientRect().top <= 0 && window.scrollY > 0); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
  window.addEventListener('hashchange', function () { select(location.hash.slice(1), false, false); });
  select(location.hash.slice(1), false, false);
})();
