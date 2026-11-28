#!/usr/bin/env python3
"""フッターなどに並べる 88×31 のバナー（昔のホームページ風・点滅する GIF）を作る。
使い方： python3 tools/build_banners.py   （Pillow と、日本語のドット文字フォント Unifont が必要）
出力： assets/retro/b-<名前>.gif   ／ 並べる順番とリンク先は tools/build_retro.py の BANNERS
"""
import pathlib, sys
from PIL import Image, ImageDraw, ImageFont

R = pathlib.Path(__file__).resolve().parent.parent
OUT = R / 'assets' / 'retro'
W, H = 88, 31
JP = ImageFont.truetype('/usr/share/fonts/opentype/unifont/unifont_jp.otf', 16)
SM = ImageFont.load_default()

# ちいさなドット絵（'#' が点）
SPR = {
    'inv': ['..#.....#..', '...#...#...', '..#######..', '.##.###.##.', '###########', '#.#######.#', '#.#.....#.#', '...##.##...'],
    'coin': ['.####.', '######', '##..##', '##.###', '##..##', '######', '.####.'],
    'heart': ['.##.##.', '#######', '#######', '.#####.', '..###..', '...#...'],
    'star': ['...#...', '...#...', '#######', '.#####.', '..###..', '.##.##.', '#.....#'],
    'bowl': ['.#.#.#.', '..#.#..', '#######', '#######', '.#####.', '..###..'],
    'film': ['#######', '#.#.#.#', '#######', '#.....#', '#######', '#.#.#.#', '#######'],
    'pen': ['.....##', '....###', '...###.', '..###..', '.###...', '##.....', '#......'],
    'foot': ['.#.#.#.', '.#.#.#.', '.......', '.#####.', '#######', '#######', '.#####.'],
    'frame': ['#######', '#.....#', '#.#.#.#', '#..#..#', '#.#.#.#', '#.....#', '#######'],
    'stone': ['.###.', '#####', '#####', '#####', '.###.'],
    'card': ['#########', '#.......#', '#.###...#', '#.......#', '#.#####.#', '#########'],
    'phone': ['#####', '#...#', '#...#', '#...#', '#...#', '#.#.#', '#####'],
    'chat': ['.######.', '########', '########', '########', '.######.', '..##....', '.#......'],
    'ghost': ['.#####.', '#######', '#.###.#', '#######', '#######', '#######', '#.#.#.#'],
    'book': ['###.###', '#######', '#######', '#######', '#######', '###.###'],
    'link': ['.###...', '#...#..', '#..###.', '.##...#', '..#...#', '...###.'],
}

def sprite(d, name, x, y, col):
    for j, row in enumerate(SPR[name]):
        for i, ch in enumerate(row):
            if ch == '#': d.point((x + i, y + j), fill=col)

def tw(d, t, f): return d.textlength(t, font=f)

