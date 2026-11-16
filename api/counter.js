/* ホームのアクセスカウンター（本物）＋キリ番の記録
   GET  /api/counter                 → { ok, n, kiri:[{n,name,at}] }  いまの数（数えない）と最近のキリ番
   POST /api/counter {}              → { ok, n, counted, kiri?:true, ktk? }  1つ数える（1回の訪問につき1度だけ）
   POST /api/counter {act:"kiri", n, ktk, name}  キリ番をふんだ人が、記念に名前を残す
   IP はそのまま保存しない。 */
'use strict';
const L = require('./_lib');
const KEY = 'site:visits';
function isKiri(n) { return n > 0 && (n % 100 === 0 || (n >= 11 && /^(\d)\1+$/.test(String(n))) || n === 1234 || n === 12345); }

async function recent() {
  const [ns] = await L.kv([['LRANGE', 'site:kirilist', '0', '4']]);
  if (!ns || !ns.length) return [];
  const [raw] = await L.kv([['MGET'].concat(ns.map(n => 'site:kiri:' + n))]);
  return raw.map(r => { try { const k = JSON.parse(r); return { n: k.n, name: k.name || '', at: k.at }; } catch (e) { return null; } }).filter(Boolean);
}

module.exports = async function handler(req, res) {
  try {
    if (!L.hasKV()) return L.send(res, 503, { ok: false, error: 'not_configured' });
    if (req.method === 'GET') {
      const [n, td, yd] = await L.kv([['GET', KEY], ['GET', 'site:day:' + L.jstDay()], ['GET', 'site:day:' + L.jstDay(Date.now() - 864e5)]]);
      return L.send(res, 200, { ok: true, n: +n || 0, today: +td || 0, yesterday: +yd || 0, kiri: await recent() }, 'public, s-maxage=30, stale-while-revalidate=300');
    }
    if (req.method !== 'POST') { res.setHeader('Allow', 'GET, POST'); return L.send(res, 405, { ok: false }); }
    if (!L.sameOrigin(req)) return L.send(res, 403, { ok: false });
    const b = await L.readJson(req, 1024), ip = L.ipKey(req);

    if (b.act === 'kiri') {
      const n = parseInt(b.n, 10);
      if (!isKiri(n) || L.hmac('kiri|' + n, 16) !== String(b.ktk || '')) return L.send(res, 403, { ok: false, error: 'キリ番の証明が合いません。' });
      const name = L.clean(b.name, 12, true);
      if (!name) return L.send(res, 400, { ok: false, error: 'おなまえを1〜12文字で入れてね。' });
      if (L.looksSpam(name)) return L.send(res, 400, { ok: false, error: 'その名前は使えません。' });
      if (!(await L.limit([['kn:' + ip, 5, 3600]]))) return L.send(res, 429, { ok: false, error: '少し時間をおいてね。' });
      const [raw] = await L.kv([['GET', 'site:kiri:' + n]]); let k = null; try { k = JSON.parse(raw); } catch (e) {}
      if (!k) return L.send(res, 404, { ok: false, error: '記録が見つかりません。' });
      if (k.name) return L.send(res, 409, { ok: false, error: 'もう名前が書かれています。' });
      k.name = L.mask(name); await L.kv([['SET', 'site:kiri:' + n, JSON.stringify(k)]]);
      await L.notify('キリ番 ' + n + ' がふまれました！', k.name + ' さんが キリ番 ' + n + ' をふみました。\n\nhttps://www.givetex.org/');
      return L.send(res, 200, { ok: true, kiri: await recent() });
    }

    if (!(await L.limit([['vc:' + ip, 20, 3600]]))) {
      const [n] = await L.kv([['GET', KEY]]);
      return L.send(res, 200, { ok: true, n: +n || 0, counted: false, kiri: await recent() });
    }
    const dk = 'site:day:' + L.jstDay();
    const [n, td, , yd] = await L.kv([['INCR', KEY], ['INCR', dk], ['EXPIRE', dk, '259200'], ['GET', 'site:day:' + L.jstDay(Date.now() - 864e5)]]);
    const out = { ok: true, n: +n || 0, counted: true, today: +td || 0, yesterday: +yd || 0 };
    if (isKiri(out.n)) try {
      await L.kv([['SET', 'site:kiri:' + out.n, JSON.stringify({ n: out.n, at: Date.now(), name: '' }), 'NX'], ['LPUSH', 'site:kirilist', String(out.n)], ['LTRIM', 'site:kirilist', '0', '49']]);
      out.kiri = true; out.ktk = L.hmac('kiri|' + out.n, 16);
    } catch (e) { /* キリ番の記録に失敗しても、カウンターは返す */ }
    try { out.list = await recent(); } catch (e) { out.list = []; }
    L.send(res, 200, out);
  } catch (e) {
    L.send(res, 500, { ok: false });
  }
};
