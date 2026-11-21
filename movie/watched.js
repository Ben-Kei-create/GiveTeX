/* 映画ブースの「見ごたえ」
   1) いま話題のスライド（大きな背景画像・自動で切りかわる・スワイプ／矢印）
   2) 話題の映画の列に、1〜10位の大きな順位
   3) 管理人の鑑賞記録：洋画／邦画のタブ。観た映画のポスターが並ぶ（新作・旧作・最近観た順でしぼりこみ）
      「管理人」からパスワードを入れると、チェックする画面になる（ポスターを押すと 観た ✓ が切りかわる。リストにない映画も検索して足せる）
   データ：候補は movie/watchlist.js、観たかどうかは /api/watched（Upstash） */
(function () {
  'use strict';
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  function ga(n, p) { try { if (window.gtag) gtag('event', n, p || {}); } catch (e) {} }
  var calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function C() { return window.CLog || null; }
  function okImg(u) { return /^https:\/\/image\.tmdb\.org\/t\/p\/\w+\/[\w-]+\.(jpg|png)$/.test(u || ''); }
  function size(u, s) { return okImg(u) ? u.replace(/\/t\/p\/\w+\//, '/t/p/' + s + '/') : ''; }

  /* ========== 1) いま話題のスライド ========== */
  (function feature() {
    var box = $('#hl'), track = $('#hl-track'), dots = $('#hl-dots'); if (!box) return;
    function J(u) { return fetch(u).then(function (r) { return r.json(); }).catch(function () { return {}; }); }
    // 話題の一覧には背景画像がないので、上位6本だけ、くわしい情報（1日キャッシュ）から背景画像をもらう
    J('/api/clog?r=popular&page=1').then(function (j) {
      var top = ((j && j.results) || []).filter(function (m) { return m.overview; }).slice(0, 6);
      return Promise.all(top.map(function (m) { return J('/api/clog?r=movie&id=' + m.id).then(function (d) { return d && d.movie ? Object.assign({}, m, d.movie, { poster: d.movie.poster || m.poster }) : m; }); }));
    }).then(function (full) {
      var list = (full || []).filter(function (m) { return okImg(m.backdrop) && m.overview; });
      if (list.length < 2) return;
      list.forEach(function (m, i) {
        var s = el('article', 'hl-slide'); s.setAttribute('aria-hidden', i ? 'true' : 'false');
        var bg = el('img', 'hl-bg'); bg.src = size(m.backdrop, 'w1280'); bg.alt = ''; bg.decoding = 'async'; if (i) bg.loading = 'lazy'; s.appendChild(bg);
        var tx = el('div', 'hl-tx');
        tx.appendChild(el('p', 'hl-k', 'NOW TRENDING #' + (i + 1)));
        tx.appendChild(el('h3', null, m.title));
        tx.appendChild(el('p', 'hl-meta', [m.date ? m.date.slice(0, 4) : '', m.score ? '★ ' + m.score : '', (m.genres || []).slice(0, 3).join('・')].filter(Boolean).join('　')));
        tx.appendChild(el('p', 'hl-ov', m.overview.length > 110 ? m.overview.slice(0, 110) + '…' : m.overview));
        var b = el('button', 'btn-y', 'くわしく見る ›'); b.type = 'button'; b.addEventListener('click', function () { if (C()) C().openMovie(m); ga('clog_feat', { id: m.id }); }); tx.appendChild(b);
        s.appendChild(tx); track.appendChild(s);
        var d = el('button'); d.type = 'button'; d.setAttribute('role', 'tab'); d.setAttribute('aria-label', m.title); d.addEventListener('click', function () { go(i, true); }); dots.appendChild(d);
      });
      box.hidden = false;
      var cur = 0, timer = null, N = list.length;
      function go(i, user) {
        cur = (i + N) % N;
        $$('.hl-slide', track).forEach(function (s, k) { s.classList.toggle('on', k === cur); s.setAttribute('aria-hidden', k === cur ? 'false' : 'true'); });
        $$('button', dots).forEach(function (d, k) { d.setAttribute('aria-selected', k === cur ? 'true' : 'false'); });
        if (user) restart();
      }
      function restart() { clearInterval(timer); if (!calm) timer = setInterval(function () { if (!document.hidden) go(cur + 1); }, 6500); }
      $$('.hl-nav', box).forEach(function (b) { b.addEventListener('click', function () { go(cur + +b.getAttribute('data-d'), true); }); });
      var sx = null; track.addEventListener('pointerdown', function (e) { sx = e.clientX; }); track.addEventListener('pointerup', function (e) { if (sx !== null && Math.abs(e.clientX - sx) > 40) go(cur + (e.clientX < sx ? 1 : -1), true); sx = null; });
      box.addEventListener('mouseenter', function () { clearInterval(timer); }); box.addEventListener('mouseleave', restart);
      go(0); restart();
    }).catch(function () {});
  })();

  /* ========== 3) 管理人の鑑賞記録 ========== */
  var sec = $('#watched'); if (!sec) return;
  var LIST = (window.WATCHLIST || []).filter(function (m) { return m.id; });
  var grid = $('#wt-grid'), stat = $('.wt-stat', sec), bar = $('.wt-prog b', sec), adminBox = $('.wt-admin', sec);
  var kind = 'yo', filt = 'all', seen = {}, at = {}, extra = [], admin = false, pass = '';
  try { pass = sessionStorage.getItem('gt-wt-pass') || ''; } catch (e) {}
  function all() { // 候補 ＋ 足した映画（同じ映画は1つ）
    var ids = {}, out = [];
    LIST.concat(extra).forEach(function (m) { if (!ids[m.id]) { ids[m.id] = 1; out.push(m); } });
    return out;
  }
  function toM(m) { return { id: m.id, title: m.t, poster: m.p, date: String(m.y || ''), score: m.s }; }
  function render() {
    var A = all().filter(function (m) { return m.k === kind; }), watched = A.filter(function (m) { return seen[m.id]; });
    $$('.wt-tabs button', sec).forEach(function (b) { var k = b.getAttribute('data-k'), n = all().filter(function (m) { return m.k === k && seen[m.id]; }).length; b.querySelector('i').textContent = n; b.setAttribute('aria-selected', k === kind ? 'true' : 'false'); });
    var cand = A.filter(function (m) { return !m.x; }).length;
    stat.textContent = (kind === 'yo' ? '洋画' : '邦画') + ' ' + watched.length + ' 本を観ました' + (cand ? '（この一覧の ' + cand + ' 本のうち ' + A.filter(function (m) { return !m.x && seen[m.id]; }).length + ' 本）' : '');
    bar.style.width = (cand ? Math.round(A.filter(function (m) { return !m.x && seen[m.id]; }).length / cand * 100) : 0) + '%';
    var show = admin ? A : watched;
    if (filt === 'new') show = show.filter(function (m) { return m.y >= 2010; });
    if (filt === 'old') show = show.filter(function (m) { return m.y < 2010; });
    if (filt === 'recent') show = show.filter(function (m) { return seen[m.id]; }).sort(function (a, b) { return (at[b.id] || 0) - (at[a.id] || 0); });
    else show = show.slice().sort(function (a, b) { return b.y - a.y; });
    grid.textContent = '';
    if (!show.length) { var e = el('div', 'empty'); e.appendChild(el('b', null, admin ? 'ここには映画がありません' : 'まだチェック中です')); e.appendChild(el('span', null, admin ? '上の検索から足せます。' : '観た映画を、これから少しずつ並べていきます。')); grid.appendChild(e); return; }
    show.forEach(function (m) {
      var c = el('button', 'mc wt-card' + (seen[m.id] ? ' on' : '')); c.type = 'button';
      if (C()) c.appendChild(C().poster(m.t, m.p, m.y)); else c.appendChild(el('div', 'poster', m.t));
      var tx = el('div', 'mc-tx'); tx.appendChild(el('b', null, m.t)); tx.appendChild(el('p', null, m.y + (m.y >= 2010 ? '　新作' : '　旧作')));
      c.appendChild(tx);
      if (admin) { var chk = el('span', 'wt-chk', seen[m.id] ? '観た ✓' : 'まだ'); c.appendChild(chk); c.setAttribute('aria-pressed', seen[m.id] ? 'true' : 'false');
        if (m.x) { var del = el('span', 'wt-del', '×'); del.title = 'この映画を消す'; del.addEventListener('click', function (ev) { ev.stopPropagation(); if (confirm('「' + m.t + '」を記録から消しますか？')) api({ act: 'del', id: m.id }).then(function (j) { if (j.ok) { extra = extra.filter(function (x) { return x.id !== m.id; }); delete seen[m.id]; render(); } }); }); c.appendChild(del); } }
      c.addEventListener('click', function () {
        if (!admin) { if (C()) C().openMovie(toM(m)); return; }
        var on = !seen[m.id]; if (on) { seen[m.id] = 1; at[m.id] = Date.now(); } else delete seen[m.id]; render(); // 先に見た目を変える
        api({ act: 'set', id: m.id, on: on }).then(function (j) { if (!j.ok) { if (on) delete seen[m.id]; else seen[m.id] = 1; render(); alert(j.error || '保存できませんでした'); } });
      });
      grid.appendChild(c);
    });
  }
  function api(b) { b.pass = pass; return fetch('/api/watched', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(b) }).then(function (r) { return r.json(); }).catch(function () { return { ok: false, error: '通信できませんでした' }; }); }
  function load() {
    fetch('/api/watched', { cache: 'no-store' }).then(function (r) { return r.json(); }).then(function (j) {
      if (j && j.ok) { seen = {}; (j.ids || []).forEach(function (id) { seen[id] = 1; }); at = j.at || {}; extra = j.extra || []; }
      render();
    }).catch(render);
  }
  $$('.wt-tabs button', sec).forEach(function (b) { b.addEventListener('click', function () { kind = b.getAttribute('data-k'); render(); ga('watched_tab', { k: kind }); }); });
  $$('.wt-filter button', sec).forEach(function (b) { b.addEventListener('click', function () { filt = b.getAttribute('data-f'); $$('.wt-filter button', sec).forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); }); render(); }); });

  /* ---- 管理人モード ---- */
  var loginBtn = $('.wt-login', sec);
  function setAdmin(on) {
    admin = on; adminBox.hidden = !on; sec.classList.toggle('is-admin', on); loginBtn.textContent = on ? '管理人モードをおわる' : '管理人';
    if (!on) { pass = ''; try { sessionStorage.removeItem('gt-wt-pass'); } catch (e) {} }
    render();
  }
  loginBtn.addEventListener('click', function () {
    if (admin) return setAdmin(false);
    var p = prompt('管理人のパスワード（頭の中ブースと同じもの）'); if (!p) return;
    pass = p; api({ act: 'login' }).then(function (j) {
      if (j.ok) { try { sessionStorage.setItem('gt-wt-pass', p); } catch (e) {} setAdmin(true); } else { pass = ''; alert(j.error || 'ログインできませんでした'); }
    });
  });
  if (pass) api({ act: 'login' }).then(function (j) { if (j.ok) setAdmin(true); else pass = ''; });
  // リストにない映画を、C-Log の検索で足す（いま開いているタブ＝洋画／邦画として）
  var q = $('.wt-q', sec), found = $('.wt-found', sec), qt = null;
  q.addEventListener('input', function () {
    clearTimeout(qt); var v = q.value.trim(); if (v.length < 2) { found.textContent = ''; return; }
    qt = setTimeout(function () {
      fetch('/api/clog?r=search&q=' + encodeURIComponent(v)).then(function (r) { return r.json(); }).then(function (j) {
        found.textContent = '';
        ((j && j.results) || []).slice(0, 8).forEach(function (m) {
          var b = el('button', 'wt-add'); b.type = 'button';
          if (okImg(m.poster)) { var im = el('img'); im.src = size(m.poster, 'w92'); im.alt = ''; b.appendChild(im); }
          b.appendChild(el('span', null, m.title + (m.date ? '（' + m.date.slice(0, 4) + '）' : '')));
          b.appendChild(el('i', null, seen[m.id] ? '観た ✓' : '＋ ' + (kind === 'yo' ? '洋画' : '邦画') + 'に足す'));
          b.addEventListener('click', function () {
            if (seen[m.id]) return;
            api({ act: 'add', m: { id: m.id, t: m.title, y: (m.date || '').slice(0, 4), k: kind, p: size(m.poster, 'w342'), s: m.score } }).then(function (r) {
              if (r.ok) { extra = extra.filter(function (x) { return x.id !== r.m.id; }).concat([r.m]); seen[r.m.id] = 1; at[r.m.id] = Date.now(); q.value = ''; found.textContent = ''; render(); } else alert(r.error || '足せませんでした');
            });
          });
          found.appendChild(b);
        });
      });
    }, 450);
  });
  load();
})();
