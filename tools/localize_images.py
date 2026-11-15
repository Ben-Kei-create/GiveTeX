#!/usr/bin/env python3
"""外部の画像（note・Amazon・LINE スタンプ）を自サイトに保存して、URL を書きかえる。
何度実行しても大丈夫（保存ずみの画像はダウンロードしない）。
使い方:  <Pillow が入った python> -I tools/localize_images.py [リポジトリのパス]
  - 画像は /assets/ext/<種類>/<ハッシュ>.webp（アニメーションは元の形式のまま）
  - 取れなかった画像は元の URL のまま（ページ側の img-fallback.js が NO IMAGE にする）
  - 対応表は tools/ext_images.json
"""
import concurrent.futures as cf, hashlib, io, json, pathlib, re, sys, urllib.request
from PIL import Image

R = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else pathlib.Path(__file__).resolve().parent.parent)
MAP = R / 'tools' / 'ext_images.json'
HOSTS = {'assets.st-note.com': ('note', 960), 'm.media-amazon.com': ('amazon', 400), 'stickershop.line-scdn.net': ('line', 480)}
URL = re.compile(r'https://(assets\.st-note\.com|m\.media-amazon\.com|stickershop\.line-scdn\.net)/[^"\'\s)<>\\]+')
SKIP = {'.git', 'node_modules', 'api', 'assets/ext', '.note-cache'}

def files():
    for p in R.rglob('*'):
        rel = p.relative_to(R).as_posix()
        if any(rel == s or rel.startswith(s + '/') for s in SKIP): continue
        if rel.startswith('tools/') and rel != 'tools/books_all.json': continue
        if p.is_file() and p.suffix in ('.html', '.js', '.json', '.xml'): yield p

def fetch(url):
    kind, maxw = HOSTS[url.split('/')[2]]
    h = hashlib.sha1(url.encode()).hexdigest()[:16]
    d = R / 'assets' / 'ext' / kind; d.mkdir(parents=True, exist_ok=True)
    for ext in ('.webp', '.png', '.gif', '.jpg'):
        if (d / (h + ext)).exists(): return url, f'/assets/ext/{kind}/{h}{ext}'
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (GiveTex image backup)'})
        data = urllib.request.urlopen(req, timeout=30).read()
        im = Image.open(io.BytesIO(data))
        if getattr(im, 'is_animated', False):
            ext = '.gif' if im.format == 'GIF' else '.png'
            (d / (h + ext)).write_bytes(data)
        else:
            ext = '.webp'
            im = im.convert('RGBA' if im.mode in ('RGBA', 'LA', 'P') else 'RGB')
            if im.width > maxw: im = im.resize((maxw, round(im.height * maxw / im.width)), Image.LANCZOS)
            im.save(d / (h + ext), 'WEBP', quality=78, method=6)
        return url, f'/assets/ext/{kind}/{h}{ext}'
    except Exception as e:
        print('  x', url[:90], type(e).__name__, file=sys.stderr)
        return url, None

def base(u):
    # note の画像は ?width=… などの違いを同じ画像としてあつかう
    return u.split('?')[0] if u.startswith('https://assets.st-note.com/') else u

def main():
    mp = json.loads(MAP.read_text()) if MAP.exists() else {}
    texts = {p: p.read_text(encoding='utf-8') for p in files()}
    byb = {base(k): v for k, v in mp.items()}
    found = {m.group(0) for t in texts.values() for m in URL.finditer(t)}
    for u in found:
        if u not in mp and base(u) in byb: mp[u] = byb[base(u)]
    todo = {}
    for u in sorted(found - set(mp)):
        b = base(u); todo.setdefault(b, []).append(u)
    print('新しく保存する画像:', len(todo))
    def one(b):
        src = b + '?width=1200' if b.startswith('https://assets.st-note.com/') and '?' not in b else todo[b][0]
        return b, fetch(src)[1]
    with cf.ThreadPoolExecutor(8) as ex:
        for b, local in ex.map(one, list(todo)):
            if local:
                for u in todo[b]: mp[u] = local
    MAP.write_text(json.dumps(mp, ensure_ascii=False, indent=0, sort_keys=True))
    changed = 0
    for p, t in texts.items():
        n = URL.sub(lambda m: mp.get(m.group(0), m.group(0)), t)
        if n != t: p.write_text(n, encoding='utf-8'); changed += 1
    print('書きかえたファイル:', changed, '／ 対応表:', len(mp))

if __name__ == '__main__': main()
