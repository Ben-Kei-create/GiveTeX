#!/usr/bin/env python3
"""ドパ読！の本ごとのページ（/books/<ASIN>.html）を作る。何度実行しても同じ結果。
使い方: python3 -I tools/build_books_pages.py [リポジトリのパス]
  - データは tools/books_all.json（cats と books）
  - 見た目は books/index.html のヘッダー・フッター・pop.css をそのまま使う
  - books/index.html の本のリンクも、Amazon 直行ではなく本ごとのページに向けかえる"""
import html, json, pathlib, re, sys
R = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else pathlib.Path(__file__).resolve().parent.parent)
E = lambda s: html.escape(str(s), quote=True)
D = json.loads((R / 'tools/books_all.json').read_text(encoding='utf-8'))
idx = (R / 'books/index.html').read_text(encoding='utf-8')
head_common = idx[:idx.index('<title>')]
head_tail = idx[idx.index('<script src="/assets/ga.js" defer></script>'):idx.index('<!-- seo -->')]
header = idx[idx.index('<body>'):idx.index('<main')].replace(' aria-current="page"', '').replace('<a href="/books/">ドパ読！</a>', '<a href="/books/" aria-current="page">ドパ読！</a>')
footer = idx[idx.index('</main>') + len('</main>'):]
CATN = {k: re.sub(r'^\S+\s', '', v) for k, v in D['cats'].items()}  # 絵文字を外したジャンル名

def card(b):
    a, t, s, img = b
    return f'<a class="kb" href="/books/{a}.html"><span class="kb-cover"><img src="{E(img)}" alt="{E(t)}の表紙" loading="lazy" width="146" height="218"></span><b>{E(t)}</b><small>{E(s)}</small></a>'

n = 0
for cat, books in D['books'].items():
    for i, b in enumerate(books):
        a, t, s, img = b
        prev_b = books[i - 1] if i > 0 else None
        next_b = books[i + 1] if i + 1 < len(books) else None
        others = [x for x in books if x[0] != a][:8]
        amz = f'https://www.amazon.co.jp/dp/{a}'
        desc = f'Kindle電子書籍「{t}」— {s}。NingentteWinner の「30秒で読む」シリーズ（ドパ読！）。1話30秒、全10話で読める{CATN[cat]}の本。'
        ld = json.dumps({'@context': 'https://schema.org', '@type': 'Book', 'name': t, 'author': {'@type': 'Person', 'name': 'NingentteWinner'},
                         'bookFormat': 'https://schema.org/EBook', 'inLanguage': 'ja', 'image': 'https://www.givetex.org' + img, 'url': f'https://www.givetex.org/books/{a}.html',
                         'genre': CATN[cat], 'description': s, 'isPartOf': {'@type': 'BookSeries', 'name': '30秒で読む（ドパ読！）'}, 'sameAs': amz}, ensure_ascii=False)
        nav = ''
        if prev_b: nav += f'<a class="bk-nav prev" href="/books/{prev_b[0]}.html">‹ {E(prev_b[1])}</a>'
        if next_b: nav += f'<a class="bk-nav next" href="/books/{next_b[0]}.html">{E(next_b[1])} ›</a>'
        doc = f'''{head_common}<title>{E(t)} | ドパ読！ | GiveTex</title>
<meta name="description" content="{E(desc)}">
<link rel="canonical" href="https://www.givetex.org/books/{a}.html">
<meta property="og:title" content="{E(t)} | ドパ読！">
<meta property="og:type" content="book">
<script type="application/ld+json">{ld}</script>
{head_tail}</head>
{header}<main class="page" style="max-width:1080px">
  <p class="crumbs"><a href="/">GiveTex</a> › <a href="/books/">ドパ読！</a> › <a href="/books/#{cat}">{E(CATN[cat])}</a></p>
  <article class="bk">
    <div class="bk-cover"><img src="{E(img)}" alt="{E(t)}の表紙" width="300" height="450"></div>
    <div class="bk-tx">
      <p class="dopa-kicker">Kindle電子書籍 ／ {E(CATN[cat])}</p>
      <h1 class="bk-title">{E(t)}</h1>
      <p class="bk-catch">{E(s)}</p>
      <ul class="bk-meta"><li><b>シリーズ</b>30秒で読む（ドパ読！）</li><li><b>著者</b>NingentteWinner</li><li><b>読みかた</b>1話30秒 × 10話</li><li><b>形式</b>Kindle 電子書籍（日本語）</li></ul>
      <p><a class="btn btn-y bk-buy" href="{amz}" target="_blank" rel="noopener" data-book="{a}">Amazon で見る ↗</a></p>
      <p class="bk-note">Kindle Unlimited の対象かどうか・価格は、Amazon のページでご確認ください。</p>
    </div>
  </article>
  <nav class="bk-pager" aria-label="同じジャンルの前後の本">{nav}</nav>
  <section class="sec">
    <h2 class="sec-t">{E(CATN[cat])}の、ほかの本</h2>
    <div class="shelf">{''.join(card(x) for x in others)}</div>
    <p style="margin-top:18px"><a class="btn" href="/books/">ドパ読！ ぜんぶの本（{sum(len(v) for v in D['books'].values())}冊）へ</a></p>
  </section>
</main>{footer}'''
        out = R / 'books' / f'{a}.html'
        if not out.exists() or out.read_text(encoding='utf-8') != doc: out.write_text(doc, encoding='utf-8'); n += 1

# 一覧のリンクを本ごとのページへ
new_idx = re.sub(r'<a class="kb" href="https://www\.amazon\.co\.jp/dp/(\w+)" target="_blank" rel="noopener">', r'<a class="kb" href="/books/\1.html">', idx)
if new_idx != idx: (R / 'books/index.html').write_text(new_idx, encoding='utf-8')
print('本のページ:', sum(len(v) for v in D['books'].values()), '冊（更新', n, '）')
