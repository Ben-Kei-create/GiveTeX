/* スタンプブース — トーク画面（送ったものはこの画面の中だけ。どこにも送信しません） */
(function () {
  'use strict';
  var D = window.STAMP || { sets: [] };
  var SETS = (D.sets || []).slice().sort(function (a, b) { return String(a.date).localeCompare(String(b.date)); });
  var HOST = D.host || 'GiveTex';
  function $(s, e) { return (e || document).querySelector(s); }
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  function jd(iso) { var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || ''); return m ? m[1] + '年' + (+m[2]) + '月' + (+m[3]) + '日' : ''; }
  function now() { var d = new Date(); return d.getHours() + ':' + ('0' + d.getMinutes()).slice(-2); }
  function track(n, p) { try { if (window.gtag) window.gtag('event', n, p || {}); } catch (e) {} }
  var log = $('#st-log'), last = null;
  document.querySelector('.st-head h1 span').textContent = D.room || 'スタンプブース';

  /* ---------- 吹き出しを作る ---------- */
  function day(text) { log.appendChild(el('div', 'st-day', text)); last = null; }
  function sys(text) { log.appendChild(el('div', 'st-sys', text)); last = null; }
  function msg(who, content, opt) {
    opt = opt || {};
    var mine = who === 'me', cont = last === who;
    var m = el('div', 'st-msg' + (mine ? ' mine' : '') + (cont ? ' cont' : '') + (opt.pop ? ' pop' : ''));
    if (opt.id) m.id = opt.id;
    if (!mine) { var av = el('div', 'st-av', HOST.charAt(0)); av.setAttribute('aria-hidden', 'true'); m.appendChild(av); }
    var body = el('div', 'st-body');
    body.appendChild(el('div', 'st-name', mine ? 'You' : HOST));
    var row = el('div', 'st-row');
    row.appendChild(content);
    var meta = el('div', 'st-meta');
    if (mine) { var rd = el('span', 'st-read'); meta.appendChild(rd); m._read = rd; }
    if (opt.time) meta.appendChild(el('span', null, opt.time));
    row.appendChild(meta); body.appendChild(row); m.appendChild(body);
    log.appendChild(m); last = who;
    return m;
  }
  function text(t) { return el('div', 'st-bubble', t); }
  function sticker(src, alt) { var i = el('img', 'st-stk'); i.src = src; i.alt = alt || 'スタンプ'; i.loading = 'lazy'; return i; }
  function card(s) {
    var a = el('a', 'st-card'); a.href = s.storeUrl || '#'; a.target = '_blank'; a.rel = 'noopener';
    var im = el('div', 'st-card-img'); if (s.main) { var i = el('img'); i.src = s.main; i.alt = ''; i.loading = 'lazy'; im.appendChild(i); } a.appendChild(im);
    var tx = el('div', 'st-card-tx'); tx.appendChild(el('b', null, s.title)); tx.appendChild(el('small', null, (s.stickers || []).length + '種類のスタンプ' + (s.date ? '・' + jd(s.date) : ''))); a.appendChild(tx);
    a.appendChild(el('span', 'st-card-btn', 'ストアで見る'));
    a.addEventListener('click', function () { track('stamp_store_click', { set: s.id }); });
    return a;
  }
  function scrollEnd() { log.scrollTop = log.scrollHeight; }

  /* ---------- タイムライン ---------- */
  SETS.forEach(function (s) {
    day(jd(s.date) || (s.no ? 'No.' + s.no : '新作'));
    msg('host', text(s.message || '「' + s.title + '」をつくりました！'), { id: 'set-' + s.id });
    if (s.desc) msg('host', text(s.desc));
    if (s.main) msg('host', sticker(s.main, s.title + 'の代表スタンプ'));
    if (s.storeUrl) msg('host', card(s));
  });
  day('今日');
  sys('あなたが「' + (D.room || 'スタンプブース') + '」に参加しました');
  msg('host', text('ようこそ、スタンプブースへ！'));
  if (SETS.length) {
    msg('host', text(HOST + ' です。つくったスタンプを紹介しています。下の 😊 から、スタンプを送ってためせるよ。'));
    msg('host', text('作品の名前を送ってくれたら、このサイトの中をさがしてみるね。たとえば「灯台」「Java」「ラーメン」とか！'));
  } else {
    msg('host', text('スタンプは、ただいま準備中です。そろったら、ここに流していきます。'));
  }
  var note = el('p', 'st-note', HOST + ' は、かんたんな自動返信です。送ったメッセージやスタンプは、この画面の中にだけ表示され、どこにも送信されません。');
  log.appendChild(note);
  requestAnimationFrame(scrollEnd);

  /* ---------- スタンプ一覧（PCの左側・スマホのドロワー） ---------- */
  function buildList(ul) {
    ul.innerHTML = '';
    if (!SETS.length) { var li = el('li'); li.appendChild(el('div', 'st-empty', 'スタンプは準備中です')); ul.appendChild(li); return; }
    SETS.slice().reverse().forEach(function (s) {
      var li = el('li'), b = el('button'); b.type = 'button';
      if (s.main) { var i = el('img'); i.src = s.main; i.alt = ''; i.loading = 'lazy'; b.appendChild(i); } else b.appendChild(el('span', 'noimg', '😊'));
      var t = el('span'); t.appendChild(el('b', null, s.title)); t.appendChild(el('small', null, jd(s.date) || ((s.no ? 'No.' + s.no + '・' : '') + (s.stickers || []).length + '種類'))); b.appendChild(t);
      b.addEventListener('click', function () { closeDrawer(); var m = document.getElementById('set-' + s.id); if (m) { m.scrollIntoView({ block: 'center' }); m.classList.remove('pop'); void m.offsetWidth; m.classList.add('pop'); } });
      li.appendChild(b); ul.appendChild(li);
    });
  }
  buildList($('.st-app > .st-side .st-list'));
  Array.prototype.forEach.call(document.querySelectorAll('[data-author]'), function (a) { if (D.storeAuthorUrl) a.href = D.storeAuthorUrl; else a.hidden = true; });
  var drawer = null;
  function closeDrawer() { if (drawer) { drawer.remove(); drawer = null; $('.st-head .menu').focus(); } }
  $('.st-head .menu').addEventListener('click', function () {
    drawer = el('div', 'st-drawer'); drawer.setAttribute('role', 'dialog'); drawer.setAttribute('aria-label', 'スタンプ一覧');
    var side = $('.st-app > .st-side').cloneNode(true); buildList($('.st-list', side));
    Array.prototype.forEach.call(side.querySelectorAll('[data-author]'), function (a) { if (D.storeAuthorUrl) { a.href = D.storeAuthorUrl; a.hidden = false; } });
    var bg = el('div', 'st-drawer-bg'); bg.addEventListener('click', closeDrawer);
    drawer.appendChild(side); drawer.appendChild(bg); document.body.appendChild(drawer);
    var f = side.querySelector('button'); if (f) f.focus();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { if (drawer) closeDrawer(); else if (!sheet.hidden) toggleSheet(false); } });

  /* ---------- 送る（この画面の中だけ） ---------- */
  var busy = false;
  function readLater(m) { setTimeout(function () { if (m._read) m._read.textContent = '既読'; }, 700); }
  function hostReply(fn) {
    if (busy) return; busy = true;
    setTimeout(function () {
      var t = msg('host', el('div', 'st-bubble st-typing', null), { pop: true });
      t.querySelector('.st-typing').innerHTML = '<i></i><i></i><i></i>'; t.querySelector('.st-typing').setAttribute('aria-label', '入力中');
      scrollEnd();
      setTimeout(function () { t.remove(); last = 'me'; fn(); scrollEnd(); busy = false; }, 1100);
    }, 900);
  }
  /* ---------- 自動返信とサイト内検索 ---------- */
  var IDX = window.SITE_INDEX || [];
  function norm(t) {
    return String(t || '').normalize('NFKC').toLowerCase()
      .replace(/[\u30a1-\u30f6]/g, function (c) { return String.fromCharCode(c.charCodeAt(0) - 0x60); })
      .replace(/[\s・、。,.!！?？「」『』（）()〜~ー\-_:：]/g, '');
  }
  IDX.forEach(function (x) { x.n = norm(x.t); });
  function cleanQuery(t) {
    return String(t).replace(/(を)?(さが|探|検索)(して|す|したい|してください)?|(って)?(ある|あります|ない)[?？]*|どこ(にある)?[?？]*|おしえて|教えて|ください|について|の(本|記事|アプリ|スタンプ)$/g, '').trim();
  }
  function search(q) {
    var n = norm(cleanQuery(q)); if (n.length < 2) return [];
    var hit = IDX.filter(function (x) { return x.n.indexOf(n) >= 0; });
    hit.sort(function (a, b) { return (a.n.indexOf(n) === 0 ? 0 : 1) - (b.n.indexOf(n) === 0 ? 0 : 1) || a.t.length - b.t.length; });
    return hit;
  }
  function allStickers() { var a = []; SETS.forEach(function (s) { a = a.concat(s.stickers || []); }); return a; }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function results(q, hit) {
    var box = el('div', 'st-bubble st-results');
    box.appendChild(el('b', null, '「' + cleanQuery(q) + '」で ' + hit.length + ' 件みつけたよ！'));
    var ul = el('ul');
    hit.slice(0, 5).forEach(function (x) {
      var li = el('li'), a = el('a'); a.href = x.u; if (/^https?:/.test(x.u)) { a.target = '_blank'; a.rel = 'noopener'; }
      a.appendChild(el('span', 'k', x.k)); a.appendChild(el('span', 't', x.t)); li.appendChild(a); ul.appendChild(li);
    });
    box.appendChild(ul);
    if (hit.length > 5) box.appendChild(el('small', null, 'ほか ' + (hit.length - 5) + ' 件。もうすこし長いことばで送ると、しぼりこめるよ。'));
    return box;
  }
  // 返事のルールは stamp/replies.js（書き足すだけで動く）
  var RULES = (window.STAMP_REPLIES || []).map(function (r) {
    return { words: (r.words || []).map(norm).filter(Boolean), replies: (r.replies || []).map(function (x) { return String(x).replace(/\{name\}/g, HOST); }), sticker: !!r.sticker, exact: !!r.exact, action: r.action || '' };
  });
  function matchRule(t) {
    var n = norm(t);
    for (var i = 0; i < RULES.length; i++) {
      var r = RULES[i];
      if (r.words.some(function (w) { return r.exact ? n === w : n.indexOf(w) >= 0; })) return r;
    }
    return null;
  }
  function reply(t) {
    var acts = [], short = t.length <= 14;
    var rule = matchRule(t);
    var hit = search(t);
    if (rule && (short || !hit.length)) {
      if (rule.action === 'recommend' && SETS.length) { var s = pick(SETS); acts.push(['text', 'これはどう？「' + s.title + '」']); acts.push(['card', s]); }
      else { if (rule.replies.length) acts.push(['text', pick(rule.replies)]); if (rule.sticker && SETS.length) acts.push(['sticker', pick(allStickers())]); }
    } else if (hit.length) {
      acts.push(['results', t, hit]);
    } else {
      acts.push(['text', pick(['なるほど〜！', 'ふむふむ。', 'それ、スタンプにできそう。'])]);
      acts.push(['text', 'サイトの中では見つからなかったよ。作品の名前で送ってくれたら、さがしてみるね。']);
    }
    try { if (window.gtag) window.gtag('event', 'stamp_chat', { kind: hit.length ? 'search' : (rule ? 'rule' : 'other'), hits: hit.length }); } catch (e) {}
    return acts;
  }
  function play(acts) {
    acts.forEach(function (a) {
      if (a[0] === 'text') msg('host', text(a[1]), { time: now(), pop: true });
      else if (a[0] === 'sticker') msg('host', sticker(a[1]), { time: now(), pop: true });
      else if (a[0] === 'card') msg('host', card(a[1]), { time: now(), pop: true });
      else if (a[0] === 'results') msg('host', results(a[1], a[2]), { time: now(), pop: true });
    });
  }

  var input = $('#st-text'), sendBtn = $('.st-send');
  input.addEventListener('input', function () { sendBtn.disabled = !input.value.trim(); });
  $('.st-input').addEventListener('submit', function (e) {
    e.preventDefault();
    var v = input.value.trim(); if (!v) return;
    var m = msg('me', text(v), { time: now(), pop: true }); input.value = ''; sendBtn.disabled = true; scrollEnd(); readLater(m);
    var acts = reply(v); hostReply(function () { play(acts); });
  });

  /* ---------- スタンプ選択 ---------- */
  var sheet = $('.st-sheet'), tabs = $('.st-tabs'), grid = $('.st-grid'), stkBtn = $('[data-stickers]'), preview = $('.st-preview');
  var curSet = SETS.length ? SETS[SETS.length - 1] : null, picked = null;
  function toggleSheet(open) {
    sheet.hidden = !open; stkBtn.setAttribute('aria-expanded', open ? 'true' : 'false'); preview.hidden = true;
    if (open) { renderTabs(); renderGrid(); } requestAnimationFrame(scrollEnd);
  }
  stkBtn.addEventListener('click', function () { toggleSheet(sheet.hidden); });
  function renderTabs() {
    tabs.innerHTML = '';
    SETS.slice().reverse().forEach(function (s) {
      var b = el('button'); b.type = 'button'; b.setAttribute('role', 'tab'); b.setAttribute('aria-selected', s === curSet ? 'true' : 'false'); b.title = s.title;
      var i = el('img'); i.src = s.main || (s.stickers || [])[0] || ''; i.alt = s.title; b.appendChild(i);
      b.addEventListener('click', function () { curSet = s; renderTabs(); renderGrid(); });
      tabs.appendChild(b);
    });
    tabs.hidden = !SETS.length;
  }
  function renderGrid() {
    grid.innerHTML = ''; preview.hidden = true;
    if (!curSet || !(curSet.stickers || []).length) { grid.appendChild(el('div', 'st-empty', 'スタンプは準備中です。そろったら、ここから送れるようになります。')); return; }
    curSet.stickers.forEach(function (src, k) {
      var b = el('button'); b.type = 'button'; b.setAttribute('aria-label', curSet.title + ' ' + (k + 1)); b.setAttribute('aria-pressed', 'false');
      var i = el('img'); i.src = src; i.alt = ''; i.loading = 'lazy'; b.appendChild(i);
      b.addEventListener('click', function () {
        Array.prototype.forEach.call(grid.children, function (x) { x.setAttribute('aria-pressed', 'false'); });
        b.setAttribute('aria-pressed', 'true'); picked = src;
        $('img', preview).src = src; preview.hidden = false; $('.go', preview).focus();
      });
      grid.appendChild(b);
    });
  }
  $('.x', preview).addEventListener('click', function () { preview.hidden = true; picked = null; });
  $('.go', preview).addEventListener('click', function () {
    if (!picked) return;
    var set = curSet, m = msg('me', sticker(picked), { time: now(), pop: true });
    preview.hidden = true; scrollEnd(); readLater(m); track('stamp_send', { set: set.id });
    hostReply(function () {
      var others = (set.stickers || []).filter(function (x) { return x !== picked; });
      if (others.length && Math.random() < 0.7) msg('host', sticker(others[Math.floor(Math.random() * others.length)]), { time: now(), pop: true });
      else msg('host', text('そのスタンプ、いいでしょ！'), { time: now(), pop: true });
    });
    picked = null;
  });
})();
