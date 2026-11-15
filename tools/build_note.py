import sys, pathlib, html
T = pathlib.Path(__file__).parent; R = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 and __name__ == '__main__' else pathlib.Path(__file__).resolve().parents[1]) / 'note'
HEAD = (T/'note_head.html').read_text().rstrip()
GEAR = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/></svg>'
BAR = f'''<a class="sr" href="#main">本文へ</a>
<header class="nb-bar">
  <div class="nb-bar-in">
    <a class="nb-brand" href="/note/"><b>NingentteWinner</b><span>note ブース</span></a>
    <nav aria-label="メニュー">
      <a href="/note/">記事一覧</a>
      <a class="opt" href="/">GiveTex</a>
      <button class="nb-icon nb-settings-btn" type="button" aria-expanded="false" aria-controls="nb-settings">{GEAR}<span>表示</span></button>
    </nav>
  </div>
</header>
<div class="nb-settings" id="nb-settings" role="dialog" aria-label="表示の設定" hidden>
  <p>背景</p>
  <div class="nb-seg"><button type="button" data-set="theme" data-val="auto">自動</button><button class="t-light" type="button" data-set="theme" data-val="light">白</button><button class="t-sepia" type="button" data-set="theme" data-val="sepia">セピア</button><button class="t-dark" type="button" data-set="theme" data-val="dark">黒</button></div>
  <p>文字の大きさ</p>
  <div class="nb-seg"><button type="button" data-set="size" data-val="s" style="font-size:13px">小</button><button type="button" data-set="size" data-val="m" style="font-size:15px">中</button><button type="button" data-set="size" data-val="l" style="font-size:18px">大</button></div>
  <p>書体</p>
  <div class="nb-seg"><button class="f-serif" type="button" data-set="face" data-val="serif">明朝</button><button type="button" data-set="face" data-val="sans">ゴシック</button></div>
</div>'''
FOOT = '''<footer class="nb-foot">
  <div class="nb-foot-in">
    <a href="/note/">記事一覧</a><a href="/">GiveTex ホーム</a><a href="/privacy.html">プライバシーポリシー</a>
    <p>&copy; 2026 NingentteWinner / GiveTex</p>
  </div>
</footer>'''
def page(title, desc, body, canon, extra=''):
    return f'''<!DOCTYPE html>
<html lang="ja">
<head>
{HEAD}
<title>{title}</title>
<meta name="description" content="{desc}">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:type" content="{'article' if '/posts/' in canon else 'website'}">
<meta property="og:locale" content="ja_JP">
<link rel="canonical" href="{canon}">{extra}
</head>
<body>
{BAR}
{body}
{FOOT}
</body>
</html>
'''
SEARCH = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>'
index = f'''<main id="main">
  <section class="nb-hero">
    <p class="nb-eyebrow">NOTE BOOTH</p>
    <h1>NingentteWinner</h1>
    <p class="nb-tagline">書いたものを、ここにも置いておく。</p>
    <p class="nb-desc">note で5年ほど書いてきた創作やエッセイ、349本をこちらにも移しました。気になるタイトルから、どうぞ。</p>
    <div class="nb-hero-links">
      <a class="nb-btn primary" href="#nb-list">記事を読む ↓</a>
      <a class="nb-btn" data-note-profile href="#" target="_blank" rel="noopener" hidden>note で見る ↗</a>
    </div>
  </section>
  <div class="nb-wrap">
    <div class="nb-tools">
      <label class="nb-search"><span class="sr">記事をさがす</span>{SEARCH}<input id="nb-q" type="search" placeholder="タイトル・ことばでさがす" autocomplete="off" enterkeyhint="search"></label>
      <div class="nb-chips" id="nb-chips" aria-label="タグでしぼりこむ"></div>
      <nav class="nb-years" id="nb-years" aria-label="年ごとの目次"></nav>
    </div>
    <section class="nb-tales" id="nb-tales" aria-labelledby="nb-tales-h" hidden>
      <div class="nb-tales-hd"><h2 id="nb-tales-h">TALES の連載小説</h2><a data-tales-profile href="https://tales.note.com/benkein" target="_blank" rel="noopener">TALES のプロフィール ↗</a></div>
      <div class="nb-tales-list"></div>
    </section>
    <p class="nb-count" id="nb-count" aria-live="polite"></p>
    <div id="nb-list"><noscript><p class="nb-empty">記事の一覧の表示には JavaScript を有効にしてください。</p></noscript></div>
  </div>
</main>'''
if __name__ == '__main__': (R/'index.html').write_text(page('note ブース | NingentteWinner', 'NingentteWinner の note ブース。note で書いてきた創作やエッセイを、読みやすい形でまとめています。', index, 'https://www.givetex.org/note/'))

