"""GiveTex 90年代風ページを生成する。usage: python3 -I build_retro.py <repo> <books_all.json>"""
import sys, re, json, html, pathlib, datetime
R = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else pathlib.Path(__file__).resolve().parents[1]
BOOKS = json.load(open(sys.argv[2] if len(sys.argv) > 2 else pathlib.Path(__file__).with_name('books_all.json')))
E = html.escape

# ---------------- 共通パーツ ----------------
DOCTYPE = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">'
HEAD = '''<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="Content-Style-Type" content="text/css">
<meta http-equiv="Content-Script-Type" content="text/javascript">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="theme-color" content="#000080">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DotGothic16&amp;family=VT323&amp;display=swap" rel="stylesheet">
<link rel="stylesheet" type="text/css" href="/assets/retro.css">
<script type="text/javascript" src="/assets/retro.js"></script>
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/assets/icon/favicon-32.png">
<link rel="apple-touch-icon" href="/assets/icon/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<script src="/assets/ga.js" defer></script>'''
NAV = [('/', 'HOME'), ('/apps/', 'アプリ'), ('/books/', 'ドパ読！'), ('/doron/', 'どろん'), ('/note/', 'note'), ('/stamp/', 'スタンプ'), ('/#booths', 'ブース'),
       ('/diary/', '開発日記'), ('/#articles', '記事'), ('/about.html', '管理人')]
NEWS = ('★☆★ ようこそ GiveTex のホームページへ！ ★☆★　'
        '11/15　ホームページを90年代風にリニューアルしました！　◆　'
        'Kindle本「ドパ読！」96冊を書庫にならべました　◆　'
        'オカルトブース「<a href="/doron/">どろん</a>」オープン！ Cサークルの新企画「十人奇談」準備中…　◆　'
        '<a href="/note/">note ブース</a>はじめました　◆　<a href="/stamp/">スタンプブース</a>オープン　◆　'
        'このホームページはリンクフリーです　★☆★')

def header(cur):
    AC = ' aria-current="page"'
    nav = ''.join(f'<a href="{h}"{AC if h == cur else ""}>{t}</a>' for h, t in NAV)
    return f'''<a name="top" id="top"></a>
<div class="r-head">
<a class="r-logo-link" href="/"><span class="r-logo">GiveTex</span></a>
<div class="r-sub">～ <b>教育</b> × <b>IT</b> の ホームページ ～</div>
<marquee class="r-news" scrollamount="5" scrolldelay="60">{NEWS}</marquee>
<div class="r-nav">{nav}</div>
</div>'''

FOOTER = '''<div class="r-foot">
<hr class="r-hr">
<div class="bnrs">
<a href="/"><img src="/assets/retro/bnr-givetex.gif" width="88" height="31" alt="GiveTex"></a>
<a href="/books/"><img src="/assets/retro/bnr-dopayomi.gif" width="88" height="31" alt="ドパ読！"></a>
<a href="/doron/"><img src="/assets/retro/bnr-doron.gif" width="88" height="31" alt="どろん"></a>
<img src="/assets/retro/koujichu.gif" width="88" height="31" alt="工事中">
</div>
<p>当サイトは<b>リンクフリー</b>です。バナーはお持ち帰りOK！<br>推奨環境：画面サイズ 800×600 以上 ／ 文字サイズ「中」</p>
<p><a href="/about.html">管理人について</a> ｜ <a href="/privacy.html">プライバシーポリシー</a> ｜ <a href="#top">▲ ページの先頭へ</a></p>
<address>Copyright (C) 2026 GiveTex. All Rights Reserved.<br>このホームページの文章・画像の無断転載を禁止します。</address>
</div>'''

def win(title, body, ico='■', cls='', menu=False, status=None, bodycls=''):
    m = '<div class="win-menu"><span><u>F</u>ファイル</span><span><u>E</u>編集</span><span><u>V</u>表示</span><span><u>H</u>ヘルプ</span></div>' if menu else ''
    st = '<div class="win-status">' + ''.join(f'<span>{x}</span>' for x in status) + '</div>' if status else ''
    return f'''<div class="win {cls}">
<div class="win-t"><span class="ico">{ico}</span><span class="ttl">{title}</span><button class="bt" type="button" onclick="return rWin(this)" aria-label="たたむ">_</button><span class="bt" aria-hidden="true">□</span><span class="bt" aria-hidden="true">×</span></div>
{m}<div class="win-b {bodycls}">
{body}
</div>{st}
</div>'''

