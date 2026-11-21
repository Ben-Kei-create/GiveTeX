// サイト内検索の索引（/assets/site-index.js）を作る。usage: node tools/build_index.js
const fs = require('fs'), path = require('path'), vm = require('vm');
const R = path.resolve(__dirname, '..');
function load(file) { const ctx = { window: {} }; vm.runInNewContext(fs.readFileSync(path.join(R, file), 'utf8'), ctx); return ctx.window; }
const out = [];
const add = (t, u, k, extra) => { if (t && u) out.push(Object.assign({ t: String(t).trim(), u, k }, extra || {})); };
// ブース
[['アプリ', '/apps/'], ['ドパ読！（Kindle）', '/books/'], ['どろん（オカルト）', '/doron/'], ['note ブース', '/note/'], ['スタンプブース', '/stamp/'],
 ['ゲームブース', '/game/'], ['美術館ブース', '/museum/'], ['ラーメンブース', '/ramen/'], ['素カフェ（素材カフェ）', '/socafe/'], ['映画ブース C-Log', '/movie/'], ['開発日記', '/diary/'], ['プロフィール', '/about.html']]
  .forEach(([t, u]) => add(t, u, 'ブース'));
// アプリ（HTML の <title> と App Store）
fs.readdirSync(path.join(R, 'apps')).forEach(d => {
  const f = path.join(R, 'apps', d, 'index.html'); if (!fs.existsSync(f)) return;
  const m = fs.readFileSync(f, 'utf8').match(/<title>([^<|]+)/); if (m) add(m[1], `/apps/${d}/`, 'アプリ');
});
add('AWSTUDY(CLF)', 'https://apps.apple.com/jp/app/id6819971113', 'アプリ'); add('PokePhysics', 'https://apps.apple.com/jp/app/id6778082145', 'アプリ');
// ドパ読！（Kindle）
const books = JSON.parse(fs.readFileSync(path.join(__dirname, 'books_all.json'), 'utf8'));
Object.values(books.books).forEach(list => list.forEach(([asin, title, sub]) => add(title + (sub ? '：' + sub : ''), `https://www.amazon.co.jp/dp/${asin}`, 'Kindle')));
// note・TALES
const note = load('note/posts.js');
(note.NOTE_POSTS || []).forEach(p => add(p.title, `/note/posts/${p.slug}.html`, 'note', { d: p.date }));
((note.NOTE_CONFIG || {}).tales || []).forEach(w => { add(w.title, w.url, 'TALES'); (w.episodes || []).forEach((e, i) => add(`${w.title} 第${i + 1}話「${e.t.replace(/^第\d+話「(.*)」$/, '$1')}」`, e.url, 'TALES', { d: e.date })); });
// LINE スタンプ
const st = load('stamp/stamps.js'); ((st.STAMP || {}).sets || []).forEach(s => add(s.title, s.storeUrl, 'LINEスタンプ'));
// 記事
fs.readdirSync(path.join(R, 'articles')).forEach(f => { const m = fs.readFileSync(path.join(R, 'articles', f), 'utf8').match(/<title>([^<]+)/); if (m) add(m[1].replace(/\s*\|\s*GiveTex\s*$/, ''), `/articles/${f}`, '記事'); });
fs.writeFileSync(path.join(R, 'assets/site-index.js'), '/* サイト内検索の索引（tools/build_index.js で生成） */\nwindow.SITE_INDEX = ' + JSON.stringify(out) + ';\n');
const c = {}; out.forEach(x => c[x.k] = (c[x.k] || 0) + 1); console.log(out.length, c);
