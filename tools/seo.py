#!/usr/bin/env python3
"""検索エンジンと SNS 向けの仕上げ（何度実行しても同じ結果になります）。
使い方: python3 -I tools/seo.py [リポジトリのパス]   ※ build_retro.py のあとに実行
  1) 各ページの <head> に、シェア用画像（assets/og/*.jpg）と OGP / X(Twitter) カードを入れる
  2) note ブースの RSS（/note/feed.xml）を作る（開発日記の RSS は build_retro.py が作ります）
  3) sitemap.xml を作り直す（noindex のページ・note が本家の記事・非公開の創作ブースは入れない）"""
import html, json, pathlib, re, sys, datetime
R = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else pathlib.Path(__file__).resolve().parent.parent)
SITE = 'https://www.givetex.org'
X = lambda s: html.escape(str(s), quote=True)
# パスの先頭 → シェア用画像
OG = [('apps/', 'apps'), ('books/', 'books'), ('doron/', 'doron'), ('note/', 'note'), ('stamp/', 'stamp'), ('game/', 'game'), ('museum/', 'museum'),
      ('ramen/', 'ramen'), ('movie/', 'movie'), ('bookmarks/', 'bookmarks'), ('diary/', 'diary'), ('contact/', 'contact')]
FEEDS = {'index.html': [('note', '/note/feed.xml'), ('開発日記', '/diary/feed.xml')], 'note/index.html': [('note', '/note/feed.xml')], 'diary/index.html': [('開発日記', '/diary/feed.xml')]}

def js_json(path, var):
    t = (R / path).read_text(encoding='utf-8'); i = t.index('window.' + var + ' =') + len('window.' + var + ' =')
    return json.loads(t[i:].strip().rstrip(';'))

def pages():
    for p in sorted(R.rglob('*.html')):
        rel = p.relative_to(R).as_posix()
        if rel.split('/')[0] in ('.git', 'tools', 'api', 'node_modules') or rel.startswith('assets/'): continue
        yield p, rel

def meta(t, name):
    m = re.search(r'<meta (?:name|property)="' + re.escape(name) + r'" content="([^"]*)"', t); return html.unescape(m.group(1)) if m else ''

def og_block(t, rel, covers, book_covers={}):
    title = meta(t, 'og:title') or html.unescape((re.search(r'<title>(.*?)</title>', t, re.S) or [0, 'GiveTex'])[1].strip())
    desc = meta(t, 'og:description') or meta(t, 'description')
    canon = (re.search(r'<link rel="canonical" href="([^"]+)"', t) or [0, ''])[1]
    url = canon if canon.startswith(SITE) else SITE + '/' + (rel[:-10] if rel.endswith('index.html') else rel)
    img = next((f'/assets/og/{n}.jpg' for pre, n in OG if rel.startswith(pre)), '/assets/og/home.jpg')
    slug = rel[len('note/posts/'):-5] if rel.startswith('note/posts/') else ''
    if slug in covers: img = covers[slug]
    m = re.match(r'books/(\w+)\.html$', rel)
    if m and m.group(1) in book_covers: img = book_covers[m.group(1)]
    tags = []
    if not meta(t, 'og:title'): tags.append(f'<meta property="og:title" content="{X(title)}">')
    if not meta(t, 'og:description') and desc: tags.append(f'<meta property="og:description" content="{X(desc)}">')
    if not meta(t, 'og:type'): tags.append('<meta property="og:type" content="website">')
    if not meta(t, 'og:url'): tags.append(f'<meta property="og:url" content="{X(url)}">')
    tags += ['<meta property="og:site_name" content="GiveTex">', f'<meta property="og:image" content="{SITE}{img}">']
    if img.startswith('/assets/og/'): tags += ['<meta property="og:image:width" content="1200">', '<meta property="og:image:height" content="630">']
    tags += ['<meta name="twitter:card" content="summary_large_image">', f'<meta name="twitter:title" content="{X(title)}">']
    if desc: tags.append(f'<meta name="twitter:description" content="{X(desc[:200])}">')
    tags.append(f'<meta name="twitter:image" content="{SITE}{img}">')
    for label, href in FEEDS.get(rel, []): tags.append(f'<link rel="alternate" type="application/rss+xml" title="GiveTex {label}" href="{href}">')
    # ページの切りかえ・細かい動き（全ページ共通）
    tags += ['<link rel="stylesheet" href="/assets/gt-fx.css">', '<script src="/assets/gt-fx.js" defer></script>']
    if rel != 'index.html': tags.append('<script src="/assets/vfx.js" defer></script>')  # 作画エフェクト（ホームは対象外。90年代風ページでは何もしない）
    return '<!-- seo -->\n' + '\n'.join(tags) + '\n<!-- /seo -->'