def page(path, title, desc, body, cur, pr=False, canonical=None):
    can = canonical or 'https://www.givetex.org' + ('/' + path.replace('index.html', '') if path != 'index.html' else '/')
    doc = f'''{DOCTYPE}
<html lang="ja">
<head>
{HEAD}
<title>{title}</title>
<meta name="description" content="{E(desc)}">
<meta property="og:title" content="{E(title)}">
<meta property="og:description" content="{E(desc)}">
<meta property="og:type" content="website">
<meta property="og:locale" content="ja_JP">
<link rel="canonical" href="{can}">
</head>
<body>
{'<div class="pr-banner">当サイトはアフィリエイト広告を利用しています</div>' if pr else ''}
{header(cur)}
{body}
{FOOTER}
</body>
</html>
'''
    (R / path).parent.mkdir(parents=True, exist_ok=True)
    (R / path).write_text(doc)
    print('wrote', path)

NEWGIF = '<img src="/assets/retro/new.gif" width="30" height="13" alt="NEW!">'
WD = '日月火水木金土'
def jdate(iso):
    d = datetime.date.fromisoformat(iso)
    return f'{d.year}/{d.month:02d}/{d.day:02d}({ "月火水木金土日"[d.weekday()] })'

# ---------------- データ ----------------
RELEASED = [
 ('/apps/ionstep/', '/apps/ionstep/images/icon.jpg', 'イオンステップ', '高校化学の電気分解と酸化・還元を、反応式を組み立てながら学ぶ。', 'https://apps.apple.com/jp/app/id6821881917'),
 ('/apps/heydrum/', '/apps/heydrum/images/icon.jpg', 'HeyDrum！', 'ドラムの合図のあとで文章を読み上げる。白い画面に大きな文字。', 'https://apps.apple.com/jp/app/id6824921157'),
 (None, '/assets/store/awstudy-clf.jpg', 'AWSTUDY(CLF)', 'AWSの基礎を2択クイズで。3ステージ・全60問、回答ごとにポイント解説。', 'https://apps.apple.com/jp/app/id6819971113'),
 (None, '/assets/store/pokephysics.jpg', 'PokePhysics', '高校物理の公式を、記号の意味・成立条件・例題と一緒にすばやく確認。', 'https://apps.apple.com/jp/app/id6778082145'),
 ('/apps/linatex/', '/apps/linatex/images/icon.jpg', 'LinaTeX', 'Linuxコマンドを、レッスン・クイズ・実践シナリオで身につける。', 'https://apps.apple.com/jp/app/id6775100355'),
 ('/apps/onitan/', '/assets/store/onitan.jpg', 'OniTan(Pre1)', '漢字検定準1級の合格をめざす本格学習アプリ。', 'https://apps.apple.com/jp/app/id6760243558'),
 ('/apps/beerquiz/', '/apps/beerquiz/images/icon.jpg', 'ビール雑学クイズ', '注ぎ方・スタイル・醸造まで、初級〜上級の125問。', 'https://apps.apple.com/jp/app/id6759665291'),
]
DEV = [
 ('aws-saa-dojo', 'SAA 設計道場', 'AWS設計判断トレーナー。10問ずつ何度でも。'),
 ('awstady-saa', 'AWSSTUDY(SAA)', 'AWSの設計判断を理由から学ぶ3択クイズ。'),
 ('minigamer', 'MiniGamer', '本棚から選んですぐ遊べるミニゲーム集。'),
 ('kuragoyomi', '蔵ごよみ', '日本酒を1日ひとつ、約60日で学ぶ。'),
 ('uzacal', 'UzaCal', '毒舌キャラが話しかける電卓。'),
 ('winequiz', 'ワイン雑学クイズ', 'ぶどう品種・産地・醸造の125問。'),
 ('zayping', 'Zayping', '雑学の一文をタイプするMac向けゲーム。'),
 ('terra', 'TERRA', '世界の7人の選択をたどるMac向け物語。'),
 ('yomuemo', 'よむエモ', '名作文学を、感情で読む。'),
 ('paperstory', 'PaperStory', '紙を引き出して読む、物語のアプリ。'),
 ('doparika', 'ドパリカ！', '中学理科の2択クイズ。'),
]
ARTICLES = [
 ('/articles/claude-chatgpt-gemini-comparison.html', 'Claude vs ChatGPT vs Gemini｜プログラミング学習に最適なAIはどれ？【2026年版】'),
 ('/articles/ai-middle-school-science.html', '中学生の理科学習にAIを使ってみた結果【教室で検証】'),
 ('/articles/programming-learning-comparison.html', 'プログラミング学習サービス比較｜独学・スクール・AI、どれが最適？【2026年版】'),
 ('/articles/ai-image-generation-guide.html', 'AIで画像生成を始める方法｜無料ツールから有料サービスまで比較【初心者向け】'),
 ('/articles/blog-monetization-guide.html', '副業でブログを始める完全ガイド｜ゼロから収益化までの手順【2026年版】'),
 ('/articles/ai-meeting-notes-tools.html', 'AI議事録ツールの選び方｜会議の記録を自動化する方法【2026年版】'),
]
KIDAN_PHOTOS = [('/doron/img/jyunin-kidan-fuda.webp', '十人奇談 前半・後半の札', 989, 1400),
                ('/doron/img/jyunin-kidan-cards.webp', '怪談・奇談・雑談 の題名カード', 1400, 822)]

