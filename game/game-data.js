/*
  ゲームブース — 作ったゲームと、ゲームまわりのつぶやき
  ------------------------------------------------------------
  ■ games（Apple 以外で作ったゲーム）
    { title: "タイトル", platform: "Web" / "unityroom" / "Steam" / "itch.io" など,
      url: "https://...", desc: "ひとこと紹介", img: "/game/img/xxx.png"（省略可）, year: 2026,
      pick: true（イチオシ。ゲームブースの先頭とホームに大きく出る・省略可） }

  ■ posts（つぶやき）新しい順でも古い順でもOK（自動で新しい順に並びます）
    { date: "2026-11-15", kind: "digital" | "boardgame" | "madamis" | "escape" | "event" | "other",
      title: "遊んだもの・行ったところ（省略可）", text: "本文", tags: ["タグ"], url: "関連リンク（省略可）" }
    kind の意味：digital＝デジタルゲーム／boardgame＝ボドゲ／madamis＝マダミス／escape＝脱出ゲーム／event＝イベント
*/
window.GAME = {
  "unityroomUrl": "https://unityroom.com/users/qtnhm79e0xd5plfw28c4",
  "games": [
    {
      "title": "umbrella lovers",
      "platform": "unityroom",
      "year": 2025,
      "pick": true,
      "url": "https://unityroom.com/games/umbrella_lovers",
      "img": "/assets/ext/unityroom/590b0dffe3826139.webp",
      "desc": "雨の日のドキドキ！ 二人で傘を回して、空から降ってくる障害物をよけまくる横スクロール回避アクション。10000点でクリア、20000点で特別ムービー。",
      "tags": [
        "unity1week",
        "イチオシ"
      ]
    },
    {
      "title": "ドアのゲーム",
      "platform": "unityroom",
      "year": 2024,
      "url": "https://unityroom.com/games/dokodemo",
      "img": "/assets/ext/unityroom/2ccc8bd1fccafe02.webp",
      "desc": "ドアノブまで、ボールをころがしてみるゲーム。"
    },
    {
      "title": "2Dのシンプルなシューティングゲーム",
      "platform": "unityroom",
      "year": 2024,
      "url": "https://unityroom.com/games/shooting2dgame",
      "img": "/assets/ext/unityroom/d4d5b3a04133bd55.webp",
      "desc": "シンプルな2Dシューティング。"
    },
    {
      "title": "ballune paddle",
      "platform": "unityroom",
      "year": 2024,
      "url": "https://unityroom.com/games/ballunepaddle",
      "img": "/assets/ext/unityroom/aab6f3c9a65f2cc0.webp",
      "desc": "飛んでくるボールをバーでキャッチ。だんだんバーが小さくなるので気をつけて。"
    },
    {
      "title": "しぶやのかいだん（ふぁーすと）",
      "platform": "unityroom",
      "year": 2024,
      "url": "https://unityroom.com/games/shibuyastairs",
      "img": "/assets/ext/unityroom/16688335cda5dc94.webp",
      "desc": "しぶやのかいだん。"
    },
    {
      "title": "くりっくするだけ",
      "platform": "unityroom",
      "year": 2024,
      "url": "https://unityroom.com/games/youtubeclicker",
      "img": "/assets/ext/unityroom/fa87049497f2ecb5.webp",
      "desc": "クリックして登録者数をふやせます。"
    }
  ],
  "posts": []
};
