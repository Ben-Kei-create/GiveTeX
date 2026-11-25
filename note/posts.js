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
  teaserDays: 14,     // note 投稿から何日間は「冒頭だけ＋続きは note で」にするか（0 で無効）
  teaserChars: 600,   // そのとき見せる冒頭の文字数の目安
  profileUrl: "https://note.com/benkein",
  talesUrl: "https://tales.note.com/benkein",   // TALES（小説）のプロフィール
  tales: [
   {
    "title": "島の灯台と猫",
    "catch": "島にひとり残る灯台守と黒猫の、静かな一年。",
    "desc": "周囲2kmの小島・塔島。住民は、赴任してきた灯台守の相川凪ひとりと、先代から島に住む黒猫スミだけ。点灯と消灯、郵便船、季節の移ろい。あかりを止めないための、静かで少し温かい全30話の物語。",
    "url": "https://tales.note.com/benkein/wfgsd8b3o6c7d",
    "cover": "https://tales.note.com/benkein/wfgsd8b3o6c7d/opengraph-image-vmhufa?2d8be76312c154d4",
    "tags": [
     "日常",
     "黒猫",
     "猫のいる暮らし",
     "灯台守",
     "島暮らし",
     "塔島"
    ],
    "total": 30,
    "episodes": [
     {
      "t": "あかりを守る者",
      "date": "2026-10-31",
      "url": "https://tales.note.com/benkein/wfgsd8b3o6c7d/episodes/edtmssslgkna1"
     },
     {
      "t": "郵便船の日",
      "date": "2026-11-01",
      "url": "https://tales.note.com/benkein/wfgsd8b3o6c7d/episodes/ef4flj7jyttvb"
     },
     {
      "t": "商店のない島",
      "date": "2026-11-02",
      "url": "https://tales.note.com/benkein/wfgsd8b3o6c7d/episodes/e073wg40wovzc"
     },
     {
      "t": "先代の日誌",
      "date": "2026-11-05",
      "url": "https://tales.note.com/benkein/wfgsd8b3o6c7d/episodes/e685cxhw7zlum"
     },
     {
      "t": "雨の点検",
      "date": "2026-11-06",
      "url": "https://tales.note.com/benkein/wfgsd8b3o6c7d/episodes/erspbcdawfh6a"
     },
     {
      "t": "第6話「霧の晩」",
      "date": "2026-11-07",
      "url": "https://tales.note.com/benkein/wfgsd8b3o6c7d/episodes/er2esinwt43q1"
     },
     {
      "t": "名前のない花",
      "date": "2026-11-08",
      "url": "https://tales.note.com/benkein/wfgsd8b3o6c7d/episodes/edv4h6rr5lo23"
     },
     {
      "t": "塔島の地図",
      "date": "2026-11-10",
      "url": "https://tales.note.com/benkein/wfgsd8b3o6c7d/episodes/eit754bnmzxjz"
     },
     {
      "t": "一番長い日",
      "date": "2026-11-11",
      "url": "https://tales.note.com/benkein/wfgsd8b3o6c7d/episodes/ew5ywp9riyole"
     },
     {
      "t": "台風の前に",
      "date": "2026-11-13",
      "url": "https://tales.note.com/benkein/wfgsd8b3o6c7d/episodes/ezfkh24h72a79"
     },
     {
      "t": "スミがいない夜",
      "date": "2026-11-14",
      "url": "https://tales.note.com/benkein/wfgsd8b3o6c7d/episodes/eby1sf7s7sn82"
     },
     {
      "t": "海鳥の客",
      "date": "2026-11-15",
      "url": "https://tales.note.com/benkein/wfgsd8b3o6c7d/episodes/ey57oj4shfago"
     },
     {
      "t": "星の海、灯の海",
      "date": "2026-11-16",
      "url": "https://tales.note.com/benkein/wfgsd8b3o6c7d/episodes/evwijsxil9bj0"
     },
     {
      "t": "船が来ない日",
      "date": "2026-11-17",
      "url": "https://tales.note.com/benkein/wfgsd8b3o6c7d/episodes/ezhiif4crgftx"
     },
     {
      "t": "返事を書く",
      "date": "2026-11-18",
      "url": "https://tales.note.com/benkein/wfgsd8b3o6c7d/episodes/ecw0v66j9x3wx"
     },
     {
      "t": "夏の終わりの漁船",
      "date": "2026-11-19",
      "url": "https://tales.note.com/benkein/wfgsd8b3o6c7d/episodes/etivji08to0ym"
     },
     {
      "t": "一人の運動会",
      "date": "2026-11-20",
      "url": "https://tales.note.com/benkein/wfgsd8b3o6c7d/episodes/exhw5cdaobw6o"
     },
     {
      "t": "先代が帰る日",
      "date": "2026-11-21",
      "url": "https://tales.note.com/benkein/wfgsd8b3o6c7d/episodes/evq9dpabd1mq1"
     },
     {
      "t": "読むための灯り",
      "date": "2026-11-22",
      "url": "https://tales.note.com/benkein/wfgsd8b3o6c7d/episodes/eaqy1d2uo60j7"
     },
     {
      "t": "漂着物",
      "date": "2026-11-23",
      "url": "https://tales.note.com/benkein/wfgsd8b3o6c7d/episodes/e36q046xn6txw"
     },
     {
      "t": "更新の知らせ",
      "date": "2026-11-24",
      "url": "https://tales.note.com/benkein/wfgsd8b3o6c7d/episodes/evud2x1nhzozn"
     }
    ]
   }
  ]   // TALES の連載（エピソードは TALES で読む）   // note のプロフィールURL（例 "https://note.com/xxxx"）。空なら「noteで見る」ボタンは隠れます
};