# 日記：既存の日記ページから読み込み、新しい記事を足す
src = (R / 'diary/index.html').read_text()
DIARY = []
for m in re.finditer(r'<time datetime="([^"]+)">.*?</time><span class="chip[^"]*">([^<]+)</span></div>\s*<h3>(.*?)</h3>\s*(.*?)</article>', src, re.S):
    DIARY.append(dict(date=m.group(1), tag=m.group(2).replace('🎉 ', ''), title=m.group(3), body=m.group(4).strip()))
if not DIARY:  # すでに90年代版になっている場合は保存データから
    DIARY = json.loads((pathlib.Path(__file__).parent / 'diary.json').read_text())
else:
    (pathlib.Path(__file__).parent / 'diary.json').write_text(json.dumps(DIARY, ensure_ascii=False))
NEW_ENTRIES = [
 dict(date='2026-11-15', tag='ブース', title='ブースを5つ一気に開設',
      body='<p>「<a href="/game/">ゲーム</a>」「<a href="/museum/">美術館</a>」「<a href="/ramen/">ラーメン</a>」「<a href="/movie/">映画（C-Log Web）</a>」、それからサイトの裏側の「<a href="/bookmarks/">ブックマーク</a>」ブースを作りました。ゲームはコインあつめ、ラーメンはスクロールで麺がのびます。中身はこれから少しずつ。note ブースには TALES の連載『島の灯台と猫』も並べました。</p>'),
 dict(date='2026-11-15', tag='スタンプ', title='スタンプブースをつくりました',
      body='<p>つくった LINE スタンプを紹介する「<a href="/stamp/">スタンプブース</a>」を作りました。グループトークの中に入ったような画面で、スタンプを選んで送ってためせます（送ったものは画面の中だけで、どこにも送信されません）。heatshimmer の名前で出している18セット・248種類を並べました。</p>'),
 dict(date='2026-11-15', tag='note', title='note の過去記事を349本、まるごと移植',
      body='<p>2021年から note に書いてきた記事349本を、<a href="/note/">note ブース</a>に移しました。年ごとの目次、タグ、検索から読めます。Java の勉強記録などはコードも読みやすく整えました。有料記事（30本）は無料部分だけをのせて、続きは note へご案内しています。</p>'),
 dict(date='2026-11-15', tag='note', title='note ブースをはじめました',
      body='<p>NingentteWinner の名前で note に5年ほど書いてきた創作を、こちらにも置いていくための「<a href="/note/">note ブース</a>」を作りました。とにかく読みやすさ優先で、背景（白・セピア・黒）、文字の大きさ、明朝／ゴシックを切り替えられます。記事はこれから少しずつ移していきます。</p>'),
 dict(date='2026-11-15', tag='アプリ', title='アプリのページを、すっきりしたデザインに',
      body='<p><a href="/apps/">アプリのページ</a>だけ、白と黒を切り替えられるシンプルなデザインにしました。各アプリのサポート・プライバシーのページも同じ見た目です。</p>'),
 dict(date='2026-11-15', tag='どろん', title='Cサークルの新企画「十人奇談」、準備中',
      body='<p>オカルトブース「<a href="/doron/#c-circle">どろん</a>」のCサークルで、「十人奇談」という企画を考えています。前半・後半の札と、「怪談」「奇談」「雑談」の題名カードを作りました。くわしい内容は決まりしだい、ここと Cサークルのページでお知らせします。</p>',
      photos=KIDAN_PHOTOS),
 dict(date='2026-11-15', tag='サイト', title='ホームページを90年代風にリニューアル！',
      body='<p>インターネットが始まったころの「ホームページ」の空気を目指して、まるごと作り直しました。テーブルでレイアウトして、マーキーが流れて、アクセスカウンターが回る、あの感じです。どろんのロゴも3種類になりました。</p>'),
]
have = {(d['date'], d['title']) for d in DIARY}
DIARY = [n for n in NEW_ENTRIES if (n['date'], n['title']) not in have] + DIARY

