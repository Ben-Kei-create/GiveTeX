/* GiveTex のサーバー機能で共通に使う道具（このファイル自体は公開されません）
   - Upstash Redis（Vercel の Storage から追加）を REST で使います。外部パッケージは使いません。
   - 環境変数：KV_REST_API_URL / KV_REST_API_TOKEN（または UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN） */
'use strict';
const crypto = require('crypto');

const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '';
const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '';
const SECRET = process.env.BOARD_SECRET || KV_TOKEN || process.env.RESEND_API_KEY || 'givetex-local-dev-secret';
const ORIGINS = ['https://www.givetex.org', 'https://givetex.org'].concat((process.env.ALLOW_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean));

function hasKV() { return !!(KV_URL && KV_TOKEN); }

/* Redis のコマンドをまとめて送る。[['GET','k'],['INCR','n']] → [結果, 結果] */
async function kv(cmds) {
  if (!hasKV()) throw new Error('kv_not_configured');
  const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 8000);
  try {
    const r = await fetch(KV_URL.replace(/\/$/, '') + '/pipeline', {
      method: 'POST', signal: ctl.signal,
      headers: { Authorization: 'Bearer ' + KV_TOKEN, 'Content-Type': 'application/json' },
      body: JSON.stringify(cmds)
    });
    if (!r.ok) throw new Error('kv_http_' + r.status);
    const j = await r.json();
    return j.map(x => { if (x && x.error) throw new Error('kv_' + x.error); return x ? x.result : null; });
  } finally { clearTimeout(t); }
}

function send(res, status, obj, cache) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', cache || 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.end(JSON.stringify(obj));
}

function clientIp(req) {
  const h = req.headers || {};
  const v = h['x-real-ip'] || h['x-vercel-forwarded-for'] || String(h['x-forwarded-for'] || '').split(',')[0] || (req.socket && req.socket.remoteAddress) || '0.0.0.0';
  return String(v).trim().slice(0, 64);
}
function hmac(s, len) { return crypto.createHmac('sha256', SECRET).update(String(s)).digest('base64url').slice(0, len || 43); }
function sha(s) { return crypto.createHash('sha256').update(String(s)).digest('hex'); }
/* IP はそのまま保存しない。日付と混ぜてハッシュにする */
function jstDay(ms) { return new Date((ms || Date.now()) + 9 * 3600e3).toISOString().slice(0, 10); }
function ipKey(req) { return hmac('ip|' + clientIp(req), 22); }
function dailyId(req) { return hmac('id|' + clientIp(req) + '|' + jstDay(), 8).replace(/[-_]/g, 'x'); }

/* ほかのサイトから勝手に送らせない */
function sameOrigin(req) {
  const o = req.headers.origin || '';
  if (!o) { const ref = req.headers.referer || ''; return ORIGINS.some(x => ref.indexOf(x + '/') === 0); }
  return ORIGINS.indexOf(o) >= 0;
}

/* フォームの合言葉（開いてから3秒〜3時間のあいだだけ有効）。単純なロボットよけ */
function issueToken() { const t = Date.now(); return t + '.' + hmac('tk|' + t, 16); }
function checkToken(tk) {
  const m = /^(\d{13})\.([\w-]{16})$/.exec(String(tk || '')); if (!m) return false;
  const t = +m[1], age = Date.now() - t;
  return age >= 3000 && age <= 3 * 3600e3 && hmac('tk|' + t, 16) === m[2];
}

async function readJson(req, limit) {
  const len = +(req.headers['content-length'] || 0);
  if (len > limit) throw Object.assign(new Error('too_large'), { status: 413 });
  const ct = String(req.headers['content-type'] || '');
  if (ct.indexOf('application/json') !== 0) throw Object.assign(new Error('bad_type'), { status: 415 });
  let b;
  try { b = req.body; } catch (e) { throw Object.assign(new Error('bad_json'), { status: 400 }); }
  if (b === undefined || b === null) {
    b = await new Promise((ok, ng) => {
      let n = 0; const parts = [];
      req.on('data', c => { n += c.length; if (n > limit) { ng(Object.assign(new Error('too_large'), { status: 413 })); req.destroy(); } else parts.push(c); });
      req.on('end', () => ok(Buffer.concat(parts).toString('utf8'))); req.on('error', ng);
    });
  }
  if (Buffer.isBuffer(b)) b = b.toString('utf8');
  if (typeof b === 'string') { if (b.length > limit) throw Object.assign(new Error('too_large'), { status: 413 }); try { b = JSON.parse(b); } catch (e) { throw Object.assign(new Error('bad_json'), { status: 400 }); } }
  if (!b || typeof b !== 'object' || Array.isArray(b)) throw Object.assign(new Error('bad_json'), { status: 400 });
  return b;
}

