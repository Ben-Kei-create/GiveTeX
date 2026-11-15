/*
  スタンプブース — スタンプのデータ
  ------------------------------------------------------------
  1セットずつ、古い順に並べます（トークは下に行くほど新しくなります）。
  画像は /stamp/img/<id>/ に置きます（main.png ＝ 代表画像、01.png〜 ＝ 各スタンプ）。

  {
    id: "my-first-set",
    title: "スタンプのタイトル",
    date: "2024-04-01",                                   // 発売日
    message: "はじめてのスタンプ、できました！",           // トークでの一言（省略可）
    desc: "ストアの紹介文など（省略可）",
    storeUrl: "https://store.line.me/stickershop/product/XXXXXXXX/ja",
    main: "/stamp/img/my-first-set/main.png",
    stickers: ["/stamp/img/my-first-set/01.png", "/stamp/img/my-first-set/02.png"]
  }
*/
window.STAMP = {
  host: "GiveTex",                // トークの相手の名前
  room: "GiveTex スタンプ部",      // トークルームの名前
  storeAuthorUrl: "",             // LINE STORE の作者ページ（あれば「すべてのスタンプ」ボタンが出ます）
  sets: []
};
