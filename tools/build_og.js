/* シェア用画像（OGP, 1200×630）を、各ブースの実際の見た目から作る
   使い方：サイトをローカルで配信した状態で  node tools/build_og.js http://127.0.0.1:8787
   → assets/og/<名前>.jpg（このあと tools/seo.py が各ページの <head> に入れます） */
const { chromium } = require('playwright');
const path = require('path');
const BASE = process.argv[2] || 'http://127.0.0.1:8787';
const PAGES = [['home','/'],['apps','/apps/'],['books','/books/'],['doron','/doron/'],['note','/note/'],['stamp','/stamp/'],['game','/game/'],['museum','/museum/'],['ramen','/ramen/'],['movie','/movie/'],['bookmarks','/bookmarks/'],['diary','/diary/'],['contact','/contact/']];
(async () => {
  const b = await chromium.launch();
  for (const [n, u] of PAGES) {
    const p = await b.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
    await p.route(/googletagmanager|google-analytics|\/api\//, r => r.abort());
    await p.goto(BASE + u, { waitUntil: 'networkidle' }); await p.waitForTimeout(2500);
    await p.screenshot({ path: path.join(__dirname, '..', 'assets', 'og', n + '.jpg'), type: 'jpeg', quality: 82 });
    await p.close(); console.log('og', n);
  }
  await b.close();
})();
