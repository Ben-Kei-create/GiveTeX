/* C-Log（iPhone アプリ）のサーバーから、映画の最新情報を中継する
   GET /api/clog?r=popular&page=1 | r=search&q=…&page=1 | r=movie&id=… | r=news
   C-Log のサーバー（Render 無料）は眠ることがあるので、取れたものを Redis にも控えておき、
   起きるまでのあいだは控えを返します。 */
'use strict';
const L = require('./_lib');
const BASE = (process.env.CLOG_API || 'https://clog-api.onrender.com').replace(/\/$/, '') + '/api/v1';
const IMG = /^https:\/\/image\.tmdb\.org\/t\/p\/\w+\/[\w-]+\.(jpg|png)$/;

function s(v, n) { return typeof v === 'string' ? v.slice(0, n) : ''; }
function movie(m) {
  if (!m || typeof m !== 'object') return null;
  const id = parseInt(m.id, 10); if (!(id > 0)) return null;
  return { id: id, title: s(m.title, 120), overview: s(m.overview, 1200), poster: IMG.test(m.posterURL || '') ? m.posterURL : '',
    backdrop: IMG.test(m.backdropURL || '') ? m.backdropURL : '', date: s(m.releaseDate, 10), score: typeof m.tmdbVoteAverage === 'number' ? Math.round(m.tmdbVoteAverage * 10) / 10 : null,
    runtime: parseInt(m.runtimeMinutes, 10) || 0, genres: Array.isArray(m.genres) ? m.genres.filter(g => typeof g === 'string').slice(0, 5).map(g => g.slice(0, 20)) : [] };
}
function page(j) { return { page: parseInt(j && j.page, 10) || 1, pages: Math.min(parseInt(j && (j.totalPages || j.total_pages), 10) || 1, 50), results: ((j && j.results) || []).map(movie).filter(Boolean).slice(0, 40) }; }
function when(v) { if (typeof v === 'number') v = new Date((v + 978307200) * 1000).toISOString(); return s(v, 10); } // Swift の日付（2001年基準の秒）にも対応
function news(j) { return { results: (Array.isArray(j) ? j : []).slice(0, 10).map(n => ({ title: s(n.title, 120), cat: s(n.category, 20), at: when(n.publishedAt) })).filter(n => n.title) }; }

async function upstream(path) {
  const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 25000);
  try {
    const r = await fetch(BASE + path, { signal: ctl.signal, headers: { Accept: 'application/json', 'User-Agent': 'GiveTex-CLogWeb' } });
    if (!r.ok) throw Object.assign(new Error('upstream_' + r.status), { up: r.status });
    return await r.json();
  } finally { clearTimeout(t); }
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); return L.send(res, 405, { ok: false }); }
  const u = new URL(req.url, 'http://x'), r = u.searchParams.get('r');
  const pg = Math.min(Math.max(parseInt(u.searchParams.get('page'), 10) || 1, 1), 20);
  let path, shape, ttl = 1800, key;
  if (r === 'popular') { path = '/movies/popular?page=' + pg; shape = page; key = 'popular:' + pg; }
  else if (r === 'news') { path = '/news'; shape = news; key = 'news'; }
  else if (r === 'movie') {
    const id = parseInt(u.searchParams.get('id'), 10); if (!(id > 0 && id < 1e8)) return L.send(res, 400, { ok: false, error: 'bad_id' });
    path = '/movies/' + id; shape = j => ({ movie: movie(j) }); ttl = 86400; key = 'movie:' + id;
  } else if (r === 'search') {
    const q = L.clean(u.searchParams.get('q'), 50, true); if (!q) return L.send(res, 400, { ok: false, error: 'bad_query' });
    if (!(await L.limit([['cs:' + L.ipKey(req), 40, 60]]))) return L.send(res, 429, { ok: false, error: 'ちょっと待ってから、もう一度さがしてください。' });
    path = '/movies/search?q=' + encodeURIComponent(q) + '&page=' + pg; shape = page; ttl = 3600; key = '';
  } else return L.send(res, 400, { ok: false, error: 'bad_r' });

  try {
    const data = shape(await upstream(path));
    if (key && L.hasKV()) { try { await L.kv([['SET', 'clog:' + key, JSON.stringify(data), 'EX', '1209600']]); } catch (e) {} }
    return L.send(res, 200, Object.assign({ ok: true }, data), 'public, s-maxage=' + ttl + ', stale-while-revalidate=86400');
  } catch (e) {
    if (key && L.hasKV()) {
      try { const [c] = await L.kv([['GET', 'clog:' + key]]); if (c) return L.send(res, 200, Object.assign({ ok: true, stale: true }, JSON.parse(c)), 'public, s-maxage=60'); } catch (e2) {}
    }
    if (e.up === 404) return L.send(res, 404, { ok: false, error: '見つかりませんでした。' });
    return L.send(res, 503, { ok: false, error: 'waking', message: 'C-Log のサーバーが起きるまで、1分ほどお待ちください。' });
  }
};