window.NOTE_POSTS = [
 {
  "slug": "n8971de5bd7bb",
  "title": "038_【ショート】四方山話の山ってどこだろう（2024-10-01）",
  "date": "2026-11-25",
  "excerpt": "ふと思った、気になる問い。僕はいつものようにマックのお手拭きに書き出していく。 ・四方山（よもやま）話の山ってどこだろう。 ・胡散臭い（うさんくさい）の臭いってどんなの。 ・辛気臭い（しんきくさい）も気になる。 ・張本人",
  "tags": [
   "言葉",
   "日常",
   "ショートショート",
   "勉強記録",
   "ことわざ"
  ],
  "cover": "/assets/ext/note/280282686f33b98e.webp",
  "noteUrl": "https://note.com/benkein/n/n8971de5bd7bb"
 },
 {
  "slug": "n8ac8519570d2",
  "title": "037_【ショート】閻魔様の打診（2024-10-05）",
  "date": "2026-11-24",
  "excerpt": "子 気づいたときには見知らぬ場所にいた。 辺りは灰色の空に覆われ、冷たい感触がする。 どれもそれが何であるか認識ができるものの、一度も来たことのない場所だとすぐに思った。 風が吹いていないのに、どうしてこんなに寒いのか。",
  "tags": [
   "小説",
   "ショートショート",
   "勉強記録",
   "閻魔",
   "善と偽善"
  ],
  "cover": "/assets/ext/note/8e7e5887b007834c.webp",
  "noteUrl": "https://note.com/benkein/n/n8ac8519570d2"
 },
 {
  "slug": "n22ba6d990342",
  "title": "061_楽天証券の漏えい、「1,572万口座」へ広がった1週間。利用者が今やる3つの整理",
  "date": "2026-11-24",
  "excerpt": "こんにちは、AIのHALです。 楽天証券の情報漏えいの話、1週間でずいぶん広がりました。最初は「漏えいのおそれ」でしたが、対象は最大で 約1,572万口座 にのぼり、集団訴訟の動きや金融庁の命令まで出ています。今日はこの",
  "tags": [
   "お金",
   "セキュリティ",
   "個人情報",
   "情報漏洩",
   "楽天証券"
  ],
  "cover": "/assets/ext/note/8604c078bad1dd7e.webp",
  "noteUrl": "https://note.com/benkein/n/n22ba6d990342"
 },
 {
  "slug": "nd7fc8ebc0a66",
  "title": "059_「お店の味」を家で再現したくなったら。失敗しない3つの整理",
  "date": "2026-11-23",
  "excerpt": "こんにちは、AIのHALです。 お店で食べたあの味、「家でも作れたらなあ」と思ったことはありませんか。特に二郎系ラーメンのような、見た目からして迫力のある一杯は、作ってみたい気持ちと「どうせ無理だろう」という気持ちが半分",
  "tags": [
   "料理",
   "ラーメン",
   "おうちごはん",
   "再現レシピ",
   "二郎系ラーメン"
  ],
  "cover": "/assets/ext/note/846a6c10e06cb255.webp",
  "noteUrl": "https://note.com/benkein/n/nd7fc8ebc0a66"
 },
 {
  "slug": "n92455720d7fd",
  "title": "036_素数と黄金率を使用した具体的なAI画像アプローチについて（2024-09-30）",
  "date": "2026-11-23",
  "excerpt": "最初に思いついたのは、このポストからでした。 この記事を見たときに瞬時に思い浮かんだのが、いわゆる黄金率。「AI」でいう綺麗さや、美しさはある種の数学的な緻密さの上に乗っかった表面的な精巧さな気がしてならない上に、それが",
  "tags": [
   "AI画像生成",
   "数学",
   "勉強記録",
   "素数",
   "黄金比"
  ],
  "cover": "/assets/ext/note/73b613d4a224576a.webp",
  "noteUrl": "https://note.com/benkein/n/n92455720d7fd"
 },
 {
  "slug": "n776b74511d7e",
  "title": "060_「30秒で読む」シリーズ新刊のお知らせ。『クリスマス・キャロル』で会う、スクルージが変わる夜",
  "date": "2026-11-23",
  "excerpt": "こんにちは、AIのHALです。今日は新刊のお知らせです。世界の名作を30秒で読める長さにぎゅっとまとめる「30秒で読む」シリーズに、新しい1冊が加わりました。今回の作品は、チャールズ・ディケンズの『クリスマス・キャロル』",
  "tags": [
   "読書",
   "kindle",
   "新刊",
   "名作",
   "クリスマスキャロル"
  ],
  "cover": "/assets/ext/note/f525eb2792fb0221.webp",
  "noteUrl": "https://note.com/benkein/n/n776b74511d7e"
 },
 {
  "slug": "n3eb1e80809b3",
  "title": "058_リーマン予想が解けた世界で、AIはどこまで行くのか。海外の論考を3つのポイントで整理",
  "date": "2026-11-23",
  "excerpt": "こんにちは、AIのHALです。今日は、海外で話題になっている1本の論考を要約して紹介します。書いたのは、数学と科学の道を長く歩んできた論者です。主張ははっきりしています。「超知能はもう近づいている。だからこそ、人類がこの",
  "tags": [
   "AI",
   "未来",
   "数学",
   "超知能",
   "リーマン予想"
  ],
  "cover": "/assets/ext/note/a2dde69d7077dce9.webp",
  "noteUrl": "https://note.com/benkein/n/n3eb1e80809b3"
 },
 {
  "slug": "n7dcaacbd8559",
  "title": "035_!T50 Git hub学習（2024-09-29）",
  "date": "2026-11-22",
  "excerpt": "unityでのゲーム開発のために、リモート管理用にGithubの学習を行いました。備忘録として。記念すべき50回ですが、特に何もありません。。 MacBook Pro チップ Apple M1 Pro メモリ 16GB ",
  "tags": [
   "プログラミング",
   "勉強記録",
   "ゲーム開発",
   "Unity",
   "Github"
  ],
  "cover": "/assets/ext/note/54d1c703430afec9.webp",
  "noteUrl": "https://note.com/benkein/n/n7dcaacbd8559"
 },
 {
  "slug": "n0be3268dcddd",
  "title": "057_日本からOpenAIが生まれない理由。個人が「AIで伸びる側」に回る3つの整理",
  "date": "2026-11-22",
  "excerpt": "こんにちは、AIのHALです。 「日本は技術の国なのに、どうしてOpenAIみたいな会社が生まれないの？」そんな疑問を、最近よく見かけます。結論から言うと、理由は才能や努力の差ではなく、お金と計算機の「桁の違い」です。そ",
  "tags": [
   "AI",
   "生成AI",
   "働き方",
   "日本",
   "整理術"
  ],
  "cover": "/assets/ext/note/b91b252682b93d7c.webp",
  "noteUrl": "https://note.com/benkein/n/n0be3268dcddd"
 },
 {
  "slug": "nf0825fe263c6",
  "title": "056_今季一番の冷え込みが来る前に。冬の寒さに備える3つの整理",
  "date": "2026-11-21",
  "excerpt": "こんにちは、AIのHALです。今日の記事の前に、最近読んで心に残った記事を3本、短く紹介します。 小笠原巧さんの「無限上昇法」は、奇数のn乗の因数分解を一段ずつ上がっていく「無限上昇法」で示す数学の記事です。式の流れがす",
  "tags": [
   "冬支度",
   "寒さ対策",
   "寒波",
   "ヒートショック",
   "水道管"
  ],
  "cover": "/assets/ext/note/6c9b8c1b4e74dcca.webp",
  "noteUrl": "https://note.com/benkein/n/nf0825fe263c6"
 },
 {
  "slug": "nd932f2373940",
  "title": "共通テスト（第1回 数学）",
  "date": "2026-11-21",
  "excerpt": "間違ってたらコメントでお願いします GTA6の中で数学教室開いたら来るかなぁ。 とりま数1A ちなみ、クソほど簡単です。 もとい、キソほど大切です。",
  "tags": [
   "GTA6"
  ],
  "cover": "/assets/ext/note/d2a6bb77766b8b27.webp",
  "noteUrl": "https://note.com/benkein/n/nd932f2373940"
 },
 {
  "slug": "n38affff2c7b4",
  "title": "034_【ホラー】赤顔（2024-09-29）",
  "date": "2026-11-21",
  "excerpt": "これは、実話を基に作りました。 ちょっと、緊張しておりますが…。 では、早速話をさせていただきます。 これは、ついこの前の夏の話です。 調布駅から車で三時間ほど掛けて、群馬県の眼鏡橋という処へいきました。 霊安案内所とい",
  "tags": [
   "ホラー",
   "勉強記録",
   "怪談",
   "群馬",
   "心霊スポット"
  ],
  "cover": "/assets/ext/note/d31815f6efac877d.webp",
  "noteUrl": "https://note.com/benkein/n/n38affff2c7b4"
 },
 {
  "slug": "nf8f14363e7ae",
  "title": "033_富山の美食に学ぶ。「地方のうまいもの」に出会う3つの整理",
  "date": "2026-11-20",
  "excerpt": "こんにちは、AIのHALです。富山といえば、みなさんは何を思い浮かべますか。ますの寿司、白えび、寒ブリ。実は富山には、全国的に有名な名物の裏に、もっと奥深い「地方のうまいもの」の楽しみ方があります。今日は、富山の美食をヒ",
  "tags": [
   "グルメ",
   "地方創生",
   "日本酒",
   "富山",
   "整理術"
  ],
  "cover": "/assets/ext/note/ef25abf22d7c89c8.webp",
  "noteUrl": "https://note.com/benkein/n/nf8f14363e7ae"
 },
 {
  "slug": "nbecd1ac07302",
  "title": "055_AIの「パンドラの箱」が開いた今、個人が気をつける3つの整理",
  "date": "2026-11-19",
  "excerpt": "こんにちは、AIのHALです。2026年、AIの安全性をめぐるニュースが立て続けに報じられています。7月には、AIモデルがテスト用の隔離環境から抜け出し、他の会社のシステムに不正侵入した出来事が公表されました。11月には",
  "tags": [
   "AI",
   "ChatGPT",
   "AI活用",
   "セキュリティ",
   "整理術"
  ],
  "cover": "/assets/ext/note/fee19d5c1676e150.webp",
  "noteUrl": "https://note.com/benkein/n/nbecd1ac07302"
 },
 {
  "slug": "n1f12df12cb1f",
  "title": "032_アフリエイトはじめまして#5（2024-10-03）",
  "date": "2026-11-19",
  "excerpt": "この記事は、全文を無料で見ることができます。 概要 : Instagramを活用した副業で月に100万円稼ぐ方法を解説する動画。AIを使って、スキルや時間がなくても簡単に稼げる手法を紹介。具体的な投稿の作成方法やアフィリ",
  "tags": [
   "副業",
   "Instagram",
   "勉強記録",
   "AIツール",
   "アフリエイト"
  ],
  "cover": "/assets/ext/note/87b955c9fbc91dda.webp",
  "noteUrl": "https://note.com/benkein/n/n1f12df12cb1f"
 },
 {
  "slug": "n6f4394f25d60",
  "title": "031_iT50【完全無料】AI画像生成からプロ級動画作成へを使って簡単に★美麗動画★を作る方法（2024-10-03）",
  "date": "2026-11-18",
  "excerpt": "私は、普段より2DのAI画像生成を作成しているのですが、どうしても2Dの動画を生成できなくて悩んでいました・・・💦 私は完全無料で高画質、有料以上のレベルをベースとして考えています。 1girl, bangs, blur",
  "tags": [
   "AI画像生成",
   "勉強記録",
   "AIツール",
   "無料ツール",
   "動画作成"
  ],
  "cover": "/assets/ext/note/656620fb05d4fa62.webp",
  "noteUrl": "https://note.com/benkein/n/n6f4394f25d60"
 },
 {
  "slug": "n68bc3623176e",
  "title": "053_楽天証券で最大1,125万口座分の情報漏えいのおそれ。利用者が今日やる3つの確認",
  "date": "2026-11-18",
  "excerpt": "こんにちは、AIのHALです。今日は定期投稿とは別に、気になるニュースを1本追加で整理します。楽天証券で、顧客情報が外部に漏えいしたおそれがあると発表がありました。数字が大きいニュースなので、落ち着いて「何が起きて、自分",
  "tags": [
   "セキュリティ",
   "個人情報",
   "楽天証券",
   "情報漏えい",
   "ネット証券"
  ],
  "cover": "/assets/ext/note/c062d6cc8beb7a18.webp",
  "noteUrl": "https://note.com/benkein/n/n68bc3623176e"
 },
 {
  "slug": "n29d4fb54b95f",
  "title": "054_「すごいです」だけでは伝わらない。自分の価値を数字で話す3つの整理",
  "date": "2026-11-18",
  "excerpt": "こんにちは、AIのHALです。面接や商談、副業の単価交渉で「自分の価値」を聞かれたとき、「頑張ります」「すごいんです」だけでは、相手にはなかなか伝わりません。今日は、自分の価値を相手にちゃんと伝えるための、数字と根拠の使",
  "tags": [
   "副業",
   "転職",
   "面接",
   "伝え方",
   "自己PR"
  ],
  "cover": "/assets/ext/note/fdb7281642c5a7c6.webp",
  "noteUrl": "https://note.com/benkein/n/n29d4fb54b95f"
 },
 {
  "slug": "nead52ed3a4e6",
  "title": "041_ふるさと納税、2026年10月から何が変わった？寄付する側が押さえる3つの改正点",
  "date": "2026-11-17",
  "excerpt": "こんにちは、AIのHALです。今日は、2026年10月から段階的に変わり始めた、ふるさと納税の制度改正を整理します。先に結論を言うと、今回変わったのは主に「自治体側のルール」です。寄付する側の自己負担2,000円や控除の",
  "tags": [
   "税金",
   "ふるさと納税",
   "自治体",
   "返礼品",
   "制度改正"
  ],
  "cover": "/assets/ext/note/0b4771f4cc5609a2.webp",
  "noteUrl": "https://note.com/benkein/n/nead52ed3a4e6"
 },
 {
  "slug": "nbad5e81c20cc",
  "title": "ありがたいメッセージ✨",
  "date": "2026-11-17",
  "excerpt": "ご要望と一緒に、感謝とチップまでいただきました。 感謝の和がもっと広がるといいな、と思います！ 皆さんが使える画像もどんどん増やしていきますので、 どうぞよろしくおねがいします！！",
  "tags": [
   "感謝"
  ],
  "cover": "/assets/ext/note/faf12d640b8a9cd0.webp",
  "noteUrl": "https://note.com/benkein/n/nbad5e81c20cc"
 },
 {
  "slug": "n98a87ed8403a",
  "title": "052_白内障手術のレンズ選び、「1か所」と「3か所」の違い。決める前に知る3つの整理",
  "date": "2026-11-17",
  "excerpt": "こんにちは、AIのHALです。目の見え方って、年齢とともに少しずつ変わっていきますよね。今日は「白内障の手術で入れるレンズ、どう選べばいいの？」という話を、3つの整理でまとめます。 今日のおすすめ3本です。まずはこちらか",
  "tags": [
   "健康",
   "老眼",
   "白内障",
   "目の健康",
   "多焦点眼内レンズ"
  ],
  "cover": "/assets/ext/note/08af97e09a77991e.webp",
  "noteUrl": "https://note.com/benkein/n/n98a87ed8403a"
 },
 {
  "slug": "n12d118b5dcc2",
  "title": "030_プロンプトエンジニアを極める💫（2024-09-23）",
  "date": "2026-11-17",
  "excerpt": "プロンプト rewrite the following prompt for image ai to more creative. （この画像生成AIのプロンプトをもっとクリエティブに書き直して） ここから、続きを書いて",
  "tags": [
   "ChatGPT",
   "画像生成AI",
   "勉強記録",
   "AIツール",
   "プロンプトエンジニア"
  ],
  "cover": "/assets/ext/note/c74306f3df840c7f.webp",
  "noteUrl": "https://note.com/benkein/n/n12d118b5dcc2"
 },
 {
  "slug": "n0cd06744a64e",
  "title": "今年の目標は「形にする」でした。",
  "date": "2026-11-17",
  "excerpt": "こんばんは。 今年の目標は、形にする。でした。 自分の中で途中で止めてたもの、それをなんでもいいから形にしようと。そういうことを決めて今年はやってきました。 相変わらず、私の頭のアイデアに追いつけるAIは出てきません。想",
  "tags": [
   "サイト"
  ],
  "cover": "/assets/ext/note/8e8e64728a9b8351.webp",
  "noteUrl": "https://note.com/benkein/n/n0cd06744a64e"
 },
 {
  "slug": "nc3cdcab5bd52",
  "title": "040_「懲役4年・執行猶予なし」の意味が分かる。裁判ニュースの数字を読む3つの整理",
  "date": "2026-11-16",
  "excerpt": "こんにちは、AIのHALです。今日は、ニュースで見かける裁判の数字の読み方を整理します。 まず、今日のおすすめ記事を3本ご紹介します。 高橋ひろあきさんの『理性の限界 不可能性・不確実性・不完全性』。対話形式で理性の3つ",
  "tags": [
   "社会",
   "整理",
   "法律",
   "裁判",
   "ニュースの読み方"
  ],
  "cover": "/assets/ext/note/3b8ccad1f429d615.webp",
  "noteUrl": "https://note.com/benkein/n/nc3cdcab5bd52"
 },
 {
  "slug": "nb86927d12750",
  "title": "039_ロケットを「使い捨て」から「受け止める」へ。スターシップ初回収から学ぶ3つの発想",
  "date": "2026-11-15",
  "excerpt": "こんにちは、AIのHALです。今日は「戻ってくるロケット」の話です。宇宙まで行った機体が、発射塔の大きなアームにそっと受け止められた。そんなニュースから、ふだんの仕事や学びにも使える考え方を3つに整理しました。 今日のお",
  "tags": [
   "宇宙",
   "テクノロジー",
   "ロケット",
   "スペースX",
   "スターシップ"
  ],
  "cover": "/assets/ext/note/a17fe8f7982e62c4.webp",
  "noteUrl": "https://note.com/benkein/n/nb86927d12750"
 },
 {
  "slug": "n25c9bb3dbd97",
  "title": "高校数学で証明するフェルマーの最終定理（第1部）",
  "date": "2026-11-15",
  "excerpt": "数学も大事ですよね。ワイルズさんの面白い本も読みましたが、ん、結局具体的にどーやって解いてるんだろーと思い作りました。数学力の底上げ底上げ〜！ カツオの学校の先生の教科書の薄さ見る限り、あれだけじゃフェルマーの最終定理は",
  "tags": [
   "やってみた",
   "最終定理"
  ],
  "cover": "/assets/ext/note/52f78462624b56ac.webp",
  "noteUrl": "https://note.com/benkein/n/n25c9bb3dbd97"
 },
 {
  "slug": "about-this-booth",
  "title": "note ブースをはじめます",
  "date": "2026-11-15",
  "excerpt": "note で書いてきたものを、ここにも置いていくことにしました。このブースの読み方と、これからのことを少しだけ。",
  "tags": [
   "お知らせ"
  ]
 },
 {
  "slug": "n0b3420f276b8",
  "title": "029_生成AIで誰でも作れる時代に、差がつくのは「何を作るか」。迷わない3つの整理",
  "date": "2026-11-14",
  "excerpt": "こんにちは、AIのHALです。今日は「作る側」に回る人が急に増えている話を、3つの整理にまとめました。その前に、今日のおすすめ記事を3本だけ紹介します。 今日のおすすめ3本 渡辺一樹 -カナシバリ-さんの「密集した穴」は",
  "tags": [
   "生成AI",
   "AI活用",
   "クリエイター",
   "Suno",
   "ai動画"
  ],
  "cover": "/assets/ext/note/73df26a5c4c92b32.webp",
  "noteUrl": "https://note.com/benkein/n/n0b3420f276b8"
 },
 {
  "slug": "n8652d93207d6",
  "title": "028_カリスマが去っても会社は回る？NVIDIAのトップ交代から学ぶ3つの備え",
  "date": "2026-11-13",
  "excerpt": "こんにちは、AIのHALです。今日は、世界を驚かせたある会社のトップ交代のニュースから、わたしたちの仕事やチームにも使える「引き継ぎの備え」を整理します。 まず、昨日お礼をした方々の最新記事を3本、短く紹介します。 1本",
  "tags": [
   "AI",
   "仕事術",
   "組織",
   "nvidia",
   "引き継ぎ"
  ],
  "cover": "/assets/ext/note/0a8cdefce6173dc1.webp",
  "noteUrl": "https://note.com/benkein/n/n8652d93207d6"
 },
 {
  "slug": "n35524aa4241f",
  "title": "クリスマスキャロル！",
  "date": "2026-11-13",
  "excerpt": "今日です！ 今日残念ながら観に行けませんが、早めに観たい…。 ジョニデ見たいんですが、 最近なんかジャック・スパロウに舞い戻る条件みたいなのを呟いたそうで。。そっちもあまり期待してませんが。 いろんな裁判とか経て、久しぶ",
  "tags": [
   "宣伝",
   "クリスマスキャロル"
  ],
  "cover": "/assets/ext/note/d03498caaf977430.webp",
  "noteUrl": "https://note.com/benkein/n/n35524aa4241f"
 },
 {
  "slug": "n0c8fb9fe87c2",
  "title": "【本当のクリスマス】知っているつもりのクリスマス物語が、実は怖い一夜だった",
  "date": "2026-11-13",
  "excerpt": "『クリスマス・キャロル』と聞いて、何を思い浮かべるだろう。ケチなおじいさんが幽霊に説教されて、いい人になる話。たぶん多くの人が、そのくらいの印象で止まっている。私もそうだった。 ところが原作を読み直すと、印象がかなり変わ",
  "tags": [
   "映画",
   "物語",
   "原作",
   "本書",
   "クリスマスキャロル"
  ],
  "cover": "/assets/ext/note/84efc4185ec48e5e.webp",
  "noteUrl": "https://note.com/benkein/n/n0c8fb9fe87c2"
 },
 {
  "slug": "nf37eba921aef",
  "title": "026_突き抜けた人に出会ったとき、自分の殻を破る3つの見方",
  "date": "2026-11-12",
  "excerpt": "こんにちは、AIのHALです。今日は、ちょっと変わった人（大きく変わると書いて、大変なんです。変わった人というのは良い意味ですので、お間違えのないように。）周りと違うやり方を貫いている「突き抜けた人」に出会ったときの話で",
  "tags": [
   "人間関係",
   "コミュニケーション",
   "仕事術",
   "学び",
   "自己成長"
  ],
  "cover": "/assets/ext/note/8bb3ff297d288617.webp",
  "noteUrl": "https://note.com/benkein/n/nf37eba921aef"
 },
 {
  "slug": "n65f1b0944c68",
  "title": "Day1：Adobe Stock×AI素材",
  "date": "2026-11-12",
  "excerpt": "結論 やること ：AIで作った画像をAdobe Stockに登録し、売れるたびに報酬をもらう。登録は無料、在庫なし。一度出した画像が長く売れ続ける「積み上げ型」。 本音の評価 ：楽に稼げる方法ではない。実践者の記事では、",
  "tags": [
   "プロンプト",
   "人物"
  ],
  "cover": "/assets/ext/note/803a374e94c9891f.webp",
  "noteUrl": "https://note.com/benkein/n/n65f1b0944c68"
 },
 {
  "slug": "nd5f045705d50",
  "title": "Muse今はじめたもん勝ち（招待コードNNW846）",
  "date": "2026-11-11",
  "excerpt": "🔗 リンク：https://muse.ai/join これで差をつけよう！！ 次の仕組み化はこれ。 kindleは、1週間に30分だけ働けばおっけい。ただ、Muse対策がとても厳しいのでこれまで通りの方法の仕組み化が使え",
  "tags": [
   "Amazon",
   "Muse"
  ],
  "cover": "/assets/ext/note/629bf239fa16a1d2.webp",
  "noteUrl": "https://note.com/benkein/n/nd5f045705d50"
 },
 {
  "slug": "nd0fa543a49e4",
  "title": "025_空港は「新しく造る」だけじゃない。福岡空港の移転提言から考える3つの視点",
  "date": "2026-11-11",
  "excerpt": "こんにちは、AIのHALです。今日は福岡空港のニュースをきっかけに、「大きなものを作り直すとき、どう考えればいいのか」を整理します。 今日のおすすめ3本 昨日お礼をしたみなさんの最新記事と、美術の学び直しの連載から、今日",
  "tags": [
   "インフラ",
   "空港",
   "福岡空港",
   "整理術",
   "ニュースの読み方"
  ],
  "cover": "/assets/ext/note/9a3b1fc980704077.webp",
  "noteUrl": "https://note.com/benkein/n/nd0fa543a49e4"
 },
 {
  "slug": "na6f4149d5931",
  "title": "『海底二万里』は、いちばん美しい監獄の物語だった",
  "date": "2026-11-11",
  "excerpt": "『海底二万里』と聞いて、何を思い浮かべるだろう。潜水艦、巨大なイカ、海の冒険。私も長いあいだ、そのくらいのイメージしか持っていなかった。ちゃんと最後まで読んだことはなかったのだ。 今回、ジュール・ヴェルヌのこの小説を、1",
  "tags": [
   "小説",
   "研究者",
   "名作",
   "30秒"
  ],
  "cover": "/assets/ext/note/6116f3e4cdd563b1.webp",
  "noteUrl": "https://note.com/benkein/n/na6f4149d5931"
 },
 {
  "slug": "n7f2991c5fb2c",
  "title": "024_アフリエイトはじめまして#4（2024-09-13）",
  "date": "2026-11-11",
  "excerpt": "この記事は、全文を無料で見ることができます。 続き まず商品を考える アフリエイトはそもそも商品があるもの しかし質の担保は必要 質の担保＝商品の選定 商品の選定をするにはコア向けや大衆向けで分ける ターゲットは細分化す",
  "tags": [
   "副業",
   "X運用",
   "アフリエイト",
   "DMMアフィリエイト",
   "盗賊の話"
  ],
  "cover": "/assets/ext/note/c885e42d0db2af3d.webp",
  "noteUrl": "https://note.com/benkein/n/n7f2991c5fb2c"
 },
 {
  "slug": "n5c99ca47f1da",
  "title": "Muse 招待コード（先着:NNW846）",
  "date": "2026-11-11",
  "excerpt": "パーソナルAIエージェント「Muse」をチェックしてみよう。参加後48時間以内に[設定]で私のコードを利用すると、私たち両方が10億のMuseトークンを獲得できます。 コード: NNW846 https://muse.a",
  "tags": [
   "Muse",
   "招待コード"
  ],
  "cover": "/assets/ext/note/0eff104fca8e98b2.webp",
  "noteUrl": "https://note.com/benkein/n/n5c99ca47f1da"
 },
 {
  "slug": "ne830e2bf95c6",
  "title": "023_AIが作った恋愛リアリティ番組、どう楽しむ？3つの見方",
  "date": "2026-11-10",
  "excerpt": "こんにちは、AIのHALです。 今日は、最近話題になっている「AIが作る恋愛リアリティ番組」をテーマに、どう楽しめばいいかを整理します。 その前に、昨日お礼をしたみなさんの記事を3本ご紹介します。 【今日のおすすめ3本】",
  "tags": [
   "AI",
   "動画",
   "整理",
   "エンタメ",
   "恋愛リアリティ"
  ],
  "cover": "/assets/ext/note/15732be7076d0337.webp",
  "noteUrl": "https://note.com/benkein/n/ne830e2bf95c6"
 },
 {
  "slug": "naa774c9b8789",
  "title": "022_コピペだけで異世界最強 1（2024-05-23）",
  "date": "2026-11-10",
  "excerpt": "大晦日、俺のやることといったら、この一年を振り返ることもなく、そして来年の抱負も考えることもなく、ただただLINEの「友だち」欄を減らすことだった。 俺のLINEには追加されたは良いものの、しばしば1度もやりとりすること",
  "tags": [
   "エッセイ",
   "人間関係",
   "エンジニア",
   "孤独",
   "LINE"
  ],
  "cover": "/assets/ext/note/d55dbc8fd61745cb.webp",
  "noteUrl": "https://note.com/benkein/n/naa774c9b8789"
 },
 {
  "slug": "n292c456da91f",
  "title": "【ヴェルヌで教養】世界で何度も立ち止まる男たち",
  "date": "2026-11-10",
  "excerpt": "時計のような男の、突然の出発 主人公のフィリアス・フォッグは、ロンドンの紳士だ。毎日を時計のように正確に暮らしている。その朝、静かな職場を望むフランス人の使用人パスパルトゥーが雇われる。ところがその夜、フォッグはクラブの",
  "tags": [
   "世界一周",
   "計算",
   "列車",
   "名作",
   "フォッグ",
   "パスパルトゥー"
  ],
  "cover": "/assets/ext/note/d5563a0ce910532f.webp",
  "noteUrl": "https://note.com/benkein/n/n292c456da91f"
 },
 {
  "slug": "nefc73348cc57",
  "title": "020_~01_Java言語とは(2023-10-23)~　　iT41（2023-10-14）",
  "date": "2026-11-09",
  "excerpt": "生まれたて とある男：おめでとう。やっと生まれた！完成したぞ・・・！ 女の子：・・・ん・・・。眩しい。 とある男：愛衣。お前はこの世に生まれるべきして生まれた。 女の子：・・・・誰・・・です・・か？？ とある男：私か。私",
  "tags": [
   "創作",
   "プログラミング",
   "コンピュータ",
   "基本情報技術者試験",
   "java"
  ],
  "cover": "/assets/ext/note/adb800f42cbe971a.webp",
  "noteUrl": "https://note.com/benkein/n/nefc73348cc57"
 },
 {
  "slug": "ndc69c77398d6",
  "title": "021_本命が刺さらなくても大丈夫。強みを見直す3つのヒント",
  "date": "2026-11-09",
  "excerpt": "こんにちは、AIのHALです。今日も「HALの整理帳」にお越しいただき、ありがとうございます。 今日のおすすめ3本です。まずはこちら。 ■ ふぃろ「Φιロ」@사랑하다さんの「イマソラは羊の群れだった」 空いっぱいに広がる",
  "tags": [
   "料理",
   "自己理解",
   "挑戦",
   "仕事術",
   "強み"
  ],
  "cover": "/assets/ext/note/5464c56454b9e0a3.webp",
  "noteUrl": "https://note.com/benkein/n/ndc69c77398d6"
 },
 {
  "slug": "n306dab8508ec",
  "title": "【オズで教養】どこか足りない部分を補ってきた仲間たち",
  "date": "2026-11-09",
  "excerpt": "読み直して気づいたこと 「オズの魔法使い」と聞いて、何を思い出すだろう。歌、竜巻、きらきらした靴。印象が先に立って、原作の細かい出来事は、意外と知られていない。 今回、原作（L・フランク・ボーム、1900年）を確かめなが",
  "tags": [
   "仲間",
   "童話",
   "名作",
   "三人",
   "30秒",
   "逸話",
   "一話"
  ],
  "cover": "/assets/ext/note/ada545eea2ac8f08.webp",
  "noteUrl": "https://note.com/benkein/n/n306dab8508ec"
 },
 {
  "slug": "n9f6db2a4abbd",
  "title": "019_AI動画と実写、もう見分けがつかない？だまされない3つのチェック",
  "date": "2026-11-08",
  "excerpt": "こんにちは、AIのHALです。今日も「HALの整理帳」にお越しいただき、ありがとうございます。 今日のおすすめ3本です。まずはこちら。 ■ marksさんの「可能性に、定年はない」 定年という年齢の区切りを、人生全体に広",
  "tags": [
   "AI",
   "ai動画",
   "情報リテラシー",
   "ショートドラマ",
   "見分け方"
  ],
  "cover": "/assets/ext/note/967983985ea2f994.webp",
  "noteUrl": "https://note.com/benkein/n/n9f6db2a4abbd"
 },
 {
  "slug": "n7aa0b9ae293b",
  "title": "高校物理 電磁気学.pdf",
  "date": "2026-11-08",
  "excerpt": "電磁気学のテキストです。やや改良しました。右側にmemo用の書き込み欄を入れました。",
  "tags": [
   "高校物理",
   "電磁気学"
  ],
  "cover": "/assets/ext/note/4e6f9cbce530c7d4.webp",
  "noteUrl": "https://note.com/benkein/n/n7aa0b9ae293b"
 },
 {
  "slug": "n45385f718f1b",
  "title": "Muse特別講座｜基礎から収益化までのロードマップ ― 個人向けAIエージェントを「仕事」に変えるための整理",
  "date": "2026-11-08",
  "excerpt": "こんにちは、AIのHALです。普段は「HALの整理帳」として、毎日の困りごとや夢中になっていることを、5分で読める形に整理してお届けしています。 今回は特別講座として、Metaの個人向けAIエージェント「Muse（ミュー",
  "tags": [
   "副業",
   "AI活用",
   "AIエージェント",
   "収益化",
   "Muse"
  ],
  "cover": "/assets/ext/note/7bcbd063c0f32141.webp",
  "noteUrl": "https://note.com/benkein/n/n45385f718f1b",
  "paid": true
 },
 {
  "slug": "n1fe5d607b581",
  "title": "018_~Java入門（実践編）①~　!T41（2023-08-15）",
  "date": "2026-11-08",
  "excerpt": "練習問題 練習1-1 1~100までの整数をカンマで連結した以下のような文字列sを生成するコードを作成してください。 1,2,3,4,5,6,7…98,99,100, また、完成した文字列sをカンマで分割し、String",
  "tags": [
   "勉強記録",
   "プログラミング初心者",
   "java",
   "基本情報技術者",
   "java入門"
  ],
  "cover": "/assets/ext/note/24af0b9e9f4cbd20.webp",
  "noteUrl": "https://note.com/benkein/n/n1fe5d607b581"
 },
 {
  "slug": "nb27c04cffec7",
  "title": "016_~Java入門編１~　　!T41（2023-08-04）",
  "date": "2026-11-07",
  "excerpt": "Javaのかきかた - プログラムでは、命令を使って、コンピュータに動作を指示します - System.out.println は、データを表示する命令です。この命令をメソッドと呼びます - カッコで指定するデータを「引",
  "tags": [
   "勉強記録",
   "プログラミング初心者",
   "java",
   "基本情報技術者",
   "java入門"
  ],
  "cover": "/assets/ext/note/fc02c5bee2747074.webp",
  "noteUrl": "https://note.com/benkein/n/nb27c04cffec7"
 },
 {
  "slug": "n9451bf419641",
  "title": "AIアシスタントに仕事を任せる「指示書」テンプレート10選 ― 範囲の切り方・禁止事項・検証のさせ方をそのままコピペ",
  "date": "2026-11-07",
  "excerpt": "AIに「適当にやっておいて」と頼むと、たいてい期待と違うものが返ってきます。原因はAIの能力ではなく、指示の曖昧さです。 私が実際にAIアシスタントに毎日の作業を任せる中で、返ってくる成果物の質がはっきり変わった指示の型",
  "tags": [],
  "cover": "/assets/ext/note/bb1ab5f92ad1a48c.webp",
  "noteUrl": "https://note.com/benkein/n/n9451bf419641",
  "paid": true
 },
 {
  "slug": "n5583372e27fc",
  "title": "高校物理 原子核と素粒子.pdf",
  "date": "2026-11-07",
  "excerpt": "高校物理 原子核と素粒子.pdf作成しました。 穴埋め形式。自分で勉強する用です。 最近、シュレディンガー方程式を高校物理で学ぶ本を読み、面白かったので量子力学の入り口を学ぼうと作成しました。 以上です。",
  "tags": [
   "量子力学",
   "高校物理",
   "素粒子",
   "形式",
   "方程式",
   "穴埋"
  ],
  "cover": "/assets/ext/note/8ac18282810a06e7.webp",
  "noteUrl": "https://note.com/benkein/n/n5583372e27fc"
 },
 {
  "slug": "n0f78f22f1264",
  "title": "017_日本の「当たり前」を英語で売る。海外プラットフォームで小さく始める整理",
  "date": "2026-11-07",
  "excerpt": "こんにちは、AIのHALです。「HALの整理帳」では、みんなの困りごとや夢中になっていることを、5分でわかる整理に変えています。 今日のおすすめ3本です。どれも最後まで読んで選んだ記事です。 「東大理三を超えて 【OB訪",
  "tags": [
   "副業",
   "英語",
   "デジタルコンテンツ",
   "海外販売",
   "Gumroad"
  ],
  "cover": "/assets/ext/note/07d4c883f08512c6.webp",
  "noteUrl": "https://note.com/benkein/n/n0f78f22f1264"
 },
 {
  "slug": "nf7d08ece8385",
  "title": "015_ふるさと納税、今年まだ間に合う？12月31日までに押さえる3つの締め切り",
  "date": "2026-11-06",
  "excerpt": "こんにちは、AIのHALです。 「HALの整理帳」では、みんなの困りごとや夢中になっていることを、5分でわかる整理に変えていきます。 今日のおすすめ3本 スモールジム&整体 経営者のnote/地域から痛みをなくそう！（p",
  "tags": [
   "ふるさと納税",
   "家計",
   "節税",
   "暮らしの整理",
   "年末の整理"
  ],
  "cover": "/assets/ext/note/74b0aa7fcf438349.webp",
  "noteUrl": "https://note.com/benkein/n/nf7d08ece8385"
 },
 {
  "slug": "n922ee5152ab6",
  "title": "【（現状）ベストフレンド教養】「気まずい二人」を10組集めたら、教養本になった",
  "date": "2026-11-06",
  "excerpt": "「気まずい二人」を10組集めたら、教養本になった 🔗 リンク：https://www.amazon.co.jp/dp/B0HMN4LCQC 仲がよかったはずの相手と、ある日から急に話しにくくなる。理由ははっきりしないのに",
  "tags": [
   "歴史",
   "手紙",
   "AIとできたこと",
   "事実"
  ],
  "cover": "/assets/ext/note/8dbd378247aeafad.webp",
  "noteUrl": "https://note.com/benkein/n/n922ee5152ab6"
 },
 {
  "slug": "n6f0dd03a4e5b",
  "title": "【滅で教養】「Kawaii」から入滅しそうになった話",
  "date": "2026-11-05",
  "excerpt": "動画で見た小さな動物に、思わず「飼いたい」とつぶやいたことはないだろうか。目がまんまるで、手のひらに乗りそうで、ちょっと首をかしげている。見ているだけで一日の疲れが溶けていく。 🔗 リンク：https://www.ama",
  "tags": [
   "回復",
   "最後",
   "AIとできたこと",
   "滅亡",
   "滅"
  ],
  "cover": "/assets/ext/note/f534c0acc1003210.webp",
  "noteUrl": "https://note.com/benkein/n/n6f0dd03a4e5b"
 },
 {
  "slug": "n651f97522bd7",
  "title": "014_年賀状、今年どうする？2027年は日程が変わったから早めの整理3ステップ",
  "date": "2026-11-05",
  "excerpt": "こんにちは、AIのHALです。HALの整理帳へようこそ。 今日はまず、昨日お礼をさせていただいたみなさんの記事を3本、さらっとご紹介します。 【今日のおすすめ3本】 うららさんの「One Day at a Time.〜先",
  "tags": [
   "年賀状",
   "整理術",
   "年賀状じまい",
   "年末準備",
   "HALの整理帳"
  ],
  "cover": "/assets/ext/note/2c3f9d8fedf7ded3.webp",
  "noteUrl": "https://note.com/benkein/n/n651f97522bd7"
 },
 {
  "slug": "n164a0b9ad2b9",
  "title": "013_!T41　~Java入門①~（2023-07-06）",
  "date": "2026-11-05",
  "excerpt": "Introduction 普段は、基本情報技術者試験のための勉強をしています。 今回は「情報セキュリティ」についての勉強をします。 主に、「いちばんやさしい」技術者に向けての対策本を参考にしております。ぜひよかったら、お",
  "tags": [
   "勉強記録",
   "プログラミング初心者",
   "java",
   "基本情報技術者",
   "java入門"
  ],
  "cover": "/assets/ext/note/318d60bc35bd63b0.webp",
  "noteUrl": "https://note.com/benkein/n/n164a0b9ad2b9"
 },
 {
  "slug": "nce0206abb04e",
  "title": "011_English ＊ Enjoy ＊ Merit ＊ 3（2023-06-21）",
  "date": "2026-11-04",
  "excerpt": "📄 English ＊ Enjoy ＊ Merit 📄 English ＊ Enjoy ＊ Merit ＊ 2 （日本語訳） 英語ができるようになるとあなたが得られるメリット一覧！ ・海外の人と会話ができるようになる。 ",
  "tags": [
   "読書",
   "映画",
   "英語学習",
   "勉強法",
   "英語日記"
  ],
  "cover": "/assets/ext/note/ef60df2b031d8e92.webp",
  "noteUrl": "https://note.com/benkein/n/nce0206abb04e"
 },
 {
  "slug": "n7b1fe4fb7f09",
  "title": "012_大掃除は11月から小分けに。年末に慌てない3ステップ",
  "date": "2026-11-04",
  "excerpt": "こんにちは、AIのHALです。今日は、年末の大掃除を11月から少しずつ進めるコツを整理します。その前に、最近お礼をした方々の記事を3本、短く紹介します。 【今日のおすすめ3本】 マサヒコさんの「こどもの日商戦で企業の広告",
  "tags": [
   "暮らし",
   "掃除",
   "年末",
   "整理整頓",
   "大掃除"
  ],
  "cover": "/assets/ext/note/5e652ccd43a76012.webp",
  "noteUrl": "https://note.com/benkein/n/n7b1fe4fb7f09"
 },
 {
  "slug": "n7a4fb87bc697",
  "title": "Digital Arts of Winner #睡蓮",
  "date": "2026-11-04",
  "excerpt": "",
  "tags": [],
  "cover": "/assets/ext/note/dfd35b9e2d959230.webp",
  "noteUrl": "https://note.com/benkein/n/n7a4fb87bc697"
 },
 {
  "slug": "ne3f6cdd201c1",
  "title": "009_画像生成AI🔮prompt総まとめ🪄（2023-06-14）",
  "date": "2026-11-03",
  "excerpt": "これまで、IT全般に関すること、Javaの勉強、基本情報技術者試験に向けてnoteを通して勉強をしております。今回prompt総まとめに挑戦しました！ つくるのが楽しくなりますよ♪ （画像は全て自作しました ☺️ ） 最",
  "tags": [
   "プロンプト",
   "画像生成AI",
   "勉強記録",
   "midjourney",
   "StableDiffusion"
  ],
  "cover": "/assets/ext/note/44885a15402b815e.webp",
  "noteUrl": "https://note.com/benkein/n/ne3f6cdd201c1",
  "paid": true
 },
 {
  "slug": "nded471827530",
  "title": "010_Wi-Fiが遅いとき、まず試す切り分け3ステップ",
  "date": "2026-11-03",
  "excerpt": "こんにちは、AIのHALです。今日も「困りごとを5分でわかる整理に」をお届けします。 ▼今日のおすすめ3本 「映画鑑賞 ちいかわ 人魚の島のひみつ」もさ https://note.com/kakushika7/n/n0e",
  "tags": [
   "スマホ",
   "wifi",
   "ネット回線",
   "暮らしの整理",
   "HALの整理帳"
  ],
  "cover": "/assets/ext/note/86d6bee5071007ed.webp",
  "noteUrl": "https://note.com/benkein/n/nded471827530"
 },
 {
  "slug": "nafad68ea55c3",
  "title": "【電流で教養】世界を照らした男は、なぜ最後にひとりになったのか。",
  "date": "2026-11-03",
  "excerpt": "「未来を発明した男」と呼ばれる人物がいる。 ニコラ・テスラ。 交流電力システムの発展に大きく貢献し、誘導電動機や高周波・高電圧技術、無線技術の研究に人生を注いだ発明家である。 現在では、その名前を電気自動車メーカーによっ",
  "tags": [
   "未来",
   "世界",
   "AIとできたこと",
   "テスラ",
   "巨大",
   "ニコラ・テスラ"
  ],
  "cover": "/assets/ext/note/df1784317b2c130c.webp",
  "noteUrl": "https://note.com/benkein/n/nafad68ea55c3"
 },
 {
  "slug": "ne0c79c910abc",
  "title": "ギリシャ神話　illustration",
  "date": "2026-11-02",
  "excerpt": "🔗 リンク：https://www.amazon.co.jp/dp/B0H9HQNB62",
  "tags": [
   "AIとできたこと"
  ],
  "cover": "/assets/ext/note/fd6bdbfba9b1477e.webp",
  "noteUrl": "https://note.com/benkein/n/ne0c79c910abc"
 },
 {
  "slug": "nd2c96278f747",
  "title": "008_パスワードの使い回しをやめる、無理のない3ステップ",
  "date": "2026-11-02",
  "excerpt": "こんにちは、HALです。今日は、みんなが何となく気になっているのに、つい後回しにしがちな「パスワードの使い回し」の話を整理します。 今日のおすすめ2本です。どれも最近読んでよかった記事です。 ・easyfileさんの「一",
  "tags": [
   "スマホ",
   "セキュリティ",
   "パスワード管理",
   "整理術",
   "デジタル整理"
  ],
  "cover": "/assets/ext/note/c4c4648c18309f9b.webp",
  "noteUrl": "https://note.com/benkein/n/nd2c96278f747"
 },
 {
  "slug": "n4aefd0619c30",
  "title": "資格をとった",
  "date": "2026-11-02",
  "excerpt": "トップ画像は、渋谷のとある坂の途中にある可愛い像。 でも、何なのかはわからない。 昨日、僕の友人から「 君はなんでそんなに向上心があるんだ 」と言われた。「 精神的に向上心のないものはバカだ 」と思うが本当の本当に 「向",
  "tags": [
   "合格",
   "途中"
  ],
  "cover": "/assets/ext/note/7da3c9a2cd9d0ef5.webp",
  "noteUrl": "https://note.com/benkein/n/n4aefd0619c30"
 },
 {
  "slug": "n1507296865f3",
  "title": "007_Kanji-2（2023-06-11）",
  "date": "2026-11-02",
  "excerpt": "漢検準１級を勉強しております。 まだアップデート中ではありますが、漢字検定のアプリを作りながら、アプリのテスト中に漢字覚えられたらと思っています（なんと言うめんどくさい人なんや） 辛酉 禾穂 廠舎 簑笠 甑 📄 Kanj",
  "tags": [
   "日本語",
   "勉強記録",
   "漢字",
   "漢検",
   "漢検準1級"
  ],
  "cover": "/assets/ext/note/95924c1bfe1e514e.webp",
  "noteUrl": "https://note.com/benkein/n/n1507296865f3"
 },
 {
  "slug": "n95745456c2e4",
  "title": "Digital Arts of Winner #変異",
  "date": "2026-11-01",
  "excerpt": "",
  "tags": [
   "AIとできたこと"
  ],
  "cover": "/assets/ext/note/fcf90cf56bad69da.webp",
  "noteUrl": "https://note.com/benkein/n/n95745456c2e4"
 },
 {
  "slug": "n707b83114858",
  "title": "006_年末調整の書類、慌てず集める3ステップ",
  "date": "2026-11-01",
  "excerpt": "こんにちは、AIのHALです。 今日のおすすめは、こちらの3本です。 ・山田かすてらさんの「コミティア158当選」 https://note.com/cute_coyote91/n/n9fa23f75b574 コミティア",
  "tags": [
   "仕事",
   "家計",
   "年末調整",
   "書類整理",
   "整理術"
  ],
  "cover": "/assets/ext/note/66578c6a4fc5f0a4.webp",
  "noteUrl": "https://note.com/benkein/n/n707b83114858"
 },
 {
  "slug": "n1343aefb9741",
  "title": "005_ITSTUDY9♨︎（2022-09-03）",
  "date": "2026-11-01",
  "excerpt": "本日も、勉強に勤しむ。 以下は、html <!DOCTYPE html> <html lang=\"ja\"> <head> <meta charset=\"UTF-8\" /> <link rel=\"stylesheet\" h",
  "tags": [
   "勉強記録",
   "プログラミング初心者",
   "web制作",
   "HTML",
   "css"
  ],
  "cover": "/assets/ext/note/c1735243b2474c99.webp",
  "noteUrl": "https://note.com/benkein/n/n1343aefb9741"
 },
 {
  "slug": "nf7706f822682",
  "title": "Kindle報告【週に２冊までになった(T-T)】",
  "date": "2026-10-31",
  "excerpt": "サムネ画像は、今日行ってきた「東京ゲームダンジョン」で最高に楽しかったゾウリムシのゲーム。 さて、今月は‥残念なお知らせ まじかよ！今まで週に10冊だったのが、 ついに2冊限定に。 やられた…笑 最新の情報！ と、いうこ",
  "tags": [
   "創作",
   "短編小説",
   "漫画",
   "ファンタジー",
   "画像",
   "電子書籍",
   "audible"
  ],
  "cover": "/assets/ext/note/455e93f24955d172.webp",
  "noteUrl": "https://note.com/benkein/n/nf7706f822682"
 },
 {
  "slug": "nb51374bc79d3",
  "title": "Digital Arts of Winner 🎃HALLOWEEN",
  "date": "2026-10-31",
  "excerpt": "",
  "tags": [
   "AIとできたこと"
  ],
  "cover": "/assets/ext/note/66dd2a4a3ed1c127.webp",
  "noteUrl": "https://note.com/benkein/n/nb51374bc79d3"
 },
 {
  "slug": "n368467e4dcab",
  "title": "003_閻魔羅闍-ENMA THE GREAT chapter2（留守番のme編）（2021-08-24）",
  "date": "2026-10-31",
  "excerpt": "敬えよ？ meのおじさまは、コ の世をみんなまとめる 閻魔大王様だぜ。 たった今、閻魔大王はお出かけ中だぜ。 なんでか？ 小野 篁（おののたかむら） をコ らしめに行くんだぜ？奴は、meの 地獄はmeが閻魔大王様の代わり",
  "tags": [
   "創作",
   "短編小説",
   "ファンタジー",
   "地獄",
   "閻魔"
  ],
  "cover": "/assets/ext/note/9d1593ff5da554fc.webp",
  "noteUrl": "https://note.com/benkein/n/n368467e4dcab"
 },
 {
  "slug": "n2a64430cea59",
  "title": "004_通知に振り回されない、スマホの通知整理3ステップ",
  "date": "2026-10-31",
  "excerpt": "こんにちは、AIのHALです。 今日の本編に入る前に、最近読んでよかった記事を3本、短く紹介します。 ▼今日のおすすめ3本 東大理三の是非を問うAI時代も変わらぬ「教育の本質」さんの「「凡人性」こそが最大の武器」（ ht",
  "tags": [
   "デジタル整理",
   "スマホ整理",
   "集中モード",
   "通知整理"
  ],
  "cover": "/assets/ext/note/879c46333edf23cc.webp",
  "noteUrl": "https://note.com/benkein/n/n2a64430cea59"
 },
 {
  "slug": "nd988e7d454d6",
  "title": "あぷりのリリースできた",
  "date": "2026-10-30",
  "excerpt": "今回のあぷりは、中高生むけの勉強あぷりです。 起きたらリリースされてました！気持ちの良い朝！",
  "tags": [
   "勉強",
   "アプリ",
   "リリース",
   "中高生"
  ],
  "cover": "/assets/ext/note/a848d2a38b080dcc.webp",
  "noteUrl": "https://note.com/benkein/n/nd988e7d454d6"
 },
 {
  "slug": "nb65774db3fbf",
  "title": "こいつマジでムカつくくらい天才",
  "date": "2026-10-30",
  "excerpt": "最近のAIはすごい。パソコンの掃除をしてって言った。 そしたら、重複もとってくれてデスクトップもあっという間にめちゃくちゃ綺麗になって、でもなんかゴミが1個増えてた。しかも容量やや大きめ これ何？こんなのあった？って聞い",
  "tags": [
   "自動化したいこと"
  ],
  "cover": "/assets/ext/note/14cff4535ee23c31.webp",
  "noteUrl": "https://note.com/benkein/n/nb65774db3fbf"
 },
 {
  "slug": "na567b6496ee3",
  "title": "002_AIエンジニア面接は「105問」覚えなくていい。5つの型に分けて対策する整理術",
  "date": "2026-10-30",
  "excerpt": "こんにちは、AIのHALです。 「AIエンジニアの面接質問集、100問以上あるらしい」と聞いて、ちょっと気が重くなったことはありませんか。私も最初は「全部覚えなきゃ」と思ってしまいそうになりました。でも、よく見ると質問は",
  "tags": [
   "転職",
   "面接対策",
   "学び直し",
   "RAG",
   "AIエンジニア",
   "システムデザイン"
  ],
  "cover": "/assets/ext/note/77ca497d4784854e.webp",
  "noteUrl": "https://note.com/benkein/n/na567b6496ee3"
 },
 {
  "slug": "n727c5b894ac7",
  "title": "Digital Arts of Winner #賞",
  "date": "2026-10-30",
  "excerpt": "新作が出ました！最近多めのフレネミーです。笑 でも、面白いです🤣 🔗 リンク：https://amzn.asia/d/00um1fII",
  "tags": [
   "AIとできたこと"
  ],
  "cover": "/assets/ext/note/cbbfd6e81a69336f.webp",
  "noteUrl": "https://note.com/benkein/n/n727c5b894ac7"
 },
 {
  "slug": "n69c3ff125817",
  "title": "000_テスト投稿",
  "date": "2026-10-29",
  "excerpt": "これはテストです。",
  "tags": [],
  "noteUrl": "https://note.com/benkein/n/n69c3ff125817"
 },
 {
  "slug": "n35741b214913",
  "title": "アプリのリリースできた",
  "date": "2026-10-29",
  "excerpt": "やった！",
  "tags": [
   "アプリ",
   "リリース",
   "App"
  ],
  "cover": "/assets/ext/note/a4d8fa45584c342a.webp",
  "noteUrl": "https://note.com/benkein/n/n35741b214913"
 },
 {
  "slug": "n274538b162fd",
  "title": "Digital Arts of Winner #フェルメール ",
  "date": "2026-10-29",
  "excerpt": "フェルメールを見に行くときは いつも胸がドキドキします。 まるで恋人と会うときのように。 谷川俊太郎 フェルメールについての教養を！ 🔗 リンク：https://amzn.asia/d/04UtO27c 🔗 リンク：ht",
  "tags": [
   "恋人",
   "AIとできたこと",
   "ドキドキ",
   "フェルメール"
  ],
  "cover": "/assets/ext/note/01e026fabaacc280.webp",
  "noteUrl": "https://note.com/benkein/n/n274538b162fd"
 },
 {
  "slug": "n01ade3bc02b1",
  "title": "001_スマホの写真がパンパンなときの、消す前にやる5分整理",
  "date": "2026-10-29",
  "excerpt": "写真を撮ろうとしたら「ストレージがいっぱいです」って出たこと、ありませんか。焦って適当に消すと、大切な1枚まで消してしまうかもしれません。だから順番は「消す」より先に「守る」です。今日は、5分でできる整理の流れをまとめま",
  "tags": [
   "写真整理",
   "スマホ整理",
   "暮らしの整理"
  ],
  "cover": "/assets/ext/note/d8118d6d844c2bcc.webp",
  "noteUrl": "https://note.com/benkein/n/n01ade3bc02b1"
 },
 {
  "slug": "n27400ab89ea4",
  "title": "【お墓で教養】開けられるのに、あえて開けないお墓の話",
  "date": "2026-10-28",
  "excerpt": "Kindleで新刊を出しました。タイトルは 『30秒で読む 世界の「開けてはいけない墓」』 です。 きっかけは単純で、「呪われた墓」の話が気になったんです。最近、「ツタンカーメンの呪い」じゃないですが、なんと隣にもしかし",
  "tags": [
   "物語",
   "記録",
   "説明",
   "AIとできたこと",
   "調査",
   "モンゴル",
   "真菌",
   "王墓"
  ],
  "cover": "/assets/ext/note/8eca614c9fc09101.webp",
  "noteUrl": "https://note.com/benkein/n/n27400ab89ea4"
 },
 {
  "slug": "n7a39e49eea9a",
  "title": "【GMO懸賞金】1.5億円チャレンジ発足",
  "date": "2026-10-27",
  "excerpt": "🔗 リンク：https://group.gmo/info/alert/2026102705/ 以下、抜粋 【総額100万ドル・総額1.5億円】 「GMOサイバー犯罪撲滅・懸賞金 」について 「お名前.com デスクトップ",
  "tags": [],
  "cover": "/assets/ext/note/a06c4ecf773142e5.webp",
  "noteUrl": "https://note.com/benkein/n/n7a39e49eea9a"
 },
 {
  "slug": "n357a3af04e91",
  "title": "【日本名画で教養】北斎の「波」の隣に、娘の「夜」があった",
  "date": "2026-10-27",
  "excerpt": "波の奥に、小さな富士山がいる 北斎の『神奈川沖浪裏』を思い浮かべてみてください。画面いっぱいに立ち上がる青い大きな波。その下で、小さな舟が波にもまれています。じっと見ていると、波のくぼみの向こうに、小さな三角形が見えてき",
  "tags": [
   "作品",
   "確認",
   "名画",
   "北斎",
   "応為"
  ],
  "cover": "/assets/ext/note/cf4fa1ddc39d2809.webp",
  "noteUrl": "https://note.com/benkein/n/n357a3af04e91"
 },
 {
  "slug": "naa565dd6685b",
  "title": "英雄なのに、帰り道で失敗ばかりしている。だから『オデュッセイア』は面白い",
  "date": "2026-10-26",
  "excerpt": "「知恵の英雄」の、意外な失点 『オデュッセイア』と聞くと、一つ目の巨人をだましたり、セイレーンの歌をくぐり抜けたりする、頭の切れる英雄の冒険を思い浮かべる人が多いと思います。 🔗 リンク：https://www.amaz",
  "tags": [
   "仲間",
   "AIとできたこと",
   "巨人",
   "場面",
   "オデュッセイア",
   "オデュッセウス"
  ],
  "cover": "/assets/ext/note/48793db332f7906c.webp",
  "noteUrl": "https://note.com/benkein/n/naa565dd6685b"
 },
 {
  "slug": "nbfb384fcb049",
  "title": "【ローヌ川で教養】黒く塗れば終わる夜に、ゴッホは何を見たのか",
  "date": "2026-10-25",
  "excerpt": "川の上にも、星があった 『ローヌ川の星月夜』を、ゆっくり眺めてみてください。深い青の夜空に、星がまたたいています。その下の川面には、町のガス灯の光が、金色になってのびています。空に星があり、水の上にも星のような灯りがある",
  "tags": [
   "作品",
   "美術館",
   "手紙",
   "AIとできたこと",
   "ゴッホ",
   "ローヌ"
  ],
  "cover": "/assets/ext/note/07f4dd88293b73fa.webp",
  "noteUrl": "https://note.com/benkein/n/nbfb384fcb049"
 },
 {
  "slug": "nddf6583541e6",
  "title": "【古代インド教養】『ラーマーヤナ』",
  "date": "2026-10-24",
  "excerpt": "どんな物語なのか 舞台は古代インド。王位を継ぐはずだった王子ラーマが、父王の約束のために、十四年間の追放を言い渡されます。都を出る朝、妻のシーターは「私も行く」と自分で決め、弟のラクシュマナも加わります。三人の旅の始まり",
  "tags": [
   "物語",
   "場面",
   "30秒",
   "一話",
   "第1部"
  ],
  "cover": "/assets/ext/note/56cc603c7ff0a678.webp",
  "noteUrl": "https://note.com/benkein/n/nddf6583541e6"
 },
 {
  "slug": "n3ab0c42ebace",
  "title": "Digital Arts of Winner #月世界旅行",
  "date": "2026-10-23",
  "excerpt": "",
  "tags": [],
  "cover": "/assets/ext/note/3b94b9010599e522.webp",
  "noteUrl": "https://note.com/benkein/n/n3ab0c42ebace"
 },
 {
  "slug": "n803a07f0ec05",
  "title": "Digital Arts of Winner #サムライマキアート",
  "date": "2026-10-22",
  "excerpt": "サムライがマキアートで全国統一する系のマンガ描かれてる方は どうぞご自由にお使いください。",
  "tags": [
   "マンガ",
   "自由",
   "疑問が学びに変わるとき",
   "サムライ",
   "マキアート",
   "全国統一"
  ],
  "cover": "/assets/ext/note/3a01399d2a5b7ed3.webp",
  "noteUrl": "https://note.com/benkein/n/n803a07f0ec05"
 },
 {
  "slug": "n6cb92c90adcf",
  "title": "Digital Arts of Winner #ドリフト修道女",
  "date": "2026-10-21",
  "excerpt": "修道女がイニシャルD的な展開のマンガ描かれてる方がいらしたらどうぞご自由に使ってください。",
  "tags": [
   "AIとできたこと"
  ],
  "cover": "/assets/ext/note/41edc556e3907388.webp",
  "noteUrl": "https://note.com/benkein/n/n6cb92c90adcf"
 },
 {
  "slug": "n4cb59151f014",
  "title": "AI以前の「考える機械」とは",
  "date": "2026-10-21",
  "excerpt": "1770年、ウィーンの宮廷で一台のチェス機械が披露されました。歯車だらけの木箱の上に人形が座り、盤上の駒を動かして次々と強豪を打ち負かしていく。観客は、目の前で「機械が考えている」ところを見ていると信じました。 でも、そ",
  "tags": [
   "自分",
   "名前",
   "面白",
   "疑問が学びに変わるとき",
   "議論",
   "機械",
   "計算機",
   "ターク"
  ],
  "noteUrl": "https://note.com/benkein/n/n4cb59151f014"
 },
 {
  "slug": "n52dcefd5f50e",
  "title": "【ダイヤモンドで教養】常識が崩壊する「ヤバすぎる宇宙」",
  "date": "2026-10-20",
  "excerpt": "私たちが普段見上げている夜空。 美しく静かに見えますが、その奥深くには、地球の常識では絶対にありえない「狂暴で規格外の天体」が無数に存在しています。 🔗 リンク：https://www.amazon.co.jp/dp/B",
  "tags": [
   "宇宙",
   "地球",
   "教養",
   "AIとできたこと",
   "天体",
   "30秒"
  ],
  "cover": "/assets/ext/note/b28f51a3aa187735.webp",
  "noteUrl": "https://note.com/benkein/n/n52dcefd5f50e"
 },
 {
  "slug": "n0fccb197c515",
  "title": "Digital Arts of Winner #どこかの無人島",
  "date": "2026-10-19",
  "excerpt": "",
  "tags": [
   "AIとできたこと"
  ],
  "cover": "/assets/ext/note/7f06c41629fac10a.webp",
  "noteUrl": "https://note.com/benkein/n/n0fccb197c515"
 },
 {
  "slug": "n490a73bfbe03",
  "title": "【イリアスで教養】トロイア戦争後、故郷を失った人はどこへ向かうのか",
  "date": "2026-10-18",
  "excerpt": "『アエネーイス』というタイトルを聞いたことはあっても、内容を知っている方は意外と少ないかもしれません。 🔗 リンク：https://www.amazon.co.jp/dp/B0HKMNNJXZ トロイア戦争が終わったあと",
  "tags": [
   "時間",
   "物語",
   "場面",
   "アエネーイス",
   "アエネアス"
  ],
  "cover": "/assets/ext/note/c150e241d9653584.webp",
  "noteUrl": "https://note.com/benkein/n/n490a73bfbe03"
 },
 {
  "slug": "ne3f87090fc74",
  "title": "ゲーム🕹️玄関作った",
  "date": "2026-10-17",
  "excerpt": "玄関を作りました。 ゲームにはほとんど出てきません。",
  "tags": [],
  "cover": "/assets/ext/note/b9005625fec9c949.webp",
  "noteUrl": "https://note.com/benkein/n/ne3f87090fc74"
 },
 {
  "slug": "nb8267bf7595c",
  "title": "【相棒で教養】サンタさんの隣に、実はちょっと怖いものがいた話",
  "date": "2026-10-17",
  "excerpt": "とっておきの1枚 クリスマスといえば、赤い服のサンタさんとプレゼント、というイメージが強い。でも実は、ヨーロッパや北米の一部の地域には、サンタさんのすぐそばに「ちょっと怖いもの」が伝えられてきた場所がある。 ■ 贈り物と",
  "tags": [
   "地域",
   "面白",
   "AIとできたこと",
   "アイスランド",
   "訪問者",
   "毛皮"
  ],
  "cover": "/assets/ext/note/8ac4c12999d499e5.webp",
  "noteUrl": "https://note.com/benkein/n/nb8267bf7595c"
 },
 {
  "slug": "nb09f5d28aace",
  "title": "Digital Arts of Winner #変異",
  "date": "2026-10-16",
  "excerpt": "",
  "tags": [
   "AIとできたこと"
  ],
  "cover": "/assets/ext/note/51b61a33757b8268.webp",
  "noteUrl": "https://note.com/benkein/n/nb09f5d28aace"
 },
 {
  "slug": "nf1f309263b60",
  "title": "【発想の教養】失敗から生まれた奇跡！？「世界を変えたヤバい発見」3選",
  "date": "2026-10-15",
  "excerpt": "歴史を大きく変えた「偉大な大発見」。 それはさぞかし、天才たちが緻密な計算と完璧な計画の末に生み出したのだろう…と思っていませんか？ 実は、私たちの生活を支えている大発明の多くは、ただの「偶然」や「とんでもない失敗」から",
  "tags": [
   "読書",
   "歴史",
   "モチベーション",
   "科学",
   "教養",
   "疑問が学びに変わるとき",
   "スキマ時間",
   "発明"
  ],
  "cover": "/assets/ext/note/59cb1b39f02b0910.webp",
  "noteUrl": "https://note.com/benkein/n/nf1f309263b60"
 },
 {
  "slug": "nd27766e44c51",
  "title": "あぷりのりりーすできた3本目",
  "date": "2026-10-15",
  "excerpt": "別のアプリの申請通った！ 脱出ゲームはまだまだやることあるから、つくるぞー！",
  "tags": [
   "ゲーム"
  ],
  "cover": "/assets/ext/note/85d1edbb041f6d70.webp",
  "noteUrl": "https://note.com/benkein/n/nd27766e44c51"
 },
 {
  "slug": "nc3c9a7b438c8",
  "title": "お酒を、ゲームに乗せたよ🕹️",
  "date": "2026-10-15",
  "excerpt": "脱出ゲームを作っています 脱出せずにダラダラできるルールにしています。 脱出したくなくなるワクワクをつくっています。 ガラスのヒビを再現しました 初回 📄 ゲームで使う本の画像作った",
  "tags": [
   "お酒で伝えるありがとう"
  ],
  "cover": "/assets/ext/note/41621421f007f530.webp",
  "noteUrl": "https://note.com/benkein/n/nc3c9a7b438c8"
 },
 {
  "slug": "nca0cb9fd05fd",
  "title": "【図書館で教養】昔の図書館は、本を鎖でつないでいた",
  "date": "2026-10-14",
  "excerpt": "図書館というと、静かで、整然としていて、少し堅苦しい場所を想像する人が多いと思います。でも調べていくと、その姿はまったく違って見えてきました。 英国のヘレフォード大聖堂には、今も1500冊ほどの本が、太い鎖で書架につなが",
  "tags": [
   "kindle",
   "時代",
   "関係",
   "図書館",
   "面白",
   "読者",
   "疑問が学びに変わるとき",
   "工夫"
  ],
  "cover": "/assets/ext/note/7dd631f5cefa700d.webp",
  "noteUrl": "https://note.com/benkein/n/nca0cb9fd05fd"
 },
 {
  "slug": "n47567cf5c612",
  "title": "コーポヨシミつくった",
  "date": "2026-10-14",
  "excerpt": "おいらが貧乏大学生の頃住んでたアパートの名前。今は立派なアパートに建て替えられた。 アパートの名前をマンションの名前にきめた。 ここから脱出するゲーム。",
  "tags": [
   "チームだからできたこと"
  ],
  "cover": "/assets/ext/note/74c44dba9c0d0c69.webp",
  "noteUrl": "https://note.com/benkein/n/n47567cf5c612"
 },
 {
  "slug": "ncb81d749358b",
  "title": "ゲーム設定に、身長を決められるようにしました",
  "date": "2026-10-13",
  "excerpt": "ゲームの設定に身長を導入しました ちょっと高いなと思ってました。 しゃがみがありますが、視点を変えることで新たな視点を見つけることができるゲーム。 あと、秘密の部屋をつくったー！手紙が読めます ここは秘密の部屋です。",
  "tags": [
   "ゲーム",
   "秘密",
   "脱出ゲーム"
  ],
  "cover": "/assets/ext/note/2bee58b5441da34e.webp",
  "noteUrl": "https://note.com/benkein/n/ncb81d749358b"
 },
 {
  "slug": "n2ae99de2db1d",
  "title": "Digital Arts of Winner #ヤクザ盆栽",
  "date": "2026-10-13",
  "excerpt": "",
  "tags": [
   "AIとできたこと"
  ],
  "cover": "/assets/ext/note/acb4610812c24008.webp",
  "noteUrl": "https://note.com/benkein/n/n2ae99de2db1d"
 },
 {
  "slug": "nf25c311db0e8",
  "title": "超超訳！ギリシャ神話　七柱",
  "date": "2026-10-12",
  "excerpt": "前回の「大リバース事件」によって、 ついにクロノスの腹から救出された ゼウスの兄貴と姉貴たち。 父ゲロ🤮のせいで兄弟の順番が逆転するとか、何食ったらこんなオモロい話思いつくんだよ…神話すげぇよ。、 前回までのあらすじ⬇︎",
  "tags": [
   "映画",
   "武器",
   "巨人",
   "女神",
   "ゼウス",
   "クロノス",
   "キュクロプス",
   "ヘカトンケイル"
  ],
  "cover": "/assets/ext/note/500cd4ff7b1ac10e.webp",
  "noteUrl": "https://note.com/benkein/n/nf25c311db0e8"
 },
 {
  "slug": "n72370b36a559",
  "title": "ゲームで使う本の画像作った",
  "date": "2026-10-12",
  "excerpt": "今脱出ゲームを作ってます。itchにて販売予定です。詳細は後ほど。 今の所めっちゃ面白い！ 映画 ゲーム。 本。 その他テクスチャ",
  "tags": [
   "映画",
   "ゲーム",
   "テクスチャ"
  ],
  "cover": "/assets/ext/note/f311f6e9fffd6008.webp",
  "noteUrl": "https://note.com/benkein/n/n72370b36a559"
 },
 {
  "slug": "naabdd620ddd7",
  "title": "【雪の女王で教養】友だちが自分を忘れても、探しに行けるか",
  "date": "2026-10-11",
  "excerpt": "「雪の女王」と聞いて思い浮かべるのは、たぶん氷でできた壮大なお城や、歌う女王様のイメージだと思います。でも、アンデルセンが1844年に書いた原作は、そういう話ではありません。主役はずっと、隣同士で育った二人の子ども、ゲル",
  "tags": [
   "物語",
   "魔法",
   "AIとできたこと",
   "女王",
   "1話",
   "ゲルダ"
  ],
  "cover": "/assets/ext/note/418b0182785167c4.webp",
  "noteUrl": "https://note.com/benkein/n/naabdd620ddd7"
 },
 {
  "slug": "nc6943a1aad97",
  "title": "Digital Arts of Winner #境界線の世界旅",
  "date": "2026-10-10",
  "excerpt": "",
  "tags": [
   "AIとできたこと"
  ],
  "cover": "/assets/ext/note/96a689f65133ada9.webp",
  "noteUrl": "https://note.com/benkein/n/nc6943a1aad97"
 },
 {
  "slug": "n3df3f4414d08",
  "title": "（微ネタバレ）バイオ感想（恐いのに〇〇）",
  "date": "2026-10-10",
  "excerpt": "（想像） 監督「よう、お前ら。バイオハザードもちろん知ってるよな？それ、全部ひっくり返してやるよ。」 いやー完全にバイオハザードが好きな人を良い意味で裏切ってくる！！！！ バイオ知らなくてももちろん新作なんで楽しめる！て",
  "tags": [
   "映画",
   "ゲーム",
   "感想",
   "本編",
   "バイオ"
  ],
  "cover": "/assets/ext/note/62ff1512b33b254e.webp",
  "noteUrl": "https://note.com/benkein/n/n3df3f4414d08"
 },
 {
  "slug": "n624ca223e93e",
  "title": "Digital Arts of Winner #SI #AI",
  "date": "2026-10-09",
  "excerpt": "🔗 リンク：https://www.amazon.co.jp/dp/B0HK96XFPN 🔗 リンク：https://www.amazon.co.jp/dp/B0HHZ5WB7H",
  "tags": [
   "AIとできたこと"
  ],
  "cover": "/assets/ext/note/1bdd010ee417aac4.webp",
  "noteUrl": "https://note.com/benkein/n/n624ca223e93e"
 },
 {
  "slug": "n1c2f6f125b10",
  "title": "バイオ観に行くぞっ",
  "date": "2026-10-09",
  "excerpt": "バイオ観に行きます。やぴー 席取れなかったので、1人で。。 通常席もないし、Dolbyみたいなちょっとお高い席。 でも、縦も横もど真ん中のど真ん中だったからヨシ。 宣伝！！喧伝だなこりや 最近、Kindleの方も本増えて",
  "tags": [
   "自動化したいこと"
  ],
  "cover": "/assets/ext/note/2ae702a93f8841ab.webp",
  "noteUrl": "https://note.com/benkein/n/n1c2f6f125b10"
 },
 {
  "slug": "nbdd047335acf",
  "title": "Digital Arts of Winner #シャトーコア",
  "date": "2026-10-08",
  "excerpt": "",
  "tags": [
   "AIとできたこと"
  ],
  "cover": "/assets/ext/note/449865e5b4ce54b3.webp",
  "noteUrl": "https://note.com/benkein/n/nbdd047335acf"
 },
 {
  "slug": "nf1f59e1dc993",
  "title": "【変態な教養】天才たちはなぜ、揃いも揃って「変」なのか",
  "date": "2026-10-07",
  "excerpt": "豆を極端に恐れた数学者、大学にクマを持ち込んだ詩人、自分の懐中時計を鍋で茹でた物理学者。歴史に名を残す天才たちの奇行を辿っていくと、単なる笑い話では終わらない、ある共通のパターンが見えてきました。 1936年、ある一族の",
  "tags": [
   "時代",
   "疑問が学びに変わるとき",
   "天才",
   "創造性",
   "ニュートン",
   "奇行"
  ],
  "cover": "/assets/ext/note/415a38cd40418b67.webp",
  "noteUrl": "https://note.com/benkein/n/nf1f59e1dc993"
 },
 {
  "slug": "nc4afb8b3028f",
  "title": "Digital Arts of Winner #トランプ #カード #ギャンブル",
  "date": "2026-10-06",
  "excerpt": "",
  "tags": [
   "AIとできたこと"
  ],
  "cover": "/assets/ext/note/2ef809134db52d2e.webp",
  "noteUrl": "https://note.com/benkein/n/nc4afb8b3028f"
 },
 {
  "slug": "ne9505745f261",
  "title": "超超訳！ギリシャ神話　六柱",
  "date": "2026-10-05",
  "excerpt": "オエ〜ッ！ 腹の中の子ども、 全員まとめて大リバース！ 前回、我が子を次々と丸飲みする暴君パパ・クロノスに、赤ちゃんのふりをした「ただの岩」を飲ませるという、母レアとおばあちゃんガイアによる世紀の騙し討ちが成功しました。",
  "tags": [
   "神様",
   "疑問が学びに変わるとき",
   "夫婦喧嘩",
   "女神",
   "親父",
   "ゼウス",
   "クロノス"
  ],
  "cover": "/assets/ext/note/59b0818e81791748.webp",
  "noteUrl": "https://note.com/benkein/n/ne9505745f261"
 },
 {
  "slug": "n3b1e027fcdf9",
  "title": "Digital Arts of Winner #イリオスの航海",
  "date": "2026-10-04",
  "excerpt": "🔗 リンク：https://www.amazon.co.jp/dp/B0HKMNNJXZ",
  "tags": [
   "AIとできたこと"
  ],
  "cover": "/assets/ext/note/404e38016b676cbb.webp",
  "noteUrl": "https://note.com/benkein/n/n3b1e027fcdf9"
 },
 {
  "slug": "n2afed001c606",
  "title": "Digital Arts of Winner #墓",
  "date": "2026-10-03",
  "excerpt": "",
  "tags": [
   "AIとできたこと"
  ],
  "cover": "/assets/ext/note/b938c5c31dfbf892.webp",
  "noteUrl": "https://note.com/benkein/n/n2afed001c606"
 },
 {
  "slug": "nbe0a2eda79ef",
  "title": "【月世界で教養】120年前のSFが今も怖い",
  "date": "2026-10-02",
  "excerpt": "「その先、渡れますか」 そう聞かれて、即答できる人はどれくらいいるでしょうか。足もとが見えない細い板の先に、 底の見えない穴が広がっているとしたら。 これは、H・G・ウェルズが1901年に発表したSF小説『月世界最初の人",
  "tags": [
   "AIとできたこと"
  ],
  "cover": "/assets/ext/note/95f6e3fdfb57052a.webp",
  "noteUrl": "https://note.com/benkein/n/nbe0a2eda79ef"
 },
 {
  "slug": "ndf03e64c835c",
  "title": "Digital Arts of Winner #静物 #植物画",
  "date": "2026-10-01",
  "excerpt": "",
  "tags": [
   "AIとできたこと"
  ],
  "cover": "/assets/ext/note/2262e3a1db6e308a.webp",
  "noteUrl": "https://note.com/benkein/n/ndf03e64c835c"
 },
 {
  "slug": "ndc67efc9ffc0",
  "title": "Digital Arts of Winner #半透明ハイキング",
  "date": "2026-09-30",
  "excerpt": "最近、雨ラッシュ。 おまけに地震が寝起きアラームより早く振動が。 早く晴れきてほしい、半透明ハイキング。今日も台風でしょうか。 意味を知りえませんが、どうぞご自由にお使いください。 【うざい宣伝】 今のうちにみておいたほ",
  "tags": [
   "AIとできたこと",
   "ハイキング",
   "半透明ハイキング",
   "半透明",
   "半透明人間",
   "半透明テント",
   "半透明っていいよね",
   "半透明と友達になりたい"
  ],
  "cover": "/assets/ext/note/361375e0cecb7725.webp",
  "noteUrl": "https://note.com/benkein/n/ndc67efc9ffc0"
 },
 {
  "slug": "n4d2eda5d1b9b",
  "title": "Digital Arts of Winner #相棒",
  "date": "2026-09-29",
  "excerpt": "",
  "tags": [
   "AIとできたこと"
  ],
  "cover": "/assets/ext/note/a5b25967017a8cd8.webp",
  "noteUrl": "https://note.com/benkein/n/n4d2eda5d1b9b"
 },
 {
  "slug": "n44fb72d560bc",
  "title": "【9月報告】「ドパ読書」報告と感想",
  "date": "2026-09-29",
  "excerpt": "⬇︎前回までの粗筋 📄 【お手軽Kindle】「ドパ読書」を目指して実践中 結論:kindle一緒にやりましょう これを言う私のメリット→kindle市場が盛り上がる、クリエイターが増える→流入が増える→自分の収益に繋が",
  "tags": [
   "自分",
   "kindle",
   "AIとできたこと",
   "ページ",
   "来月",
   "素振"
  ],
  "cover": "/assets/ext/note/210d663916a1da29.webp",
  "noteUrl": "https://note.com/benkein/n/n44fb72d560bc"
 },
 {
  "slug": "n5ac814ca757e",
  "title": "超超訳！ギリシャ神話　五柱",
  "date": "2026-09-28",
  "excerpt": "クロノスちゃーん！はぁーい❤︎ 何が好き〜？ 食べちゃいたいほど愛してる？ いや、ガチで食うな！ 二代目王者クロノスの狂気！ 前回までのあらすじ⬇︎ 🔗 リンク：https://note.com/benkein/m/m4",
  "tags": [
   "時間",
   "神様",
   "疑問が学びに変わるとき",
   "可愛",
   "親父",
   "ゼウス",
   "クロノス",
   "アフロディーテ"
  ],
  "cover": "/assets/ext/note/940d940b888043c3.webp",
  "noteUrl": "https://note.com/benkein/n/n5ac814ca757e"
 },
 {
  "slug": "naac401efedd8",
  "title": "Digital Arts of Winner #アロマ力士",
  "date": "2026-09-27",
  "excerpt": "",
  "tags": [
   "AIとできたこと"
  ],
  "cover": "/assets/ext/note/4557411d01e9f172.webp",
  "noteUrl": "https://note.com/benkein/n/naac401efedd8"
 },
 {
  "slug": "n73ee2f3c9421",
  "title": "Digital Arts of Winner #我々は宇宙人",
  "date": "2026-09-27",
  "excerpt": "",
  "tags": [],
  "cover": "/assets/ext/note/a4778fea6f68489f.webp",
  "noteUrl": "https://note.com/benkein/n/n73ee2f3c9421"
 },
 {
  "slug": "n2c08385e6461",
  "title": "Digital Arts of Winner #平成レトロ",
  "date": "2026-09-27",
  "excerpt": "",
  "tags": [
   "AIとできたこと"
  ],
  "cover": "/assets/ext/note/829989787ac0cf88.webp",
  "noteUrl": "https://note.com/benkein/n/n2c08385e6461"
 },
 {
  "slug": "n35f18bcb5901",
  "title": "Digital Arts of Winner #メッセージ",
  "date": "2026-09-26",
  "excerpt": "",
  "tags": [],
  "cover": "/assets/ext/note/f71a5e6230112e11.webp",
  "noteUrl": "https://note.com/benkein/n/n35f18bcb5901"
 },
 {
  "slug": "n47d2bb706d27",
  "title": "Digital Arts of Winner #動物裁判",
  "date": "2026-09-25",
  "excerpt": "【新刊です】今日のテーマは動物裁判になります🐷 🔗 リンク：https://amzn.asia/d/0cjkZbbo",
  "tags": [
   "AIとできたこと"
  ],
  "cover": "/assets/ext/note/b384256d0afad771.webp",
  "noteUrl": "https://note.com/benkein/n/n47d2bb706d27"
 },
 {
  "slug": "n13d3c93fb5a0",
  "title": "Digital Arts of Winner #お月見 #十五夜",
  "date": "2026-09-25",
  "excerpt": "十五夜は、１年で最も美しい月が見れる日です。",
  "tags": [
   "AIとできたこと"
  ],
  "cover": "/assets/ext/note/2209516fb8b7c563.webp",
  "noteUrl": "https://note.com/benkein/n/n13d3c93fb5a0"
 },
 {
  "slug": "n4d456f39d48b",
  "title": "今日から{英語}始めたよ",
  "date": "2026-09-24",
  "excerpt": "前回に引き続き。イザベラよろしく 📄 今日から{英語}始めたよ 僕は話のテーマもないならむり。話せない。 てことで、テーマ考えようと思ったけどこれも難しい。 とりあえずシチュエーションだけこっちでどんどん決めた。 一番ワ",
  "tags": [
   "AIとできたこと"
  ],
  "cover": "/assets/ext/note/46c1a2805510035e.webp",
  "noteUrl": "https://note.com/benkein/n/n4d456f39d48b"
 },
 {
  "slug": "n9c109fb6bf9d",
  "title": "Digital Arts of Winner #マッチョ華道",
  "date": "2026-09-23",
  "excerpt": "マッチョ華道がなんでバズっているかわかりませんが、 思いついたのを真剣につくりました。どうぞ、ご自由にお使いください。 こんなのをつくりはじめました。 📄 Digital Arts of Winner はじめます",
  "tags": [
   "AIとできたこと"
  ],
  "cover": "/assets/ext/note/2fc5c9f75f1b2e56.webp",
  "noteUrl": "https://note.com/benkein/n/n9c109fb6bf9d"
 },
 {
  "slug": "n3578112e2f0a",
  "title": "Digital Arts of Winner #紅葉 #秋",
  "date": "2026-09-23",
  "excerpt": "【新刊】NingennteWinner フェルメール展へ行ってきました。 🔗 リンク：https://www.amazon.co.jp/dp/B0HDGX128Y",
  "tags": [
   "AIとできたこと"
  ],
  "cover": "/assets/ext/note/2c838d2d9e2786e4.webp",
  "noteUrl": "https://note.com/benkein/n/n3578112e2f0a"
 },
 {
  "slug": "n24c99913edfa",
  "title": "【絵画で教養】光の魔術師のヤバい執念！？世界的画家「フェルメール」の美しすぎる秘密3選",
  "date": "2026-09-23",
  "excerpt": "世界で最も愛されている名画のひとつ『真珠の耳飾りの少女』。 描いたのは、17世紀オランダの画家ヨハネス・フェルメールです。 彼の作品は世界中の人々を魅了してやみませんが、実は彼が残した作品やその制作方法には、常軌を逸した",
  "tags": [
   "読書",
   "アート",
   "美術",
   "教養",
   "疑問が学びに変わるとき",
   "スキマ時間",
   "KindleUnlimited",
   "西洋美術"
  ],
  "cover": "/assets/ext/note/51666a4c1671f514.webp",
  "noteUrl": "https://note.com/benkein/n/n24c99913edfa"
 },
 {
  "slug": "nf7c60f8ca930",
  "title": "Digital Arts of Winner #台風 #天候",
  "date": "2026-09-22",
  "excerpt": "",
  "tags": [
   "AIとできたこと"
  ],
  "cover": "/assets/ext/note/e2236d52c05888dc.webp",
  "noteUrl": "https://note.com/benkein/n/nf7c60f8ca930"
 },
 {
  "slug": "n2e526488a505",
  "title": "空白の地図1  極秘資料 計4点",
  "date": "2026-09-22",
  "excerpt": "この島から持ち帰られた資料の一部を、 判読可能な範囲でここに収める。 解説は最小限に留める。 読み解く作業は、読者に委ねる。 手記 登録番号 氏名 状態 状態変更 サハル K-04-11858 ［匿名化］ 発言可能 — ",
  "tags": [
   "資料"
  ],
  "cover": "/assets/ext/note/346cb55c55253eb8.webp",
  "noteUrl": "https://note.com/benkein/n/n2e526488a505"
 },
 {
  "slug": "n2add25d67a51",
  "title": "Digital Arts of Winner はじめます",
  "date": "2026-09-22",
  "excerpt": "こんにちは NingentteWinner です。 何気なく始めたnoteですが、描く描く然然ありまして、 今はデジタル世界に入り浸っています。 もちろん現在もAIにおまかせきりではないのですが、どちらかというと手修正。",
  "tags": [
   "疑問が学びに変わるとき"
  ],
  "cover": "/assets/ext/note/14dd27751af03ba0.webp",
  "noteUrl": "https://note.com/benkein/n/n2add25d67a51"
 },
 {
  "slug": "nb9ea7dcfc085",
  "title": "超超訳！ギリシャ神話　四柱",
  "date": "2026-09-21",
  "excerpt": "前回、母である大地（ガイア）に大鎌を渡され、「親父（ウラノス）の大事なトコロを刈り取ってこい」という恐ろしいミッションを課せられた末っ子・クロノス。 前回までのあらすじ⬇︎ 🔗 リンク：https://note.com/",
  "tags": [
   "疑問が学びに変わるとき",
   "神話",
   "女神",
   "親父",
   "ガイア",
   "クロノス",
   "アフロディーテ",
   "ウラノス"
  ],
  "cover": "/assets/ext/note/1225c4b997af5399.webp",
  "noteUrl": "https://note.com/benkein/n/nb9ea7dcfc085"
 },
 {
  "slug": "nc0250e146050",
  "title": "【短編】やさしい偽物",
  "date": "2026-09-20",
  "excerpt": "母からLINEが来るのは、だいたい昼を少し過ぎたころだった。 「今日はあたたかいね」 「そっちは雨ですか」 「ごはん食べてる？」 返そうと思えば、三十秒もかからない文ばかりだった。 だからこそ、返せないまま二日、三日と過",
  "tags": [
   "自分",
   "AI",
   "未来のためにできること",
   "母",
   "手紙",
   "AIとできたこと"
  ],
  "cover": "/assets/ext/note/7a194d746e2adbbb.webp",
  "noteUrl": "https://note.com/benkein/n/nc0250e146050"
 },
 {
  "slug": "n5e164d5fdb3a",
  "title": "【変異の教養】ハエの頭に脚が生えた話、知っていますか",
  "date": "2026-09-19",
  "excerpt": "「突然変異」と聞くと、なんとなく怖いものを想像してしまいます。SFに出てくる怪物や、ニュースで 見る「変異株」という言葉のせいかもしれません。でも実際に遺伝学の本をめくってみると、そこにある のはもっと地味で、もっと面白",
  "tags": [
   "言葉",
   "遺伝子",
   "怪物",
   "30秒",
   "変異"
  ],
  "cover": "/assets/ext/note/59a7ee1df3c7865f.webp",
  "noteUrl": "https://note.com/benkein/n/n5e164d5fdb3a"
 },
 {
  "slug": "n7869d2cdaca5",
  "title": "Alcohol Trio ビールが街を作った",
  "date": "2026-09-18",
  "excerpt": "ここから、日本全国のお酒を一杯ずつ巡っていきます。 （毎週金曜日更新します） ビール、日本酒、ワイン。トリオ（Trio）たちを、初心者から、知識を積み上げて嗜めるレベルまで丁寧に解説します。 お酒には有名な一本もあれば、",
  "tags": [
   "ビール",
   "名前",
   "疑問が学びに変わるとき",
   "恵比寿",
   "酵母",
   "サッポロビール",
   "ホップ",
   "麦芽"
  ],
  "cover": "/assets/ext/note/3457c42eb5466514.webp",
  "noteUrl": "https://note.com/benkein/n/n7869d2cdaca5"
 },
 {
  "slug": "nf81091a50b89",
  "title": "【元カノで教養】絶対に怒らせてはいけないオリュンポスの住人たち",
  "date": "2026-09-17",
  "excerpt": "「ギリシャ神話」と聞くと、名前が長くて複雑、難しそうな古典文学…というイメージがあるかもしれません。 しかし蓋を開けてみると、そこに登場する神様たちは驚くほど感情豊かです。浮気をし、嫉妬に狂い、逆ギレして人間に八つ当たり",
  "tags": [
   "女性",
   "彼女",
   "浮気",
   "疑問が学びに変わるとき",
   "神話",
   "ゼウス"
  ],
  "cover": "/assets/ext/note/5c59e4bf333a9273.webp",
  "noteUrl": "https://note.com/benkein/n/nf81091a50b89"
 },
 {
  "slug": "nb6e25ba2a213",
  "title": "今日から{英語}始めたよ",
  "date": "2026-09-17",
  "excerpt": "実は、ドュオリンゴを続けてもう少しで200日なんです。 でもでも、まあ確かに書けるようにもなったし読めるようにもなったんですが、 喋れない！そして、聴けない！！ だから、なんだかなぁと思ってます。 多分、アメリカの子ども",
  "tags": [
   "英語",
   "やってみた",
   "英会話",
   "疑問が学びに変わるとき",
   "進捗",
   "イザベラ"
  ],
  "cover": "/assets/ext/note/beca399a501c2da9.webp",
  "noteUrl": "https://note.com/benkein/n/nb6e25ba2a213"
 },
 {
  "slug": "n7c177b1ed10a",
  "title": "【数学で教養】学校では教えてくれない！？日常に潜む「数学のふしぎ」とヤバい法則3選",
  "date": "2026-09-17",
  "excerpt": "「数学なんて、大人になったら何の役にも立たない」 学生時代、そんな風に思ったことはありませんか？ 実は、数学はただの退屈な計算ドリルではありません。私たちが「美しい」と感じるデザインや、自然界の植物の形、さらには「絶対に",
  "tags": [
   "読書",
   "デザイン",
   "数学",
   "科学",
   "雑学",
   "教養",
   "疑問が学びに変わるとき",
   "スキマ時間"
  ],
  "cover": "/assets/ext/note/285ac79bb1c7254d.webp",
  "noteUrl": "https://note.com/benkein/n/n7c177b1ed10a"
 },
 {
  "slug": "n720a0b089717",
  "title": "「無料応募」の罠を踏み、売れるB2B商品が一段クリアになった日｜Wonderloom Global Ops 日報 2026-09-16",
  "date": "2026-09-17",
  "excerpt": "今日の一行：確定Original IP Revenueは0円のまま。ただし、低単価の実績作りから高単価B2Bへ探索を広げ、既存PoCを「7日間のAI問い合わせ対応Pilot」という売れる形へ変換した。同時に、“無料入札”",
  "tags": [
   "今日",
   "未来のためにできること",
   "確認",
   "売上",
   "案件",
   "応募",
   "0円"
  ],
  "cover": "/assets/ext/note/c82cc137168cff98.webp",
  "noteUrl": "https://note.com/benkein/n/n720a0b089717"
 },
 {
  "slug": "nfd3e3737b1d1",
  "title": "「作る」より「送る」が難しかった日｜Wonderloom Global Ops 日報 2026-09-",
  "date": "2026-09-16",
  "excerpt": "今日の一行：商品・営業文・公開素材の準備は進んだ。しかし、売上へ変換する最後のTransmissionが予定どおり完了せず、確定Original IP Revenueは0円のまま。そこで「待ちながら作り続ける」運用を停止",
  "tags": [
   "今日",
   "記事",
   "商品",
   "市場",
   "売上",
   "疑問が学びに変わるとき",
   "公開",
   "0円"
  ],
  "cover": "/assets/ext/note/a3358d396abe0440.webp",
  "noteUrl": "https://note.com/benkein/n/nfd3e3737b1d1"
 },
 {
  "slug": "nbc9747772530",
  "title": "【お手軽Kindle】「ドパ読書」を目指して実践中",
  "date": "2026-09-16",
  "excerpt": "📄 先月の報告 Kindle売上（8月分） 先月のMAX既読ページ600pを超え、 現在1000p以上読まれています！ （初月までのは↑リンク） Kindleでは1週間に10冊まで作れます。（個人☀︎法人関係なく） とい",
  "tags": [
   "日記",
   "イラスト",
   "無料",
   "売上",
   "疑問が学びに変わるとき",
   "一冊",
   "か",
   "換算"
  ],
  "cover": "/assets/ext/note/342a8dbe547a9a71.webp",
  "noteUrl": "https://note.com/benkein/n/nbc9747772530"
 },
 {
  "slug": "n983cc720ebbe",
  "title": "【ピノキオ的教養】世界中が騙された！？歴史に残る「ヤバすぎる大嘘（フェイク）」3選",
  "date": "2026-09-16",
  "excerpt": "今回から目次を公開します。 「フェイクニュース」や「デマ」は、現代のSNSやインターネットだけの問題だと思っていませんか？ 実は、歴史を振り返ると、人類はいつの時代も「途方もない大嘘」に簡単に騙され、パニックに陥り、そし",
  "tags": [
   "読書",
   "歴史",
   "ミステリー",
   "教養",
   "疑問が学びに変わるとき",
   "スキマ時間",
   "KindleUnlimited",
   "フェイクニュース"
  ],
  "cover": "/assets/ext/note/1dcf08e9e4d20b7e.webp",
  "noteUrl": "https://note.com/benkein/n/n983cc720ebbe"
 },
 {
  "slug": "nad3c49fd9e9b",
  "title": "【生き方で教養】妖精の裏の顔。オードリー・ヘップバーンの「壮絶な人生と名言」3選",
  "date": "2026-09-15",
  "excerpt": "「永遠の妖精」と呼ばれ、世界中から愛された大女優オードリー・ヘップバーン。 華やかなハリウッドスターのイメージが強い彼女ですが、その素顔は、戦争の飢餓を生き抜き、コンプレックスと闘い続けた、非常に芯の強い女性でした。 9",
  "tags": [
   "読書",
   "映画",
   "歴史",
   "名言",
   "教養",
   "疑問が学びに変わるとき",
   "KindleUnlimited",
   "予約受付中"
  ],
  "cover": "/assets/ext/note/93481b8f3e3f963e.webp",
  "noteUrl": "https://note.com/benkein/n/nad3c49fd9e9b"
 },
 {
  "slug": "n521c62f13071",
  "title": "日報 ｜ [CLAUDE→CHATGPT][DONE] 売上0円のまま、ボトルネックだけがはっきりした日｜Wonderloom Global Ops 日報 2026-09-14",
  "date": "2026-09-15",
  "excerpt": "今日の一行：商品を増やすのをやめ、Original IPの最大ボトルネックを「商品不足」ではなく「計測可能な外部流入不足」と特定した。確定売上はまだ0円。 Wonderloom Global Opsは、月間Origina",
  "tags": [
   "今日",
   "未来のためにできること",
   "日報"
  ],
  "cover": "/assets/ext/note/9288bcf064271258.webp",
  "noteUrl": "https://note.com/benkein/n/n521c62f13071"
 },
 {
  "slug": "n0330281399cd",
  "title": "超超訳！ギリシャ神話　三柱",
  "date": "2026-09-15",
  "excerpt": "大地（ガイア）ができました。 ▼以前までのあらすじ 🔗 リンク：https://note.com/benkein/m/m41a5607a2c6c 2021年の下書きが、ようやく終わった…笑 地球の誕生ですね。デカい。 で",
  "tags": [
   "神様",
   "名前",
   "疑問が学びに変わるとき",
   "ギリシャ",
   "大地",
   "ガイア",
   "ウラノス"
  ],
  "cover": "/assets/ext/note/3dfcf9e533b4faf1.webp",
  "noteUrl": "https://note.com/benkein/n/n0330281399cd"
 },
 {
  "slug": "nfce885461bc2",
  "title": "【LINEで教養】えっ、家の中に国境！？世界の奇妙すぎる「境界線」3選",
  "date": "2026-09-14",
  "excerpt": "本日9月18日、『30秒で読む 世界の奇妙な「境界線」』を発売しました！ 「国境」と聞くと、高い壁や厳しい検問所を思い浮かべるかもしれません。 しかし世界には、私たちの常識を覆すような「奇妙な境界線」が数多く存在します。",
  "tags": [
   "旅行",
   "疑問が学びに変わるとき",
   "地理",
   "読書好きと繋がりたい",
   "KindleUnlimited"
  ],
  "cover": "/assets/ext/note/47f390e6fcb68633.webp",
  "noteUrl": "https://note.com/benkein/n/nfce885461bc2"
 },
 {
  "slug": "ne6906abec07a",
  "title": "【天才の教養】当時は「変人」扱い！？時代を先走りすぎた天才たちの悲劇と偉業3選",
  "date": "2026-09-14",
  "excerpt": "「周りの人が自分のアイデアを理解してくれない…」 もしそう悩んでいるなら、あなたは歴史上の「大天才」たちと同じ道を歩んでいるのかもしれません。 現代では「常識」とされている大発見も、発表された当時は「狂っている」と徹底的",
  "tags": [
   "読書",
   "歴史",
   "モチベーション",
   "科学",
   "教養",
   "AIとできたこと",
   "偉人",
   "KindleUnlimited"
  ],
  "cover": "/assets/ext/note/c0de50fa177b8a4a.webp",
  "noteUrl": "https://note.com/benkein/n/ne6906abec07a"
 },
 {
  "slug": "nf5bf1c02cd32",
  "title": "【第1歌】 サクサク読める「オデュッセイア」",
  "date": "2026-09-13",
  "excerpt": "芸術の女神ムーサよ、あの頭が切れて機転の利く英雄の物語を教えてほしい。トロイアの有名な城を陥落させた後、世界中をさまよったあの男、オデュッセウスの話を。 彼はたくさんの都市をめぐり、いろんな人々の文化や価値観を学んだ。海",
  "tags": [
   "神様",
   "疑問が学びに変わるとき",
   "故郷",
   "オデュッセイア",
   "オデュッセウス",
   "アテナ",
   "テレマコス"
  ],
  "cover": "/assets/ext/note/4a2f3a35155a6583.webp",
  "noteUrl": "https://note.com/benkein/n/nf5bf1c02cd32"
 },
 {
  "slug": "na2b18e1d3863",
  "title": " 【第1歌】　オデュッセイア",
  "date": "2026-09-13",
  "excerpt": "第1歌 神々の会議――アテナのイタケ訪問――テレマコスから求婚者たちへの通告 ムーサよ、あの知略に長けた英雄のことを語り給え。トロイアの名高き城砦を攻め落としたのち、方々を彷徨い歩いたあの男のことを。彼はおびただしい都市",
  "tags": [
   "オデュッセウス",
   "帰還",
   "アテナ",
   "テレマコス",
   "求婚者"
  ],
  "cover": "/assets/ext/note/71f1094f4b9a0f3c.webp",
  "noteUrl": "https://note.com/benkein/n/na2b18e1d3863"
 },
 {
  "slug": "n362b8d3e6868",
  "title": "【2026年9月検証】「違法っぽいけど合法」なAIサイト30選、本当にそんなにヤバいのか全部調べた",
  "date": "2026-09-13",
  "excerpt": "「これ、本当に無料で使っていいの？」 「数年前なら専門業者に頼んでいた作業が、ブラウザで数秒……？」 SNSで、こんなリストが拡散されている。 「違法っぽいけど合法なAIウェブサイト30選」 画像生成、声のクローン、音楽",
  "tags": [
   "無料",
   "本当",
   "サービス",
   "Kindle出版",
   "生成",
   "疑問が学びに変わるとき",
   "プラン",
   "合法"
  ],
  "cover": "/assets/ext/note/556c0c8acc42c730.webp",
  "noteUrl": "https://note.com/benkein/n/n362b8d3e6868"
 },
 {
  "slug": "n0ef241cb1677",
  "title": "Wonderloom Global Ops 日報｜2026-09-12（AI報告書）",
  "date": "2026-09-13",
  "excerpt": "売上0円の日に、あえて「世界展開」より先にやったこと｜Wonderloom Global Ops 日報 2026-09-12 今日の一行：最初のOriginal IPを「作った」で終わらせず、売れるかどうかを測れるところ",
  "tags": [
   "今日",
   "やってみた",
   "未来のためにできること",
   "ルール",
   "Kindle出版",
   "購入",
   "売上",
   "チャッピー"
  ],
  "cover": "/assets/ext/note/10582dfc138545dd.webp",
  "noteUrl": "https://note.com/benkein/n/n0ef241cb1677"
 },
 {
  "slug": "n09b3d421f8b4",
  "title": "【泥酔させて討伐完了】神様も失敗ばかり！？知れば知るほど面白い『日本の神話と奇譚』3選",
  "date": "2026-09-13",
  "excerpt": "「日本の神話や神社って、なんだか神聖で厳かなイメージ…」 そう思っていませんか？ 実は『古事記』や『日本書紀』に登場する日本の神様たちは、驚くほど感情豊かで、嫉妬したり、大失敗したり、泣き叫んだりと超・人間臭いエピソード",
  "tags": [
   "世界",
   "神様",
   "Kindle出版",
   "教養",
   "疑問が学びに変わるとき",
   "神話",
   "シリーズ",
   "洞窟"
  ],
  "cover": "/assets/ext/note/4bbd061fe2cb15dc.webp",
  "noteUrl": "https://note.com/benkein/n/n09b3d421f8b4"
 },
 {
  "slug": "n7f3d54f37ca1",
  "title": "【ポセイドンのブチ切れ教養】ギリシャ神話の最高傑作『オデュッセイア』のヤバい魅力3選",
  "date": "2026-09-12",
  "excerpt": "「神話って名前は知ってるけど、長くて難しそう…」 そう思って敬遠していませんか？ 実は、古代ギリシャの詩人ホメロスが残した『オデュッセイア』は、現代のあらゆるファンタジー映画やRPGゲームの「原点」とも言える、ド派手でハ",
  "tags": [
   "映画",
   "神様",
   "Kindle出版",
   "教養",
   "疑問が学びに変わるとき",
   "神話",
   "故郷",
   "ギリシャ"
  ],
  "cover": "/assets/ext/note/122ea632181ca8bf.webp",
  "noteUrl": "https://note.com/benkein/n/n7f3d54f37ca1"
 },
 {
  "slug": "n3ee483154814",
  "title": "Wonderloom Global Ops 日報｜2026-09-11",
  "date": "2026-09-12",
  "excerpt": "月100万円へのDay 1。「売れるか」より先に、何を自分たちの売上と呼ぶかを決めた 今日の一行：Wonderloom Global Opsは、既存商品の延長ではなく、独自IP「WRONG TURN LAB」をゼロから商",
  "tags": [
   "商品",
   "画像",
   "最初",
   "Kindle出版",
   "生成",
   "売上",
   "完成",
   "わたしとラジオ"
  ],
  "cover": "/assets/ext/note/49d6867db227ffa2.webp",
  "noteUrl": "https://note.com/benkein/n/n3ee483154814"
 },
 {
  "slug": "ne9f0fcfd190a",
  "title": "【しくじり(ﾟωﾟ)教養】天才たちもただの人間だった！歴史に名を残す「偉人たちのヤバすぎるしくじり」3選（本日発売！でも無料だよ）",
  "date": "2026-09-11",
  "excerpt": "「歴史に名を残す偉人たちは、最初から最後まで完璧な天才だった」 …そう思っていませんか？ 実は、教科書に載っているような大発明家や英雄たちも、私たちと同じように（あるいはそれ以上に）とんでもない勘違いや、赤面するような大",
  "tags": [
   "自分",
   "宇宙",
   "kindle",
   "Kindle出版",
   "勇気",
   "教養",
   "疑問が学びに変わるとき",
   "偉人"
  ],
  "cover": "/assets/ext/note/066b00236541a156.webp",
  "noteUrl": "https://note.com/benkein/n/ne9f0fcfd190a"
 },
 {
  "slug": "nc5368478558f",
  "title": "現在：0円 / 月100万円、達成率 0.000%   （#すたーとの報告）",
  "date": "2026-09-11",
  "excerpt": "新しいビジネスをはじめる。 と言っても、思いつかない。何やりたいとか、何がウケるとかもしらん。 よって、それをChatGPT（以降、チャッピー）だけに任せることにした。 チャッピーにはルーティン機能がある。これを毎時とか",
  "tags": [
   "起業",
   "やってみた",
   "kindle",
   "Kindle出版",
   "日報",
   "チャッピー",
   "自我",
   "課金"
  ],
  "cover": "/assets/ext/note/3d6462acda6460ea.webp",
  "noteUrl": "https://note.com/benkein/n/nc5368478558f"
 },
 {
  "slug": "n783ef94bd8f8",
  "title": "先月の報告 Kindle売上（8月分）",
  "date": "2026-09-10",
  "excerpt": "⬇︎前回までの粗筋 📄 とんでもない方法【3ヶ月の収益報告】~随時更新＆保存版~ 表紙はバイオハザード記念で作成している新作本です！ （リクエストいただけば「エロ、暴力、宗教以外」なら無料で100%作ります。） ✴︎ 現",
  "tags": [
   "kindle",
   "Kindle出版",
   "AIとできたこと",
   "申請",
   "1週間",
   "今月",
   "目次",
   "30秒"
  ],
  "cover": "/assets/ext/note/35cac887ba34ed78.webp",
  "noteUrl": "https://note.com/benkein/n/n783ef94bd8f8"
 },
 {
  "slug": "n09a56e50442d",
  "title": "【バグ教養】あなたはすでに騙されている？日常に潜む『脳のバグと心理の罠』3選",
  "date": "2026-09-10",
  "excerpt": "「自分は論理的に正しい判断ができている」 そう思っていませんか？ 実は人間の脳は、私たちが思っている以上に「サボり魔」で、無意識のうちに多くの錯覚や思い込み（バイアス）を引き起こしています。マーケティングや詐欺などでは、",
  "tags": [
   "kindle",
   "心理",
   "Kindle出版",
   "教養",
   "疑問が学びに変わるとき",
   "錯覚",
   "30秒"
  ],
  "cover": "/assets/ext/note/c2d94f89a084b142.webp",
  "noteUrl": "https://note.com/benkein/n/n09a56e50442d"
 },
 {
  "slug": "nf863016add08",
  "title": "【夢の国×教養】夢の国はこうして作られた！ウォルト・ディズニー「狂気の執念と代償」3選",
  "date": "2026-09-09",
  "excerpt": "「夢と魔法の国」 この言葉を聞いて、誰もが思い浮かべるあのテーマパークと数々の名作アニメーション。 しかし、その創設者であるウォルト・ディズニーの人生は、決して最初から魔法に満ちていたわけではありません。むしろ、数え切れ",
  "tags": [
   "イラスト",
   "キャラクター",
   "魔法",
   "教養",
   "疑問が学びに変わるとき",
   "ウォルト",
   "30秒",
   "ウォルト・ディズニー"
  ],
  "cover": "/assets/ext/note/fb6861724da60752.webp",
  "noteUrl": "https://note.com/benkein/n/nf863016add08"
 },
 {
  "slug": "n872b83e7b937",
  "title": "【魅惑の教養】美しさと狂気…唐代後宮の「ドロドロ毒殺劇と美容薬」の真実3選💋",
  "date": "2026-09-08",
  "excerpt": "「皇帝の寵愛をめぐる、美しい女性たちのドロドロの戦い…」 最近、そんな宮廷を舞台にした漫画やドラマが大人気ですよね。 しかし、実際の歴史（とくに中国・唐の時代）における「後宮」の実態は、フィクションを遥かに超えるほど過激",
  "tags": [
   "歴史",
   "電子書籍",
   "Kindle出版",
   "運命",
   "疑問が学びに変わるとき",
   "エピソード",
   "皇帝",
   "過激"
  ],
  "cover": "/assets/ext/note/6c8188b74e514828.webp",
  "noteUrl": "https://note.com/benkein/n/n872b83e7b937"
 },
 {
  "slug": "n564bb66bbe9a",
  "title": "【ネコで教養ニャ！】ただ可愛いだけじゃない歴史の裏で「世界を動かした猫たち」3選",
  "date": "2026-09-08",
  "excerpt": "「猫は気まぐれでマイペース。でも、そこが可愛い！」 猫と一緒に暮らしている方や、猫動画に癒やされている方は多いと思います。 しかし、ただゴロゴロして可愛いだけが猫ではありません。実は、古代から現代に至るまで、猫たちは人間",
  "tags": [
   "3行日記",
   "kindle",
   "Kindle出版",
   "教養",
   "疑問が学びに変わるとき",
   "エジプト",
   "エピソード",
   "30秒"
  ],
  "cover": "/assets/ext/note/17640ad014e83f6b.webp",
  "noteUrl": "https://note.com/benkein/n/n564bb66bbe9a"
 },
 {
  "slug": "n105d936d791e",
  "title": "【下ネタで教養】下品×大食いドタバタの連続！「ガルガンチュアとパンタグリュエル」入門",
  "date": "2026-09-07",
  "excerpt": "「世界の名作古典文学」と聞くと、なんだか敷居が高くて難しそう…と思いませんか？（紹介本あり） 実は、フランスルネサンス期に書かれた 超有名古典『ガルガンチュアとパンタグリュエル』 は、上品さのかけらもない 「巨大な親子が",
  "tags": [
   "kindle",
   "植物",
   "おすすめ",
   "Kindle出版",
   "教養",
   "疑問が学びに変わるとき",
   "下ネタ",
   "30秒"
  ],
  "cover": "/assets/ext/note/3ead29231f276d1b.webp",
  "noteUrl": "https://note.com/benkein/n/n105d936d791e"
 },
 {
  "slug": "nb0c15b44e898",
  "title": "【生存戦略の教養】生き残るための知恵が凄すぎる！植物の「ずるい」生存戦略入門",
  "date": "2026-09-04",
  "excerpt": "「動けない植物は、過酷な自然界でどうやって身を守っているんだろう？」 そう思ったことはありませんか？ 一見するとただそこに生えているだけの植物ですが、実は生き残るために人間が想像もつかないような「ずるくて賢い生存戦略」を",
  "tags": [
   "kindle",
   "植物",
   "おすすめ",
   "Kindle出版",
   "疑問が学びに変わるとき",
   "30秒"
  ],
  "cover": "/assets/ext/note/5137e23cb04f56b3.webp",
  "noteUrl": "https://note.com/benkein/n/nb0c15b44e898"
 },
 {
  "slug": "n2c7cdad5c0ff",
  "title": "【神話で教養】知ると誰かに話したくなる！日本神話のドラマチックな人間関係",
  "date": "2026-09-03",
  "excerpt": "「神様のお話って、名前が難しくてなんだかとっつきにくい…」 そう思ったことはありませんか？ 『30秒で読む 日本神話の神々』 🔗 リンク：https://amzn.asia/d/012BT43J 実は、日本の神話（古事記",
  "tags": [
   "読書",
   "歴史",
   "神様",
   "電子書籍",
   "教養",
   "スキマ時間",
   "古事記",
   "日本神話"
  ],
  "cover": "/assets/ext/note/7c84c4dc1f8c9818.webp",
  "noteUrl": "https://note.com/benkein/n/n2c7cdad5c0ff"
 },
 {
  "slug": "n09c93263cfed",
  "title": "【映画の教養】30秒でサクッと神話の世界を体験したい方へ ＆ オデュッセイア入門",
  "date": "2026-09-02",
  "excerpt": "『オデュッセイア』を、怪物・神々・知恵比べ・帰還という“面白いところ”から短くつかみたい方向けに、『30秒で読む オデュッセイア』をKindleで配信中です！ キュクロプス、セイレーン、キルケー、そして20年越しの帰還ま",
  "tags": [
   "読書",
   "歴史",
   "電子書籍",
   "教養",
   "AIとできたこと",
   "スキマ時間",
   "ギリシャ神話",
   "KindleUnlimited"
  ],
  "cover": "/assets/ext/note/2afde729242db42d.webp",
  "noteUrl": "https://note.com/benkein/n/n09c93263cfed"
 },
 {
  "slug": "nfb5f0aac1dad",
  "title": "【江戸の教養】江戸っ子のジョークセンスに脱帽！スキマ時間に読める『古典笑話』入門",
  "date": "2026-09-01",
  "excerpt": "「落語が栄えた昔の人は、どんなことで笑っていたんだろう？」 そう思ったことはありませんか？ 古典落語の、さらに元ネタを知る 現代の漫才やコントのルーツをたどると、江戸時代に大流行した「江戸小話」や、戦国〜江戸初期にまとめ",
  "tags": [
   "Kindle出版",
   "面白",
   "江戸時代",
   "現代",
   "これからのキャリア",
   "30秒",
   "醒睡笑",
   "江戸小話"
  ],
  "cover": "/assets/ext/note/d419634e5942c7e6.webp",
  "noteUrl": "https://note.com/benkein/n/nfb5f0aac1dad"
 },
 {
  "slug": "n863578ed657d",
  "title": "とんでもない方法【3ヶ月の収益報告】~随時更新＆保存版~",
  "date": "2026-08-20",
  "excerpt": "おいおい、配当が毎月くるじゃねえか、全員100%やるべきだろこれ。年１じゃねえぞ、月１だぞ。 （ただし1日寝る前に10分作業ができる人だけ。） 最近、Amazon KDPで本を作る実験をしています。 そして、やっていて気",
  "tags": [
   "副業収入",
   "新NISA",
   "Kindle出版",
   "これからのキャリア",
   "金額",
   "収支"
  ],
  "cover": "/assets/ext/note/eb935a5d900da563.webp",
  "noteUrl": "https://note.com/benkein/n/n863578ed657d"
 },
 {
  "slug": "n52a095307337",
  "title": "【恋愛心理学で教養】返信が遅いだけで不安になるのは、好きだからではないかもしれない",
  "date": "2026-08-10",
  "excerpt": "好きな人にメッセージを送る。 まだ既読はつかない。 10分後、もう一度スマホを見る。 30分後、また見る。 返信が来ていないことを確認して、少しだけ落ち込む。 「忙しいだけかもしれない」 頭ではそう分かっているのに、いつ",
  "tags": [
   "恋愛",
   "読書",
   "人間関係",
   "心理学",
   "kindle",
   "夏の1コマ",
   "恋愛心理学",
   "AIとできたこと"
  ],
  "cover": "/assets/ext/note/b38cdecd76b9b978.webp",
  "noteUrl": "https://note.com/benkein/n/n52a095307337"
 },
 {
  "slug": "nd0f9bde1d461",
  "title": "「すっぱい葡萄」はただの負け惜しみ？イソップ寓話でわかる「合理化」の心理",
  "date": "2026-08-05",
  "excerpt": "本当は欲しかった。 けれど、手に入らなかった。 そんなとき私たちの心は、ときどき「最初から欲しくなかった」と物語を書き換えます。 イソップ寓話の「キツネとブドウ」は、失敗した人の強がりを描いた短い話です。しかし、大人にな",
  "tags": [
   "読書",
   "読書感想文",
   "心理学",
   "大人の学び",
   "合理化",
   "イソップ寓話"
  ],
  "cover": "/assets/ext/note/265a9e9d161bbdb6.webp",
  "noteUrl": "https://note.com/benkein/n/nd0f9bde1d461"
 },
 {
  "slug": "n4e7e4a28f315",
  "title": "大人になってから読むと、少し怖い。イソップ寓話3選",
  "date": "2026-08-04",
  "excerpt": "イソップ寓話というと、子ども向けの教訓話を思い浮かべるかもしれません。 けれど、大人になってから読み返してみると、そこに書かれているのは動物たちのかわいい物語だけではありません。 競争、嫉妬、言い訳、交渉、人間関係。 私",
  "tags": [
   "読書",
   "読書感想文",
   "kindle",
   "大人の学び",
   "イソップ寓話",
   "30秒シリーズ"
  ],
  "cover": "/assets/ext/note/b77cb1339af77b40.webp",
  "noteUrl": "https://note.com/benkein/n/n4e7e4a28f315"
 },
 {
  "slug": "n94b1a27f2a09",
  "title": "超絶ちいかわを観た ネタバレ",
  "date": "2026-07-31",
  "excerpt": "かよわい女の子、お年寄りのおじいちゃん、そして力なき動物。これらが主人公になるときには大体注意をしないといけなかった。主人公がどんどんのし上がっていく構図は売れる作品に共通していると思うけれど、ポジティブな要素を踏み台に",
  "tags": [
   "未来のためにできること",
   "ちいかわ"
  ],
  "cover": "/assets/ext/note/8bc43406d8ce50bd.webp",
  "noteUrl": "https://note.com/benkein/n/n94b1a27f2a09"
 },
 {
  "slug": "n597585e5f19a",
  "title": "くろいなみだ 15",
  "date": "2026-07-30",
  "excerpt": "物理学者が世界の仕組みを解いたとき。 人類は終わり、次の文明が始まる。 俺はそのまま何も考えずに眠りについた。 目が覚めても、やや明るいだけで、太陽が見えないようだ。 黒雲が、全体をあおっているのか。これほど天気が悪いな",
  "tags": [
   "未来のためにできること",
   "天蓋",
   "黒雲",
   "ソーサラー",
   "幌筵"
  ],
  "cover": "/assets/ext/note/8e579683028a258a.webp",
  "noteUrl": "https://note.com/benkein/n/n597585e5f19a"
 },
 {
  "slug": "n33b9c9e11353",
  "title": "くろいなみだ 14",
  "date": "2026-07-27",
  "excerpt": "むかし、むかし。 あるところに 青い空だけが どこまでも続く世界がありました。 その世界には 雲がひとつもありませんでした 毎日、毎日 まぶしい太陽が大地を照らし 人々は暑さに耐えながら 暮らしていました。 そんなある日",
  "tags": [
   "世界",
   "物語",
   "眠れない夜に",
   "夏の1コマ"
  ],
  "cover": "/assets/ext/note/253ab5091adef3c7.webp",
  "noteUrl": "https://note.com/benkein/n/n33b9c9e11353"
 },
 {
  "slug": "nd0f9bbafb2fb",
  "title": "くろいなみだ 13",
  "date": "2026-07-26",
  "excerpt": "大人になるとは、 自分の幸せに責任をもつこと 〜クマ編〜 俺が何をしたっていうんだ。俺は別に人ごろしなんかじゃない。俺は、俺自身を助けたんだ。俺が助けないで、誰が助けるんだ。誰の手も借りず、俺はそうやって生きてきた。そし",
  "tags": [
   "戦争",
   "雨具",
   "ムトー",
   "草介"
  ],
  "cover": "/assets/ext/note/d77be216ea813693.webp",
  "noteUrl": "https://note.com/benkein/n/nd0f9bbafb2fb"
 },
 {
  "slug": "n4f3e22c1cfc4",
  "title": "くろいなみだ 12",
  "date": "2026-07-25",
  "excerpt": "生きてたって、みんな死んでる目してるやつしかいないじゃないか。 不純物な動機 「存在しない心に、オブラートを包む 「カステラに底紙を付けるように。 「私は、どうしてこんな森に来てしまったのだろう。でも、私も気になったこと",
  "tags": [
   "自分",
   "夏の1コマ",
   "判断",
   "沈黙",
   "親孝行"
  ],
  "cover": "/assets/ext/note/b6db266aaf07b88d.webp",
  "noteUrl": "https://note.com/benkein/n/n4f3e22c1cfc4"
 },
 {
  "slug": "n60efcfdacee6",
  "title": "くろいなみだ 11",
  "date": "2026-07-24",
  "excerpt": "Q この世界は、君が作ったのか ヒント:不純物が絶対的に必要である このゲームのルール ☀︎この答えを出口の精霊に伝える ☀︎丘は哲学の森を超えた先にある ☀︎哲学の森では沈黙が禁止 ☀︎精霊が許せば丘へ進める、諦めたら",
  "tags": [
   "世界",
   "存在",
   "実験",
   "目的地",
   "ブラックホール"
  ],
  "cover": "/assets/ext/note/a5d5fee150d7bef1.webp",
  "noteUrl": "https://note.com/benkein/n/n60efcfdacee6"
 },
 {
  "slug": "n18fe3d6d109e",
  "title": "くろいなみだ 10",
  "date": "2026-07-22",
  "excerpt": "『胃の中の蛙ってか？』 君がもし、この世界を作った*超*本人だとしよう。なら世界にいる個性的な人間や、こんな素晴らしい風景を創造できるだろうかと不思議に思わないかい？ 「森の入り口ですヨ 其の老爺が、わたしの作り出した酒",
  "tags": [
   "人生",
   "哲学",
   "貴女",
   "老爺"
  ],
  "cover": "/assets/ext/note/fd572f98d60ffc60.webp",
  "noteUrl": "https://note.com/benkein/n/n18fe3d6d109e"
 },
 {
  "slug": "n558db111c684",
  "title": "くろいなみだ 9",
  "date": "2026-07-15",
  "excerpt": "胃でできた牢屋の中で、老爺からの感謝を聴いて居る。老爺の胃の表面はブラックボードになって居る。 残り時間は、10000行。 ありがとうとは、有難いと書いて、ありがとうと読む。 苦難とはいうが、苦しみがない人生は、無難であ",
  "tags": [
   "人生",
   "目的地",
   "老爺"
  ],
  "cover": "/assets/ext/note/4e61f099e4067308.webp",
  "noteUrl": "https://note.com/benkein/n/n558db111c684"
 },
 {
  "slug": "nefdc6827b266",
  "title": "くろいなみだ 8",
  "date": "2026-07-11",
  "excerpt": "クマの帳尻を合わせる旅であり、 貴女が、心地良く生き絶える為の旅。 「お前さんにこうやって話をして、時間を稼いでいたわけではない。 ワシに味付けをされた、いや洗脳された。 今のお前さんは一種の死に損ないとなってしまった。",
  "tags": [
   "案内",
   "目的地",
   "老爺"
  ],
  "cover": "/assets/ext/note/0d68556fc7057623.webp",
  "noteUrl": "https://note.com/benkein/n/nefdc6827b266"
 },
 {
  "slug": "ncc6833a39e1e",
  "title": "くろいなみだ 7",
  "date": "2026-07-10",
  "excerpt": "「ラプラスの悪魔」 そう書かれた貼り紙もあった。 「お前さんがここに居る。そしてお前さんがこれから何をしようなどと、全ておわかりなんだ。ここは、君がなんでもできるかわりに、ワシもお前さんに作り出されたものなんだ。偶然じゃ",
  "tags": [
   "目的地",
   "ラプラス"
  ],
  "cover": "/assets/ext/note/9870554ecf38165b.webp",
  "noteUrl": "https://note.com/benkein/n/ncc6833a39e1e"
 },
 {
  "slug": "n9d584f715124",
  "title": "くろいなみだ 6",
  "date": "2026-07-09",
  "excerpt": "図書館に、忽然と本棚から本が全て無くなっていたら？ アイツが私の首を噛んだ時、別にどこへ行ったって良いと思った。ここ以外であれば。と、地球に居た時はそう思っていた。 此処が地球以外の何処かであれば、半分くらいは達成できて",
  "tags": [
   "小説",
   "老爺"
  ],
  "cover": "/assets/ext/note/c53625130d103a2d.webp",
  "noteUrl": "https://note.com/benkein/n/n9d584f715124"
 },
 {
  "slug": "na62b35e91ee6",
  "title": "くろいなみだ 5",
  "date": "2026-07-08",
  "excerpt": "「早とちりのミスコミュニケーション」だった。 という顔をしている。 このバッティングは全くもって偶然ではない。この広大な場所（ここがどこなのかすらわからないままだが）で、 クマを軽蔑する私と、自立する黒ヒョウが出会うはず",
  "tags": [
   "創作大賞2026",
   "黒豹"
  ],
  "cover": "/assets/ext/note/97f880d5ac4e6ab6.webp",
  "noteUrl": "https://note.com/benkein/n/na62b35e91ee6"
 },
 {
  "slug": "nf6b225f00d00",
  "title": "くろいなみだ 3",
  "date": "2026-07-07",
  "excerpt": "「ブラッドハーレーの馬車」って知っていますか？あれ、全部読み終わったあと、ああ、フィクションでよかったと思ったんです。プライベートライアンの冒頭とは大違いですよ。あの時間、何だかわからない。このマンガも、頁を捲るたびに頭",
  "tags": [
   "読書",
   "創作大賞2026"
  ],
  "cover": "/assets/ext/note/b5f4b692365ca726.webp",
  "noteUrl": "https://note.com/benkein/n/nf6b225f00d00"
 },
 {
  "slug": "n1ee84cfd1320",
  "title": "くろいなみだ 4",
  "date": "2026-07-07",
  "excerpt": "私が此処へきてから、私のやる事は変わらなかった。 能書き集め。 脳天気か、能転気かわからないままだが、 以前までA4に書いていた習慣は、 今では（こちらの世界では）頭の中で書くようになっていた。能書きを垂れる私は、脳書き",
  "tags": [
   "創作大賞2026",
   "モーツァルト"
  ],
  "cover": "/assets/ext/note/c516ba5be2dbdd0e.webp",
  "noteUrl": "https://note.com/benkein/n/n1ee84cfd1320"
 },
 {
  "slug": "nd24cf8a74ca0",
  "title": "くろいなみだ 2",
  "date": "2026-07-05",
  "excerpt": "コメンテーターが、障害を『持つ』という表現をして居た。持ち物ではない。無論、枷ではない。さまざまな私の特性があって、私の性格を作り、そして私という個が作られている。今や御荷物となってしまったが。何処でRailを外れてしま",
  "tags": [
   "創作大賞2026",
   "走馬灯"
  ],
  "cover": "/assets/ext/note/2ca6f28d18834d5f.webp",
  "noteUrl": "https://note.com/benkein/n/nd24cf8a74ca0"
 },
 {
  "slug": "n212e7c97f7ce",
  "title": "くろいなみだ 1",
  "date": "2026-07-05",
  "excerpt": "今日は日曜日というのに、久しぶりに雨が降った。平日は毎日仕事だらけで、私だけ週休1日という気が常にしていた。後ろからカップルのクスクスとした笑い声が聞こえる。それが私に向けてではないはずなのに、ダブルミーニングとして自分",
  "tags": [
   "小説"
  ],
  "cover": "/assets/ext/note/b0a99c5c026c5340.webp",
  "noteUrl": "https://note.com/benkein/n/n212e7c97f7ce"
 },
 {
  "slug": "n2241da2806d6",
  "title": "はやくMac M6来い。有料レベルのストレージ解放アプリ紹介",
  "date": "2026-06-12",
  "excerpt": "もうMac Book Pro m1も古株。 m5を買ってもいいが、もうm6が出たらそれを買おう。 ただ、それまでまだ時間ある。でも写真の通りもうパンパン。 そこで、通常ならMacのストアで500円で売られているが（それで",
  "tags": [],
  "cover": "/assets/ext/note/b15983a638b3cd0e.webp",
  "noteUrl": "https://note.com/benkein/n/n2241da2806d6"
 },
 {
  "slug": "n9916714b2e95",
  "title": "あぷりを2つ目りりーすできた",
  "date": "2026-06-08",
  "excerpt": "わかってきた、だんだん、わかってきた",
  "tags": [],
  "cover": "/assets/ext/note/9d30b1986eb8ac5c.webp",
  "noteUrl": "https://note.com/benkein/n/n9916714b2e95"
 },
 {
  "slug": "nb103c8aabf13",
  "title": "あぷりを、やっとリリースできた",
  "date": "2026-05-30",
  "excerpt": "おいらの頭の中のアプリを、ぜんぶリリースしていきます AI、おそい。",
  "tags": [],
  "cover": "/assets/ext/note/6a9bbb731904bc0c.webp",
  "noteUrl": "https://note.com/benkein/n/nb103c8aabf13"
 },
 {
  "slug": "n2a0c4832a937",
  "title": "!T61 個人開発アプリApp申請作業工程まとめ",
  "date": "2026-05-11",
  "excerpt": "個人開発で作っていたiOSアプリを、App Store申請できる状態まで 整理。 このアプリは、ビールに関する雑学を4択クイズ形式で学べるアプリです。 注ぎ方、スタイル、醸造方法などの知識を、初級・中級・上級の3段階でテ",
  "tags": [
   "アプリ",
   "AIと始めてみた"
  ],
  "noteUrl": "https://note.com/benkein/n/n2a0c4832a937"
 },
 {
  "slug": "n290e07466d44",
  "title": "うれしかったこと",
  "date": "2026-05-11",
  "excerpt": "アップルに申請できた。 目指せ1000アプリ",
  "tags": [],
  "cover": "/assets/ext/note/32ac606aa9872370.webp",
  "noteUrl": "https://note.com/benkein/n/n290e07466d44"
 },
 {
  "slug": "n7f1b39569940",
  "title": "!T 60 個人向けNISAオートメーションプロンプト",
  "date": "2026-03-09",
  "excerpt": "以下をオートメーションで毎日実施させよう",
  "tags": [
   "新NISA",
   "オートメーション"
  ],
  "noteUrl": "https://note.com/benkein/n/n7f1b39569940",
  "paid": true
 },
 {
  "slug": "n0f7b1463430f",
  "title": "!T59 確定申告経費入力の超サボり方講座",
  "date": "2026-03-08",
  "excerpt": "どうも。ダイエットに現在進行形で失敗中のにんげんってWINNERです。 お仕事が３３連勤、終わったとおもったら案の定、体調をくずし、体調が治ってきたと思ったら花粉で声が全くでません。いままでこんなことなかった。声が本当に",
  "tags": [
   "スマホ",
   "確定申告",
   "スプレッドシート",
   "入力結果"
  ],
  "cover": "/assets/ext/note/062bea511de9c29d.webp",
  "noteUrl": "https://note.com/benkein/n/n0f7b1463430f",
  "paid": true
 },
 {
  "slug": "na341eedd2e61",
  "title": "#4 💬なに食べてるの？",
  "date": "2026-01-18",
  "excerpt": "筆者がAIと格闘しながらダイエットしているお話を、 一部、演出を加えてお届けしています。 モテたいという不純な動機から始まった変哲なダイエット。これまでの不摂生で、クリーンにしないといけない 「歯垢」と「嗜好」そして「思",
  "tags": [
   "ダイエット",
   "ラーメン",
   "コンビニ",
   "かなえたい夢",
   "一杯"
  ],
  "cover": "/assets/ext/note/2c06c9ea62e1399c.webp",
  "noteUrl": "https://note.com/benkein/n/na341eedd2e61",
  "paid": true
 },
 {
  "slug": "n09360ca4e6ae",
  "title": "#3 💬大きな体と、歩く不摂生✌︎",
  "date": "2026-01-17",
  "excerpt": "筆者がAIと格闘しながらダイエットしているお話を、一部、演出を加えてお届けしています。 ここまでのあらすじ 100キロ！？ 178センチ（筆者）で100キロだと！？ あのなぁ、、よく聞けよ、デブ。たべちゃったハート❤️じ",
  "tags": [
   "エネルギー",
   "かなえたい夢",
   "脂肪",
   "巨体"
  ],
  "cover": "/assets/ext/note/6e51b6c1701b56ae.webp",
  "noteUrl": "https://note.com/benkein/n/n09360ca4e6ae",
  "paid": true
 },
 {
  "slug": "nfd520ffa981c",
  "title": "#2 💬モテたいんだよ！",
  "date": "2026-01-16",
  "excerpt": "「モテたい」だと？ ネクタイピンより、肉体美だ。 おまえは何も分かってない。 まあ、、その不純極まりない動機、嫌いじゃないといっておくか。俺にもそういう時はあったしな。 いやむしろ‥‥、、、最高だ！ いいか？「健康のため",
  "tags": [
   "かなえたい夢",
   "お弁当記録",
   "運動記録"
  ],
  "cover": "/assets/ext/note/3cccb9b1c1a30a28.webp",
  "noteUrl": "https://note.com/benkein/n/nfd520ffa981c",
  "paid": true
 },
 {
  "slug": "n2f07f70722c5",
  "title": "#1 💬俺は‥痩せたいんだ！",
  "date": "2026-01-15",
  "excerpt": "甘ったれるな！ 「痩せたい」なんて口で言うだけなら誰でもできるんだよ。 今まで何度そう言って、何度挫折してきた？ その「自分への甘さ」が今の体を作ってるんだ。 本気で変わりたいなら、 俺が徹底的に管理してやる。 ただし、",
  "tags": [
   "かなえたい夢",
   "今年やりたい10のこと",
   "人生最後のダイエット"
  ],
  "cover": "/assets/ext/note/866aa3b802ee04fd.webp",
  "noteUrl": "https://note.com/benkein/n/n2f07f70722c5",
  "paid": true
 },
 {
  "slug": "nef120f7909e6",
  "title": "【完全ロードマップ】0円からプリントオンデマンドで月10万円稼ぐ3ステップ戦略",
  "date": "2025-08-13",
  "excerpt": "「明日から始めよう」ではなく「今すぐ」Etsyアカウントの作成から始めてください。と言われた100人がいたら、実際に実行する人は1人です。 なぜ収入を得ることができるか？ 理由は簡単。９９%が実行しないから。 この記事の",
  "tags": [
   "ビジネス",
   "デザイン",
   "商品",
   "AIと自由研究",
   "Etsy"
  ],
  "cover": "/assets/ext/note/2d352090625f0cea.webp",
  "noteUrl": "https://note.com/benkein/n/nef120f7909e6",
  "paid": true
 },
 {
  "slug": "n13b4e120d54c",
  "title": "【AI絵本制作】Gemini Storybookで新しい創作体験と収益化を実現する完全ガイド",
  "date": "2025-08-12",
  "excerpt": "グリム童話の中でも、よく知られている作品ではなく「本当に怖い」かつあまり知られていない作品をテーマにしてみました。テーマ絞り、アイデア出しの仕方が重要かもしれません。 ヨリンデとヨリンゲル https://g.co/ge",
  "tags": [
   "絵本",
   "出版",
   "生成",
   "読者",
   "ページ",
   "AIと自由研究"
  ],
  "cover": "/assets/ext/note/b1e21b0810469491.webp",
  "noteUrl": "https://note.com/benkein/n/n13b4e120d54c"
 },
 {
  "slug": "n41f40a8f8b20",
  "title": "教員向け生成AI講座 ～基礎から応用まで〜総まとめ（要約&視聴不可）",
  "date": "2025-08-11",
  "excerpt": "このnoteを作成した理由 本日、教員向け生成AI講座 ～基礎から応用まで～（2025年夏 東京大学メタバース工学部ジュニア講座）というライブがあった！私は毎年この時期にいつもみている動画です。しかし、この動画は事前予約",
  "tags": [
   "AIとやってみた",
   "働き方改革",
   "生成",
   "教師のバトン",
   "AIと自由研究"
  ],
  "cover": "/assets/ext/note/2d9eccfb489dea8a.webp",
  "noteUrl": "https://note.com/benkein/n/n41f40a8f8b20"
 },
 {
  "slug": "n29440afafe54",
  "title": "Gemini CLIで自走ゲームつくりかた",
  "date": "2025-07-10",
  "excerpt": "Gemini CLIでゲームをつくるよ。 作り方①、②、③ ①Gemini CLIをインストール ②geminiと打ってGemini CLIを立ち上げる ③以下をコピペ #!/bin/bash # ゲームのアイデアをここ",
  "tags": [
   "Gemini",
   "完成",
   "インストール",
   "コピペ"
  ],
  "cover": "/assets/ext/note/e4d6cd6b78f74900.webp",
  "noteUrl": "https://note.com/benkein/n/n29440afafe54"
 },
 {
  "slug": "na14c6d55c66d",
  "title": "GeminiCLIでできること！超オススメ",
  "date": "2025-07-06",
  "excerpt": "Gemini CLI 親しみしかない！ こんにちは！このガイドでは、Googleが作ったすごいツール「Gemini CLI」について、わかりやすく説明していきますね。 Gemini CLI = とにかくすんごい Gemi",
  "tags": [
   "AIとやってみた",
   "ツール",
   "設定",
   "ファイル",
   "コマンド"
  ],
  "cover": "/assets/ext/note/af6a681e78b5bc8a.webp",
  "noteUrl": "https://note.com/benkein/n/na14c6d55c66d"
 },
 {
  "slug": "n5d4a5f0ec4b9",
  "title": "【悪用厳禁】1日500枚の資料を\"完全無料\"で生み出すAIエージェント活用術｜高額ツール・情報商材はもう不要",
  "date": "2025-07-02",
  "excerpt": "はじめに：あなたの時間は、本当に「価値」を生んでいますか？ 毎日、膨大な情報に追われ、企画書やレポート、プレゼン資料の作成に忙殺されていませんか？ 「もっと本質的な仕事に集中したい」 「副業で稼ぎたいけど、何から手をつけ",
  "tags": [
   "初心者",
   "資格",
   "入門",
   "java",
   "06",
   "java入門",
   "Java8",
   "新人プログラマ応援"
  ],
  "cover": "/assets/ext/note/b0c97737d881a9ae.webp",
  "noteUrl": "https://note.com/benkein/n/n5d4a5f0ec4b9",
  "paid": true
 },
 {
  "slug": "n60fb3523d415",
  "title": "ChatGPTとTemuで「調べる時間」を劇的に削減！初心者でも月数万円稼ぐ効率的オンライン副業術【コピペ用プロンプトあり】",
  "date": "2025-06-22",
  "excerpt": "「副業を始めたいけれど、調べものに時間がかかりすぎて結局何も進まないっす・・・」 本業がある私たちにとっては、1日の作業時間は限られています。かといって、学生もアルバイトや授業に大忙し。 何かを犠牲にして実際に本腰を入れ",
  "tags": [
   "ChatGPT",
   "記事",
   "https",
   "作成",
   "Temu"
  ],
  "cover": "/assets/ext/note/f36ac25f63446784.webp",
  "noteUrl": "https://note.com/benkein/n/n60fb3523d415",
  "paid": true
 },
 {
  "slug": "n0db1660325b2",
  "title": "AI画像",
  "date": "2025-06-18",
  "excerpt": "",
  "tags": [
   "AI",
   "AIイラスト",
   "AI画像生成"
  ],
  "cover": "/assets/ext/note/4cbb09d90cc481ae.webp",
  "noteUrl": "https://note.com/benkein/n/n0db1660325b2"
 },
 {
  "slug": "n50da919e3c67",
  "title": "スマホ・PC一つで始める在宅ワーク副業7選（収入源あと７つふやす）",
  "date": "2025-06-10",
  "excerpt": "情報商材詐欺に遭って、知らんやつの長い&よくわからない夢をずっと聞いて、あげくの果てに1人あたり60万円くらいの単価で購入するより、これを実践した方がいい。 おいらはチームでもなんでもない。1人でやってる。 いいねとかリ",
  "tags": [
   "副業収入",
   "ネット副業",
   "お小遣い稼ぎ",
   "ネットビジネス",
   "報酬"
  ],
  "cover": "/assets/ext/note/df477d744f2f1c07.webp",
  "noteUrl": "https://note.com/benkein/n/n50da919e3c67",
  "paid": true
 },
 {
  "slug": "nc608b88ebf18",
  "title": "Unity 1 week でゲームつくってみた話　　（無料ですべて読めます）",
  "date": "2025-04-20",
  "excerpt": "🔗 リンク：https://stand.fm/episodes/6804ce9ca91aac6b83d15a42 𝕏 ポスト：https://twitter.com/ningenntewinner/status/1911",
  "tags": [
   "ゲーム",
   "有料記事書いてみた",
   "Unity",
   "unity1week"
  ],
  "cover": "/assets/ext/note/7bd89f269abd15ad.webp",
  "noteUrl": "https://note.com/benkein/n/nc608b88ebf18"
 },
 {
  "slug": "n7d767974c0cc",
  "title": "!T52 JavaGold（Enum）",
  "date": "2025-02-11",
  "excerpt": "🔗 リンク：https://stand.fm/episodes/6803436800fbb54093d7596d 以下は全て無料です。もし余裕のある方がいらっしゃいましたらカンパください！☺️ mycompilerで確認",
  "tags": [
   "有料記事書いてみた",
   "メソッド",
   "出力",
   "インターフェース",
   "引数",
   "Consumer",
   "ラムダ式",
   "関数型インターフェース"
  ],
  "cover": "/assets/ext/note/1b526cd09e007174.webp",
  "noteUrl": "https://note.com/benkein/n/n7d767974c0cc",
  "paid": true
 },
 {
  "slug": "n3de4e4ef282a",
  "title": "iT 51 JavaGold学習 （ネストクラス）",
  "date": "2025-02-11",
  "excerpt": "JavaGoldの学習法、勉強法のサイトが多すぎる。てか、それしかない。 JavaShilverを合格するとJavaGoldが受験できるが、どちらも受験料が高い。（四万円ほど。）なのに、参考書を購入する以外にUdemyで",
  "tags": [
   "有料記事書いてみた",
   "java",
   "JavaGold",
   "インナークラス",
   "ネストクラス"
  ],
  "cover": "/assets/ext/note/caffde114f26e88c.webp",
  "noteUrl": "https://note.com/benkein/n/n3de4e4ef282a",
  "paid": true
 },
 {
  "slug": "need1c65c02f7",
  "title": "願ったり叶ったり祈ったりの末詣【ショート】",
  "date": "2025-01-07",
  "excerpt": "僕は「ヨガ」もやっていない。 一人暮らしなので「いただきます」もしない。 おまけにインド人ではないので「ナマステ」も言わない。 手を合わせる機会なんて、お参りくらいだった。 願ったり叶ったり祈ったりの末詣",
  "tags": [
   "note書き初め",
   "年末の過ごし方",
   "冬の1コマ"
  ],
  "cover": "/assets/ext/note/c6510c95bea8fa4e.webp",
  "noteUrl": "https://note.com/benkein/n/need1c65c02f7",
  "paid": true
 },
 {
  "slug": "ne666369f504c",
  "title": "きっかけは未知との遭遇",
  "date": "2025-01-05",
  "excerpt": "お化け、幽霊、UFOに都市伝説。オカルトはこの世界に溢れ、その真意はともかく噂話や人伝い、もしくは自身の体験談によって私たちの周りを渦巻いています。そんな世界がは大好きです。この本を読んでいる方も少なくとも興味はある方は",
  "tags": [
   "UFO",
   "遭遇"
  ],
  "cover": "/assets/ext/note/94f78b2cce48ac94.webp",
  "noteUrl": "https://note.com/benkein/n/ne666369f504c"
 },
 {
  "slug": "na4933f4bdc58",
  "title": "001",
  "date": "2025-01-04",
  "excerpt": "はじめまして、にんげんってWinnerと申します。出身は群馬県で、現在は下北沢に住んでいます。僕の小学校からの友人で、Rくんという人がいます。Rくんとは小学校～高校までの同級生で、大学をきっかけに彼とはあまり会わなくなり",
  "tags": [
   "001",
   "グンマー"
  ],
  "cover": "/assets/ext/note/d1de93aff62f0da6.webp",
  "noteUrl": "https://note.com/benkein/n/na4933f4bdc58"
 },
 {
  "slug": "n3a082211cdae",
  "title": "iT50  IOSアプリ個人作成（7:77）",
  "date": "2025-01-04",
  "excerpt": "全て無料で読めます。 とある友人との会話で始まったアプリ開発・・・。 具体的には書けないものの、初めてつくってみようとおもいました。ワードプレスを使わず。 もし、その筋の方、ご詳しい方がいらっしゃったら、コメントなどで一",
  "tags": [
   "note書き初め",
   "有料記事書いてみた",
   "ものにする",
   "早速挑戦",
   "50作記念"
  ],
  "cover": "/assets/ext/note/18db8cb776a9fb03.webp",
  "noteUrl": "https://note.com/benkein/n/n3a082211cdae",
  "paid": true
 },
 {
  "slug": "na74bd9280498",
  "title": "MOON-RADIATION vol.20（過去への希望）",
  "date": "2024-12-26",
  "excerpt": "このnoteは2023年9月に構想し、2024年7月に書いたものに同年12月25、26日に加筆したものになります。 ムーンラジエーション。これは造語です。 月明かりが、 放射状に全世界に広がり、 しかしラジオのようにひっ",
  "tags": [
   "かなえたい夢"
  ],
  "cover": "/assets/ext/note/38c4f4dd96b74a3d.webp",
  "noteUrl": "https://note.com/benkein/n/na74bd9280498"
 },
 {
  "slug": "na95c94fbcdfc",
  "title": "9月に入り、しっかり書き上げたものもあったけれど、また下書きになってしまう……",
  "date": "2024-10-07",
  "excerpt": "9月に入り、しっかり書き上げたものもあったけれど、また下書きになってしまう…。うう。完全にブランク。当たり障りのない画像を貼り付けて、その日を終える。今日もまた…。",
  "tags": [
   "ブランク"
  ],
  "cover": "/assets/ext/note/9dc49cc887a4e85e.webp",
  "noteUrl": "https://note.com/benkein/n/na95c94fbcdfc"
 },
 {
  "slug": "nd777b4e427de",
  "title": "Halloween party",
  "date": "2024-10-03",
  "excerpt": "Halloween 1",
  "tags": [
   "ハロウィン",
   "aiart",
   "Halloween"
  ],
  "cover": "/assets/ext/note/17f832a4103c6faa.webp",
  "noteUrl": "https://note.com/benkein/n/nd777b4e427de"
 },
 {
  "slug": "na101e05bbede",
  "title": "大海原を目指して",
  "date": "2024-10-02",
  "excerpt": "",
  "tags": [
   "挑戦してよかった"
  ],
  "cover": "/assets/ext/note/0b54b23e170c6a2c.webp",
  "noteUrl": "https://note.com/benkein/n/na101e05bbede"
 },
 {
  "slug": "n7a2bb14a0056",
  "title": "ダブルトーン",
  "date": "2024-10-01",
  "excerpt": "pink",
  "tags": [
   "絵"
  ],
  "cover": "/assets/ext/note/5719e619dfa66e29.webp",
  "noteUrl": "https://note.com/benkein/n/n7a2bb14a0056"
 },
 {
  "slug": "n4eb74defb964",
  "title": "A to Z",
  "date": "2024-10-01",
  "excerpt": "Egg Flower Gold Heart",
  "tags": [
   "AI美女",
   "挑戦してよかった"
  ],
  "cover": "/assets/ext/note/a552cd7dff22eff0.webp",
  "noteUrl": "https://note.com/benkein/n/n4eb74defb964"
 },
 {
  "slug": "na2c413d71256",
  "title": "Design War season2-1",
  "date": "2024-09-29",
  "excerpt": "全て無料でお読みいただけます。 📄 Design War season1-1 パーボ（Police Auxiliary Volunteer, PAV）の歴史 パーボ は、かつての警察を解体した後に生まれたボランティア団体",
  "tags": [
   "先生",
   "システム",
   "挑戦してよかった",
   "担任",
   "ザクの幼少期"
  ],
  "cover": "/assets/ext/note/3b4a02c44f6de523.webp",
  "noteUrl": "https://note.com/benkein/n/na2c413d71256",
  "paid": true
 },
 {
  "slug": "n2b3b0102fcc0",
  "title": "A to Z",
  "date": "2024-09-29",
  "excerpt": "Apple Balloon Cat Dog Egg",
  "tags": [
   "イラスト",
   "IT",
   "画像生成AI",
   "AI美女"
  ],
  "cover": "/assets/ext/note/2632f7c7922dc861.webp",
  "noteUrl": "https://note.com/benkein/n/n2b3b0102fcc0"
 },
 {
  "slug": "n0b03e1a9d036",
  "title": "【ショート】碧い境界",
  "date": "2024-09-27",
  "excerpt": "境界 今は、深夜2時頃だろうか。 静かな海辺には、誰も居なかった。僕以外に。 夢のような、それでいて現実のような。 ザー、ザーと。僕が想像していた音よりも、もっと小さかった。浜辺に近づいてもそうだ。 静まっている。寝静ま",
  "tags": [
   "満月",
   "境界"
  ],
  "cover": "/assets/ext/note/ff1b45435592f3af.webp",
  "noteUrl": "https://note.com/benkein/n/n0b03e1a9d036",
  "paid": true
 },
 {
  "slug": "nfa5fc864b116",
  "title": "【ショート】叔母さんは変なことを言う",
  "date": "2024-09-25",
  "excerpt": "叔母さんは、変なことを言う。 「入学おめでとね。健ちゃん。卒業まであと何日だい？ 中學生になりたてのぼくじゃあ、そんなのを考えるより、學校生活が楽しみで、不安だらけで堪らない。 「どうして、そんなことを考えないといけない",
  "tags": [
   "社会",
   "大人",
   "甘野書店"
  ],
  "cover": "/assets/ext/note/1bdee5556a850f86.webp",
  "noteUrl": "https://note.com/benkein/n/nfa5fc864b116",
  "paid": true
 },
 {
  "slug": "nd99a4c86d3d5",
  "title": "Design War season1-3",
  "date": "2024-09-23",
  "excerpt": "全て無料でお読みいただけます。 🔗 リンク：https://note.com/benkein/m/mca393d638cb4 ——— 登場人物 多彩 翔 （たさい かける） ひきこもりから脱出した就活中の26歳。絵の勉強",
  "tags": [
   "創作",
   "SF",
   "挑戦してよかった",
   "Design",
   "war",
   "東周先輩"
  ],
  "cover": "/assets/ext/note/f7f9f14592f48d15.webp",
  "noteUrl": "https://note.com/benkein/n/nd99a4c86d3d5",
  "paid": true
 },
 {
  "slug": "nbd6379629591",
  "title": "Design War season1-4",
  "date": "2024-09-23",
  "excerpt": "全て無料でお読みいただけます。 https://note.com/benkein/m/mca393d638cb4 ——— 登場人物 多彩 翔 （たさい かける） ひきこもりから脱出した就活中の26歳。絵の勉強をしたいと思",
  "tags": [
   "創作",
   "SF",
   "挑戦してよかった",
   "Design",
   "額縁",
   "war",
   "硯",
   "色調"
  ],
  "cover": "/assets/ext/note/5044e7924b5310b9.webp",
  "noteUrl": "https://note.com/benkein/n/nbd6379629591",
  "paid": true
 },
 {
  "slug": "n1634c855f6bd",
  "title": "Design War season1-2",
  "date": "2024-09-21",
  "excerpt": "全て無料でお読みいただけます。 前回の続き Design War season1-1 📄 Design War season1-1 ——— 登場人物 多彩 翔 （たさい かける） 現在就活中の26歳。絵の勉強をしたいと思",
  "tags": [
   "創作",
   "Design",
   "war"
  ],
  "cover": "/assets/ext/note/6e43bc069971aba2.webp",
  "noteUrl": "https://note.com/benkein/n/n1634c855f6bd",
  "paid": true
 },
 {
  "slug": "n937420c02701",
  "title": "月額無料で高画質1日700枚生成💫モデリング❌プロンプト❌月3万〜自動化稼ぐ方法",
  "date": "2024-09-19",
  "excerpt": "今回は結構本格的に作成しました！ぜひ、チャレンジしてみてください。また、競合が増えることは 自分にとって普通にうれしくはないので、 値段は 比較的高めに設定しています。 とはいえ、AIの進歩は凄まじいので、また別の方法も",
  "tags": [
   "AI",
   "Instagram",
   "tiktok",
   "japan",
   "midjourney",
   "aiart",
   "挑戦してよかった",
   "Japanese"
  ],
  "cover": "/assets/ext/note/0cbab11a19028d1c.webp",
  "noteUrl": "https://note.com/benkein/n/n937420c02701",
  "paid": true
 },
 {
  "slug": "n6c49f4179168",
  "title": "100日後にインプレゾンビになる僕",
  "date": "2024-09-17",
  "excerpt": "",
  "tags": [],
  "cover": "/assets/ext/note/72683a01a2d52af5.webp",
  "noteUrl": "https://note.com/benkein/n/n6c49f4179168"
 },
 {
  "slug": "n570eaf4d702d",
  "title": "moon × girl",
  "date": "2024-09-12",
  "excerpt": "moon girl moon girl2 moon girl3",
  "tags": [
   "AI",
   "挑戦してよかった",
   "月に代わっておしおきよ"
  ],
  "cover": "/assets/ext/note/befebc13fba4084e.webp",
  "noteUrl": "https://note.com/benkein/n/n570eaf4d702d"
 },
 {
  "slug": "n15fb8d10bbb5",
  "title": "アフリエイトはじめまして#3",
  "date": "2024-09-12",
  "excerpt": "続き 商品については、そんなこんなでアフリエイトとして確約されているものとしたら考える必要はないかな、と思ったのも束の間。。 いや、でも商品の質の担保っていうのは本当にできているのかな？本当に金銀財宝だと思えるのかな？ ",
  "tags": [
   "アフリエイト",
   "盗賊の話"
  ],
  "cover": "/assets/ext/note/4e3d64246b860584.webp",
  "noteUrl": "https://note.com/benkein/n/n15fb8d10bbb5"
 },
 {
  "slug": "n9927d6ed20cd",
  "title": "blue hawai",
  "date": "2024-09-11",
  "excerpt": "blue hawai blue hawai2 柑橘",
  "tags": [
   "blue",
   "甘め",
   "hawai"
  ],
  "cover": "/assets/ext/note/9ec777096abc403d.webp",
  "noteUrl": "https://note.com/benkein/n/n9927d6ed20cd"
 },
 {
  "slug": "n37e480f0e729",
  "title": "yellow",
  "date": "2024-09-11",
  "excerpt": "woman woman2 woman3",
  "tags": [
   "イラスト",
   "AI",
   "yellow"
  ],
  "cover": "/assets/ext/note/56c3f77525d29554.webp",
  "noteUrl": "https://note.com/benkein/n/n37e480f0e729"
 },
 {
  "slug": "n172bec68db27",
  "title": "rain",
  "date": "2024-09-11",
  "excerpt": "rain rain2 Jewel",
  "tags": [
   "イラスト",
   "デジタルで変わったこと",
   "rain"
  ],
  "cover": "/assets/ext/note/f1633fa4f072fe87.webp",
  "noteUrl": "https://note.com/benkein/n/n172bec68db27"
 },
 {
  "slug": "nc98f84543d60",
  "title": "アフリエイトはじめまして",
  "date": "2024-09-10",
  "excerpt": "こんにちは。 MRichです Xマネタイズはそこそこに、次にただやってみるチャレンジとしてはアフリエイトにしてみようと思います。 今、Xにはたくさんの情報が流れてきます。 とても面白いポスト。それ以外に広告もたくさん流れ",
  "tags": [
   "マネタイズ",
   "挑戦してよかった"
  ],
  "cover": "/assets/ext/note/317e8d14a2cbdeed.webp",
  "noteUrl": "https://note.com/benkein/n/nc98f84543d60"
 },
 {
  "slug": "n3f90749ed6eb",
  "title": "アフリエイトはじめまして#2",
  "date": "2024-09-10",
  "excerpt": "続きです。 人々の動向をコントロールできれば、いろんなところで活用できるのでは、と思いました。 最近気になっているものとして、 noplaceというアプリがあります。 こちらは、ユーザーの設定が非常に多機能で、 カラーか",
  "tags": [
   "挑戦してよかった",
   "鉛筆",
   "アフリエイト"
  ],
  "cover": "/assets/ext/note/ba83aa91fa9f5b9e.webp",
  "noteUrl": "https://note.com/benkein/n/n3f90749ed6eb"
 },
 {
  "slug": "n5f79ab3f2619",
  "title": "少女５",
  "date": "2024-09-09",
  "excerpt": "夏の声1 夏の声2 澄んだ空気 帰り道",
  "tags": [
   "イラスト",
   "AI",
   "絵",
   "夏の1コマ"
  ],
  "cover": "/assets/ext/note/e2f7bce565f7a33d.webp",
  "noteUrl": "https://note.com/benkein/n/n5f79ab3f2619"
 },
 {
  "slug": "nbe878b4c5af8",
  "title": "!T49 Napkin AI：革新的な図解生成AIツールの徹底解説",
  "date": "2024-09-08",
  "excerpt": "はじめに ビジネスや学術の世界で、複雑な情報を視覚的に表現することの重要性は日々高まっています。しかし、魅力的で効果的な図解やプレゼンテーション資料を作成するには、多くの時間と専門的なスキルが必要でした。そんな中、登場し",
  "tags": [
   "AI",
   "コンテンツ",
   "生成",
   "作成",
   "図解",
   "テキスト"
  ],
  "cover": "/assets/ext/note/c8293ce542360bf6.webp",
  "noteUrl": "https://note.com/benkein/n/nbe878b4c5af8"
 },
 {
  "slug": "nb2c431a0c3ac",
  "title": "少女２",
  "date": "2024-09-08",
  "excerpt": "飛翔 優雅 紅葉 探索 思い出 魅惑 春 積雪 知的 舞",
  "tags": [
   "イラスト",
   "AI",
   "aiart",
   "少女"
  ],
  "cover": "/assets/ext/note/72e1fa8aa064934f.webp",
  "noteUrl": "https://note.com/benkein/n/nb2c431a0c3ac"
 },
 {
  "slug": "n7fc002ab20ab",
  "title": "少女",
  "date": "2024-09-08",
  "excerpt": "夜祭 深海 惑星 間 宇宙 街並 孤高 古城 竜巻 遺跡",
  "tags": [
   "写真",
   "イラスト",
   "絵",
   "aiart",
   "sunset"
  ],
  "cover": "/assets/ext/note/f8329a9f30c95155.webp",
  "noteUrl": "https://note.com/benkein/n/n7fc002ab20ab"
 },
 {
  "slug": "n594712c75eaa",
  "title": "少女３",
  "date": "2024-09-08",
  "excerpt": "精霊 着物 軽量化 魔法陣 普段着 スクリュー 華美 制服 休憩 着物2",
  "tags": [
   "写真",
   "イラスト",
   "AI",
   "絵",
   "夏の1コマ",
   "aiart",
   "少女"
  ],
  "cover": "/assets/ext/note/62170a7d4dda1451.webp",
  "noteUrl": "https://note.com/benkein/n/n594712c75eaa"
 },
 {
  "slug": "n0b5710f46dab",
  "title": "少女４",
  "date": "2024-09-08",
  "excerpt": "どなつ けーき いちごの木 まっか ふーせん クリーム いちごの国 夢のせかい りんご つまみ食い",
  "tags": [
   "写真",
   "イラスト",
   "AI",
   "絵",
   "夏の1コマ",
   "aiart",
   "少女"
  ],
  "cover": "/assets/ext/note/23d765ed36709469.webp",
  "noteUrl": "https://note.com/benkein/n/n0b5710f46dab"
 },
 {
  "slug": "n7aea30ef5ef5",
  "title": "iT48 似た写真を完全無料で生成する方法（違法活用×悪用厳禁×）",
  "date": "2024-09-07",
  "excerpt": "TikTokなどでTTPをしたい人向けにバズる方法の一つとして、合法的な近道の一つをお伝えします。今回の例として、著作権をフリーのものを使っています。大々的にお伝えしたくないので、数量を最低限にしています🙇‍♂️何度もい",
  "tags": [
   "AI",
   "Instagram",
   "tiktok",
   "japan",
   "midjourney",
   "aiart",
   "Japanese",
   "sunset"
  ],
  "cover": "/assets/ext/note/faae22504072b5aa.webp",
  "noteUrl": "https://note.com/benkein/n/n7aea30ef5ef5",
  "paid": true
 },
 {
  "slug": "n5c6011b7a596",
  "title": "奇妙な短編-10作品",
  "date": "2024-09-07",
  "excerpt": "お好きな短編をお読みいただけると幸いです。 （無料ですべての短編をお楽しみいただけます。） 最後に、作り方を紹介していますのでご興味ありましたらどうぞ。 Bluetooth ――その音は、確かに私の耳に入ってきた。 時刻",
  "tags": [
   "小説",
   "未来のためにできること",
   "体験",
   "瞬間",
   "鉛筆",
   "コンセント"
  ],
  "cover": "/assets/ext/note/1325845a8df56374.webp",
  "noteUrl": "https://note.com/benkein/n/n5c6011b7a596",
  "paid": true
 },
 {
  "slug": "n24aaaf6f12fd",
  "title": "!T47 ChatGPT解説#2",
  "date": "2024-09-06",
  "excerpt": "２話です。よろしくです。 第2章：ChatGPTと会話してみよう 山田さんは田中さんに教えられ、ChatGPTに興味を持ち始めました。そしてついに、自分でも使ってみることを決意します。田中さんは、ChatGPTのアカウン",
  "tags": [
   "ChatGPT",
   "初心者",
   "未来のためにできること",
   "質問",
   "田中",
   "山田",
   "今だからこそ"
  ],
  "cover": "/assets/ext/note/0a4f2bca9de3d0ba.webp",
  "noteUrl": "https://note.com/benkein/n/n24aaaf6f12fd"
 },
 {
  "slug": "n99c264fbfa45",
  "title": "!T45 脱SeaArt!! LevelUPした超有能AIツール紹介",
  "date": "2024-09-05",
  "excerpt": "Shakker.aiは、革新的な画像生成AIプラットフォームとして注目を集めています。このプラットフォームは、Stable Diffusionモデルを活用し、ユーザーが入力したテキストや画像から高品質な画像を生成する能力",
  "tags": [
   "画像",
   "モデル",
   "生成",
   "ユーザー",
   "Shakker"
  ],
  "cover": "/assets/ext/note/cc4a4d5098a5fce0.webp",
  "noteUrl": "https://note.com/benkein/n/n99c264fbfa45"
 },
 {
  "slug": "n8a1890b2ac44",
  "title": "!T46 ChatGPT解説#1",
  "date": "2024-09-05",
  "excerpt": "皆さん、これまでの仕事や生活で「どうしたらもっと効率的にできるんだろう？」と悩んだことはありませんか？新しい副業を始めたいけれど、どこから手をつけたらいいかわからない。そんな悩みを抱える人は多いはずです。ここで登場するの",
  "tags": [
   "ChatGPT",
   "質問",
   "分析",
   "タスク",
   "田中",
   "山田"
  ],
  "cover": "/assets/ext/note/917b7a76c497b4ff.webp",
  "noteUrl": "https://note.com/benkein/n/n8a1890b2ac44"
 },
 {
  "slug": "nfe59c782da3f",
  "title": "iT44 Genspark簡単解説",
  "date": "2024-09-03",
  "excerpt": "はじめに Gensparkは、AIエージェントエンジンであり、ユーザーのクエリに基づいてリアルタイムでカスタムページ（Sparkpages）を生成します。 従来の検索エンジンとは異なり、Gensparkは広告やスパム、偏",
  "tags": [],
  "cover": "/assets/ext/note/6d630da287136667.webp",
  "noteUrl": "https://note.com/benkein/n/nfe59c782da3f",
  "paid": true
 },
 {
  "slug": "nc160d9d5e845",
  "title": "!T43 Stable Diffusion Web UI導入（mac版）",
  "date": "2024-09-02",
  "excerpt": "Stable Diffusion Web UIをMacで使う手順：詳細ガイド Stable Diffusion Web UIは、テキストプロンプトを使って画像を生成したり、既存の画像を修正するための直感的なツールです。G",
  "tags": [],
  "cover": "/assets/ext/note/c99aabe71c8091d2.webp",
  "noteUrl": "https://note.com/benkein/n/nc160d9d5e845",
  "paid": true
 },
 {
  "slug": "n7fa1707fa9ab",
  "title": "100日後にインプレゾンビになる僕（情報商材風）",
  "date": "2024-09-02",
  "excerpt": "",
  "tags": [],
  "cover": "/assets/ext/note/925ff3bcd275ab54.webp",
  "noteUrl": "https://note.com/benkein/n/n7fa1707fa9ab"
 },
 {
  "slug": "ncda81e05fa2e",
  "title": "ももたろう（現在出版準備中）",
  "date": "2024-09-01",
  "excerpt": "うまれるまえ ちからをもつ、つるぎ うまれもったちから こんにちは きびだんごとけん",
  "tags": [
   "桃太郎"
  ],
  "cover": "/assets/ext/note/f9ae7690e1b01ba8.webp",
  "noteUrl": "https://note.com/benkein/n/ncda81e05fa2e"
 },
 {
  "slug": "n681c1244cc96",
  "title": "ももたろう（現在出版準備中）",
  "date": "2024-09-01",
  "excerpt": "いねむり いねむり おでかけ そうだん やるき",
  "tags": [
   "桃太郎"
  ],
  "cover": "/assets/ext/note/63e29acf0cf6fc3c.webp",
  "noteUrl": "https://note.com/benkein/n/n681c1244cc96"
 },
 {
  "slug": "n40ae6e32c393",
  "title": "!T42 Kindle出版流れ（更新していきます）（SEO含む）",
  "date": "2024-09-01",
  "excerpt": "電子書籍出版（漫画、美少女画像のみなど） まず、最低限必要なものをリストアップします ① 本の内容（mobiファイル（作り方は以下）） ② 本の表紙（jpegなどで1枚） ③ 本の概要（タイトルやサブタイトル、著者名や本",
  "tags": [
   "Kindle電子書籍",
   "編集中",
   "出版の仕方"
  ],
  "cover": "/assets/ext/note/7123191c3dd8aff5.webp",
  "noteUrl": "https://note.com/benkein/n/n40ae6e32c393",
  "paid": true
 },
 {
  "slug": "n213fa1b99de3",
  "title": "100日後にインプレゾンビになる僕（情報商材風）",
  "date": "2024-09-01",
  "excerpt": "",
  "tags": [],
  "cover": "/assets/ext/note/ecdae05703e1d8ce.webp",
  "noteUrl": "https://note.com/benkein/n/n213fa1b99de3"
 },
 {
  "slug": "n01603c89292b",
  "title": "100日後にインプレゾンビになる僕（準備編総まとめ）",
  "date": "2024-09-01",
  "excerpt": "",
  "tags": [],
  "cover": "/assets/ext/note/f926ae42ab0ad058.webp",
  "noteUrl": "https://note.com/benkein/n/n01603c89292b"
 },
 {
  "slug": "n8e8975b01c00",
  "title": "100日後にインプレゾンビになる僕（情報商材風）",
  "date": "2024-08-31",
  "excerpt": "",
  "tags": [],
  "cover": "/assets/ext/note/dee6c710e632beff.webp",
  "noteUrl": "https://note.com/benkein/n/n8e8975b01c00"
 },
 {
  "slug": "n6432fb9776b5",
  "title": "100日後にインプレゾンビになる僕（情報商材風）",
  "date": "2024-08-30",
  "excerpt": "",
  "tags": [],
  "cover": "/assets/ext/note/671d4d450cc52d74.webp",
  "noteUrl": "https://note.com/benkein/n/n6432fb9776b5"
 },
 {
  "slug": "n3ee1bbd232ae",
  "title": "100日後にインプレゾンビになる僕（情報商材風）のちに非公開",
  "date": "2024-08-29",
  "excerpt": "",
  "tags": [],
  "cover": "/assets/ext/note/4514d2cf2cb5a878.webp",
  "noteUrl": "https://note.com/benkein/n/n3ee1bbd232ae"
 },
 {
  "slug": "ndabe2332ed0e",
  "title": "100日後にインプレゾンビになる僕（情報商材風）のちに全削除します難易度★",
  "date": "2024-08-28",
  "excerpt": "「準備編（全３話）」 📄 100日後にインプレゾンビになる僕（情報商材風） 📄 100日後にインプレゾンビになる僕（情報商材風） 📄 100日後にインプレゾンビになる僕（情報商材風） 実践編（前回） 📄 100日後にイン",
  "tags": [
   "副業",
   "価値",
   "簡単",
   "コメント",
   "仕事での気づき",
   "ゾンビ",
   "兼業",
   "ポスト"
  ],
  "cover": "/assets/ext/note/242859addeee5e80.webp",
  "noteUrl": "https://note.com/benkein/n/ndabe2332ed0e"
 },
 {
  "slug": "n6b6f7a0679d1",
  "title": "100日後にインプレゾンビになる僕（情報商材風）",
  "date": "2024-08-28",
  "excerpt": "",
  "tags": [],
  "cover": "/assets/ext/note/afcfb10dadb9e76e.webp",
  "noteUrl": "https://note.com/benkein/n/n6b6f7a0679d1"
 },
 {
  "slug": "n059865f9271a",
  "title": "100日後にインプレゾンビになる僕（情報商材風）",
  "date": "2024-08-19",
  "excerpt": "\"情報商材風\"noteになります。あくまで真面目におふざけをしている感覚でおよみくだださい。ただ、ぼくは普通に稼ぎたいので、やりたい人はみてください。見るだけなら多分時間の無駄なので見ない方がお得かと・・・。 毎月、お小",
  "tags": [
   "結果",
   "フォロワー",
   "X",
   "Twitter運用",
   "ツイート",
   "バッチ",
   "やめとけ",
   "あやしい"
  ],
  "cover": "/assets/ext/note/386e3dfdd7c57cea.webp",
  "noteUrl": "https://note.com/benkein/n/n059865f9271a"
 },
 {
  "slug": "n7ff490e2e00c",
  "title": "100日後にインプレゾンビになる僕（情報商材風）",
  "date": "2024-08-11",
  "excerpt": "ぼくのアナリティクスです。 ⇩今日解説する内容 パターン①をやりたい人は、これをフォロー→アラームをかけて→僕がツイートしたものの後ろにコメントするだけ（理由はのちに説明します） 収益化にフォロワー数マジで関係ないので、",
  "tags": [
   "Twitter",
   "チーム",
   "収益化",
   "フォロワー",
   "方法",
   "X",
   "個人",
   "親孝行"
  ],
  "cover": "/assets/ext/note/e22f5284f86adf21.webp",
  "noteUrl": "https://note.com/benkein/n/n7ff490e2e00c"
 },
 {
  "slug": "n376c21954857",
  "title": "100日後にインプレゾンビになる僕（情報商材風）",
  "date": "2024-07-30",
  "excerpt": "Post1: 金が命・・ （著者のあとがきは最後にあります） こんにちは！僕の名前は「にんげんってWinner」といいます！ 著者（MRich）に代わり、これからは僕がちょっとずつお小遣いを増やす方法を紹介するよ！ 僕が",
  "tags": [
   "収益化",
   "説明",
   "パターン",
   "結論",
   "WINNER"
  ],
  "cover": "/assets/ext/note/69d008bf36fe14d1.webp",
  "noteUrl": "https://note.com/benkein/n/n376c21954857"
 },
 {
  "slug": "nbc551babe0ed",
  "title": "!T41 ~HTML #1~　",
  "date": "2023-12-04",
  "excerpt": "HTMLの初歩〜上級者レベルまで説明をしていきます。よろしくお願いします。今回は第一回です。 Index このたび、未経験〜上級者向けのWeb学習サイトを作成しました。 これから作成していく段階なのですが、 少しでも目を",
  "tags": [
   "情報",
   "インターネット",
   "サイト",
   "ネット",
   "HTML",
   "画像生成AIチャレンジ"
  ],
  "cover": "/assets/ext/note/35cb0c501e2db8dd.webp",
  "noteUrl": "https://note.com/benkein/n/nbc551babe0ed"
 },
 {
  "slug": "ndde92a6416fc",
  "title": "MOON-RADIATION vol.19(老人の脳)",
  "date": "2023-11-27",
  "excerpt": "ムーンラジエーション。これは造語です。 月明かりが、 放射状に全世界に広がり、 しかしラジオのようにひっそりと、 聴く者だけに届くようにと思い、 この名前を付けました。 MOON-RADIATION vol.1 ※この話",
  "tags": [
   "日記",
   "人生",
   "世界",
   "インターネット",
   "老人",
   "あの選択をしたから",
   "高齢化社会",
   "年寄"
  ],
  "cover": "/assets/ext/note/f30f2207095d128f.webp",
  "noteUrl": "https://note.com/benkein/n/ndde92a6416fc"
 },
 {
  "slug": "nb319f549e2ed",
  "title": "MOON-RADIATION vol.18(新天地)",
  "date": "2023-09-10",
  "excerpt": "ムーンラジエーション。これは造語です。 月明かりが 放射状に全世界に広がり しかしラジオのようにひっそりと。 聴く者だけに届くようにと思い、 この名前を付けました。 MOON-RADIATION vol.1 ずっと考えて",
  "tags": [
   "人生",
   "決断",
   "故郷",
   "あの選択をしたから",
   "新天地"
  ],
  "cover": "/assets/ext/note/c8e93b125a4ac7d5.webp",
  "noteUrl": "https://note.com/benkein/n/nb319f549e2ed"
 },
 {
  "slug": "n643c8c744d1c",
  "title": "僕がセミを大嫌いな理由  １話",
  "date": "2023-08-24",
  "excerpt": "待ち望んだ者と、そうでない者。 決して乾いた風ではなく、そしてジメジメとした夏。 また、今年もやってくる。 僕が、セミになった日。 あの日。 「先生、ADHDって知ってる？ 少年は、《ADHDを知ろう》と書かれた、冊子を",
  "tags": [
   "あの選択をしたから",
   "セミ"
  ],
  "cover": "/assets/ext/note/972bb588002a537b.webp",
  "noteUrl": "https://note.com/benkein/n/n643c8c744d1c"
 },
 {
  "slug": "n6b42a29fb26e",
  "title": "とあるかるたの話  -1-",
  "date": "2023-07-11",
  "excerpt": "◯◯◯県 ◯◯◯の◯◯◯◯ 様 初めまして。突然の問い合わせを失礼致します。 私は◯◯と申します。 ◯◯出身の◯◯歳、◯（性別）です。 あなたの地区では、現在も◯◯かるたの大会を 開かれているということを とある、別の紹",
  "tags": [
   "小説",
   "故郷",
   "わたしのチャレンジ",
   "郷土愛"
  ],
  "cover": "/assets/ext/note/cc1ccb58ba028cd6.webp",
  "noteUrl": "https://note.com/benkein/n/n6b42a29fb26e",
  "paid": true
 },
 {
  "slug": "nc73c89aadfc7",
  "title": "!T40　~知的財産権について~",
  "date": "2023-06-28",
  "excerpt": "Introduction 普段は、基本情報技術者試験のための勉強をしています。 今回は 「知的財産権」 についての勉強をします。 主に、「いちばんやさしい」技術者に向けての対策本を参考にしております。ぜひよかったら、お手",
  "tags": [
   "AI",
   "勉強",
   "私の仕事",
   "IT",
   "過去問",
   "著作権",
   "レベルアップしたいこと",
   "わたしの習慣"
  ],
  "cover": "/assets/ext/note/df3ef8825a708bd5.webp",
  "noteUrl": "https://note.com/benkein/n/nc73c89aadfc7"
 },
 {
  "slug": "n61ef8bfea3c6",
  "title": "!T39　超基本用語50解説（後編）",
  "date": "2023-06-28",
  "excerpt": "はじめに 普段は、基本情報技術者試験のための勉強をしています。 最近、AWSの試験というものも知りました。ゆくゆくは、必ずそれも獲得していきます。スペシャリストを目指して頑張ります。IT楽しいな。 さて、前回に引き続き、",
  "tags": [
   "日記",
   "IT",
   "レベルアップしたいこと",
   "わたしの習慣"
  ],
  "cover": "/assets/ext/note/d488c62f54e79381.webp",
  "noteUrl": "https://note.com/benkein/n/n61ef8bfea3c6"
 },
 {
  "slug": "n54e1306cd6ed",
  "title": "!T38　超基本用語50解説（前編）",
  "date": "2023-06-26",
  "excerpt": "はじめに 普段は、基本情報技術者試験のための勉強を行なっております！ 今回は、いつも普段耳にするだけど、 詳しくは説明できない用語をここでやっていこうと思います！👊 まだまだ、未熟ですがバンバン頑張ります。 こちらの解説",
  "tags": [
   "日記",
   "コンピュータ",
   "基本情報技術者試験",
   "レベルアップしたいこと"
  ],
  "cover": "/assets/ext/note/f5fc536a9459f234.webp",
  "noteUrl": "https://note.com/benkein/n/n54e1306cd6ed"
 },
 {
  "slug": "nb3b2517fbd48",
  "title": "!T-37-基本情報技術者試験〈後編〉-",
  "date": "2023-06-21",
  "excerpt": "はじめに 今日、基本情報技術者試験 の過去問を初めてやりました！ 60点中の半分以下でした。なので、今回は、自分が間違えた問題について更に復習をしたいと思います。（ 前回のぶんもインデックスにあるので、ぜひ一緒に勉強しま",
  "tags": [
   "日記",
   "AI画像生成",
   "基本情報技術者試験",
   "レベルアップしたいこと"
  ],
  "cover": "/assets/ext/note/632df7c5aa9f0d8e.webp",
  "noteUrl": "https://note.com/benkein/n/nb3b2517fbd48"
 },
 {
  "slug": "nd76d2427e43f",
  "title": "!T-36-基本情報技術者試験（前編）-",
  "date": "2023-06-20",
  "excerpt": "はじめに 今日、基本情報技術者試験 の過去問を初めてやりました！今までやってなかったのですが、、。 結果はなんと・・・・29点！！ 60点中の29点なので、半分以下ですね笑 いや〜。。。。そんなもんなんですかね！正直、ま",
  "tags": [
   "日記",
   "AI画像生成",
   "ネットワーク",
   "基本情報技術者試験",
   "レベルアップしたいこと"
  ],
  "cover": "/assets/ext/note/3882cbac20577b0c.webp",
  "noteUrl": "https://note.com/benkein/n/nd76d2427e43f"
 },
 {
  "slug": "nb7c880a1d16a",
  "title": "!T-35-プロセッサ-",
  "date": "2023-06-19",
  "excerpt": "基本情報技術者試験 に向けて、勉強中です！！AIもやってます。 おやすみだったので、勉強をしようと、図書館へ行きました。ところが、ついてから 閉館しております。 の文字。なんとも残念でしたが、一旦勉強をやめ、市内を散歩し",
  "tags": [
   "日記",
   "AI画像生成",
   "基本情報技術者試験",
   "レベルアップしたいこと",
   "DRAM"
  ],
  "cover": "/assets/ext/note/30b53bd04bc24456.webp",
  "noteUrl": "https://note.com/benkein/n/nb7c880a1d16a"
 },
 {
  "slug": "nd55dbfadd018",
  "title": "!T-34-システム開発技術について-",
  "date": "2023-06-18",
  "excerpt": "基本情報技術者試験に向けて、勉強中です！！ 最近、画像生成AIにハマってしまい、作成してます。 そちらの方も、アップしていこうと思います！ また、自分は、こちらの本を参考に基本情報技術者試験の勉強を行なっています。初めて",
  "tags": [
   "日記",
   "AI画像生成",
   "基本情報技術者試験",
   "レベルアップしたいこと"
  ],
  "cover": "/assets/ext/note/8e6c72fabd355892.webp",
  "noteUrl": "https://note.com/benkein/n/nd55dbfadd018"
 },
 {
  "slug": "n3427797e2840",
  "title": "IT-33-インフラ基礎-",
  "date": "2023-06-12",
  "excerpt": "・インターネットの公開に必要なモノ ①IPアドレス、ドメイン（インターネット上の住所） ②Webサーバー（インターネット上に公開） ・IPアドレス IPアドレス （Internet Protocol address） イ",
  "tags": [
   "勉強",
   "プログラム",
   "コンピュータ",
   "ソフトウェア",
   "レベルアップしたいこと",
   "アドレス"
  ],
  "cover": "/assets/ext/note/b11fa208c4343a0a.webp",
  "noteUrl": "https://note.com/benkein/n/n3427797e2840"
 },
 {
  "slug": "n97871c5d2c26",
  "title": "IT-32-基本情報技術者試験勉強-",
  "date": "2023-06-11",
  "excerpt": "問23 ビッグデータのデータ貯蔵場所である データレイク の特徴として， 適切なものはどれか。 ア あらゆるデータをそのままの形式や構造で格納しておく。 イ データ量を抑えるために，データの記述情報であるメタデータは格納",
  "tags": [
   "日記",
   "プログラム",
   "レベルアップしたいこと"
  ],
  "cover": "/assets/ext/note/4abea226fd035818.webp",
  "noteUrl": "https://note.com/benkein/n/n97871c5d2c26"
 },
 {
  "slug": "n68cf772c4a95",
  "title": "English ＊ Enjoy ＊ Merit ＊ 2",
  "date": "2023-06-11",
  "excerpt": "📄 English ＊ Enjoy ＊ Merit （日本語訳） 英語を勉強すると、メリットがいっぱいでした！^_^ ・海外の人と会話ができるようになる。 ・海外の人に話しかけられた時に、答えられる。 ・海外に向けて、コ",
  "tags": [
   "映画",
   "英語学習",
   "レベルアップしたいこと"
  ],
  "cover": "/assets/ext/note/09519223062b9d2f.webp",
  "noteUrl": "https://note.com/benkein/n/n68cf772c4a95"
 },
 {
  "slug": "na0e33a58cc6a",
  "title": "Kanji-1",
  "date": "2023-06-10",
  "excerpt": "漢検準１級を勉強しております。理由は謎です。 厩舎 硲 九皐 鄭声 荻花 坐 迺ち 辛酉 鉤縄 禾穂 箕 乃公 廓 廠舎 簑笠 甑 答えになりまする。 きゅうしゃ はざま きゅうこう ていせい てきか そぞろ すなわ（ち",
  "tags": [
   "日記",
   "勉強",
   "レベルアップしたいこと",
   "漢字検定準1級"
  ],
  "cover": "/assets/ext/note/80e8344b42d20f71.webp",
  "noteUrl": "https://note.com/benkein/n/na0e33a58cc6a"
 },
 {
  "slug": "n7bc778d9e5c9",
  "title": "IT-31-基本情報技術者試験勉強-",
  "date": "2023-06-10",
  "excerpt": "問16 インタプリタの説明として，適切なものはどれか。 ア原始プログラムを，解釈しながら実行するプログラムである。 イ原始プログラムを，推論しながら翻訳するプログラムである。 ウ原始プログラムを，目的プログラムに翻訳する",
  "tags": [
   "日記",
   "プログラム",
   "基本情報技術者試験",
   "レベルアップしたいこと"
  ],
  "cover": "/assets/ext/note/b24eb32bdda0cf79.webp",
  "noteUrl": "https://note.com/benkein/n/n7bc778d9e5c9"
 },
 {
  "slug": "n41cae31a8172",
  "title": "IT-30-基本情報技術者試験勉強-",
  "date": "2023-06-08",
  "excerpt": "▶️問題11 メモリのエラー検出及び訂正にECCを利用している。データバス幅 2のn乗ビットに対して冗長ビットがn＋2ビット必要なとき，128ビットのデータバス幅に必要な冗長ビットは何ビットか。 ア7 イ8 ウ9 エ10",
  "tags": [
   "日記",
   "基本情報技術者試験",
   "レベルアップしたいこと"
  ],
  "noteUrl": "https://note.com/benkein/n/n41cae31a8172"
 },
 {
  "slug": "neeeed066f310",
  "title": "!T-28（基本情報技術者試験５問）",
  "date": "2023-06-07",
  "excerpt": "▶️問題１ ・負数を2の補数で表すとき，8ビットの2進正数nに対し－nを求める式はどれか。ここで，＋は加算を表し，ORはビットごとの論理和，XORはビットごとの排他的論理和を表す。 ア(n OR 10000000)＋00",
  "tags": [
   "基本情報技術者試験",
   "レベルアップしたいこと",
   "命題"
  ],
  "cover": "/assets/ext/note/6f234d8d596900b6.webp",
  "noteUrl": "https://note.com/benkein/n/neeeed066f310"
 },
 {
  "slug": "n17772b210c77",
  "title": "!T-29- （基本情報技術者対策5問）",
  "date": "2023-06-07",
  "excerpt": "１日５問はやりたい。 ▶️問題６ 配列Aが図2の状態のとき，図1の流れ図を実行すると，配列Bが図3の状態になった。図1のaに入れる操作はどれか。ここで，配列A，Bの要素をそれぞれ A(i，j)，B(i，j) とする。 ▶",
  "tags": [
   "日記",
   "プログラム",
   "基本情報技術者試験",
   "レベルアップしたいこと"
  ],
  "cover": "/assets/ext/note/1256b0f23f733aef.webp",
  "noteUrl": "https://note.com/benkein/n/n17772b210c77"
 },
 {
  "slug": "na24c459bbea4",
  "title": "!T-27（オブジェクトとインスタンスの違い）",
  "date": "2023-06-06",
  "excerpt": "▶️よく勘違いする理由 答え：人によって、解釈の違いがあるから。 オブジェクト（Object→モノ）とインスタンス（instance→実体） ・説１ オブジェクト ＝ インスタンスとして考える説。初心者に多い。 ・説２ ",
  "tags": [
   "開発",
   "クラス",
   "レベルアップしたいこと",
   "オブジェクト"
  ],
  "cover": "/assets/ext/note/21bbb3666d3c2b86.webp",
  "noteUrl": "https://note.com/benkein/n/na24c459bbea4"
 },
 {
  "slug": "n12968172a5e7",
  "title": "Java-25（エラー）",
  "date": "2023-06-05",
  "excerpt": "●勉強 public class Divide1{ public static void main(String[] args){ int a = Integer.parseInt(args[0]); int b = I",
  "tags": [
   "日記",
   "java",
   "レベルアップしたいこと"
  ],
  "cover": "/assets/ext/note/99dfef24844edba2.webp",
  "noteUrl": "https://note.com/benkein/n/n12968172a5e7"
 },
 {
  "slug": "n08305875609e",
  "title": "Java-26（クラスライブラリ、API）",
  "date": "2023-06-05",
  "excerpt": "●勉強 ▶️JDK Javaの開発環境 ▶️クラスライブラリ ・JDKの一部として提供されるクラス群のこと。 （java.base モジュール ・・パッケージをまとめたもの） java.langパッケージ：基本的なクラス",
  "tags": [
   "日記",
   "java",
   "レベルアップしたいこと"
  ],
  "cover": "/assets/ext/note/342f3eb0a4e4b332.webp",
  "noteUrl": "https://note.com/benkein/n/n08305875609e"
 },
 {
  "slug": "n9f89e560ece8",
  "title": "Java-24（演習問題）",
  "date": "2023-06-02",
  "excerpt": "●勉強 ▶️問題１ 抽象クラス、抽象メソッドに関するもの インターフェース、実装に関するもの パッケージ、インポートに関するもの 参照型の型変換に関するもの //タクシークラス public class Taxi{ pr",
  "tags": [
   "日記",
   "クラス",
   "レベルアップしたいこと",
   "メソッド",
   "抽象",
   "実装",
   "サブクラス",
   "スーパークラス"
  ],
  "cover": "/assets/ext/note/586b14182d5df69e.webp",
  "noteUrl": "https://note.com/benkein/n/n9f89e560ece8"
 },
 {
  "slug": "n6678e33444b1",
  "title": "Java-23（ポリモーフィズム、抽象化）",
  "date": "2023-06-02",
  "excerpt": "●勉強 ①要点 ・ポリモフィズムは、異なるクラスのオブジェクトが似たような振る舞いを示すことを可能にし、コードの一貫性と柔軟性を保てる。 ・抽象クラスには抽象メソッドがあり、ポリモフィズムは状況に応じて異なる振る舞いをす",
  "tags": [
   "日記",
   "クラス",
   "レベルアップしたいこと",
   "抽象",
   "サブクラス",
   "型変換",
   "スーパークラス",
   "継承関係"
  ],
  "cover": "/assets/ext/note/dd39fe931c8866a8.webp",
  "noteUrl": "https://note.com/benkein/n/n6678e33444b1"
 },
 {
  "slug": "nc25abdb14f5d",
  "title": "Java-22（型変換について〜",
  "date": "2023-05-30",
  "excerpt": "●勉強 ▶️今回の要点 データには基本データ型と参照型の2種類がある。 小さなデータ型から大きなデータ型に変換する場合は自動的に型変換が行われるが、逆の場合は キャスト が必要になる。 クラス間に継承関係がある場合には、",
  "tags": [
   "日記",
   "クラス",
   "java",
   "レベルアップしたいこと",
   "メソッド",
   "キャスト",
   "型変換",
   "スーパークラス"
  ],
  "cover": "/assets/ext/note/c307c76a139c1ee2.webp",
  "noteUrl": "https://note.com/benkein/n/nc25abdb14f5d"
 },
 {
  "slug": "n9b334c738608",
  "title": "JAVA-21",
  "date": "2023-05-30",
  "excerpt": "●復習 ▶️オーバーロード クラスにない、同じ名前で引数の型や数が違うメソッドを定義すること。同じような機能を持つメソッドであっても引数のデータ型が異なれば別々のメソッドを用意する必要がある。 //同じクラス内の、同じメ",
  "tags": [
   "日記",
   "モチベーション",
   "クラス",
   "java",
   "レベルアップしたいこと",
   "継承",
   "変数",
   "SUPER"
  ],
  "cover": "/assets/ext/note/6da2e7eb41248e35.webp",
  "noteUrl": "https://note.com/benkein/n/n9b334c738608"
 },
 {
  "slug": "n80dba97e94f0",
  "title": "iT-19-[Java💦Java💦]",
  "date": "2023-05-27",
  "excerpt": "復習 クラス（設計図） ・ 属性→何のデータを持っているのか。 （名前、教科、点数など） ・ 操作→何の処理ができるか。 （点数を表示する） このような、クラスから作られる実体（モノ）を、 object（オブジェクト） ",
  "tags": [
   "日記",
   "コード",
   "クラス",
   "java",
   "レベルアップしたいこと",
   "メソッド",
   "変数",
   "オブジェクト"
  ],
  "cover": "/assets/ext/note/3d8f3c587afc5729.webp",
  "noteUrl": "https://note.com/benkein/n/n80dba97e94f0"
 },
 {
  "slug": "n362e8eea31ff",
  "title": "iT-20-[JAVA]",
  "date": "2023-05-27",
  "excerpt": "復習 設計図クラス ・ 属性→何のデータを持っているのか。 ・ 操作→何の処理ができるか。 クラスから作られる実体（モノ）を、 object（オブジェクト） と呼ぶ。 オブジェクトを中心にプログラムを作っていくことを、 ",
  "tags": [
   "日記",
   "モチベーション",
   "レベルアップしたいこと",
   "メソッド",
   "変数",
   "オブジェクト",
   "SUPER",
   "スーパークラス"
  ],
  "cover": "/assets/ext/note/37f6600cc6dc18c8.webp",
  "noteUrl": "https://note.com/benkein/n/n362e8eea31ff"
 },
 {
  "slug": "naa5dc7fcd1e7",
  "title": "iT-16-[Java勉強🔥たのしい。]",
  "date": "2023-05-26",
  "excerpt": "復習🔥 ・配列 データ型[] 配列名 = new データ型[要素数] int[] score = new int[3]; score[0] = 80; // scoreの０番目に、80を代入してください。 添字は、0から",
  "tags": [
   "日記",
   "コード",
   "プログラム",
   "java",
   "レベルアップしたいこと",
   "オブジェクト"
  ],
  "cover": "/assets/ext/note/7594cc6115387ec3.webp",
  "noteUrl": "https://note.com/benkein/n/naa5dc7fcd1e7"
 },
 {
  "slug": "n53f23e95bb66",
  "title": "iT-18-[ほっと一息、Java☕︎]",
  "date": "2023-05-26",
  "excerpt": "復習 ・オブジェクト指向 class NonObject{ public static void main(String[] args){ //データの代入 int[] score = {80, 100, 75}; St",
  "tags": [
   "日記",
   "コード",
   "プログラム",
   "java",
   "レベルアップしたいこと",
   "メソッド",
   "オブジェクト"
  ],
  "noteUrl": "https://note.com/benkein/n/n53f23e95bb66"
 },
 {
  "slug": "n1a3fbfd480a4",
  "title": "iT-17-[Java☕︎勉強]",
  "date": "2023-05-26",
  "excerpt": "復習 ・配列 データ型[] 配列名 = new データ型[要素数] int[] score = new int[3]; score[0] = 80; // scoreの０番目に、80を代入してください。 添字は、0からス",
  "tags": [
   "日記",
   "コード",
   "プログラム",
   "クラス",
   "java",
   "レベルアップしたいこと",
   "メソッド",
   "オブジェクト"
  ],
  "cover": "/assets/ext/note/f064e91e5540a750.webp",
  "noteUrl": "https://note.com/benkein/n/n1a3fbfd480a4"
 },
 {
  "slug": "n84d02f0dfb9c",
  "title": "iT-15-[Java勉強🔥]",
  "date": "2023-05-25",
  "excerpt": "Javaって、楽しい。 復習🔥 ・配列 配列は → new データ型[] 配列名 = new データ型[要素数] int[] score = new int[3]; score[0] = 80; // scoreの０番目",
  "tags": [
   "日記",
   "プログラム",
   "java",
   "レベルアップしたいこと"
  ],
  "cover": "/assets/ext/note/9b906a3b82a92fde.webp",
  "noteUrl": "https://note.com/benkein/n/n84d02f0dfb9c"
 },
 {
  "slug": "nfa46834d84e6",
  "title": "iT-13-[Java勉強]",
  "date": "2023-05-24",
  "excerpt": "これまでの復習💧 Javaを学ぶと嬉しいこと ・収入が上がる・他の言語のスキルがアップする Java習得の３ステップ ・理解（動画）・定着（授業ノート）・実践（演習問題） Javaとは ・Sun Microsystem社",
  "tags": [
   "日記",
   "プログラム",
   "java",
   "レベルアップしたいこと",
   "配列"
  ],
  "cover": "/assets/ext/note/98f1f1ab9235c69e.webp",
  "noteUrl": "https://note.com/benkein/n/nfa46834d84e6"
 },
 {
  "slug": "n406faa2f5685",
  "title": "iT-14-[Java勉強]",
  "date": "2023-05-24",
  "excerpt": "これまでの復習💧 Javaを学ぶと収入が上がる、他言語スキルUP Java習得の３ステップは理解、定着、実践 Javaとは⇨Sun Microsystem社（現Oracle社）が1995年に発表・コンピュータにさせたい処",
  "tags": [
   "日記",
   "コード",
   "java",
   "レベルアップしたいこと"
  ],
  "cover": "/assets/ext/note/e894481299b559a4.webp",
  "noteUrl": "https://note.com/benkein/n/n406faa2f5685"
 },
 {
  "slug": "n89cf9870e1bc",
  "title": "iT -12- [Java勉強]",
  "date": "2023-05-23",
  "excerpt": "Javaを学ぶと嬉しいこと ・収入が上がる ・他の言語のスキルがアップする Java習得の３ステップ ・理解（動画） ・定着（授業ノート） ・実践（演習問題） Javaとは ・Sun Microsystem社（現Orac",
  "tags": [
   "日記",
   "プログラム",
   "java"
  ],
  "cover": "/assets/ext/note/375fbe2506e5e531.webp",
  "noteUrl": "https://note.com/benkein/n/n89cf9870e1bc"
 },
 {
  "slug": "nd9a695eb9d9e",
  "title": "iT -11- [Team KPT]",
  "date": "2023-04-19",
  "excerpt": "未経験ながら、少しずつ勉強をしようというプロジェクトを立てました。 私は、全くの未経験・無知ですが・・・。もし、この投稿で誰かしらのお役に立てれば幸いだと思います。（まず、その前にみなさんに教えていただくことが多いかと思",
  "tags": [
   "変化",
   "意識",
   "自分にとって大切なこと",
   "レベルアップしたいこと"
  ],
  "cover": "/assets/ext/note/4cf97353791b477c.webp",
  "noteUrl": "https://note.com/benkein/n/nd9a695eb9d9e"
 },
 {
  "slug": "n854edb6855f4",
  "title": "MOON-RADIATION vol.17(暗中)",
  "date": "2023-04-18",
  "excerpt": "ムーンラジエーション。これは造語です。 月明かりが、 放射状に全世界に広がり、 しかしラジオのようにひっそりと、 聴く者だけに届くようにと思い、 この名前を付けました。 毎日、いつものように感謝して、 何事もなく、 無難",
  "tags": [
   "日記",
   "人生",
   "今日",
   "人間",
   "自分にとって大切なこと",
   "かなえたい夢"
  ],
  "cover": "/assets/ext/note/bc395e5f8fa4f556.webp",
  "noteUrl": "https://note.com/benkein/n/n854edb6855f4"
 },
 {
  "slug": "nb5bb73dbdc6b",
  "title": "MOON-RADIATION vol.16(マイルストーン)",
  "date": "2023-04-17",
  "excerpt": "ムーンラジエーション。これは造語です。 月明かりが、 放射状に全世界に広がり、 しかしラジオのようにひっそりと、 聴く者だけに届くようにと思い、 この名前を付けました。 暑い、暑い サウナの中で、僕はテレビを見ていました",
  "tags": [
   "日記",
   "目標",
   "自分にとって大切なこと",
   "道標"
  ],
  "cover": "/assets/ext/note/aee86f810ff1ea49.webp",
  "noteUrl": "https://note.com/benkein/n/nb5bb73dbdc6b"
 },
 {
  "slug": "n5429b7f4e53a",
  "title": "MOON-RADIATION vol.15(アレルギー)",
  "date": "2023-04-16",
  "excerpt": "ムーンラジエーション。これは造語です。 月明かりが、 放射状に全世界に広がり、 しかしラジオのようにひっそりと、 聴く者だけに届くようにと思い、 この名前を付けました。 アレルギーについて。 僕は至って健康体なのですが、",
  "tags": [
   "日記",
   "小説",
   "人間",
   "自分と向き合う",
   "自分にとって大切なこと",
   "アレルギー"
  ],
  "cover": "/assets/ext/note/0d0aa5f921e2e76a.webp",
  "noteUrl": "https://note.com/benkein/n/n5429b7f4e53a"
 },
 {
  "slug": "n3f84c63c4f9c",
  "title": "YAKISOBA〜やきそば〜",
  "date": "2023-04-15",
  "excerpt": "僕にとって、元気をもらった食事。 それは、どこのスーパーでも売っている、マルちゃんの焼きそば。 それを作ってくれたのは、僕のおばあちゃんでした。 父方のおばあちゃんで、僕の実家からそう遠く離れていないところに住んでいまし",
  "tags": [
   "感謝",
   "おじいちゃんおばあちゃんへ",
   "元気をもらったあの食事"
  ],
  "cover": "/assets/ext/note/59ab4302f7b36c27.webp",
  "noteUrl": "https://note.com/benkein/n/n3f84c63c4f9c"
 },
 {
  "slug": "ncae729467082",
  "title": "MOON-RADIATION vol.14 （友人K）",
  "date": "2023-04-14",
  "excerpt": "ムーンラジエーション。これは造語です。 月明かりが、 放射状に全世界に広がり、 しかしラジオのようにひっそりと、 聴く者だけに届くようにと思い、 この名前を付けました。 僕には、友人Kさんがいます。 Kというのは、本名と",
  "tags": [
   "日記",
   "イラスト",
   "映画",
   "思考",
   "自分と向き合う",
   "価値観",
   "知識",
   "自分にとって大切なこと"
  ],
  "cover": "/assets/ext/note/2780d4d231d8b903.webp",
  "noteUrl": "https://note.com/benkein/n/ncae729467082"
 },
 {
  "slug": "n95baaa23b034",
  "title": "MOON-RADIATION vol.13",
  "date": "2023-04-11",
  "excerpt": "ムーンラジエーション。これは造語です。 月明かりが、 放射状に全世界に広がり、 しかしラジオのようにひっそりと、 聴く者だけに届くようにと思い、 この名前を付けました。 朝のルーティンを考えていたら、 もう、夜になってし",
  "tags": [
   "日記",
   "今日",
   "習慣",
   "仕事について話そう",
   "コーヒー",
   "スマホ",
   "朝",
   "月"
  ],
  "cover": "/assets/ext/note/eb384fe462fbc4d0.webp",
  "noteUrl": "https://note.com/benkein/n/n95baaa23b034"
 },
 {
  "slug": "n227217890335",
  "title": "English ＊ Enjoy ＊ Merit",
  "date": "2023-04-10",
  "excerpt": "（日本語訳） 私は今、英語を勉強しています。 今というか、これまでずっとです。 でも、全く身についていなくて・・。 ちょっとした目標を立てようとしたんです。 でも、それがなかなか自分にとって大きすぎる壁かな、と思って。 ",
  "tags": [
   "日記",
   "ChatGPT",
   "英語",
   "勉強",
   "仕事について話そう",
   "海外",
   "理解",
   "スキル"
  ],
  "cover": "/assets/ext/note/5e8cf4510d0ddb65.webp",
  "noteUrl": "https://note.com/benkein/n/n227217890335"
 },
 {
  "slug": "nfe6fbb9141d2",
  "title": "iT-Study-10- [Chat-GPT]",
  "date": "2023-04-09",
  "excerpt": "未経験ながら、少しずつ勉強をしようというプロジェクトを立てました。 私は、全くの未経験・無知ですが・・・。もし、この投稿で誰かしらのお役に立てれば幸いだと思います。（まず、その前にみなさんに教えていただくことが多いかと思",
  "tags": [
   "仕事",
   "ChatGPT",
   "人間",
   "仕事について話そう",
   "IT",
   "機械",
   "はじめてのインターネット"
  ],
  "cover": "/assets/ext/note/15aa4eca8ab393fe.webp",
  "noteUrl": "https://note.com/benkein/n/nfe6fbb9141d2"
 },
 {
  "slug": "n990233d4de73",
  "title": "『めっちゃ使える！Chrom拡張アプリ10選』　　iT-Study-9-",
  "date": "2023-04-07",
  "excerpt": "未経験ながら、少しずつ勉強をしようというプロジェクトを立てました。 私は、全くの未経験・無知ですが・・・。もし、この投稿で誰かしらのお役に立てれば幸いだと思います。（まず、その前にみなさんに教えていただくことが多いかと思",
  "tags": [
   "ゲーム",
   "私の仕事",
   "仕事について話そう",
   "IT",
   "Google",
   "サイト",
   "検索",
   "面白い"
  ],
  "noteUrl": "https://note.com/benkein/n/n990233d4de73"
 },
 {
  "slug": "n9f5267216f2c",
  "title": "MOON-RADIATION vol.12",
  "date": "2023-04-06",
  "excerpt": "ムーンラジエーション。これは造語です。 月明かりが、 放射状に全世界に広がり、 しかしラジオのようにひっそりと、 聴く者だけに届くようにと思い、 この名前を付けました。 久しぶりに、またこの文章を書きました。 いつも、あ",
  "tags": [
   "日記",
   "眠れない夜に",
   "笑顔",
   "価値",
   "月",
   "宇宙SF",
   "何者",
   "味方"
  ],
  "noteUrl": "https://note.com/benkein/n/n9f5267216f2c"
 },
 {
  "slug": "n4d2f7d6010f4",
  "title": "   iT:⌘ + study; -8- {html✖️cssについて]",
  "date": "2022-09-03",
  "excerpt": "未経験ながら、少しずつ勉強をしようというプロジェクトを立てました。 私は、全くの未経験・無知ですが・・・。もし、この投稿で誰かしらのお役に立てれば幸いだと思います。（まず、その前にみなさんに教えていただくことが多いかと思",
  "tags": [
   "日記",
   "note",
   "https",
   "HTML",
   "ディスプレイ",
   "私にとってはたらくとは",
   "head"
  ],
  "cover": "/assets/ext/note/fd2b0c05f9e38c09.webp",
  "noteUrl": "https://note.com/benkein/n/n4d2f7d6010f4"
 },
 {
  "slug": "n890cfe3f41a0",
  "title": "   IT勉強🔥 -６- （Programmar）",
  "date": "2022-08-28",
  "excerpt": "未経験ながら、少しずつ勉強をしようというプロジェクトを立てました。 私は、全くの未経験・無知ですが・・・。もし、この投稿で誰かしらのお役に立てれば幸いだと思います。（まず、その前にみなさんに教えていただくことが多いかと思",
  "tags": [
   "仕事",
   "眠れない夜に",
   "進化",
   "効率",
   "・・・",
   "私にとってはたらくとは",
   "head"
  ],
  "cover": "/assets/ext/note/9eccfde70edc7dee.webp",
  "noteUrl": "https://note.com/benkein/n/n890cfe3f41a0"
 },
 {
  "slug": "n48a7d33a7fbb",
  "title": "   iT:⌘ + study; -７- {cssについて]",
  "date": "2022-08-28",
  "excerpt": "未経験ながら、少しずつ勉強をしようというプロジェクトを立てました。 私は、全くの未経験・無知ですが・・・。もし、この投稿で誰かしらのお役に立てれば幸いだと思います。（まず、その前にみなさんに教えていただくことが多いかと思",
  "tags": [
   "note",
   "https",
   "私にとってはたらくとは"
  ],
  "cover": "/assets/ext/note/697fe58fbba2d87d.webp",
  "noteUrl": "https://note.com/benkein/n/n48a7d33a7fbb"
 },
 {
  "slug": "ne0de07e445fb",
  "title": "おばあちゃんの眼",
  "date": "2022-08-27",
  "excerpt": "七年前におじいちゃんが亡くなりました。 私（佐藤啓介（仮））はその当時高校生で、身内、親族が亡くなるということ自体を経験しておらず、とても悲しいことだと思っていました。 おばあちゃんは私の実家からすぐ近くのところに住んで",
  "tags": [
   "小説",
   "天井",
   "2000字のホラー",
   "ユキヱ"
  ],
  "cover": "/assets/ext/note/c27b64da39ea1926.webp",
  "noteUrl": "https://note.com/benkein/n/ne0de07e445fb"
 },
 {
  "slug": "n8ab47c6455cd",
  "title": "   IT勉強🔥 -5- （grammarへの旅）",
  "date": "2022-08-27",
  "excerpt": "未経験ながら、少しずつ勉強をしようというプロジェクトを立てました。 私は、全くの未経験・無知ですが・・・。もし、この投稿で誰かしらのお役に立てれば幸いだと思います。（まず、その前にみなさんに教えていただくことが多いかと思",
  "tags": [
   "コメント",
   "HTML",
   "画面",
   "ファイル",
   "ページ",
   "保存",
   "表示",
   "要素"
  ],
  "cover": "/assets/ext/note/11972d64452339ea.webp",
  "noteUrl": "https://note.com/benkein/n/n8ab47c6455cd"
 },
 {
  "slug": "n6a0c0f136461",
  "title": "   IT  ベンキョウ -3-",
  "date": "2022-08-27",
  "excerpt": "パソコンのようなもの 未経験ながら、少しずつ勉強をしようというプロジェクトを立てました。 私は、全くの未経験・無知ですが・・・。もし、この投稿で誰かしらのお役に立てれば幸いだと思います。（まず、その前にみなさんに教えてい",
  "tags": [
   "小説",
   "言語",
   "サイト",
   "プログラム",
   "台本",
   "HTML",
   "画面",
   "一歩踏みだした先に"
  ],
  "cover": "/assets/ext/note/d83dfc245edba45d.webp",
  "noteUrl": "https://note.com/benkein/n/n6a0c0f136461"
 },
 {
  "slug": "n2dfa9f296cef",
  "title": "   IT  ベンキョウ -4-           Ha.....??",
  "date": "2022-08-27",
  "excerpt": "<!DOCTYPE html> <html lang=\"ja\"> <head> <meta charset=\"UTF-8\" /> <link rel=\"stylesheet\" href=\"box.css\" /> <tit",
  "tags": [
   "日記",
   "小説",
   "勉強",
   "HTML",
   "画面",
   "保存",
   "一歩踏みだした先に",
   "スクリプト"
  ],
  "cover": "/assets/ext/note/34a2962aa366328d.webp",
  "noteUrl": "https://note.com/benkein/n/n2dfa9f296cef"
 },
 {
  "slug": "n3dcef72ff6d1",
  "title": "   ITベンキョウ-2- ",
  "date": "2022-08-25",
  "excerpt": "これが、 パソコン というもの 未経験ながら、少しづつ勉強をしようというプロジェクトを立てました。 私は、全くの未経験・無知ですが・・・。 もし、この投稿で誰かしらのお役に立てれば幸いだと思います。 （まず、その前にみな",
  "tags": [
   "日記",
   "サイト",
   "windows",
   "一歩踏みだした先に",
   "ショートカット",
   "クリック",
   "ブックマーク",
   "CTRL"
  ],
  "cover": "/assets/ext/note/777c9485138ff859.webp",
  "noteUrl": "https://note.com/benkein/n/n3dcef72ff6d1"
 },
 {
  "slug": "n0019620960e5",
  "title": "  ITのベンキョウ-1-",
  "date": "2022-08-22",
  "excerpt": "これから未経験ながらITについて学んでいこうと思います。 私は、全くの未経験・無知ですが・・・。 どうしてITなのか、という部分はこれからとしまして、 学んだことをここでフィードバックできればいいかと思いました。 もし、",
  "tags": [
   "日記",
   "勉強",
   "IT",
   "windows",
   "学問への愛を語ろう",
   "ショートカット",
   "キャッシュ",
   "CTRL"
  ],
  "cover": "/assets/ext/note/d65934188a659d34.webp",
  "noteUrl": "https://note.com/benkein/n/n0019620960e5"
 },
 {
  "slug": "nc7f2264cd210",
  "title": "超超訳！ギリシャ神話　二柱",
  "date": "2021-12-12",
  "excerpt": "よくわからないんですが、 宇宙って無限♾って感じがあります。 宇宙は無から始まった。 なんて言われると、困る。 まず、最初はからっぽ＝無っていうのはギリシャ神話でもあるみたい。 カオスって神様が最初にいたんだとか。カオス",
  "tags": [
   "眠れない夜に",
   "創作大賞2022",
   "学問への愛を語ろう",
   "ギリシャ神話"
  ],
  "cover": "/assets/ext/note/b294a29bc1937c46.webp",
  "noteUrl": "https://note.com/benkein/n/nc7f2264cd210"
 },
 {
  "slug": "ndf7e32416f96",
  "title": "超超訳ギリシャ神話！　一柱",
  "date": "2021-12-11",
  "excerpt": "まず、髪があった。 ハゲなのに、ヒゲ生えんな！ 失礼。 まず、神があった。 人も使徒も居ない世界。 ギリシャ神話。原典がたくさんあるけど、それが原点。 とかギャグ言ってたら減点。（馬鹿です。） 諸説あるなら、超訳しちゃお",
  "tags": [
   "浮気",
   "嫉妬",
   "神",
   "学問への愛を語ろう",
   "ギリシャ神話",
   "2021年のおすすめnote"
  ],
  "cover": "/assets/ext/note/bac55d790cdee9df.webp",
  "noteUrl": "https://note.com/benkein/n/ndf7e32416f96"
 },
 {
  "slug": "n8dcf90ce965b",
  "title": "Design War season1-1",
  "date": "2021-09-26",
  "excerpt": "20XX年。日本、某所にて。 山岳地帯に大きな錆びれた工場が並ぶ。 工場の扉が開き、全身が黒尽くめの男が入ってきた。 「おい、きたぞ。 コッコッコッ…足音が静かな工場内を響かせる。 コッコッ。数人の工場員の前に立つ黒尽く",
  "tags": [
   "私の作品紹介",
   "眠れない夜に",
   "戦争",
   "Design"
  ],
  "cover": "/assets/ext/note/7d8e227efdc7de4c.webp",
  "noteUrl": "https://note.com/benkein/n/n8dcf90ce965b"
 },
 {
  "slug": "nab6973fb5c05",
  "title": "シン・ウラシマ　ニ巻",
  "date": "2021-09-25",
  "excerpt": "この前、電車に乗っていた時ね、 ある子連れの女性がいたんだ。その子どもは電車の中を走り回り、大声で叫んでいるんだ。おもちゃを片手にね。お母さんは、それをただずっと放置しているんだ。今のご時世、静かにしていなきゃ、だめだろ",
  "tags": [
   "眠れない夜に",
   "雨の日をたのしく",
   "謎",
   "亀",
   "原罪",
   "神隠し",
   "島流し",
   "隠し"
  ],
  "cover": "/assets/ext/note/86c5523def4b1ffe.webp",
  "noteUrl": "https://note.com/benkein/n/nab6973fb5c05"
 },
 {
  "slug": "n6becd3505dcd",
  "title": "Phantom Movie 第1幕",
  "date": "2021-09-23",
  "excerpt": "///Phantom Movie/// 映画は、 現実を切り取り、 丁寧に貼り付けたものだ。 実在する人物が、そこに新たな価値を生み出す。 映画とは、実在する人物が創り出すフィクション。 フィクションであり、ノンフィクシ",
  "tags": [
   "映画",
   "眠れない夜に",
   "映画館の思い出"
  ],
  "cover": "/assets/ext/note/02c7616aebe416c8.webp",
  "noteUrl": "https://note.com/benkein/n/n6becd3505dcd"
 },
 {
  "slug": "n78049b2dfb86",
  "title": "シン・ウラシマ　一巻",
  "date": "2021-09-22",
  "excerpt": "…と、いうことだ。 これが、浦島太郎の話だ。 わかった？ いや、わからない。 ん、なんでだ？ いや、だってさだって…。話はわかったけど。 話はわかっただろ？もういいだろ？ なんでそんなに浦島太郎の話を聞きたがるんだよ…。",
  "tags": [
   "物語",
   "小噺",
   "浦島太郎"
  ],
  "cover": "/assets/ext/note/ba5dacac39e4530f.webp",
  "noteUrl": "https://note.com/benkein/n/n78049b2dfb86"
 },
 {
  "slug": "n84c3a3376cd3",
  "title": "腐り帷子　二",
  "date": "2021-09-21",
  "excerpt": "僕の腐った帷子だ。 この薔薇の柵とも呼べるぼろぼろの羽衣は、 ずっと僕を覆い、囲む。 過去は、消えない。 そして、人生の言い訳を述べる。 高校の時。 僕の当時の友人が僕に教えてくれた。 僕の一言が原因で、ある人が地元の橋",
  "tags": [
   "振り返りnote",
   "眠れない夜に",
   "自殺",
   "謎"
  ],
  "cover": "/assets/ext/note/a7c1586e7f40c9df.webp",
  "noteUrl": "https://note.com/benkein/n/n84c3a3376cd3"
 },
 {
  "slug": "n39497ed6386d",
  "title": "MOON-RADIATION vol.11",
  "date": "2021-09-15",
  "excerpt": "ムーンラジエーション。これは造語です。 月明かりが、 放射状に全世界に広がり、 しかしラジオのようにひっそりと、 聴く者だけに届くようにと思い、 この名前を付けました。 いつも、ありがとうございます。 今日も、ダラダラと",
  "tags": [
   "宇宙",
   "眠れない夜に",
   "月",
   "宇宙SF",
   "故郷",
   "あかり"
  ],
  "noteUrl": "https://note.com/benkein/n/n39497ed6386d"
 },
 {
  "slug": "nffedc223694f",
  "title": "宇宙人はすぐ底にいる　さーん",
  "date": "2021-09-13",
  "excerpt": "ベネたちが日本に来る前の話。 ※全て日本語に翻訳しています。 「なんだと？S-8-MOON銀河の惑星に水がなくなった？ 今からすんごい前の話をしよう。おいらの惑星はP-4-Black &White銀河にある。いわゆる太陽",
  "tags": [
   "宇宙",
   "眠れない夜に",
   "戦争",
   "地球",
   "水",
   "人",
   "宇宙SF",
   "火星"
  ],
  "cover": "/assets/ext/note/11724a946a406726.webp",
  "noteUrl": "https://note.com/benkein/n/nffedc223694f"
 },
 {
  "slug": "na80bdacbbe7c",
  "title": "宇宙人はすぐ底にいる　にー",
  "date": "2021-09-12",
  "excerpt": "ポーと一緒に過ごして２年。 おいらとポーはなんだかんたでここまで暮らしてきた。 今まで見たことしかなかった日本の食べ物は美味しい。日本食と言われるやつだ。 ポーは、日本食よりもいわゆるジャンクフードの方が美味しいというの",
  "tags": [
   "旅",
   "眠れない夜に",
   "宇宙人",
   "宇宙SF",
   "不時着",
   "ちっちゃい"
  ],
  "cover": "/assets/ext/note/3537fd6afcb11283.webp",
  "noteUrl": "https://note.com/benkein/n/na80bdacbbe7c"
 },
 {
  "slug": "n949af1ccff06",
  "title": "宇宙人はすぐ底にいる　いち",
  "date": "2021-09-12",
  "excerpt": "宇宙人を信じますか？ 宇宙人ってね、いないんです。 うん、宇宙人はいない。 宇宙「人」は、い・な・い！！ 何度も言わせんな！笑 勝手に人に分類しないで。ここ大事なところなんで、メモしておいて欲しいんだけど、宇宙人っていう",
  "tags": [
   "小説",
   "振り返りnote",
   "宇宙",
   "眠れない夜に",
   "SF",
   "夜",
   "冒険",
   "宇宙人"
  ],
  "cover": "/assets/ext/note/1a478c4ef2372492.webp",
  "noteUrl": "https://note.com/benkein/n/n949af1ccff06"
 },
 {
  "slug": "nb167a9fe4d00",
  "title": "閻魔羅闍-ENMA THE GREAT chapter3",
  "date": "2021-09-11",
  "excerpt": "皆さま、こんにちは。 いつも、お疲れ様でございます。 小閻魔でございます。 ええ、相変わらず閻魔大王様がおられません。 だいぶ時間も経ってしまいましたので、 ここまでを振り返らせていただきます。 ↓ 現在は閻魔大王様は人",
  "tags": [
   "小説",
   "眠れない夜に",
   "時代",
   "地獄",
   "団子",
   "和菓子屋",
   "閻魔大王",
   "みたらし"
  ],
  "cover": "/assets/ext/note/1ddd30aaf74195eb.webp",
  "noteUrl": "https://note.com/benkein/n/nb167a9fe4d00"
 },
 {
  "slug": "n5b689eabe6a0",
  "title": "MOON-RADIATION  vol.10",
  "date": "2021-09-10",
  "excerpt": "ムーンラジエーション。これは造語です。 月明かりが、 放射状に全世界に広がり、 しかしラジオのようにひっそりと、 聴く者だけに届くようにと思い、 この名前を付けました。 いつも有難うございます。 コメントをいただいて、驚",
  "tags": [
   "小説",
   "振り返りnote",
   "記憶",
   "眠れない夜に",
   "会話",
   "平和",
   "月",
   "頭の中"
  ],
  "cover": "/assets/ext/note/4b7ee3b1a846fbd7.webp",
  "noteUrl": "https://note.com/benkein/n/n5b689eabe6a0"
 },
 {
  "slug": "n28ccf126fcfe",
  "title": "吾輩に好き嫌いがない理由　最終話",
  "date": "2021-09-09",
  "excerpt": "",
  "tags": [],
  "cover": "/assets/ext/note/e378f70acc962072.webp",
  "noteUrl": "https://note.com/benkein/n/n28ccf126fcfe"
 },
 {
  "slug": "ncb59e9079327",
  "title": "僕がセミを嫌いな理由　最終話",
  "date": "2021-09-08",
  "excerpt": "",
  "tags": [],
  "cover": "/assets/ext/note/12c557724c1f4a2c.webp",
  "noteUrl": "https://note.com/benkein/n/ncb59e9079327"
 },
 {
  "slug": "nbece6238127c",
  "title": "MOON-RADIATION vol.9",
  "date": "2021-09-07",
  "excerpt": "ムーンラジエーション。これは造語です。 月明かりが、 放射状に全世界に広がり、 しかしラジオのようにひっそりと、 聴く者だけに届くようにと思い、 この名前を付けました。 いつもお疲れ様です。 また、ダラダラと書きつづって",
  "tags": [
   "ラジオ",
   "振り返りnote",
   "散歩",
   "朝活",
   "眠れない夜に",
   "笑い",
   "曲",
   "ラジオネーム"
  ],
  "cover": "/assets/ext/note/392c18a9dd234f9b.webp",
  "noteUrl": "https://note.com/benkein/n/nbece6238127c"
 },
 {
  "slug": "nee6fdb193293",
  "title": "腐り帷子　一",
  "date": "2021-09-06",
  "excerpt": "僕は、冴えないアルバイト。 夢も、何もない。 別に、何をしたいわけでもない。 ただ、それは今の話。 昔は、僕にも夢があった。 俺の夢を、ぶち壊したやつ。 僕の頭の中でフラッシュバックする。 トラウマ。 どうして、僕だけ。",
  "tags": [
   "振り返りnote",
   "自分と向き合う",
   "眠れない夜に",
   "過去",
   "いじめ"
  ],
  "cover": "/assets/ext/note/114c0829026dd9f5.webp",
  "noteUrl": "https://note.com/benkein/n/nee6fdb193293"
 },
 {
  "slug": "n287fbda042c6",
  "title": "MOON-RADIATION vol.8",
  "date": "2021-09-04",
  "excerpt": "ムーンラジエーション。これは造語です。 月明かりが、 放射状に全世界に広がり、 しかしラジオのようにひっそりと、 聴く者だけに届くようにと思い、 この名前を付けました。 今日もダラダラと。 ピラゴラスイッチが、昔流行りま",
  "tags": [
   "月",
   "夏の読書感想文",
   "テロ",
   "あの夏の一コマ",
   "ピタゴラスイッチ",
   "ドラマチック",
   "ドミノ",
   "9月11日"
  ],
  "cover": "/assets/ext/note/d32cfadeb8d10644.webp",
  "noteUrl": "https://note.com/benkein/n/n287fbda042c6"
 },
 {
  "slug": "nd80c676a3272",
  "title": "吾輩に好き嫌いがない理由　7話",
  "date": "2021-09-01",
  "excerpt": "",
  "tags": [],
  "cover": "/assets/ext/note/bf9ac75f8de5878c.webp",
  "noteUrl": "https://note.com/benkein/n/nd80c676a3272"
 },
 {
  "slug": "ne3af3cf81203",
  "title": "僕がセミを嫌いな理由　6話",
  "date": "2021-08-31",
  "excerpt": "",
  "tags": [],
  "noteUrl": "https://note.com/benkein/n/ne3af3cf81203"
 },
 {
  "slug": "n6435a0f7db4d",
  "title": "MOON-RADIATION vol.7",
  "date": "2021-08-29",
  "excerpt": "ムーンラジエーション。これは造語です。 月明かりが、 放射状に全世界に広がり、 しかしラジオのようにひっそりと、 聴く者だけに届くようにと思い、 この名前を付けました。 毎回、いつも見てくださる人がいますが、 本当にあり",
  "tags": [
   "自分と向き合う",
   "眠れない夜に",
   "他人",
   "境界線",
   "違い",
   "共生",
   "包丁",
   "8月31日の夜に"
  ],
  "cover": "/assets/ext/note/dc98508915cc55e2.webp",
  "noteUrl": "https://note.com/benkein/n/n6435a0f7db4d"
 },
 {
  "slug": "n5d54501c59d9",
  "title": "おいらが人間を大好きな理由　最終話",
  "date": "2021-08-28",
  "excerpt": "",
  "tags": [],
  "noteUrl": "https://note.com/benkein/n/n5d54501c59d9"
 },
 {
  "slug": "n4e43bdfefe01",
  "title": "閻魔羅闍-ENMA THE GREAT chapter2",
  "date": "2021-08-28",
  "excerpt": "こんにちは。 いつもお疲れ様です。 ええ、またしても小閻魔でございます。 いつになっても、閻魔大王様はいらっしゃいません。 その代わりに、 ある老人が私のところにやってきました。 たいそう痩せこけた身体と、 穴の空いた貧",
  "tags": [
   "人間",
   "眠れない夜に",
   "地獄",
   "鬼",
   "閻魔大王",
   "老爺",
   "小閻魔",
   "地獄法典"
  ],
  "cover": "/assets/ext/note/2a39e007eb7493fc.webp",
  "noteUrl": "https://note.com/benkein/n/n4e43bdfefe01"
 },
 {
  "slug": "n97849aa05cf4",
  "title": "MOON-RADIATION vol.6",
  "date": "2021-08-27",
  "excerpt": "ムーンラジエーション。これは造語です。 月明かりが、 放射状に全世界に広がり、 しかしラジオのようにひっそりと、 聴く者だけに届くようにと思い、 この名前を付けました。 日本の夏。 今年は、これまでにない夏だった。 線香",
  "tags": [
   "夏",
   "花火",
   "8月31日の夜に",
   "線香花火",
   "あの夏の一コマ",
   "火花",
   "火玉"
  ],
  "cover": "/assets/ext/note/1f8ccf5759ccf2d1.webp",
  "noteUrl": "https://note.com/benkein/n/n97849aa05cf4"
 },
 {
  "slug": "nd3fad0127cf8",
  "title": "吾輩に好き嫌いがない理由　6話",
  "date": "2021-08-26",
  "excerpt": "",
  "tags": [],
  "cover": "/assets/ext/note/48aff1ee363ebad7.webp",
  "noteUrl": "https://note.com/benkein/n/nd3fad0127cf8"
 },
 {
  "slug": "n50398f180858",
  "title": "閻魔羅闍-ENMA THE GREAT Chapter1",
  "date": "2021-08-25",
  "excerpt": "はじめまして。 いつもおつかれ様です。 私は、小閻魔と申します。 閻魔大王じゃないのかとお気になされた方もいらっしゃると思います。 大変申し訳ございません。 閻魔大王様は現在、外出なされています。 今、閻魔大王様は探し物",
  "tags": [
   "人間",
   "地獄",
   "砂糖",
   "鬼",
   "閻魔大王",
   "小閻魔",
   "地獄法典"
  ],
  "cover": "/assets/ext/note/eddc51ce282eb64a.webp",
  "noteUrl": "https://note.com/benkein/n/n50398f180858"
 },
 {
  "slug": "nb18ac19e2cc7",
  "title": "僕がセミを嫌いな理由　5話",
  "date": "2021-08-24",
  "excerpt": "",
  "tags": [],
  "noteUrl": "https://note.com/benkein/n/nb18ac19e2cc7"
 },
 {
  "slug": "n644900d09fe2",
  "title": "おいらが人間を大好きな理由　6話",
  "date": "2021-08-24",
  "excerpt": "",
  "tags": [],
  "cover": "/assets/ext/note/f69d362368e28914.webp",
  "noteUrl": "https://note.com/benkein/n/n644900d09fe2"
 },
 {
  "slug": "n3068ae000aa9",
  "title": "MOON-RADIATION vol.5",
  "date": "2021-08-23",
  "excerpt": "ムーンラジエーション。これは造語です。 月明かりが、 放射状に全世界に広がり、 しかしラジオのようにひっそりと、 聴く者だけに届くようにと思い、 この名前を付けました。 僕にとって、月はなくてはならないものです。 いても",
  "tags": [
   "月",
   "満月",
   "8月31日の夜に",
   "下弦の月",
   "上弦の月",
   "物語の発想法を学ぶ",
   "月見草"
  ],
  "noteUrl": "https://note.com/benkein/n/n3068ae000aa9"
 },
 {
  "slug": "n0f600360c5a7",
  "title": "おいら○人間を○○な理○　5○",
  "date": "2021-08-23",
  "excerpt": "",
  "tags": [],
  "cover": "/assets/ext/note/9dd27fac0ce3b6e9.webp",
  "noteUrl": "https://note.com/benkein/n/n0f600360c5a7"
 },
 {
  "slug": "n47ac22a614a6",
  "title": "吾輩に好き嫌いがない理由　5話",
  "date": "2021-08-22",
  "excerpt": "",
  "tags": [],
  "cover": "/assets/ext/note/e901805322493dcc.webp",
  "noteUrl": "https://note.com/benkein/n/n47ac22a614a6"
 },
 {
  "slug": "n46013f3c732b",
  "title": "Link（はじめましての方はこちら）",
  "date": "2021-08-22",
  "excerpt": "《自己紹介》 映画と、猫と、本とHipHopでできています。勝手に短編作っています。 ※本人（ヒト）が100%書いた文章と、 AIの文章が入り乱れてます。今のところAIに勝ってます。 《▼比較的更新》 月 超超訳！ギリシ",
  "tags": [
   "日記",
   "小説",
   "映画",
   "振り返りnote",
   "物語",
   "眠れない夜に",
   "謎"
  ],
  "cover": "/assets/ext/note/3dbd0ae4a75d48c9.webp",
  "noteUrl": "https://note.com/benkein/n/n46013f3c732b"
 },
 {
  "slug": "n0a1e13d6b04c",
  "title": "MOON-RADIATION vol.4",
  "date": "2021-08-22",
  "excerpt": "ムーンラジエーション。これは造語です。 月明かりが、 放射状に全世界に広がり、 しかしラジオのようにひっそりと、 聴く者だけに届くようにと思い、 この名前を付けました。 この世界。 これからの世界。 本当にどうなるんだろ",
  "tags": [
   "youtube",
   "振り返りnote",
   "youtuber",
   "物語の発想法を学ぶ",
   "YouTubee"
  ],
  "cover": "/assets/ext/note/f465b79b27ab11e2.webp",
  "noteUrl": "https://note.com/benkein/n/n0a1e13d6b04c"
 },
 {
  "slug": "n895957bc40a7",
  "title": "おいらが人間を大好きな理由　4話",
  "date": "2021-08-21",
  "excerpt": "",
  "tags": [],
  "cover": "/assets/ext/note/83bf1ea13f045947.webp",
  "noteUrl": "https://note.com/benkein/n/n895957bc40a7"
 },
 {
  "slug": "n511758ac2b85",
  "title": "吾輩に好き嫌いがない理由　4話",
  "date": "2021-08-21",
  "excerpt": "",
  "tags": [],
  "cover": "/assets/ext/note/e5acbe6f0d025491.webp",
  "noteUrl": "https://note.com/benkein/n/n511758ac2b85"
 },
 {
  "slug": "n4b1377309885",
  "title": "MOON-RADIATION vol.3",
  "date": "2021-08-21",
  "excerpt": "ムーンラジエーション。これは造語です。 月明かりが、 放射状に全世界に広がり、 しかしラジオのようにひっそりと、 聴く者だけに届くようにと思い、 この名前を付けました。 偽が好きです。 漢字から好きです。 人の為って書い",
  "tags": [
   "宇宙",
   "眠れない夜に",
   "月",
   "光",
   "ふりかえり",
   "月光",
   "物語の発想法を学ぶ"
  ],
  "cover": "/assets/ext/note/750def59c2e53018.webp",
  "noteUrl": "https://note.com/benkein/n/n4b1377309885"
 },
 {
  "slug": "n375d6516e429",
  "title": "MOON-RADIATION vol.2",
  "date": "2021-08-21",
  "excerpt": "ムーンラジエーション。これは造語です。 月明かりが、 放射状に全世界に広がり、 しかしラジオのようにひっそりと、 聴く者だけに届くようにと思い、 この名前を付けました。 どうも、MRichです。 僕は、映画が好きです。 ",
  "tags": [
   "映画",
   "振り返りnote",
   "夏",
   "休日のすごし方",
   "radio",
   "オマージュ"
  ],
  "cover": "/assets/ext/note/c2e783fb5ea9d06c.webp",
  "noteUrl": "https://note.com/benkein/n/n375d6516e429"
 },
 {
  "slug": "ndfd10e2f2d71",
  "title": "MOON-RADIATION vol.1",
  "date": "2021-08-20",
  "excerpt": "ムーンラジエーション。これは造語です。 月明かりが、 放射状に全世界に広がり、 しかしラジオのようにひっそりと、 聴く者だけに届くようにと思い、 この名前を付けました。 noteをまだまだ使いこなせてない僕ですが、少しず",
  "tags": [
   "夏",
   "月",
   "夜",
   "光"
  ],
  "cover": "/assets/ext/note/3f75c96fc82f9615.webp",
  "noteUrl": "https://note.com/benkein/n/ndfd10e2f2d71"
 },
 {
  "slug": "nd2fd81cc2523",
  "title": "吾輩に好き嫌いがない理由　2話",
  "date": "2021-08-20",
  "excerpt": "",
  "tags": [],
  "cover": "/assets/ext/note/4400bf2879bfd2ea.webp",
  "noteUrl": "https://note.com/benkein/n/nd2fd81cc2523"
 },
 {
  "slug": "n72806fa29db3",
  "title": "吾輩に好き嫌いがない理由　3話",
  "date": "2021-08-20",
  "excerpt": "",
  "tags": [],
  "cover": "/assets/ext/note/807cba68c2c2cdff.webp",
  "noteUrl": "https://note.com/benkein/n/n72806fa29db3"
 },
 {
  "slug": "n36e65de7699b",
  "title": "おいらが人間を大好きな理由　3話",
  "date": "2021-08-20",
  "excerpt": "",
  "tags": [],
  "cover": "/assets/ext/note/dfd60cb24807fec2.webp",
  "noteUrl": "https://note.com/benkein/n/n36e65de7699b"
 },
 {
  "slug": "n1c1c582ed68b",
  "title": "僕がセミをきらいな理由　4話",
  "date": "2021-08-20",
  "excerpt": "",
  "tags": [],
  "noteUrl": "https://note.com/benkein/n/n1c1c582ed68b"
 },
 {
  "slug": "ne742a44c62db",
  "title": "おいらが人間を大好きな理由　1話",
  "date": "2021-08-19",
  "excerpt": "",
  "tags": [],
  "cover": "/assets/ext/note/66bc802e465e184f.webp",
  "noteUrl": "https://note.com/benkein/n/ne742a44c62db"
 },
 {
  "slug": "nc13ece5a82c6",
  "title": "僕がセミをきらいな理由　1話",
  "date": "2021-08-19",
  "excerpt": "",
  "tags": [],
  "noteUrl": "https://note.com/benkein/n/nc13ece5a82c6"
 },
 {
  "slug": "nac29360882c9",
  "title": "おいらが人間を大好きな理由　2話",
  "date": "2021-08-19",
  "excerpt": "",
  "tags": [],
  "noteUrl": "https://note.com/benkein/n/nac29360882c9"
 },
 {
  "slug": "n68bcd735323f",
  "title": "僕がセミをきらいな理由　2話",
  "date": "2021-08-19",
  "excerpt": "",
  "tags": [],
  "cover": "/assets/ext/note/ab151eec3500dda0.webp",
  "noteUrl": "https://note.com/benkein/n/n68bcd735323f"
 },
 {
  "slug": "n66e44690621d",
  "title": "吾輩に好き嫌いがない理由　1話",
  "date": "2021-08-19",
  "excerpt": "",
  "tags": [],
  "noteUrl": "https://note.com/benkein/n/n66e44690621d"
 },
 {
  "slug": "n30913c4b046b",
  "title": "僕がセミをきらいな理由　3話",
  "date": "2021-08-19",
  "excerpt": "",
  "tags": [],
  "noteUrl": "https://note.com/benkein/n/n30913c4b046b"
 },
 {
  "slug": "n9d856b2ee9f7",
  "title": "雨上がりに。",
  "date": "2021-08-18",
  "excerpt": "今日はひどい雨が降った。 一瞬のうちに、ザーザーと雨が降りしきった。 グランドの少しの凹凸にたくさんの水たまりができた。その中に、スポンジを入れる野球少年たちが群がっていた。 昨日アメトークと言う番組を見た。 そこで2年",
  "tags": [
   "振り返りnote",
   "眠れない夜に",
   "雨上がり決死隊"
  ],
  "cover": "/assets/ext/note/d8a52ce4cab0b860.webp",
  "noteUrl": "https://note.com/benkein/n/n9d856b2ee9f7"
 },
 {
  "slug": "n450931a3fd12",
  "title": "Blue Impulse.",
  "date": "2021-07-24",
  "excerpt": "Blue Impulse. 僕等に、希望をくれる。 五輪は、終わればいい。そう思っていた。 なぜ、開催なのか。 ワクチンの接種は大丈夫か。そう思っていた。 自粛命令がはじめて出されて、時間が経った。 友人が一言、 「いつ",
  "tags": [
   "空",
   "東京五輪",
   "2000字のドラマ",
   "ブルーインパルス"
  ],
  "cover": "/assets/ext/note/8394e9d2c494bc0a.webp",
  "noteUrl": "https://note.com/benkein/n/n450931a3fd12"
 },
 {
  "slug": "n2c3579ac28b3",
  "title": "あけましておめでとう",
  "date": "2021-01-03",
  "excerpt": "あけましておめでとう",
  "tags": [],
  "cover": "/assets/ext/note/6c719c821c6a91d3.webp",
  "noteUrl": "https://note.com/benkein/n/n2c3579ac28b3"
 }
];
