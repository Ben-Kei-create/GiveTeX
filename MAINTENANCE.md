# GiveTex 保守・運用メモ（Muse さんへの引き継ぎ）

最終更新：2026-11-15

## 1. 全体
- **サイト**：https://www.givetex.org/ 。静的HTMLだけで、ビルド工程はありません。
- **公開の仕組み**：Vercel で配信しています。GitHub `Ben-Kei-create/givetex` の `main` に push すると、1分ほどで本番に反映されます。
- **作業ブランチ**：`redesign-pop`。2026-11-15 時点で `main` と同じ内容です（創作ブースも公開済み）。
- **このファイルと `tools/` について**：`.vercelignore` で除外しているので、本番には公開されません。

## 2. ブースとデザインの対応（混ぜないこと）
| 場所 | デザイン | スタイル | 備考 |
|---|---|---|---|
| `/`・`/diary/`・`/about.html`・記事・プライバシー | 90年代の個人ホームページ風 | `assets/retro.css`・`retro.js` | トップ・日記・プロフィールは **`tools/build_retro.py` で生成**します |
| `/books/`（ドパ読！） | ポップ（黄色・太い線） | `assets/pop.css` | **90年代風にしないこと**。オーナーの指示です。生成の対象からも外しています |
| `/apps/` 以下 | 白黒を切り替えられるシンプルなデザイン | `apps/assets/apps.css`・`apps.js` | フォントは英字 Fjalla One、日本語 WDXL Lubrifont JP N。App関連だけの専用デザインです |
| `/doron/`（どろん） | タブごとに雰囲気が変わるオカルト | `doron/doron.css`・`doron.js` | ロゴ3種は `doron/img/` |
| `/note/`（noteブース） | 読みやすさ優先 | `note/note.css`・`note.js` | 記事349本を移植済みです |
| `/sousaku/`（創作ブース） | コミケ × SF | `sousaku/sousaku.css`・`sousaku.js` | 本番に公開済み。ただしリンクなし・noindex（URLを知っている人だけ） |
| `/game/`（ゲームブース） | ゲームセンター（ドット・コイン・実績・隠しコマンド） | `game/game.css`・`game.js` | データは `game/game-data.js`（games＝作ったゲーム、posts＝つぶやき） |
| `/museum/`（美術館ブース） | 白い展示室・額縁 | `museum/museum.css`・`museum.js` | データは `museum/museum-data.js` |
| `/ramen/`（ラーメンブース） | スクロールで丼から麺がのびる | `ramen/ramen.css`・`ramen.js` | データは `ramen/ramen-data.js`（食券） |
| `/movie/`（映画ブース・C-Log Web） | C-Log のデザインを引き継ぐ | `movie/movie.css`・`movie.js` | 話題の映画・検索は C-Log のサーバーから `/api/clog` 経由。感想は匿名掲示板「みんなの C-Log」（`/api/board`）。ヒーローの下にオープンチャット「映画を見る会」への参加リンク、フッターで iPhone 版（開発中）を紹介 |
| `/bookmarks/`（ブックマークブース） | サイトの裏側・ターミナル | `bookmarks/bookmarks.css`・`bookmarks-term.js` | `bookmarks/bookmarks.js`。個人のアカウント・管理画面などは除外済み（183件） |
| `/stamp/`（スタンプブース） | グループトーク風（GiveTex オリジナル。LINE のロゴや配色はまねない） | `stamp/stamp.css`・`stamp.js` | 送ったスタンプは画面内だけ（送信しない） |

**レスポンシブ**：全ページ、幅320〜1440pxで、はみ出しがないことを確認しています。変更したら同じ範囲で確認してください。

## 2.5 サイトのアイコン（ファビコン）
- **デザイン**：90年代ロゴの「G」を、ゲームのゴールド風のドット絵にしたものです。
- **ファイル**：`/favicon.ico`（16・32・48px）、`/assets/icon/`（PNG・ホーム画面用の 180／192／512px）、`/site.webmanifest`。
- **作り直し**：`python3 -I tools/gold_g.py assets/icon`。全ページの `<head>` にリンク済みで、生成スクリプトにも入れてあります。

## 3. 手で直してはいけないページ
次の3ページは `tools/build_retro.py` で生成しています。HTMLを直接直すと、次に生成したときに消えます。
- `index.html`・`diary/index.html`・`about.html`
- 日記を足すときは、`build_retro.py` の `NEW_ENTRIES` に1件追加してから実行します。
- トップの更新履歴も、同じファイルの `whats` に追加します。