def article(slug, title, date, tags, prose, desc, noindex=False, after='', canonical=None):
    tg = ''.join(f'<a href="/note/?tag={html.escape(t)}">{html.escape(t)}</a>' for t in tags)
    y, m, d = date.split('-')
    body = f'''<div class="nb-progress" aria-hidden="true"><span></span></div>
<main id="main">
  <article class="nb-article" data-slug="{slug}">
    <header class="nb-head">
      <div class="nb-tags">{tg}</div>
      <h1>{html.escape(title)}</h1>
      <p class="nb-meta"><time datetime="{date}">{y}.{m}.{d}</time><span data-readtime></span></p>
    </header>
    <div class="nb-prose">
{prose}
    </div>{after}
  </article>
  <div class="nb-end">
    <p class="nb-fin">おわり</p>
    <div class="nb-origin"><span>この記事のオリジナルは note にあります。スキ・コメントは note でどうぞ。</span><a class="nb-btn primary" href="#" target="_blank" rel="noopener">note で読む ↗</a></div>
  </div>
  <nav class="nb-pager" aria-label="ほかの記事"></nav>
</main>'''
    extra = '\n<meta name="robots" content="noindex">' if noindex else ''
    (R/'posts'/f'{slug}.html').write_text(page(f'{html.escape(title)} | NingentteWinner', html.escape(desc, quote=True), body, canonical or f'https://www.givetex.org/note/posts/{slug}.html', extra))

if __name__ == '__main__': article('about-this-booth', 'note ブースをはじめます', '2026-11-15', ['お知らせ'], '''      <p>note に文章を書きはじめて、気づけば5年ほどになります。そこで書いてきたものを、ここ GiveTex にも置いていくことにしました。</p>
      <p>このブースは、とにかく<strong>読みやすいこと</strong>を大切にしています。右上の「表示」から、背景（白・セピア・黒）、文字の大きさ、明朝とゴシックを切り替えられます。選んだ設定は、次に来たときもそのまま残ります。</p>
      <h2>読み方</h2>
      <ul>
        <li>記事一覧では、タイトルやことばで検索したり、タグや年でしぼりこんだりできます。</li>
        <li>記事の最後には「前の記事」「次の記事」があるので、そのままスクロールして読みつづけられます。</li>
        <li>画面のいちばん上の細い線は、いまどのくらいまで読んだかの目印です。</li>
      </ul>
      <h2>これから</h2>
      <p>これまで note に投稿した349本を、こちらにも移しました。新しく書いたものも、ここに並べていきます。</p>
      <hr>
      <p class="center">どうぞ、ゆっくり。</p>''', 'NingentteWinner の note ブースのはじまり。読み方とこれからのこと。')

if __name__ == '__main__': article('_template', '（タイトル）', '2026-01-01', ['創作'], '''      <!-- ここから本文。段落は <p>、見出しは <h2>／<h3>、引用は <blockquote>、場面転換は <hr> -->
      <p>本文の段落です。</p>
      <h2>見出し</h2>
      <p>本文の段落です。<ruby>漢字<rt>かんじ</rt></ruby>にはルビもふれます。</p>
      <figure><img src="/note/img/example.jpg" alt="画像の説明" loading="lazy"><figcaption>画像の説明</figcaption></figure>
      <blockquote><p>引用文。</p></blockquote>
      <hr>
      <p>場面転換のあとの段落です。</p>
      <!-- ここまで本文 -->''', '（記事の紹介文）', noindex=True)
print('ok')