def banner(name, bg, main, mcol, sub, scol, spr=None, sprcol=None, edge=('#ffffff', '#000000'), bg2=None, blink='sub', stripes=None):
    """2コマの点滅バナー。blink：'sub'＝下の文字が点滅、'spr'＝絵が動く、'inv'＝色が入れかわる"""
    frames = []
    for k in (0, 1):
        im = Image.new('RGB', (W, H), bg if not (blink == 'inv' and k) else (bg2 or mcol))
        d = ImageDraw.Draw(im); d.fontmode = '1'
        if bg2 and blink != 'inv':  # 左右のグラデーションっぽい2色
            for x in range(W):
                if (x * 7 + (x // 3)) % 11 < (x * 11 // W): d.line([(x, 0), (x, H)], fill=bg2)
        if stripes:
            for x in range(-H, W, 8): d.polygon([(x + k * 4, H), (x + 4 + k * 4, H), (x + H + 4 + k * 4, 0), (x + H + k * 4, 0)], fill=stripes)
            d.rectangle([8, 5, W - 9, H - 6], fill=bg)
        mc, sc = (mcol, scol) if not (blink == 'inv' and k) else (bg, bg)
        sx = 0
        if spr: sx = len(SPR[spr][0]) + 4
        mw = tw(d, main, JP); x0 = int((W - mw - sx) / 2) + sx
        my = 1 if sub else 7
        d.text((x0 + 1, my + 1), main, font=JP, fill='#000000' if im.getpixel((2, 2)) != (0, 0, 0) and blink != 'inv' and mcol in ('#ffffff', '#ffff00', '#ffff66') else im.getpixel((2, 2)))
        d.text((x0, my), main, font=JP, fill=mc)
        if spr:
            sy = my + 4 + (k if blink == 'spr' else 0)
            sprite(d, spr, x0 - sx, sy, (sprcol or mc) if not (blink == 'inv' and k) else bg)
        if sub and not (blink == 'sub' and k):
            sw = tw(d, sub, SM); d.text((int((W - sw) / 2), 18), sub, font=SM, fill=sc)
        if blink == 'sub':  # 角のきらきら
            for (px, py) in ([(4, 4), (W - 5, H - 5)] if k == 0 else [(W - 5, 4), (4, H - 5)]):
                d.point((px, py), fill=scol); d.point((px - 1, py), fill=scol); d.point((px + 1, py), fill=scol); d.point((px, py - 1), fill=scol); d.point((px, py + 1), fill=scol)
        # ふち（左上が明るく、右下が暗い）
        d.line([(0, 0), (W - 1, 0)], fill=edge[0]); d.line([(0, 0), (0, H - 1)], fill=edge[0])
        d.line([(0, H - 1), (W - 1, H - 1)], fill=edge[1]); d.line([(W - 1, 0), (W - 1, H - 1)], fill=edge[1])
        frames.append(im.convert('P', palette=Image.ADAPTIVE, colors=16))
    frames[0].save(OUT / f'b-{name}.gif', save_all=True, append_images=frames[1:], duration=[620, 380] if blink == 'sub' else 480, loop=0, optimize=False)

SPEC = [
    # 名前, 背景, 大きい文字, 文字色, 小さい文字, 小さい文字の色, 絵, 絵の色, その他
    dict(name='minigame', bg='#000000', main='ミニゲーム', mcol='#ffff00', sub='PUSH START', scol='#00ff66', blink='sub'),
    dict(name='board', bg='#14532d', main='ボドゲ', mcol='#ffffff', sub='vs CPU', spr='stone', sprcol='#ffffff', scol='#ffe27a', blink='sub', edge=('#7fd49a', '#062a14')),
    dict(name='game', bg='#1a0b3a', main='ゲーム', mcol='#ffd23f', sub='GAME BOOTH', scol='#3ef0ff', spr='coin', sprcol='#ffd23f', blink='spr'),
    dict(name='apps', bg='#f2f2f7', main='アプリ', mcol='#0a4fd6', sub='for iPhone', scol='#555555', spr='phone', sprcol='#1d1d1f', blink='sub', edge=('#ffffff', '#8e8e93')),
    dict(name='note', bg='#fbfaf7', main='よみもの', mcol='#26231f', sub='note booth', scol='#b23a22', spr='pen', sprcol='#b23a22', blink='spr', edge=('#ffffff', '#b9b2a6')),
    dict(name='stamp', bg='#06c755', main='スタンプ', mcol='#ffffff', sub='LINE STAMP', scol='#eaffef', spr='chat', sprcol='#ffffff', blink='spr', edge=('#8ef0b4', '#03702f')),
    dict(name='museum', bg='#f7f6f2', main='美術館', mcol='#2b2a27', sub='MUSEUM', scol='#8a6f3c', spr='frame', sprcol='#b89a5e', blink='sub', edge=('#d8c08a', '#8a6f3c')),
    dict(name='ramen', bg='#d7261e', main='ラーメン', mcol='#ffffff', sub='zuru zuru...', scol='#ffe27a', spr='bowl', sprcol='#ffe27a', blink='spr', edge=('#ff8a80', '#7a0d10')),
    dict(name='socafe', bg='#3b2a20', main='素カフェ', mcol='#fff3d6', sub='SOZAI CAFE', scol='#e9c98f', blink='sub', edge=('#e9c98f', '#1d140e')),
    dict(name='gakko', bg='#2b4a3c', main='Gakko', mcol='#ffffff', sub='SCHOOL', scol='#fff6a8', spr='pen', sprcol='#ffd23f', blink='spr', edge=('#8a5a33', '#4a2e16')),
    dict(name='movie', bg='#111111', main='映画', mcol='#ffd23f', sub='C-Log Web', scol='#ffffff', spr='film', sprcol='#ffd23f', blink='sub'),
    dict(name='diary', bg='#ffffff', main='開発日記', mcol='#000080', sub='DIARY', scol='#d10056', blink='sub', edge=('#dfdfdf', '#808080')),
    dict(name='guestbook', bg='#fffbe6', main='足あと帳', mcol='#7a3b00', sub='GUEST BOOK', scol='#d10056', spr='foot', sprcol='#c28a3a', blink='spr', edge=('#ffffff', '#c2a05a')),
    dict(name='links', bg='#000080', main='リンク集', mcol='#ffffff', sub='LINKS', scol='#ffff00', spr='link', sprcol='#7df9ff', blink='sub'),
    dict(name='meishi', bg='#000000', main='名刺', mcol='#e9d39a', sub='MEISHI', scol='#c9a35a', spr='card', sprcol='#e9d39a', blink='sub', edge=('#8a7440', '#3a2f15')),
    dict(name='backstage', bg='#001a00', main='裏口 >_', mcol='#33ff66', sub='backstage', scol='#1f9f45', blink='sub', edge=('#33ff66', '#003300')),
    dict(name='linkfree', bg='#ff66cc', main='LINK FREE', mcol='#ffffff', sub='', scol='#ffff00', blink='inv', bg2='#6633ff'),
    dict(name='since', bg='#c0c0c0', main='Since 2026', mcol='#000080', sub='', scol='#d10056', blink='sub', edge=('#ffffff', '#404040')),
    dict(name='800x600', bg='#008080', main='800x600', mcol='#ffffff', sub='best viewed', scol='#ffff66', blink='sub', edge=('#7fdada', '#003b3b')),
    dict(name='kiriban', bg='#fff0f6', main='キリ番', mcol='#d10056', sub='GET!!', scol='#6633ff', spr='heart', sprcol='#ff4f9a', blink='spr', edge=('#ffffff', '#d98fb0')),
]

if __name__ == '__main__':
    for s in SPEC: banner(**s)
    print('banners:', len(SPEC))