```bash
python3 -I tools/build_retro.py
```

## 4. よくある作業
### note の新しい記事を載せる
1. note に投稿した記事を、givetex にも載せます。
2. 新しい記事は14日間、冒頭だけを表示して「続きは note で」と案内します。15日目からは自動で全文になります。日数と文字数は `note/posts.js` の `teaserDays` と `teaserChars` で変えられます。
3. 取得と変換の手順は次のとおりです（一覧の取得から本文まで、ひと通りやり直します）。

```bash
tools/note_fetch.sh /tmp/note-data
```

```bash
python3 -I tools/migrate_note.py /tmp/note-data .
```

- **本家は note** です。各記事の `canonical` は note の元記事を向けています。変えないでください。
- **有料記事**は、無料部分だけを載せて「note で続きを読む」に誘導しています。
- **画像**は note のサーバーのものを、そのまま表示しています。

### ドパ読！（Kindle）に本を足す
- `books/index.html` は今は手作業で管理しています。
- 書籍のデータは `tools/books_all.json` にあり、Amazon の著者 NingentteWinner の一覧から作りました。
- 本を足すときは、既存の `.kb` カードと同じ形でHTMLに追加してください。

### どろんに活動記録を足す
- `doron/reports.js` に1件追加します。書き方の見本はファイルの先頭にあります。
- 写真は `doron/photos/` に置きます。
- `group` は `relics`（座談会）・`reikai`（霊界案内所）・`c-circle`（Cサークル）のどれかです。
- **どろんのフォントは「おそろしげ明朝」**（やっちゃん作、SIL OFL 1.1。ライセンス本文は `doron/fonts/OFL.txt`、フッターにクレジットあり）。
  - 軽くするため、ページで使う文字だけの `osorosige-core.woff2`（約180KB）と、残りの漢字の `osorosige-rest.woff2`（必要なときだけ読み込み）に分けています。
  - どろんの文章を大きく書き足したら、`<fonttools入りのpython> -I tools/doron_font.py <OsorosigeMincho.ttf>` で作り直してください（元のTTFはリポジトリに入れていません）。作り直さなくても表示は崩れず、新しい漢字だけ rest から読み込まれます。

### 創作ブースに作品を足す
- `sousaku/works.js` に1件追加します。書き方の見本はファイルの先頭にあります。素材は `sousaku/works/<id>/` に置きます。
- **公開状態** `status`：
  - `public`：一覧に出ます。
  - `unlisted`：URLやQRを知っている人だけが読めます。
  - `draft`：`?preview=1` で開いたときだけ見えます。
- 静的サイトなので、**完全な鍵付き公開はできません**。
- 動作確認用のサンプル2作品（`sample-manga` と `sample-novel`、どちらも draft）は、本物の作品が入ったら消してください。
- 出展予定は `events` に入れます（名前・日付・会場・スペース番号）。

### スタンプブースにスタンプを足す
- `stamp/stamps.js` の `sets` に1セットずつ追加します（古い順）。書き方の見本はファイルの先頭にあります。
- 画像は `stamp/img/<id>/` に置きます（`main.png` と各スタンプ）。
- LINE STORE の作者ページURLを `storeAuthorUrl` に入れると、「すべてのスタンプを見る」が出ます。
- **fumi の返事のルールは `stamp/replies.js`**。`words`（この言葉が入っていたら）と `replies`（この中から返す）を書き足すだけで動きます。
- トークの相手の名前は **fumi**、訪問者は **You** と表示します。fumi はキーワードで返事をし、それ以外は `assets/site-index.js`（`node tools/build_index.js` で作り直し）を部分一致で検索して返します（外部APIは使っていません）。
- 2026-11-15 時点で、LINE STORE の作者名 **heatshimmer** の18セット・248種類を掲載しています（作者ページ https://store.line.me/stickershop/author/4293406/ja から取得）。
- 画像は LINE のサーバー（`stickershop.line-scdn.net`）から直接読み込んでいます。
- 発売日はストアのページに出ないので、商品番号の順に `no`（No.1〜）で並べています。
- 新しいセットは、作者ページで商品番号を確かめ、商品ページの `data-preview` から画像URLを取って `sets` の末尾に追加します。

