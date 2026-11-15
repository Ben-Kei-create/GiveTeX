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
| `/movie/`（映画ブース・C-Log Web） | C-Log のデザインを引き継ぐ | `movie/movie.css`・`movie.js` | データは `movie/movies.js`。ヒーローの下にオープンチャット「映画を見る会」への参加リンク、フッターで iPhone 版（開発中）を紹介 |
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
- それぞれのデータファイルの先頭に書き方の見本があります（`game/game-data.js`・`museum/museum-data.js`・`ramen/ramen-data.js`・`movie/movies.js`）。2026-11-15 時点ではどれも空です（架空の投稿は入れていません）。
- ゲームの `kind` は digital／boardgame／madamis／escape／event／other。

### note ブースの TALES
- `note/posts.js` の `NOTE_CONFIG.tales` に作品とエピソード（タイトル・日付・URL）を入れています。本家は TALES なので、エピソードは TALES へのリンクです。
- 新しい話が出たら `episodes` の末尾に追加します（現在『島の灯台と猫』11話／全30話）。

### ブックマークを更新する
- ブラウザから書き出したブックマーク（HTML）をもらい、個人のアカウント・管理画面・決済・求人・成人向けなどを除いて `bookmarks/bookmarks.js` を作り直します。

### サイト内検索の索引を作り直す
- アプリ・Kindle・note・TALES・スタンプ・記事を足したら `node tools/build_index.js` を実行します（`assets/site-index.js` が更新されます）。

### アプリを足す
- `apps/<名前>/` に、紹介・サポート・プライバシーの3ページを作ります。
- そのあと `python3 -I tools/apps_skin.py .` を実行すると、Appブースのヘッダーとフッター、テーマ切り替えが付きます。
- 一覧 `apps/index.html` と、ホームのアプリ欄にも追加します。ホームのアプリ欄は `build_retro.py` の `RELEASED` と `DEV` です。

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
- **フォント**：Google Fonts です。

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

## 8. 未完了・オーナーからの返事待ち
- どろんの活動記録（概要・写真）。
- 創作ブースの最初の作品と、出展予定。
- ドパ読！の新刊の追加。Amazon の一覧から作ったので、英語版などの海外版は載せていません。
