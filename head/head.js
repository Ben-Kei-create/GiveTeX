(function () {
  'use strict';
  var list = document.getElementById('tl');
  var cntEl = document.getElementById('tw-count');
  var statics = (window.HEAD_POSTS || []).map(function (p) {
    var m = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})$/.exec(p.d);
    var at = m ? Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]) - 9 * 3600e3 : 0;
    return { at: at, who: 'admin', name: 'ぎぶてくすの中の人', text: p.t, dstr: p.d };
  });
  var dynamics = [];
  var KEYS = 'hd-keys';
  var tk = '', tkAt = 0, sending = false;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function whenMs(ms) {
    var d = new Date(ms + 9 * 3600e3), z = function (n) { return ('0' + n).slice(-2); };
    return d.getUTCFullYear() + '年' + (d.getUTCMonth() + 1) + '月' + d.getUTCDate() + '日 ' + z(d.getUTCHours()) + ':' + z(d.getUTCMinutes());
  }
  function whenStatic(dstr) {
    var m = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}:\d{2})$/.exec(dstr);
    return m ? Number(m[1]) + '年' + Number(m[2]) + '月' + Number(m[3]) + '日 ' + m[4] : dstr;
  }
  function keys() { try { return JSON.parse(localStorage.getItem(KEYS) || '{}') || {}; } catch (e) { return {}; } }
  function keep(id, k) { try { var m = keys(); m[id] = k; localStorage.setItem(KEYS, JSON.stringify(m)); } catch (e) {} }
  function rnd() { var a = new Uint8Array(16); crypto.getRandomValues(a); return Array.prototype.map.call(a, function (x) { return ('0' + x.toString(16)).slice(-2); }).join(''); }
  function getJSON(u, o) {
    return fetch(u, o).then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { j._s = r.status; return j; }); }).catch(function () { return { ok: false, error: 'network' }; });
  }
  function token() {
    if (tk && Date.now() - tkAt < 7200e3) return Promise.resolve(tk);
    return getJSON('/api/head?tk=1', { cache: 'no-store' }).then(function (j) { if (j.ok) { tk = j.tk; tkAt = Date.now(); } return tk; });
  }

  function tweetEl(p) {
    var div = document.createElement('div');
    div.className = 'tweet' + (p.hidden ? ' gone' : '');
    var guest = p.who === 'guest';
    var ava = guest ? '？' : 'G';
    var name = guest ? esc(p.name || 'ゲスト') : 'ぎぶてくすの中の人';
    var un = guest ? 'guest' : 'givetex';
    var when = p.dstr ? whenStatic(p.dstr) : whenMs(p.at);
    var html = '<div class="ava' + (guest ? ' guest' : '') + '">' + ava + '</div><div class="bd">' +
      '<div class="hd"><b>' + name + '</b> <span class="un">' + un + '</span>' + (guest ? '<span class="gbadge">ゲスト</span>' : '') + '</div>' +
      '<p class="tx">' + (p.hidden ? 'このつぶやきは、みんなの通報で非表示になりました。' : esc(p.text)) + '</p>' +
      '<div class="mt">' + when + ' · 頭の中から送信</div></div>';
    div.innerHTML = html;
    if (!p.hidden && p.id) {
      var mt = div.querySelector('.mt');
      if (guest) {
        var rp = document.createElement('button'); rp.type = 'button'; rp.textContent = '通報';
        rp.addEventListener('click', function () {
          if (!confirm('このつぶやきを通報しますか？（3人から通報されると非表示になります）')) return;
          rp.disabled = true;
          getJSON('/api/head', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ act: 'report', id: p.id }) }).then(function (j) {
            rp.textContent = j.ok ? (j.already ? '通報ずみ' : '通報しました') : '通報できませんでした';
            if (j.hidden) div.replaceWith(tweetEl({ id: p.id, who: 'guest', hidden: true, at: p.at }));
          });
        });
        mt.appendChild(rp);
      }
      var k = keys()[p.id];
      if (k) {
        var dl = document.createElement('button'); dl.type = 'button'; dl.textContent = '削除';
        dl.addEventListener('click', function () {
          if (!confirm('自分のつぶやきを消しますか？')) return;
          getJSON('/api/head', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ act: 'delete', id: p.id, dk: k }) }).then(function (j) {
            if (j.ok) { div.remove(); dynamics = dynamics.filter(function (x) { return x.id !== p.id; }); showCount(); }
            else alert('消せませんでした。');
          });
        });
        mt.appendChild(dl);
      }
    }
    return div;
  }
  function showCount() { if (cntEl) cntEl.textContent = statics.length + dynamics.filter(function (p) { return !p.hidden; }).length; }
  function render() {
    list.innerHTML = '';
    dynamics.concat(statics).sort(function (a, b) { return b.at - a.at; }).forEach(function (p) { list.appendChild(tweetEl(p)); });
    showCount();
  }
  function load() {
    getJSON('/api/head?off=0', { cache: 'no-store' }).then(function (j) {
      if (j.ok) { dynamics = j.items || []; render(); }
    });
  }

  /* ===== 投稿まわり ===== */
  var ta = document.getElementById('tw-text');
  var cnt = document.getElementById('tw-cnt');
  var goBtn = document.getElementById('tw-go');
  var box = document.getElementById('authbox');
  var msg = document.getElementById('auth-msg');
  function say(t, ng) { msg.textContent = t || ''; msg.className = 'msg ' + (ng ? 'ng' : 'ok'); }
  function updateCnt() {
    var n = Array.from(ta.value).length, left = 140 - n;
    cnt.textContent = left;
    cnt.className = 'cnt' + (left < 0 ? ' over' : '');
    goBtn.disabled = n === 0 || left < 0;
    goBtn.className = goBtn.disabled ? '' : 'go';
  }
  ta.addEventListener('input', updateCnt);
  ta.addEventListener('focus', function () { token(); }, { once: true });
  goBtn.addEventListener('click', function () {
    if (goBtn.disabled) return;
    box.classList.add('open'); say('');
    var pw = document.getElementById('tw-pass'); if (pw) pw.focus();
  });
  document.getElementById('auth-cancel').addEventListener('click', function (e) { e.preventDefault(); box.classList.remove('open'); });

  function post(mode) {
    if (sending) return;
    var text = ta.value.trim();
    if (!text) { say('つぶやきを書いてね。', true); return; }
    var body = { act: 'post', mode: mode, text: text, website: '' };
    var dk = '';
    if (mode === 'admin') {
      body.pass = document.getElementById('tw-pass').value;
      if (!body.pass) { say('パスワードを入れてね。', true); return; }
    } else {
      body.name = document.getElementById('tw-gname').value;
      dk = rnd(); body.dk = dk;
    }
    sending = true; say('送信中…');
    token().then(function (t) {
      body.tk = t;
      return getJSON('/api/head', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    }).then(function (j) {
      sending = false;
      if (j.ok && j.item) {
        if (dk) keep(j.item.id, dk);
        dynamics.unshift(j.item); render();
        ta.value = ''; updateCnt(); box.classList.remove('open');
        document.getElementById('tw-pass').value = '';
        say('');
      } else if (j.error === 'admin_unset') {
        say(j.message || '管理人パスワードがまだ設定されていません。', true);
      } else if (j.error === 'not_configured') {
        say('投稿機能は準備中です（サーバー未設定）。', true);
      } else {
        say(typeof j.error === 'string' && j.error !== 'network' ? j.error : '送信できませんでした。時間をおいてもう一度どうぞ。', true);
      }
    });
  }
  document.getElementById('post-admin').addEventListener('click', function () { post('admin'); });
  document.getElementById('post-guest').addEventListener('click', function () { post('guest'); });
  document.getElementById('tw-pass').addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); post('admin'); } });

  /* ===== 管理人パスワード設定ヘルパー（?setup のときだけ表示。計算はブラウザ内だけ） ===== */
  if (/[?&]setup\b/.test(location.search)) {
    var sb = document.getElementById('setupbox'); sb.hidden = false;
    var inp = document.getElementById('setup-pass'), out = document.getElementById('setup-hash');
    document.getElementById('setup-btn').addEventListener('click', function () {
      var v = inp.value; if (!v) { out.textContent = 'パスワードを入れてください。'; return; }
      crypto.subtle.digest('SHA-256', new TextEncoder().encode(v)).then(function (buf) {
        var hex = Array.prototype.map.call(new Uint8Array(buf), function (x) { return ('0' + x.toString(16)).slice(-2); }).join('');
        out.innerHTML = '環境変数 <code>HEAD_ADMIN_HASH</code> の値：<br><code>' + hex + '</code><br>Vercel のプロジェクト設定 → Environment Variables にこの値を登録すると、管理人投稿が使えるようになります（パスワードそのものはサーバーにも置かれません）。';
      });
    });
  }

  render();
  load();
  updateCnt();
})();