### ゲーム・美術館・ラーメン・映画ブースに書く
- それぞれのデータファイルの先頭に書き方の見本があります（`game/game-data.js`・`museum/museum-data.js`・`ramen/ramen-data.js`）。2026-11-15 時点ではどれも空です（架空の投稿は入れていません）。
- ゲームの `kind` は digital／boardgame／madamis／escape／event／other。

### note ブースの TALES
- `note/posts.js` の `NOTE_CONFIG.tales` に作品とエピソード（タイトル・日付・URL）を入れています。本家は TALES なので、エピソードは TALES へのリンクです。
- 新しい話が出たら `episodes` の末尾に追加します（現在『島の灯台と猫』11話／全30話）。

### ブックマークを更新する
- ブラウザから書き出したブックマーク（HTML）をもらい、個人のアカウント・管理画面・決済・求人・成人向けなどを除いて `bookmarks/bookmarks.js` を作り直します。

### ラーメン・美術館（2026-11-16）
- ラーメン：`ramen/ramen-data.js`（title・shop・tag・text・img）。写真は `ramen/img/` に、長い辺560px・WebP（画質50）で**小さく**。位置情報などの撮影データは消す。**人が写っている写真は載せない**。店名は分かるものだけ（分からなければ空のまま）。
- 美術館の所蔵品：`museum/collection.js`（本の表紙・スタンプ・ゲームの絵の一覧）から毎日9点を表示。

### ボードゲーム（/game/board/）
- 入れもの：`game/board/index.html`・`board.js`・`board.css`。ゲームは選ばれたときだけ `game/board/<名前>.js` を読みこむ。
- 9種：shogi・go（9路）・mahjong（2人打ち・簡易）・chess・reversi・gomoku・connect4・checkers・mancala。CPU の強さは3段階。
- 将棋・チェスは、手の数の検算（perft）で正しさを確認ずみ：将棋 30／900／25,470／719,731、チェス 20／400／8,902。
- 新しいゲームを足すときは、`board.js` の GAMES に1行足して、`BG.<名前> = { name, rules, sides?, mount(el, ui) }` のファイルを置く。

### クリック音・お助けツール
- `assets/retro-extras.js`：90年代風のページでさわるとクリック音（右上の「♪ 音」でオン・オフ、ブラウザに保存）。ホームだけ右下に「▲TOP」、左下に「お助けツール」（手書きメモ・電卓）。

### GitHub の記録（日記）
- `tools/github_diary.json`：公開リポジトリを、つくりはじめた月ごとにまとめた日記。コードや個人情報は入れない。

### 昔のホームページ機能（2026-11-16）
- `assets/retro-extras.js`：BGM（オリジナル曲を Web Audio で。押したときだけ）、今日のおみくじ（1日1回）、Web拍手（`api/clap.js`、ひとことは管理人にメール）、隠しコマンド（↑↑↓↓←→←→BA／スマホはホームのロゴを7回タップ）、右クリックのジョーク（禁止はしない）。
- `/sitemap/`：サイトマップ（ビルダーが自動生成）。
- ドパ読！の本ごとのページ：`tools/build_books_pages.py` が `tools/books_all.json` から `/books/<ASIN>.html` を作る（自動更新にも入っている）。
- アプリのページの「開発日記」：`build_retro.py` の `APP_WORDS` でアプリと日記を結びつける。
- 管理人へのメール通知：みんなの C-Log・ゲストブック・Web拍手のひとこと・キリ番の名前（1日40通まで、`L.notify`）。

### 今日のひとこと・アフィリエイト・ゲームコーナー
- 「当サイトはアフィリエイト広告を利用しています」の帯は、毎日かわる名言「今日のひとこと」に変えました（`assets/quote.js` の一覧に足すだけで増やせます）。
- 記事の A8.net の広告枠は `<template class="ad-off">` で**非表示**にしています（表示も読みこみもしない）。戻すときは template を外し、帯を「アフィリエイト広告を利用しています」に戻すこと（ステマ規制のため、広告を出すときは表示が必要）。
- ホーム右の「ゲームコーナー」：`assets/minigames.js`（ブロックおとし・うちゅうげきたい・クレーンゲーム・じゃんけんポン。すべてオリジナル）。ハイスコアはその人のブラウザに保存。

### ホームの数字・更新日
- 「数字で見る GiveTex」の表（アプリ・note・TALES・スタンプ・unityroom・日記の数）と「最終更新日」は、`tools/build_retro.py` がデータから自動で数えます。What's New とテロップ（NEWS）は手で書きかえます。

