#!/usr/bin/env python3
"""教育用のダウンロード素材（zip）を作る。裏口（/bookmarks/）の download コマンドから落とせる。
使い方： python3 tools/build_downloads.py
出力： downloads/*.zip と downloads/index.json（一覧。bookmarks/downloads.js にも同じ内容を書く）
  1) boardgame-ai      … CPU と対戦できるボードゲーム9種のソース（考え方の解説つき）
  2) minigames         … ミニゲーム4本のソース（1ファイルで動く）
  3) retro-homepage-kit… 90年代ホームページの作り方キット（見本ページ・CSS・部品）
  4) chiptune-sound    … ファミコン風の音の出し方（Web Audio の見本）
  5) ai-dev-notes      … AI と作る開発ノート（記事2本の PDF。PDF は tools/build_notes_pdf.js が作って downloads/src/ に置く）
入れるのは、このサイトのために書いたコードと文章だけ。個人情報や鍵は入れない。
zip は日時を固定して作るので、中身が同じなら毎回同じファイルになる。"""
import json, pathlib, re, zipfile

R = pathlib.Path(__file__).resolve().parent.parent
OUT = R / 'downloads'; OUT.mkdir(exist_ok=True)
SRC = pathlib.Path(__file__).resolve().parent / 'downloads_src'
STAMP = (2026, 11, 17, 0, 0, 0)
LICENSE = ('\n\n---\n© GiveTex（https://www.givetex.org/）\n'
           '個人の学習や、学校・勉強会の授業で、自由に読んで・動かして・書きかえて使えます。\n'
           'そのまま再配布したり、売ったりするときは、先に https://www.givetex.org/contact/ から連絡してください。\n')

def read(p): return (R / p).read_text(encoding='utf-8')
def src(name): return (SRC / name).read_text(encoding='utf-8')

