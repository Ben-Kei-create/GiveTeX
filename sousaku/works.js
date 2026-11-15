/*
  創作ブース — 作品と出展のデータ
  ------------------------------------------------------------
  ■ 作品の公開状態（status）
    "public"   … ブースの一覧に出る
    "unlisted" … 一覧には出ないが、URL／QRコードを知っている人は読める（会場配布向け）
    "draft"    … 下書き。/sousaku/?preview=1 から開いたときだけ見える
  ※ このサイトは静的サイトなので、完全な鍵付き公開はできません（URLを知っていれば開けます）。

  ■ マンガ
    { id: "my-manga", type: "manga", status: "unlisted",
      title: "タイトル", author: "作者名", desc: "紹介文", tags: ["オリジナル"],
      cover: "/sousaku/works/my-manga/cover.jpg",
      dir: "rtl",            // "rtl" = 右から左（日本のマンガ） / "ltr"
      firstSingle: true,     // 見開き表示で、1ページ目（表紙）を単独で出すか
      pages: ["/sousaku/works/my-manga/001.jpg", "/sousaku/works/my-manga/002.jpg", ...],
      event: "c108" }        // 頒布するイベントの id（任意）

  ■ 小説
    { id: "my-novel", type: "novel", status: "unlisted",
      title: "タイトル", author: "作者名", desc: "紹介文",
      cover: "/sousaku/works/my-novel/cover.jpg",
      text: "/sousaku/works/my-novel/text.html",   // 本文（<p>…</p> を並べたHTML）
      vertical: true }       // はじめから縦書きで表示するか

  ■ 出展（events）
    { id: "c108", name: "コミックマーケット108", date: "2026-12-30",
      place: "東京ビッグサイト", space: "東X-00a", note: "新刊1冊・既刊2冊" }
*/
window.SOUSAKU = {
  circle: "GiveTex",
  events: [],
  works: [
    {
      id: "sample-manga", type: "manga", status: "draft",
      title: "（サンプル）マンガ表示テスト", author: "GiveTex", desc: "リーダーの動作確認用のサンプルです。実際の作品ではありません。",
      tags: ["サンプル"], cover: "/sousaku/works/sample-manga/001.svg", dir: "rtl", firstSingle: true,
      pages: ["001","002","003","004","005","006","007","008"].map(function (n) { return "/sousaku/works/sample-manga/" + n + ".svg"; })
    },
    {
      id: "sample-novel", type: "novel", status: "draft",
      title: "（サンプル）小説表示テスト", author: "GiveTex", desc: "縦書き・横書きの表示確認用のサンプルです。実際の作品ではありません。",
      tags: ["サンプル"], text: "/sousaku/works/sample-novel/text.html", vertical: true
    }
  ]
};