def main():
    posts = js_json('note/posts.js', 'NOTE_POSTS')
    covers = {p['slug']: p['cover'].split('?')[0] for p in posts if p.get('cover', '').startswith('/')}
    BOOKS = json.loads((R / 'tools/books_all.json').read_text(encoding='utf-8'))['books']
    book_covers = {b[0]: b[3] for v in BOOKS.values() for b in v}
    n = 0; sm = []
    for p, rel in pages():
        t = p.read_text(encoding='utf-8')
        if '</head>' not in t: continue
        t2 = re.sub(r'\n?<!-- seo -->.*?<!-- /seo -->', '', t, flags=re.S)
        t2 = t2.replace('</head>', og_block(t2, rel, covers, book_covers) + '\n</head>', 1)
        if t2 != t: p.write_text(t2, encoding='utf-8'); n += 1
        noindex = re.search(r'<meta name="robots" content="[^"]*noindex', t2)
        canon = (re.search(r'<link rel="canonical" href="([^"]+)"', t2) or [0, ''])[1]
        if noindex or rel.startswith('sousaku/') or rel == '404.html' or '/_' in rel: continue
        if canon and not canon.startswith(SITE): continue  # note が本家の記事など
        loc = canon or SITE + '/' + (rel[:-10] if rel.endswith('index.html') else rel)
        pri = '1.0' if rel == 'index.html' else ('0.8' if rel.count('/') <= 1 else '0.5')
        sm.append(f'  <url><loc>{X(loc)}</loc><priority>{pri}</priority></url>')
    (R / 'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + '\n'.join(sorted(set(sm), key=lambda s: (s.count('0.5'), s))) + '\n</urlset>\n')
    # note の RSS（新しい30本）。リンクは note（本家）へ
    items = []
    for q in [p for p in posts if p.get('noteUrl')][:30]:
        dt = datetime.datetime.strptime(q['date'], '%Y-%m-%d').replace(hour=21, tzinfo=datetime.timezone(datetime.timedelta(hours=9)))
        enc = f'<enclosure url="{SITE}{X(q["cover"].split("?")[0])}" type="image/webp" length="0"/>' if q.get('cover', '').startswith('/') else ''
        items.append(f'<item><title>{X(q["title"])}</title><link>{X(q["noteUrl"])}</link><guid isPermaLink="true">{X(q["noteUrl"])}</guid><pubDate>{dt.strftime("%a, %d %b %Y %H:%M:%S +0900")}</pubDate>'
                     + ''.join(f'<category>{X(c)}</category>' for c in q.get('tags', [])) + f'<description>{X(q.get("excerpt", ""))}</description>{enc}</item>')
    (R / 'note' / 'feed.xml').write_text(f'''<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>
<title>NingentteWinner の note（GiveTex note ブース）</title><link>{SITE}/note/</link><description>NingentteWinner が note に書いた創作・エッセイの新着。</description><language>ja</language>
<atom:link href="{SITE}/note/feed.xml" rel="self" type="application/rss+xml"/>
{chr(10).join(items)}
</channel></rss>
''')
    print('head を更新:', n, '／ sitemap:', len(sm), 'ページ ／ note RSS:', len(items), '本')

if __name__ == '__main__': main()
