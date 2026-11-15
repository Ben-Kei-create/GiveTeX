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
  "slug": "about-this-booth",
  "title": "note ブースをはじめます",
  "date": "2026-11-15",
  "excerpt": "note で書いてきたものを、ここにも置いていくことにしました。このブースの読み方と、これからのことを少しだけ。",
  "tags": [
   "お知らせ"
  ]
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
  "tags": [],
  "cover": "https://assets.st-note.com/production/uploads/images/329805841/rectangle_large_type_2_475d8c3fe6dfee160983074f5c8b0f46.png?fit=bounds&quality=85&width=1280?width=360",
  "noteUrl": "https://note.com/benkein/n/n35741b214913"
 },
 {
  "slug": "n274538b162fd",
  "title": "Digital Arts of Winner #フェルメール ",
  "date": "2026-10-29",
  "excerpt": "フェルメールを見に行くときは いつも胸がドキドキします。 まるで恋人と会うときのように。 谷川俊太郎 フェルメールについての教養を！ 🔗 リンク：https://amzn.asia/d/04UtO27c 🔗 リンク：ht",
  "tags": [],
  "cover": "https://assets.st-note.com/production/uploads/images/316260412/rectangle_large_type_2_293718c3dc9160e678eba0660fe2499e.png?fit=bounds&quality=85&width=1280?width=360",
  "noteUrl": "https://note.com/benkein/n/n274538b162fd"
 },
 {
  "slug": "n27400ab89ea4",
  "title": "【お墓で教養】開けられるのに、あえて開けないお墓の話",
  "date": "2026-10-28",
  "excerpt": "Kindleで新刊を出しました。タイトルは 『30秒で読む 世界の「開けてはいけない墓」』 です。 きっかけは単純で、「呪われた墓」の話が気になったんです。最近、「ツタンカーメンの呪い」じゃないですが、なんと隣にもしかし",
  "tags": [],
  "cover": "https://assets.st-note.com/production/uploads/images/318988289/rectangle_large_type_2_ced78b51f0903f9696d758f55dfa1b37.png?fit=bounds&quality=85&width=1280?width=360",
  "noteUrl": "https://note.com/benkein/n/n27400ab89ea4"
 },
 {
  "slug": "n7a39e49eea9a",
  "title": "【GMO懸賞金】1.5億円チャレンジ発足",
  "date": "2026-10-27",
  "excerpt": "🔗 リンク：https://group.gmo/info/alert/2026102705/ 以下、抜粋 【総額100万ドル・総額1.5億円】 「GMOサイバー犯罪撲滅・懸賞金 」について 「お名前.com デスクトップ",
  "tags": [],
  "cover": "https://assets.st-note.com/production/uploads/images/329210304/rectangle_large_type_2_38f59d10fbea605a2930295db2abd269.png?fit=bounds&quality=85&width=1280?width=360",
  "noteUrl": "https://note.com/benkein/n/n7a39e49eea9a"
 },
 {
  "slug": "n357a3af04e91",
  "title": "【日本名画で教養】北斎の「波」の隣に、娘の「夜」があった",
  "date": "2026-10-27",
  "excerpt": "波の奥に、小さな富士山がいる 北斎の『神奈川沖浪裏』を思い浮かべてみてください。画面いっぱいに立ち上がる青い大きな波。その下で、小さな舟が波にもまれています。じっと見ていると、波のくぼみの向こうに、小さな三角形が見えてき",
  "tags": [],
  "cover": "https://assets.st-note.com/production/uploads/images/319701208/rectangle_large_type_2_b29ffe511909e4b3c4e8ea5c66aeb6f1.png?fit=bounds&quality=85&width=1280?width=360",
  "noteUrl": "https://note.com/benkein/n/n357a3af04e91"
 },
 {
  "slug": "nb09f5d28aace",
  "title": "Digital Arts of Winner #変異",
  "date": "2026-10-16",
  "excerpt": "",
  "tags": [],
  "cover": "https://assets.st-note.com/production/uploads/images/315671468/rectangle_large_type_2_e068bdef14037beee61aebaf5800c89a.png?fit=bounds&quality=85&width=1280?width=360",
  "noteUrl": "https://note.com/benkein/n/nb09f5d28aace"
 },
 {
  "slug": "nc3c9a7b438c8",
  "title": "お酒を、ゲームに乗せたよ🕹️",
  "date": "2026-10-15",
  "excerpt": "脱出ゲームを作っています 脱出せずにダラダラできるルールにしています。 脱出したくなくなるワクワクをつくっています。 ガラスのヒビを再現しました 初回 📄 ゲームで使う本の画像作った",
  "tags": [],
  "cover": "https://assets.st-note.com/production/uploads/images/324659072/rectangle_large_type_2_aa65de710c6e75df2f68f689771d5185.png?fit=bounds&quality=85&width=1280?width=360",
  "noteUrl": "https://note.com/benkein/n/nc3c9a7b438c8"
 },
 {
  "slug": "nf1f309263b60",
  "title": "【発想の教養】失敗から生まれた奇跡！？「世界を変えたヤバい発見」3選",
  "date": "2026-10-15",
  "excerpt": "歴史を大きく変えた「偉大な大発見」。 それはさぞかし、天才たちが緻密な計算と完璧な計画の末に生み出したのだろう…と思っていませんか？ 実は、私たちの生活を支えている大発明の多くは、ただの「偶然」や「とんでもない失敗」から",
  "tags": [],
  "cover": "https://assets.st-note.com/production/uploads/images/318983664/rectangle_large_type_2_1888e49db57ac428fd40402a57c6b2f4.png?fit=bounds&quality=85&width=1280?width=360",
  "noteUrl": "https://note.com/benkein/n/nf1f309263b60"
 },
 {
  "slug": "nd27766e44c51",
  "title": "あぷりのりりーすできた3本目",
  "date": "2026-10-15",
  "excerpt": "別のアプリの申請通った！ 脱出ゲームはまだまだやることあるから、つくるぞー！",
  "tags": [],
  "cover": "https://assets.st-note.com/production/uploads/images/284135957/rectangle_large_type_2_9372992d8acc4b971fed53dc249576ff.png?fit=bounds&quality=85&width=1280?width=360",
  "noteUrl": "https://note.com/benkein/n/nd27766e44c51"
 },
 {
  "slug": "n47567cf5c612",
  "title": "コーポヨシミつくった",
  "date": "2026-10-14",
  "excerpt": "おいらが貧乏大学生の頃住んでたアパートの名前。今は立派なアパートに建て替えられた。 アパートの名前をマンションの名前にきめた。 ここから脱出するゲーム。",
  "tags": [],
  "cover": "https://assets.st-note.com/production/uploads/images/324376356/rectangle_large_type_2_e17d42a69a0302ccc0508323a66783e4.png?fit=bounds&quality=85&width=1280?width=360",
  "noteUrl": "https://note.com/benkein/n/n47567cf5c612"
 },
 {
  "slug": "nca0cb9fd05fd",
  "title": "【図書館で教養】昔の図書館は、本を鎖でつないでいた",
  "date": "2026-10-14",
  "excerpt": "図書館というと、静かで、整然としていて、少し堅苦しい場所を想像する人が多いと思います。でも調べていくと、その姿はまったく違って見えてきました。 英国のヘレフォード大聖堂には、今も1500冊ほどの本が、太い鎖で書架につなが",
  "tags": [],
  "cover": "https://assets.st-note.com/production/uploads/images/318982159/rectangle_large_type_2_d085503e86400ebdb650840182f6a512.png?fit=bounds&quality=85&width=1280?width=360",
  "noteUrl": "https://note.com/benkein/n/nca0cb9fd05fd"
 },
 {
  "slug": "n5e164d5fdb3a",
  "title": "【変異の教養】ハエの頭に脚が生えた話、知っていますか",
  "date": "2026-09-19",
  "excerpt": "「突然変異」と聞くと、なんとなく怖いものを想像してしまいます。SFに出てくる怪物や、ニュースで 見る「変異株」という言葉のせいかもしれません。でも実際に遺伝学の本をめくってみると、そこにある のはもっと地味で、もっと面白",
  "tags": [],
  "cover": "https://assets.st-note.com/production/uploads/images/315050659/rectangle_large_type_2_32d5f1d6af5d5f6d076e28c2d0775f30.png?fit=bounds&quality=85&width=1280?width=360",
  "noteUrl": "https://note.com/benkein/n/n5e164d5fdb3a"
 },
 {
  "slug": "n7869d2cdaca5",
  "title": "Alcohol Trio ビールが街を作った",
  "date": "2026-09-18",
  "excerpt": "ここから、日本全国のお酒を一杯ずつ巡っていきます。 （毎週金曜日更新します） ビール、日本酒、ワイン。トリオ（Trio）たちを、初心者から、知識を積み上げて嗜めるレベルまで丁寧に解説します。 お酒には有名な一本もあれば、",
  "tags": [],
  "cover": "https://assets.st-note.com/production/uploads/images/314808616/rectangle_large_type_2_02a2890bf26a1d86d2b60671d73aa014.jpg?fit=bounds&quality=85&width=1280?width=360",
  "noteUrl": "https://note.com/benkein/n/n7869d2cdaca5"
 },
 {
  "slug": "nb6e25ba2a213",
  "title": "今日から{英語}始めたよ",
  "date": "2026-09-17",
  "excerpt": "実は、ドュオリンゴを続けてもう少しで200日なんです。 でもでも、まあ確かに書けるようにもなったし読めるようにもなったんですが、 喋れない！そして、聴けない！！ だから、なんだかなぁと思ってます。 多分、アメリカの子ども",
  "tags": [],
  "cover": "https://assets.st-note.com/production/uploads/images/314702309/rectangle_large_type_2_3f590f9fc9488fdcb4aa71fb5fb5fd7c.png?fit=bounds&quality=85&width=1280?width=360",
  "noteUrl": "https://note.com/benkein/n/nb6e25ba2a213"
 },
 {
  "slug": "nf81091a50b89",
  "title": "【元カノで教養】絶対に怒らせてはいけないオリュンポスの住人たち",
  "date": "2026-09-17",
  "excerpt": "「ギリシャ神話」と聞くと、名前が長くて複雑、難しそうな古典文学…というイメージがあるかもしれません。 しかし蓋を開けてみると、そこに登場する神様たちは驚くほど感情豊かです。浮気をし、嫉妬に狂い、逆ギレして人間に八つ当たり",
  "tags": [],
  "cover": "https://assets.st-note.com/production/uploads/images/314201269/rectangle_large_type_2_029479fc14d6f8834b11745327ff2723.jpg?fit=bounds&quality=85&width=1280?width=360",
  "noteUrl": "https://note.com/benkein/n/nf81091a50b89"
 },
 {
  "slug": "n7c177b1ed10a",
  "title": "【数学で教養】学校では教えてくれない！？日常に潜む「数学のふしぎ」とヤバい法則3選",
  "date": "2026-09-17",
  "excerpt": "「数学なんて、大人になったら何の役にも立たない」 学生時代、そんな風に思ったことはありませんか？ 実は、数学はただの退屈な計算ドリルではありません。私たちが「美しい」と感じるデザインや、自然界の植物の形、さらには「絶対に",
  "tags": [],
  "cover": "https://assets.st-note.com/production/uploads/images/313713872/rectangle_large_type_2_4177539ae7f0426455d4a02f925fa469.jpg?fit=bounds&quality=85&width=1280?width=360",
  "noteUrl": "https://note.com/benkein/n/n7c177b1ed10a"
 },
 {
  "slug": "n720a0b089717",
  "title": "「無料応募」の罠を踏み、売れるB2B商品が一段クリアになった日｜Wonderloom Global Ops 日報 2026-09-16",
  "date": "2026-09-17",
  "excerpt": "今日の一行：確定Original IP Revenueは0円のまま。ただし、低単価の実績作りから高単価B2Bへ探索を広げ、既存PoCを「7日間のAI問い合わせ対応Pilot」という売れる形へ変換した。同時に、“無料入札”",
  "tags": [],
  "cover": "https://assets.st-note.com/production/uploads/images/314436762/rectangle_large_type_2_dd1165b868fe51b821322c0182df9040.png?fit=bounds&quality=85&width=1280?width=360",
  "noteUrl": "https://note.com/benkein/n/n720a0b089717"
 },
 {
  "slug": "n09a56e50442d",
  "title": "【バグ教養】あなたはすでに騙されている？日常に潜む『脳のバグと心理の罠』3選",
  "date": "2026-09-10",
  "excerpt": "「自分は論理的に正しい判断ができている」 そう思っていませんか？ 実は人間の脳は、私たちが思っている以上に「サボり魔」で、無意識のうちに多くの錯覚や思い込み（バイアス）を引き起こしています。マーケティングや詐欺などでは、",
  "tags": [],
  "cover": "https://assets.st-note.com/production/uploads/images/312012413/rectangle_large_type_2_a4ccf7e51f181c0f058726fb5465e98b.png?fit=bounds&quality=85&width=1280?width=360",
  "noteUrl": "https://note.com/benkein/n/n09a56e50442d"
 },
 {
  "slug": "nf863016add08",
  "title": "【夢の国×教養】夢の国はこうして作られた！ウォルト・ディズニー「狂気の執念と代償」3選",
  "date": "2026-09-09",
  "excerpt": "「夢と魔法の国」 この言葉を聞いて、誰もが思い浮かべるあのテーマパークと数々の名作アニメーション。 しかし、その創設者であるウォルト・ディズニーの人生は、決して最初から魔法に満ちていたわけではありません。むしろ、数え切れ",
  "tags": [],
  "cover": "https://assets.st-note.com/production/uploads/images/311810244/rectangle_large_type_2_70e13bed0b1415efb09d4ffad51e870d.jpg?fit=bounds&quality=85&width=1280?width=360",
  "noteUrl": "https://note.com/benkein/n/nf863016add08"
 },
 {
  "slug": "n872b83e7b937",
  "title": "【魅惑の教養】美しさと狂気…唐代後宮の「ドロドロ毒殺劇と美容薬」の真実3選💋",
  "date": "2026-09-08",
  "excerpt": "「皇帝の寵愛をめぐる、美しい女性たちのドロドロの戦い…」 最近、そんな宮廷を舞台にした漫画やドラマが大人気ですよね。 しかし、実際の歴史（とくに中国・唐の時代）における「後宮」の実態は、フィクションを遥かに超えるほど過激",
  "tags": [],
  "cover": "https://assets.st-note.com/production/uploads/images/311551284/rectangle_large_type_2_1755d34fffcbb8ade20533f6d0a3a802.jpg?fit=bounds&quality=85&width=1280?width=360",
  "noteUrl": "https://note.com/benkein/n/n872b83e7b937"
 },
 {
  "slug": "n564bb66bbe9a",
  "title": "【ネコで教養ニャ！】ただ可愛いだけじゃない歴史の裏で「世界を動かした猫たち」3選",
  "date": "2026-09-08",
  "excerpt": "「猫は気まぐれでマイペース。でも、そこが可愛い！」 猫と一緒に暮らしている方や、猫動画に癒やされている方は多いと思います。 しかし、ただゴロゴロして可愛いだけが猫ではありません。実は、古代から現代に至るまで、猫たちは人間",
  "tags": [],
  "cover": "https://assets.st-note.com/production/uploads/images/311277759/rectangle_large_type_2_6c48029135d413404c64052d87358d55.jpg?fit=bounds&quality=85&width=1280?width=360",
  "noteUrl": "https://note.com/benkein/n/n564bb66bbe9a"
 },
 {
  "slug": "n105d936d791e",
  "title": "【下ネタで教養】下品×大食いドタバタの連続！「ガルガンチュアとパンタグリュエル」入門",
  "date": "2026-09-07",
  "excerpt": "「世界の名作古典文学」と聞くと、なんだか敷居が高くて難しそう…と思いませんか？（紹介本あり） 実は、フランスルネサンス期に書かれた 超有名古典『ガルガンチュアとパンタグリュエル』 は、上品さのかけらもない 「巨大な親子が",
  "tags": [],
  "cover": "https://assets.st-note.com/production/uploads/images/310968574/rectangle_large_type_2_80003a1be20eece02224f10eb2e0f505.png?fit=bounds&quality=85&width=1280?width=360",
  "noteUrl": "https://note.com/benkein/n/n105d936d791e"
 },
 {
  "slug": "nb0c15b44e898",
  "title": "【生存戦略の教養】生き残るための知恵が凄すぎる！植物の「ずるい」生存戦略入門",
  "date": "2026-09-04",
  "excerpt": "「動けない植物は、過酷な自然界でどうやって身を守っているんだろう？」 そう思ったことはありませんか？ 一見するとただそこに生えているだけの植物ですが、実は生き残るために人間が想像もつかないような「ずるくて賢い生存戦略」を",
  "tags": [],
  "cover": "https://assets.st-note.com/production/uploads/images/310076744/rectangle_large_type_2_ceb57b387271d90930c1135c8415cbab.jpg?fit=bounds&quality=85&width=1280?width=360",
  "noteUrl": "https://note.com/benkein/n/nb0c15b44e898"
 },
 {
  "slug": "n2c7cdad5c0ff",
  "title": "【神話で教養】知ると誰かに話したくなる！日本神話のドラマチックな人間関係",
  "date": "2026-09-03",
  "excerpt": "「神様のお話って、名前が難しくてなんだかとっつきにくい…」 そう思ったことはありませんか？ 『30秒で読む 日本神話の神々』 🔗 リンク：https://amzn.asia/d/012BT43J 実は、日本の神話（古事記",
  "tags": [],
  "cover": "https://assets.st-note.com/production/uploads/images/309990385/rectangle_large_type_2_482845f3b8232b57e49b1bbd2985fc4d.png?fit=bounds&quality=85&width=1280?width=360",
  "noteUrl": "https://note.com/benkein/n/n2c7cdad5c0ff"
 },
 {
  "slug": "n09c93263cfed",
  "title": "【映画の教養】30秒でサクッと神話の世界を体験したい方へ ＆ オデュッセイア入門",
  "date": "2026-09-02",
  "excerpt": "『オデュッセイア』を、怪物・神々・知恵比べ・帰還という“面白いところ”から短くつかみたい方向けに、『30秒で読む オデュッセイア』をKindleで配信中です！ キュクロプス、セイレーン、キルケー、そして20年越しの帰還ま",
  "tags": [],
  "cover": "https://assets.st-note.com/production/uploads/images/309492796/rectangle_large_type_2_a0b436f46c012d69683be1356ef9b2ed.jpg?fit=bounds&quality=85&width=1280?width=360",
  "noteUrl": "https://note.com/benkein/n/n09c93263cfed"
 },
 {
  "slug": "nfb5f0aac1dad",
  "title": "【江戸の教養】江戸っ子のジョークセンスに脱帽！スキマ時間に読める『古典笑話』入門",
  "date": "2026-09-01",
  "excerpt": "「落語が栄えた昔の人は、どんなことで笑っていたんだろう？」 そう思ったことはありませんか？ 古典落語の、さらに元ネタを知る 現代の漫才やコントのルーツをたどると、江戸時代に大流行した「江戸小話」や、戦国〜江戸初期にまとめ",
  "tags": [],
  "cover": "https://assets.st-note.com/production/uploads/images/309155382/rectangle_large_type_2_f0caed0ac3c3934690160b4eab7b0d9e.jpg?fit=bounds&quality=85&width=1280?width=360",
  "noteUrl": "https://note.com/benkein/n/nfb5f0aac1dad"
 },
 {
  "slug": "n863578ed657d",
  "title": "とんでもない方法【3ヶ月の収益報告】~随時更新＆保存版~",
  "date": "2026-08-20",
  "excerpt": "おいおい、配当が毎月くるじゃねえか、全員100%やるべきだろこれ。年１じゃねえぞ、月１だぞ。 （ただし1日寝る前に10分作業ができる人だけ。） 最近、Amazon KDPで本を作る実験をしています。 そして、やっていて気",
  "tags": [],
  "cover": "https://assets.st-note.com/production/uploads/images/305386695/rectangle_large_type_2_37f8c0a393b6c931b1a67fd4430a334f.jpg?fit=bounds&quality=85&width=1280?width=360",
  "noteUrl": "https://note.com/benkein/n/n863578ed657d"
 },
 {
  "slug": "n52a095307337",
  "title": "【恋愛心理学で教養】返信が遅いだけで不安になるのは、好きだからではないかもしれない",
  "date": "2026-08-10",
  "excerpt": "好きな人にメッセージを送る。 まだ既読はつかない。 10分後、もう一度スマホを見る。 30分後、また見る。 返信が来ていないことを確認して、少しだけ落ち込む。 「忙しいだけかもしれない」 頭ではそう分かっているのに、いつ",
  "tags": [],
  "cover": "https://assets.st-note.com/production/uploads/images/302207488/rectangle_large_type_2_cdeac742ba62f7e0efcc352969478110.png?fit=bounds&quality=85&width=1280?width=360",
  "noteUrl": "https://note.com/benkein/n/n52a095307337"
 },
 {
  "slug": "nd0f9bde1d461",
  "title": "「すっぱい葡萄」はただの負け惜しみ？イソップ寓話でわかる「合理化」の心理",
  "date": "2026-08-05",
  "excerpt": "本当は欲しかった。 けれど、手に入らなかった。 そんなとき私たちの心は、ときどき「最初から欲しくなかった」と物語を書き換えます。 イソップ寓話の「キツネとブドウ」は、失敗した人の強がりを描いた短い話です。しかし、大人にな",
  "tags": [],
  "cover": "https://assets.st-note.com/production/uploads/images/300615954/rectangle_large_type_2_16926be74ad98a5d35bc0164f93c50b2.jpg?fit=bounds&quality=85&width=1280?width=360",
  "noteUrl": "https://note.com/benkein/n/nd0f9bde1d461"
 },
 {
  "slug": "nbd6379629591",
  "title": "Design War season1-4",
  "date": "2024-09-23",
  "excerpt": "全て無料でお読みいただけます。 https://note.com/benkein/m/mca393d638cb4 ——— 登場人物 多彩 翔 （たさい かける） ひきこもりから脱出した就活中の26歳。絵の勉強をしたいと思",
  "tags": [],
  "cover": "https://assets.st-note.com/production/uploads/images/155513557/rectangle_large_type_2_d72fcc02876d7cc7b19710a797e0a5fe.png?fit=bounds&quality=85&width=1280?width=360",
  "noteUrl": "https://note.com/benkein/n/nbd6379629591",
  "paid": true
 },
 {
  "slug": "nd99a4c86d3d5",
  "title": "Design War season1-3",
  "date": "2024-09-23",
  "excerpt": "全て無料でお読みいただけます。 🔗 リンク：https://note.com/benkein/m/mca393d638cb4 ——— 登場人物 多彩 翔 （たさい かける） ひきこもりから脱出した就活中の26歳。絵の勉強",
  "tags": [],
  "cover": "https://assets.st-note.com/production/uploads/images/155293476/rectangle_large_type_2_a7e5901e4e66df18d7f2e4de2d582930.png?fit=bounds&quality=85&width=1280?width=360",
  "noteUrl": "https://note.com/benkein/n/nd99a4c86d3d5",
  "paid": true
 },
 {
  "slug": "n1634c855f6bd",
  "title": "Design War season1-2",
  "date": "2024-09-21",
  "excerpt": "全て無料でお読みいただけます。 前回の続き Design War season1-1 📄 Design War season1-1 ——— 登場人物 多彩 翔 （たさい かける） 現在就活中の26歳。絵の勉強をしたいと思",
  "tags": [],
  "cover": "https://assets.st-note.com/production/uploads/images/155106066/rectangle_large_type_2_d2b00a52d9a5e4df946ced99e4662c70.png?fit=bounds&quality=85&width=1280?width=360",
  "noteUrl": "https://note.com/benkein/n/n1634c855f6bd",
  "paid": true
 },
 {
  "slug": "n937420c02701",
  "title": "月額無料で高画質1日700枚生成💫モデリング❌プロンプト❌月3万〜自動化稼ぐ方法",
  "date": "2024-09-19",
  "excerpt": "今回は結構本格的に作成しました！ぜひ、チャレンジしてみてください。また、競合が増えることは 自分にとって普通にうれしくはないので、 値段は 比較的高めに設定しています。 とはいえ、AIの進歩は凄まじいので、また別の方法も",
  "tags": [],
  "cover": "https://assets.st-note.com/production/uploads/images/154811445/rectangle_large_type_2_3e055f27c2dacf69818e7bc043a3de6c.png?fit=bounds&quality=85&width=1280?width=360",
  "noteUrl": "https://note.com/benkein/n/n937420c02701",
  "paid": true
 },
 {
  "slug": "n6c49f4179168",
  "title": "100日後にインプレゾンビになる僕",
  "date": "2024-09-17",
  "excerpt": "",
  "tags": [],
  "cover": "https://assets.st-note.com/production/uploads/images/154683874/rectangle_large_type_2_863757d8d5f5a921cc713c7b5d7561f9.png?fit=bounds&quality=85&width=1280?width=360",
  "noteUrl": "https://note.com/benkein/n/n6c49f4179168"
 },
 {
  "slug": "n570eaf4d702d",
  "title": "moon × girl",
  "date": "2024-09-12",
  "excerpt": "moon girl moon girl2 moon girl3",
  "tags": [],
  "cover": "https://assets.st-note.com/img/1726145813-zNH73bfSeGdCIMp2n8mTZuwv.png?width=360",
  "noteUrl": "https://note.com/benkein/n/n570eaf4d702d"
 },
 {
  "slug": "n7aea30ef5ef5",
  "title": "iT48 似た写真を完全無料で生成する方法（違法活用×悪用厳禁×）",
  "date": "2024-09-07",
  "excerpt": "TikTokなどでTTPをしたい人向けにバズる方法の一つとして、合法的な近道の一つをお伝えします。今回の例として、著作権をフリーのものを使っています。大々的にお伝えしたくないので、数量を最低限にしています🙇‍♂️何度もい",
  "tags": [],
  "cover": "https://assets.st-note.com/production/uploads/images/153454237/rectangle_large_type_2_8a764369fdcb3cf83bbc06cc41db2ef2.png?fit=bounds&quality=85&width=1280?width=360",
  "noteUrl": "https://note.com/benkein/n/n7aea30ef5ef5",
  "paid": true
 },
 {
  "slug": "n5c6011b7a596",
  "title": "奇妙な短編-10作品",
  "date": "2024-09-07",
  "excerpt": "お好きな短編をお読みいただけると幸いです。 （無料ですべての短編をお楽しみいただけます。） 最後に、作り方を紹介していますのでご興味ありましたらどうぞ。 Bluetooth ――その音は、確かに私の耳に入ってきた。 時刻",
  "tags": [],
  "cover": "https://assets.st-note.com/production/uploads/images/153373339/rectangle_large_type_2_5e6d34eb91848f9855336f0e575de6dc.png?fit=bounds&quality=85&width=1280?width=360",
  "noteUrl": "https://note.com/benkein/n/n5c6011b7a596",
  "paid": true
 },
 {
  "slug": "n24aaaf6f12fd",
  "title": "!T47 ChatGPT解説#2",
  "date": "2024-09-06",
  "excerpt": "２話です。よろしくです。 第2章：ChatGPTと会話してみよう 山田さんは田中さんに教えられ、ChatGPTに興味を持ち始めました。そしてついに、自分でも使ってみることを決意します。田中さんは、ChatGPTのアカウン",
  "tags": [],
  "cover": "https://assets.st-note.com/production/uploads/images/153362813/rectangle_large_type_2_d98e6cc981cb7d76e88570b3127e6ba7.png?fit=bounds&quality=85&width=1280?width=360",
  "noteUrl": "https://note.com/benkein/n/n24aaaf6f12fd"
 },
 {
  "slug": "n8a1890b2ac44",
  "title": "!T46 ChatGPT解説#1",
  "date": "2024-09-05",
  "excerpt": "皆さん、これまでの仕事や生活で「どうしたらもっと効率的にできるんだろう？」と悩んだことはありませんか？新しい副業を始めたいけれど、どこから手をつけたらいいかわからない。そんな悩みを抱える人は多いはずです。ここで登場するの",
  "tags": [],
  "cover": "https://assets.st-note.com/production/uploads/images/153260199/rectangle_large_type_2_090d5cc2a5ed85b5583678abbf9eb1bb.png?fit=bounds&quality=85&width=1280?width=360",
  "noteUrl": "https://note.com/benkein/n/n8a1890b2ac44"
 },
 {
  "slug": "n99c264fbfa45",
  "title": "!T45 脱SeaArt!! LevelUPした超有能AIツール紹介",
  "date": "2024-09-05",
  "excerpt": "Shakker.aiは、革新的な画像生成AIプラットフォームとして注目を集めています。このプラットフォームは、Stable Diffusionモデルを活用し、ユーザーが入力したテキストや画像から高品質な画像を生成する能力",
  "tags": [],
  "cover": "https://assets.st-note.com/production/uploads/images/153152548/rectangle_large_type_2_a9968ab1745275925ac4fc4b7d4d16e7.jpeg?fit=bounds&quality=85&width=1280?width=360",
  "noteUrl": "https://note.com/benkein/n/n99c264fbfa45"
 },
 {
  "slug": "nfe59c782da3f",
  "title": "iT44 Genspark簡単解説",
  "date": "2024-09-03",
  "excerpt": "はじめに Gensparkは、AIエージェントエンジンであり、ユーザーのクエリに基づいてリアルタイムでカスタムページ（Sparkpages）を生成します。 従来の検索エンジンとは異なり、Gensparkは広告やスパム、偏",
  "tags": [],
  "cover": "https://assets.st-note.com/production/uploads/images/153038246/rectangle_large_type_2_a4eae9b74e2426ca66bec837748d9603.png?fit=bounds&quality=85&width=1280?width=360",
  "noteUrl": "https://note.com/benkein/n/nfe59c782da3f",
  "paid": true
 },
 {
  "slug": "n406faa2f5685",
  "title": "iT-14-[Java勉強]",
  "date": "2023-05-24",
  "excerpt": "これまでの復習💧 Javaを学ぶと収入が上がる、他言語スキルUP Java習得の３ステップは理解、定着、実践 Javaとは⇨Sun Microsystem社（現Oracle社）が1995年に発表・コンピュータにさせたい処",
  "tags": [],
  "cover": "https://assets.st-note.com/production/uploads/images/106460170/rectangle_large_type_2_75ff16f19fe179fc8104004e11a8d32e.png?fit=bounds&quality=85&width=1280?width=360",
  "noteUrl": "https://note.com/benkein/n/n406faa2f5685"
 },
 {
  "slug": "nfa46834d84e6",
  "title": "iT-13-[Java勉強]",
  "date": "2023-05-24",
  "excerpt": "これまでの復習💧 Javaを学ぶと嬉しいこと ・収入が上がる・他の言語のスキルがアップする Java習得の３ステップ ・理解（動画）・定着（授業ノート）・実践（演習問題） Javaとは ・Sun Microsystem社",
  "tags": [],
  "cover": "https://assets.st-note.com/production/uploads/images/106333295/rectangle_large_type_2_342b706ee6960ae0cc1e9690683ab40e.png?fit=bounds&quality=85&width=1280?width=360",
  "noteUrl": "https://note.com/benkein/n/nfa46834d84e6"
 },
 {
  "slug": "n89cf9870e1bc",
  "title": "iT -12- [Java勉強]",
  "date": "2023-05-23",
  "excerpt": "Javaを学ぶと嬉しいこと ・収入が上がる ・他の言語のスキルがアップする Java習得の３ステップ ・理解（動画） ・定着（授業ノート） ・実践（演習問題） Javaとは ・Sun Microsystem社（現Orac",
  "tags": [],
  "cover": "https://assets.st-note.com/production/uploads/images/106309730/rectangle_large_type_2_1364ea86a46028442a73c261f76b1431.png?fit=bounds&quality=85&width=1280?width=360",
  "noteUrl": "https://note.com/benkein/n/n89cf9870e1bc"
 },
 {
  "slug": "nd9a695eb9d9e",
  "title": "iT -11- [Team KPT]",
  "date": "2023-04-19",
  "excerpt": "未経験ながら、少しずつ勉強をしようというプロジェクトを立てました。 私は、全くの未経験・無知ですが・・・。もし、この投稿で誰かしらのお役に立てれば幸いだと思います。（まず、その前にみなさんに教えていただくことが多いかと思",
  "tags": [],
  "cover": "https://assets.st-note.com/production/uploads/images/103399077/rectangle_large_type_2_d78289ed44850fbec0a92d672b308c1f.png?fit=bounds&quality=85&width=1280?width=360",
  "noteUrl": "https://note.com/benkein/n/nd9a695eb9d9e"
 },
 {
  "slug": "n854edb6855f4",
  "title": "MOON-RADIATION vol.17(暗中)",
  "date": "2023-04-18",
  "excerpt": "ムーンラジエーション。これは造語です。 月明かりが、 放射状に全世界に広がり、 しかしラジオのようにひっそりと、 聴く者だけに届くようにと思い、 この名前を付けました。 毎日、いつものように感謝して、 何事もなく、 無難",
  "tags": [],
  "cover": "https://assets.st-note.com/production/uploads/images/167573668/rectangle_large_type_2_057aaf07cbb801b9a109ef540f0935e3.jpg?fit=bounds&quality=85&width=1280?width=360",
  "noteUrl": "https://note.com/benkein/n/n854edb6855f4"
 },
 {
  "slug": "nb5bb73dbdc6b",
  "title": "MOON-RADIATION vol.16(マイルストーン)",
  "date": "2023-04-17",
  "excerpt": "ムーンラジエーション。これは造語です。 月明かりが、 放射状に全世界に広がり、 しかしラジオのようにひっそりと、 聴く者だけに届くようにと思い、 この名前を付けました。 暑い、暑い サウナの中で、僕はテレビを見ていました",
  "tags": [],
  "cover": "https://assets.st-note.com/production/uploads/images/103284571/rectangle_large_type_2_dd031b0db650b3db2fefc63c01fe8517.png?fit=bounds&quality=85&width=1280?width=360",
  "noteUrl": "https://note.com/benkein/n/nb5bb73dbdc6b"
 },
 {
  "slug": "n36e65de7699b",
  "title": "おいらが人間を大好きな理由　3話",
  "date": "2021-08-20",
  "excerpt": "",
  "tags": [],
  "cover": "https://assets.st-note.com/production/uploads/images/59351822/rectangle_large_type_2_381e7789d863db9431a8a0d92c1d7d81.png?fit=bounds&quality=85&width=1280?width=360",
  "noteUrl": "https://note.com/benkein/n/n36e65de7699b"
 },
 {
  "slug": "ndfd10e2f2d71",
  "title": "MOON-RADIATION vol.1",
  "date": "2021-08-20",
  "excerpt": "ムーンラジエーション。これは造語です。 月明かりが、 放射状に全世界に広がり、 しかしラジオのようにひっそりと、 聴く者だけに届くようにと思い、 この名前を付けました。 noteをまだまだ使いこなせてない僕ですが、少しず",
  "tags": [],
  "cover": "https://assets.st-note.com/production/uploads/images/59345917/rectangle_large_type_2_414ef3998f8313c79545a369b25be9de.png?fit=bounds&quality=85&width=1280?width=360",
  "noteUrl": "https://note.com/benkein/n/ndfd10e2f2d71"
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
  "slug": "nd2fd81cc2523",
  "title": "吾輩に好き嫌いがない理由　2話",
  "date": "2021-08-20",
  "excerpt": "",
  "tags": [],
  "cover": "https://assets.st-note.com/production/uploads/images/59294486/rectangle_large_type_2_e700b89a817925e5aba805e7ef8c8faf.png?fit=bounds&quality=85&width=1280?width=360",
  "noteUrl": "https://note.com/benkein/n/nd2fd81cc2523"
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
  "slug": "n30913c4b046b",
  "title": "僕がセミをきらいな理由　3話",
  "date": "2021-08-19",
  "excerpt": "",
  "tags": [],
  "noteUrl": "https://note.com/benkein/n/n30913c4b046b"
 }
];
