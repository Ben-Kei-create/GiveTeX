/* ホーム右下のイルカ（スプライトスタッキング）
   小さなブロック（ボクセル）でイルカを組み立て、高さごとの「輪切り」を下から順に少しずつずらして重ねて描く。
   → ドット絵なのに立体に見えて、くるっと向きを変えられる。WebGL はいらない（ふつうの 2D の canvas）。
   動き：尾びれをふる（3コマ）・まばたき・ぷかぷか・ゆっくり向きを変える・ジャンプ（くるっと一回転）
   使い方：window.GTIruka.mount(入れもの, { jump: function () { return true なら ジャンプ } }) */
(function () {
  'use strict';
  if (window.GTIruka) return;
  var L = 48, W = 26, H = 30;            // 長さ（x）・はば（y）・高さ（z）
  var YC = 13, ZC = 13;                  // 体の中心
  // 体の太さ（x の位置 → 半径）。しっぽ（x=4）から、くちばしの先（x=46）まで
  var PROF = [[3, 1], [6, 1.6], [10, 2.6], [14, 3.9], [18, 5.2], [22, 6.1], [26, 6.6], [29, 6.6], [31.5, 6.2], [34, 5.3], [35.5, 3.9], [37, 2.4], [40, 2.05], [43, 1.8], [45.5, 1.3], [47, 0]];
  function rad(x) {
    if (x <= PROF[0][0] || x >= PROF[PROF.length - 1][0]) return 0;
    for (var i = 1; i < PROF.length; i++) if (x <= PROF[i][0]) { var a = PROF[i - 1], b = PROF[i], t = (x - a[0]) / (b[0] - a[0]); t = t * t * (3 - 2 * t); return a[1] + (b[1] - a[1]) * t; }
    return 0;
  }
  var C = { top: [38, 112, 196], mid: [86, 160, 232], light: [140, 196, 246], belly: [236, 247, 255], fin: [30, 96, 176], eye: [18, 16, 30], shine: [255, 255, 255], cheek: [255, 150, 186], mouth: [40, 70, 120] };

  /* ボクセルをつくる。tail：しっぽの上下（-1〜1）、blink：目をとじる */
  function model(tail, blink) {
    var V = new Array(L * W * H); function id(x, y, z) { return (z * W + y) * L + x; }
    function put(x, y, z, c) { if (x >= 0 && x < L && y >= 0 && y < W && z >= 0 && z < H) V[id(x, y, z)] = c; }
    function get(x, y, z) { return x >= 0 && x < L && y >= 0 && y < W && z >= 0 && z < H ? V[id(x, y, z)] : null; }
    for (var x = 0; x < L; x++) {
      var r = rad(x + .5); if (r <= 0) continue;
      var lift = x < 16 ? tail * 3.2 * Math.pow((16 - x) / 16, 1.6) : 0;          // しっぽの上下
      var melon = x > 29 && x < 37 ? 2.2 * Math.sin((x - 29) / 8 * Math.PI) : 0; // おでこのふくらみ
      for (var y = 0; y < W; y++) for (var z = 0; z < H; z++) {
        var dy = (y + .5 - YC) / (r * .9), dzc = z + .5 - (ZC + lift), dz = dzc / (dzc > 0 ? r * .82 + melon : r * .74);
        if (dy * dy + dz * dz <= 1) put(x, y, z, 'body');
      }
    }
    // 背びれ（うしろに流れる三角）
    for (x = 17; x < 28; x++) {
      var hgt = x < 23 ? (x - 17) / 6 * 7.5 : 7.5 - (x - 23) / 5 * 8;
      var top = ZC + rad(x + .5) * .82 - 1;
      for (var k = 0; k < hgt; k++) { var sweep = Math.round(k * k * .09 + k * .25); put(x - sweep, YC, Math.round(top + k), 'fin'); if (k < hgt * .6) put(x - sweep, YC - 1, Math.round(top + k), 'fin'); }
    }
    // 胸びれ（左右・うしろ下へ）
    [-1, 1].forEach(function (s) {
      for (var d = 0; d < 5; d++) for (var t = 0; t < 3.2 - d * .45; t++) {
        var xx = 30 - Math.round(d * 1.1) - Math.round(t), yy = YC + s * (Math.round(rad(30) * .82) + d), zz = ZC - 2 - Math.round(d * .25);
        put(xx, yy, zz, 'fin');
      }
    });
    // 尾びれ（よこに広い、うすい板。まんなかに切れこみ）
    var tz = Math.round(ZC + tail * 4.2);
    for (var dy2 = -8; dy2 <= 8; dy2++) {
      var a2 = Math.abs(dy2); if (a2 < 1) continue;
      var x1 = Math.round(1 + a2 * .22), x2 = Math.round(6.5 - a2 * .45 + (a2 < 3 ? -1 : 0));
      for (x = x1; x <= x2; x++) { put(x, YC + dy2, tz, 'fin'); if (a2 < 7) put(x, YC + dy2, tz + (tail > .3 ? -1 : 1) * (a2 < 4 ? 1 : 0), 'fin'); }
    }
    for (x = 2; x < 9; x++) for (var z2 = tz - 1; z2 <= tz + 1; z2++) put(x, YC, z2, 'fin'), put(x, YC - 1, z2, 'fin');
    // 色ぬり：高さで「背中の青 → お腹の白」、上が空いているところは少し明るく
    for (var z3 = 0; z3 < H; z3++) for (var y3 = 0; y3 < W; y3++) for (x = 0; x < L; x++) {
      var v = get(x, y3, z3); if (!v) continue;
      var col;
      if (v === 'fin') col = C.fin;
      else {
        var lift2 = x < 16 ? tail * 3.2 * Math.pow((16 - x) / 16, 1.6) : 0, rr = Math.max(1, rad(x + .5) * .78), n = (z3 + .5 - (ZC + lift2)) / rr;
        var side = Math.abs(y3 + .5 - YC) / rr;
        col = n > .35 ? C.top : n > -.05 ? (side > .7 ? C.mid : C.top) : n > -.35 ? C.light : C.belly;
      }
      if (!get(x, y3, z3 + 1)) col = col.map(function (c) { return Math.min(255, c + 10); });
      V[id(x, y3, z3)] = col;
    }
    // 顔（目・光・ほっぺ・口）：両がわの表面に
    [-1, 1].forEach(function (s) {
      function surf(x4, z4) { for (var y4 = s > 0 ? W - 1 : 0; s > 0 ? y4 >= 0 : y4 < W; y4 -= s) if (get(x4, y4, z4)) return y4; return -1; }
      var ez = ZC;
      [[33, ez], [34, ez], [33, ez + 1], [34, ez + 1], [33, ez + 2], [34, ez + 2]].forEach(function (p) { var yy = surf(p[0], p[1]); if (yy >= 0) V[id(p[0], yy, p[1])] = blink ? (p[1] === ez ? C.eye : C.top) : C.eye; });
      if (!blink) { var yh = surf(34, ez + 2); if (yh >= 0) V[id(34, yh, ez + 2)] = C.shine; }
      [[35, ZC - 2], [36, ZC - 2]].forEach(function (p) { var yy = surf(p[0], p[1]); if (yy >= 0) V[id(p[0], yy, p[1])] = C.cheek; });
      for (var xm = 37; xm <= 45; xm++) { var zm = ZC - 1, ym = surf(xm, zm); if (ym >= 0) V[id(xm, ym, zm)] = C.mouth; }
    });
    // 輪切り（高さごとの絵）
    var slices = [];
    for (var z5 = 0; z5 < H; z5++) {
      var cv = document.createElement('canvas'); cv.width = L; cv.height = W; var g = cv.getContext('2d'), im = g.createImageData(L, W), any = false;
      for (var y5 = 0; y5 < W; y5++) for (x = 0; x < L; x++) {
        var c2 = V[id(x, y5, z5)]; if (!c2) continue; any = true;
        var shade = .9 + .1 * (z5 / H); // 下の段ほど、ほんの少し暗く
        var o = (y5 * L + x) * 4; im.data[o] = c2[0] * shade; im.data[o + 1] = c2[1] * shade; im.data[o + 2] = c2[2] * shade; im.data[o + 3] = 255;
      }
      g.putImageData(im, 0, 0); slices.push(any ? cv : null);
    }
    return slices;
  }

  function mount(host, opt) {
    opt = opt || {};
    var calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    var FR = [model(-1, false), model(0, false), model(1, false)], FB = [model(-1, true), model(0, true), model(1, true)];
    var cv = document.createElement('canvas'); cv.setAttribute('aria-hidden', 'true'); host.appendChild(cv);
    var g = cv.getContext('2d'), dpr = Math.min(2, window.devicePixelRatio || 1), CW = 0, CH = 0;
    function size() { CW = host.clientWidth; CH = host.clientHeight; cv.width = Math.round(CW * dpr); cv.height = Math.round(CH * dpr); }
    size(); window.addEventListener('resize', size);
    var look = 0; document.addEventListener('pointermove', function (e) { look = (e.clientX / innerWidth - .5); }, { passive: true });
    var t0 = performance.now(), last = 0, acc = 0, jumpT = -1, nextJump = 8 + Math.random() * 6, blinkT = 2.6;
    var buf = document.createElement('canvas'), bg = buf.getContext('2d'), tint = document.createElement('canvas'), tg = tint.getContext('2d');
    function draw(t) {
      if (buf.width !== cv.width || buf.height !== cv.height) { buf.width = tint.width = cv.width; buf.height = tint.height = cv.height; }
      bg.setTransform(1, 0, 0, 1, 0, 0); bg.clearRect(0, 0, buf.width, buf.height); bg.imageSmoothingEnabled = false;
      var BH = CH / 1.4, T0 = cv.height * .4 / 1.4; // 入れものの上に、ジャンプ用のすきま（高さの4割）をとってある
      var S = Math.min(CW / (L * .74), BH / 22) * dpr;       // 1ブロックの大きさ
      var K = .36;                                        // 見下ろす角度（小さいほど横から）
      var step = S * .92;                                 // 1段ずつ上へずらす量
      var bob = Math.sin(t * 1.5) * 3 * dpr, jy = 0, spin = 0;
      if (jumpT >= 0) { var u = jumpT / 1.25; jy = -Math.sin(u * Math.PI) * BH * .3 * dpr; spin = u * Math.PI * 2; }
      var head = Math.PI + .5 + Math.sin(t * .45) * .45 + look * .8 + spin; // 向き（左むきの、ななめ手前）
      var cx = cv.width / 2, base = T0 + BH * dpr * .7 + bob + jy;
      var fi = [0, 1, 2, 1][Math.floor(t * 5) % 4], blink = blinkT < 0 && blinkT > -.14;
      var set = blink ? FB[fi] : FR[fi];
      for (var z = 0; z < H; z++) {
        var sl = set[z]; if (!sl) continue;
        for (var h = 0; h < 3; h++) { // 段のすきまが見えないように、3回にわけて描く
          bg.setTransform(1, 0, 0, 1, 0, 0);
          bg.translate(cx, base - (z + h / 3) * step); bg.scale(1, K); bg.rotate(head); bg.scale(S, S);
          bg.drawImage(sl, -L / 2, -YC);
        }
      }
      // ふちどり用に、全体を濃い紺色でぬった絵をつくる
      tg.globalCompositeOperation = 'source-over'; tg.clearRect(0, 0, tint.width, tint.height); tg.drawImage(buf, 0, 0);
      tg.globalCompositeOperation = 'source-in'; tg.fillStyle = '#0b1f45'; tg.fillRect(0, 0, tint.width, tint.height);
      g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, cv.width, cv.height); g.imageSmoothingEnabled = false;
      // かげ
      g.fillStyle = 'rgba(30,90,170,' + (.25 - Math.min(.15, -jy / cv.height * .5)).toFixed(3) + ')';
      g.beginPath(); g.ellipse(cx, T0 + BH * dpr * .84, S * 14 * (1 + jy / cv.height * .4), S * 2.6, 0, 0, 7); g.fill();
      var o = Math.max(1, Math.round(dpr * 1.2));
      [[o, 0], [-o, 0], [0, o], [0, -o]].forEach(function (d) { g.drawImage(tint, d[0], d[1]); });
      g.drawImage(buf, 0, 0);
    }
    function frame(now) {
      requestAnimationFrame(frame);
      if (document.hidden) { last = now; return; }
      var dt = (now - (last || now)) / 1000; acc += dt; last = now; if (acc < 1 / 30) return; acc = 0;
      var t = (now - t0) / 1000;
      blinkT -= 1 / 30; if (blinkT < -.14) blinkT = 2.2 + Math.random() * 3.2;
      if (jumpT >= 0) { jumpT += 1 / 30; if (jumpT > 1.25) jumpT = -1; }
      else if ((opt.jump && opt.jump()) || t > nextJump) { jumpT = 0; nextJump = t + 9 + Math.random() * 8; }
      draw(t);
    }
    if (calm) { draw(0); if (opt.onJump) {} } else requestAnimationFrame(frame);
    return { redraw: function () { draw((performance.now() - t0) / 1000); } };
  }
  window.GTIruka = { mount: mount };
})();