### ホームの「note」「LINE スタンプ」の棚
- ホームには note の最新8本（表紙画像つき）と、スタンプの新しい10セットを並べています。
- 中身は `note/posts.js` と `stamp/stamps.js` から自動で作るので、記事やスタンプを足したら `python3 -I tools/build_retro.py` を実行するだけです。

### つぶやきの場所（📍）
- 美術館・ラーメン・ゲーム・どろんの記録に、Google マップへのリンク「📍 場所」が付きます（`assets/place.js`。API キー不要・無料）。
- 美術館は「美術館名＋place」、ラーメンは「店名＋area」で自動。ゲームは本文の都道府県名を自動で見つけて「📍 東京都」程度まで。どろんは `map` を書いたときだけ。
- 各記録に `map: "検索することば"` で上書き、`map: false` で非表示。**個人の家・待ち合わせ場所など、特定されたくない場所は書かない**。

### 壊れにくくするしくみ
- **画像が読めないとき**：`assets/img-fallback.js` が「NO IMAGE」の絵に差し替えます（ほぼ全ページの `<head>` に入っています。新しいページにも入れてください）。
- **404 ページ**：`404.html`。URL の最後の言葉でサイト内を自動検索して、近いページを案内します。
- **スタンプのトーク**：連打されても返事は順番に1つずつ、溜まりすぎたら「ちょっと待ってね」。入力されたHTMLは文字として表示し、古いメッセージは300件を超えたら消します。
- **JavaScript が切られているとき**：ゲーム・美術館・ラーメン・映画は案内文を出します。

### サイト内検索の索引を作り直す
- アプリ・Kindle・note・TALES・スタンプ・記事を足したら `node tools/build_index.js` を実行します（`assets/site-index.js` が更新されます）。

### アプリを足す
- `apps/<名前>/` に、紹介・サポート・プライバシーの3ページを作ります。
- そのあと `python3 -I tools/apps_skin.py .` を実行すると、Appブースのヘッダーとフッター、テーマ切り替えが付きます。
- 一覧 `apps/index.html` と、ホームのアプリ欄にも追加します。ホームのアプリ欄は `build_retro.py` の `RELEASED` と `DEV` です。

## 4.8 自動更新・画像・SEO（2026-11-15〜）
- **毎朝 6:17（日本時間）に GitHub Actions「サイトの自動更新」**（`.github/workflows/auto-update.yml`）が動きます。
  1. note の記事を取得（`tools/note_fetch.sh`。取得ずみの本文は Actions のキャッシュに残る）→ `tools/migrate_note.py` で note ブースを作り直す（記事数が減ったら中止）
  2. `tools/update_feeds.py`：LINE スタンプの新作と TALES の新しい話を追加
  3. `tools/localize_images.py`：外部の画像を `assets/ext/` に保存して URL を書きかえ（対応表は `tools/ext_images.json`）
  4. `tools/build_retro.py` → `node tools/build_index.js` → `tools/seo.py`
  5. 変わっていたら main にコミット（Vercel が自動で公開）。手動実行は Actions 画面の Run workflow。
- **手で作業したときも、最後に** `python3 -I tools/build_retro.py && node tools/build_index.js && python3 -I tools/seo.py` を実行してください（seo.py がシェア用タグ・RSS・サイトマップを入れます）。
- **シェア用画像**：`assets/og/*.jpg`。デザインを大きく変えたら、ローカルでサイトを配信して `node tools/build_og.js http://127.0.0.1:8787` で撮り直し。note の記事は記事の表紙画像を使います。
- **RSS**：`/note/feed.xml`（note の新着30本・リンク先は note）、`/diary/feed.xml`（開発日記）。
- **sitemap.xml** は seo.py が自動生成（noindex・創作ブース・note が本家の記事は入れない）。

