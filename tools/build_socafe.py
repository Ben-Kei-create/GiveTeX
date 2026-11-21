#!/usr/bin/env python3
"""素カフェ（素材カフェ）の無料素材を作る → socafe/dl/*.zip と socafe/img/*（見本の絵）
使い方： python3 tools/build_socafe.py   （Pillow が必要。音は Python だけで作る）
素材はすべてこのサイトのために作ったオリジナル。中身を変えたら、もう一度実行する。
zip は日時を固定して作るので、中身が同じなら毎回同じファイルになる。"""
import io, json, math, pathlib, random, struct, sys, wave, zipfile
from PIL import Image, ImageDraw, ImageFilter

R = pathlib.Path(__file__).resolve().parent.parent
DL = R / 'socafe' / 'dl'; IMG = R / 'socafe' / 'img'
DL.mkdir(parents=True, exist_ok=True); IMG.mkdir(parents=True, exist_ok=True)
STAMP = (2026, 11, 21, 0, 0, 0)
LICENSE = """素カフェ（GiveTex）の素材の使いかた
https://www.givetex.org/socafe/

○ 個人でも、お仕事（商用）でも、無料で使えます
○ ホームページ・ブログ・動画・ゲーム・アプリ・授業の資料などに使えます
○ 色や大きさを変えるなどの加工もOK
○ クレジット表記はいりません（「素材：GiveTex」と書いてもらえると、うれしいです）
× 素材そのものを、そのまま（または少し変えただけで）配ったり、売ったりするのはNGです
× 素材を使って、人を傷つけるもの・法律に反するものを作るのはNGです

困ったときは https://www.givetex.org/contact/ からどうぞ。
"""

