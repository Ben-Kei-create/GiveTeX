/*
  ラーメンブース — 食べたラーメンの記録
  ------------------------------------------------------------
  { date: "2026-11-15"（省略可）, title: "一杯の名前（なければ shop）", shop: "お店の名前（省略可）", menu: "食べたもの", area: "場所（省略可）", tag: "しょうゆ など",
    text: "ひとこと", score: { men: 4, soup: 5, gu: 3 },   // 麺・スープ・具（1〜5、省略可）
    img: "/ramen/img/xxx.jpg", url: "お店のページ（省略可）",
    map: "地図で探すことば（省略可）" }   // 省略すると「店名＋場所」で Google マップへのリンク。false で出さない
*/
window.RAMEN = { posts: [
 {
  "title": "とんこつラーメン",
  "shop": "一蘭",
  "menu": "",
  "text": "赤い秘伝のたれ、青ねぎ、チャーシュー。黒と朱の雷紋のどんぶりでおなじみの一杯。",
  "tag": "とんこつ",
  "img": "/ramen/img/r01.webp",
  "no": 1,
  "map": "一蘭"
 },
 {
  "title": "しょうゆラーメン（特製）",
  "shop": "",
  "menu": "",
  "text": "大きなチャーシュー3枚に、味玉、のり、メンマ。すきとおった茶色のしょうゆスープ。",
  "tag": "しょうゆ",
  "img": "/ramen/img/r02.webp",
  "no": 2,
  "map": false
 },
 {
  "title": "とんこつしょうゆ（家系風）",
  "shop": "",
  "menu": "",
  "text": "厚切りチャーシュー、ほうれん草、きくらげ、白ねぎ、大きなのり。",
  "tag": "家系",
  "img": "/ramen/img/r03.webp",
  "no": 3,
  "map": false
 },
 {
  "title": "辛みそラーメン",
  "shop": "",
  "menu": "",
  "text": "オレンジ色の辛みそスープに、もやし、炙りチャーシュー、半熟たまご、ごま、のり。",
  "tag": "みそ",
  "img": "/ramen/img/r04.webp",
  "no": 4,
  "map": false
 },
 {
  "title": "濃厚しょうゆ（魚介）",
  "shop": "",
  "menu": "",
  "text": "レアチャーシューと炙りチャーシュー、太メンマ、白髪ねぎ、水菜。土ものの器。",
  "tag": "しょうゆ",
  "img": "/ramen/img/r05.webp",
  "no": 5,
  "map": false
 },
 {
  "title": "ワンタンめん",
  "shop": "",
  "menu": "",
  "text": "ワンタンたっぷり、もやし、チャーシュー、煮たまご。",
  "tag": "しょうゆ",
  "img": "/ramen/img/r06.webp",
  "no": 6,
  "map": false
 },
 {
  "title": "みそラーメン",
  "shop": "",
  "menu": "",
  "text": "濃い茶色のみそスープ、ねぎ、メンマ、チャーシュー。まんなかにおろし生姜。",
  "tag": "みそ",
  "img": "/ramen/img/r07.webp",
  "no": 7,
  "map": false
 },
 {
  "title": "とんこつ・マー油（熊本風）",
  "shop": "",
  "menu": "",
  "text": "黒いマー油、キャベツ、大きな角煮、煮たまご、メンマ、ねぎ。緑の雷紋のどんぶり。",
  "tag": "とんこつ",
  "img": "/ramen/img/r08.webp",
  "no": 8,
  "map": false
 },
 {
  "title": "塩ワンタンめん",
  "shop": "",
  "menu": "",
  "text": "すきとおった塩スープ、エビワンタン、ひらひらの平打ち麺、味玉、三つ葉、白髪ねぎ。",
  "tag": "しお",
  "img": "/ramen/img/r09.webp",
  "no": 9,
  "map": false
 },
 {
  "title": "番外編：赤いほうとう",
  "shop": "",
  "menu": "",
  "text": "鉄鍋で、かぼちゃ、わらび、絹さや、しいたけ、白菜。赤いスープの幅広麺。",
  "tag": "番外編",
  "img": "/ramen/img/r10.webp",
  "no": 10,
  "map": false
 },
 {
  "title": "番外編：かき揚げそば",
  "shop": "",
  "menu": "",
  "text": "大きなかき揚げ（とうもろこし入り）と、わかめ、ねぎ。",
  "tag": "番外編",
  "img": "/ramen/img/r11.webp",
  "no": 11,
  "map": false
 },
 {
  "title": "二郎系",
  "shop": "",
  "menu": "",
  "text": "山もりのもやしとキャベツ、にんにく、ぶあついチャーシュー。",
  "tag": "二郎系",
  "img": "/ramen/img/r12.webp",
  "no": 12,
  "map": false
 },
 {
  "title": "番外編：みそほうとう",
  "shop": "",
  "menu": "",
  "text": "鉄鍋のみそほうとう。白菜、キャベツ、にんじん、油あげ、なめこ。",
  "tag": "番外編",
  "img": "/ramen/img/r13.webp",
  "no": 13,
  "map": false
 },
 {
  "title": "まぜそば",
  "shop": "",
  "menu": "",
  "text": "ねぎどっさり、角切りチャーシュー、メンマ。汁なしで、よくまぜて食べる一杯。",
  "tag": "まぜそば",
  "img": "/ramen/img/r14.webp",
  "no": 14,
  "map": false
 }
] };