## 4.9 サーバー機能（`api/` フォルダ・Vercel の関数）
- `api/clog.js`：C-Log アプリのサーバー（`https://clog-api.onrender.com`）から話題の映画・検索・お知らせを中継。サーバーが眠っていたら約1分で起きます。
- `api/board.js`：映画ブースの匿名掲示板。管理人も含めて全員「名無しの映画好き」。日替わり ID、3人の通報で自動非表示、本人は削除可、連投・重複・リンク・個人情報・暴言を機械ではじく、最新1000件まで。
- `api/contact.js`：お問い合わせフォーム（`/contact/`）→ メール送信。
- `api/counter.js`：ホームのアクセスカウンター（本物）。Upstash の `site:visits`。1回の訪問（タブ）につき1度だけ数える。数字を直したいときは Upstash で `site:visits` を書きかえる。
- `api/guestbook.js`＋`/guestbook/`：ゲストブック（足あと帳）。Upstash の `gb:*`。仕組みは映画の感想ノートと同じ（通報3件で非表示・本人削除・連投やリンクをはじく）。
- キリ番：カウンターがキリ番（100の倍数・ゾロ目・1234 など）になった人に「名前を残す」欄が出る。記録は `site:kiri:<番号>`・一覧は `site:kirilist`。
- `/links/`：リンク集（88×31 バナーは `assets/retro/bnr-*.png`）。
- `api/_lib.js`：共通の道具（回数制限、合言葉、文字のそうじ、NG ワード）。
- **設定ずみ（2026-11-15）**：
  - 掲示板：Vercel の Storage に **Upstash for Redis**（`givetex-board`・東京・Free・月50万回まで）。接頭辞 `KV` で `KV_REST_API_URL`・`KV_REST_API_TOKEN` が入っています。
  - お問い合わせ：**Resend**（tofuodorico@gmail.com のアカウント）。givetex.org をドメイン認証ずみ（Cloudflare の DNS に `send`・`rsend`・`resend._domainkey` を追加）。Vercel の環境変数は `RESEND_API_KEY` と `CONTACT_FROM`（`GiveTex お問い合わせ <noreply@givetex.org>`）。宛先は tofuodorico@gmail.com（変えるなら `CONTACT_TO`）。
  - 環境変数を変えたら、Vercel の Deployments → ⋯ → Redeploy で反映。
- givetex.org の DNS は **Cloudflare** で管理しています（Google の所有権確認 TXT もここ）。
- 不適切な書きこみを消したいときは、Upstash の画面で `b:p:<番号>` を削除し、`b:list` からその番号を外します（ふだんは通報で自動非表示）。

## 5. アクセス解析（Google アナリティクス 4）
- **ID**：`G-RJ2BPF1RLV`。全ページで `assets/ga.js` から読み込んでいます。古い記事5本はページ内に直書きされているので、二重には読み込みません。
- **独自イベント**：

| イベント | 記録するもの |
|---|---|
| `note_click` | note へ移動したクリック。`placement` はどのボタンか、`article` はどの記事からか |
| `note_read_complete` | note ブースの記事を最後まで読んだ |
| `outbound_click` | そのほかの外部リンクへのクリック |
| `sousaku_open` | 創作ブースの作品を開いた |
| `sousaku_read_end` | 創作ブースの作品を最後まで読んだ |
| `sousaku_qr` | 創作ブースのQRコードを表示した |
| `stamp_send` | スタンプブースでスタンプを送った（画面内のみ） |
| `stamp_store_click` | スタンプブースからストアへ移動した |
| `game_achievement` | ゲームブースで実績を解除した |
| `ramen_kanshoku` | ラーメンブースを最後までスクロールした（完食） |
| `stamp_chat` | スタンプブースで会話した（種類と件数のみ。入力した文字は送らない） |
| `bookmarks_cmd` | ブックマークブースでコマンドを実行した |

- **⚠ テストの注意**：自動テスト（Playwright など）では、必ず `googletagmanager` と `google-analytics` へのリクエストを止めてください。2026-11-15 に一度止め忘れて、`localhost` からのテストアクセスが約700件入りました。分析するときは、ホスト名 `localhost` を除外してください。

## 6. 外部に頼っているもの
次のサービスが止まると、該当する部分が表示されません。
- **画像**：note の記事画像（`assets.st-note.com`）と、Amazon の書影（`m.media-amazon.com`）は直接読み込んでいます。
- **ライブラリ**：QRコードは cdnjs の `qrcodejs 1.0.0` を使っています。
- **フォント**：Google Fonts です（どろんの「おそろしげ明朝」だけは自サイトに置いています）。
- **画像**：LINE スタンプ（`stickershop.line-scdn.net`）も直接読み込んでいます。読めないときは「NO IMAGE」になります。

