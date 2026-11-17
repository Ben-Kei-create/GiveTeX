/* 記事2本を PDF にする（教育用ダウンロードの「AI と作る開発ノート」用）
   使い方： サイトをローカルで配信した状態で  node tools/build_notes_pdf.js http://127.0.0.1:8787
   出力： downloads/src/*.pdf  → そのあと python3 tools/build_downloads.py */
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const base = process.argv[2] || 'http://127.0.0.1:8787';
  const b = await chromium.launch(); const p = await b.newPage();
  await p.route(/googletagmanager|google-analytics/, r => r.abort());
  for (const slug of ['ai-team-app-development', 'ai-book-illustration-rules']) {
    await p.goto(base + '/articles/' + slug + '.html', { waitUntil: 'networkidle' });
    // 印刷では、メニュー・流れる文字・フッターのバナー・固定ボタン・広告の枠を外して、白い紙に本文だけ
    await p.addStyleTag({ content: '.r-head,.r-foot,.pr-banner,.r-fixbtn,.gtx-bar,.gtm,.cta-box,template,.r-clap{display:none!important}html,body{background:#fff!important;color:#000!important}.win{box-shadow:none!important;background:#fff!important;padding:0!important;margin:0!important}.win-t,.win-menu,.win-status{display:none!important}.win-b{box-shadow:none!important;padding:0!important}.r-page,.r-layout,table.r-layout,td{max-width:none!important;width:auto!important}body{font-size:11pt!important;line-height:1.8!important}a{color:#000080!important}.gtx-rv{opacity:1!important;transform:none!important}' });
    await p.pdf({ path: path.join(__dirname, '..', 'downloads', 'src', slug + '.pdf'), format: 'A4', margin: { top: '16mm', bottom: '16mm', left: '16mm', right: '16mm' }, printBackground: false,
      displayHeaderFooter: true, headerTemplate: '<span></span>', footerTemplate: '<div style="font-size:8px;width:100%;text-align:center;color:#666">GiveTex — www.givetex.org　<span class="pageNumber"></span> / <span class="totalPages"></span></div>' });
    console.log('pdf', slug);
  }
  await b.close();
})();
