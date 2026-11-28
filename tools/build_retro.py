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
<link href="https://fonts.googleapis.com/css2?family=DotGothic16&amp;family=Titan+One&amp;family=VT323&amp;display=swap" rel="stylesheet">
<link rel="stylesheet" type="text/css" href="/assets/retro.css">
<script type="text/javascript" src="/assets/retro.js"></script>
<script src="/assets/retro-extras.js" defer></script>
<script src="/assets/img-fallback.js"></script>
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/assets/icon/favicon-32.png">
<link rel="apple-touch-icon" href="/assets/icon/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<script src="/assets/ga.js" defer></script>'''
NAV = [('/', 'HOME'), ('/apps/', 'アプリ'), ('/books/', 'ドパ読！'), ('/doron/', 'どろん'), ('/note/', 'note'), ('/stamp/', 'スタンプ'), ('/#booths', 'ブース'),
       ('/diary/', '開発日記'), ('/#articles', '記事'), ('/about.html', '管理人'), ('/contact/', 'お問い合わせ')]
NEWS = ('★☆★ ようこそ GiveTex のホームページへ！ ★☆★　'
        '<a href="/guestbook/">ゲストブック</a>に足あとを残してね！　◆　'
        'キリ番をふんだら名前をのこそう　◆　'
        '右のゲームコーナーで、じゃんけん勝負！　◆　'
        '今日のおみくじ、もう引いた？　◆　'
        '<a href="/movie/">映画ブース</a>の感想ノート「みんなの C-Log」もよろしく　◆　'
        'このホームページはリンクフリーです　★☆★')

UFO = '<div class="r-ufo" aria-hidden="true"></div>'  # ホームの左上の 3D UFO キャッチャー（assets/home3d.js が中に描く）
MEISHI = '<button type="button" class="r-meishi" data-meishi aria-haspopup="dialog">名刺</button>'

def header(cur):
    AC = ' aria-current="page"'
    nav = ''.join(f'<a href="{h}"{AC if h == cur else ""}>{t}</a>' for h, t in NAV)
    return f'''<a name="top" id="top"></a>
<div class="r-head" role="banner">
{UFO if cur == '/' else ''}<a class="r-logo-link" href="/"><span class="r-logo">GiveTex</span></a>
<div class="r-sub">～ <b class="give">GIVE教育！</b> <b>教育</b> × <b>IT</b> の ホームページ ～</div>
<marquee class="r-news" scrollamount="5" scrolldelay="60">{NEWS}</marquee>
<div class="r-nav" role="navigation" aria-label="メニュー">{nav}{MEISHI if cur in ('/', '/about.html', '/contact/') else ''}</div>
</div>'''

FOOTER = '''<div class="r-foot" role="contentinfo">
<hr class="r-hr">
<div class="bnrs bnr-wall">
{BNR_WALL}
</div>
<p>当サイトは<b>リンクフリー</b>です。バナーはお持ち帰りOK！<br>推奨環境：画面サイズ 800×600 以上 ／ 文字サイズ「中」</p>
<p><a href="/about.html">管理人について</a> ｜ <a href="/privacy.html">プライバシーポリシー</a> ｜ <a href="/contact/">お問い合わせ</a> ｜ <a href="#top">▲ ページの先頭へ</a></p>
<address>Copyright (C) 2026 GiveTex. All Rights Reserved.<br>このホームページの文章・画像の無断転載を禁止します。</address>
</div>'''

# フッターに並べるバナー（88×31）。絵は tools/build_banners.py が作る。None はリンクなしの飾り
BANNERS = [('/', 'bnr-givetex.gif', 'GiveTex'), ('/apps/', 'b-apps.gif', 'アプリ'), ('/books/', 'bnr-dopayomi.gif', 'ドパ読！'), ('/doron/', 'bnr-doron.gif', 'どろん'),
           ('/note/', 'b-note.gif', 'note ブース（よみもの）'), ('/stamp/', 'b-stamp.gif', 'スタンプ'), ('/game/', 'b-game.gif', 'ゲームブース'), ('/#mg', 'b-minigame.gif', 'ミニゲーム（ホームのゲームコーナー）'),
           ('/game/board/', 'b-board.gif', 'ボードゲーム（CPU 対戦）'), ('/museum/', 'b-museum.gif', '美術館'), ('/ramen/', 'b-ramen.gif', 'ラーメン'), ('/socafe/', 'b-socafe.gif', '素カフェ（素材カフェ）'), ('/gakko/', 'b-gakko.gif', 'Gakko（先生と生徒の道具箱）'), ('/movie/', 'b-movie.gif', '映画（C-Log Web）'),
           ('/diary/', 'b-diary.gif', '開発日記'), ('/guestbook/', 'b-guestbook.gif', 'ゲストブック（足あと帳）'), ('/links/', 'b-links.gif', 'リンク集'), ('/?meishi', 'b-meishi.gif', '名刺'),
           ('/bookmarks/', 'b-backstage.gif', '裏口（backstage）'), ('/', 'b-kiriban.gif', 'キリ番'), ('/links/', 'b-linkfree.gif', 'リンクフリー'), ('/about.html', 'b-since.gif', 'Since 2026'),
           (None, 'b-800x600.gif', '800×600 推奨'), (None, 'koujichu.gif', '工事中')]
