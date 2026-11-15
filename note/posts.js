/*
  note ブース — 記事データ（NingentteWinner）
  ------------------------------------------------------------
  記事を1本追加するときは:
    1) /note/posts/_template.html をコピーして /note/posts/<slug>.html を作り、本文を入れる
    2) 下の NOTE_POSTS に1件追加する（slug はファイル名と同じに）
  一覧・検索・タグ・年別の目次・「前の記事／次の記事」は、ここから自動で作られます。

  {
    slug: "2021-first-story",        // 英数字とハイフン。/note/posts/<slug>.html
    title: "タイトル",
    date: "2021-04-01",              // note に投稿した日 YYYY-MM-DD
    excerpt: "一覧に出る短い紹介文（2行くらい）",
    tags: ["創作", "エッセイ"],
    cover: "/note/img/xxx.jpg",      // 省略可：一覧のサムネイル
    noteUrl: "https://note.com/..."  // 省略可：note の元記事
  }
*/
window.NOTE_CONFIG = {
  profileUrl: "https://note.com/benkein"   // note のプロフィールURL（例 "https://note.com/xxxx"）。空なら「noteで見る」ボタンは隠れます
};

window.NOTE_POSTS = [
  {
    slug: "about-this-booth",
    title: "note ブースをはじめます",
    date: "2026-11-15",
    excerpt: "note で書いてきたものを、ここにも置いていくことにしました。このブースの読み方と、これからのことを少しだけ。",
    tags: ["お知らせ"]
  }
];