## 6.5 セキュリティ
- **`vercel.json` でセキュリティヘッダーを付けています**：CSP（スクリプトは自サイト・Google アナリティクス・cdnjs だけ許可、画像は https なら可、ほかのサイトへの埋め込み禁止）、X-Frame-Options、nosniff、Referrer-Policy、Permissions-Policy。HSTS は Vercel が付けます。
- **新しく外部のスクリプトやフォント・通信先を使うとき**は、CSP に追加しないと動きません（ブラウザのコンソールに「Content Security Policy」と出ます）。
- 外部ライブラリには SRI（改ざんチェック）を付けます。QR コードの `qrcodejs 1.0.0` は付け済みです。
- データ（JSON・本文など）を画面に出すときは `textContent` を使い、`innerHTML` に入れないこと。創作ブースの小説本文は、読み込むときにスクリプトや `on〜` 属性を取り除いています。
- 新しいタブで開くリンクには `rel="noopener"` を付けます。
- `.git`・`tools/`・`MAINTENANCE.md` は本番で 404 になることを確認済みです。
- 秘密情報（APIキー・パスワード）はリポジトリに入れないこと。静的サイトなので、ページに書いたものは誰でも見えます。

## 7. オーナーの方針（これまでの指示）
- 肩書きは「現役塾講師×エンジニア」ではなく、**教育 × IT** です。
- **ホーム（90年代風）とどろんは、ほかの作業のついでに変えない**こと。App関連の作業は App関連のページだけを変えます。
- **ドパ読！は、90年代風ではなくポップなデザインのまま**にします。
- **note は本家**です。givetex 側からは note に誘導します。
- **全部レスポンシブ**にしてください。
- **本番（main）への反映は、オーナーの了承を得てから**行います。
- **アップする画像は、オーナーが言わない限り「粗い画質・小さい容量」でよい**（長い辺 560px 前後・WebP 品質50くらい・撮影データは消す）。例外：名刺（`assets/meishi/`）は最高画質のまま。
- **個人情報・非公開の情報は、言われなくても最初から公開ページに出さない**（デフォルト）。名前・メールアドレス・住所・取引先・応募や申し込みの中身・非公開リポジトリの中身・規約にふれそうな使い方などは、日記や記事に書くときもぼかすか省く。迷ったら出さずにオーナーに確認する。

## 8. 未完了・オーナーからの返事待ち
- どろんの活動記録（概要・写真）。
- 創作ブースの最初の作品と、出展予定。
- ChatGPT 側にある開発日記。届いたら `tools/build_retro.py` の日記（`NEW_ENTRIES` / `tools/diary.json`）に取り込みます。
- ドパ読！の新刊の追加。Amazon の一覧から作ったので、英語版などの海外版は載せていません。

## 名刺（ホームの「名刺」ボタン）
- `assets/meishi.js` / `assets/meishi.css`：ホームのメニューの「名刺」ボタンで開く、黒い背景のダイアログ。ホームだけで読みこむ（build_retro.py が index.html の最後に入れる）。
- 画像：`assets/meishi/front.jpg`・`back.jpg` は、もらった画像を**再圧縮せず**、撮影データ（EXIF）だけ外したもの。最高画質のまま使う。
- `assets/meishi/qr.svg`：名刺の裏の QR と同じ行き先（https://www.givetex.org/）の、読み取りやすい QR。名刺の QR は canvaqr.com 経由で givetex.org に飛ぶ。
- できること：タップ・スワイプ・矢印キーで裏返す、縦・横の切りかえ（縦長の画面では最初から縦向き）、QR は2つ（「サイト」＝ qr.svg、「名刺の画像」＝ qr-card.svg → /meishi/）。`/?meishi` で名刺を開いた状態から始まる。
- `meishi/index.html`：名刺の QR から来た人が画像を保存するページ（noindex・サイトマップに入れない）。`assets/meishi/both.jpg` は表と裏をならべた1枚（1756×2188、品質95）。スマホは共有シート（写真に保存）、PC はダウンロード。表・裏だけの保存もできる。
- ゲームコーナーの BGM は `assets/minigames.js` の TUNES（4曲ともオリジナル）。右上の「音 OFF」かゲームコーナーの「♪ 音楽」で止まる。サイトの BGM プレイヤーとは同時に鳴らない。

## ブースめぐり・百物語・美術館のかけかえ
- ブースめぐり：`assets/gt-menu.js` の TOUR（9ブース）。行ったブースを localStorage `gt-tour` に覚え、各ブースの入口ページの最後に「ブースめぐり」の帯（まわった数・つぎのブース）を出す。スマホのメニューにも ✓ と「めぐり n / 9」。スタンプブースは画面が固定なので帯は出さない（メニューにだけ出る）。ブースを増やしたら TOUR に足す。
- 百物語：`doron/hyaku.js`（100本のろうそく。消した番号は localStorage `doron-hyaku`）。話の文は LINES（オリジナルの短文20本）。
- 美術館：来館記録（museum-data）が0件のあいだは所蔵品を先頭に出す。「作品をかけかえる」で別の9点（開きなおすと本日の展示にもどる）。
- ラーメン：お品書き（しぼりこみ）は main の外に置いて、麺と箸より手前に出している。
- note の一覧（`note/note.js`）：30件ずつ表示し、「もっと見る」で続きを足す。年のリンクや `#y2023` で来たときは、その年まで出してから移動する。

