/* 素カフェの「有料メニュー」（手で書き足す）
   ここに書いたものと、スタンプブースの LINE スタンプ（stamp/stamps.js）が、有料の棚に並ぶ。
   1品ずつ、こう書く：
   {
     id: "pixel-pack-pro",                 // 英数字の名前（ほかと重ならない）
     title: "ドット絵アイコン 拡張パック",     // 商品名
     desc: "200種のアイコンと、色ちがい。",    // ひとこと
     cat: "icon",                           // icon（アイコン・バナー）／bg（背景・壁紙）／sound（サウンド）／kit（学習キット）
     img: "/socafe/img/xxx.webp",           // 見本の絵（小さく・軽く）
     price: "¥500",                         // 値段の表示
     shop: "BOOTH",                         // お店の名前（BOOTH・note・Stripe など）
     url: "https://…",                      // 買えるページ
     fmt: "PNG"                             // 形式（あれば）
   }
   soon: true にすると「準備中」として並ぶ（url はなくてよい） */
window.SOCAFE_PAID = [
  { id: 'soon-pack', title: '素材パック（準備中）', desc: 'もっとたくさんのアイコンや、色ちがいをまとめたパックを準備しています。', cat: 'icon', price: '準備中', shop: '', soon: true, fmt: '' }
];
