"""どろん用「おそろしげ明朝」の軽量版を作り直す（ページの文字が変わったら実行）
usage: <fonttools入りのpython> -I tools/doron_font.py <おそろしげ明朝.ttf>"""
import sys, pathlib, subprocess
R = pathlib.Path(__file__).resolve().parents[1]; SRC = sys.argv[1]; OUT = R / 'doron/fonts'
allc = set()
for a, b in [(0x20, 0x7E), (0x3000, 0x303F), (0x3040, 0x30FF), (0xFF01, 0xFF5E), (0x2010, 0x2027), (0x2190, 0x21FF), (0x25A0, 0x25FF), (0x2600, 0x266F)]:
    allc.update(chr(c) for c in range(a, b + 1))
for hi in range(0x88, 0x99):
    for lo in list(range(0x40, 0x7F)) + list(range(0x80, 0xFD)):
        try: allc.add(bytes([hi, lo]).decode('shift_jis'))
        except Exception: pass
core = set()
for a, b in [(0x20, 0x7E), (0x3000, 0x303F), (0x3040, 0x30FF), (0xFF01, 0xFF5E), (0x2010, 0x2027)]:
    core.update(chr(c) for c in range(a, b + 1))
for f in ['doron/index.html', 'doron/doron.js', 'doron/reports.js']:
    core.update((R / f).read_text())
core = {c for c in core if ord(c) >= 0x20}; allc |= core; rest = allc - core
def ranges(cs):
    cps = sorted(ord(c) for c in cs); out = []; s = p = cps[0]
    for c in cps[1:]:
        if c == p + 1: p = c; continue
        out.append((s, p)); s = p = c
    out.append((s, p))
    return ','.join(f'U+{a:X}' if a == b else f'U+{a:X}-{b:X}' for a, b in out)
tmp = pathlib.Path('/tmp')
for name, cs in [('core', core), ('rest', rest)]:
    (tmp / f'osorosige-{name}.txt').write_text(''.join(sorted(cs)))
    subprocess.run([sys.executable, '-m', 'fontTools.subset', SRC, f'--text-file={tmp}/osorosige-{name}.txt', f'--output-file={OUT}/osorosige-{name}.woff2',
                    '--flavor=woff2', '--layout-features=*', '--no-hinting', '--desubroutinize'], check=True, stderr=subprocess.DEVNULL)
css = (OUT / 'osorosige.css').read_text().split('@font-face')[0]
css += f'@font-face{{font-family:"OsorosigeMincho GiveTex";src:url("/doron/fonts/osorosige-core.woff2") format("woff2");font-display:swap;unicode-range:{ranges(core)}}}\n'
css += f'@font-face{{font-family:"OsorosigeMincho GiveTex";src:url("/doron/fonts/osorosige-rest.woff2") format("woff2");font-display:swap;unicode-range:{ranges(rest)}}}\n'
css += ':root{--scary:"OsorosigeMincho GiveTex","Shippori Mincho B1","Hiragino Mincho ProN","Yu Mincho",serif}\n'
(OUT / 'osorosige.css').write_text(css)
print('core', len(core), 'rest', len(rest))