def photos_html(ps):
    return ''.join(f'<a class="r-photo" href="{s}" target="_blank"><img src="{s}" width="{w}" height="{h}" alt="{E(c)}" loading="lazy">{E(c)}</a>' for s, c, w, h in ps)

def diary_entry(d):
    ph = photos_html(d['photos']) if d.get('photos') else ''
    return f'''<div class="r-diary-entry">
<div class="d">■ {jdate(d['date'])}　[{E(d['tag'])}]</div>
<h3>{d['title']}</h3>
{d['body']}
{'<div>' + ph + '</div>' if ph else ''}
</div>'''

def books_flat():
    return [b for k in BOOKS['cats'] for b in BOOKS['books'][k]]
TOTAL = len(books_flat())

def book(a, m, s, img):
    return f'<a class="r-book" href="https://www.amazon.co.jp/dp/{a}" target="_blank"><img src="{E(img)}" width="110" height="164" alt="{E(m)}の表紙" loading="lazy"><b>{E(m)}</b>{f"<small>{E(s)}</small>" if s else ""}</a>'

def icon(href, img, name, note, dev=False, ext=False):
    t = ' target="_blank"' if ext else ''
    return f'<a class="r-icon" href="{href}"{t}><img src="{img}" width="56" height="56" alt=""><span>{E(name)}</span><small class="{"dev" if dev else ""}">{note}</small></a>'

