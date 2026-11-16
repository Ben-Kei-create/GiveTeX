/* Web拍手（90年代〜2000年代の個人サイトの定番）
   GET  /api/clap?page=home      → { ok, n }
   POST /api/clap {page, msg?}   → { ok, n, thanks }  拍手を1つ。ひとことを添えると管理人にメールで届く（公開はしない） */
'use strict';
const L = require('./_lib');
const PAGES = ['home', 'diary', 'guestbook', 'links', 'game', 'movie', 'books', 'doron', 'note', 'stamp', 'apps', 'museum', 'ramen'];
const THANKS = ['拍手ありがとう！ がんばれます (^^)', 'わーい！ 拍手ありがとうございます！', 'ありがとう！ 今日もいい日になりますように。', 'ぱちぱち！ 励みになります m(_ _)m', 'うれしい！ またあそびに来てね ヽ(´▽`)ノ'];

module.exports = async function handler(req, res) {
  try {
    if (!L.hasKV()) return L.send(res, 503, { ok: false, error: 'not_configured' });
    const u = new URL(req.url, 'http://x');
    if (req.method === 'GET') {
      const page = u.searchParams.get('page'); if (PAGES.indexOf(page) < 0) return L.send(res, 400, { ok: false });
      const [n] = await L.kv([['GET', 'clap:' + page]]);
      return L.send(res, 200, { ok: true, n: +n || 0 }, 'public, s-maxage=30, stale-while-revalidate=300');
    }
    if (req.method !== 'POST') { res.setHeader('Allow', 'GET, POST'); return L.send(res, 405, { ok: false }); }
    if (!L.sameOrigin(req)) return L.send(res, 403, { ok: false });
    const b = await L.readJson(req, 2048);
    if (PAGES.indexOf(b.page) < 0) return L.send(res, 400, { ok: false });
    const ip = L.ipKey(req);
    if (!(await L.limit([['cl:' + ip + ':' + b.page, 10, 3600], ['clall:' + ip, 40, 3600]]))) return L.send(res, 429, { ok: false, error: 'たくさんの拍手、ありがとう！ 少し休んでね。' });
    const [n] = await L.kv([['INCR', 'clap:' + b.page]]);
    const msg = L.clean(b.msg, 100, false);
    if (msg && !L.looksSpam(msg) && (await L.limit([['clm:' + ip, 5, 3600]]))) await L.notify('Web拍手にひとこと（' + b.page + '）', L.mask(msg));
    L.send(res, 200, { ok: true, n: +n || 0, thanks: THANKS[Math.floor(Math.random() * THANKS.length)] });
  } catch (e) { L.send(res, 500, { ok: false }); }
};
