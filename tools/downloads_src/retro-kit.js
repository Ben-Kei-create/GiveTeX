/* 90年代ホームページの部品（見本）
   1) ウインドウのボタン  2) ウインドウを動かす  3) カウンター  4) おみくじ */

/* ---- 1) ウインドウの右上のボタン：_ でたたむ、□ でもどす、× でとじる ---- */
document.addEventListener('click', function (e) {
  var b = e.target.closest('.win-t .bt'); if (!b) return;
  var w = b.closest('.win');
  if (b.classList.contains('bt-min')) w.classList.add('closed');      // 中身をかくす（retro.css の .win.closed .win-b）
  if (b.classList.contains('bt-max')) w.classList.remove('closed');   // もとにもどす
  if (b.classList.contains('bt-x')) w.style.display = 'none';          // 消す（ページを開きなおすと、もどる）
});

/* ---- 2) 青いバーをつかんで、ウインドウを動かす ---- */
(function () {
  var cur = null, sx = 0, sy = 0, bx = 0, by = 0;
  document.addEventListener('pointerdown', function (e) {
    var t = e.target.closest('.win-t'); if (!t || e.target.closest('.bt')) return;
    cur = t.parentNode; sx = e.clientX; sy = e.clientY; bx = cur._x || 0; by = cur._y || 0;   // つかんだ場所を覚える
    cur.style.position = 'relative'; cur.style.zIndex = 10;
  });
  document.addEventListener('pointermove', function (e) {
    if (!cur) return;
    cur._x = bx + e.clientX - sx; cur._y = by + e.clientY - sy;                              // 動いたぶんだけ、ずらす
    cur.style.transform = 'translate(' + cur._x + 'px,' + cur._y + 'px)';
  });
  document.addEventListener('pointerup', function () { cur = null; });
})();

/* ---- 3) カウンター：このブラウザの中だけで数える（本物は、サーバーが数を覚える） ---- */
(function () {
  var box = document.getElementById('counter'); if (!box) return;
  var n = Number(localStorage.getItem('my-counter') || 0) + 1;
  localStorage.setItem('my-counter', n);
  var s = String(n).padStart(5, '0');                    // 5けたにそろえる：7 → "00007"
  box.innerHTML = s.split('').map(function (c) { return '<b>' + c + '</b>'; }).join('');
  if (n % 100 === 0) alert('おめでとう！ ' + n + ' はキリ番です！');
})();

/* ---- 4) おみくじ：くじの中から、でたらめに1つえらぶ ---- */
(function () {
  var btn = document.getElementById('omikuji'), out = document.getElementById('omikuji-out'); if (!btn) return;
  var KUJI = [['大吉', 'なにをやってもうまくいく日！'], ['中吉', 'いい流れ。気になっていたことをやってみよう。'], ['小吉', 'ちいさな発見がある日。'], ['吉', 'いつもどおりが、いちばん。'], ['末吉', 'あとからよくなる。あせらずに。'], ['凶', '今日はゆっくり休もう。']];
  btn.addEventListener('click', function () {
    var k = KUJI[Math.floor(Math.random() * KUJI.length)];   // 0 以上 KUJI.length 未満の、でたらめな整数
    out.innerHTML = '<b style="font-size:22px;color:#d10056">' + k[0] + '</b><br>' + k[1];
  });
})();