## サイト全体の動き（gt-fx）と起動画面
- `assets/gt-fx.css` / `assets/gt-fx.js`：全ページ共通。`tools/seo.py` が `<!-- seo -->` の中に `<link>` と `<script>` を入れる（新しいページも seo.py を通せば入る）。
  - ページの切りかえ：ブラウン管のチャンネル切りかえ風（View Transitions。Chrome・Edge・新しい Safari。ほかのブラウザは短い暗転）。
  - 同じページの中へのリンク（#…）は、ぬるっとスクロール（0.5〜1.2秒、動きはじめと止まるところをゆっくり。上の固定メニューの下に合わせる。`window.gtGlide(要素 or 数値)` でも呼べる。タブ切りかえのリンクは対象外）。
  - リンクの先読み（触れた時点で読み始める。`/api/` は除く）、読み進みのバー（長いページだけ）、スクロールで現れる動き（ブースのページだけ。90年代風のページの窓には付けない）、星のカーソル（90年代風ページ・マウスのみ）、本の表紙の傾き、タップの波紋、タブを離れたときのタイトル。
  - 「動きを減らす」設定の人には動きものを出さない。現れる動きの対象は gt-fx.js の SEL。
- `assets/boot.js`（ホームの起動画面）：ブラウン管が点く → 光の粒が集まってロゴになる → 光の輪と「GiveTex」→ 奥へ抜ける。`/?boot` で毎回確認できる。
- レトロなページの窓は、青いタイトルバーをつかんで動かせる（`assets/retro.js` の最後。位置は覚えず、開きなおすと元にもどる）。

## 教育用のダウンロード（zip）・フッターのバナー
- `downloads/givetex-*.zip`（5本）：裏口（/bookmarks/）の `download` コマンド（`dl` でも可）から落とせる。一覧は `bookmarks/downloads.js`。
  - 作り方：`python3 tools/build_downloads.py`。解説文と見本ページは `tools/downloads_src/`。記事の PDF は、ローカルでサイトを配信して `node tools/build_notes_pdf.js http://127.0.0.1:8787` → `downloads/src/*.pdf`。
  - ボードゲームやミニゲームのコードを直したら、build_downloads.py をもう一度走らせると zip も新しくなる。
  - 入れるのは教育的なものだけ（このサイトのために書いたコードと文章）。個人情報・鍵・非公開のものは入れない。README の最後に利用の決まり（学習・授業は自由、再配布・販売は連絡）を付けている。
- フッターのバナー：`tools/build_banners.py` が `assets/retro/b-*.gif`（88×31・点滅）を作る。並び順とリンク先は `tools/build_retro.py` の BANNERS。
- 名刺ボタンは、ホーム・管理人（about.html）・お問い合わせ（contact/）のメニューに出る。

## ホームの 3D（UFO キャッチャーとイルカ）
- `assets/home3d.js`（ホームだけ。build_retro.py が index.html の最後に入れる）。Three.js r128 を cdnjs から読みこむ（SRI＝改ざん防止のハッシュつき。版を変えるときはハッシュも変える）。
- UFO キャッチャーは、ヘッダーの `.r-ufo`（左上。ロゴ・サブタイトル・流れる文字に重ならない大きさを、画面幅ごとに `assets/retro.css` で決めている）。
- イルカは右下に固定（`.r-iruka`）。しゃべる文は home3d.js の LINES（オリジナル）。「またね」でそのタブのあいだは消える（sessionStorage `gt-iruka-off`）。
- 画面の外・タブを離れているあいだは止める、1秒30コマまで。WebGL が使えないときは UFO は出さず、イルカは絵文字で出る。動きを減らす設定の人には、止まった絵だけ。