/* 回数制限。[キー, 上限, 秒] の組を全部チェック。ひとつでも超えたら false */
const mem = new Map();
async function limit(rules) {
  if (hasKV()) {
    const cmds = []; rules.forEach(r => { cmds.push(['INCR', 'rl:' + r[0]]); cmds.push(['EXPIRE', 'rl:' + r[0], String(r[2]), 'NX']); });
    const out = await kv(cmds);
    return rules.every((r, i) => out[i * 2] <= r[1]);
  }
  const now = Date.now(); let ok = true;
  rules.forEach(r => { const k = r[0]; let e = mem.get(k); if (!e || e.until < now) e = { n: 0, until: now + r[2] * 1000 }; e.n++; mem.set(k, e); if (e.n > r[1]) ok = false; });
  if (mem.size > 5000) mem.clear();
  return ok;
}

/* 文字のそうじ：制御文字を消し、改行をそろえ、長さを切る */
function clean(s, max, oneLine) {
  s = String(s == null ? '' : s).normalize('NFC').replace(/\r\n?/g, '\n').replace(/[\u0000-\u0009\u000b-\u001f\u007f​-‏‪-‮⁠-⁤﻿]/g, '');
  if (oneLine) s = s.replace(/\n+/g, ' ');
  s = s.replace(/[ \t　]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
  return Array.from(s).length > max ? null : s;
}
const NG = ['死ね', 'しね', '氏ね', '殺す', 'ころす', '殺害予告', 'ちんこ', 'ちんぽ', 'まんこ', 'セックス', 'fuck', 'f*ck', 'shit', 'kill you', 'ガイジ', 'キチガイ', '池沼', 'レイプ', '自殺しろ'];
function mask(s) { let o = s; NG.forEach(w => { const re = new RegExp(w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'); o = o.replace(re, '＊'.repeat(Array.from(w).length)); }); return o; }
function looksSpam(s) {
  if (/(https?:|www\.|\.(com|net|org|jp|io|xyz|ru|cn)\b|<a\s|\[url)/i.test(s)) return 'リンクは書けません。';
  if (/[\w.+-]+@[\w-]+\.[\w.]+/.test(s)) return 'メールアドレスは書けません。';
  if (/(0\d{1,4}[-ー－]?\d{1,4}[-ー－]?\d{3,4})/.test(s.replace(/\s/g, '')) && /\d{10,11}/.test(s.replace(/[^\d]/g, ''))) return '電話番号のようなものは書けません。';
  if (/(.)\1{24,}/u.test(s)) return '同じ文字のくり返しが多すぎます。';
  return '';
}

/* 管理人へのお知らせメール（Resend）。1日40通まで。失敗しても本体の処理は止めない */
async function notify(subject, text) {
  try {
    if (!process.env.RESEND_API_KEY) return false;
    if (hasKV()) { const [n] = await kv([['INCR', 'notify:' + jstDay()], ['EXPIRE', 'notify:' + jstDay(), '172800']]); if (n > 40) return false; }
    const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 6000);
    try {
      const r = await fetch('https://api.resend.com/emails', { method: 'POST', signal: ctl.signal,
        headers: { Authorization: 'Bearer ' + process.env.RESEND_API_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: process.env.CONTACT_FROM || 'GiveTex お知らせ <onboarding@resend.dev>', to: [process.env.CONTACT_TO || ['tofuodorico', 'gmail.com'].join('@')],
          subject: ('[GiveTex] ' + subject).replace(/[\r\n]/g, ' ').slice(0, 120), text: text + '\n\n―――\nGiveTex の自動のお知らせです（1日40通まで）。' }) });
      return r.ok;
    } finally { clearTimeout(t); }
  } catch (e) { return false; }
}

module.exports = { notify, kv, hasKV, send, clientIp, hmac, sha, ipKey, dailyId, sameOrigin, issueToken, checkToken, readJson, limit, clean, mask, looksSpam, jstDay };