# ================= トップページ =================
def build_index():
    whats = [
        ('2026-11-15', 'ゲーム・美術館・ラーメン・映画・ブックマークの<a href="/#booths">5ブース</a>を開設', True),
        ('2026-11-15', '<a href="/stamp/">スタンプブース</a>をつくりました', True),
        ('2026-11-15', '<a href="/note/">note ブース</a>に過去の記事349本を移植しました', True),
        ('2026-11-15', '<a href="/note/">note ブース</a>をはじめました（NingentteWinner の創作）', False),
        ('2026-11-15', 'どろん：Cサークルの新企画「<a href="/doron/#c-circle">十人奇談</a>」の素材を公開', True),
        ('2026-11-15', 'ホームページを90年代風にリニューアルしました！', True),
        ('2026-11-15', 'Kindle本「<a href="/books/">ドパ読！</a>」{}冊を書庫に／オカルトブース「<a href="/doron/">どろん</a>」オープン'.format(TOTAL), False),
        ('2026-11-13', '「教育 × IT」の看板でサイトをリニューアル', False),
        ('2026-11-06', '「<a href="/apps/aws-saa-dojo/">AWSTUDY SAA 設計道場</a>」のページを公開', False),
        ('2026-11-05', 'ミニゲーム集「<a href="/apps/minigamer/">MiniGamer</a>」のページを追加', False),
    ]
    rows = ''.join(f'<tr><td class="date">{d.replace("-", "/")}</td><td>{t} {NEWGIF if n else ""}</td></tr>' for d, t, n in whats)
    welcome = f'''<p class="r-big"><script type="text/javascript"><!--
document.write(rGreeting());
//--></script><noscript>ようこそ！</noscript></p>
<p class="r-center"><b>GiveTex</b>（ギブテックス）のホームページへ ようこそ！<br>
ここでは <font color="#ff0066"><b>教育 × IT</b></font> をテーマに、自作のアプリ、Kindle電子書籍「ドパ読！」、<br class="pc">オカルトブース「どろん」、それから開発日記などを置いています。<br>
ゆっくりしていってくださいね。</p>
<table class="r-tbl" summary="数字で見るGiveTex"><tr><th>App Store 公開中</th><th>開発中のアプリ</th><th>ドパ読！</th><th>記事</th></tr>
<tr><td class="r-center"><b>7</b> 本</td><td class="r-center"><b>11</b> 本</td><td class="r-center"><b>{TOTAL}</b> 冊</td><td class="r-center"><b>6</b> 本</td></tr></table>
<p class="r-small r-center">最終更新日：2026年11月15日</p>'''
    apps_icons = ''.join(icon(h or s, img, n, '★公開中', ext=not h) for h, img, n, d, s in RELEASED)
    apps_icons += ''.join(icon(f'/apps/{k}/', f'/apps/{k}/images/icon.jpg', n, '準備中', dev=True) for k, n, d in DEV)
    shelf = ''.join(book(*b) for k in BOOKS['cats'] for b in BOOKS['books'][k][:2])
    diary_top = ''.join(diary_entry(d) for d in DIARY[:3])
    arts = ''.join(f'<li><a href="{h}">{E(t)}</a></li>' for h, t in ARTICLES)
    doron = f'''<p class="r-center"><a href="/doron/"><img src="/doron/img/logo-relics.webp" width="440" height="182" alt="どろん" style="filter:drop-shadow(0 0 10px #ff3355)"></a></p>
<p class="r-center">GiveTex の <b>オカルトブース</b> です。夜の記録はこちらから……</p>
<table class="r-tbl" summary="どろんのブース"><tr><th>ブース</th><th>なにをする？</th></tr>
<tr><td><a href="/doron/#relics">relics</a></td><td>座談会。怪談・うわさ・考察を語り合う</td></tr>
<tr><td><a href="/doron/#reikai">霊界案内所</a></td><td>心霊スポット巡り</td></tr>
<tr><td><a href="/doron/#c-circle">Cサークル</a></td><td>スポット巡り ＋ 発表。新企画「十人奇談」準備中 {NEWGIF}</td></tr></table>'''
    main = (win('ようこそ！ - GiveTex', welcome, '🏠') +
            win("What's New!! - 更新履歴", f'<table class="r-tbl" summary="更新履歴"><tr><th>日付</th><th>更新内容</th></tr>{rows}</table><p class="r-small">→ これまでの更新は <a href="/diary/">開発日記</a> へ</p>', '📢') +
            win('アプリ置き場 - マイ コンピュータ', f'<div class="r-icons">{apps_icons}</div>', '💾', menu=True, status=['18 個のオブジェクト', 'App Store 公開中 7']) +
            win(f'ドパ読！書庫 - Kindle電子書籍 {TOTAL}冊', f'<div class="r-shelf">{shelf}</div><p class="r-center"><a class="r-btn" href="/books/">全{TOTAL}冊を見る &gt;&gt;</a></p>', '📚') +
            win('どろん - オカルトブース', doron, '👻', cls='dark') +
            win('note ブース - NingentteWinner', '<p class="r-center" style="font-size:20px;margin:4px 0"><a href="/note/"><b>NingentteWinner</b></a></p><p class="r-center">note で5年ほど書いてきた創作、<b>349本</b>をこちらにも移しました。<br>読みやすさ優先の、しずかな読書スペースです。</p><p class="r-center"><a class="r-btn" href="/note/">note ブースへ &gt;&gt;</a></p>', '✒') +
            win('スタンプブース - グループトーク', '<p class="r-center">heatshimmer の LINE スタンプ <b>18セット</b>を、<b>グループトーク</b>みたいな画面で紹介しています。<br>スタンプを選んで、送ってためせます。</p><p class="r-center"><a class="r-btn" href="/stamp/">スタンプブースへ &gt;&gt;</a></p>', '💬') +
            '<a name="booths" id="booths"></a>' + win('ブース案内 - GiveTex のなかみ', '<table class="r-tbl" summary="ブース一覧"><tr><th></th><th>ブース</th><th>なにがある？</th></tr><tr><td>💾</td><td><a href="/apps/">アプリ</a></td><td>iPhone / Mac の学習アプリ</td></tr><tr><td>📚</td><td><a href="/books/">ドパ読！</a></td><td>Kindle「30秒で読む」シリーズ</td></tr><tr><td>✒</td><td><a href="/note/">note</a></td><td>NingentteWinner の創作・TALES</td></tr><tr><td>💬</td><td><a href="/stamp/">スタンプ</a></td><td>LINE スタンプのトーク</td></tr><tr><td>🎮</td><td><a href="/game/">ゲーム</a></td><td>つくったゲームとゲームのつぶやき</td></tr><tr><td>🖼</td><td><a href="/museum/">美術館</a></td><td>美術館のつぶやきと来館記録</td></tr><tr><td>🍜</td><td><a href="/ramen/">ラーメン</a></td><td>食べたラーメン。麺がのびる</td></tr><tr><td>🎬</td><td><a href="/movie/">映画</a></td><td>C-Log Web・観た映画の感想</td></tr><tr><td>👻</td><td><a href="/doron/">どろん</a></td><td>オカルトブース</td></tr></table><p class="r-small" style="text-align:right;margin:6px 0 0"><a href="/bookmarks/" title="サイトの裏側">裏口 &gt;_</a></p>', '🗺') +
            '<a name="diary" id="diary"></a>' + win('開発日記 - メモ帳', diary_top + '<p class="r-small">→ <a href="/diary/">日記をぜんぶ読む</a></p>', '📝') +
            '<a name="articles" id="articles"></a>' + win('記事 - AI・学びのお役立ち', f'<ul class="r-list">{arts}</ul>', '📄') +
            '<div class="r-under"><span>🚧 このホームページは いつでも 工事中 です 🚧</span></div>')
    menu = ''.join(f'<a href="{h}">{t}</a>' for h, t in [('/apps/', 'アプリ置き場'), ('/books/', 'ドパ読！書庫'), ('/doron/', 'どろん（オカルト）'), ('/note/', 'note ブース'), ('/stamp/', 'スタンプブース'), ('/game/', 'ゲームブース'), ('/museum/', '美術館ブース'), ('/ramen/', 'ラーメンブース'), ('/movie/', '映画ブース'), ('/diary/', '開発日記'), ('/#articles', 'お役立ち記事'), ('/about.html', '管理人のプロフィール'), ('/privacy.html', 'プライバシー')])
    side = (win('MENU', f'<div class="r-menu">{menu}</div>', '📁', bodycls='') +
            win('カウンター', '<p class="r-center" style="margin:0">あなたは<br><span class="r-counter"><b>0</b><b>0</b><b>0</b><b>0</b><b>0</b><b>1</b></span><br>回目の訪問です</p><p id="r-kiri" class="r-center r-red r-small" style="margin:4px 0 0"></p><p class="r-small r-center" style="margin:4px 0 0">since 2026.03.22</p>', '🔢') +
            win('管理人のプロフィール', '<table class="r-tbl" summary="プロフィール"><tr><th>なまえ</th><td>GiveTex</td></tr><tr><th>テーマ</th><td>教育 × IT</td></tr><tr><th>つくる</th><td>アプリ・Kindle本</td></tr><tr><th>Kindle</th><td>NingentteWinner</td></tr><tr><th>ほか</th><td>オカルト「どろん」</td></tr></table><p class="r-small" style="margin:4px 0 0">→ <a href="/about.html">くわしく</a></p>', '👤') +
            win('いまの時刻', '<p class="r-center" style="margin:0"><span id="r-clock">--:--:--</span></p>', '⏰') +
            win('リンク', '<p class="r-center" style="margin:0"><a href="/"><img src="/assets/retro/bnr-givetex.gif" width="88" height="31" alt="GiveTex"></a><br><span class="r-small">リンクフリーです！<br>バナーはお持ち帰りOK</span></p><p class="r-center" style="margin:6px 0 0"><img src="/assets/retro/koujichu.gif" width="88" height="31" alt="工事中"></p>', '🔗'))
    body = f'''<table class="r-layout" border="0" cellspacing="0" cellpadding="0" summary="レイアウト"><tr>
<td class="r-main" valign="top">
{main}
</td>
<td class="r-side" valign="top" width="210">
{side}
</td>
</tr></table>'''
    page('index.html', 'GiveTex のホームページ ～教育×IT～', 'GiveTex（ギブテックス）は教育×ITのホームページ。自作アプリ、Kindle電子書籍「ドパ読！」、オカルトブース「どろん」、開発日記、AI・学びの記事を置いています。', body, '/', pr=True, canonical='https://www.givetex.org/')