def make_zip(name, files):
    p = DL / name
    with zipfile.ZipFile(p, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as z:
        for fn in sorted(files):
            data = files[fn]; data = data.encode('utf-8') if isinstance(data, str) else data
            zi = zipfile.ZipInfo(name[:-4] + '/' + fn, STAMP); zi.compress_type = zipfile.ZIP_DEFLATED; zi.external_attr = 0o644 << 16
            z.writestr(zi, data)
    return p

def png(im, **kw):
    b = io.BytesIO(); im.save(b, 'PNG', optimize=True, **kw); return b.getvalue()

def preview(im, name, w=480):
    im = im.convert('RGBA')
    if im.width > w: im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
    bg = Image.new('RGB', im.size, (255, 250, 242)); bg.paste(im, mask=im.split()[3])
    bg.save(IMG / name, 'WEBP', quality=72); return '/socafe/img/' + name

ITEMS = []
def item(**kw): ITEMS.append(kw)

# ---------------------------------------------------------------- 1) 88×31 バナー
def banners():
    files = {}; frames = []
    for p in sorted((R / 'assets' / 'retro').glob('b-*.gif')) + [R / 'assets/retro/bnr-givetex.gif', R / 'assets/retro/koujichu.gif']:
        files['banners/' + p.name] = p.read_bytes(); frames.append(Image.open(p).convert('RGBA'))
    # 自分で文字を入れられる、空のバナー（3色）
    for name, bg, hi, lo in [('blank-silver', (192, 192, 192), (255, 255, 255), (64, 64, 64)), ('blank-navy', (0, 0, 128), (120, 140, 255), (0, 0, 40)), ('blank-black', (0, 0, 0), (120, 120, 120), (30, 30, 30))]:
        im = Image.new('RGB', (88, 31), bg); d = ImageDraw.Draw(im)
        d.line([(0, 0), (87, 0)], hi); d.line([(0, 0), (0, 30)], hi); d.line([(0, 30), (87, 30)], lo); d.line([(87, 0), (87, 30)], lo)
        files['template/' + name + '.png'] = png(im)
    files['README.txt'] = '88×31 のバナー素材（点滅する GIF）と、文字を入れられる空のバナーです。\nむかしのホームページで、サイトどうしをリンクするときに使った大きさです。\n\n' + LICENSE
    z = make_zip('socafe-banners.zip', files)
    cols = 4; sheet = Image.new('RGBA', (cols * 96 + 8, math.ceil(len(frames) / cols) * 39 + 8), (255, 250, 242, 255))
    for i, f in enumerate(frames): sheet.paste(f, (8 + (i % cols) * 96, 8 + (i // cols) * 39))
    sheet = sheet.resize((sheet.width * 2, sheet.height * 2), Image.NEAREST)
    item(id='banners', cat='icon', title='88×31 バナー 20種', desc='点滅するレトロなバナーと、文字を入れられる空のバナー。むかしのホームページのリンクに。', fmt='GIF・PNG', file=z.name, prev=preview(sheet, 'banners.webp'), n=len(frames) + 3)

# ---------------------------------------------------------------- 2) ドット絵アイコン
SPR = {
    'invader': ['..#.....#..', '...#...#...', '..#######..', '.##.###.##.', '###########', '#.#######.#', '#.#.....#.#', '...##.##...'],
    'coin': ['.####.', '##..##', '#.##.#', '#.##.#', '#.##.#', '##..##', '.####.'],
    'heart': ['.##.##.', '#######', '#######', '.#####.', '..###..', '...#...'],
    'star': ['...#...', '...#...', '#######', '.#####.', '..###..', '.##.##.', '#.....#'],
    'ramen': ['.#.#.#.', '..#.#..', '#######', '#######', '.#####.', '..###..'],
    'film': ['#######', '#.#.#.#', '#######', '#.....#', '#######', '#.#.#.#', '#######'],
    'pen': ['.....##', '....###', '...###.', '..###..', '.###...', '##.....', '#......'],
    'foot': ['.#.#.#.', '.#.#.#.', '.......', '.#####.', '#######', '#######', '.#####.'],
    'frame': ['#######', '#.....#', '#.#.#.#', '#..#..#', '#.#.#.#', '#.....#', '#######'],
    'card': ['#########', '#.......#', '#.###...#', '#.......#', '#.#####.#', '#########'],
    'phone': ['#####', '#...#', '#...#', '#...#', '#...#', '#.#.#', '#####'],
    'chat': ['.######.', '########', '########', '########', '.######.', '..##....', '.#......'],
    'ghost': ['.#####.', '#######', '#.###.#', '#######', '#######', '#######', '#.#.#.#'],
    'book': ['###.###', '#######', '#######', '#######', '#######', '###.###'],
    'cup': ['.#..#..', '..#..#.', '.......', '######.', '#######', '######.', '.####..'],
    'cat': ['#.....#', '##...##', '#######', '#.###.#', '#######', '.#####.'],
}
COL = {'invader': (255, 79, 216), 'coin': (255, 210, 63), 'heart': (255, 79, 154), 'star': (255, 226, 74), 'ramen': (215, 38, 30), 'film': (40, 40, 48), 'pen': (178, 58, 34),
       'foot': (194, 138, 58), 'frame': (184, 154, 94), 'card': (233, 211, 154), 'phone': (29, 29, 31), 'chat': (6, 199, 85), 'ghost': (160, 120, 255), 'book': (61, 99, 255), 'cup': (120, 72, 40), 'cat': (90, 90, 100)}
def icons():
    files = {}; tiles = []
    for name, rows in SPR.items():
        w, h = len(rows[0]), len(rows); S = 16
        im = Image.new('RGBA', (S, S), (0, 0, 0, 0)); ox, oy = (S - w) // 2, (S - h) // 2
        for y, r in enumerate(rows):
            for x, ch in enumerate(r):
                if ch == '#': im.putpixel((ox + x, oy + y), COL[name] + (255,))
        # ふちどり（白い縁）で、どんな背景でも見えるように
        out = Image.new('RGBA', (S, S), (0, 0, 0, 0)); a = im.split()[3]
        edge = a.filter(ImageFilter.MaxFilter(3)); out.paste((255, 255, 255, 255), mask=edge); out.alpha_composite(im)
        for k in (1, 2, 4, 8):
            files['%dpx/%s.png' % (S * k, name)] = png(out.resize((S * k, S * k), Image.NEAREST))
        tiles.append(out)
    files['README.txt'] = 'ドット絵アイコン %d 種（16px・32px・64px・128px、背景は透明）。\n拡大するときは「ニアレストネイバー（ぼかさない）」で拡大すると、くっきりします。\n\n' % len(SPR) + LICENSE
    z = make_zip('socafe-pixel-icons.zip', files)
    sheet = Image.new('RGBA', (8 * 72 + 8, 2 * 72 + 8), (255, 250, 242, 255))
    for i, t in enumerate(tiles): sheet.alpha_composite(t.resize((64, 64), Image.NEAREST), (8 + (i % 8) * 72, 8 + (i // 8) * 72))
    item(id='icons', cat='icon', title='ドット絵アイコン 16種', desc='インベーダー・コイン・ラーメン・ねこ・コーヒー…。白いふちどりつきで、どんな背景にも。', fmt='PNG（透明）4サイズ', file=z.name, prev=preview(sheet, 'icons.webp', 600), n=len(SPR))

# ---------------------------------------------------------------- 3) 背景パターン（つなぎ目のないタイル）
def patterns():
    files = {}; tiles = []
    def tile(name, size, draw):
        im = Image.new('RGB', (size, size)); d = ImageDraw.Draw(im); draw(im, d, size)
        files[name + '.png'] = png(im); tiles.append((name, im))
    def stars(im, d, s):
        d.rectangle([0, 0, s, s], (0, 0, 40)); rnd = random.Random(7)
        for _ in range(40):
            x, y = rnd.randrange(s), rnd.randrange(s); c = rnd.choice([(255, 255, 255), (255, 255, 160), (180, 220, 255)])
            d.point((x, y), c)
            if rnd.random() < .15: d.point(((x + 1) % s, y), c); d.point(((x - 1) % s, y), c); d.point((x, (y + 1) % s), c); d.point((x, (y - 1) % s), c)
    def dots(im, d, s):
        d.rectangle([0, 0, s, s], (250, 240, 222))
        for (x, y) in [(s // 4, s // 4), (3 * s // 4, 3 * s // 4)]: d.ellipse([x - 7, y - 7, x + 7, y + 7], (196, 150, 108))
    def check(im, d, s):
        for y in range(0, s, s // 4):
            for x in range(0, s, s // 4): d.rectangle([x, y, x + s // 4 - 1, y + s // 4 - 1], (255, 79, 154) if ((x + y) // (s // 4)) % 2 else (255, 230, 240))
    def grid(im, d, s):
        d.rectangle([0, 0, s, s], (255, 253, 245))
        for k in range(0, s, 8): d.line([(k, 0), (k, s)], (214, 232, 246) if k % 32 else (150, 196, 232)); d.line([(0, k), (s, k)], (214, 232, 246) if k % 32 else (150, 196, 232))
    def stripe(im, d, s):
        d.rectangle([0, 0, s, s], (255, 247, 230))
        for k in range(-s, s * 2, 16): d.polygon([(k, 0), (k + 8, 0), (k + 8 - s, s), (k - s, s)], (255, 214, 120))
    def coffee(im, d, s):
        d.rectangle([0, 0, s, s], (74, 52, 40))
        for (x, y, rot) in [(s * .25, s * .25, 0), (s * .75, s * .75, 1), (s * .75, s * .25, 1), (s * .25, s * .75, 0)]:
            w, h = (9, 6) if rot == 0 else (6, 9)
            d.ellipse([x - w, y - h, x + w, y + h], (150, 98, 62))
            if rot == 0: d.arc([x - w + 2, y - h - 4, x + w - 2, y + 2], 20, 160, (92, 60, 40), 2)
            else: d.arc([x - 2, y - h + 2, x + w + 4, y + h - 2], 110, 250, (92, 60, 40), 2)
    tile('stars-night', 64, stars); tile('cafe-dots', 48, dots); tile('pop-check', 64, check); tile('grid-paper', 64, grid); tile('honey-stripe', 64, stripe); tile('coffee-beans', 96, coffee)
    files['README.txt'] = '背景用のタイル（つなぎ目なく並べられる PNG）%d 種。\nCSS なら background: url(cafe-dots.png); のように使います。\n\n' % len(tiles) + LICENSE
    z = make_zip('socafe-patterns.zip', files)
    sheet = Image.new('RGB', (3 * 200 + 16, 2 * 130 + 12), (255, 250, 242))
    for i, (n, t) in enumerate(tiles):
        big = Image.new('RGB', (192, 122))
        for y in range(0, 122, t.height):
            for x in range(0, 192, t.width): big.paste(t, (x, y))
        sheet.paste(big, (8 + (i % 3) * 200, 6 + (i // 3) * 130))
    item(id='patterns', cat='bg', title='背景パターン 6種', desc='星空・カフェの水玉・ポップなチェック・方眼紙・はちみつストライプ・コーヒー豆。つなぎ目なく敷きつめられます。', fmt='PNG タイル', file=z.name, prev=preview(sheet, 'patterns.webp', 616), n=len(tiles))

# ---------------------------------------------------------------- 4) 効果音（ファミコン風）
SR = 22050
def synth(parts, dur):
    n = int(SR * dur); buf = [0.0] * n
    for p in parts:
        kind, f0, f1, t0, d, vol = p; s0 = int(t0 * SR); m = int(d * SR); ph = 0.0
        rnd = random.Random(int(f0 * 7 + t0 * 1000))
        for i in range(m):
            if s0 + i >= n: break
            u = i / max(1, m); f = f0 * (f1 / f0) ** u if f0 > 0 and f1 > 0 else f0
            ph += f / SR; env = min(1, i / (SR * .005)) * (1 - u) ** 1.6
            if kind == 'sq': v = 1 if (ph % 1) < .5 else -1
            elif kind == 'tri': v = 4 * abs((ph % 1) - .5) - 1
            elif kind == 'sin': v = math.sin(2 * math.pi * ph)
            else: v = rnd.uniform(-1, 1)
            buf[s0 + i] += v * env * vol
    peak = max(1e-6, max(abs(x) for x in buf)); k = min(1, .85 / peak)
    b = io.BytesIO()
    with wave.open(b, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes(b''.join(struct.pack('<h', int(max(-1, min(1, x * k)) * 32000)) for x in buf))
    return b.getvalue()
def sounds():
    S = {
        'click': ([('noise', 2000, 2000, 0, .03, .6), ('sq', 1300, 400, 0, .02, .3)], .06),
        'select': ([('sq', 880, 880, 0, .06, .4), ('sq', 1320, 1320, .06, .08, .4)], .16),
        'coin': ([('sq', 988, 988, 0, .08, .45), ('sq', 1319, 1319, .08, .35, .45)], .45),
        'jump': ([('sq', 220, 880, 0, .22, .45)], .25),
        'powerup': ([('sq', 523 * 2 ** (k / 12), 523 * 2 ** (k / 12), k * .045, .06, .4) for k in range(0, 13, 2)], .4),
        'boot-chime': ([('sin', 110, 55, 0, 1.2, .5)] + [('tri', f, f, t, .9, .35) for f, t in [(523, 0), (659, .07), (784, .14), (1047, .22), (1319, .32)]], 1.3),
        'gameover': ([('sq', f, f, k * .16, .22, .4) for k, f in enumerate([523, 392, 330, 262])], .9),
        'page-flip': ([('noise', 1800, 5200, 0, .22, .6)], .25),
        'door-open': ([('sq', 180, 120, 0, .35, .15), ('tri', 140, 90, .12, .3, .4)], .5),
        'warp-pipe': ([('sq', 900, 140, 0, .55, .35)], .6),
    }
    files = {}
    for name, (parts, dur) in S.items():
        data = synth(parts, dur); files['wav/' + name + '.wav'] = data
        (IMG / ('sfx-' + name + '.wav')).write_bytes(data)
    files['README.txt'] = 'ファミコン風の効果音 %d 種（WAV・22,050Hz・モノラル）。\nゲーム・アプリ・動画の効果音に。音量は使う側で調整してください。\n\n' % len(S) + LICENSE
    z = make_zip('socafe-sfx.zip', files)
    item(id='sfx', cat='sound', title='ファミコン風 効果音 10種', desc='クリック・コイン・ジャンプ・パワーアップ・起動音・ゲームオーバー・ページめくり・ドア・土管ワープ。', fmt='WAV', file=z.name, prev='', n=len(S), sounds=[{'n': n, 'u': '/socafe/img/sfx-' + n + '.wav'} for n in S])

# ---------------------------------------------------------------- 5) 壁紙
def wallpapers():
    files = {}
    def night(w, h, seed):
        im = Image.new('RGB', (w, h)); px = im.load()
        for y in range(h):
            t = y / h; c = (int(8 + 20 * t), int(10 + 14 * t), int(40 + 50 * (1 - abs(t - .55) * 1.6)))
            for x in range(w): px[x, y] = c
        rnd = random.Random(seed)
        neb = Image.new('RGBA', (w, h), (0, 0, 0, 0)); nd = ImageDraw.Draw(neb)  # 星雲：ぼかしてから重ねる
        for cx, cy, r, col in [(w * .22, h * .3, w * .45, (150, 80, 255, 70)), (w * .82, h * .64, w * .5, (40, 190, 220, 55))]:
            nd.ellipse([cx - r, cy - r * .6, cx + r, cy + r * .6], col)
        neb = neb.filter(ImageFilter.GaussianBlur(w * .09)); im = im.convert('RGBA'); im.alpha_composite(neb); im = im.convert('RGB')
        d = ImageDraw.Draw(im, 'RGBA')
        for _ in range(int(w * h / 1800)):
            x, y = rnd.randrange(w), rnd.randrange(h); a = rnd.randint(110, 255); s = rnd.choice([1.5, 2, 2, 3, 4])
            d.ellipse([x, y, x + s, y + s], (255, 255, 255, a))
        for k in range(3):  # 流れ星
            x, y = rnd.randrange(w // 3, w), rnd.randrange(h // 10, h // 2); L = rnd.randint(w // 6, w // 3)
            for i in range(L): d.point((x - i, y + i * .45), (255, 255, 255, int(255 * (1 - i / L))))
        return im
    def cafe(w, h):
        im = Image.new('RGB', (w, h), (250, 240, 222)); d = ImageDraw.Draw(im)
        for y in range(0, h, 120):
            for x in range(0, w, 120):
                ox = 60 if (y // 120) % 2 else 0; d.ellipse([x + ox - 16, y - 16, x + ox + 16, y + 16], (214, 176, 140))
        return im
    out = []
    for name, im in [('night-sky-phone', night(1170, 2532, 1)), ('night-sky-pc', night(1920, 1080, 2)), ('cafe-dots-phone', cafe(1170, 2532))]:
        b = io.BytesIO(); im.save(b, 'JPEG', quality=84, optimize=True, progressive=True); files[name + '.jpg'] = b.getvalue(); out.append(im)
    files['README.txt'] = '壁紙 3 枚（スマホ 1170×2532／パソコン 1920×1080）。\n\n' + LICENSE
    z = make_zip('socafe-wallpapers.zip', files)
    sheet = Image.new('RGB', (640, 300), (255, 250, 242))
    sheet.paste(out[0].resize((128, 277)), (14, 12)); sheet.paste(out[1].resize((320, 180)), (156, 60)); sheet.paste(out[2].resize((128, 277)), (494, 12))
    item(id='wallpapers', cat='bg', title='壁紙 3枚（スマホ・PC）', desc='流れ星の夜空（スマホ・PC）と、カフェの水玉。ロック画面やデスクトップに。', fmt='JPEG', file=z.name, prev=preview(sheet, 'wallpapers.webp', 640), n=3)

# ---------------------------------------------------------------- 6) 窓とふきだしの枠
def frames():
    files = {}; shots = []
    def win(w, h, title_col):
        im = Image.new('RGBA', (w, h), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
        d.rectangle([0, 0, w - 1, h - 1], (192, 192, 192)); d.line([(0, 0), (w - 1, 0)], (255, 255, 255)); d.line([(0, 0), (0, h - 1)], (255, 255, 255))
        d.line([(0, h - 1), (w - 1, h - 1)], (10, 10, 10)); d.line([(w - 1, 0), (w - 1, h - 1)], (10, 10, 10))
        for x in range(3, w - 3):  # タイトルバー（グラデーション）
            t = (x - 3) / (w - 6); c = tuple(int(a + (b - a) * t) for a, b in zip(title_col[0], title_col[1])); d.line([(x, 3), (x, 21)], c)
        for i, bx in enumerate([w - 58, w - 40, w - 22]):
            d.rectangle([bx, 6, bx + 15, 18], (192, 192, 192)); d.line([(bx, 6), (bx + 15, 6)], (255, 255, 255)); d.line([(bx, 6), (bx, 18)], (255, 255, 255)); d.line([(bx, 18), (bx + 15, 18)], (60, 60, 60)); d.line([(bx + 15, 6), (bx + 15, 18)], (60, 60, 60))
        d.rectangle([5, 25, w - 6, h - 6], (255, 255, 255)); d.line([(5, 25), (w - 6, 25)], (128, 128, 128)); d.line([(5, 25), (5, h - 6)], (128, 128, 128))
        return im
    for name, size, col in [('window-blue-600x400', (600, 400), ((0, 0, 128), (16, 132, 208))), ('window-pink-600x400', (600, 400), ((160, 0, 90), (255, 110, 180))), ('window-blue-320x240', (320, 240), ((0, 0, 128), (16, 132, 208)))]:
        im = win(*size, col); files['window/' + name + '.png'] = png(im); shots.append(im)
    def bubble(w, h, tail_left, fill, line):
        im = Image.new('RGBA', (w, h + 24), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
        d.rounded_rectangle([2, 2, w - 3, h - 3], 24, fill, line, 3)
        tx = w // 4 if tail_left else w * 3 // 4
        d.polygon([(tx - 14, h - 5), (tx + 14, h - 5), (tx + (-6 if tail_left else 6), h + 20)], fill, line)
        d.line([(tx - 12, h - 4), (tx + 12, h - 4)], fill, 4)
        return im
    for name, a in [('bubble-white-left', (True, (255, 255, 255), (30, 30, 30))), ('bubble-white-right', (False, (255, 255, 255), (30, 30, 30))), ('bubble-yellow-left', (True, (255, 255, 225), (30, 30, 30))), ('bubble-cafe-right', (False, (255, 247, 230), (120, 72, 40)))]:
        im = bubble(420, 200, *a); files['bubble/' + name + '.png'] = png(im); shots.append(im)
    files['README.txt'] = 'レトロな窓の枠 3 種と、ふきだし 4 種（PNG・背景は透明）。\n中に文字や画像を入れて使ってください。\n\n' + LICENSE
    z = make_zip('socafe-frames.zip', files)
    sheet = Image.new('RGBA', (660, 300), (255, 250, 242, 255))
    sheet.alpha_composite(shots[0].resize((300, 200)), (10, 10)); sheet.alpha_composite(shots[1].resize((300, 200)), (40, 90))
    for i, s in enumerate(shots[3:7]): sheet.alpha_composite(s.resize((150, 80)), (350 + (i % 2) * 155, 20 + (i // 2) * 120))
    item(id='frames', cat='icon', title='レトロな窓とふきだし 7種', desc='Windows 95 っぽい窓の枠（青・ピンク）と、まるいふきだし。サムネイルや資料づくりに。', fmt='PNG（透明）', file=z.name, prev=preview(sheet, 'frames.webp', 660), n=7)

if __name__ == '__main__':
    banners(); icons(); patterns(); sounds(); wallpapers(); frames()
    for it in ITEMS: it['bytes'] = (DL / it['file']).stat().st_size
    (R / 'socafe' / 'free.js').write_text('/* 素カフェの無料素材（tools/build_socafe.py が作る。手で書きかえない） */\nwindow.SOCAFE_FREE = ' + json.dumps(ITEMS, ensure_ascii=False) + ';\n', encoding='utf-8')
    for it in ITEMS: print('%-12s %-28s %7.1f KB' % (it['id'], it['file'], it['bytes'] / 1024))
