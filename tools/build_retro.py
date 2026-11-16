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
<script src="/assets/img-fallback.js"></script>
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/assets/icon/favicon-32.png">
<link rel="apple-touch-icon" href="/assets/icon/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<script src="/assets/ga.js" defer></script>'''
NAV = [('/', 'HOME'), ('/apps/', 'アプリ'), ('/books/', 'ドパ読！'), ('/doron/', 'どろん'), ('/note/', 'note'), ('/stamp/', 'スタンプ'), ('/#booths', 'ブース'),
       ('/diary/', '開発日記'), ('/#articles', '記事'), ('/about.html', '管理人')]
NEWS = ('★☆★ ようこそ GiveTex のホームページへ！ ★☆★　'
        'Kindle本「ドパ読！」96冊を書庫にならべました　◆　'
        'オカルトブース「<a href="/doron/">どろん</a>」オープン！ Cサークルの新企画「十人奇談」準備中…　◆　'
        '<a href="/note/">note ブース</a>はじめました　◆　<a href="/stamp/">スタンプブース</a>オープン　◆　'
        'このホームページはリンクフリーです　★☆★')

def header(cur):
    AC = ' aria-current="page"'
    nav = ''.join(f'<a href="{h}"{AC if h == cur else ""}>{t}</a>' for h, t in NAV)
    return f'''<a name="top" id="top"></a>
<div class="r-head" role="banner">
<a class="r-logo-link" href="/"><span class="r-logo">GiveTex</span></a>
<div class="r-sub">～ <b class="give">GIVE教育！</b> <b>教育</b> × <b>IT</b> の ホームページ ～</div>
<marquee class="r-news" scrollamount="5" scrolldelay="60">{NEWS}</marquee>
<div class="r-nav" role="navigation" aria-label="メニュー">{nav}</div>
</div>'''

FOOTER = '''<div class="r-foot" role="contentinfo">
<hr class="r-hr">
<div class="bnrs">
<a href="/"><img src="/assets/retro/bnr-givetex.gif" width="88" height="31" alt="GiveTex"></a>
<a href="/books/"><img src="/assets/retro/bnr-dopayomi.gif" width="88" height="31" alt="ドパ読！"></a>
<a href="/doron/"><img src="/assets/retro/bnr-doron.gif" width="88" height="31" alt="どろん"></a>
<img src="/assets/retro/koujichu.gif" width="88" height="31" alt="工事中">
</div>
<p>当サイトは<b>リンクフリー</b>です。バナーはお持ち帰りOK！<br>推奨環境：画面サイズ 800×600 以上 ／ 文字サイズ「中」</p>
<p><a href="/about.html">管理人について</a> ｜ <a href="/privacy.html">プライバシーポリシー</a> ｜ <a href="/contact/">お問い合わせ</a> ｜ <a href="#top">▲ ページの先頭へ</a></p>
<address>Copyright (C) 2026 GiveTex. All Rights Reserved.<br>このホームページの文章・画像の無断転載を禁止します。</address>
</div>'''