BNR_WALL = '\n'.join((f'<a href="{h}"><img src="/assets/retro/{f}" width="88" height="31" alt="{a}"></a>' if h else f'<img src="/assets/retro/{f}" width="88" height="31" alt="{a}">') for h, f, a in BANNERS)
FOOTER = FOOTER.replace('{BNR_WALL}', BNR_WALL)

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
{'<div class="pr-banner daily-quote" aria-label="今日のひとこと">今日のひとこと「千里の道も一歩から。」― 老子</div><script src="/assets/quote.js" defer></script>' if pr else ''}
{header(cur)}
<h1 class="r-vh">{E(title.split(' | ')[0].split('｜')[0])}</h1>
{body}
{FOOTER}
</body>
</html>
'''
    if path == 'diary/index.html':  # 日記：タグでしぼりこむ
        doc = doc.replace('</body>', '<script src="/assets/diary-filter.js" defer></script>\n</body>', 1)
    if path == 'about.html':  # 管理人のページにも名刺
        doc = doc.replace('</body>', '<script src="/assets/meishi.js" defer></script>\n</body>', 1)
    if path == 'index.html':  # ホームだけ起動画面
        doc = doc.replace('<script src="/assets/img-fallback.js"></script>', '<script src="/assets/img-fallback.js"></script>\n<script src="/assets/boot.js"></script>', 1).replace('</body>', '<script src="/assets/meishi.js" defer></script>\n</body>', 1).replace('</body>', '<script src="/assets/iruka-stack.js" defer></script>\n<script src="/assets/home3d.js" defer></script>\n<script src="/assets/home-space.js" defer></script>\n</body>', 1)
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
 ('/apps/awstady-saa/', '/apps/awstady-saa/images/icon.jpg', 'AWSSTUDY(SAA)', 'AWSの設計判断を理由から学ぶ3択クイズ。', 'https://apps.apple.com/jp/app/id6829979446'),
 (None, '/assets/store/pokephysics.jpg', 'PokePhysics', '高校物理の公式を、記号の意味・成立条件・例題と一緒にすばやく確認。', 'https://apps.apple.com/jp/app/id6778082145'),
 ('/apps/linatex/', '/apps/linatex/images/icon.jpg', 'LinaTeX', 'Linuxコマンドを、レッスン・クイズ・実践シナリオで身につける。', 'https://apps.apple.com/jp/app/id6775100355'),
 ('/apps/onitan/', '/assets/store/onitan.jpg', 'OniTan(Pre1)', '漢字検定準1級の合格をめざす本格学習アプリ。', 'https://apps.apple.com/jp/app/id6760243558'),
 ('/apps/beerquiz/', '/apps/beerquiz/images/icon.jpg', 'ビール雑学クイズ', '注ぎ方・スタイル・醸造まで、初級〜上級の125問。', 'https://apps.apple.com/jp/app/id6759665291'),
 ('/apps/paperstory/', '/apps/paperstory/images/icon.jpg', 'PaperStory', '紙を引き出して読む、物語のアプリ。', 'https://apps.apple.com/jp/app/id6829360362'),
]
DEV = [
 ('aws-saa-dojo', 'SAA 設計道場', 'AWS設計判断トレーナー。10問ずつ何度でも。'),
 ('minigamer', 'MiniGamer', '本棚から選んですぐ遊べるミニゲーム集。'),
 ('kuragoyomi', '蔵ごよみ', '日本酒を1日ひとつ、約60日で学ぶ。'),
 ('uzacal', 'UzaCal', '毒舌キャラが話しかける電卓。'),
 ('winequiz', 'ワイン雑学クイズ', 'ぶどう品種・産地・醸造の125問。'),
 ('zayping', 'Zayping', '雑学の一文をタイプするMac向けゲーム。'),
 ('terra', 'TERRA', '世界の7人の選択をたどるMac向け物語。'),
 ('yomuemo', 'よむエモ', '名作文学を、感情で読む。'),
 ('doparika', 'ドパリカ！', '中学理科の2択クイズ。'),
]
ARTICLES = [
 ('/articles/ai-team-app-development.html', 'AIと分業してiPhoneアプリをつくる方法｜企画は人、実装はAI【実例つき】'),
 ('/articles/ai-book-illustration-rules.html', 'AIで本の挿絵をつくるときの5つのルール｜1プロンプト＝1枚で迷わない'),
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
 dict(date='2026-11-28', tag='サイト', title='新ブース「Gakko」：先生と生徒の道具箱',
      body='<p>新しいブース「<a href="/gakko/">Gakko</a>」をつくりました。黒板の下のスイッチで「先生」と「生徒」を切りかえると、使える道具と教材が入れかわります。ぜんぶブラウザだけで動いて、無料・登録なしです。</p><ul class="r-list"><li>先生：指名ルーレット、班分けメーカー、授業タイマー（大きく映せて、最後にチャイム）、計算プリントメーカー（毎回ちがう問題を答えつきで印刷）、席がえくじ</li><li>生徒：計算タイムアタック（九九〜一次方程式・ベスト記録つき）、元素記号クイズ、県庁所在地クイズ、英単語クイズ、勉強タイマー（25分集中・5分休けい）</li><li>教材：素カフェの教材プリント（PDF）と、授業の題材になる学習キット</li></ul><p>名前を入れて使う道具もありますが、入れた名前は画面の中だけで使い、保存も送信もしません。</p>'),
 dict(date='2026-11-28', tag='サイト', title='さわって気持ちいい部品と、ドパ読！の本棚',
      body='<p>動く部品をあつめたサイトや、デザインのギャラリーサイトを見て、ホーム以外のブースに「さわると気持ちいい」小さな部品を入れました。ぜんぶ GiveTex 用に自分で作ったものです。</p><ul class="r-list"><li>タブやしぼりこみを押すと、光るわくが前の場所から「すーっ」とすべってくる</li><li>ボタンは、押すとばねのように縮んで戻る</li><li>カードの上では、カーソルのまわりがふわっと明るくなり、右下に ↗ が出る</li><li>「96冊」「18品」などの数字が、見えたときに数えあがる</li><li>素カフェのダウンロードは、ボタンの中をバーが走って「✓ 保存しました」に変わり、下からお知らせが出る（横にスワイプで消せる）</li><li>ドパ読！は、いつもの表紙のならびの下に<b>背表紙の本棚</b>を置きました。背表紙の色は表紙の絵から。ふれると本が引きだされて表紙が見える</li><li>ラーメンブースは、広い画面だと食券を左右2列にして、麺がそのあいだを通るように。ページの長さが半分になりました</li></ul>'),
 dict(date='2026-11-28', tag='サイト', title='ブースごとに「顔」になる文字を',
      body='<p>有名な映画やゲームのロゴに使われている書体を、無料で使える近いフォントといっしょに紹介しているサイトを見て、ブースごとの見出しの文字を選びなおしました。</p><ul class="r-list"><li>ホーム：ロゴの GiveTex を、ワードアートっぽい丸くて太い字に</li><li>ゲーム：小さい文字は、読みやすいドット体に</li><li>映画：細長い映画ポスター風の字</li><li>素カフェ：カフェの看板みたいな筆記体</li><li>ラーメン：ポップな太い字（数字も）</li><li>美術館：石に彫ったようなローマン体</li><li>どろん：英字はおどろおどろしい字</li><li>note：ブランド名を飾り文字に</li><li>ドパ読！：英字のラベルをマンガの描き文字風に</li></ul><p>日本語の部分はこれまでどおりなので、読みやすさはそのままです。</p>'),
 dict(date='2026-11-28', tag='サイト', title='アイコンを一新した',
      body='<p>サイトのアイコンを新しくしました。藍から紫へのグラデーションの角丸に、金色の太い「G」。G の口のところには、ひらめきの星がひとつ光っています。</p><p>ブラウザのタブ、スマホのホーム画面に追加したとき、それからホームの起動画面（光の粒が集まってロゴになるところ）も、このアイコンになりました。</p>'),
 dict(date='2026-11-27', tag='サイト', title='ボタンに「作画」の演出。ドン！ポン！カチッ',
      body='<p>ホーム以外のブースで、ボタンを押すと、アニメの見せ場みたいな演出が出るようにしました。衝撃のギザギザ、もくもくの煙、キラッ、それに描き文字の「ドン！」「ポン！」「カチッ」「シュッ」。</p><ul class="r-list"><li><a href="/game/">ゲームブース</a>の PRESS START はドン！ ボードゲームで勝ってもドン！</li><li><a href="/socafe/">素カフェ</a>のダウンロードはカチッ。</li><li><a href="/movie/">映画ブース</a>の感想を書きこむとドン！ タブはズザッ。</li><li><a href="/ramen/">ラーメン</a>・<a href="/books/">ドパ読！</a>・<a href="/museum/">美術館</a>・どろん・スタンプ・note にも。色はブースごとにちがいます。</li></ul><p>演出の描き方は、オープンソースの sakuga-vfx（MIT ライセンス）を使わせてもらいました。動きを減らす設定にしている人には出ません。</p>'),
 dict(date='2026-11-26', tag='サイト', title='定期メンテ：日記のしぼりこみ、地下のブースにメニュー',
      body='<p>これから3日に1回、サイト全体を見まわって、ブースを少しずつよくしていくことにしました。その1回目です。</p><ul class="r-list"><li><a href="/diary/">開発日記</a>に、種類（サイト・アプリ・Kindle…）でしぼりこむボタンをつけました。150件をこえて長くなったので、読みたいものだけ出せます。</li><li>地下の<a href="/stage/">特設ステージ</a>・頭の中ブース・HipHop ブースにも、スマホのメニュー（ホームへもどる）をつけました。</li><li>頭の中ブースのロゴを、オリジナルの「tsubuyaki」マークにかえました。</li><li>90年代風のページに、読み上げ・検索のための見出しを足しました（見た目はそのまま）。</li></ul>'),
 dict(date='2026-11-22', tag='美術館', title='原宿で、葛飾応為の夜景を見てきた',
      body='<p>原宿の太田記念美術館で「葛飾応為『吉原格子先之図』― 夜景の系譜」を見てきました。3年ぶりに公開された応為の代表作です。</p><p>はじめは黒でぬられていた浮世絵の夜空が、プルシアンブルー（ベロ藍）を取り入れて新しい表現になり、そこから青い色の浮世絵が生まれていった――という流れが、いちばん印象に残りました。</p><p><a href="/museum/">美術館ブース</a>に、はじめての来館記録として飾りました。</p>'),
 dict(date='2026-11-22', tag='サイト', title='名刺が家に届いた',
      body='<p>注文していた名刺が、家に届きました。表は真鍮の窓から珊瑚の海をながめる二人、裏はウミガメ。サイトのホームの「名刺」ボタンから見られるのと同じデザインです。裏の QR を読みとると、このホームページに来られます。</p>'),
 dict(date='2026-11-21', tag='サイト', title='イルカを、ドット絵の立体につくりなおした',
      body='<p>ホーム右下のイルカを「スプライトスタッキング」でつくりなおしました。小さなブロックでイルカを組み立てて、それを高さごとに輪切りにし、少しずつずらして重ねて描く方法です。ドット絵なのに立体に見えて、くるっと向きを変えられます。</p><p>しっぽをふって、まばたきして、ときどきジャンプ（一回転）。3D の重いしくみを使わないので、どの端末でも出るようになりました。</p>'),
 dict(date='2026-11-21', tag='ブース', title='素カフェ（素材カフェ）をオープン',
      body='<p>新しいブース「<a href="/socafe/">素カフェ</a>」をつくりました。このサイトのために作った素材を、カフェのメニューのように並べています。</p><ul class="r-list"><li>無料：88×31 バナー、ドット絵アイコン、背景パターン、ファミコン風の効果音（その場で試聴できます）、壁紙、レトロな窓とふきだし。学習キットも。</li><li>教材・プリント：数学Ⅰの一次不等式のスライド、データの分析の問題集、数学Ⅰ・A 基礎テスト（問題と解説）、フェルマーの最終定理 第1部、高校物理「原子」の授業プリント（PDF）。</li><li>むかしのホームページ素材：点滅する NEW!、区切り線、ボタン、カウンターの数字。</li><li>有料：LINE スタンプ（LINE STORE へ）。</li></ul><p>無料の素材は、個人でもお仕事でも使えます。素材そのものを配ったり売ったりするのだけ、NG です。</p>'),
 dict(date='2026-11-21', tag='ブース', title='映画ブースに「管理人の鑑賞記録」',
      body='<p><a href="/movie/">映画ブース</a>を見ごたえのある形にしました。いちばん上に、いま話題の映画が大きな背景で切りかわるスライド。話題の映画の列には、1〜10位の順位がつきました。</p><p>それから「管理人の鑑賞記録」をはじめました。洋画と邦画のタブがあって、観た映画のポスターが並びます。新作・旧作・最近観た順でしぼりこめます。候補は洋画118本・邦画95本。これから少しずつチェックしていきます。</p>'),
 dict(date='2026-11-19', tag='サイト', title='AI が入った。うしろの宇宙も 3D に',
      body='<p>さくらインターネットの「さくらのAI Engine」（月3,000回まで無料）を使って、サイトに AI を入れました。</p>'
           '<ul class="r-list"><li>ホーム右下のイルカに「質問する」から、サイトのことを聞けます。</li><li><a href="/books/">ドパ読！</a>に「本えらびコンシェルジュ」。いまの気分を書くと、96冊から3冊えらびます。</li><li><a href="/stamp/">スタンプブース</a>の fumi が、AI で返事をするようになりました。</li><li>ゲストブックや感想ノートの書きこみを、AI がそっと見張ります。</li></ul>'
           '<p>無料の回数をこえないように、1日の回数を決めてあって、使えないときは今までの動きにもどります。</p>'
           '<p>それから、ホームのうしろの宇宙を 3D にしました。星がゆらーり回って、流れ星がシュン。ロケットが飛んでいって、UFO がふわふわ。どちらもタップすると、煙を出して落ちていきます（ちゃんと立てなおして、また飛びます）。窓の裏にかくれている階段・扉・土管も 3D になって、さわると、ぷにっと手ごたえがあります。</p>'),
 dict(date='2026-11-19', tag='サイト', title='ページの中の移動を、ぬるっと優しく',
      body='<p>「ブース」「記事」「▲ ページの先頭へ」など、同じページの中へ飛ぶリンクを押したとき、一瞬でパッと飛ぶのをやめました。動きはじめと止まるところをゆっくりにして、ぬるっと流れるように移動します（遠いほど、少しだけ長く）。</p><p>上にメニューが貼りついているページでは、メニューにかくれない位置でちゃんと止まります。とちゅうで指やホイールを動かすと、そこで止まります。全部のブースで同じ動きです。</p>'),
 dict(date='2026-11-19', tag='サイト', title='ホームに 3D の UFO キャッチャーと、イルカ',
      body='<p>ホームの左上に、小さな 3D の UFO キャッチャーを置きました。アームが勝手にゆっくり動いて、くま・うさぎ・ねこのぬいぐるみをつかみにいきます。たまに取れて、たまに落とします。</p><p>右下には、3D のイルカがいます。ぷかぷか浮いて、ときどきくるっとジャンプ。押すと、サイトの小ネタをしゃべります。「またね」を押すと、そのあいだは帰っていきます。どちらも Three.js というしくみで、ブラウザの中で立体を描いています。</p>'),
 dict(date='2026-11-19', tag='アプリ', title='GitHub の棚卸し。つくりかけのアプリを洗い出した',
      body='<p>今年さわったリポジトリを、まとめて点検しました。README のチェックリスト、TODO、最後のコミットの日付から「いまどこで止まっているか」を見ています（App Store での実際の状況までは確かめていません）。</p>'
           '<ul class="r-list"><li><b>申請の直前で止まっている</b>：9本</li><li><b>開発の途中で止まっている</b>：20本ほど</li><li><b>中身がほぼ空（はじめのコミットだけ）</b>：13本</li><li><b>いま動いていて、ほぼ完成</b>：6本</li></ul>'
           '<p>審査の直前まで来ているのは、この4本でした。</p>'
           '<ul class="r-list"><li><a href="/apps/awstady-saa/">AWSSTUDY(SAA)</a>：チェックリストは「未完了」のままでしたが、実際には昨日公開できています。リストのほうを直さないと。</li>'
           '<li><a href="/apps/kuragoyomi/">蔵ごよみ</a>：のこりはスクリーンショットの確認など7項目。</li>'
           '<li><a href="/apps/terra/">TERRA</a>（Mac 版）：申請のための入力項目がまだ17個。</li>'
           '<li>鬼単（OniTan）のリポジトリ：申請に使う説明文や画像、広告・課金まわりの方針の整理がこれから。</li></ul>'
           '<p>ほかにも、同じ系統のアプリを何回もつくり直していて（グラフの学習アプリや、ジャンプのゲームなど）、どれを本線にするか決めないといけないことがわかりました。中身が空のリポジトリも、そろそろ片づけます。</p>'
           '<p>まずは、のこりの作業が少ないものから順に申請していきます。</p>'),
 dict(date='2026-11-18', tag='アプリ', title='AWSSTUDY(SAA)が App Store で公開開始。ビール雑学のアイコンも新しく',
      body='<p><a href="/apps/awstady-saa/">AWSSTUDY(SAA)</a>が App Store の審査を通過し、公開が始まりました（11月17日）。これで公開中のアプリは9本になりました。<a href="https://apps.apple.com/jp/app/id6829979446">App Storeで見る</a></p><p>あわせて、<a href="/apps/beerquiz/">ビール雑学クイズ</a>のアプリアイコンを、現在のストア版（ビールのグラスと泡のデザイン）に差し替えました。サイト側が古いアイコンのままでした。</p>'),
 dict(date='2026-11-17', tag='サイト', title='落書きの壁は、窓の裏へ引っ越した。🔑つき',
      body='<p>「落書きの壁」は、特設ステージからホームの窓の裏（階段の下）へ引っ越しました。リンクをたどるのではなく、窓を動かして見つける場所です。</p><ul class="r-list"><li>壁の道具に 🔑 が増えました。数字4桁のコードを入れると、ページを開いている間だけ消しゴムが「完全消し」に変わります</li><li>コードは裏口（backstage）の上のほうに書いてあります。誰でも見つけたら使えます</li><li>コードなしの消しゴムは今までどおり、字は消えても汚れが残ります</li></ul>'),
 dict(date='2026-11-17', tag='サイト', title='階段の下に、落書きの壁ができた',
      body='<p><a href="/stage/">特設ステージ</a>の階段の下に、大きな黒板の「落書きの壁」を作りました。チョーク（白・ピンク・黄色・水色）と消しゴムが置いてあります。</p><ul class="r-list"><li>チョークで描いたものは消えません（みんなの描いたものが、そのまま残ります）</li><li>消しゴムで消すと、字は消えても描いた汚れが必ず残ります。消せば消すほど、壁は味わい深くなります</li></ul>'),
 dict(date='2026-11-17', tag='サイト', title='頭の中ブースで、その場でつぶやけるようになった',
      body='<p><a href="/head/">頭の中ブース</a>の投稿欄が使えるようになりました。つぶやくときに「管理人（パスワード）」か「ゲスト」かを選べます。ゲストのつぶやきには印がつき、通報が3件集まると非表示になります。</p><p>管理人のパスワードは、ハッシュ（SHA-256）だけをサーバーに置く方式なので、パスワードそのものはサイトのどこにも書かれていません。</p>'),
 dict(date='2026-11-17', tag='サイト', title='お助けツールの右下に、😌が増えた',
      body='<p>ホーム左下の「お助けツール」を開くと、右下のすみに小さな正方形の 😌 ボタンがあります。押すと、昔の Windows 版を再現した本格マインスイーパーが開きます。</p><ul class="r-list"><li>初級 9×9（地雷10）・中級 16×16（地雷40）・上級 30×16（地雷99）</li><li>最初のクリックは必ず安全。右クリックで旗（🚩→？→なし）、開いた数字のクリックでまわりを一括オープン</li><li>残り地雷とタイマーは赤い LED 表示。顔は通常 😌、押している間 😮、負けると 😵、勝つと 😎</li><li>ベストタイムはブラウザに保存されます。スマホは長押し or 旗モードで旗が立てられます</li></ul>'),
 dict(date='2026-11-17', tag='サイト', title='地下に特設ステージ。HipHopブースと頭の中ブースができた',
      body='<p>ホームのどこかに、地下へつながる入口を3つ隠しました。ヒントは「窓は、青いタイトルバーをつかむと動かせる」です。見つけた先には<a href="/stage/">特設ステージ</a>があります。</p><ul class="r-list"><li><b><a href="/hiphop/">HipHopブース</a></b>：ヒップホップの歴史をポップに学べるブース。1973年のブロンクスから日本のシーンまで、「教科書」として読める形にまとめました。海外・日本のリンク集つき</li><li><b><a href="/head/">頭の中ブース</a></b>：管理人の、まだ企画段階のつぶやき置き場。昔の Twitter の画面を再現しました。投稿できるのは管理人だけです</li><li>もうひとつの出口は YouTube「なぜゲー」へのリンクです</li></ul>'),
 dict(date='2026-11-17', tag='マンガ', title='『トレンチャードの最終定理』P1・P2が完成。活動一覧もはじめた',
      body='<p>数学の女の子が主人公のマンガ『トレンチャードの最終定理』第1話を、コマごとに作る方式で制作しています。今日の進み具合はこんな感じです。</p><ul class="r-list"><li><b>制作方式を固定</b>：モノクロのラフネーム → コマ単位の原画 → ページに組み立て → セリフと数式は組版で載せる（数式は検証したものだけ）</li><li><b>P1（1ページ目）の清書版が完成</b>し、レビュー91点で承認</li><li><b>P2も完成</b>し、レビュー92点で承認。P3はネームを直して、試作版まで進みました</li><li>マンガ『島の灯台と猫』第1話の原画20枚を再検証（破損なし。第2話は脚本の確認待ち）</li><li>note のアーカイブ記事を1本公開し、次の10本（11/26〜12/05 分）を予約</li><li>このサイトに「<a href="/activities/">活動一覧</a>」のページを新しく作りました。今日やったことも、そちらに時刻つきで載せています</li></ul>'),
 dict(date='2026-11-17', tag='サイト', title='バナーの壁と、学習用のダウンロード',
      body='<p>ページのいちばん下に、88×31 のバナーをずらっと並べました。ミニゲーム、ボドゲ、美術館、ラーメン、名刺、キリ番……どれも点滅するドット絵で、新しくつくったものです。ウインドウは、青いタイトルバーをつかむと動かせるようになりました。</p><p><a href="/bookmarks/">裏口（backstage）</a>では、学習用の教材を zip で配りはじめました。<code>download</code> と打つと一覧が出ます。ボードゲーム AI のソース集、ミニゲーム4本、90年代ホームページの作り方キット、ファミコン風の音の出し方、AI と作る開発ノートの5本です。</p>'),
 dict(date='2026-11-16', tag='サイト', title='ページの切りかえと、起動画面',
      body='<p>ページを移動するとき、ブラウン管テレビのチャンネルを変えるように、画面がいちど消えてから点くようにしました（対応しているブラウザだけ）。リンクにふれた時点で先に読みこむので、押すとすぐ開きます。</p><p>ほかにも、読み進みがわかる虹色のバー、スクロールするとウィンドウが開くように出てくる動き、マウスについてくる星、ドパ読！の表紙がかたむく動きを入れています。ホームの起動画面は、光の粒が集まってロゴになる演出につくりなおしました。動きを減らす設定にしている人には出ません。</p>'),
 dict(date='2026-11-16', tag='サイト', title='ブースめぐりと、こまかい手直し',
      body='<p>ブースを見てまわるのが楽しくなるように、「ブースめぐり」をつくりました。各ブースのいちばん下に、まわったブースのしるしと「つぎのブース」への道しるべが出ます。9つ全部まわると制覇です（記録はその端末の中だけに残ります）。</p><p><a href="/doron/">どろん</a>には百物語のろうそくを100本ならべました。1本消すたびに、ひとことだけ話が出ます。<a href="/museum/">美術館</a>は所蔵品を先頭にして、「かけかえる」ボタンで別の9点に入れかえられるようにしました。<a href="/ramen/">ラーメン</a>は、麺とお品書きが重なっていたのを直しています。</p>'),
 dict(date='2026-11-16', tag='サイト', title='名刺を置きました',
      body='<p>ホームのメニューに「名刺」ボタンをつけました。ここだけは90年代風ではなく、黒い背景で名刺を大きく見せます。タップで裏返ります。スマホでは縦向きで大きく出ます。QR は2つあって、ひとつはこのサイトへ、もうひとつは名刺の画像（表・裏）を保存できるページへつながります。</p><p>ついでに、右のゲームコーナーで遊んでいるあいだは、ファミコン風のオリジナル BGM が流れるようにしました（「♪ 音楽」ボタンで消せます）。</p>'),
 dict(date='2026-11-16', tag='ブース', title='ラーメンブースに14杯、美術館に所蔵品',
      body='<p><a href="/ramen/">ラーメンブース</a>に、これまで食べた14杯（ほうとう・そばの番外編もふくむ）をならべました。しょうゆ・みそ・とんこつ・家系・二郎系などの味でしぼりこめます。写真は軽くするために小さめです。</p><p><a href="/museum/">美術館ブース</a>には「所蔵品」の部屋をつくりました。ドパ読！の表紙、LINE スタンプ、unityroom のゲームの絵から、毎日9点が入れかわって飾られます。</p>'),
 dict(date='2026-11-16', tag='ゲーム', title='CPU と遊べるボードゲームを9種つくった',
      body='<p><a href="/game/board/">ゲームブースのボードゲームの部屋</a>に、CPU とたいせんできるゲームを9種類置きました。</p><ul class="r-list"><li>日本：将棋（持ち駒・成り・二歩・打ち歩詰めもちゃんと判定）、囲碁（9路盤）、麻雀（CPU と2人打ち）、五目ならべ</li><li>世界：チェス、リバーシ、四目ならべ、チェッカー、マンカラ</li></ul><p>CPU の強さは3段階。将棋とチェスは、決まった手の数を正しく数えられるかで、ルールの作りを確かめました。</p>'),
 dict(date='2026-11-16', tag='サイト', title='クリック音と、お助けツール',
      body='<p>90年代風のページで、さわると昔のマウスみたいな「カチッ」という音が鳴るようにしました（右上でオン・オフ）。ホームには、右下に「▲TOP」、左下に「お助けツール」（手書きメモと電卓）も。</p>'),
 dict(date='2026-11-16', tag='サイト', title='昔のホームページっぽい機能を、どーんと追加',
      body='<p>90年代〜2000年代の個人ホームページにあったものを、いろいろ入れました。</p><ul class="r-list"><li><a href="/guestbook/">ゲストブック</a>（足あと帳）、<a href="/links/">リンク集</a>（88×31 のバナー）、<a href="/sitemap/">サイトマップ</a></li><li>本物のアクセスカウンター（今日・昨日の人数、キリ番をふんだら名前をのこせる）</li><li>右のメニューに、ゲームコーナー（ブロックおとし・うちゅうげきたい・クレーンゲーム・メダルゲーム風じゃんけん）、BGM、今日のおみくじ、Web拍手</li><li>ホームの起動画面には、こっそり起動音も</li></ul><p>ほかに、<a href="/books/">ドパ読！</a>の本1冊ずつのページ、新しい記事2本、アプリのページに開発日記が出るようにもしました。どこかに<b>隠しコマンド</b>もあります……。</p>'),
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
# GitHub の記録（tools/github_diary.json。リポジトリをつくりはじめた月ごと）
try:
    _gh = json.loads((pathlib.Path(__file__).parent / 'github_diary.json').read_text(encoding='utf-8'))
    have = {(d['date'], d['title']) for d in DIARY}
    DIARY += [g for g in _gh if (g['date'], g['title']) not in have]
except FileNotFoundError:
    pass
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
    return f'<a class="r-book" href="/books/{a}.html"><img src="{E(img)}" width="110" height="164" alt="{E(m)}の表紙" loading="lazy"><b>{E(m)}</b>{f"<small>{E(s)}</small>" if s else ""}</a>'

def icon(href, img, name, note, dev=False, ext=False):
    t = ' target="_blank" rel="noopener"' if ext else ''
    return f'<a class="r-icon" href="{href}"{t}><img src="{img}" width="56" height="56" alt=""><span>{E(name)}</span><small class="{"dev" if dev else ""}">{note}</small></a>'

# ================= トップページ =================
def _jsarr(path, var):
    """window.X = [...] の形のファイルから、配列を読む（なければ空）"""
    try:
        t = (R / path).read_text(encoding='utf-8'); i = t.index('window.' + var + ' =') + len('window.' + var + ' =')
        return json.loads(t[i:].strip().rstrip(';'))
    except Exception: return []
_SOZAI = _jsarr('socafe/free.js', 'SOCAFE_FREE')
N_STUDY = sum(1 for x in _SOZAI if x.get('cat') == 'study'); N_SOZAI = len(_SOZAI) + len(_jsarr('bookmarks/downloads.js', 'DOWNLOADS'))  # 素カフェの「無料」の数（素材＋教材＋学習キット）
N_WATCH = len(_jsarr('movie/watchlist.js', 'WATCHLIST'))

def build_index():
    whats = [
        ('2026-11-28', 'サイトのアイコンを一新！ 金色の「G」と、ひらめきの星', True),
        ('2026-11-27', 'ブースのボタンに「作画」の演出！ 押すとドン！ポン！カチッ（ホーム以外）', True),
        ('2026-11-26', '定期メンテ（3日に1回）スタート！ <a href="/diary/">開発日記</a>を種類でしぼりこめるように／地下のブースにもメニュー', True),
        ('2026-11-22', '<a href="/museum/">美術館ブース</a>に、はじめての来館記録！ 太田記念美術館の葛飾応為展／名刺が届きました', True),
        ('2026-11-21', '右下のイルカが、ドット絵の立体（スプライトスタッキング）に生まれかわりました', True),
        ('2026-11-21', '「数字で見るGiveTex」に、素カフェの素材・教材プリント・ボードゲーム・映画の候補の数を追加', True),
        ('2026-11-28', '新ブース<a href="/gakko/">「Gakko」</a>オープン！ 先生は授業タイマー・計算プリント・席がえくじ、生徒は計算タイムアタックやクイズ。ぜんぶ無料', True),
        ('2026-11-21', '新ブース<a href="/socafe/">「素カフェ」</a>オープン！ 素材と、数学・物理の教材プリント（PDF）を無料でダウンロードできます', True),
        ('2026-11-21', '<a href="/movie/">映画ブース</a>がリニューアル！ 話題の映画のスライドと、管理人の鑑賞記録（洋画／邦画）', True),
        ('2026-11-19', 'ページの中の移動が、ぬるっと優しいスクロールに（全ブース）', True),
        ('2026-11-19', 'AI が入りました！ イルカに質問・<a href="/books/">本えらびコンシェルジュ</a>・fumi の返事／うしろの宇宙が 3D に。ロケットと UFO はタップすると…？', True),
        ('2026-11-19', '左上に 3D の UFO キャッチャー、右下に 3D のイルカがやってきました！ イルカは押すとしゃべります', True),
        ('2026-11-19', '<a href="/diary/">開発日記</a>に「GitHub の棚卸し」を書きました。つくりかけのアプリ、審査の直前まで来ているのは4本！', True),
        ('2026-11-18', '<a href="/apps/awstady-saa/">AWSSTUDY(SAA)</a>が App Store で公開開始！ 公開中のアプリは9本に／ビール雑学クイズのアイコンもストア版に差し替えました', True),
        ('2026-11-17', '「落書きの壁」はホームの窓の裏（階段の下）へ引っ越しました。🔑の数字4桁は裏口の上のほうに…？', True),
        ('2026-11-17', '<a href="/head/">頭の中ブース</a>で、その場でつぶやけるようになりました！ 管理人はパスワードで、ゲストもそのまま投稿できます', True),
        ('2026-11-17', 'お助けツールの右下に小さな 😌 が…？ 押すと昔のマインスイーパーが開きます（初級〜上級・ベストタイム保存つき）', True),
        ('2026-11-17', '地下に<a href="/stage/">特設ステージ</a>が出現！？ 窓を動かすと入口が見つかるかも…／<a href="/hiphop/">HipHopブース</a>と<a href="/head/">頭の中ブース</a>がオープン', True),
        ('2026-11-17', '<a href="/activities/">活動一覧</a>ページができました！ 今日の活動も時刻つきで載せています／<a href="/diary/">開発日記</a>にマンガ制作の記録を追加', True),
        ('2026-11-17', 'フッターにバナーがずらり（ミニゲーム・ボドゲ・名刺など）／<a href="/bookmarks/">裏口</a>で学習用の教材（zip）を配りはじめました／窓をつかんで動かせます', True),
        ('2026-11-16', 'ページの切りかえが、テレビのチャンネルを変えるような動きに！ 起動画面もつくりなおしました', True),
        ('2026-11-16', '「ブースめぐり」スタート！ 9つのブースをまわると制覇です／<a href="/doron/">どろん</a>に百物語のろうそく／<a href="/museum/">美術館</a>で作品のかけかえ', True),
        ('2026-11-16', 'メニューに「名刺」ボタン！ タップで裏返る・QR で名刺の画像をわたせます／ゲームコーナーで遊ぶと BGM が流れるように', True),
        ('2026-11-16', '<a href="/ramen/">ラーメンブース</a>に14杯！ 味でしぼりこめます／<a href="/museum/">美術館</a>に「所蔵品」の展示（毎日入れかわり）', True),
        ('2026-11-16', '<a href="/game/board/">ゲームブース</a>に、CPU と遊べるボードゲーム9種！ 将棋・囲碁・麻雀・チェス・リバーシ・マンカラなど', True),
        ('2026-11-16', 'ホームに<b>お助けツール</b>（手書きメモ・電卓）と、なつかしい<b>クリック音</b>（右上で ON／OFF）', True),
        ('2026-11-16', '<a href="/diary/">開発日記</a>に GitHub の記録（2022年〜）を追加', True),
        ('2026-11-16', '<a href="/guestbook/">ゲストブック</a>・<a href="/links/">リンク集</a>・<a href="/sitemap/">サイトマップ</a>をつくりました！ 足あと残してね', True),
        ('2026-11-16', '右のメニューに<b>ゲームコーナー</b>（じゃんけんはメダルゲーム風）・<b>BGM</b>・<b>おみくじ</b>・<b>Web拍手</b>', True),
        ('2026-11-16', 'カウンターが本物に！ 今日・昨日の人数と、<b>キリ番</b>をふんだ人の名前がのこります', True),
        ('2026-11-16', '<a href="/books/">ドパ読！</a>の{}冊に、1冊ずつのページができました'.format(TOTAL), True),
        ('2026-11-16', '新しい記事「<a href="/articles/ai-team-app-development.html">AIと分業してiPhoneアプリをつくる方法</a>」「<a href="/articles/ai-book-illustration-rules.html">AIで本の挿絵をつくる5つのルール</a>」', True),
        ('2026-11-16', 'ホームに起動画面／スマホの各ブースにメニューボタン／<a href="/diary/">開発日記</a>に2022年からの歩み（{}件）'.format(len(DIARY)), False),
    ]
    N_NOTE = sum(1 for p in js_json('note/posts.js', 'NOTE_POSTS') if p.get('noteUrl'))
    N_TALES = len(re.findall(r'"url": "https://tales\.note\.com/[^"]*/episodes/', (R / 'note/posts.js').read_text()))
    N_GAMES = len(js_json('game/game-data.js', 'GAME')['games'])
    last = max([DIARY[0]['date'], whats[0][0]] + [p['date'] for p in NOTE_POSTS[:1]])
    UPDATED = f'{int(last[:4])}年{int(last[5:7])}月{int(last[8:10])}日'
    rows = ''.join(f'<tr><td class="date">{d.replace("-", "/")}</td><td>{t} {NEWGIF if n else ""}</td></tr>' for d, t, n in sorted(whats, key=lambda w: w[0], reverse=True)[:6])  # ホームには直近6件まで（それより前は開発日記へ）
    welcome = f'''<p class="r-big"><script type="text/javascript"><!--
