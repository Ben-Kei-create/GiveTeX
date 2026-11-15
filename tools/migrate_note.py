"""note (benkein) の記事を GiveTex の note ブースへ移植する。
usage: python3 -I migrate_note.py <note_dir(index.json, body/)> <repo>"""
import sys, json, re, html, pathlib
from html.parser import HTMLParser
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import build_note  # noqa: E402

D = pathlib.Path(sys.argv[1]); R = pathlib.Path(sys.argv[2])
INDEX = json.load(open(D / 'index.json'))
KEYS = {v['key'] for v in INDEX}
TITLE = {v['key']: v['title'] for v in INDEX}
E = html.escape

ALLOWED = {'p', 'br', 'h2', 'h3', 'h4', 'figure', 'figcaption', 'img', 'a', 'b', 'strong', 'em', 'i', 's', 'u',
           'blockquote', 'ul', 'ol', 'li', 'pre', 'code', 'hr', 'ruby', 'rt', 'rp', 'table', 'thead', 'tbody',
           'tr', 'th', 'td', 'sup', 'sub'}
VOID = {'br', 'img', 'hr'}
NOTE_POST = re.compile(r'https?://note\.com/benkein/n/(n[0-9a-f]+)')

def local(url):
    m = NOTE_POST.match(url or '')
    if m and m.group(1) in KEYS:
        return f'/note/posts/{m.group(1)}.html'
    return None

class Clean(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.out = []; self.stack = []; self.skip = 0; self.text_seen = 0
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if self.skip:
            if tag not in VOID: self.skip += 1
            return
        if tag == 'figure' and a.get('embedded-service'):
            url = a.get('data-src') or ''
            svc = a.get('embedded-service')
            loc = local(url)
            if loc:
                label = '📄 ' + TITLE.get(NOTE_POST.match(url).group(1), 'note の記事')
                self.out.append(f'<p class="note-embed"><a href="{E(loc)}">{E(label)}</a></p>')
            elif url:
                label = {'youtube': '▶ YouTube', 'twitter': '𝕏 ポスト', 'note': '📄 note'}.get(svc, '🔗 リンク')
                self.out.append(f'<p class="note-embed"><a href="{E(url)}" target="_blank" rel="noopener">{label}：{E(url)}</a></p>')
            self.skip = 1
            return
        if tag not in ALLOWED:
            return
        attr = ''
        if tag == 'a':
            href = a.get('href') or ''
            loc = local(href)
            if loc: attr = f' href="{E(loc)}"'
            elif href.startswith(('http://', 'https://', 'mailto:')): attr = f' href="{E(href)}" target="_blank" rel="noopener"'
        elif tag == 'img':
            src = a.get('src') or ''
            if not src.startswith('https://'): return
            if 'assets.st-note.com' in src and '?' not in src: src += '?width=1200'
            w, h = a.get('width'), a.get('height')
            wh = f' width="{E(w)}" height="{E(h)}"' if (w or '').isdigit() and (h or '').isdigit() else ''
            attr = f' src="{E(src)}" alt="{E(a.get("alt") or "")}"{wh} loading="lazy" decoding="async"'
        self.out.append(f'<{tag}{attr}>')
        if tag not in VOID: self.stack.append(tag)
    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
    def handle_endtag(self, tag):
        if self.skip:
            if tag not in VOID: self.skip -= 1
            return
        if tag in ALLOWED and tag not in VOID and tag in self.stack:
            while self.stack:
                t = self.stack.pop(); self.out.append(f'</{t}>')
                if t == tag: break
    def handle_data(self, data):
        if self.skip: return
        self.out.append(E(data, quote=False))
    def result(self):
        while self.stack: self.out.append(f'</{self.stack.pop()}>')
        s = ''.join(self.out)
        s = re.sub(r'<p>\s*(<br>\s*)*</p>', '', s)          # 空の段落
        s = re.sub(r'(<br>\s*){3,}', '<br><br>', s)          # 連続改行を整理
        s = re.sub(r'<figure>\s*</figure>', '', s)
        return s

def plain(s):
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', s))).strip()

posts = []; missing = []; paid = 0
# 本文が取れなかった記事は、前回のデータをそのまま残す（記事が消えないように）
try:
    _t = (R / 'note/posts.js').read_text(); OLD = {p['slug']: p for p in json.loads(_t[_t.index('window.NOTE_POSTS =') + 19:].strip().rstrip(';'))}
except Exception:
    OLD = {}
for v in sorted(INDEX, key=lambda x: x['date'], reverse=True):
    k = v['key']; f = D / 'body' / f'{k}.json'
    try:
        d = json.load(open(f))['data']
    except Exception:
        missing.append(k)
        if k in OLD and (R / 'note/posts' / f'{k}.html').exists(): posts.append(OLD[k])
        continue
    c = Clean(); c.feed(d.get('body') or ''); prose = c.result()
    date = v['date'][:10]
    tags = []
    for h in (d.get('hashtag_notes') or []):
        t = ((h.get('hashtag') or {}).get('name') or '').lstrip('#').strip()
        if t and t not in tags: tags.append(t)
    tags = tags[:8]
    is_paid = bool(v.get('price'))
    excerpt = (v.get('desc') or '').strip() or plain(prose)[:110]
    if len(excerpt) > 110: excerpt = excerpt[:108] + '…'
    after = ''
    if is_paid:
        paid += 1
        after = f'''
    <div class="nb-paid"><b>ここから先は note の有料部分です</b><span>続きは note で公開しています（{int(v["price"])}円）。</span><a class="nb-btn primary" href="{E(v["url"])}" target="_blank" rel="noopener">note で続きを読む ↗</a></div>'''
    if not plain(prose):
        prose = '<p class="center">（本文は note でお読みください）</p>'
    build_note.article(k, v['title'], date, tags, prose, excerpt, after=after, canonical=v['url'])  # note が本家
    cover = v.get('eyecatch')
    posts.append(dict(slug=k, title=v['title'], date=date, excerpt=excerpt, tags=tags,
                      cover=(cover + '?width=360') if cover else None, noteUrl=v['url'], paid=is_paid or None))

# 案内記事（ブース独自）を残す
posts.append(dict(slug='about-this-booth', title='note ブースをはじめます', date='2026-11-15',
                  excerpt='note で書いてきたものを、ここにも置いていくことにしました。このブースの読み方と、これからのことを少しだけ。', tags=['お知らせ']))
posts.sort(key=lambda p: p['date'], reverse=True)
for p in posts:
    for k in [k for k, val in p.items() if val is None]: del p[k]

js_path = R / 'note/posts.js'
head = js_path.read_text().split('window.NOTE_POSTS')[0]
js_path.write_text(head + 'window.NOTE_POSTS = ' + json.dumps(posts, ensure_ascii=False, indent=1) + ';\n')
print('posts', len(posts), 'paid', paid, 'missing', missing)
