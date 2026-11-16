/* ホームのアクセスカウンター（本物）
   GET  /api/counter        → { ok, n }  いまの数（数えない）
   POST /api/counter        → { ok, n }  1つ数える（ブラウザ側で、1回の訪問につき1度だけ送る）
   同じ人の連打は回数制限ではじく。IP はそのまま保存しない。 */
'use strict';
const L = require('./_lib');
const KEY = 'site:visits';

module.exports = async function handler(req, res) {
  try {
    if (!L.hasKV()) return L.send(res, 503, { ok: false, error: 'not_configured' });
    if (req.method === 'GET') {
      const [n] = await L.kv([['GET', KEY]]);
      return L.send(res, 200, { ok: true, n: +n || 0 }, 'public, s-maxage=30, stale-while-revalidate=300');
    }
    if (req.method !== 'POST') { res.setHeader('Allow', 'GET, POST'); return L.send(res, 405, { ok: false }); }
    if (!L.sameOrigin(req)) return L.send(res, 403, { ok: false });
    if (!(await L.limit([['vc:' + L.ipKey(req), 20, 3600]]))) {
      const [n] = await L.kv([['GET', KEY]]);
      return L.send(res, 200, { ok: true, n: +n || 0, counted: false });
    }
    const [n] = await L.kv([['INCR', KEY]]);
    L.send(res, 200, { ok: true, n: +n || 0, counted: true });
  } catch (e) {
    L.send(res, 500, { ok: false });
  }
};