document.write(rGreeting());
//--></script><noscript>ようこそ！</noscript></p>
<p class="r-center"><b>GiveTex</b>（ギブテックス）のホームページへ ようこそ！<br>
ここでは <font color="#d10056"><b>教育 × IT</b></font> をテーマに、自作のアプリ、Kindle電子書籍「ドパ読！」、<br class="pc">オカルトブース「どろん」、それから開発日記などを置いています。<br>
ゆっくりしていってくださいね。</p>
<table class="r-tbl r-stats" summary="数字で見るGiveTex"><tr><th>App Store 公開中</th><th>開発中のアプリ</th><th>ドパ読！</th><th>note</th></tr><tr><td class="r-center"><b>{len(RELEASED)}</b> 本</td><td class="r-center"><b>{len(DEV)}</b> 本</td><td class="r-center"><b>{TOTAL}</b> 冊</td><td class="r-center"><b>{N_NOTE}</b> 本</td></tr><tr><th>TALES 連載</th><th>LINE スタンプ</th><th>unityroom</th><th>開発日記</th></tr><tr><td class="r-center"><b>{N_TALES}</b> 話</td><td class="r-center"><b>{len(STAMP_SETS)}</b> セット</td><td class="r-center"><b>{N_GAMES}</b> 本</td><td class="r-center"><b>{len(DIARY)}</b> 件</td></tr><tr><th>素カフェ（無料）</th><th>教材プリント</th><th>ボードゲーム</th><th>映画の候補</th></tr><tr><td class="r-center"><a href="/socafe/"><b>{N_SOZAI}</b> 品</a></td><td class="r-center"><a href="/socafe/"><b>{N_STUDY}</b> 点</a></td><td class="r-center"><a href="/game/board/"><b>9</b> 種</a></td><td class="r-center"><a href="/movie/#watched"><b>{N_WATCH}</b> 本</a></td></tr></table>
<p class="r-small r-center">最終更新日：{UPDATED}</p>'''
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
            win('アプリ置き場 - マイ コンピュータ', f'<div class="r-icons">{apps_icons}</div>', '💾', menu=True, status=[f'{len(RELEASED) + len(DEV)} 個のオブジェクト', f'App Store 公開中 {len(RELEASED)}']) +
            win(f'ドパ読！書庫 - Kindle電子書籍 {TOTAL}冊', f'<div class="r-shelf">{shelf}</div><p class="r-center"><a class="r-btn" href="/books/">全{TOTAL}冊を見る &gt;&gt;</a></p>', '📚') +
            win('どろん - オカルトブース', doron, '👻', cls='dark') +
            win('note ブース - 最新の記事', '<p class="r-center" style="margin:0 0 8px">NingentteWinner の note から、さいきんの記事。</p><div class="r-shelf r-notes">' + ''.join(f'<a class="r-book r-note" href="/note/posts/{E(p["slug"])}.html"><img src="{E(p["cover"])}" width="160" height="84" alt="" loading="lazy"><b>{E(p["title"])}</b><small>{p["date"].replace("-", "/")}</small></a>' for p in NOTE_POSTS[:8]) + '</div><p class="r-center"><a class="r-btn" href="/note/">note ブースへ（全 ' + str(len(js_json("note/posts.js", "NOTE_POSTS"))) + ' 本）&gt;&gt;</a></p>', '✒') +
            win('スタンプブース - LINE スタンプ', '<p class="r-center" style="margin:0 0 8px">fumi の LINE スタンプ <b>' + str(len(STAMP_SETS)) + 'セット</b>。トーク画面で送ってためせます。</p><div class="r-shelf r-stamps">' + ''.join(f'<a class="r-book r-stamp" href="/stamp/" title="{E(x["title"])}"><img src="{E(x["main"])}" width="96" height="96" alt="{E(x["title"])}" loading="lazy"><small>{E(x["title"])}</small></a>' for x in list(reversed(STAMP_SETS))[:10]) + '</div><p class="r-center"><a class="r-btn" href="/stamp/">スタンプブースへ &gt;&gt;</a></p>', '💬') +
            '<a name="booths" id="booths"></a>' + win('ブース案内 - GiveTex のなかみ', '<table class="r-tbl" summary="ブース一覧"><tr><th></th><th>ブース</th><th>なにがある？</th></tr><tr><td>💾</td><td><a href="/apps/">アプリ</a></td><td>iPhone / Mac の学習アプリ</td></tr><tr><td>📚</td><td><a href="/books/">ドパ読！</a></td><td>Kindle「30秒で読む」シリーズ</td></tr><tr><td>✒</td><td><a href="/note/">note</a></td><td>NingentteWinner の創作・TALES</td></tr><tr><td>💬</td><td><a href="/stamp/">スタンプ</a></td><td>LINE スタンプのトーク</td></tr><tr><td>🎮</td><td><a href="/game/">ゲーム</a></td><td>unityroom のゲームとゲームのつぶやき</td></tr><tr><td>🖼</td><td><a href="/museum/">美術館</a></td><td>所蔵品の展示（毎日かわる）と来館記録</td></tr><tr><td>🍜</td><td><a href="/ramen/">ラーメン</a></td><td>食べたラーメン14杯。麺がのびる</td></tr><tr><td>☕</td><td><a href="/socafe/">素カフェ</a></td><td>素材のダウンロード（無料・有料）</td></tr><tr><td>🏫</td><td><a href="/gakko/">Gakko</a></td><td>先生と生徒の道具箱（授業タイマー・計算プリント・クイズ…）</td></tr><tr><td>🎬</td><td><a href="/movie/">映画</a></td><td>話題の映画と、みんなの匿名の感想ノート</td></tr><tr><td>👻</td><td><a href="/doron/">どろん</a></td><td>オカルトブース</td></tr></table><p class="r-small" style="text-align:right;margin:6px 0 0"><a href="/bookmarks/" title="サイトの裏側">裏口 &gt;_</a></p>', '🗺') +
            '<a name="diary" id="diary"></a>' + win('開発日記 - メモ帳', diary_top + '<p class="r-small">→ <a href="/diary/">日記をぜんぶ読む</a></p>', '📝') +
            '<a name="articles" id="articles"></a>' + win('記事 - AI・学びのお役立ち', f'<ul class="r-list">{arts}</ul>', '📄') +
            win('Web拍手', '<p class="r-small" style="margin:0 0 6px">このホームページが気に入ったら、拍手で応援してね！</p><div class="r-clap" data-page="home"><button type="button" class="r-btn">👏 拍手する</button> <b class="r-clap-n">0</b> ぱちぱち<br><input type="text" maxlength="100" placeholder="ひとこと（管理人にだけ届きます・なくてもOK）" aria-label="拍手にそえるひとこと"><p class="r-clap-out r-small" aria-live="polite"></p></div>', '👏') +
            '<div class="r-under"><span>🚧 このホームページは いつでも 工事中 です 🚧</span></div>')
    menu = ''.join(f'<a href="{h}">{t}</a>' for h, t in [('/apps/', 'アプリ置き場'), ('/books/', 'ドパ読！書庫'), ('/doron/', 'どろん（オカルト）'), ('/note/', 'note ブース'), ('/stamp/', 'スタンプブース'), ('/game/', 'ゲームブース'), ('/museum/', '美術館ブース'), ('/ramen/', 'ラーメンブース'), ('/socafe/', '素カフェ（素材）'), ('/gakko/', 'Gakko（先生・生徒）'), ('/movie/', '映画ブース'), ('/diary/', '開発日記'), ('/guestbook/', 'ゲストブック'), ('/links/', 'リンク集'), ('/sitemap/', 'サイトマップ'), ('/#articles', 'お役立ち記事'), ('/about.html', '管理人のプロフィール'), ('/privacy.html', 'プライバシー')])
    side = (win('MENU', f'<div class="r-menu">{menu}</div>', '📁', bodycls='') +
            win('カウンター', '<p class="r-center" style="margin:0">あなたは<br><span class="r-counter"><b>0</b><b>0</b><b>0</b><b>0</b><b>0</b><b>0</b></span><br><span id="r-count-label">人目のお客さまです</span></p><p id="r-today" class="r-center r-small" style="margin:4px 0 0"></p><p id="r-kiri" class="r-center r-red r-small" style="margin:4px 0 0"></p><p id="r-kiri-list" class="r-center r-small" style="margin:4px 0 0"></p><p class="r-small r-center" style="margin:4px 0 0">since 2026.03.22</p><p class="r-small r-center" style="margin:2px 0 0"><a href="/guestbook/">ゲストブックに足あと ✎</a></p>', '🔢') +
            win('BGM - MIDI プレイヤー', '<div id="r-bgm" class="r-bgm"><p class="r-bgm-now r-small">BGM は OFF です</p><select aria-label="曲をえらぶ"></select> <button type="button" class="r-btn">▶ さいせい</button></div><p class="r-small" style="margin:4px 0 0">♪ オリジナル曲です。押したときだけ鳴ります（音量に注意）</p>', '🎵') +
            win('今日のおみくじ', '<div id="r-omikuji" class="r-center"><button type="button" class="r-btn">おみくじを引く</button><div class="r-omi-res" aria-live="polite"></div></div>', '⛩') +
            win('管理人のプロフィール', '<table class="r-tbl" summary="プロフィール"><tr><th>なまえ</th><td>GiveTex</td></tr><tr><th>テーマ</th><td>教育 × IT</td></tr><tr><th>つくる</th><td>アプリ・Kindle本</td></tr><tr><th>Kindle</th><td>NingentteWinner</td></tr><tr><th>ほか</th><td>オカルト「どろん」</td></tr></table><p class="r-small" style="margin:4px 0 0">→ <a href="/about.html">くわしく</a></p>', '👤') +
            win('いまの時刻', '<p class="r-center" style="margin:0"><span id="r-clock">--:--:--</span></p>', '⏰') +
            win('リンク', '<p class="r-center" style="margin:0"><a href="/"><img src="/assets/retro/bnr-givetex.gif" width="88" height="31" alt="GiveTex"></a><br><span class="r-small">リンクフリーです！<br>バナーはお持ち帰りOK</span><br><a class="r-small" href="/links/">→ リンク集へ</a><br><span class="r-small">★ Ctrl+D（Mac は ⌘+D）で<br>お気に入りに入れてね！</span></p><p class="r-center" style="margin:6px 0 0"><img src="/assets/retro/koujichu.gif" width="88" height="31" alt="工事中"></p>', '🔗') +
            win('ゲームコーナー', '''<div class="mg" id="mg">
