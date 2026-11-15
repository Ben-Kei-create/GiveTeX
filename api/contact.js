/* お問い合わせフォーム → 管理人のメールへ
   GET  /api/contact      → { ok, tk, ready }（合言葉と、送信の準備ができているか）
   POST /api/contact      → メールを送る（Resend を使用。環境変数 RESEND_API_KEY）
   宛先は環境変数 CONTACT_TO（なければ管理人の Gmail）。送り元は CONTACT_FROM（なければ Resend のテスト用アドレス）。 */
'use strict';
const L = require('./_lib');
const TO = process.env.CONTACT_TO || ['tofuodorico', 'gmail.com'].join('@');
const FROM = process.env.CONTACT_FROM || 'GiveTex お問い合わせ <onboarding@resend.dev>';
const KINDS = ['サイトについて', 'アプリについて', 'ドパ読！（Kindle）について', 'どろん（オカルト）について', 'お仕事の相談', '不具合のご報告', 'その他'];
const EMAIL = /^[A-Za-z0-9._%+-]{1,64}@[A-Za-z0-9.-]{1,180}\.[A-Za-z]{2,24}$/;

module.exports = async function handler(req, res) {
  try {
    const ready = !!process.env.RESEND_API_KEY;
    if (req.method === 'GET') return L.send(res, 200, { ok: true, tk: L.issueToken(), ready: ready, kinds: KINDS });
    if (req.method !== 'POST') { res.setHeader('Allow', 'GET, POST'); return L.send(res, 405, { ok: false }); }
    if (!L.sameOrigin(req)) return L.send(res, 403, { ok: false, error: 'このページから送ってください。' });
    const b = await L.readJson(req, 16384);
    if (b.website) return L.send(res, 200, { ok: true }); // ロボットよけ
    if (!L.checkToken(b.tk)) return L.send(res, 400, { ok: false, error: 'ページを開き直してから、もう一度送ってください。' });
    const name = L.clean(b.name, 40, true), email = L.clean(b.email, 254, true), msg = L.clean(b.msg, 3000, false);
    const kind = KINDS.indexOf(b.kind) >= 0 ? b.kind : 'その他';
    if (name === null) return L.send(res, 400, { ok: false, error: 'お名前は40文字までにしてください。' });
    if (email === null || (email && !EMAIL.test(email))) return L.send(res, 400, { ok: false, error: 'メールアドレスの形がちがうようです。' });
    if (!msg || Array.from(msg).length < 10) return L.send(res, 400, { ok: false, error: 'お問い合わせの内容を10〜3000文字で書いてください。' });
    if (b.agree !== true) return L.send(res, 400, { ok: false, error: 'プライバシーポリシーへの同意にチェックを入れてください。' });
    if ((msg.match(/https?:\/\//g) || []).length > 3) return L.send(res, 400, { ok: false, error: 'リンクは3つまでにしてください。' });
    const ip = L.ipKey(req);
    if (!(await L.limit([['ct10:' + ip, 1, 60], ['cth:' + ip, 3, 3600], ['ctd:' + ip, 6, 86400], ['ctall:' + L.jstDay(), 60, 86400]])))
      return L.send(res, 429, { ok: false, error: '送信が続いています。しばらく時間をおいてから送ってください。' });
    if (!ready) return L.send(res, 503, { ok: false, error: 'not_configured' });

    const subject = ('[GiveTex] ' + kind + ' — ' + (name || '名無しさん')).replace(/[\r\n]/g, ' ').slice(0, 120);
    const text = [
      'GiveTex のお問い合わせフォームから届きました。', '',
      '■ 種類：' + kind,
      '■ お名前：' + (name || '（なし）'),
      '■ 返信先：' + (email || '（なし・返信不要）'),
      '■ 日時：' + new Date(Date.now() + 9 * 3600e3).toISOString().replace('T', ' ').slice(0, 16) + '（日本時間）',
      '', '―――――――――――――', msg, '―――――――――――――', '',
      '※ このメールに返信すると、相手のメールアドレスあてになります（返信先がある場合）。'
    ].join('\n');
    const payload = { from: FROM, to: [TO], subject: subject, text: text };
    if (email) payload.reply_to = email;
    const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 15000);
    let r;
    try {
      r = await fetch('https://api.resend.com/emails', { method: 'POST', signal: ctl.signal,
        headers: { Authorization: 'Bearer ' + process.env.RESEND_API_KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    } finally { clearTimeout(t); }
    if (!r.ok) { console.error('resend', r.status, (await r.text()).slice(0, 300)); return L.send(res, 502, { ok: false, error: 'send_failed' }); }
    L.send(res, 200, { ok: true });
  } catch (e) {
    L.send(res, e.status || 500, { ok: false, error: e.status ? 'もう一度お試しください。' : 'send_failed' });
  }
};