## AI（さくらのAI Engine）
- 設定（Vercel の Environment Variables）：`SAKURA_AI_TOKEN`（必須。さくらのコントロールパネルで発行したアカウントトークン。リポジトリやチャットには書かない）。任意で `SAKURA_AI_MODEL`（既定 preview/GLM-5.3-Flash）、`SAKURA_AI_MODEL_FALLBACK`（既定 gpt-oss-120b）、`AI_DAY`（1日の上限・既定85）、`AI_MONTH`（月の上限・既定2700）。
- `api/_ai.js`：呼び出しの共通部品（上限・キャッシュ・時間切れ・プレビューのモデルが使えないときは別のモデル）。トークンがないときは AI を使わず、今までの動きのまま。
- `api/ai.js`：mode=guide（ホームのイルカ）／books（ドパ読！の本えらび・`books/concierge.js`）／fumi（スタンプブース）。1人1日の回数：guide 12・books 6・fumi 25。答えのリンクはサイト内のページだけ残す。
- 見張り：`api/board.js`・`api/guestbook.js`・`api/head.js` の書きこみを `AI.moderate` で確認（ng なら載せない。AI が使えないときは素通り）。
- `api/_ai_context.js`：AI に渡すサイトの案内書きと本の一覧。`node tools/build_ai_context.js` で作る（自動更新でも作り直す）。
- 管理人用：`SAKURA_AI_TOKEN=… python3 tools/ai_describe.py --kind ramen 写真…` で、写真の説明文と alt の下書き（店名・人物は推測させない。人が写っていたら知らせる）。
- プライバシーポリシーに「AI による案内…について」を追加ずみ。

## うしろの宇宙・ひみつの入口（3D）
- `assets/home-space.js`（ホームだけ）。うしろの宇宙は `.r-sky`（画面に固定・いちばん奥）。ロケットと UFO は、窓や文字のないところをタップすると「やられ」→ 煙 → 立てなおす。
- ひみつの入口（`.secret-bt`：階段・扉・土管）は、3D で描いた絵に差しかえ、押すとへこむ・ふるえる・音。扉はひらき、土管はしずみ、階段はおりてから /stage/ へ。
- `api/_ai.js` の補足：使えたモデルを1日覚える（KV `ai:model`）。gpt-oss は reasoning_effort に none が使えない（400）ので low。考える途中の文も max_tokens に数えるので、上限は多め（1200）にして答えはこちらで切る。

## 映画ブースの見ごたえ・管理人の鑑賞記録
- `movie/watched.js`：いま話題のスライド（`#hl`。話題の上位6本の背景画像を /api/clog?r=movie から）、話題の列の1〜10位（CSS）、管理人の鑑賞記録（`#watched`）。`movie/movie.js` が `window.CLog`（openMovie・card・poster）を出していて、それを使う。
- 鑑賞記録の候補：`tools/movie_candidates.json`（洋画 yo／邦画 ho、[検索ことば, 公開年]）→ `node tools/build_watchlist.js` で C-Log を検索して `movie/watchlist.js` を作る（前の結果は引き継ぐ。題名一致＋年が近いものをえらぶ）。2009年までは旧作、2010年からは新作。
- チェック：映画ブースのいちばん下の「管理人」→ パスワード（頭の中ブースと同じ `HEAD_ADMIN_HASH`）。ポスターを押すと「観た ✓」。リストにない映画は、管理人モードの検索から、いま開いているタブ（洋画／邦画）に足せる。
- 保存先：`api/watched.js`（Upstash：`w:ids` 観た映画、`w:at` チェックした時刻、`w:extra` 足した映画）。パスワードのまちがいは1時間8回まで。

## 素カフェ（素材カフェ）
- `socafe/`：無料・有料の素材をカフェのメニュー風に並べるブース。`socafe/socafe.js` が描く。
- 無料素材：`python3 tools/build_socafe.py`（Pillow が必要）で `socafe/dl/*.zip`・見本の絵 `socafe/img/*`・一覧 `socafe/free.js` を作る（バナー・ドット絵アイコン・背景パターン・効果音 WAV・壁紙・窓とふきだし。すべてオリジナル）。バナーを作り直したら（tools/build_banners.py）、これも走らせる。学習キット（`bookmarks/downloads.js`）も無料の棚に並ぶ。
- 有料素材：`socafe/menu.js` に手で書く（price・shop・url。soon: true で「準備中」）。LINE スタンプは `stamp/stamps.js` から自動で並ぶ（LINE STORE へ）。
- 利用の決まり（無料素材）：個人・商用OK、加工OK、クレジット不要、素材そのものの再配布・販売はNG。zip の README.txt とページの「ご利用のおやくそく」に同じ文。
