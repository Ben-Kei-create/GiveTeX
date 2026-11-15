"""ゴールドのドット絵「G」アイコンを生成する。usage: python3 -I gold_g.py <出力先>"""
import sys, random, pathlib
from PIL import Image, ImageDraw
OUT = pathlib.Path(sys.argv[1]); OUT.mkdir(parents=True, exist_ok=True)
OUTLINE=(58,26,0,255); EXTR=(170,84,0,255); EXTR2=(122,56,0,255)
GRAD=[(255,247,196),(255,232,120),(255,210,63),(250,184,20),(236,150,0)]   # 上→下
SHINE=(255,255,236,255); SPARK=(255,255,255,255)

def g_mask(n, box, t, bar, skew):
    """n×n のマスクに太い G を描く（box=(x0,y0,x1,y1) 外枠、t=線の太さ、bar=横棒の y 範囲）"""
    x0,y0,x1,y1 = box; m=[[0]*n for _ in range(n)]
    for y in range(y0,y1+1):
        for x in range(x0,x1+1):
            inner = x0+t <= x <= x1-t and y0+t <= y <= y1-t
            ring = not inner
            if ring and x > x1-t and y0+t <= y < bar[0]: ring = False          # 右上の切れ目
            if ring and x > x1-t and y0 < y < y0+t and y > y0+t-2: pass
            barp = bar[0] <= y <= bar[1] and x0+(x1-x0)//2 - (1 if n>20 else 0) <= x <= x1
            if ring or barp: m[y][x]=1
    # 角を少し落とす（ドット絵らしく）
    c = 2 if n > 20 else 1
    for (cx,cy,dx,dy) in [(x0,y0,1,1),(x1,y0,-1,1),(x0,y1,1,-1),(x1,y1,-1,-1)]:
        for i in range(c):
            for j in range(c-i): 
                if 0<=cy+dy*i<n and 0<=cx+dx*j<n: m[cy+dy*i][cx+dx*j]=0
    # 斜体（下ほど左へ）
    out=[[0]*n for _ in range(n)]
    for y in range(n):
        sh = round((y1 - y) * skew) if y <= y1 else 0
        for x in range(n):
            if m[y][x] and 0 <= x+sh < n: out[y][x+sh]=1
    return out

def render(n, box, t, bar, skew, ext, spark):
    m = g_mask(n, box, t, bar, skew)
    img = Image.new('RGBA',(n,n),(0,0,0,0)); px = img.load()
    on = lambda x,y: 0<=x<n and 0<=y<n and m[y][x]
    ext_on = lambda x,y: any(on(x-k,y-k) for k in range(1,ext+1))
    shape = lambda x,y: on(x,y) or ext_on(x,y)
    ys=[y for y in range(n) for x in range(n) if m[y][x]]; top,bot=min(ys),max(ys)
    for y in range(n):
        for x in range(n):
            if on(x,y):
                k = (y-top)/max(1,bot-top); col = GRAD[min(len(GRAD)-1,int(k*len(GRAD)))]
                px[x,y] = col+(255,)
            elif ext_on(x,y):
                px[x,y] = EXTR if any(on(x-k,y-k) for k in range(1,max(2,ext))) else EXTR2
    # 輪郭
    for y in range(n):
        for x in range(n):
            if not shape(x,y) and any(shape(x+dx,y+dy) for dx,dy in [(1,0),(-1,0),(0,1),(0,-1)]):
                px[x,y] = OUTLINE
    # 左上のふちに光
    for y in range(n):
        for x in range(n):
            if on(x,y) and (not on(x-1,y) or not on(x,y-1)) and y < top+(bot-top)*0.55:
                px[x,y] = SHINE
    # キラッ
    if spark:
        sx,sy,r = spark
        for d in range(-r,r+1):
            for (x,y) in [(sx+d,sy),(sx,sy+d)]:
                if 0<=x<n and 0<=y<n: px[x,y]=SPARK
    return img

g16 = render(16, (2,1,13,14), 2, (8,9), 0.08, 1, (14,1,1))
g32 = render(32, (4,2,27,28), 4, (15,18), 0.12, 1, (28,3,2))
g48 = g32.resize((48,48), Image.NEAREST)
g16.save(OUT/'favicon-16.png'); g32.save(OUT/'favicon-32.png')
g32.resize((48,48),Image.NEAREST).save(OUT/'favicon-48.png')
# favicon.ico（16/32/48）
g48.save(OUT.parent.parent/'favicon.ico', sizes=[(16,16),(32,32),(48,48)], append_images=[g16,g32])
Image.open(OUT.parent.parent/'favicon.ico')
# ホーム画面用：星空タイル＋ゴールドG
def tile(size):
    random.seed(5)
    bg = Image.new('RGBA',(size,size),(8,10,48,255)); d=ImageDraw.Draw(bg)
    for i in range(size):  # 上ほど少し明るい
        a = int(30*(1-i/size)); d.line([(0,i),(size,i)], fill=(8+a,10+a,48+a*2,255))
    for _ in range(size//6):
        x,y=random.randrange(size),random.randrange(size); s=max(1,size//180)
        d.rectangle([x,y,x+s,y+s], fill=random.choice([(255,255,255,255),(255,240,170,255),(170,220,255,255)]))
    g = g32.resize((int(size*0.78),)*2, Image.NEAREST)
    o = (size-g.width)//2
    bg.alpha_composite(g,(o,o+size//60))
    return bg
for s,name in [(180,'apple-touch-icon.png'),(192,'icon-192.png'),(512,'icon-512.png')]:
    tile(s).convert('RGB').save(OUT/name)
# 見本（拡大）
sheet = Image.new('RGBA',(16*12+32*8+40, 32*8+20),(30,30,40,255))
sheet.alpha_composite(g16.resize((16*12,16*12),Image.NEAREST),(10,10)); sheet.alpha_composite(g32.resize((32*8,32*8),Image.NEAREST),(16*12+30,10))
sheet.save(sys.argv[2] if len(sys.argv)>2 else OUT/'_preview.png')
print('ok')