def make(slug, files):
    """files: {zip の中のパス: 文字列 or bytes}"""
    path = OUT / f'givetex-{slug}.zip'
    with zipfile.ZipFile(path, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as z:
        for name in sorted(files):
            data = files[name]; data = data.encode('utf-8') if isinstance(data, str) else data
            zi = zipfile.ZipInfo(f'givetex-{slug}/{name}', STAMP); zi.compress_type = zipfile.ZIP_DEFLATED; zi.external_attr = 0o644 << 16
            z.writestr(zi, data)
    return path

def strip_site(html):
    """サイト専用の読みこみ（アクセス解析・共通メニュー・SEO）を外して、単体で開けるようにする"""
    html = re.sub(r'\n?<!-- seo -->.*?<!-- /seo -->', '', html, flags=re.S)
    html = re.sub(r'\n<script src="/assets/(ga|img-fallback|gt-menu|gt-fx)\.js"[^>]*></script>', '', html)
    html = re.sub(r'\n<link rel="(icon|apple-touch-icon|manifest|canonical)"[^>]*>', '', html)
    return html

# ---------- 1) ボードゲーム AI ----------
def boardgame():
    f = {}
    html = strip_site(read('game/board/index.html')).replace('/game/board/', './')
    html = html.replace('<a href="/game/">◀ ゲームブース</a>', '<a href="https://www.givetex.org/game/board/">GiveTex で遊ぶ</a>')
    f['index.html'] = html
    f['board.css'] = read('game/board/board.css')
    f['board.js'] = read('game/board/board.js').replace("'/game/board/' + key", "'./' + key")
    for k in ['reversi', 'gomoku', 'connect4', 'checkers', 'mancala', 'chess', 'shogi', 'go', 'mahjong']:
        f[f'{k}.js'] = read(f'game/board/{k}.js')
    f['README.md'] = src('boardgame-ai.md') + LICENSE
    return make('boardgame-ai', f), 'ボードゲーム AI のソース集', 'CPU と対戦できる9種（リバーシ・五目ならべ・四目ならべ・チェッカー・マンカラ・チェス・将棋・囲碁・麻雀）。CPU の考え方の解説と、改造の課題つき'

# ---------- 2) ミニゲーム ----------
def minigames():
    css = read('assets/retro.css').split('\n')
    mg = '\n'.join(l for l in css if '.mg' in l and 'td.r-side' not in l)
    home = read('index.html'); i = home.index('<div class="mg" id="mg">'); j = home.index('</noscript>', i); markup = home[i:j] + '</noscript>\n</div>'
    markup = re.sub(r'\s*loading="lazy" decoding="async"', '', markup)
    html = f'''<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ミニゲーム4本（ブロックおとし・うちゅうげきたい・クレーン・じゃんけん）</title>
<link href="https://fonts.googleapis.com/css2?family=DotGothic16&amp;family=VT323&amp;display=swap" rel="stylesheet">
<style>
body {{ margin: 0; padding: 24px 12px; background: #000028; color: #fff; font: 14px/1.7 "DotGothic16", sans-serif; }}
h1 {{ font-size: 18px; text-align: center; color: #ffff66; }}
.box {{ max-width: 320px; margin: 0 auto; padding: 6px; background: #c0c0c0; color: #000; }}
p.note {{ max-width: 320px; margin: 14px auto 0; font-size: 12px; color: #cfd6ff; }}
{mg}
</style>
</head>
<body>
<h1>★ ミニゲーム ★</h1>
<div class="box">
{markup}
</div>
<p class="note">ゲームの中身はぜんぶ minigames.js に入っています。README.md に、読み方と改造の課題があります。</p>
<script src="minigames.js"></script>
</body>
</html>
'''
    f = {'index.html': html, 'minigames.js': read('assets/minigames.js'), 'README.md': src('minigames.md') + LICENSE}
    return make('minigames', f), 'ミニゲーム4本のソース', 'ブロックおとし・うちゅうげきたい・クレーンゲーム・じゃんけんポン。1つの JS ファイルで動く、ゲームづくりの入門例'

# ---------- 3) 90年代ホームページの作り方キット ----------
def retrokit():
    css = read('assets/retro.css').replace('/assets/retro/', 'img/')
    f = {'retro.css': css, 'index.html': src('retro-kit.html'), 'kit.js': src('retro-kit.js'), 'README.md': src('retro-kit.md') + LICENSE}
    for n in ['bg-stars.png', 'new.gif', 'koujichu.gif', 'bnr-givetex.gif', 'b-linkfree.gif', 'b-since.gif', 'b-800x600.gif', 'b-kiriban.gif']:
        f[f'img/{n}'] = (R / 'assets' / 'retro' / n).read_bytes()
    f['make_banner.py'] = read('tools/build_banners.py')
    return make('retro-homepage-kit', f), '90年代ホームページの作り方キット', '見本ページ・レトロな CSS・ウインドウの部品・カウンター・おみくじ・88×31 バナーの作り方。HTML/CSS の学習や授業の題材に'

# ---------- 4) ファミコン風の音 ----------
def chiptune():
    f = {'index.html': src('chiptune.html'), 'sound.js': src('chiptune.js'), 'README.md': src('chiptune.md') + LICENSE}
    return make('chiptune-sound', f), 'ファミコン風の音の出し方', 'ブラウザだけで音を作る見本（BGM・効果音・クリック音）。周波数・波形・音の長さを、鳴らしながら学べる'

# ---------- 5) AI と作る開発ノート ----------
def notes():
    f = {'README.md': src('ai-dev-notes.md') + LICENSE}
    for n in ['ai-team-app-development.pdf', 'ai-book-illustration-rules.pdf']:
        p = OUT / 'src' / n
        if not p.exists(): raise SystemExit(f'{p} がありません。先に node tools/build_notes_pdf.js を実行してください')
        f[n] = p.read_bytes()
    return make('ai-dev-notes', f), 'AI と作る開発ノート', 'サイトの記事2本の PDF（AI と分業してアプリを作る方法／AI で本の挿絵をつくるときの5つのルール）'

if __name__ == '__main__':
    items = []
    for fn in (boardgame, minigames, retrokit, chiptune, notes):
        path, title, desc = fn()
        with zipfile.ZipFile(path) as z: n = len(z.namelist())
        items.append({'file': path.name, 'title': title, 'desc': desc, 'bytes': path.stat().st_size, 'files': n})
        print(f'{path.name:36} {path.stat().st_size / 1024:7.1f} KB  {n} files')
    (OUT / 'index.json').write_text(json.dumps(items, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    (R / 'bookmarks' / 'downloads.js').write_text('/* 教育用のダウンロード素材の一覧（tools/build_downloads.py が作る） */\nwindow.DOWNLOADS = ' + json.dumps(items, ensure_ascii=False, indent=1) + ';\n', encoding='utf-8')
