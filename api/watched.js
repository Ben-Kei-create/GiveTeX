/* 映画ブース「管理人の鑑賞記録」
   GET  /api/watched            → { ids:[観た映画の TMDb の番号], at:{番号:チェックした時刻}, extra:[候補にない映画] }
   POST /api/watched { pass, act:"login" }                         → パスワードの確認だけ
        { pass, act:"set", id, on }                                → 観た／観てない
        { pass, act:"add", m:{id,t,y,k,p} } / { pass, act:"del", id } → 候補にない映画を足す／消す
   - パスワードは「頭の中ブース」と同じ（Vercel の HEAD_ADMIN_HASH ＝ パスワードの SHA-256）
   - まちがいが続いたら、しばらく受けつけない */
'use strict';
const crypto = require('crypto');
const L = require('./_lib');
const IMG = /^https:\/\/image\.tmdb\.org\/t\/p\/\w+\/[\w-]+\.(jpg|png)$/;

function adminOk(pass) {
  const want = String(process.env.HEAD_ADMIN_HASH || '').trim().toLowerCase();
  if (!/^[a-f0-9]{64}$/.test(want)) return 'unset';
  const got = Buffer.from(L.sha(String(pass || '')), 'utf8'), exp = Buffer.from(want, 'utf8');
  return got.length === exp.length && crypto.timingSafeEqual(got, exp);
}
function idOf(v) { const n = parseInt(v, 10); return n > 0 && n < 1e9 ? n : 0; }

module.exports = async function handler(req, res) {
  try {
    if (!L.hasKV()) return L.send(res, 503, { ok: false, error: 'not_configured' });
    if (req.method === 'GET') {
      const [ids, at, ex] = await L.kv([['SMEMBERS', 'w:ids'], ['HGETALL', 'w:at'], ['HGETALL', 'w:extra']]);
      const pairs = a => { const o = {}; if (Array.isArray(a)) for (let i = 0; i + 1 < a.length; i += 2) o[a[i]] = a[i + 1]; else if (a && typeof a === 'object') Object.assign(o, a); return o; };
      const atO = pairs(at), exO = pairs(ex), extra = [];
      Object.keys(exO).forEach(k => { try { extra.push(JSON.parse(exO[k])); } catch (e) {} });
      const atN = {}; Object.keys(atO).forEach(k => { atN[k] = +atO[k] || 0; });
      return L.send(res, 200, { ok: true, ids: (ids || []).map(Number).filter(Boolean), at: atN, extra: extra }, 'public, s-maxage=30, stale-while-revalidate=300');
    }
    if (req.method !== 'POST') return L.send(res, 405, { ok: false });
    if (!L.sameOrigin(req)) return L.send(res, 403, { ok: false, error: 'bad_origin' });
    const b = await L.readJson(req, 4000).catch(() => null); if (!b) return L.send(res, 400, { ok: false });
    const ip = L.ipKey(req);
    if (!(await L.limit([['wa:' + ip, 120, 3600]]))) return L.send(res, 429, { ok: false, error: '少し時間をおいてね。' });
    const [bad] = await L.kv([['GET', 'rl:wbad:' + ip]]);
    if (+bad >= 8) return L.send(res, 429, { ok: false, error: 'まちがいが続いたので、1時間ほどおいてね。' });
    const ok = adminOk(b.pass);
    if (ok === 'unset') return L.send(res, 503, { ok: false, error: 'パスワードがまだ設定されていません（HEAD_ADMIN_HASH）。' });
    if (!ok) { await L.limit([['wbad:' + ip, 8, 3600]]); return L.send(res, 403, { ok: false, error: 'パスワードがちがいます。' }); }
    if (b.act === 'login') return L.send(res, 200, { ok: true });
    if (b.act === 'set') {
      const id = idOf(b.id); if (!id) return L.send(res, 400, { ok: false, error: 'bad_id' });
      if (b.on) await L.kv([['SADD', 'w:ids', String(id)], ['HSET', 'w:at', String(id), String(Date.now())]]);
      else await L.kv([['SREM', 'w:ids', String(id)], ['HDEL', 'w:at', String(id)]]);
      return L.send(res, 200, { ok: true });
    }
    if (b.act === 'add') {
      const m = b.m || {}, id = idOf(m.id); if (!id) return L.send(res, 400, { ok: false, error: 'bad_id' });
      const one = { id: id, t: L.clean(m.t, 60, true) || '（題名なし）', y: Math.min(Math.max(parseInt(m.y, 10) || 0, 1890), 2100), k: m.k === 'ho' ? 'ho' : 'yo', p: IMG.test(m.p || '') ? m.p : '', s: typeof m.s === 'number' ? Math.round(m.s * 10) / 10 : null, x: 1 };
      await L.kv([['HSET', 'w:extra', String(id), JSON.stringify(one)], ['SADD', 'w:ids', String(id)], ['HSET', 'w:at', String(id), String(Date.now())]]);
      return L.send(res, 200, { ok: true, m: one });
    }
    if (b.act === 'del') {
      const id = idOf(b.id); if (!id) return L.send(res, 400, { ok: false, error: 'bad_id' });
      await L.kv([['HDEL', 'w:extra', String(id)], ['SREM', 'w:ids', String(id)], ['HDEL', 'w:at', String(id)]]);
      return L.send(res, 200, { ok: true });
    }
    return L.send(res, 400, { ok: false, error: 'bad_act' });
  } catch (e) { console.error(e); return L.send(res, 500, { ok: false }); }
};
