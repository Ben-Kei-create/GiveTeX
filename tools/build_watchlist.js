// 管理人の鑑賞記録：候補（tools/movie_candidates.json）を C-Log の検索で調べて、ポスターなどをつけた一覧を作る → movie/watchlist.js
// usage: node tools/build_watchlist.js   （ネットにつながる場所で。候補を足したときだけ実行すればよい）
// 前に調べた結果は movie/watchlist.js から引き継ぐので、2回目からは新しい候補だけを調べる
const fs = require('fs'), path = require('path');
const R = path.join(__dirname, '..');
const API = (process.env.CLOG_API || 'https://clog-api.onrender.com') + '/api/v1/movies/search?page=1&q=';
const C = JSON.parse(fs.readFileSync(path.join(__dirname, 'movie_candidates.json'), 'utf8'));
const OUT = path.join(R, 'movie/watchlist.js');
let old = {};
try { global.window = {}; require(OUT); (window.WATCHLIST || []).forEach(m => { old[m.k + '|' + m.q] = m; }); } catch (e) {}
const IMG = /^https:\/\/image\.tmdb\.org\/t\/p\/\w+\/[\w-]+\.(jpg|png)$/;
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function find(q, y) {
  for (let i = 0; i < 4; i++) {
    try {
      const r = await fetch(API + encodeURIComponent(q), { headers: { Accept: 'application/json', 'User-Agent': 'GiveTex-watchlist' } });
      if (r.ok) {
        const list = ((await r.json()).results || []).filter(m => m && m.id);
        const yr = m => parseInt(String(m.releaseDate || '').slice(0, 4), 10) || 0;
        const n = t => String(t || '').normalize('NFKC').replace(/[\s・：:！!？?、。「」『』（）()／/—\-－〜~&＆＄$.]/g, '').toLowerCase(), nq = n(q);
        const near = m => Math.abs(yr(m) - y) <= 1 && m.posterURL;
        // 題名が同じ＋年が近い → 題名をふくむ＋年が近い → 年が近い → 題名が同じ、の順でえらぶ（「怒り」で「怒りのデス・ロード」を拾わないように）
        const best = list.find(m => near(m) && n(m.title) === nq) || list.find(m => near(m) && n(m.title).indexOf(nq) >= 0) || list.find(m => n(m.title) === nq) || list.find(near) || list[0];
        return best || null;
      }
    } catch (e) {}
    await sleep(3000 * (i + 1)); // C-Log のサーバーが寝ているときは、起きるまで待つ
  }
  return null;
}
(async () => {
  const out = [], miss = [];
  for (const k of ['yo', 'ho']) {
    for (const [q, y] of C[k]) {
      const key = k + '|' + q;
      if (old[key] && old[key].id) { out.push(old[key]); continue; }
      const m = await find(q, y);
      if (!m) { miss.push(q); out.push({ k, q, y, t: q, id: 0, p: '' }); continue; }
      const yy = parseInt(String(m.releaseDate || '').slice(0, 4), 10) || y;
      out.push({ k, q, y: yy, t: String(m.title || q).slice(0, 60), id: m.id, p: IMG.test(m.posterURL || '') ? m.posterURL.replace(/\/t\/p\/\w+\//, '/t/p/w342/') : '', s: typeof m.tmdbVoteAverage === 'number' ? Math.round(m.tmdbVoteAverage * 10) / 10 : null });
      process.stdout.write('.'); await sleep(150);
    }
  }
  fs.writeFileSync(OUT, '/* 管理人の鑑賞記録の候補（tools/build_watchlist.js が作る。候補を足すときは tools/movie_candidates.json に） */\nwindow.WATCHLIST = ' + JSON.stringify(out) + ';\n');
  console.log('\nwatchlist:', out.length, '本（洋画 ' + out.filter(m => m.k === 'yo').length + '・邦画 ' + out.filter(m => m.k === 'ho').length + '）', miss.length ? '見つからず: ' + miss.join('、') : '');
})();
