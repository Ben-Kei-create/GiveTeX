#!/usr/bin/env python3
"""LINE スタンプの新作と、TALES の新しい話を取りに行って、データファイルに足す。
使い方: python3 -I tools/update_feeds.py [リポジトリのパス]
  - stamp/stamps.js … LINE STORE の作者ページにある、まだ載っていないセットを末尾に追加
  - note/posts.js   … NOTE_CONFIG.tales の各作品の episodes を、TALES の作品ページの一覧で更新
画像は外部 URL のまま入るので、このあと tools/localize_images.py で自サイトに保存します。
取得に失敗したときは、何も書きかえずに終わります（壊さない）。"""
import html, json, pathlib, re, sys, time, urllib.request

R = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else pathlib.Path(__file__).resolve().parent.parent)
UA = {'User-Agent': 'Mozilla/5.0 (GiveTex site updater)', 'Accept-Language': 'ja'}

def get(url):
    time.sleep(1.0)  # 相手に負荷をかけない
    return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30).read().decode('utf-8', 'replace')

def stamps():
    p = R / 'stamp' / 'stamps.js'; s = p.read_text(encoding='utf-8')
    i = s.index('window.STAMP'); head, body = s[:i], s[i:]
    data = json.loads(body[body.index('{'):body.rindex('}') + 1])
    have = {x['id'] for x in data['sets']}
    ids = []
    for pg in range(1, 6):
        a = get(data['storeAuthorUrl'] + ('' if pg == 1 else f'?page={pg}'))
        found = [x for x in dict.fromkeys(re.findall(r'stickershop/product/(\d+)', a)) if x not in ids]
        if not found: break
        ids += found
        if 'page=%d' % (pg + 1) not in a: break
    new = [x for x in ids if 'p' + x not in have]
    if not ids: raise RuntimeError('作者ページから商品が見つかりません')
    for pid in sorted(new, key=int):
        pg = get(f'https://store.line.me/stickershop/product/{pid}/ja')
        title = html.unescape((re.search(r'data-test="sticker-name-title">([^<]+)<', pg) or re.search(r'og:title" content="([^"]+?) - LINE', pg)).group(1)).strip()
        desc = html.unescape((re.search(r'og:description" content="([^"]*)"', pg) or [None, ''])[1]).strip()
        prev = [json.loads(html.unescape(m)) for m in re.findall(r"data-preview='([^']+)'", pg)]
        urls = [x.get('staticUrl') for x in prev if x.get('staticUrl') and x.get('id') != pid]
        main = f'https://stickershop.line-scdn.net/stickershop/v1/product/{pid}/LINEStorePC/main.png?v=1'
        if not urls: print('  スタンプ画像なし', pid); continue
        data['sets'].append({'id': 'p' + pid, 'no': len(data['sets']) + 1, 'title': title, 'message': f'「{title}」をつくりました！',
                             'desc': desc[:300], 'storeUrl': f'https://store.line.me/stickershop/product/{pid}/ja', 'main': main, 'stickers': list(dict.fromkeys(urls))})
        print('  新しいスタンプ:', title)
    if new: p.write_text(head + 'window.STAMP = ' + json.dumps(data, ensure_ascii=False, indent=1) + ';\n', encoding='utf-8')
    return len(new)

def tales():
    p = R / 'note' / 'posts.js'; s = p.read_text(encoding='utf-8'); added = 0
    for url in re.findall(r'"url": "(https://tales\.note\.com/[\w-]+/[\w]+)",\n\s*"cover"', s):
        page = get(url)
        path = url.split('tales.note.com')[1]
        eps = []
        for m in re.finditer(r'href="' + re.escape(path) + r'/episodes/(\w+)".*?font-bold">([^<]+)</span><time dateTime="(\d{4}-\d{2}-\d{2})', page, re.S):
            e = {'t': html.unescape(m.group(2)).strip(), 'date': m.group(3), 'url': url + '/episodes/' + m.group(1)}
            if e['url'] not in [x['url'] for x in eps]: eps.append(e)
        if not eps: print('  TALES の話が読めませんでした', url); continue
        # この作品の "episodes": [ ... ] を置きかえる（減るときは何もしない）
        k = s.index('"url": "' + url + '"'); a = s.index('"episodes": [', k) + len('"episodes": '); depth = 0
        for j in range(a, len(s)):
            depth += {'[': 1, ']': -1}.get(s[j], 0)
            if depth == 0: b = j + 1; break
        old = json.loads(s[a:b])
        eps.sort(key=lambda e: e['date'])
        if len(eps) <= len(old): continue
        added += len(eps) - len(old)
        ind = ' ' * (len(s[:k]) - len(s[:k].rstrip(' ')))
        s = s[:a] + json.dumps(eps, ensure_ascii=False, indent=1).replace('\n', '\n' + ind) + s[b:]
    if added: p.write_text(s, encoding='utf-8')
    return added

if __name__ == '__main__':
    for name, fn in (('スタンプ', stamps), ('TALES', tales)):
        try: print(name, '追加:', fn())
        except Exception as e: print(name, 'スキップ:', type(e).__name__, e)