<div class="mg-tabs" role="group" aria-label="ゲームをえらぶ"><button type="button">ブロック</button><button type="button">うちゅう</button><button type="button">クレーン</button><button type="button">じゃんけん</button></div>
<div class="mg-screen" tabindex="0" aria-label="ゲーム画面。クリックしてから、矢印キーとスペースキーで遊べます"><canvas width="160" height="240"></canvas></div>
<p class="mg-info"></p>
<div class="mg-pad"><button type="button" data-k="left" aria-label="ひだり">◀</button><button type="button" data-k="up" aria-label="うえ・かいてん">▲</button><button type="button" data-k="down" aria-label="した">▼</button><button type="button" data-k="right" aria-label="みぎ">▶</button><button type="button" data-k="a" class="mg-a" aria-label="Aボタン">A</button></div>
<div class="mg-janken" hidden><button type="button" data-k="0">グー</button><button type="button" data-k="1">チョキ</button><button type="button" data-k="2">パー</button></div>
<p class="mg-opt"><button type="button" class="mg-music" aria-pressed="true">♪ 音楽 ON</button></p>
<noscript><p class="r-small">ゲームは JavaScript をオンにすると遊べます。</p></noscript>
</div>
<script src="/assets/minigames.js" defer></script>''', '🕹', cls='mg-win'))
    secret = '''<style>
