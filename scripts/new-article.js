#!/usr/bin/env node
/**
 * New article scaffold generator
 * Usage: node scripts/new-article.js <slug> "<title>" "<description>"
 *
 * Example:
 *   node scripts/new-article.js progate-udemy-comparison "Progate vs Udemy vs paiza｜初心者向けプログラミング学習サービス比較" "Progate・Udemy・paizaを実際に使って比較。初心者にはどれがベスト？"
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error('Usage: node scripts/new-article.js <slug> "<title>" ["<description>"]');
  process.exit(1);
}

const [slug, title, description = ''] = args;
const SITE_URL = 'https://givetex.org';
const ROOT = path.resolve(__dirname, '..');
const OUTPUT = path.join(ROOT, 'articles', slug + '.html');

if (fs.existsSync(OUTPUT)) {
  console.error('Error: ' + OUTPUT + ' already exists.');
  process.exit(1);
}

const now = new Date();
const todayDot = now.toISOString().split('T')[0].replace(/-/g, '.');
const todayDash = now.toISOString().split('T')[0];

const lines = [
  '<!DOCTYPE html>',
  '<html lang="ja">',
  '<head>',
  '<meta charset="UTF-8">',
  '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
  '<title>' + title + ' | GiveTex</title>',
  '<meta name="description" content="' + description + '">',
  '<meta property="og:title" content="' + title + '">',
  '<meta property="og:description" content="' + description + '">',
  '<meta property="og:type" content="article">',
  '<meta property="og:url" content="' + SITE_URL + '/articles/' + slug + '.html">',
  '<meta property="og:locale" content="ja_JP">',
  '<link rel="canonical" href="' + SITE_URL + '/articles/' + slug + '.html">',
  '<link rel="preconnect" href="https://fonts.googleapis.com">',
  '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
  '<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;900&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">',
  '<link rel="stylesheet" href="/styles/common.css">',
  '<link rel="stylesheet" href="/styles/article.css">',
  '',
  '<!-- JSON-LD -->',
  '<script type="application/ld+json">',
  '{',
  '  "@context": "https://schema.org",',
  '  "@type": "Article",',
  '  "headline": "' + title + '",',
  '  "author": { "@type": "Person", "name": "GiveTex\u7de8\u96c6\u90e8" },',
  '  "datePublished": "' + todayDash + '",',
  '  "dateModified": "' + todayDash + '",',
  '  "publisher": { "@type": "Organization", "name": "GiveTex" },',
  '  "description": "' + description + '"',
  '}',
  '</script>',
  '',
  '<!-- Google Analytics 4 -->',
  '<script async src="https://www.googletagmanager.com/gtag/js?id=G-RJ2BPF1RLV"></script>',
  '<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag(\'js\',new Date());gtag(\'config\',\'G-RJ2BPF1RLV\');</script>',
  '',
  '</head>',
  '<body>',
  '',
  '<div class="pr-banner">\u5f53\u30b5\u30a4\u30c8\u306f\u30a2\u30d5\u30a3\u30ea\u30a8\u30a4\u30c8\u5e83\u544a\u3092\u5229\u7528\u3057\u3066\u3044\u307e\u3059</div>',
  '',
  '<header>',
  '  <div class="header-inner">',
  '    <a href="/" class="logo">Give<span>Tex</span></a>',
  '    <nav>',
  '      <a href="/">\u8a18\u4e8b\u4e00\u89a7</a>',
  '      <a href="/about.html">\u3053\u306e\u30b5\u30a4\u30c8\u306b\u3064\u3044\u3066</a>',
  '      <a href="/privacy.html">\u30d7\u30e9\u30a4\u30d0\u30b7\u30fc\u30dd\u30ea\u30b7\u30fc</a>',
  '    </nav>',
  '  </div>',
  '</header>',
  '',
  '<article class="article">',
  '',
  '  <div class="article-meta">',
  '    <span>' + todayDot + '</span>',
  '    <span>X min read</span>',
  '  </div>',
  '',
  '  <h1>' + title + '</h1>',
  '',
  '  <div style="margin-bottom:1.5rem">',
  '    <span class="tag">TAG1</span>',
  '    <span class="tag">TAG2</span>',
  '  </div>',
  '',
  '  <p class="article-lead"><!-- \u30ea\u30fc\u30c9\u6587\u3092\u3053\u3053\u306b --></p>',
  '',
  '  <nav class="toc">',
  '    <div class="toc-title">\u3053\u306e\u8a18\u4e8b\u306e\u5185\u5bb9</div>',
  '    <ol>',
  '      <li><a href="#section1">\u30bb\u30af\u30b7\u30e7\u30f31</a></li>',
  '      <li><a href="#section2">\u30bb\u30af\u30b7\u30e7\u30f32</a></li>',
  '      <li><a href="#verdict">\u307e\u3068\u3081</a></li>',
  '    </ol>',
  '  </nav>',
  '',
  '  <h2 id="section1">\u30bb\u30af\u30b7\u30e7\u30f31</h2>',
  '  <p><!-- \u672c\u6587 --></p>',
  '',
  '  <h2 id="section2">\u30bb\u30af\u30b7\u30e7\u30f32</h2>',
  '  <p><!-- \u672c\u6587 --></p>',
  '',
  '  <h2 id="verdict">\u307e\u3068\u3081</h2>',
  '  <p><!-- \u672c\u6587 --></p>',
  '',
  '  <a href="/" class="back-home">\u2190 \u8a18\u4e8b\u4e00\u89a7\u306b\u623b\u308b</a>',
  '',
  '</article>',
  '',
  '<footer>',
  '  <p>&copy; 2026 GiveTex. All rights reserved.</p>',
  '  <div class="legal-links">',
  '    <a href="/privacy.html">\u30d7\u30e9\u30a4\u30d0\u30b7\u30fc\u30dd\u30ea\u30b7\u30fc</a>',
  '    <a href="/about.html">\u904b\u55b6\u8005\u60c5\u5831</a>',
  '  </div>',
  '</footer>',
  '',
  '</body>',
  '</html>',
  ''
];

fs.writeFileSync(OUTPUT, lines.join('\n'), 'utf-8');
console.log('Created: ' + OUTPUT);
console.log('Next steps:');
console.log('  1. Edit the article content');
console.log('  2. Run: node scripts/update-sitemap.js');
console.log('  3. Add the article card to index.html');