# ================= アプリ置き場 =================
def build_apps():
    def row(h, img, n, d, store, dev=False):
        name = f'<a href="{h}">{E(n)}</a>' if h else E(n)
        links = ([f'<a href="{h}">くわしく</a>'] if h else []) + ([f'<a href="{store}" target="_blank">App Store</a>'] if store else [])
        st = '<font color="#808080">準備中</font>' if dev else '<font color="#008000"><b>★公開中</b></font>'
        return f'<tr><td align="center" width="64"><img src="{img}" width="48" height="48" alt="" style="border-radius:10px"></td><td><b>{name}</b><br><span class="r-small">{E(d)}</span></td><td align="center" nowrap>{st}<br><span class="r-small">{" / ".join(links)}</span></td></tr>'
    r1 = ''.join(row(h, img, n, d, s) for h, img, n, d, s in RELEASED)
    r2 = ''.join(row(f'/apps/{k}/', f'/apps/{k}/images/icon.jpg', n, d, None, True) for k, n, d in DEV)
    body = f'''<div class="r-page">
{win('アプリ置き場 - マイ コンピュータ', f"""<h2 class="r-h">💾 アプリ置き場</h2>
<p>GiveTex で作ったアプリの一覧です。紹介ページ・サポート・プライバシーポリシーもここから見られます。</p>
<h3 class="r-h3">App Store で公開中</h3>
<table class="r-tbl" summary="公開中のアプリ"><tr><th></th><th>アプリ</th><th>状態</th></tr>{r1}</table>
<h3 class="r-h3">開発中・リリース準備中</h3>
<table class="r-tbl" summary="開発中のアプリ"><tr><th></th><th>アプリ</th><th>状態</th></tr>{r2}</table>""", '💾', menu=True, status=['18 個のオブジェクト', 'App Store 公開中 7 / 準備中 11'])}
</div>'''
    page('apps/index.html', 'アプリ置き場 | GiveTex', 'GiveTexが開発・提供しているアプリの一覧です。App Storeで公開中のアプリと、開発中のアプリを紹介しています。', body, '/apps/')