.r-mainwrap{position:relative}
.r-mainwrap .win{position:relative;z-index:1}
.secret-layer{position:absolute;inset:0;z-index:0;pointer-events:none;overflow:hidden}
.secret-bt{position:absolute;pointer-events:auto;text-align:center;text-decoration:none;font-size:11px;color:#444;line-height:1.3}
.secret-bt svg{display:block;margin:0 auto 2px}
.secret-bt:hover{color:#d10056}
.wl-wrap{position:absolute;top:118px;left:50%;transform:translateX(-50%);width:min(600px,94%);pointer-events:auto;text-align:center}
.wl-cap{font:12px "DotGothic16",sans-serif;color:#e8e4da;margin-bottom:6px;text-shadow:0 1px 3px #000}
.wl-cap span{display:block;font-size:10.5px;color:#a49e8d;margin-top:2px}
.wl-board{position:relative;border:10px solid #6b4a2b;border-radius:6px;background:#26332b;box-shadow:inset 0 0 50px rgba(0,0,0,.55);aspect-ratio:16/9}
.wl-board canvas{position:absolute;inset:0;width:100%;height:100%;display:block}
#wl-chalk{cursor:crosshair;touch-action:none}
.wl-tools{display:flex;gap:6px;justify-content:center;flex-wrap:wrap;margin-top:8px}
.wl-tools button{font:11.5px "DotGothic16",sans-serif;background:#1c1c22;color:#e8e4da;border:1px solid #55545e;border-radius:999px;padding:5px 11px;cursor:pointer}
.wl-tools button[aria-pressed="true"]{border-color:#ffd678;box-shadow:0 0 0 1px #ffd678 inset}
.wl-tools .dot{display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:5px;vertical-align:-1px;border:1px solid rgba(0,0,0,.35)}
.wl-key{margin-top:8px;font:12px "DotGothic16",sans-serif;color:#e8e4da}
.wl-key input{width:92px;padding:5px 8px;font-size:14px;letter-spacing:.3em;text-align:center;border:1px solid #55545e;border-radius:4px;background:#101014;color:#fff}
.wl-key button{font:12px "DotGothic16",sans-serif;background:#1c1c22;color:#e8e4da;border:1px solid #55545e;border-radius:999px;padding:5px 12px;cursor:pointer}
#wl-keymsg{margin-left:8px;color:#ffd678}
</style>
<div class="secret-layer" aria-hidden="false">
<a class="secret-bt" style="top:30px;left:45%" href="/stage/" aria-label="ひみつ：ちかへの階段"><svg width="52" height="52" viewBox="0 0 48 48" shape-rendering="crispEdges" aria-hidden="true"><path d="M4 44 h10 V36 h10 V28 h10 V20 h10 V44 Z" fill="#a8a8a8" stroke="#3a3a3a" stroke-width="2"/><path d="M4 44 h10 V36 h10 V28 h10 V20 h10" fill="none" stroke="#e8e8e8" stroke-width="2"/></svg>ちかへの階段</a>
<a class="secret-bt" style="top:37%;right:5%" href="/stage/" aria-label="ひみつ：ふしぎなドア"><svg width="52" height="52" viewBox="0 0 48 48" shape-rendering="crispEdges" aria-hidden="true"><rect x="13" y="3" width="22" height="42" fill="#5d3319"/><rect x="16" y="6" width="16" height="39" fill="#7a4525"/><rect x="19" y="10" width="10" height="12" fill="none" stroke="#4a2612" stroke-width="2"/><rect x="19" y="26" width="10" height="14" fill="none" stroke="#4a2612" stroke-width="2"/><circle cx="29" cy="24" r="2" fill="#ffd94a" stroke="#8a6d1f"/></svg>ふしぎなドア</a>
<a class="secret-bt" style="top:66%;left:5%" href="/stage/" aria-label="ひみつ：みどりの土管"><svg width="52" height="52" viewBox="0 0 48 48" shape-rendering="crispEdges" aria-hidden="true"><rect x="9" y="5" width="30" height="11" fill="#37c837" stroke="#0d6e0d" stroke-width="2"/><rect x="14" y="16" width="20" height="27" fill="#2db32d" stroke="#0d6e0d" stroke-width="2"/><rect x="17" y="5" width="5" height="38" fill="#8dff8d" opacity=".65"/></svg>みどりの土管</a>
<div class="wl-wrap">
<div class="wl-cap">階段の下 ― 落書きの壁<span>チョークは消えない。消しゴムは汚れが残る。🔑の数字は、裏口の上のほう。</span></div>
<div class="wl-board"><canvas id="wl-dirt" width="960" height="540"></canvas><canvas id="wl-chalk" width="960" height="540"></canvas></div>
<div class="wl-tools" id="wl-tools">
<button type="button" data-color="#ffffff" aria-pressed="true"><span class="dot" style="background:#ffffff"></span>白チョーク</button>
<button type="button" data-color="#ffd7e8" aria-pressed="false"><span class="dot" style="background:#ffd7e8"></span>ピンク</button>
<button type="button" data-color="#ffe066" aria-pressed="false"><span class="dot" style="background:#ffe066"></span>黄色</button>
<button type="button" data-color="#a8e6ff" aria-pressed="false"><span class="dot" style="background:#a8e6ff"></span>水色</button>
<button type="button" data-tool="erase" aria-pressed="false">▭ 消しゴム</button>
<button type="button" id="wl-keybtn" aria-pressed="false">🔑</button>
</div>
<div class="wl-key" id="wl-key" hidden><input id="wl-code" type="text" inputmode="numeric" autocomplete="off" maxlength="4" placeholder="数字4桁" aria-label="4桁コード"><button type="button" id="wl-unlock">解錠</button><span id="wl-keymsg"></span></div>
</div>
</div>
<script src="/assets/wall.js" defer></script>'''
    body = f'''<table class="r-layout" border="0" cellspacing="0" cellpadding="0" summary="レイアウト"><tr>
<td class="r-main" valign="top">
<div class="r-mainwrap">{secret}
{main}
</div>
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
<table class="r-tbl" summary="開発中のアプリ"><tr><th></th><th>アプリ</th><th>状態</th></tr>{r2}</table>""", '💾', menu=True, status=[f'{len(RELEASED) + len(DEV)} 個のオブジェクト', f'App Store 公開中 {len(RELEASED)} / 準備中 {len(DEV)}'])}
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
{win('開発日記 - メモ帳', f'<p>何をつくって、何を直して、何をリリースしたか。GiveTex の制作日記です。新しい順に並んでいます。</p><p class="r-jump">過去ログ：{idx}</p><hr class="r-hr">{parts}<hr class="r-hr"><p class="r-small">日記を読んでくれてありがとう！ よかったら拍手してね。</p><div class="r-clap" data-page="diary"><button type="button" class="r-btn">👏 拍手する</button> <b class="r-clap-n">0</b> ぱちぱち<br><input type="text" maxlength="100" placeholder="ひとこと（管理人にだけ届きます・なくてもOK）" aria-label="拍手にそえるひとこと"><p class="r-clap-out r-small" aria-live="polite"></p></div>', '📝', menu=True, status=[f'{len(DIARY)} 件の日記', '最終更新 ' + DIARY[0]['date'].replace('-', '/')])}
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

# ================= ゲストブック =================
def build_guestbook():
    moods = ''.join(f'<option>{E(m)}</option>' for m in ['', '(^^)', '(*^_^*)', '(^o^)/', '(T_T)', '(-_-;)', 'ヽ(´▽`)ノ', '(゜o゜)', 'm(_ _)m'])
    body = f'''<div class="r-page" role="main">
{win('ゲストブック - 足あと帳', f"""<p class="r-center">ようこそ！ 来てくれた記念に、<b>足あと</b>を残していってね。<br>感想、はじめましてのあいさつ、なんでもOK！ <blink><span class="r-red">★キリ番の報告もここで★</span></blink></p>
<form id="gb-form" class="ct gb-form" novalidate>
<table class="r-tbl gb-tbl" summary="書きこみ"><tr><th><label for="gb-name">おなまえ</label></th><td><input id="gb-name" name="name" type="text" maxlength="20" placeholder="名無しさん" autocomplete="nickname"></td></tr>
<tr><th><label for="gb-from">どこから？</label></th><td><input id="gb-from" name="from" type="text" maxlength="20" placeholder="例：群馬、ネットサーフィン中"></td></tr>
<tr><th><label for="gb-mood">きもち</label></th><td><select id="gb-mood" name="mood">{moods}</select></td></tr>
<tr><th><label for="gb-msg">メッセージ</label></th><td><textarea id="gb-msg" name="msg" rows="4" maxlength="400" required></textarea><br><span class="r-small" id="gb-c">0 / 400</span></td></tr></table>
<p class="ct-hp" aria-hidden="true"><label>空欄のままに<input name="website" type="text" tabindex="-1" autocomplete="off"></label></p>
<p class="r-center"><button class="r-btn ct-send" type="submit" name="send">書きこむ ✎</button></p>
<div id="gb-out" role="status" aria-live="polite"></div>
<p class="r-small">・住所や電話番号、メールアドレス、リンクは書けません（自動ではじきます）。<br>・ひどい書きこみは、3人から「通報」されると自動で見えなくなります。<br>・自分の書きこみは、同じブラウザからなら削除できます。</p>
</form>
<hr class="r-hr">
<p class="r-center"><b id="gb-total">読みこみ中…</b></p>
<div id="gb-list" class="gb-list" aria-live="polite"></div>
<p class="r-center"><button class="r-btn" type="button" id="gb-more" hidden>もっと読む</button></p>
<hr class="r-hr"><div class="r-clap" data-page="guestbook"><button type="button" class="r-btn">👏 拍手する</button> <b class="r-clap-n">0</b> ぱちぱち<br><input type="text" maxlength="100" placeholder="ひとこと（管理人にだけ届きます・なくてもOK）" aria-label="拍手にそえるひとこと"><p class="r-clap-out r-small" aria-live="polite"></p></div>
<noscript><p class="r-warn">ゲストブックは JavaScript をオンにすると使えます。</p></noscript>""", '📖')}
</div>
<script src="/assets/guestbook.js" defer></script>'''
    page('guestbook/index.html', 'ゲストブック（足あと帳） | GiveTex', 'GiveTex のゲストブック。来てくれた記念に、足あとを残していってね。', body, '/guestbook/')

# ================= リンク集 =================
def build_links():
    def bn(href, img, alt, ext=False):
        t = ' target="_blank" rel="noopener"' if ext else ''
        return f'<a class="r-bnr" href="{href}"{t}><img src="/assets/retro/{img}" width="88" height="31" alt="{E(alt)}" loading="lazy"></a>'
    inside = ''.join(bn(h, i, a) for h, i, a in [('/', 'bnr-givetex.gif', 'GiveTex'), ('/books/', 'bnr-dopayomi.gif', 'ドパ読！'), ('/doron/', 'bnr-doron.gif', 'どろん'), ('/apps/', 'bnr-apps.png', 'GiveTex Apps'),
        ('/note/', 'bnr-note.png', 'note ブース'), ('/stamp/', 'bnr-stamp.png', 'スタンプブース'), ('/game/', 'bnr-game.png', 'ゲームブース'), ('/movie/', 'bnr-movie.png', 'C-Log 映画ブース'),
        ('/diary/', 'bnr-diary.png', '開発日記'), ('/guestbook/', 'bnr-guestbook.png', 'ゲストブック')])
    outside = [('https://note.com/benkein', 'bnr-x-note.png', 'note（NingentteWinner）', 'note で書いている創作・エッセイ'),
               ('https://tales.note.com/benkein', 'bnr-x-tales.png', 'TALES', '連載小説「島の灯台と猫」'),
               ('https://store.line.me/stickershop/author/4293406/ja', 'bnr-x-line.png', 'LINE STORE', 'fumi の LINE スタンプ'),
               ('https://unityroom.com/users/qtnhm79e0xd5plfw28c4', 'bnr-x-unity.png', 'unityroom', 'ブラウザで遊べるゲーム'),
               ('https://github.com/Ben-Kei-create', 'bnr-x-github.png', 'GitHub', 'つくったもののソースコード')]
    out_rows = ''.join(f'<tr><td class="r-center">{bn(h, i, a, True)}</td><td><a href="{h}" target="_blank" rel="noopener">{E(a)}</a><br><span class="r-small">{E(d)}</span></td></tr>' for h, i, a, d in outside)
    code = E('<a href="https://www.givetex.org/"><img src="あなたのサーバーに置いた画像" width="88" height="31" alt="GiveTex"></a>')
    body = f'''<div class="r-page" role="main">
{win('リンク集 - お気に入り', f"""<p class="r-center">GiveTex の中のブースと、管理人のほかの場所へのリンクです。<br>バナーをクリックすると飛べます。</p>
<h2 class="r-h">🏠 GiveTex の中</h2>
<div class="r-bnrs">{inside}</div>
<h2 class="r-h">🌏 管理人のほかの場所</h2>
<table class="r-tbl r-links" summary="管理人のほかの場所">{out_rows}</table>
<h2 class="r-h">🤝 相互リンク募集中！</h2>
<p>当サイトは<b>リンクフリー</b>です。報告もいりません（してくれたらうれしいです）。<br>相互リンクのご希望は、<a href="/contact/">お問い合わせ</a>か<a href="/guestbook/">ゲストブック</a>からどうぞ。</p>
<p class="r-center"><img src="/assets/retro/bnr-givetex.gif" width="88" height="31" alt="GiveTex のバナー"><br><span class="r-small">↑ うちのバナーです。<b>お持ち帰り</b>して使ってね（直リンクはごえんりょください）</span></p>
<p class="r-small">リンク用のタグ：</p>
<textarea class="r-code" readonly rows="3" onclick="this.select()">{code}</textarea>
<hr class="r-hr"><div class="r-clap" data-page="links"><button type="button" class="r-btn">👏 拍手する</button> <b class="r-clap-n">0</b> ぱちぱち<br><input type="text" maxlength="100" placeholder="ひとこと（管理人にだけ届きます・なくてもOK）" aria-label="拍手にそえるひとこと"><p class="r-clap-out r-small" aria-live="polite"></p></div>""", '🔗')}
</div>'''
    page('links/index.html', 'リンク集 | GiveTex', 'GiveTex のリンク集。サイトの中のブースと、管理人の note・TALES・LINE スタンプ・unityroom・GitHub へのバナー。相互リンク募集中。', body, '/links/')

# ================= 手で書いたページのヘッダーも最新に =================
def sync_static_headers():
    """記事・404・お問い合わせ・プライバシーの上部（ロゴ・テロップ・メニュー）を、ほかのページと同じ最新のものにそろえる"""
    pages = [('privacy.html', '/privacy.html'), ('404.html', ''), ('contact/index.html', '/contact/')] + [(p.relative_to(R).as_posix(), '/#articles') for p in sorted((R / 'articles').glob('*.html'))]
    for path, cur in pages:
        f = R / path
        if not f.exists(): continue
        t = f.read_text(encoding='utf-8')
        m = re.search(r'<a name="top" id="top"></a>\s*<div class="r-head" role="banner">.*?<div class="r-nav"[^>]*>.*?</div>\s*</div>', t, re.S)
        if not m: continue
        nt = t[:m.start()] + header(cur).strip() + t[m.end():]
        if cur == '/contact/' and '/assets/meishi.js' not in nt: nt = nt.replace('</body>', '<script src="/assets/meishi.js" defer></script>\n</body>', 1)
        if nt != t: f.write_text(nt, encoding='utf-8')

# ================= アプリのページに「開発日記」 =================
APP_WORDS = {'doparika': ['ドパリカ'], 'heydrum': ['ヘイドラム', 'HeyDrum'], 'kuragoyomi': ['蔵ごよみ', 'sakeQuiz'], 'linatex': ['LinaTeX'], 'onitan': ['OniTan'],
             'paperstory': ['PaperStory', '走れメロス'], 'terra': ['TERRA'], 'beerquiz': ['ビール雑学', 'beer_Server'], 'winequiz': ['ワイン'], 'minigamer': ['MiniGamer'],
             'aws-saa-dojo': ['設計道場'], 'awstady-saa': ['AWSTUDY'], 'uzacal': ['UzaCal'], 'yomuemo': ['よむエモ'], 'zayping': ['Zayping'], 'ionstep': ['イオンステップ']}
def build_app_diaries():
    """アプリのページの「ページ一覧」の前に、そのアプリが出てくる開発日記（新しい5件）を入れる"""
    for slug, words in APP_WORDS.items():
        f = R / 'apps' / slug / 'index.html'
        if not f.exists(): continue
        hits = [d for d in DIARY if f'/apps/{slug}/' in d['body'] or any(w in d['title'] + re.sub('<[^>]+>', '', d['body']) for w in words)][:5]
        t = f.read_text(encoding='utf-8')
        t = re.sub(r'<!-- diary -->.*?<!-- /diary -->\n?', '', t, flags=re.S)
        if hits:
            cards = ''.join(f'<a class="card" href="/diary/#m{d["date"][:7].replace("-", "")}">\n  <strong>{re.sub("<[^>]+>", "", d["title"])}</strong>\n  <span>{E(d.get("when") or d["date"].replace("-", "/"))}</span>\n</a>\n' for d in hits)
            block = f'<!-- diary -->\n<h2>開発日記</h2>\n{cards}<p class="ax-diary-more"><a href="/diary/">開発日記をぜんぶ読む ›</a></p>\n<!-- /diary -->\n'
            t = t.replace('<h2>ページ一覧</h2>', block + '<h2>ページ一覧</h2>', 1)
        f.write_text(t, encoding='utf-8')

# ================= サイトマップ =================
def build_sitemap_page():
    tree = [('/', 'GiveTex ホーム', [('/#booths', 'ブース案内'), ('/activities/', '活動一覧'), ('/diary/', '開発日記'), ('/guestbook/', 'ゲストブック'), ('/links/', 'リンク集'), ('/about.html', '管理人のプロフィール'), ('/contact/', 'お問い合わせ'), ('/privacy.html', 'プライバシーポリシー'), ('/stage/', '特設ステージ（地下）'), ('/hiphop/', 'HipHopブース'), ('/head/', '頭の中ブース')]),
            ('/apps/', 'アプリ', [(h, n) for h, _, n, _, _ in RELEASED if h] + [(f'/apps/{k}/', n) for k, n, _ in DEV]),
            ('/books/', 'ドパ読！（Kindle）', [('/books/#' + k, re.sub(r'^\S+\s', '', v)) for k, v in BOOKS['cats'].items()]),
            ('/doron/', 'どろん（オカルト）', [('/doron/#relics', 'relics'), ('/doron/#reikai', '霊界案内所'), ('/doron/#c-circle', 'Cサークル')]),
            ('/note/', 'note ブース', []), ('/stamp/', 'スタンプブース', []), ('/game/', 'ゲームブース', []), ('/museum/', '美術館ブース', []),
            ('/ramen/', 'ラーメンブース', []), ('/socafe/', '素カフェ（素材カフェ）', []), ('/gakko/', 'Gakko ブース（先生と生徒の道具箱）', [('/gakko/#sensei', '先生の道具'), ('/gakko/#seito', '生徒の道具')]), ('/movie/', '映画ブース（C-Log Web）', []), ('/bookmarks/', 'ブックマーク（裏口）', []),
            ('/#articles', 'お役立ち記事', [(h, t) for h, t in ARTICLES])]
    def node(h, t, kids, last):
        k = ''.join(node(a, b, [], i == len(kids) - 1) for i, (a, b) in enumerate(kids))
        return f'<li><a href="{h}">{E(t)}</a>' + (f'<ul>{k}</ul>' if k else '') + '</li>'
    body = f'''<div class="r-page" role="main">
{win('サイトマップ - エクスプローラー', '<p>GiveTex のページを、ぜんぶ木の形にならべました。迷子になったら、ここからどうぞ。</p><ul class="r-tree">' + ''.join(node(h, t, k, False) for h, t, k in tree) + '</ul>', '🗂', menu=True, status=['フォルダ表示', 'givetex.org'])}
</div>'''
    page('sitemap/index.html', 'サイトマップ | GiveTex', 'GiveTex のサイトマップ。ホーム、アプリ、ドパ読！、どろん、各ブース、記事へのリンクの一覧。', body, '/sitemap/')


# ================= 活動一覧 =================
def build_activities():
    acts = ''.join(f'<tr><td><b>{E(n)}</b></td><td>{d}</td><td nowrap>{l}</td></tr>' for n, d, l in [
        ('アプリ開発', '学習アプリを iPhone / Mac 向けに開発。App Store 公開中 ' + str(len(RELEASED)) + '本、開発中 ' + str(len(DEV)) + '本', '<a href="/apps/">アプリ置き場</a>'),
        ('Kindle出版「ドパ読！」', '「30秒で読む」シリーズを NingentteWinner 名義で出版。全' + str(TOTAL) + '冊', '<a href="/books/">ドパ読！書庫</a>'),
        ('マンガ制作', '『トレンチャードの最終定理』（数学SF・制作中）と、『島の灯台と猫』（Kindleマンガ・第1話完成）', '<a href="/note/">note ブース</a>'),
        ('小説連載', '『島の灯台と猫』の小説版を TALES で連載中（マンガ版と世界・キャラクターを共有）', '<a href="https://tales.note.com/benkein" target="_blank" rel="noopener">TALES</a>'),
        ('note', '創作・エッセイを NingentteWinner 名義で。過去記事はこのサイトの note ブースでも読めます', '<a href="/note/">note ブース</a>'),
        ('YouTube「なぜゲー」', 'ゲームの「なぜ？」を掘り下げる動画チャンネル', '<a href="https://www.youtube.com/@nazege_ch" target="_blank" rel="noopener">YouTube</a>'),
        ('YouTube「Mingo Mango」', 'マンゴーの体をしたフラミンゴの、短い歌のチャンネル。1日1本まで投稿', '<a href="https://www.youtube.com/@mingomango_official" target="_blank" rel="noopener">YouTube</a>'),
        ('ゲーム制作', 'unityroom でブラウザゲームを公開。サイト内のゲームブースにもまとめています', '<a href="/game/">ゲームブース</a>'),
        ('技術記事', 'Zenn・Qiita への技術記事の投稿を準備中', '準備中'),
        ('オカルト「どろん」', '座談会・心霊スポット巡りと、新企画「十人奇談」の準備', '<a href="/doron/">どろん</a>'),
        ('映画', '映画ブース（C-Log Web）で話題の映画と感想ノート。映画サークルの活動もこちらへ', '<a href="/movie/">映画ブース</a>'),
        ('HipHop', 'ヒップホップの歴史と音楽をポップに学ぶブース。「教科書」と海外・日本のリンク集つき（地下の特設ステージからも行けます）', '<a href="/hiphop/">HipHopブース</a>'),
        ('頭の中', 'まだ企画段階のつぶやき置き場。昔の Twitter の画面を再現。投稿できるのは管理人だけ', '<a href="/head/">頭の中ブース</a>'),
    ])
    ext = ''.join(f'<tr><td><b>{E(n)}</b></td><td>{E(d)}</td><td nowrap><a href="{h}" target="_blank" rel="noopener">開く</a></td></tr>' for n, d, h in [
        ('GitHub', 'つくったもののソースコード', 'https://github.com/Ben-Kei-create'),
        ('note', 'NingentteWinner の創作・エッセイ', 'https://note.com/benkein'),
        ('TALES', '連載小説『島の灯台と猫』', 'https://tales.note.com/benkein'),
        ('X', 'ゲーム開発と AI・IT 学習の発信（@UzaUzaDeveyu）', 'https://x.com/UzaUzaDeveyu'),
        ('unityroom', 'ブラウザで遊べるゲーム', 'https://unityroom.com/users/qtnhm79e0xd5plfw28c4'),
        ('LINE スタンプ', 'fumi の LINE スタンプ', 'https://store.line.me/stickershop/author/4293406/ja'),
    ])
    today = ''.join(f'<li><b>{E(tm)}</b>　{E(tx)}</li>' for tm, tx in [
        ('07:00', 'note のアーカイブ記事を1本公開'),
        ('07:46〜08:13', 'note のアーカイブ第2弾として、古い下書き10本を 11/26〜12/05 の毎朝07:00公開で予約'),
        ('午前', 'マンガ『トレンチャードの最終定理』の制作方式を変更（ラフネーム → コマ単位の原画 → 組み立て → 組版）'),
        ('午前', '同作 P1 の清書版が完成。レビュー91点で承認'),
        ('お昼ごろ', '同作 P2 が完成。レビュー92点で承認'),
        ('午後', '同作 P3 のネームを改訂（レビュー87点・条件付き承認）して、試作版を制作'),
        ('13:50ごろ', 'マンガ『島の灯台と猫』第1話の原画20枚を再検証（破損なし）'),
        ('夕方', 'GiveTeX の更新専用セッションを開始。この活動一覧ページの制作に着手'),
        ('夜', '地下の特設ステージと、HipHopブース・頭の中ブースの開設を指示。隠しボタンの制作を開始'),
    ])
    body = f'''<div class="r-page" role="main">
{win('活動一覧 - GiveTex', f"""<h2 class="r-h">🗂 活動一覧</h2>
<p>GiveTex の管理人がやっていることを、まとめたページです。「発想 → 調査 → 設計 → 制作 → 検証 → 公開」の流れで、つくっては出しています。新しい活動を始めたら、ここに足していきます。</p>
<table class="r-tbl" summary="活動一覧"><tr><th>活動</th><th>内容</th><th>場所</th></tr>{acts}</table>
<h3 class="r-h3">管理人のほかの場所</h3>
<table class="r-tbl" summary="外部リンク"><tr><th>場所</th><th>内容</th><th>リンク</th></tr>{ext}</table>
<p class="r-small">お問い合わせは contact[at]givetex.org まで（[at] を @ にかえてね）。</p>""", '🗂', menu=True, status=['活動 ' + '13' + ' 件', '外部リンク 6 件'])}
{win('今日の活動 - 2026/11/17(火)', f"""<p>今日やったことを、時刻つきで載せています（個人の情報や、メールの中身のようなものは載せていません）。ラーメンなど、ほかのブースに合う内容があった日は、そちらのブースに書きます。</p>
<ul class="r-list">{today}</ul>
<p class="r-small">→ くわしい制作の記録は <a href="/diary/">開発日記</a> へ</p>""", '📝', menu=True, status=['2026/11/17 の記録', '9 件'])}
</div>'''
    page('activities/index.html', '活動一覧 | GiveTex', 'GiveTexの管理人の活動一覧。アプリ開発、Kindle出版、マンガ・小説、YouTube、技術記事などの入口と、今日の活動の記録です。', body, '/activities/')

build_index(); build_diary(); build_about(); build_guestbook(); build_links(); build_activities(); sync_static_headers(); build_app_diaries(); build_sitemap_page()  # books は pop デザインのまま（再生成しない）

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
