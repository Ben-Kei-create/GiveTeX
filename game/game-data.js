/*
  ゲームブース — 作ったゲームと、ゲームまわりのつぶやき
  ------------------------------------------------------------
  ■ games（Apple 以外で作ったゲーム）
    { title: "タイトル", platform: "Web" / "unityroom" / "Steam" / "itch.io" など,
      url: "https://...", desc: "ひとこと紹介", img: "/game/img/xxx.png"（省略可）, year: 2026 }

  ■ posts（つぶやき）新しい順でも古い順でもOK（自動で新しい順に並びます）
    { date: "2026-11-15", kind: "digital" | "boardgame" | "madamis" | "escape" | "event" | "other",
      title: "遊んだもの・行ったところ（省略可）", text: "本文", tags: ["タグ"], url: "関連リンク（省略可）" }
    kind の意味：digital＝デジタルゲーム／boardgame＝ボドゲ／madamis＝マダミス／escape＝脱出ゲーム／event＝イベント
*/
window.GAME = {
  games: [],
  posts: []
};
