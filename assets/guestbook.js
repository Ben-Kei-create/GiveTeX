/* ゲストブック（足あと帳） */
(function () {
  'use strict';
  var f = document.getElementById('gb-form'); if (!f) return;
  var list = document.getElementById('gb-list'), out = document.getElementById('gb-out'), more = document.getElementById('gb-more'), cnt = document.getElementById('gb-total');
  var tk = '', tkAt = 0, off = 0, total = 0, sending = false, KEYS = 'gb-keys';
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  function jp(e, d) { return typeof e === 'string' && e.length < 90 && /[ぁ-んァ-ン一-龥]/.test(e) ? e : d; }
  function say(t, ng) { out.textContent = t; out.className = 'ct-msg ' + (ng ? 'ng' : 'ok'); }
  function getJSON(u, o) { return fetch(u, o).then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { j._s = r.status; return j; }); }).catch(function () { return { ok: false, error: 'network' }; }); }
  function keys() { try { return JSON.parse(localStorage.getItem(KEYS) || '{}') || {}; } catch (e) { return {}; } }
  function keep(id, k) { try { var m = keys(); m[id] = k; localStorage.setItem(KEYS, JSON.stringify(m)); } catch (e) {} }
  function rnd() { var a = new Uint8Array(16); crypto.getRandomValues(a); return Array.prototype.map.call(a, function (x) { return ('0' + x.toString(16)).slice(-2); }).join(''); }
  function token() { if (tk && Date.now() - tkAt < 7200e3) return Promise.resolve(tk); return getJSON('/api/guestbook?tk=1', { cache: 'no-store' }).then(function (j) { if (j.ok) { tk = j.tk; tkAt = Date.now(); } else if (j.error === 'not_configured') off_(); return tk; }); }
  function off_() { Array.prototype.forEach.call(f.elements, function (x) { x.disabled = true; }); say('ゲストブックは準備中です。', true); }
  function when(ms) { var d = new Date(ms); function z(n) { return ('0' + n).slice(-2); } return d.getFullYear() + '/' + z(d.getMonth() + 1) + '/' + z(d.getDate()) + ' ' + z(d.getHours()) + ':' + z(d.getMinutes()); }
  function row(p) {
    var r = el('div', 'gb-item'); r.id = 'g' + p.id;
    var h = el('div', 'gb-h'); h.appendChild(el('span', 'gb-no', 'No.' + p.id));
    if (p.hidden) { r.appendChild(h); r.appendChild(el('p', 'gb-msg gone', 'この書きこみは、みんなの通報で非表示になりました。')); return r; }
    h.appendChild(el('b', 'gb-name', p.name)); if (p.from) h.appendChild(el('span', 'gb-from', '＠' + p.from));
    h.appendChild(el('span', 'gb-id', 'ID:' + p.uid)); h.appendChild(el('time', null, when(p.at)));
    r.appendChild(h);
    var m = el('p', 'gb-msg', p.msg); if (p.mood) m.appendChild(el('span', 'gb-mood', ' ' + p.mood)); r.appendChild(m);
    var a = el('div', 'gb-a');
    var rp = el('button', null, '通報'); rp.type = 'button'; rp.addEventListener('click', function () {
      if (!confirm('この書きこみを通報しますか？（3人から通報されると非表示になります）')) return; rp.disabled = true;
      getJSON('/api/guestbook', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ act: 'report', id: p.id }) }).then(function (j) { rp.textContent = j.ok ? (j.already ? '通報ずみ' : '通報しました') : '通報できませんでした'; if (j.hidden) r.replaceWith(row({ id: p.id, hidden: true })); });
    }); a.appendChild(rp);
    var k = keys()[p.id];
    if (k) { var dl = el('button', null, '削除'); dl.type = 'button'; dl.addEventListener('click', function () {
      if (!confirm('自分の書きこみ No.' + p.id + ' を消しますか？')) return;
      getJSON('/api/guestbook', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ act: 'delete', id: p.id, dk: k }) }).then(function (j) { if (j.ok) { r.remove(); total--; showTotal(); } else alert(jp(j.error, '消せませんでした。')); });
    }); a.appendChild(dl); }
    r.appendChild(a); return r;
  }
  function showTotal() { cnt.textContent = total > 0 ? 'これまでに ' + total + ' 件の足あと' : 'まだ足あとはありません。一番乗りしてね！'; }
  function load() {
    more.disabled = true;
    getJSON('/api/guestbook?off=' + off).then(function (j) {
      more.disabled = false;
      if (!j.ok) { if (j.error === 'not_configured') off_(); else if (!off) list.appendChild(el('p', 'r-small', '読みこめませんでした。時間をおいてどうぞ。')); return; }
      total = j.total || 0; showTotal();
      (j.items || []).forEach(function (p) { list.appendChild(row(p)); }); off += (j.items || []).length;
      more.hidden = off >= total || !(j.items || []).length;
    });
  }
  more.addEventListener('click', load);
  f.addEventListener('focusin', function () { token(); });
  var msg = f.msg, c = document.getElementById('gb-c');
  msg.addEventListener('input', function () { c.textContent = Array.from(msg.value).length + ' / 400'; });
  try { var nm = localStorage.getItem('gb-name'); if (nm) f.name.value = nm; } catch (e) {}
  f.addEventListener('submit', function (e) {
    e.preventDefault(); if (sending) return;
    var m = msg.value.trim(); if (Array.from(m).length < 2) { msg.focus(); return say('メッセージを書いてね。', true); }
    sending = true; f.send.disabled = true; say('書きこみ中…');
    var dk = rnd();
    token().then(function (t) { return getJSON('/api/guestbook', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ act: 'post', name: f.name.value, from: f.from.value, mood: f.mood.value, msg: m, website: f.website.value, dk: dk, tk: t }) }); })
      .then(function (j) {
        if (j.ok && j.item) { keep(j.item.id, dk); try { localStorage.setItem('gb-name', f.name.value); } catch (x) {} list.insertBefore(row(j.item), list.firstChild); total++; showTotal(); msg.value = ''; c.textContent = '0 / 400'; say('書きこみました！ 足あと、ありがとう！');
          try { if (window.gtag) gtag('event', 'guestbook_post'); } catch (x) {} }
        else if (j.error === 'not_configured') off_();
        else { say(jp(j.error, 'うまく書きこめませんでした。'), true); if (j._s === 400) tk = ''; }
      }).then(function () { sending = false; f.send.disabled = false; });
  });
  load();
})();
