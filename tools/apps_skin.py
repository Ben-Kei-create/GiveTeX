import re, sys, pathlib, html
R = pathlib.Path(sys.argv[1])
STORE = {'ionstep':'6821881917','heydrum':'6824921157','linatex':'6775100355','onitan':'6760243558','beerquiz':'6759665291'}
FONTS = '<link href="https://fonts.googleapis.com/css2?family=Fjalla+One&amp;family=WDXL+Lubrifont+JP+N&amp;display=swap" rel="stylesheet">'
HEADEXTRA = '''<meta name="theme-color" content="#ffffff">
<script>(function(){try{var t=localStorage.getItem('givetex-apps-theme');if(t==='dark'||t==='light')document.documentElement.setAttribute('data-theme',t)}catch(e){}})()</script>
<link rel="stylesheet" href="/apps/assets/apps.css">
<script src="/apps/assets/apps.js" defer></script>
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/assets/icon/favicon-32.png">
<link rel="apple-touch-icon" href="/assets/icon/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<script src="/assets/ga.js" defer></script>'''
SUN = '<svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6"/></svg>'
MOON = '<svg class="moon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.5 14.6A8.5 8.5 0 0 1 9.4 3.5a8.5 8.5 0 1 0 11.1 11.1z"/></svg>'
def nav():
    return f'''<nav class="ax-nav" aria-label="GiveTex Apps">
  <div class="ax-nav-in">
    <a class="ax-brand" href="/apps/">GiveTex <span>Apps</span></a>
    <div class="ax-links"><a href="/apps/">すべてのアプリ</a><a class="opt" href="/apps/#released">公開中</a><a href="/">GiveTex ホーム</a></div>
    <button class="ax-theme" type="button" aria-label="表示モードを切り替え">{SUN}{MOON}</button>
  </div>
</nav>'''
FOOT = '''<footer class="ax-foot">
  <div class="ax-foot-in">
    <nav aria-label="フッター"><a href="/apps/">すべてのアプリ</a><a href="/">GiveTex ホーム</a><a href="/about.html">運営者情報</a><a href="/privacy.html">サイトのプライバシーポリシー</a></nav>
    <p>Copyright © 2026 GiveTex. All rights reserved.</p>
  </div>
</footer>'''
def subnav(slug, name, cur):
    links = [('', '概要'), ('support/', 'サポート'), ('privacy/', 'プライバシー')]
    a = ''.join(f'<a href="/apps/{slug}/{p}"{" aria-current=\"page\"" if p == cur else ""}>{t}</a>'.replace('\\"', '"') for p, t in links)
    if slug in STORE:
        a += f'<a href="https://apps.apple.com/jp/app/id{STORE[slug]}" target="_blank" rel="noopener">入手</a>'
    return f'''<nav class="ax-sub" aria-label="{html.escape(name)}">
  <div class="ax-sub-in"><a class="ax-sub-name" href="/apps/{slug}/">{html.escape(name)}</a><div class="ax-sub-links">{a}</div></div>
</nav>'''
def convert(p, sub):
    s = p.read_text(); o = s
    s = re.sub(r'^<!DOCTYPE[^>]*>', '<!DOCTYPE html>', s, count=1)
    s = re.sub(r'<link href="https://fonts.googleapis.com/css2\?family=DotGothic16[^"]*" rel="stylesheet">', FONTS, s, count=1)
    s = s.replace('<link rel="stylesheet" type="text/css" href="/assets/retro.css">\n', '').replace('<script type="text/javascript" src="/assets/retro.js"></script>\n', '')
    s = s.replace('</head>', HEADEXTRA + '\n</head>', 1)
    s = re.sub(r'<a name="top" id="top"></a>\s*<div class="r-head">.*?</div>\s*</div>\n', nav() + ('\n' + sub if sub else '') + '\n', s, count=1, flags=re.S)
    s = re.sub(r'<div class="r-foot">.*?</address>\s*</div>', FOOT, s, count=1, flags=re.S)
    s = re.sub(r'<p class="crumbs">.*?</p>\n?', '', s, count=1)
    for bad in ['retro.', 'r-head', 'r-foot', 'DotGothic']:
        if bad in s: print('LEFTOVER', p, bad)
    p.write_text(s); return s != o
n = 0
for d in sorted((R/'apps').iterdir()):
    if not d.is_dir() or d.name == 'assets': continue
    idx = (d/'index.html').read_text()
    m = re.search(r'<h1[^>]*>(.*?)</h1>', idx, re.S)
    name = re.sub('<[^>]+>', '', m.group(1)).strip() if m else re.search(r'<title>(.*?)</title>', idx).group(1).split(' | ')[0].strip()
    for rel, cur in [('index.html', ''), ('support/index.html', 'support/'), ('privacy/index.html', 'privacy/')]:
        f = d/rel
        if f.exists(): n += convert(f, subnav(d.name, name, cur))
print('converted', n)
