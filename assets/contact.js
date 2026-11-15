/* お問い合わせフォーム */
(function () {
  'use strict';
  var f = document.getElementById('ct'); if (!f) return;
  var out = document.getElementById('ct-out'), btn = f.querySelector('.ct-send'), msg = document.getElementById('ct-msg'), cnt = document.getElementById('ct-count');
  var tk = '', ready = true, sending = false, sent = false;
  var MAIL = 'tofuodorico' + '@' + 'gmail.com';
  function say(t, kind) { out.className = 'ct-msg ' + (kind || ''); out.textContent = t; }
  function fallback(t) {
    say(t + ' ', 'ng');
    var a = document.createElement('a'); a.href = 'mailto:' + MAIL + '?subject=' + encodeURIComponent('[GiveTex] お問い合わせ') + '&body=' + encodeURIComponent(msg.value.slice(0, 1500));
    a.textContent = 'メールアプリで送る（' + MAIL + '）'; out.appendChild(a);
  }
  function getTk() {
    return fetch('/api/contact', { cache: 'no-store' }).then(function (r) { return r.json(); })
      .then(function (j) { if (j && j.tk) { tk = j.tk; ready = !!j.ready; } }).catch(function () {});
  }
  getTk();
  setInterval(getTk, 60 * 60 * 1000);
  msg.addEventListener('input', function () { cnt.textContent = Array.from(msg.value).length + ' / 3000'; });
  try { var d = sessionStorage.getItem('ct-draft'); if (d) { msg.value = d; cnt.textContent = Array.from(d).length + ' / 3000'; } } catch (e) {}
  msg.addEventListener('input', function () { try { sessionStorage.setItem('ct-draft', msg.value); } catch (e) {} });
  f.addEventListener('submit', function (e) {
    e.preventDefault();
    if (sending) return;
    if (sent) return say('もう送信しました。ありがとうございました！', 'ok');
    var data = { kind: f.kind.value, name: f.name.value.trim(), email: f.email.value.trim(), msg: msg.value.trim(), website: f.website.value, agree: document.getElementById('ct-agree').checked, tk: tk };
    var n = Array.from(data.msg).length;
    if (n < 10) { msg.focus(); return say('お問い合わせの内容を10文字以上で書いてください。', 'ng'); }
    if (n > 3000) { msg.focus(); return say('内容は3000文字までにしてください。', 'ng'); }
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)) { f.email.focus(); return say('メールアドレスの形がちがうようです。', 'ng'); }
    if (!data.agree) return say('プライバシーポリシーへの同意にチェックを入れてください。', 'ng');
    if (!ready) return fallback('ただいまフォームの準備中です。おそれいりますが、こちらからどうぞ：');
    sending = true; btn.disabled = true; say('送信中……');
    fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      .then(function (r) { return r.json().catch(function () { return { ok: false }; }).then(function (j) { return { s: r.status, j: j }; }); })
      .then(function (x) {
        if (x.j && x.j.ok) {
          sent = true; f.reset(); cnt.textContent = '0 / 3000'; try { sessionStorage.removeItem('ct-draft'); } catch (e) {}
          say('送信しました！ ありがとうございました。お返事まで少しお待ちください。', 'ok');
          try { if (window.gtag) gtag('event', 'contact_send', { kind: data.kind }); } catch (e) {}
          return;
        }
        var err = x.j && x.j.error;
        if (err === 'not_configured' || err === 'send_failed' || x.s >= 500) fallback('ごめんなさい、いま送信できませんでした。こちらからどうぞ：');
        else { say(typeof err === 'string' && /[ぁ-ん一-龥]/.test(err) ? err : '送信できませんでした。もう一度お試しください。', 'ng'); if (x.s === 400) getTk(); }
      })
      .catch(function () { fallback('通信できませんでした。電波のよいところで、もう一度お試しください。または：'); })
      .then(function () { sending = false; btn.disabled = false; });
  });
})();
