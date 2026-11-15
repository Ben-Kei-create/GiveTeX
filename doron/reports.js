/*
  どろん — 活動記録データ
  ------------------------------------------------------------
  ここに1件ずつ追加すると、/doron/ の各タブに自動で表示されます。
  新しい日付のものが上に並びます。写真は /doron/photos/ に置いてください。

  group（どのタブに出すか）
    "relics"   … relics（座談会）
    "reikai"   … 霊界案内所（心霊スポット巡り）
    "c-circle" … Cサークル（スポット巡り×発表）

  使える項目（date と title 以外は省略OK）
  {
    group: "reikai",
    date: "2026-11-20",                 // YYYY-MM-DD
    title: "タイトル",
    place: "訪れた場所・会場",
    members: "参加者（例：5人）",
    summary: "概要。\n\nで段落を分けられます。",
    topics: ["話題1", "話題2"],         // relics向け：語られた話
    presentation: {                     // Cサークル向け：発表の内容
      presenter: "発表者",
      theme: "発表テーマ",
      points: ["要点1", "要点2"]
    },
    tags: ["タグ1", "タグ2"],
    photos: [
      { src: "/doron/photos/2026-11-20-01.jpg", caption: "写真の説明" }
    ]
  }
*/
window.DORON_REPORTS = [
  // ここに記録を追加
];
