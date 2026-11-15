import re, sys, pathlib
R = pathlib.Path(sys.argv[1])
idx = (R/'index.html').read_text()
HEADER = idx[idx.index('<a name="top"'):idx.index('<table class="r-layout"')].rstrip().replace(' aria-current="page"', '')
FOOTER = idx[idx.index('<div class="r-foot">'):idx.index('</body>')].rstrip()
FONTS = '<link href="https://fonts.googleapis.com/css2?family=DotGothic16&amp;family=VT323&amp;display=swap" rel="stylesheet">'
DOCTYPE = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">'
skip = {'index.html', 'about.html', 'apps/index.html', 'books/index.html', 'diary/index.html'}
n = 0
for p in sorted(R.rglob('*.html')):
    rel = p.relative_to(R).as_posix()
    if '.git' in p.parts or rel in skip or rel.startswith('doron/'): continue
    s = p.read_text(); o = s
    s = re.sub(r'^<!DOCTYPE html>', DOCTYPE, s, count=1, flags=re.I)
    s = re.sub(r'<header class="hd">.*?</header>', HEADER, s, count=1, flags=re.S)
    s = re.sub(r'<footer class="ft">.*?</footer>', FOOTER, s, count=1, flags=re.S)
    s = re.sub(r'<link href="https://fonts.googleapis.com/css2\?family=Dela[^"]*" rel="stylesheet">', FONTS, s, count=1)
    s = s.replace('<link rel="stylesheet" href="/assets/pop.css">', '<link rel="stylesheet" type="text/css" href="/assets/retro.css">\n<script type="text/javascript" src="/assets/retro.js"></script>')
    s = s.replace('<link rel="stylesheet" href="/apps/assets/apps.css">\n', '').replace('<link rel="stylesheet" href="/apps/assets/apps.css">', '')
    if rel.startswith('apps/'):
        s = s.replace('<a href="/apps/">アプリ</a>', '<a href="/apps/" aria-current="page">アプリ</a>', 1)
    elif rel.startswith('articles/'):
        s = s.replace('<a href="/#articles">記事</a>', '<a href="/#articles" aria-current="page">記事</a>', 1)
    if s != o: p.write_text(s); n += 1
    for bad in ['class="hd"', 'class="ft"', 'pop.css', 'apps.css']:
        if bad in s: print('LEFTOVER', rel, bad)
print('skinned', n)