def win(title, body, ico='■', cls='', menu=False, status=None, bodycls=''):
    m = '<div class="win-menu"><span><u>F</u>ファイル</span><span><u>E</u>編集</span><span><u>V</u>表示</span><span><u>H</u>ヘルプ</span></div>' if menu else ''
    st = '<div class="win-status">' + ''.join(f'<span>{x}</span>' for x in status) + '</div>' if status else ''
    return f'''<div class="win {cls}">
<div class="win-t"><span class="ico">{ico}</span><span class="ttl">{title}</span><button class="bt bt-min" type="button" aria-label="最小化（たたむ）">_</button><button class="bt bt-max" type="button" aria-label="元の大きさにもどす">□</button><button class="bt bt-x" type="button" aria-label="閉じる（ページを開き直すと元にもどります）">×</button></div>
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
    if path == 'index.html':  # ホームだけ起動画面
        doc = doc.replace('<script src="/assets/img-fallback.js"></script>', '<script src="/assets/img-fallback.js"></script>\n<script src="/assets/boot.js"></script>', 1)
    # 画像は見えるところまで来てから読む（ヘッダーのロゴ・バナーは除く）
    head_end = doc.find('<div class="r-page"') if '<div class="r-page"' in doc else doc.find('</div>', doc.find('class="r-head"'))
    doc = doc[:head_end] + re.sub(r'<img (?![^>]*\bloading=)', '<img loading="lazy" decoding="async" ', doc[head_end:])
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
 dict(date='2022-09-01', when='2022年9月', tag='学習', title='Web と Java の勉強をはじめた',
      body='<ul class="r-list"><li>HTML・CSS・JavaScript・Ruby で Web 制作を練習</li><li>Java の練習用コードやサンプルを書いた</li><li>HTML と画像で電子書籍をつくる実験</li></ul>'),
 dict(date='2022-12-01', when='2022年12月', tag='Web', title='Ruby on Rails で映画レビューサイト「C-Log」',
      body='<ul class="r-list"><li>映画レビューサイト「C-Log（CINEMA-LOG）」を Rails で開発（<a href="https://github.com/Ben-Kei-create/C-Log" target="_blank" rel="noopener">C-Log</a>）。のちの iPhone 版と、<a href="/movie/">映画ブース</a>のもと</li></ul>'),
 dict(date='2024-03-01', when='2024年3月', tag='調査', title='Ruby のゲームと、iPhone アプリのつくり方',
      body='<ul class="r-list"><li>Ruby で小さなゲームをつくる構想</li><li>iPhone アプリをかんたんにつくる方法を調べた</li></ul>'),
 dict(date='2024-10-01', when='2024年10〜11月', tag='ゲーム', title='Unity でゲームづくりをはじめた',
      body='<ul class="r-list"><li>2D シューティング（<a href="https://github.com/Ben-Kei-create/2d-shooting-game" target="_blank" rel="noopener">2d-shooting-game</a>）</li><li>3D ゴルフ（<a href="https://github.com/Ben-Kei-create/3d-golf-game" target="_blank" rel="noopener">3d-golf-game</a>）</li><li>11月には「accumulation_game」（<a href="https://github.com/Ben-Kei-create/accumulation_game" target="_blank" rel="noopener">accumulation_game</a>）</li></ul>'),
 dict(date='2025-01-01', when='2025年1月', tag='学習', title='Java（Spring Boot・MyBatis）を学ぶ',
      body='<ul class="r-list"><li>Spring Boot、MyBatis、API、DI などを勉強</li><li>Ruby／Sinatra でログイン・ログアウトの仕組みを試作</li></ul>'),
 dict(date='2025-03-01', when='2025年3月', tag='Web', title='Java と React／Vue で Web サイト',
      body='<ul class="r-list"><li>Java のサーバーと React／Vue の画面を組み合わせたサイトづくりに着手</li></ul>'),
 dict(date='2025-04-01', when='2025年4月', tag='ゲーム', title='umbrella lovers の素材づくり',
      body='<ul class="r-list"><li>Unity のゲーム「umbrella lovers」の素材を制作（いまの<a href="/game/">ゲームブース</a>のイチオシ）</li></ul>'),
 dict(date='2025-06-01', when='2025年6月', tag='企画', title='ゲーム実況の YouTube 研究と、開発者ブログの企画',
      body='<ul class="r-list"><li>YouTube 向けのタイトル・検索対策・サムネイルを研究</li><li>ゲーム開発者向けのブログサイトを企画</li></ul>'),
 dict(date='2025-07-01', when='2025年7月', tag='企画', title='ネガティブな文をポジティブにする AI メモ帳',
      body='<ul class="r-list"><li>Python で、書いた文章を前向きな言い方に変える AI メモ帳を企画</li></ul>'),
 dict(date='2025-08-01', when='2025年8月', tag='アプリ', title='OniTan の設計と、AI で教育を手伝う仕組み',
      body='<ul class="r-list"><li>漢字学習アプリ「<a href="/apps/onitan/">OniTan</a>」を設計して GitHub で管理</li><li>デジタル断捨離を手伝う iPhone アプリを企画・設計</li><li>スマホから AI 開発ツールを使う方法を調査</li><li>AI で教育ニュースの動画を自動でつくる仕組みを試作</li><li>チャット・復習・進み具合の管理ができる教育 AI を企画</li></ul>'),
 dict(date='2025-09-01', when='2025年9月ごろ', tag='企画', title='返信や文章づくりを手伝う AI ツール',
      body='<ul class="r-list"><li>AI で返信や文章をつくるツールを構想</li></ul>'),
 dict(date='2026-01-01', when='2026年1月', tag='企画', title='個人開発でどう続けるか',
      body='<ul class="r-list"><li>Web と iOS アプリで、つくる手間や費用を比べた</li><li><b>実装は AI にまかせて、自分は企画と判断をする</b>体制を考えはじめた</li></ul>'),
 dict(date='2026-02-01', when='2026年2月', tag='企画', title='ショートカットキーのゲームと、理数系アプリ',
      body='<ul class="r-list"><li>Mac・Windows のショートカットキーを覚えるゲームを設計</li><li>物理・数学の学習アプリを構想</li></ul>'),
 dict(date='2026-03-01', when='2026年3月', tag='企画', title='漢字アプリのデザインと、自動でまわる仕組みの比較',
      body='<ul class="r-list"><li>漢字学習アプリのアイコンや商品デザインを研究</li><li>Kindle・アプリ・動画・オンライン教材を、自動化しやすさで比べた</li></ul>'),
 dict(date='2026-04-01', when='2026年4月', tag='アプリ', title='LinaTeX のビルド成功、日本語学習アプリの研究',
      body='<ul class="r-list"><li>「<a href="/apps/linatex/">LinaTeX</a>」の開発が進み、ビルドに成功</li><li>外国人向けの日本語学習アプリで、どう差をつけるか研究</li><li>Swift で 3D ゲームや 2D ドット絵 RPG がつくれるか調査</li><li>税金の試算ツール「TaxSuite」を検討</li></ul>'),
 dict(date='2026-05-01', when='2026年5月', tag='アプリ', title='落語の紙芝居アプリと springsta',
      body='<ul class="r-list"><li>落語を紙芝居のように紹介するアプリを企画</li><li>Spring の学習アプリ「springsta」を制作</li></ul>'),
 dict(date='2026-06-01', when='2026年6月', tag='Web', title='家計簿の Web ツール',
      body='<ul class="r-list"><li>Web で使える家計簿ツールを検討</li></ul>'),
 dict(date='2026-07-05', when='', tag='Kindle', title='アプリ量産の作戦と、Kindle 出版のはじまり',
      body='<ul class="r-list"><li>SwiftUI のアプリを短い期間でたくさん出す作戦を研究</li><li>市場の大きさ・競合・利益率で、つくる候補を選ぶ方法を設計</li><li>Kindle Create で電子書籍づくりに着手。『30秒で読む イソップ物語』の KDP 登録を進めた（いまの<a href="/books/">ドパ読！</a>のはじまり）</li></ul>'),
 dict(date='2026-07-19', when='', tag='画像', title='画像の二次利用と、ストック素材の研究',
      body='<ul class="r-list"><li>画像の二次利用・クレジット・売り方を検討</li><li>Adobe Stock で AI 生成画像を売るための条件を調査</li><li>ほかのアプリを使いながら答えられる、ミニ調査アプリを構想</li></ul>'),
 dict(date='2026-08-12', when='', tag='Kindle', title='著作権の切れた文学作品を電子書籍に',
      body='<ul class="r-list"><li>パブリックドメインの文学作品を、翻訳して電子書籍にする方法を研究</li></ul>'),
 dict(date='2026-08-24', when='', tag='Kindle', title='画像のファイル名を CSV で一括管理',
      body='<ul class="r-list"><li>本に使う画像のファイル名を、CSV でまとめて管理するツールを試作</li></ul>'),
 dict(date='2026-08-26', when='', tag='企画', title='つくったものを日記とポートフォリオに集める',
      body='<ul class="r-list"><li>これまでの開発・制作を、日記やポートフォリオにまとめる仕組みを構想（この開発日記につながっています）</li></ul>'),
 dict(date='2026-08-31', when='2026年8月末', tag='学習', title='AWS の勉強',
      body='<ul class="r-list"><li>AWS のクラウドサービスと資格試験の勉強をはじめた</li></ul>'),
 dict(date='2026-09-02', when='', tag='Kindle', title='KDP 自動入力が、原稿と表紙のアップロードに対応',
      body='<ul class="r-list"><li>KDP 自動入力ツールを改良して、原稿と表紙のアップロードまでできるように</li></ul>'),
 dict(date='2026-09-08', when='2026/09/03〜08', tag='Kindle', title='Kindle 以外の売り場を広げる',
      body='<ul class="r-list"><li>Kindle 以外で売る方法を研究</li><li>EPUB 形式と、KDP セレクト（独占）の条件を調査</li><li>Apple Books で有料の本を配信できるよう手続き</li></ul>'),
 dict(date='2026-09-13', when='', tag='Kindle', title='KDP 自動入力のハンズオン資料',
      body='<ul class="r-list"><li>KDP 自動入力ツールの解説と、手を動かして学べる資料を制作</li></ul>'),
 dict(date='2026-09-15', when='2026年9月中旬', tag='Kindle', title='本を YouTube Shorts・note・BOOTH にも',
      body='<ul class="r-list"><li>電子書籍に加えて、YouTube Shorts・<a href="/note/">note</a>・BOOTH へ広げる準備</li></ul>'),
 dict(date='2026-10-09', when='2026/10/07〜09', tag='企画', title='出版・動画・教育・アプリをどう組み合わせるか',
      body='<ul class="r-list"><li>電子出版・動画・教育コンテンツを組み合わせた成長の作戦をつくった</li><li>AI・コンテンツ制作・アプリ開発をあわせた方針を整理</li></ul>'),
 dict(date='2026-10-27', when='', tag='企画', title='GitHub の過去作品を棚卸し',
      body='<ul class="r-list"><li>これまで GitHub に置いてきたものを調べて、使い回せる作品を分類（<a href="/bookmarks/">ブックマークブース</a>の github コマンドで概要が見られます）</li></ul><p>新しくつくるだけでなく、<b>これまでつくったものを見直して生かす</b>方針に切りかわった日。C-Log の復活もこの日に決めました。</p>'),
 dict(date='2026-10-31', when='2026年10月末', tag='企画', title='AI がゲームを遊ぶ映像に、実況と編集を付ける',
      body='<ul class="r-list"><li>AI が遊んだゲームの映像に、実況と編集を自動で付ける案を検討</li></ul>'),
 dict(date='2026-11-02', when='2026年11月上旬', tag='AI', title='数学を研究する AI キャラ「トレンチャード」',
      body='<ul class="r-list"><li>数学の研究をする AI キャラクター「トレンチャード」の運用方針を整理</li><li>生成 AI で数学を研究し、論文や動画で発信する方法を研究</li><li>11/15 には、研究用に複数の PC を使う構成も検討</li></ul>'),
 dict(date='2026-11-09', when='2026年11月上旬', tag='学習', title='AWS の基礎資格を取得、次の資格へ',
      body='<ul class="r-list"><li>AWS の基礎資格を取得。Global Accelerator・NLB・UDP などを問題で勉強しながら、次の資格へ</li><li>生成 AI 関連の資格の勉強も検討</li></ul>'),
 dict(date='2026-11-16', when='', tag='ふりかえり', title='2022年からの歩みを、開発日記にまとめた',
      body='<p>これまでの活動を、この開発日記にまとめて移しました。時期ごとの中心はこんな感じです。</p><ul class="r-list"><li><b>2022〜2024年</b>：プログラミングの勉強と、Web・ゲームの個人制作</li><li><b>2025年前半</b>：Java 系の技術、Web 開発、動画の研究</li><li><b>2025年後半</b>：iPhone アプリ、教育ツール、AI に手伝ってもらう制作</li><li><b>2026年1〜6月</b>：アプリをたくさん出すこと、続けるための仕組み、教育サービスの研究</li><li><b>2026年7〜9月</b>：Kindle・Apple Books の出版と、制作工程の自動化</li><li><b>2026年10月</b>：過去の作品の棚卸しと、ゲーム・アプリのつくり直し</li><li><b>2026年11月</b>：AI エージェント、研究用の AI、作業の自動化</li></ul><p>流れでいうと、<b>「技術を学ぶ」→「作品をつくる」→「作品を届ける」→「つくる・届けるを仕組みにする」</b>。</p><p class="r-small">※構想・設計の段階のものもふくみます。完成や公開を確認できたものだけ、リンクを付けています。</p>'),
 dict(date='2026-08-24', tag='Kindle', title='KDP の入力を自動化するツールをつくりはじめた',
      body='<ul class="r-list"><li>Kindle 本の情報を CSV にまとめて、KDP の画面に一括で入力する仕組みを Python と Playwright で検討</li></ul>'),
 dict(date='2026-09-01', tag='Kindle', title='KDP 自動入力ツールを改良',
      body='<ul class="r-list"><li>CSV の項目、AI 生成の申告、シリーズの巻数、カテゴリ選択などの処理を調整</li></ul>'),
 dict(date='2026-09-23', tag='画像', title='海外向けの画像作品「Ruined World Girl」',
      body='<ul class="r-list"><li>Etsy 向けの画像シリーズを、プロンプトを使って生成</li></ul>'),
 dict(date='2026-09-25', tag='Kindle', title="塗り絵の本「A Witch's Year」",
      body='<ul class="r-list"><li>魔女の世界がテーマの塗り絵。表紙・裏表紙・タイトルとサブタイトルのデザインをつくり、中の絵を順に生成</li></ul>'),
 dict(date='2026-09-26', tag='Kindle', title='ゴッホとラーマーヤナの画像',
      body='<ul class="r-list"><li>『ゴッホ、ローヌ川に星を描く』『ラーマーヤナ 第二部・第三部』の表紙・目次・背景・挿絵を制作</li></ul>'),
 dict(date='2026-09-28', tag='Kindle', title='『30秒で読む フランケンシュタイン』の画像',
      body='<ul class="r-list"><li>日本語版・海外版の表紙をふくむ、全27点の生成を指示</li></ul>'),
 dict(date='2026-09-29', tag='画像', title='水彩の「半透明ハイキング」コレクション',
      body='<ul class="r-list"><li>Etsy 向けに、水彩画風の幻想的なハイキングの絵を生成</li></ul>'),
 dict(date='2026-10-03', tag='Kindle', title='『30秒で読む オズの魔法使い』の挿絵',
      body='<ul class="r-list"><li>11枚目からの挿絵の生成を続けた</li></ul>'),
 dict(date='2026-10-04', tag='Kindle', title='水滸伝と鏡の国のアリス。「1プロンプト＝1枚」を徹底',
      body='<ul class="r-list"><li>『30秒で読む 水滸伝』の画像を制作</li><li>いくつもの場面を1枚にまとめず、<b>1つの場面を1枚の画像</b>にするルールを徹底（本に組みこみやすくするため）</li><li>『鏡の国のアリス』の YouTube サムネイル用に、チェス盤がモチーフの画像を制作</li></ul>'),
 dict(date='2026-10-08', tag='Kindle', title='『30秒で読む 海底二万里』の画像',
      body='<ul class="r-list"><li>表紙・背景・アイコン・全面イラストなどを制作</li></ul>'),
 dict(date='2026-10-09', tag='Kindle', title='4冊ぶんの画像を一気に。Wonderloom の作戦も',
      body='<ul class="r-list"><li>『30秒で読む ギルガメッシュ 第一部』：最初の10枚から順に生成</li><li>『30秒で読む ニルスのふしぎな旅』：挿絵と目次の画像</li><li>『30秒で読む 良い意味でヤバいチバ』：23点を少しずつ制作</li><li>『30秒で読む 地底旅行』：11枚目以降も順に生成</li><li>ブランド「Wonderloom」で、漫画づくりと紙の本づくりの流れについて作戦を考えはじめた</li></ul>'),
 dict(date='2026-11-13', tag='Kindle', title='Kindle の画像づくり、ここまでのまとめ',
      body='<p>新しいプロンプトのファイルで、また1枚目から画像づくりを再開。8月からの流れをまとめると、こんな感じです。</p><ul class="r-list"><li><b>本づくり</b>：「30秒で読む」シリーズ（<a href="/books/">ドパ読！</a>）を中心に、文学・神話・人物伝の表紙・目次・背景・アイコン・挿絵を、決まった構成で生成</li><li><b>画像づくりのルール化</b>：1プロンプトにつき1枚。コラージュはつくらない</li><li><b>出版作業の自動化</b>：KDP への登録を CSV と Playwright で自動化中。説明文やカテゴリの入力にはまだ課題あり</li><li><b>これから</b>：Wonderloom での漫画・紙の本の制作フローを検討中</li></ul>'),
 dict(date='2026-11-15', tag='教材', title='高校物理「原子」の授業プリント',
      body='<p>高校物理の「原子」の授業プリント（全27ページ）を確認しました。基礎から共通テストのレベルまで。授業中に書きこむ穴埋め、例題、むずかしさ別の演習を組み合わせた構成です。</p><ul class="r-list"><li>第1章 電子と光：光電効果、X線、コンプトン効果、物質波</li><li>第2章 原子の構造とスペクトル：原子模型、ボーアの理論、エネルギー準位</li><li>第3章 原子核と素粒子：放射性崩壊、半減期、質量欠損、核反応</li><li>巻末：公式まとめ、穴埋め90項目の答え、演習の解説</li></ul>'),
 dict(date='2025-12-15', tag='企画', title='架空アイドルのカードアプリを考えた',
      body='<ul class="r-list"><li>1日1枚、ランダムにカードが出る</li><li>広告を見るともう1回引ける</li><li>集めたカードは保存できる（10枚まで。課金で20枚に、いらないカードは削除）</li></ul>'),
 dict(date='2025-12-24', tag='企画', title='偉人カードゲームの構想',
      body='<ul class="r-list"><li>偉人の知識が読める読み物と、「アルゴ」のような頭脳戦を組み合わせたカードゲーム</li></ul>'),
 dict(date='2026-01-02', tag='ゲーム', title='Unity のサイコロゲームと、AI でつくるゲーム開発',
      body='<ul class="r-list"><li>Unity でサイコロゲームを企画。コードやオブジェクトを AI につくらせて、手作業を減らす方法を考えた</li><li>Unity 以外のエンジンも候補に入れて、プロンプト中心でゲームをつくって売るまでの流れを検討</li></ul>'),
 dict(date='2026-10-04', tag='開発環境', title='Mac で VOICEVOX を起動する',
      body='<ul class="r-list"><li>macOS の安全機能（Gatekeeper）で起動が止められる件と、ターミナルからの起動方法を調べた</li></ul>'),
 dict(date='2026-10-12', tag='開発環境', title='Gemini CLI を入れてみた',
      body='<ul class="r-list"><li>インストールしたものの「command not found」が出て、原因を確認中</li></ul>'),
 dict(date='2026-10-14', tag='ゲーム', title='Toiret の画像素材と、ドパリカ！の最初の設計',
      body='<ul class="r-list"><li>3D脱出ゲーム「Toiret」の素材づくり：ジャズのレコード、お酒のラベル、部屋の飾りなど</li><li>素材を GitHub に追加。回帰テスト22件が通ったことを確認</li><li><a href="/apps/doparika/">ドパリカ！</a>（中学理科・高校入試対策）の基本の仕様とデザインを検討。紙の質感、選択問題、学び方の流れ</li></ul>'),
 dict(date='2026-10-15', tag='アプリ', title='理科の Web サイトを iPhone アプリに',
      body='<ul class="r-list"><li>既存の理科サイト「RikaRikaStudy」を、Swift の iPhone アプリにする方針を決めた。リポジトリと基本設計書を整理</li></ul>'),
 dict(date='2026-10-19', tag='アプリ', title='ヘイドラムと rhythmCoding の企画',
      body='<ul class="r-list"><li><a href="/apps/heydrum/">ヘイドラム</a>：ドラム・金属音・ロボット風の女性の声を鳴らす、シンプルな iPhone アプリを企画</li><li>Swift での実装を前提に、くわしい設計と処理の流れを整理。実装は Claude、レビューは Codex の分担</li><li>rhythmCoding：コードを操作して音楽をつくる DJ アプリを構想。片手操作、画面分割、音のデータの見せ方を検討</li></ul>'),
 dict(date='2026-10-25', tag='アプリ', title='Safe Eye と PageMint の設計',
      body='<ul class="r-list"><li>Safe Eye：Mac のカメラを iPhone から見られるアプリを設計。QR で登録、PIN、Face ID、使える端末の制限</li><li>料金は Basic・Pro のサブスク案と、見られる時間の上限を整理。通信の費用は WebRTC で抑える案</li><li>PageMint：画像を固定レイアウトの電子書籍（EPUB）にする Mac アプリ。SwiftUI で画面デザインをつくり、取りこみ・並べかえ・最適化・EPUB 書き出しの詳細設計書を依頼</li></ul>'),
 dict(date='2026-10-27', tag='アプリ', title='C-Log、復活へ',
      body='<ul class="r-list"><li>2022〜2023年につくった映画レビューサイト「C-Log」を、iPhone アプリとしてつくり直す企画をスタート（Web 版は<a href="/movie/">映画ブース</a>）</li><li>ホーム画面のデザイン案をいくつか出して方向を決定。実装は Claude、レビューと画像は Codex</li></ul>'),
 dict(date='2026-10-29', tag='ゲーム', title='横画面の探索ゲームを設計',
      body='<ul class="r-list"><li>横画面・固定カメラ・片手で遊べる脱出／探索ゲーム。スワイプやタップでの移動、アイテムのストックなど操作を検討</li></ul>'),
 dict(date='2026-11-01', tag='ゲーム', title='彗星の上の RPG',
      body='<ul class="r-list"><li>こわれかけた巨大な彗星の上で暮らす人々の RPG を構想。村から世界へ広がる物語、キャラクターの名前、世界観</li><li>Godot や Blender でのマップ・キャラクターづくり、歩くアニメーションも検討</li></ul>'),
 dict(date='2026-11-02', tag='ゲーム', title='唐揚げを揚げまくるゲーム「Karrage」',
      body='<ul class="r-list"><li>唐揚げを大量に揚げる、ポップなタップゲーム。ギャグ中心のゲームの仕組みを検討</li></ul>'),
 dict(date='2026-11-03', tag='アプリ', title='蔵ごよみのアイコンと、App Store 申請の効率化',
      body='<ul class="r-list"><li>日本酒アプリ（sakeQuiz／<a href="/apps/kuragoyomi/">蔵ごよみ</a>）のアイコンを制作。日本酒の器と富士山を彫刻風に</li><li>配達員風キャラクターのドット絵素材（顔・正面・背面・横）を依頼</li><li>App Store Connect への入力を楽にする申請テンプレートを改訂。初回公開とアップデートの両方で使えるように</li></ul>'),
 dict(date='2026-11-04', tag='アプリ', title='「ひとひら」の素材と、macOS ベータの検討',
      body='<ul class="r-list"><li>紙の質感がベースのアプリ「ひとひら」の画像素材の仕様を整理。生成り色とテラコッタの背景・アイコン</li><li>開発用の Mac に macOS のベータ版を入れるか、安定性の面から検討</li></ul>'),
 dict(date='2026-11-05', tag='ゲーム', title='折り紙アプリ「GetOffGod」と、韻でとぶゴルフ',
      body='<ul class="r-list"><li>GetOffGod：折りたたみスマホのヒンジを使う折り紙アプリ。紙の回転・裏返し・折り目・折り込みの操作と、物理演算をふくむ詳細設計</li><li>ライムゴルフ：韻のふみ具合でボールの飛距離が決まるゲーム。ラッパー風のゴルファーをデザインし、AI に頼らない韻の判定とスコア計算の詳細設計を依頼（GitHub の <a href="https://github.com/Ben-Kei-create/rhymegolf" target="_blank" rel="noopener">rhymegolf</a>）</li></ul>'),
 dict(date='2026-11-06', tag='AI', title='自分でしゃべる AI VTuber',
      body='<ul class="r-list"><li>自律して会話する AI キャラクターを構想。ゲーム画面の右下にいて、自分から話しかける最初の機能を検討</li><li>ローカルで動く AI（Ollama など）も調べる対象に</li></ul>'),
 dict(date='2026-11-07', tag='企画', title='Muse でつくる、収益化できるアプリ',
      body='<ul class="r-list"><li>自作 AI「Muse」でアプリをつくる前提で、収益化できそうな新しいアプリを企画</li></ul>'),
 dict(date='2026-11-08', tag='ゲーム', title='Pyxel のゲームを App Store に',
      body='<ul class="r-list"><li>Pyxel（Python のレトロゲームエンジン）でつくったゲームを App Store で売る方法を調査。Swift との組み合わせ方やアプリ化できるかを確認</li></ul>'),
 dict(date='2026-11-13', tag='アプリ', title='いつも最前面のシール型 Mac アプリ',
      body='<ul class="r-list"><li>ほかのアプリに切りかえても最前面に出たままの「シール」アプリを構想。株価チャートの上に目印を置く使い方を想定</li></ul>'),
 dict(date='2026-11-15', tag='企画', title='著作権の切れた名作をゲームに／ここ1年のふりかえり',
      body='<ul class="r-list"><li>著作権の保護期間が終わった映画や小説を、ゲーム体験に変える企画を検討</li></ul><p>2025年12月からの開発メモを、この日記にまとめて移しました。ふりかえると……</p><ul class="r-list"><li><b>10月は設計と実装の準備が中心</b>：Toiret、ドパリカ！、PageMint、Safe Eye、C-Log など、アプリとして形にするための仕様づくりと分担決め</li><li><b>11月は新しい遊びの発明が増えた</b>：ヒンジで折る折り紙、韻でとぶゴルフ、彗星の RPG、自分でしゃべる AI キャラなど</li><li><b>つくり方は AI との分業</b>：実装は Claude、レビューは Codex、企画・仕様・デザインの判断は自分</li></ul><p class="r-small">※構想・設計の段階のものもふくみます。公開ずみのものだけ、アプリのページにリンクしています。</p>'),
 dict(date='2026-11-15', tag='コミケ', title='コミケで配るシールのロゴをつくりはじめた',
      body='<p>コミケで配る、オリジナルのシールづくりをはじめました。まずはロゴから。</p><ul class="r-list"><li>注文は「正方形・ポップ・ちょっと悪ガキっぽい」</li><li>最初にできた案がよかったので、そのまま<b>採用</b></li><li>もう1つ、もっとダークで悪そうな雰囲気のバージョンも制作中。明るいポップ版と、ダークな攻めた版を見くらべる段階です</li></ul><p>次は、どちらの案でいくか決めて、シールとしての印刷の仕様（サイズ・紙・枚数など）を固めること。印刷データと発注はまだこれからです。</p>'),
 dict(date='2026-11-15', tag='Muse', title='Muse の現在地と、これからの順番',
      body='<p>11/10〜15 に考えた Muse の設計を、ここで一度まとめました。いまは設計と指示書ができた段階で、新しい機能の実装はこれからです。</p><ul class="r-list"><li><b>できているもの</b>：これまでの作業支援の機能と、それを管理するアプリ</li><li><b>今回つくった設計</b>：Muse Worker 2.0 のアップデート方針、下書き → 本人リライトの書き方、案件管理・作業ログ・収益分析、Muse Seller の指示書と専用アプリの構想、アプリを分けて将来つなぐ方針</li></ul><p>これからの順番：</p><ol class="r-ol"><li>今ある Muse の受注まわりの機能をひろげる</li><li>下書き・リライト・修正履歴の保存をつくる</li><li>Muse Seller の専用アプリをつくる</li><li>最初の商品をつくって、売れるか確かめる</li><li>必要になったら、事業ごとの収益をつなげる</li></ol><p>基本の考え方は、<b>今ある機能はこわさずに、受注の「すぐ入る収入」と、商品販売の「積み上がる収入」を並行して育てる</b>こと。</p>'),
 dict(date='2026-11-15', tag='Muse', title='アプリは用途ごとに分ける。いずれ「Muse Manager」でまとめる',
      body='<p>受注用（Worker）、販売用（Seller）、それとは別のスペースアプリは、それぞれ独立したアプリとしてつくることにしました。</p><ul class="r-list"><li>Seller には専用の管理アプリを新しくつくる。画面は、商品管理・販売状況・収益分析・AI の作業キュー</li><li>いずれ受注と販売の収益をつなげる「Muse Manager」も考える</li><li>ただし当面は、それぞれのアプリを完成させるのが先。つなぐのは必要になってから</li></ul>'),
 dict(date='2026-11-15', tag='Muse', title='「仕事をする AI」と「売る AI」を分ける ― Muse Seller の構想',
      body='<p>頼まれた仕事をこなす Muse とは別に、<b>自分の商品を売る役</b>として「Muse Seller」を考えました。</p><ul class="r-list"><li>Seller の担当：市場調査、商品の企画、制作の手伝い、販売の準備、売上の分析</li><li>売るもの：デジタル商品、電子書籍、アプリ、テンプレートなど</li><li>一度つくった商品が売れ続ける「積み上がる」収益を大事にする</li></ul>'),
 dict(date='2026-11-15', tag='Muse', title='Muse Worker 2.0 の設計と、アップデート指示書',
      body='<p>今の Muse を「作業の手伝い」から「収益につながる仕事を手伝う AI」に育てるため、Muse Worker 2.0 を設計しました。</p><ul class="r-list"><li>案件さがし → もうかるかの評価 → 作業 → 品質チェック → 収益の分析、までを受け持つ</li><li>案件は、報酬だけでなく手数料と作業時間もふくめた「実質の時給」で比べる</li><li>文章の校正、リサーチ、資料づくり、データ整理などにも対応する</li><li>作業の記録をためて、次の仕事に使い回す</li></ul><p>文章の仕事は、<b>Muse が構成と初稿を先につくり、最後に自分がリライトして仕上げる</b>形に。初稿と完成稿の差を保存して、直し方のくせから自分の文体を学ばせ、次の下書きをよくしていきます。</p><p>これらは「Muse 2.0 アップデート指示書」にまとめました。新しく作り直すのではなく、<b>今ある画面・記録・データはそのまま残して機能を足す</b>方針です。段階ごとの実装計画と、完成の条件も決めました。</p>'),
 dict(date='2026-11-10', tag='Muse', title='Muse を「収益を育てる AI」にしたい',
      body='<p>作業を手伝ってくれている自作の AI「Muse」について、これからの方向を考えはじめました。一回きりの報酬だけでなく、<b>続けるほど収益が積み上がる形</b>にしたい。受注の仕事、継続の契約、デジタル商品の販売などを比べて、Muse を「作業の手伝い」から「収益づくりを手伝う AI」へ育てる方針にしました。</p>'),
 dict(date='2026-10-17', tag='ドパリカ！', title='本番用の山の背景10枚を制作。10枚で1本の巨大な地層世界に',
      body='<p><a href="/apps/doparika/">ドパリカ！</a>の本番用の山の背景を、画像生成で10枚つくりました。最初の版は「地中なのに突然空がある」「上下の地層がつながらない」などの問題があったので、方針から作り直しました。</p><ul class="r-list"><li>10枚を縦に並べると、1本の巨大な世界になる（ファイルは10枚のまま）</li><li>上端と下端の岩の質・色・地層を、次の画像へ自然につなげる</li><li>空が見えるのは最上部だけ。地下に入ったら空は出さない</li><li>表土 → 砂礫 → 地層 → 化石 → 褶曲 → 断層 → 火成岩 → 溶岩 → 巨大岩盤 と進んでいく</li><li>スマホの横幅に合わせて、できるだけ縦長に</li></ul><p>これでドパリカ！は、ただの理科の4択アプリではなく、<b>「問題を解く → XP が増える → 背景の世界を進む → 新しい問題を集める」</b>という3本柱が固まりました。最初のリリースは「山・地層／Lv.1〜30／2択」。次は、背景10枚の差し替え → 縦の世界の実装確認 → レビュー・QA → 修正、と進めます。</p>'),
 dict(date='2026-10-17', tag='ドパリカ！', title='背景の進み方を作り直す（XP・レベルと連動）',
      body='<p>最初は「1問正解 → 次の背景へ」という作りでした。でもこれだと、5問全問正解で5つ進み、次に始めるとレベルの位置に戻ってしまう問題が出てきました。そこで仕様を変更しました。</p><ul class="r-list"><li>背景の位置を、累積 XP・レベルと同期させる</li><li>「本当に到達した位置」と「演出上の今の位置」を分けて持つ</li><li>考えている間・不正解・時間切れでは、演出上の位置だけ後ろに下がる（XP は減らない）</li><li>正解すると XP が増えて、本当の到達位置まで勢いよく上昇</li><li>10枚の画像は「10問分」ではなく、Lv.1〜30を通して進む1本の地層世界としてあつかう</li></ul>'),
 dict(date='2026-10-17', tag='ドパリカ！', title='山の背景を実際の画像に差し替え',
      body='<p>山ステージの背景10枚を、実際の画像に差し替えました。</p><ul class="r-list"><li>section_01〜section_10 として管理</li><li>Swift のコードを変えずに、画像だけ入れかえられる作り</li><li>画像がないときは、コードで描いた背景に切りかわる</li><li>クイズ画面の後ろで地層の背景が動くことを Simulator で確認</li></ul>'),
 dict(date='2026-10-17', tag='ドパリカ！', title='画面と背景の演出を具体化。AI 3人体制で開発スタート',
      body='<p>問題パネルの後ろで、背景が縦にスクロールする方式にしました。参考にしたのは、アトラクションの「垂直に加速する感じ」。ただし怖い演出は使いません。</p><ul class="r-list"><li>正解すると、ゆっくり → 急加速 → 減速、と上昇</li><li>不正解だと背景が後退</li><li>考えている間も、時間とともに少しずつ後退（制限時間つき）</li><li>山＝地層、空＝大気圏から宇宙、海＝海面から深海。それぞれ長い縦の世界にする</li><li>各ステージに10種類くらいの背景を用意する</li></ul><p>開発の分担も決めました。<b>ChatGPT</b>＝仕様・設計・指示、<b>Claude Code</b>＝Swift／SwiftUI の実装、<b>Codex</b>＝レビュー・QA。さっそく仮の画像で、アプリアイコン・ホーム背景・山の背景10枚を組みこみました。</p>'),
 dict(date='2026-10-16', tag='ドパリカ！', title='ドパリカ！の基本の仕様を固めた',
      body='<p>中学理科アプリの名前を「<a href="/apps/doparika/">ドパリカ！</a>」に決定。iPhone 専用・SwiftUI でつくります。ねらいは高校入試の「大問1」対策です。</p><ul class="r-list"><li>Lv.1〜30＝山（2択）、Lv.31〜60＝空（3択）、Lv.61〜100＝海（4択）</li><li>レベルは「ステージ」ではなく、自分の累積 XP のレベル。自分では選べない</li><li>1セット5問。復習でも XP がもらえる</li><li>前のレベルで間違えた問題を優先して出す。間違いがなくても、最低2問は復習を混ぜる</li><li>問題の総数は見せない</li><li>最初のリリースは Lv.1〜30（山）まで</li><li>Lv.31以降は、山のランダム復習もできる（XP は半分）</li><li>「問題蒐集」：山・空・海のタブ。まだ出会っていない問題は「????」、一度解いた問題は問題文と答えを見られる</li></ul>'),
 dict(date='2026-11-15', tag='ゲーム', title='unityroom のゲームを、ゲームブースにならべました',
      body='<p>unityroom に出している6本のゲームを「<a href="/game/">ゲームブース</a>」に置きました。イチオシは、雨の中で二人が傘を回して障害物をよける「<a href="https://unityroom.com/games/umbrella_lovers" target="_blank" rel="noopener">umbrella lovers</a>」（unity1week 参加作）。ブラウザですぐ遊べます。</p>'),
 dict(date='2026-11-15', tag='ブース', title='ブースを5つ一気に開設',
      body='<p>「<a href="/game/">ゲーム</a>」「<a href="/museum/">美術館</a>」「<a href="/ramen/">ラーメン</a>」「<a href="/movie/">映画（C-Log Web）</a>」、それからサイトの裏側の「<a href="/bookmarks/">ブックマーク</a>」ブースを作りました。ゲームはコインあつめ、ラーメンはスクロールで麺がのびます。中身はこれから少しずつ。note ブースには TALES の連載『島の灯台と猫』も並べました。</p>'),
 dict(date='2026-11-15', tag='スタンプ', title='スタンプブースをつくりました',
      body='<p>つくった LINE スタンプを紹介する「<a href="/stamp/">スタンプブース</a>」を作りました。グループトークの中に入ったような画面で、スタンプを選んで送ってためせます（送ったものは画面の中だけで、どこにも送信されません）。fumi のLINEスタンプ18セット・248種類を並べました。</p>'),
 dict(date='2026-11-15', tag='note', title='note の過去記事を349本、まるごと移植',
      body='<p>2021年から note に書いてきた記事349本を、<a href="/note/">note ブース</a>に移しました。年ごとの目次、タグ、検索から読めます。Java の勉強記録などはコードも読みやすく整えました。有料記事（30本）は無料部分だけをのせて、続きは note へご案内しています。</p>'),
 dict(date='2026-11-15', tag='note', title='note ブースをはじめました',
      body='<p>NingentteWinner の名前で note に5年ほど書いてきた創作を、こちらにも置いていくための「<a href="/note/">note ブース</a>」を作りました。とにかく読みやすさ優先で、背景（白・セピア・黒）、文字の大きさ、明朝／ゴシックを切り替えられます。記事はこれから少しずつ移していきます。</p>'),
 dict(date='2026-11-15', tag='アプリ', title='アプリのページを、すっきりしたデザインに',
      body='<p><a href="/apps/">アプリのページ</a>だけ、白と黒を切り替えられるシンプルなデザインにしました。各アプリのサポート・プライバシーのページも同じ見た目です。</p>'),
 dict(date='2026-11-15', tag='どろん', title='Cサークルの新企画「十人奇談」、準備中',
      body='<p>オカルトブース「<a href="/doron/#c-circle">どろん</a>」のCサークルで、「十人奇談」という企画を考えています。前半・後半の札と、「怪談」「奇談」「雑談」の題名カードを作りました。くわしい内容は決まりしだい、ここと Cサークルのページでお知らせします。</p>',
      photos=KIDAN_PHOTOS),
]
have = {(d['date'], d['title']) for d in DIARY}
DIARY = [n for n in NEW_ENTRIES if (n['date'], n['title']) not in have] + DIARY
DIARY.sort(key=lambda d: d['date'], reverse=True)  # 新しい順（同じ日は書いた順）

def photos_html(ps):
    return ''.join(f'<a class="r-photo" href="{s}" target="_blank" rel="noopener"><img src="{s}" width="{w}" height="{h}" alt="{E(c)}" loading="lazy">{E(c)}</a>' for s, c, w, h in ps)

def diary_entry(d):
    ph = photos_html(d['photos']) if d.get('photos') else ''
    return f'''<div class="r-diary-entry">
