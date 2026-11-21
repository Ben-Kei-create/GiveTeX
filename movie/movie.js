/* 映画ブース（C-Log Web）
   - 話題の映画・検索・お知らせ：C-Log のサーバーから /api/clog 経由で取得
   - みんなの C-Log：/api/board の匿名掲示板（だれでも書ける・みんなで管理） */
(function () {
  'use strict';
  function $(s) { return document.querySelector(s); }
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  function hash(s) { var h = 0; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }
  function okImg(u) { return /^https:\/\/image\.tmdb\.org\/t\/p\/\w+\/[\w-]+\.(jpg|png)$/.test(u || ''); }
  function small(u) { return okImg(u) ? u.replace(/\/t\/p\/\w+\//, '/t/p/w342/') : ''; }
  function jp(e, d) { return typeof e === 'string' && e.length < 90 && /[ぁ-んァ-ン一-龥]/.test(e) ? e : d; }
  function ga(n, p) { try { if (window.gtag) window.gtag('event', n, p || {}); } catch (e) {} }
  function getJSON(url, opt) {
    return fetch(url, opt).then(function (r) { return r.json().catch(function () { return { ok: false }; }).then(function (j) { j = j || {}; j._s = r.status; return j; }); })
      .catch(function () { return { ok: false, _s: 0, error: 'network' }; });
  }
  function poster(title, url, year) {
    var p = el('div', 'poster');
    var h = hash(title || ''), a = h % 360, b = (a + 40 + (h >> 8) % 80) % 360;
    p.style.background = 'linear-gradient(160deg,hsl(' + a + ' 45% 32%),hsl(' + b + ' 55% 14%))';
    p.appendChild(el('span', 'pt', title || ''));
    if (okImg(url)) { var im = el('img'); im.src = small(url); im.alt = ''; im.loading = 'lazy'; im.decoding = 'async'; p.appendChild(im); }
    if (year) p.appendChild(el('span', 'yr', String(year)));
    return p;
  }
  function starsOf(r) { var s = el('span', 'stars'); s.setAttribute('aria-label', '評価 ' + r + ' / 5'); for (var i = 1; i <= 5; i++) s.appendChild(el('span', r >= i ? '' : 'off', '★')); return s; }
  function fmtDate(d) { return String(d || '').slice(0, 10).replace(/-/g, '.'); }

  /* ───── 映画の詳細 ───── */
  var dlg = $('dialog.detail');
  function openMovie(m) {
    var b = $('.dt'); b.textContent = '';
    b.appendChild(poster(m.title, m.poster, (m.date || '').slice(0, 4)));
    var t = el('div'); t.appendChild(el('h3', null, m.title));
    t.appendChild(el('div', 'meta', [m.date ? fmtDate(m.date) + ' 公開' : '', m.runtime ? m.runtime + '分' : '', (m.genres || []).join('・'), m.score ? 'TMDb ★' + m.score + ' / 10' : ''].filter(Boolean).join('　')));
    t.appendChild(el('p', null, m.overview || 'あらすじはまだありません。'));
    var w = el('button', 'btn-y', 'この映画の感想を書く'); w.type = 'button'; w.style.marginTop = '12px';
    w.addEventListener('click', function () { dlg.close(); pick(m); });
    t.appendChild(w);
    var mine = posts.filter(function (p) { return p.tm === m.id && !p.hidden; }).length;
    if (mine) t.appendChild(el('p', 'meta', 'みんなの感想：' + mine + ' 件（下の「みんなの C-Log」）'));
    b.appendChild(t);
    if (dlg.showModal && !dlg.open) dlg.showModal();
    if (!m.runtime && !m._full) getJSON('/api/clog?r=movie&id=' + m.id).then(function (j) { if (j.ok && j.movie && dlg.open) { j.movie._full = true; j.movie.poster = j.movie.poster || m.poster; openMovie(j.movie); } });
    ga('clog_movie', { id: m.id });
  }
  $('.dt-close').addEventListener('click', function () { dlg.close(); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  function card(m) {
    var c = el('button', 'mc'); c.type = 'button';
    c.appendChild(poster(m.title, m.poster, (m.date || '').slice(0, 4)));
    var tx = el('div', 'mc-tx'); tx.appendChild(el('b', null, m.title));
    tx.appendChild(el('p', null, [m.date ? fmtDate(m.date) : '', m.score ? '★' + m.score : ''].filter(Boolean).join('　')));
    c.appendChild(tx); c.addEventListener('click', function () { openMovie(m); });
    return c;
  }
  function note(box, title, sub, retry) {
    var e = el('div', 'empty'); e.appendChild(el('b', null, title)); if (sub) e.appendChild(el('span', null, sub));
    if (retry) { var r = el('button', 'more-b', 'もう一度読みこむ'); r.type = 'button'; r.addEventListener('click', retry); e.appendChild(r); }
    box.appendChild(e); return e;
  }

  /* ───── 話題の映画 ───── */
  var popBox = $('#pop-list'), popMore = $('#pop-more'), popPage = 0, popPages = 1, popTry = 0, popBusy = false, seen = {};
  function loadPop() {
    if (popBusy) return; popBusy = true;
    if (!popPage) { popBox.textContent = ''; for (var i = 0; i < 6; i++) popBox.appendChild(el('div', 'mc sk')); }
    getJSON('/api/clog?r=popular&page=' + (popPage + 1)).then(function (j) {
      popBusy = false;
      if (!popPage) popBox.textContent = '';
      if (!j.ok) {
        if (!popPage) {
          if (j.error === 'waking' && popTry < 6) { popTry++; note(popBox, 'C-Log のサーバーを起こしています…', '眠っていたので、1分ほどかかります。自動で読みこみ直します（' + popTry + '/6）'); setTimeout(loadPop, 12000); }
          else note(popBox, 'いまは話題の映画を読みこめませんでした', '時間をおいて、もう一度どうぞ。', function () { popTry = 0; loadPop(); });
        }
        return;
      }
      popPage = j.page || popPage + 1; popPages = j.pages || 1;
      (j.results || []).forEach(function (m) { if (seen[m.id]) return; seen[m.id] = 1; popBox.appendChild(card(m)); });
      if (j.stale) popBox.setAttribute('title', '少し前の情報です');
      popMore.hidden = popPage >= Math.min(popPages, 5);
    });
  }
  popMore.addEventListener('click', loadPop);
  /* お知らせ */
  getJSON('/api/clog?r=news').then(function (j) {
    if (!j.ok || !j.results || !j.results.length) return;
    var ul = $('#news'); j.results.forEach(function (n) { var li = el('li'); li.appendChild(el('time', null, fmtDate(n.at))); if (n.cat) li.appendChild(el('span', 'cat', n.cat)); li.appendChild(el('b', null, n.title)); ul.appendChild(li); });
    $('#news-sec').hidden = false;
  });

  /* ───── さがす ───── */
  var q = $('#q'), found = $('#found'), foundSec = $('#found-sec'), qTimer = 0, qSeq = 0;
  function search() {
    var v = q.value.trim().slice(0, 50), my = ++qSeq;
    if (!v) { foundSec.hidden = true; found.textContent = ''; return; }
    foundSec.hidden = false; found.textContent = ''; found.appendChild(el('p', 'meta', '「' + v + '」をさがしています…'));
    getJSON('/api/clog?r=search&q=' + encodeURIComponent(v)).then(function (j) {
      if (my !== qSeq) return; found.textContent = '';
      if (!j.ok) return note(found, j.error === 'waking' ? 'C-Log のサーバーを起こしています…' : (j._s === 429 ? 'さがすのが速すぎます' : 'うまくさがせませんでした'), j.error === 'waking' ? '1分ほどしてから、もう一度さがしてください。' : jp(j.error, '時間をおいてどうぞ。'), search);
      if (!j.results.length) return note(found, '見つかりませんでした', 'ことばを変えてみてください。タイトルを手で入れて、感想を書くこともできます。');
      j.results.forEach(function (m) { found.appendChild(card(m)); });
      ga('clog_search');
    });
  }
  q.addEventListener('input', function () { clearTimeout(qTimer); qTimer = setTimeout(search, 450); });
  q.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); clearTimeout(qTimer); search(); } });

  /* ───── みんなの C-Log（匿名掲示板） ───── */
  var KEYS = 'clog-keys', posts = [], bOff = 0, bTotal = 0, ready = true, tk = '', tkAt = 0, sending = false;
  var form = $('#bf'), tIn = $('#bf-t'), bIn = $('#bf-b'), out = $('#bf-out'), send = $('#bf-send'), list = $('#posts'), more = $('#b-more'), picked = null, rating = 0;
  function myKeys() { try { return JSON.parse(localStorage.getItem(KEYS) || '{}') || {}; } catch (e) { return {}; } }
  function saveKey(id, k) { try { var m = myKeys(); m[id] = k; var ids = Object.keys(m); if (ids.length > 200) delete m[ids[0]]; localStorage.setItem(KEYS, JSON.stringify(m)); } catch (e) {} }
  function rnd() { var a = new Uint8Array(16); (window.crypto || window.msCrypto).getRandomValues(a); return Array.prototype.map.call(a, function (x) { return ('0' + x.toString(16)).slice(-2); }).join(''); }
  function say(t, ng) { out.textContent = t; out.className = 'bf-out' + (ng ? ' ng' : ' ok'); }
  function token() {
    if (tk && Date.now() - tkAt < 2 * 3600e3) return Promise.resolve(tk);
    return getJSON('/api/board?tk=1', { cache: 'no-store' }).then(function (j) { if (j.ok) { tk = j.tk; tkAt = Date.now(); } else if (j.error === 'not_configured') off(); return tk; });
  }
  function off() {
    ready = false; Array.prototype.forEach.call(form.elements, function (x) { x.disabled = true; });
    say('みんなの C-Log は、ただいま準備中です。もうすぐ書きこめるようになります。', true);
  }
  /* 星 */
  var starBox = $('#bf-stars');
  for (var i = 0; i <= 5; i++) (function (n) {
    var b = el('button', 'st', n ? '★' : 'なし'); b.type = 'button'; b.setAttribute('role', 'radio'); b.setAttribute('aria-label', n ? '★' + n : '評価なし');
    b.addEventListener('click', function () { rating = n; paintStars(); });
    starBox.appendChild(b);
  })(i);
  function paintStars() { Array.prototype.forEach.call(starBox.children, function (b, k) { b.setAttribute('aria-checked', k === rating ? 'true' : 'false'); b.classList.toggle('on', k > 0 && k <= rating); }); }
  paintStars();
  bIn.addEventListener('input', function () { $('#bf-c').textContent = Array.from(bIn.value).length + ' / 800'; try { sessionStorage.setItem('clog-draft', bIn.value); } catch (e) {} });
  try { var dr = sessionStorage.getItem('clog-draft'); if (dr) { bIn.value = dr; $('#bf-c').textContent = Array.from(dr).length + ' / 800'; } } catch (e) {}
  /* 映画を選ぶ */
  function pick(m) {
    picked = { tm: m.id, poster: m.poster || '', title: m.title };
    tIn.value = m.title.slice(0, 60);
    var pk = $('#bf-pick'); pk.textContent = ''; pk.hidden = false;
    pk.appendChild(poster(m.title, m.poster));
    var x = el('div'); x.appendChild(el('b', null, m.title)); x.appendChild(el('small', null, (m.date ? fmtDate(m.date) + ' 公開' : '') + ' の感想を書きます'));
    var c = el('button', 'pk-x', '選びなおす'); c.type = 'button'; c.addEventListener('click', function () { picked = null; pk.hidden = true; tIn.value = ''; tIn.focus(); }); x.appendChild(c);
    pk.appendChild(x);
    $('#board').scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(function () { bIn.focus({ preventScroll: true }); }, 500);
    token();
  }
  tIn.addEventListener('input', function () { if (picked && tIn.value !== picked.title.slice(0, 60)) { picked = null; $('#bf-pick').hidden = true; } });
  form.addEventListener('focusin', function () { if (ready) token(); });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!ready || sending) return;
    var t = tIn.value.trim(), b = bIn.value.trim();
    if (!t) { tIn.focus(); return say('映画のタイトルを入れてください。', true); }
    if (Array.from(b).length < 5) { bIn.focus(); return say('感想を5文字以上で書いてください。', true); }
    if (Array.from(b).length > 800) return say('感想は800文字までです。', true);
    sending = true; send.disabled = true; say('書きこみ中…');
    var dk = rnd();
    token().then(function (k) {
      return getJSON('/api/board', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ act: 'post', t: t, b: b, r: rating, tm: picked ? picked.tm : 0, poster: picked ? small(picked.poster) : '', dk: dk, tk: k, website: form.website.value }) });
    }).then(function (j) {
      if (j.ok && j.item) {
        saveKey(j.item.id, dk); posts.unshift(j.item); bTotal++; list.insertBefore(row(j.item), list.firstChild); showTotal();
        bIn.value = ''; tIn.value = ''; picked = null; $('#bf-pick').hidden = true; rating = 0; paintStars(); $('#bf-c').textContent = '0 / 800';
        try { sessionStorage.removeItem('clog-draft'); } catch (e) {}
        var empty = list.querySelector('.empty'); if (empty) empty.remove();
        say('書きこみました！ ありがとう。'); ga('clog_post');
      } else if (j.error === 'not_configured') off();
      else { say(jp(j.error, 'うまく書きこめませんでした。時間をおいてどうぞ。'), true); if (j._s === 400) tk = ''; }
    }).then(function () { sending = false; if (ready) send.disabled = false; });
  });
  /* 一覧 */
  function when(ms) { var d = new Date(ms); function z(n) { return ('0' + n).slice(-2); } return d.getFullYear() + '/' + z(d.getMonth() + 1) + '/' + z(d.getDate()) + ' ' + z(d.getHours()) + ':' + z(d.getMinutes()); }
  function row(p) {
    var r = el('article', 'pp'); r.id = 'c' + p.id;
    var head = el('div', 'pp-h');
    head.appendChild(el('span', 'no', 'No.' + p.id));
    head.appendChild(el('span', 'nm', '名無しの映画好き'));
    head.appendChild(el('span', 'uid', 'ID:' + p.uid));
    head.appendChild(el('time', null, when(p.at)));
    r.appendChild(head);
    if (p.hidden) { r.classList.add('gone'); r.appendChild(el('p', 'pp-b', 'この書きこみは、みんなの通報により非表示になりました。')); return r; }
    var body = el('div', 'pp-m');
    if (p.poster || p.tm) body.appendChild(poster(p.t, p.poster));
    var tx = el('div');
    var ttl = el(p.tm ? 'button' : 'b', 'pp-t', '『' + p.t + '』'); if (p.tm) { ttl.type = 'button'; ttl.addEventListener('click', function () { openMovie({ id: p.tm, title: p.t, poster: p.poster }); }); }
    tx.appendChild(ttl);
    if (p.r) tx.appendChild(starsOf(p.r));
    tx.appendChild(el('p', 'pp-b', p.b));
    body.appendChild(tx); r.appendChild(body);
    var act = el('div', 'pp-a');
    var lk = el('button', 'like', '👍 共感 ' + (p.likes || 0)); lk.type = 'button'; lk.setAttribute('aria-label', '共感する（いま ' + (p.likes || 0) + '）');
    lk.addEventListener('click', function () { vote(p, 'like', lk); });
    act.appendChild(lk);
    var rp = el('button', 'rep', '通報'); rp.type = 'button'; rp.addEventListener('click', function () {
      if (!confirm('この書きこみを通報しますか？\n（ひどいことば・宣伝・個人情報など。3人から通報されると非表示になります）')) return; vote(p, 'report', rp);
    });
    act.appendChild(rp);
    var k = myKeys()[p.id];
    if (k) { var dl = el('button', 'del', '削除'); dl.type = 'button'; dl.addEventListener('click', function () {
      if (!confirm('自分の書きこみ No.' + p.id + ' を削除しますか？')) return;
      getJSON('/api/board', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ act: 'delete', id: p.id, dk: k }) }).then(function (j) {
        if (j.ok) { r.remove(); bTotal = Math.max(0, bTotal - 1); showTotal(); var m = myKeys(); delete m[p.id]; try { localStorage.setItem(KEYS, JSON.stringify(m)); } catch (e) {} }
        else alert(jp(j.error, '削除できませんでした。'));
      });
    }); act.appendChild(dl); }
    r.appendChild(act);
    return r;
  }
  var voted = {};
  function vote(p, kind, btn) {
    if (voted[kind + p.id]) return; voted[kind + p.id] = 1; btn.disabled = true;
    getJSON('/api/board', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ act: kind, id: p.id }) }).then(function (j) {
      if (!j.ok) { btn.disabled = false; voted[kind + p.id] = 0; return alert(jp(j.error, 'いまはできませんでした。')); }
      if (kind === 'like') { p.likes = j.n; btn.textContent = '👍 共感 ' + j.n; btn.classList.add('on'); }
      else { btn.textContent = j.already ? '通報ずみ' : '通報しました'; if (j.hidden) { var r = document.getElementById('c' + p.id); if (r) r.replaceWith(row(Object.assign({}, p, { hidden: true }))); } }
      ga('clog_' + kind);
    });
  }
  function showTotal() { $('#b-total').textContent = bTotal ? 'これまでに ' + bTotal + ' 件の感想がたまっています' : 'だれでも匿名で書ける感想ノート'; }
  function loadBoard() {
    more.disabled = true;
    getJSON('/api/board?off=' + bOff).then(function (j) {
      more.disabled = false;
      if (!j.ok) {
        if (j.error === 'not_configured') { off(); if (!bOff) note(list, 'みんなの C-Log は準備中です', 'もうすぐ、だれでも感想を書きこめるようになります。'); }
        else if (!bOff) note(list, '感想を読みこめませんでした', '時間をおいて、もう一度どうぞ。', function () { list.textContent = ''; loadBoard(); });
        return;
      }
      bTotal = j.total || 0; showTotal();
      var have = {}; posts.forEach(function (p) { have[p.id] = 1; });
      (j.items || []).forEach(function (p) { if (have[p.id]) return; posts.push(p); list.appendChild(row(p)); });
      bOff += (j.items || []).length;
      if (!posts.length && !list.querySelector('.empty')) note(list, 'まだ感想はありません', '最初の1件を、書いてみませんか？');
      more.hidden = bOff >= bTotal || !(j.items || []).length;
    });
  }
  more.addEventListener('click', loadBoard);

  /* 画面に入ったら読みこむ（通信を節約） */
  function onView(node, fn) {
    if (!('IntersectionObserver' in window)) return fn();
    var io = new IntersectionObserver(function (es) { if (es.some(function (x) { return x.isIntersecting; })) { io.disconnect(); fn(); } }, { rootMargin: '400px' });
    io.observe(node);
  }
  loadPop();
  onView($('#board'), loadBoard);
  window.CLog = { openMovie: openMovie, card: card, poster: poster, getJSON: getJSON }; // movie/watched.js などから使う
})();