# ================= ドパ読！書庫 =================
def build_books():
    AUTH = 'https://www.amazon.co.jp/s?i=digital-text&amp;rh=p_27%3ANingentteWinner&amp;s=date-desc-rank'
    jump = ' ｜ '.join(f'<a href="#{k}">{E(n)}（{len(BOOKS["books"][k])}）</a>' for k, n in BOOKS['cats'].items())
    cats = ''.join(f'<a name="{k}" id="{k}"></a>' + win(f'{E(n)} - {len(BOOKS["books"][k])}冊', '<div class="r-shelf">' + ''.join(book(*b) for b in BOOKS['books'][k]) + '</div><p class="r-small" style="text-align:right;margin:0"><a href="#top">▲ 上へ</a></p>', '📚') for k, n in BOOKS['cats'].items())
    intro = f'''<p class="r-big" style="font-size:40px;color:#ff0066">ドパ読<font color="#3d63ff">！</font></p>
<p class="r-center"><b>Kindle電子書籍「ドパ読！」</b>へようこそ。<br>1話30秒で、脳にドーパミン。ひとつのテーマを10話に分けて、神話・名作・偉人・歴史・科学・心理まで、<br class="pc">ちょうどいい短さで読める <font color="#ff0066"><b>「30秒で読む」シリーズ</b></font> を <b>{TOTAL}冊</b> ならべています。</p>
<table class="r-tbl" summary="著者"><tr><th>著者名</th><td><b>NingentteWinner</b>（Kindleでの名義）</td></tr>
<tr><th>どんな本？</th><td>学校教育とIT開発の経験をいかし、むずかしいテーマを短く、おもしろく。AIを相棒に企画・執筆しています。</td></tr>
<tr><th>買える場所</th><td><a href="{AUTH}" target="_blank">Amazon の著者ページで全作品を見る</a></td></tr></table>
<p class="r-jump">ジャンル：{jump}</p>'''
    body = f'''<div class="r-page">
{win(f"ドパ読！書庫 - Kindle電子書籍 {TOTAL}冊", intro, "📚")}
{cats}
<p class="r-small" style="color:#ccc">※ 日本語版を掲載しています（{TOTAL}冊・2026年11月時点）。英語版・ドイツ語版・スペイン語版や最新刊は Amazon の著者ページへ。価格・Kindle Unlimited 対象かどうかは Amazon でご確認ください。</p>
</div>'''
    page('books/index.html', 'ドパ読！ Kindle電子書籍 | GiveTex', f'Kindle電子書籍「ドパ読！」。NingentteWinner名義の「30秒で読む」シリーズ全{TOTAL}冊。神話・名作・人物・歴史・科学・心理を、1話30秒で。', body, '/books/')