<div class="d">■ {E(d['when']) if d.get('when') else jdate(d['date'])}　[{E(d['tag'])}]</div>
<h3>{d['title']}</h3>
{d['body']}
{'<div>' + ph + '</div>' if ph else ''}
</div>'''

def js_json(path, var):
    """window.XXX = [...] / {...}; の JSON 部分を読む"""
    t = (R / path).read_text(); i = t.index('window.' + var + ' =') + len('window.' + var + ' =')
    return json.loads(t[i:].strip().rstrip(';'))
NOTE_POSTS = [p for p in js_json('note/posts.js', 'NOTE_POSTS') if p.get('cover')]
NOTE_POSTS.sort(key=lambda p: p['date'], reverse=True)
STAMP_SETS = js_json('stamp/stamps.js', 'STAMP')['sets']

def books_flat():
    return [b for k in BOOKS['cats'] for b in BOOKS['books'][k]]
TOTAL = len(books_flat())

def book(a, m, s, img):
    return f'<a class="r-book" href="https://www.amazon.co.jp/dp/{a}" target="_blank" rel="noopener"><img src="{E(img)}" width="110" height="164" alt="{E(m)}の表紙" loading="lazy"><b>{E(m)}</b>{f"<small>{E(s)}</small>" if s else ""}</a>'

def icon(href, img, name, note, dev=False, ext=False):
    t = ' target="_blank" rel="noopener"' if ext else ''
    return f'<a class="r-icon" href="{href}"{t}><img src="{img}" width="56" height="56" alt=""><span>{E(name)}</span><small class="{"dev" if dev else ""}">{note}</small></a>'

# ================= トップページ =================
def build_index():
    whats = [
        ('2026-11-15', '<a href="/game/">ゲームブース</a>に unityroom のゲーム6本！ イチオシは「umbrella lovers」', True),
        ('2026-11-15', 'ゲーム・美術館・ラーメン・映画・ブックマークの<a href="/#booths">5ブース</a>を開設', True),
        ('2026-11-15', '<a href="/stamp/">スタンプブース</a>をつくりました', True),
        ('2026-11-15', '<a href="/note/">note ブース</a>に過去の記事349本を移植しました', True),
        ('2026-11-15', '<a href="/note/">note ブース</a>をはじめました（NingentteWinner の創作）', False),
        ('2026-11-15', 'どろん：Cサークルの新企画「<a href="/doron/#c-circle">十人奇談</a>」の素材を公開', True),
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
ここでは <font color="#d10056"><b>教育 × IT</b></font> をテーマに、自作のアプリ、Kindle電子書籍「ドパ読！」、<br class="pc">オカルトブース「どろん」、それから開発日記などを置いています。<br>
ゆっくりしていってくださいね。</p>
<table class="r-tbl" summary="数字で見るGiveTex"><tr><th>App Store 公開中</th><th>開発中のアプリ</th><th>ドパ読！</th><th>note</th></tr><tr><td class="r-center"><b>7</b> 本</td><td class="r-center"><b>11</b> 本</td><td class="r-center"><b>{TOTAL}</b> 冊</td><td class="r-center"><b>349</b> 本</td></tr><tr><th>TALES 連載</th><th>LINE スタンプ</th><th>ブース</th><th>記事</th></tr><tr><td class="r-center"><b>11</b> 話</td><td class="r-center"><b>18</b> セット</td><td class="r-center"><b>11</b> こ</td><td class="r-center"><b>6</b> 本</td></tr></table>
<p class="r-small r-center">最終更新日：2026年11月15日</p>'''
    apps_icons = ''.join(icon(h or s, img, n, '★公開中', ext=not h) for h, img, n, d, s in RELEASED)
    apps_icons += ''.join(icon(f'/apps/{k}/', f'/apps/{k}/images/icon.jpg', n, '準備中', dev=True) for k, n, d in DEV)
    shelf = ''.join(book(*b) for k in BOOKS['cats'] for b in BOOKS['books'][k][:2])
    diary_top = ''.join(diary_entry(d) for d in DIARY[:3])
    arts = ''.join(f'<li><a href="{h}">{E(t)}</a></li>' for h, t in ARTICLES)
    doron = f'''<p class="r-center"><a href="/doron/"><img src="/doron/img/logo-relics-s.webp" width="440" height="182" alt="どろん" style="filter:drop-shadow(0 0 10px #ff3355)"></a></p>
<p class="r-center">GiveTex の <b>オカルトブース</b> です。夜の記録はこちらから……</p>
<table class="r-tbl" summary="どろんのブース"><tr><th>ブース</th><th>なにをする？</th></tr>
<tr><td><a href="/doron/#relics">relics</a></td><td>座談会。怪談・うわさ・考察を語り合う</td></tr>
<tr><td><a href="/doron/#reikai">霊界案内所</a></td><td>心霊スポット巡り</td></tr>
<tr><td><a href="/doron/#c-circle">Cサークル</a></td><td>スポット巡り ＋ 発表。新企画「十人奇談」準備中 {NEWGIF}</td></tr></table>'''
    G = js_json('game/game-data.js', 'GAME'); pick = next((g for g in G['games'] if g.get('pick')), None)
    pick_win = win(f'★イチオシ ゲーム★ - {E(pick["title"])}', f'''<div class="r-pick"><a class="r-pick-img" href="{E(pick["url"])}" target="_blank" rel="noopener"><img src="{E(pick["img"])}" width="240" height="240" alt="{E(pick["title"])} のタイトル画像"></a>
<div class="r-pick-tx"><p class="r-pick-new"><blink>NEW!</blink> <b>PICK UP GAME</b></p><h3>{E(pick["title"])}</h3><p>{E(pick["desc"])}</p><p class="r-small">unityroom（ブラウザで遊べる・パソコン推奨）／ {pick.get("year", "")}年 #unity1week</p>
<p><a class="r-btn r-btn-hot" href="{E(pick["url"])}" target="_blank" rel="noopener">▶ unityroom で遊ぶ</a> <a class="r-btn" href="/game/">ゲームブースへ &gt;&gt;</a></p></div></div>''', '🎮') if pick else ''
    main = (win('ようこそ！ - GiveTex', welcome, '🏠') + pick_win +
            win("What's New!! - 更新履歴", f'<table class="r-tbl" summary="更新履歴"><tr><th>日付</th><th>更新内容</th></tr>{rows}</table><p class="r-small">→ これまでの更新は <a href="/diary/">開発日記</a> へ</p>', '📢') +
            win('アプリ置き場 - マイ コンピュータ', f'<div class="r-icons">{apps_icons}</div>', '💾', menu=True, status=['18 個のオブジェクト', 'App Store 公開中 7']) +
            win(f'ドパ読！書庫 - Kindle電子書籍 {TOTAL}冊', f'<div class="r-shelf">{shelf}</div><p class="r-center"><a class="r-btn" href="/books/">全{TOTAL}冊を見る &gt;&gt;</a></p>', '📚') +
            win('どろん - オカルトブース', doron, '👻', cls='dark') +
            win('note ブース - 最新の記事', '<p class="r-center" style="margin:0 0 8px">NingentteWinner の note から、さいきんの記事。</p><div class="r-shelf r-notes">' + ''.join(f'<a class="r-book r-note" href="/note/posts/{E(p["slug"])}.html"><img src="{E(p["cover"])}" width="160" height="84" alt="" loading="lazy"><b>{E(p["title"])}</b><small>{p["date"].replace("-", "/")}</small></a>' for p in NOTE_POSTS[:8]) + '</div><p class="r-center"><a class="r-btn" href="/note/">note ブースへ（全 ' + str(len(js_json("note/posts.js", "NOTE_POSTS"))) + ' 本）&gt;&gt;</a></p>', '✒') +
            win('スタンプブース - LINE スタンプ', '<p class="r-center" style="margin:0 0 8px">fumi の LINE スタンプ <b>' + str(len(STAMP_SETS)) + 'セット</b>。トーク画面で送ってためせます。</p><div class="r-shelf r-stamps">' + ''.join(f'<a class="r-book r-stamp" href="/stamp/" title="{E(x["title"])}"><img src="{E(x["main"])}" width="96" height="96" alt="{E(x["title"])}" loading="lazy"><small>{E(x["title"])}</small></a>' for x in list(reversed(STAMP_SETS))[:10]) + '</div><p class="r-center"><a class="r-btn" href="/stamp/">スタンプブースへ &gt;&gt;</a></p>', '💬') +
            '<a name="booths" id="booths"></a>' + win('ブース案内 - GiveTex のなかみ', '<table class="r-tbl" summary="ブース一覧"><tr><th></th><th>ブース</th><th>なにがある？</th></tr><tr><td>💾</td><td><a href="/apps/">アプリ</a></td><td>iPhone / Mac の学習アプリ</td></tr><tr><td>📚</td><td><a href="/books/">ドパ読！</a></td><td>Kindle「30秒で読む」シリーズ</td></tr><tr><td>✒</td><td><a href="/note/">note</a></td><td>NingentteWinner の創作・TALES</td></tr><tr><td>💬</td><td><a href="/stamp/">スタンプ</a></td><td>LINE スタンプのトーク</td></tr><tr><td>🎮</td><td><a href="/game/">ゲーム</a></td><td>unityroom のゲームとゲームのつぶやき</td></tr><tr><td>🖼</td><td><a href="/museum/">美術館</a></td><td>美術館のつぶやきと来館記録</td></tr><tr><td>🍜</td><td><a href="/ramen/">ラーメン</a></td><td>食べたラーメン。麺がのびる</td></tr><tr><td>🎬</td><td><a href="/movie/">映画</a></td><td>C-Log Web・観た映画の感想</td></tr><tr><td>👻</td><td><a href="/doron/">どろん</a></td><td>オカルトブース</td></tr></table><p class="r-small" style="text-align:right;margin:6px 0 0"><a href="/bookmarks/" title="サイトの裏側">裏口 &gt;_</a></p>', '🗺') +
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
        links = ([f'<a href="{h}">くわしく</a>'] if h else []) + ([f'<a href="{store}" target="_blank" rel="noopener">App Store</a>'] if store else [])
        st = '<font color="#808080">準備中</font>' if dev else '<font color="#008000"><b>★公開中</b></font>'
        return f'<tr><td align="center" width="64"><img src="{img}" width="48" height="48" alt="" style="border-radius:10px"></td><td><b>{name}</b><br><span class="r-small">{E(d)}</span></td><td align="center" nowrap>{st}<br><span class="r-small">{" / ".join(links)}</span></td></tr>'
    r1 = ''.join(row(h, img, n, d, s) for h, img, n, d, s in RELEASED)
    r2 = ''.join(row(f'/apps/{k}/', f'/apps/{k}/images/icon.jpg', n, d, None, True) for k, n, d in DEV)
    body = f'''<div class="r-page" role="main">
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
<p class="r-center"><b>Kindle電子書籍「ドパ読！」</b>へようこそ。<br>1話30秒で、脳にドーパミン。ひとつのテーマを10話に分けて、神話・名作・偉人・歴史・科学・心理まで、<br class="pc">ちょうどいい短さで読める <font color="#d10056"><b>「30秒で読む」シリーズ</b></font> を <b>{TOTAL}冊</b> ならべています。</p>
<table class="r-tbl" summary="著者"><tr><th>著者名</th><td><b>NingentteWinner</b>（Kindleでの名義）</td></tr>
<tr><th>どんな本？</th><td>学校教育とIT開発の経験をいかし、むずかしいテーマを短く、おもしろく。AIを相棒に企画・執筆しています。</td></tr>
<tr><th>買える場所</th><td><a href="{AUTH}" target="_blank" rel="noopener">Amazon の著者ページで全作品を見る</a></td></tr></table>
<p class="r-jump">ジャンル：{jump}</p>'''
    body = f'''<div class="r-page" role="main">
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
    body = f'''<div class="r-page" role="main">
{win('開発日記 - メモ帳', f'<p>何をつくって、何を直して、何をリリースしたか。GiveTex の制作日記です。新しい順に並んでいます。</p><p class="r-jump">過去ログ：{idx}</p><hr class="r-hr">{parts}', '📝', menu=True, status=[f'{len(DIARY)} 件の日記', '最終更新 2026/11/16'])}
</div>'''
    page('diary/index.html', '開発日記 | GiveTex', 'GiveTexの開発日記。学習アプリのリリース、サイト更新、Kindle出版、オカルトブース「どろん」など、つくる過程の記録です。', body, '/diary/')

# ================= 管理人のプロフィール =================
def build_about():
    AUTH = 'https://www.amazon.co.jp/s?i=digital-text&amp;rh=p_27%3ANingentteWinner&amp;s=date-desc-rank'
    body = f'''<div class="r-page" role="main">
{win('管理人のプロフィール - GiveTex', f"""<h2 class="r-h">👤 このホームページについて</h2>
<p><b>GiveTex</b>（ギブテックス）は「Give（与える）× Education × Technology」を掛け合わせた造語です。<br>
<font color="#d10056"><b>教育 × IT</b></font> をテーマに、学びを形にして届けることを目標にしています。</p>
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
<tr><th>Kindle著者名</th><td><a href="{AUTH}" target="_blank" rel="noopener">NingentteWinner</a></td></tr>
</table>
<h3 class="r-h3">お問い合わせ</h3>
<p>アプリ・書籍・記事に関するご質問や、取り上げてほしいテーマのリクエストは、こちらまでお気軽にどうぞ。<br>
📧 メール：tofuodorico[at]gmail.com　<span class="r-small">（[at] を @ にかえてね）</span><br>✉ <a href="/contact/">お問い合わせフォーム</a>からも送れます</p>""", '👤')}
</div>'''
    page('about.html', '管理人のプロフィール | GiveTex', 'GiveTex（ギブテックス）は教育×ITをテーマに、学習アプリ・Kindle電子書籍「ドパ読！」・オカルトブース「どろん」・開発日記・記事を発信する個人ホームページです。', body, '/about.html', canonical='https://www.givetex.org/about.html')

build_index(); build_diary(); build_about()  # books は pop デザインのまま（再生成しない）

def build_diary_feed():
    """開発日記の RSS（/diary/feed.xml）"""
    X = lambda s: html.escape(str(s), quote=True)
    items = []
    for i, d in enumerate(DIARY[:30]):
        body = re.sub(r'href="/', 'href="https://www.givetex.org/', d['body'])
        dt = datetime.datetime.strptime(d['date'], '%Y-%m-%d').replace(hour=12, tzinfo=datetime.timezone(datetime.timedelta(hours=9)))
        items.append(f'''<item><title>{X(re.sub("<[^>]+>", "", d["title"]))}</title><link>https://www.givetex.org/diary/#m{d["date"][:7].replace("-", "")}</link>
<guid isPermaLink="false">givetex-diary-{d["date"]}-{X(re.sub("<[^>]+>", "", d["title"]))}</guid><category>{X(d["tag"])}</category><pubDate>{dt.strftime("%a, %d %b %Y %H:%M:%S +0900")}</pubDate><description>{X(body)}</description></item>''')
    (R / 'diary' / 'feed.xml').write_text(f'''<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>
<title>GiveTex 開発日記</title><link>https://www.givetex.org/diary/</link><description>GiveTex（教育×IT）の制作日記。何をつくって、何を直して、何をリリースしたか。</description><language>ja</language>
<atom:link href="https://www.givetex.org/diary/feed.xml" rel="self" type="application/rss+xml"/>
{chr(10).join(items)}
</channel></rss>
''')

build_diary_feed()
