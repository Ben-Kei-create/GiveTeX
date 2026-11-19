// AI（さくらのAI Engine）に渡す「サイトの案内書き」と「本の一覧」を作る → api/_ai_context.js
// usage: node tools/build_ai_context.js   （build_index.js のあとに。サイトの中身が変わったら作り直す）
// 入れるのは公開しているページの名前・場所・ひとこと説明だけ。個人情報は入れない。
const fs = require('fs'), path = require('path');
const R = path.join(__dirname, '..');
global.window = {}; require(path.join(R, 'assets/site-index.js'));
const IDX = window.SITE_INDEX || [];
const BOOKS = JSON.parse(fs.readFileSync(path.join(__dirname, 'books_all.json'), 'utf8'));

const BOOTHS = [
  ['/', 'ホーム', '90年代風のホームページ。ゲームコーナー（ブロックおとし・うちゅうげきたい・クレーンゲーム・じゃんけん）、おみくじ、BGM、キリ番カウンター、名刺、左上の3D UFOキャッチャー、左下のお助けツール（手書きメモ・電卓）'],
  ['/apps/', 'アプリ', '管理人がつくった iPhone / Mac の学習アプリ'],
  ['/books/', 'ドパ読！', 'Kindle 電子書籍「30秒で読む」シリーズ（96冊）。神話・名作・人物・心理・科学・歴史'],
  ['/doron/', 'どろん', 'オカルトブース。座談会・心霊スポット巡り。百物語のろうそく'],
  ['/note/', 'note ブース', 'NingentteWinner の note の記事（AI・学び・エッセイ）と、TALES の連載小説「島の灯台と猫」'],
  ['/stamp/', 'スタンプブース', 'LINE スタンプを、チャット画面で fumi と送りあえる'],
  ['/game/', 'ゲームブース', 'unityroom のゲーム（umbrella lovers など）と、CPU と遊べるボードゲーム（将棋・囲碁・チェス・リバーシ・麻雀など9種）'],
  ['/game/board/', 'ボードゲーム', 'CPU と対戦できる将棋・囲碁・麻雀・チェス・リバーシ・五目ならべ・四目ならべ・チェッカー・マンカラ'],
  ['/museum/', '美術館', '所蔵品（本の表紙・スタンプ・ゲームの絵）を毎日9点ずつ展示'],
  ['/ramen/', 'ラーメン', '食べたラーメンを食券にして並べている。スクロールすると麺がのびる'],
  ['/movie/', '映画（C-Log Web）', '話題の映画と、だれでも匿名で書ける感想ノート'],
  ['/diary/', '開発日記', 'サイトやアプリづくりの記録'],
  ['/guestbook/', 'ゲストブック', '足あと帳。ひとこと残せる'],
  ['/links/', 'リンク集', ''], ['/contact/', 'お問い合わせ', ''], ['/about.html', '管理人のプロフィール', ''],
  ['/bookmarks/', '裏口（backstage）', 'ターミナル風のブックマーク集。download で学習用の教材 zip が手に入る'],
];
const apps = IDX.filter(x => x.k === 'アプリ' && x.u.startsWith('/')).map(x => x.t + '（' + x.u + '）');
const articles = IDX.filter(x => x.k === '記事').map(x => x.t + '（' + x.u + '）');

const site = [
  'GiveTex（ギブテックス）は「教育 × IT」の個人のホームページ。',
  '■ ブース（ページ）',
  ...BOOTHS.map(b => '- ' + b[1] + '：' + b[0] + (b[2] ? '　' + b[2] : '')),
  '■ アプリ', ...apps.map(a => '- ' + a),
  '■ 記事', ...articles.map(a => '- ' + a),
  '■ 小ネタ：ホームの窓は青いタイトルバーをつかむと動かせる。いちばん下に88×31のバナーがならんでいる。キリ番をふんだら名前を残せる。',
].join('\n');

const books = [];
Object.keys(BOOKS.books).forEach(g => BOOKS.books[g].forEach(b => books.push({ a: b[0], t: b[1], s: b[2] || '', g: (BOOKS.cats[g] || '').replace(/^\S+\s/, ''), c: b[3] || '' })));
const links = BOOTHS.map(b => b[0]).concat(IDX.filter(x => x.u.startsWith('/')).map(x => x.u.split('#')[0]));

const out = '/* AI に渡すサイトの案内書きと本の一覧（tools/build_ai_context.js が作る。手で書きかえない） */\n' +
  'module.exports = ' + JSON.stringify({ site: site, books: books, links: Array.from(new Set(links)) }) + ';\n';
fs.writeFileSync(path.join(R, 'api/_ai_context.js'), out);
console.log('ai context:', site.length, 'chars,', books.length, 'books,', new Set(links).size, 'links');