# ================= 開発日記 =================
def build_diary():
    months = {}
    for d in DIARY:
        months.setdefault(d['date'][:7], []).append(d)
    idx = ' ｜ '.join(f'<a href="#m{k.replace("-", "")}">{int(k[:4])}年{int(k[5:])}月</a>' for k in months)
    parts = ''.join(f'<a name="m{k.replace("-", "")}" id="m{k.replace("-", "")}"></a><h2 class="r-h">{int(k[:4])}年{int(k[5:])}月</h2>' + ''.join(diary_entry(d) for d in v) for k, v in months.items())
    body = f'''<div class="r-page">
{win('開発日記 - メモ帳', f'<p>何をつくって、何を直して、何をリリースしたか。GiveTex の制作日記です。新しい順に並んでいます。</p><p class="r-jump">過去ログ：{idx}</p><hr class="r-hr">{parts}', '📝', menu=True, status=[f'{len(DIARY)} 件の日記', '最終更新 2026/11/15'])}
</div>'''
    page('diary/index.html', '開発日記 | GiveTex', 'GiveTexの開発日記。学習アプリのリリース、サイト更新、Kindle出版、オカルトブース「どろん」など、つくる過程の記録です。', body, '/diary/')

# ================= 管理人のプロフィール =================
def build_about():
    AUTH = 'https://www.amazon.co.jp/s?i=digital-text&amp;rh=p_27%3ANingentteWinner&amp;s=date-desc-rank'
    body = f'''<div class="r-page">
{win('管理人のプロフィール - GiveTex', f"""<h2 class="r-h">👤 このホームページについて</h2>
<p><b>GiveTex</b>（ギブテックス）は「Give（与える）× Education × Technology」を掛け合わせた造語です。<br>
<font color="#ff0066"><b>教育 × IT</b></font> をテーマに、学びを形にして届けることを目標にしています。</p>
<h3 class="r-h3">やっていること</h3>
<table class="r-tbl" summary="活動"><tr><th>コーナー</th><th>内容</th></tr>
<tr><td><a href="/apps/">アプリ置き場</a></td><td>漢検・化学・物理・AWS・Linuxなど、学べる iPhone / Mac アプリ</td></tr>
<tr><td><a href="/books/">ドパ読！</a></td><td>Kindle電子書籍。著者名 NingentteWinner で「30秒で読む」シリーズを出版</td></tr>
<tr><td><a href="/doron/">どろん</a></td><td>オカルトブース。座談会と心霊スポット巡り、その発表の記録</td></tr>
<tr><td><a href="/diary/">開発日記</a></td><td>つくる過程とリリースの記録</td></tr>
<tr><td><a href="/#articles">記事</a></td><td>AI・学習ツールの比較とガイド</td></tr></table>
<h3 class="r-h3">プロフィール</h3>
<table class="r-tbl" summary="プロフィール">
<tr><th>テーマ</th><td>教育 × IT</td></tr>
<tr><th>分野</th><td>理科（物理・化学・生物・地学）、資格学習、Webアプリ / iOS・macOSアプリ開発、AIを活用した出版、オカルト（座談会・心霊スポット巡り）</td></tr>
<tr><th>使用技術</th><td>Swift / SwiftUI / Next.js / React / Supabase / Flutter / 生成AI</td></tr>
<tr><th>実績</th><td>App Storeで学習アプリなど7本を公開、Kindle電子書籍「ドパ読！」として「30秒で読む」シリーズを{TOTAL}冊出版（2026年11月時点）</td></tr>
<tr><th>Kindle著者名</th><td><a href="{AUTH}" target="_blank">NingentteWinner</a></td></tr>
</table>
<h3 class="r-h3">お問い合わせ</h3>
<p>アプリ・書籍・記事に関するご質問や、取り上げてほしいテーマのリクエストは、こちらまでお気軽にどうぞ。<br>
📧 メール：contact[at]givetex.org　<span class="r-small">（[at] を @ にかえてね）</span></p>""", '👤')}
</div>'''
    page('about.html', '管理人のプロフィール | GiveTex', 'GiveTex（ギブテックス）は教育×ITをテーマに、学習アプリ・Kindle電子書籍「ドパ読！」・オカルトブース「どろん」・開発日記・記事を発信する個人ホームページです。', body, '/about.html', canonical='https://www.givetex.org/about.html')

build_index(); build_diary(); build_about()  # books は pop デザインのまま（再生成しない）
