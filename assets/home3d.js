/* ホームの 3D（Three.js）
   1) 左上の小さな UFO キャッチャー：アームが勝手にゆっくり動いて、ぬいぐるみをつかんだり、落としたり
   2) 右下のイルカ：ぷかぷか浮いて、ときどきジャンプ。押すと、ひとことしゃべる
   - Three.js は、ページが表示し終わってから cdnjs から読みこむ（改ざん防止のチェックつき）
   - 画面の外・タブを離れているあいだは止める。1秒に30コマまで
   - WebGL が使えない／読みこめないときは、イルカは絵文字で代わりに出る
   - 動きを減らす設定の人には、止まった絵だけ見せる（イルカは押せばしゃべる） */
(function () {
  'use strict';
  if (location.pathname !== '/' || window.__gtHome3d) return; window.__gtHome3d = true;
  var THREE_URL = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
  var THREE_SRI = 'sha512-dLxUelApnYxpLt6K2iomGngnHO83iUvZytA3YjDUCjT0HDOHKXnVYdf3hU4JjM8uEhxf9nD1/ey98U3t2vZ0qQ==';
  var calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var FPS = 1000 / 30;

  /* ---------- イルカの入れもの（3D が使えなくても、しゃべる部分は動く） ---------- */
  var LINES = ['やあ！ GiveTex へようこそ。ゆっくりしていってね', '青いタイトルバーをつかむと、窓が動かせるよ', '右のゲームコーナー、もう遊んだ？ じゃんけんはメダルが増えるよ',
    '左下のお助けツールには、手書きメモと電卓があるんだ', 'いちばん下のバナー、ぜんぶ押してみて。ブースにつながってるよ', 'メニューの「名刺」を押すと、管理人の名刺が見られるよ',
    'キリ番をふんだら、名前をのこしてね', '左上の UFO キャッチャー、たまにぬいぐるみが取れるんだ', 'ぼくは泳ぐのが得意。ジャンプも見ててね'];
  var dol = null, bubble = null, li = 0, jumpReq = false;
  function makeDolphinBox() {
    try { if (sessionStorage.getItem('gt-iruka-off') === '1') return; } catch (e) {}
    dol = document.createElement('div'); dol.className = 'r-iruka';
    dol.innerHTML = '<button type="button" class="r-iruka-hit" aria-label="イルカに話しかける"></button>' +
      '<div class="r-iruka-say" role="status" aria-live="polite" hidden><p></p>' +
      '<form class="r-iruka-ask" hidden><input type="text" maxlength="100" placeholder="サイトのこと、なんでも聞いてね" aria-label="イルカへの質問" autocomplete="off"><button type="submit">きく</button></form>' +
      '<div><button type="button" class="r-iruka-q">質問する</button><button type="button" class="r-iruka-next">つぎ</button><button type="button" class="r-iruka-bye">またね</button></div></div>';
    document.body.appendChild(dol);
    bubble = dol.querySelector('.r-iruka-say');
    dol.querySelector('.r-iruka-hit').addEventListener('click', function () { if (bubble.hidden) say(); else say(); jumpReq = true; });
    dol.querySelector('.r-iruka-next').addEventListener('click', function () { say(); jumpReq = true; });
    /* 質問する：AI（さくらのAI Engine）がサイトを案内。使えないときは、サイトの中を言葉でさがして答える */
    var form = dol.querySelector('.r-iruka-ask'), inp = form.querySelector('input'), busy = false;
    dol.querySelector('.r-iruka-q').addEventListener('click', function () { form.hidden = !form.hidden; if (!form.hidden) { bubble.querySelector('p').textContent = 'なにが知りたい？ 「ラーメンどこ？」「おすすめの本は？」みたいに聞いてね'; inp.focus(); } });
    form.addEventListener('submit', function (e) {
      e.preventDefault(); var q = inp.value.trim(); if (!q || busy) return; busy = true;
      var p = bubble.querySelector('p'); p.textContent = 'うーん、ちょっと考えるね…'; p.classList.add('thinking'); jumpReq = true;
      ask(q).then(function (ans) { busy = false; p.classList.remove('thinking'); render(p, ans); inp.value = ''; }, function () { busy = false; p.classList.remove('thinking'); localAnswer(q, p); });
      try { if (window.gtag) gtag('event', 'iruka_ask'); } catch (x) {}
    });
    dol.querySelector('.r-iruka-bye').addEventListener('click', function () {
      bubble.hidden = true; dol.classList.add('bye');
      try { sessionStorage.setItem('gt-iruka-off', '1'); } catch (e) {}
      setTimeout(function () { dol.remove(); }, 600);
    });
    // はじめての人には、少したってから自分であいさつ
    var greeted = false; try { greeted = sessionStorage.getItem('gt-iruka-hi') === '1'; sessionStorage.setItem('gt-iruka-hi', '1'); } catch (e) {}
    if (!greeted) setTimeout(function () { if (bubble && bubble.hidden) { li = 0; say(); setTimeout(function () { if (bubble && li === 1) bubble.hidden = true; }, 6500); } }, 4500);
  }
  function ask(q) {
    return fetch('/api/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mode: 'guide', q: q }) })
      .then(function (r) { return r.json(); }).then(function (j) { if (j && j.ok && j.text) return j.text; throw new Error('fallback'); });
  }
  /* 答えの [名前](/パス) だけをリンクにする（ほかは、ただの文字） */
  function render(p, txt) {
    p.textContent = ''; var re = /\[([^\]]{1,40})\]\((\/[^)\s]{0,120})\)/g, last = 0, m;
    while ((m = re.exec(txt))) { p.appendChild(document.createTextNode(txt.slice(last, m.index))); var a = document.createElement('a'); a.href = m[2]; a.textContent = m[1]; p.appendChild(a); last = re.lastIndex; }
    p.appendChild(document.createTextNode(txt.slice(last)));
  }
  /* AI が使えないとき：サイトの索引から、ことばが入っているページをさがす */
  function localAnswer(q, p) {
    function go() {
      var I = window.SITE_INDEX || [], n = q.normalize('NFKC').toLowerCase().replace(/[\s?？。、!！]|って|どこ|ある|おしえて|教えて|ください|の(本|記事|アプリ)?$/g, '');
      var hit = n.length < 1 ? [] : I.filter(function (x) { return x.t.normalize('NFKC').toLowerCase().indexOf(n) >= 0 && x.u.charAt(0) === '/'; }).slice(0, 2);
      if (hit.length) render(p, 'これかな？ ' + hit.map(function (x) { return '[' + x.t.slice(0, 22) + '](' + x.u + ')'; }).join('　'));
      else render(p, 'ごめんね、うまく答えられなかった…。[サイトマップ](/sitemap/) から探してみて！');
    }
    if (window.SITE_INDEX) return go();
    var s = document.createElement('script'); s.src = '/assets/site-index.js'; s.onload = go; s.onerror = go; document.head.appendChild(s);
  }
  function say() { bubble.querySelector('p').textContent = LINES[li % LINES.length]; li++; bubble.hidden = false; try { if (window.gtag) gtag('event', 'iruka_talk'); } catch (e) {} }

  /* ---------- Three.js の読みこみ ---------- */
  function loadThree(cb) {
    if (window.THREE) return cb(true);
    var s = document.createElement('script'); s.src = THREE_URL; s.integrity = THREE_SRI; s.crossOrigin = 'anonymous'; s.referrerPolicy = 'no-referrer';
    s.onload = function () { cb(!!window.THREE); }; s.onerror = function () { cb(false); };
    document.head.appendChild(s);
  }
  function glOK() { try { var c = document.createElement('canvas'); return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl'))); } catch (e) { return false; } }

  /* 小さな 3D 画面を1つ作る（透明な背景・画面の外では止まる） */
  function stage(host, fov, camPos) {
    var T = window.THREE, cv = document.createElement('canvas'); cv.setAttribute('aria-hidden', 'true'); host.appendChild(cv);
    var r = new T.WebGLRenderer({ canvas: cv, antialias: true, alpha: true, powerPreference: 'low-power' });
    r.setPixelRatio(Math.min(2, window.devicePixelRatio || 1)); r.setClearColor(0x000000, 0);
    var sc = new T.Scene(), cam = new T.PerspectiveCamera(fov, 1, .1, 50); cam.position.set(camPos[0], camPos[1], camPos[2]);
    function size() { var w = host.clientWidth, h = host.clientHeight; if (!w || !h) return; r.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); }
    size(); window.addEventListener('resize', size);
    var on = true;
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { on = es[0].isIntersecting; }).observe(host);
    return { T: T, r: r, sc: sc, cam: cam, visible: function () { return on && !document.hidden; } };
  }
  function lights(sc, T, warm) {
    sc.add(new T.HemisphereLight(0xdfefff, 0x302040, .55));
    var k = new T.DirectionalLight(0xffffff, .95); k.position.set(2.5, 4, 3.5); sc.add(k);
    var f = new T.DirectionalLight(warm || 0xffc6e8, .5); f.position.set(-3, 1.5, 2); sc.add(f);
    var b = new T.DirectionalLight(0x9fd8ff, .55); b.position.set(0, 2, -4); sc.add(b);
  }
  function std(T, color, rough, metal, extra) { var m = new T.MeshStandardMaterial({ color: color, roughness: rough == null ? .5 : rough, metalness: metal || 0 }); if (extra) for (var k in extra) m[k] = extra[k]; return m; }

  /* =====================================================================
     1) UFO キャッチャー
     ===================================================================== */
  function ufo(host) {
    var S = stage(host, 30, [0, 2.1, 7.5]), T = S.T, sc = S.sc; lights(sc, T);
    var root = new T.Group(); sc.add(root); S.cam.lookAt(0, 1.85, 0);
    var PINK = 0xff3d9a, PINK2 = 0xff8cc8, WHITE = 0xf7f3ff;
    var box = function (w, h, d, m, x, y, z) { var o = new T.Mesh(new T.BoxGeometry(w, h, d), m); o.position.set(x, y, z); root.add(o); return o; };
    // 台（下の箱）と白いライン、取り出し口
    var mPink = std(T, PINK, .35, .05), mWhite = std(T, WHITE, .4), mDark = std(T, 0x1a1028, .8), mChrome = std(T, 0xd9dde8, .18, .9);
    box(2.3, 1.05, 1.9, mPink, 0, .525, 0); box(2.32, .07, 1.92, mWhite, 0, .9, 0); box(2.32, .05, 1.92, mWhite, 0, .12, 0);
    box(.62, .38, .05, mDark, -.72, .42, .96); box(.68, .05, .08, mChrome, -.72, .64, .97);
    // 操作パネルとボタン
    box(.9, .12, .3, std(T, 0x3a2a5a, .5), .55, .98, .95);
    var btn = function (c, x) { var b = new T.Mesh(new T.CylinderGeometry(.07, .07, .05, 20), std(T, c, .3, 0, { emissive: new T.Color(c), emissiveIntensity: .25 })); b.position.set(x, 1.06, .95); root.add(b); };
    btn(0xffe24a, .35); btn(0x4ad7ff, .58); btn(0xff4a6a, .8);
    // 景品のエリアの床
    box(2.1, .04, 1.7, std(T, 0xfff3c4, .7), 0, 1.06, 0);
    // 落とし口（左前の四角い穴）
    box(.6, .02, .5, mDark, -.72, 1.085, .55);
    var gate = new T.Mesh(new T.BoxGeometry(.62, .22, .03), new T.MeshStandardMaterial({ color: 0xbfefff, transparent: true, opacity: .35, roughness: .1 })); gate.position.set(-.72, 1.18, .29); root.add(gate);
    // 柱
    [[-1.1, -.9], [1.1, -.9], [-1.1, .9], [1.1, .9]].forEach(function (p) { box(.08, 1.9, .08, mPink, p[0], 2.0, p[1]); });
    // ガラス（すきとおった4面）
    var glass = new T.MeshPhysicalMaterial({ color: 0xd8f3ff, roughness: .05, metalness: 0, transparent: true, opacity: .14, side: T.DoubleSide, depthWrite: false, clearcoat: 1 });
    [[2.2, 0, 0, .925], [2.2, 0, 0, -.925], [1.84, Math.PI / 2, -1.125, 0], [1.84, Math.PI / 2, 1.125, 0]].forEach(function (g) { // 前・後ろ・左・右
      var m = new T.Mesh(new T.PlaneGeometry(g[0], 1.9), glass); m.rotation.y = g[1]; m.position.set(g[2], 2.0, g[3]); root.add(m); });
    // 屋根と看板（文字は画像で作る）
    box(2.4, .42, 2.0, mPink, 0, 3.15, 0); box(2.42, .05, 2.02, mWhite, 0, 2.95, 0);
    var cv = document.createElement('canvas'); cv.width = 512; cv.height = 96; var g2 = cv.getContext('2d');
    var grd = g2.createLinearGradient(0, 0, 512, 0); grd.addColorStop(0, '#2a0b4a'); grd.addColorStop(1, '#4a0b3a'); g2.fillStyle = grd; g2.fillRect(0, 0, 512, 96);
    g2.font = 'bold 54px "DotGothic16", "Arial Black", sans-serif'; g2.textAlign = 'center'; g2.textBaseline = 'middle';
    g2.shadowColor = '#ff4fd8'; g2.shadowBlur = 18; g2.fillStyle = '#fff36b'; g2.fillText('UFO CATCHER', 256, 50);
    var tex = new T.CanvasTexture(cv);
    var sign = new T.Mesh(new T.PlaneGeometry(2.0, .38), new T.MeshBasicMaterial({ map: tex, toneMapped: false })); sign.position.set(0, 3.16, 1.011); root.add(sign);
    // 電球（チカチカ）
    var bulbs = [], BC = [0xfff36b, 0xff6bd5, 0x6bf3ff];
    for (var i = 0; i < 11; i++) { var bm = new T.MeshBasicMaterial({ color: BC[i % 3], toneMapped: false }); var b = new T.Mesh(new T.SphereGeometry(.035, 10, 8), bm); b.position.set(-1.1 + i * .22, 3.4, 1.0); root.add(b); bulbs.push(b); }
    // 中のライト
    var pl = new T.PointLight(0xfff0d0, .9, 6); pl.position.set(0, 2.85, .3); root.add(pl);
    // レールとアーム
    box(2.0, .04, .06, mChrome, 0, 2.86, 0);
    var car = new T.Group(); root.add(car); car.position.set(0, 2.82, 0);
    var carBox = new T.Mesh(new T.BoxGeometry(.22, .1, .22), mChrome); car.add(carBox);
    var cable = new T.Mesh(new T.CylinderGeometry(.012, .012, 1, 8), std(T, 0x777788, .4, .6)); car.add(cable);
    var claw = new T.Group(); car.add(claw);
    var hub = new T.Mesh(new T.CylinderGeometry(.09, .07, .1, 16), mChrome); claw.add(hub);
    var arms = [];
    for (var k = 0; k < 3; k++) {
      var pv = new T.Group(); pv.rotation.y = k * Math.PI * 2 / 3; claw.add(pv);
      var hinge = new T.Group(); hinge.position.set(.07, -.03, 0); pv.add(hinge);
      var a1 = new T.Mesh(new T.BoxGeometry(.025, .2, .03), mChrome); a1.position.set(.0, -.1, 0); hinge.add(a1);
      var a2 = new T.Mesh(new T.BoxGeometry(.025, .1, .03), mChrome); a2.position.set(-.03, -.22, 0); a2.rotation.z = .6; hinge.add(a2);
      arms.push(hinge);
    }
    // ぬいぐるみ（くま・うさぎ・ねこ）
    var COLS = [0xffb3c7, 0xbfe3ff, 0xfff0a8, 0xc9f2c0, 0xe0c8ff, 0xffcfa0, 0xf6f6f6];
    var toys = [];
    function plush(c, kind) {
      var g = new T.Group(), m = std(T, c, .95), dark = std(T, 0x2a1a22, .6);
      var bd = new T.Mesh(new T.SphereGeometry(.15, 18, 14), m); bd.scale.set(1, .9, .95); bd.position.y = .14; g.add(bd);
      var hd = new T.Mesh(new T.SphereGeometry(.13, 18, 14), m); hd.position.y = .36; g.add(hd);
      [-1, 1].forEach(function (s) {
        var e = new T.Mesh(new T.SphereGeometry(kind === 1 ? .045 : .05, 10, 8), m); // 耳（1=うさぎ 2=ねこ ほか=くま）
        if (kind === 1) { e.scale.set(.8, 2.6, .8); e.position.set(s * .06, .52, 0); } else if (kind === 2) { e.scale.set(1, 1.4, .5); e.position.set(s * .08, .48, 0); e.rotation.z = -s * .4; } else e.position.set(s * .09, .46, 0);
        g.add(e);
        var ey = new T.Mesh(new T.SphereGeometry(.018, 8, 6), dark); ey.position.set(s * .045, .38, .115); g.add(ey);
      });
      var ns = new T.Mesh(new T.SphereGeometry(.022, 8, 6), std(T, 0xff7aa0, .6)); ns.position.set(0, .34, .125); g.add(ns);
      return g;
    }
    function place(t, first) {
      var tries = 0, x, z;
      do { x = -.55 + Math.random() * 1.45; z = -.6 + Math.random() * 1.2; tries++; }
      while (tries < 30 && ((x < -.35 && z > .2) || toys.some(function (o) { return o !== t && Math.hypot(o.position.x - x, o.position.z - z) < .38; })));
      t.position.set(x, first ? 1.08 : 2.4, z); t.rotation.set(0, Math.random() * 6.28, 0); t.userData.vy = 0; t.userData.state = first ? 'rest' : 'fall';
    }
    for (var n = 0; n < 7; n++) { var t = plush(COLS[n], n % 3); root.add(t); toys.push(t); place(t, true); }

    // ---- アームの動き（順番に） ----
    var st = 'idle', tm = 0, target = null, hold = null, from = new T.Vector3(), to = new T.Vector3(), drop = 0, open = .55, lucky = false;
    var HOME = new T.Vector3(-.72, 2.82, .55), TOP = 2.82;
    car.position.copy(HOME);
    function ease(u) { return u < .5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2; }
    function go(s) { st = s; tm = 0; }
    function step(dt) {
      tm += dt;
      if (st === 'idle') { open = .55; if (tm > 1.6) { var c = toys.filter(function (o) { return o.userData.state === 'rest'; }); if (!c.length) return; target = c[Math.floor(Math.random() * c.length)]; from.copy(car.position); to.set(target.position.x + (Math.random() - .5) * .08, TOP, target.position.z + (Math.random() - .5) * .08); go('move'); } }
      else if (st === 'move') { var u = Math.min(1, tm / 2.6); car.position.lerpVectors(from, to, ease(u)); if (u >= 1) go('down'); }
      else if (st === 'down') { drop = Math.min(1.25, drop + dt * .55); if (drop >= 1.25 || (target && car.position.y - drop - .3 < target.position.y + .42)) { lucky = Math.random() < .55; go('grab'); } }
      else if (st === 'grab') { open = Math.max(lucky ? .02 : .2, open - dt * .7); if (tm > 1) { if (target && Math.hypot(target.position.x - car.position.x, target.position.z - car.position.z) < .2) { hold = target; hold.userData.state = 'held'; hold.userData.slip = lucky ? 99 : .25 + Math.random() * .5; } go('up'); } }
      else if (st === 'up') { drop = Math.max(0, drop - dt * .5); if (hold && drop < hold.userData.slip) { hold.userData.state = 'fall'; hold.userData.vy = 0; hold = null; } if (drop <= 0) { from.copy(car.position); to.copy(HOME); go(hold ? 'carry' : 'back'); } }
      else if (st === 'carry' || st === 'back') { var u2 = Math.min(1, tm / 2.4); car.position.lerpVectors(from, to, ease(u2)); if (u2 >= 1) { if (st === 'carry') go('release'); else go('idle'); } }
      else if (st === 'release') { open = Math.min(.7, open + dt * 1.2); if (hold && tm > .3) { hold.userData.state = 'win'; hold.userData.vy = 0; hold = null; } if (tm > 1.4) go('idle'); }
      // ケーブルとアームの見た目
      var L = .12 + drop; cable.scale.y = L; cable.position.y = -L / 2; claw.position.y = -L - .05;
      arms.forEach(function (h) { h.rotation.z = open; });
      // ぬいぐるみ
      toys.forEach(function (o) {
        var d = o.userData;
        if (d.state === 'held') { var wp = new T.Vector3(); claw.getWorldPosition(wp); root.worldToLocal(wp); o.position.set(wp.x, wp.y - .5, wp.z); o.rotation.z = Math.sin(performance.now() / 300) * .08; }
        else if (d.state === 'fall' || d.state === 'win') {
          d.vy -= 5.5 * dt; o.position.y += d.vy * dt;
          var floor = d.state === 'win' ? .2 : 1.08;
          if (o.position.y <= floor) { o.position.y = floor; if (d.state === 'win') { d.state = 'gone'; d.t = 0; o.visible = false; } else if (Math.abs(d.vy) > .6) d.vy = -d.vy * .3; else { d.state = 'rest'; o.rotation.z = 0; } }
        } else if (d.state === 'gone') { d.t += dt; if (d.t > 2.5) { o.visible = true; place(o, false); } }
      });
    }
    // 少しだけ左右にゆれて見せる
    var last = 0, t0 = performance.now(), acc = 0;
    function frame(now) {
      requestAnimationFrame(frame);
      if (!S.visible()) { last = now; return; }
      var dt = Math.min(.05, (now - (last || now)) / 1000); acc += now - (last || now); last = now;
      if (acc < FPS) return; acc = 0;
      var t = (now - t0) / 1000;
      if (!calm) { step(Math.min(.05, dt * 2)); root.rotation.y = Math.sin(t * .25) * .32; bulbs.forEach(function (b, i) { b.visible = ((Math.floor(t * 3) + i) % 3) !== 0; }); }
      S.r.render(sc, S.cam);
    }
    if (calm) { root.rotation.y = .25; step(0); S.r.render(sc, S.cam); } else requestAnimationFrame(frame);
  }

  /* =====================================================================
     2) イルカ
     ===================================================================== */
  function dolphin(host) {
    var S = stage(host, 28, [0, .35, 5.4]), T = S.T, sc = S.sc; lights(sc, T, 0xffe6f2);
    S.cam.lookAt(0, .05, 0);
    var root = new T.Group(); sc.add(root);
    var body = new T.Group(); root.add(body);
    // 体：横から見た太さの形をくるっと回して作る（しっぽ → 頭 → くちばし）
    var P = [[0, -1.12], [.07, -1.05], [.15, -.8], [.26, -.45], [.36, -.1], [.4, .15], [.39, .38], [.34, .58], [.27, .72], [.18, .8], [.12, .86], [.1, .96], [.085, 1.04], [.05, 1.1], [0, 1.12]];
    var geo = new T.LatheGeometry(P.map(function (p) { return new T.Vector2(p[0], p[1]); }), 48);
    geo.rotateZ(-Math.PI / 2); // 頭を +x 向きに
    // おでこ（メロン）を少しふくらませて、おなかを平らに
    var pos = geo.attributes.position, col = [], top = new T.Color(0x1f6fc4), mid = new T.Color(0x4a9ee6), belly = new T.Color(0xeaf6ff);
    for (var i = 0; i < pos.count; i++) {
      var x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
      if (x > .45 && x < .95 && y > 0) pos.setY(i, y * (1 + .22 * Math.sin((x - .45) / .5 * Math.PI)));
      if (y < 0) pos.setY(i, y * .86);
      var ny = pos.getY(i) / .42, c = new T.Color();
      if (ny > .15) c.copy(mid).lerp(top, Math.min(1, (ny - .15) / .6)); else c.copy(belly).lerp(mid, Math.max(0, (ny + .25) / .4));
      col.push(c.r, c.g, c.b);
    }
    geo.setAttribute('color', new T.Float32BufferAttribute(col, 3)); geo.computeVertexNormals();
    var skin = new T.MeshPhysicalMaterial({ vertexColors: true, roughness: .28, metalness: 0, clearcoat: .6, clearcoatRoughness: .25 });
    body.add(new T.Mesh(geo, skin));
    var blue = new T.MeshPhysicalMaterial({ color: 0x1f6fc4, roughness: .3, clearcoat: .6 });
    // 背びれ
    var sh = new T.Shape(); sh.moveTo(-.22, 0); sh.quadraticCurveTo(-.12, .2, -.28, .42); sh.quadraticCurveTo(.02, .3, .16, 0); sh.lineTo(-.22, 0);
    var fin = new T.Mesh(new T.ExtrudeGeometry(sh, { depth: .05, bevelEnabled: true, bevelThickness: .02, bevelSize: .02, bevelSegments: 3, curveSegments: 12 }), blue);
    fin.position.set(-.05, .3, -.035); body.add(fin);
    // むなびれ（パタパタ）
    var flips = [-1, 1].map(function (s) { var g = new T.Group(); g.position.set(.25, -.17, s * .3); var f = new T.Mesh(new T.SphereGeometry(.2, 16, 10), blue); f.scale.set(1.2, .18, .55); f.position.set(-.12, -.04, s * .1); f.rotation.set(s * .5, 0, -.35); g.add(f); body.add(g); return g; });
    // しっぽ（上下にふる）
    var tail = new T.Group(); tail.position.set(-1.05, 0, 0); body.add(tail);
    [-1, 1].forEach(function (s) { var f = new T.Mesh(new T.SphereGeometry(.2, 16, 10), blue); f.scale.set(.9, .14, 1.15); f.position.set(-.12, 0, s * .17); f.rotation.y = -s * .55; tail.add(f); });
    // 目（黒目＋光）とほっぺ
    var eyes = [-1, 1].map(function (s) {
      var g = new T.Group(); g.position.set(.66, .1, s * .26);
      var e = new T.Mesh(new T.SphereGeometry(.07, 18, 14), new T.MeshPhysicalMaterial({ color: 0x14121e, roughness: .15, clearcoat: 1 })); e.scale.set(.85, 1.1, .6); g.add(e);
      var hl = new T.Mesh(new T.SphereGeometry(.022, 10, 8), new T.MeshBasicMaterial({ color: 0xffffff, toneMapped: false })); hl.position.set(.03, .035, s * .035); g.add(hl);
      var hl2 = new T.Mesh(new T.SphereGeometry(.011, 8, 6), new T.MeshBasicMaterial({ color: 0xffffff, toneMapped: false })); hl2.position.set(-.012, -.03, s * .04); g.add(hl2);
      body.add(g);
      var ck = new T.Mesh(new T.SphereGeometry(.06, 12, 8), new T.MeshBasicMaterial({ color: 0xff9ac0, transparent: true, opacity: .55, toneMapped: false })); ck.scale.set(1, .55, .2); ck.position.set(.7, -.06, s * .3); body.add(ck);
      return g;
    });
    // にっこり口
    var smile = new T.Mesh(new T.TorusGeometry(.09, .01, 6, 16, Math.PI * .8), new T.MeshBasicMaterial({ color: 0x24406a })); smile.rotation.set(0, 0, Math.PI * 1.1); smile.position.set(.98, -.02, 0); smile.scale.set(1, .6, 3.6); body.add(smile);
    // 泡
    var bubs = []; for (var b = 0; b < 4; b++) { var m = new T.Mesh(new T.SphereGeometry(.05 + b * .012, 12, 10), new T.MeshPhysicalMaterial({ color: 0xcff4ff, transparent: true, opacity: .45, roughness: 0, clearcoat: 1 })); m.userData.o = b * 1.1; root.add(m); bubs.push(m); }
    // 下に、水面のかげ
    var shadow = new T.Mesh(new T.CircleGeometry(.9, 32), new T.MeshBasicMaterial({ color: 0x2a6fb8, transparent: true, opacity: .18, depthWrite: false })); shadow.rotation.x = -Math.PI / 2; shadow.position.y = -.75; shadow.scale.set(1.3, .5, 1); sc.add(shadow);

    var look = { x: 0, y: 0 }, jumpT = -1, nextJump = 7 + Math.random() * 5, blinkT = 2.5;
    document.addEventListener('pointermove', function (e) { look.x = (e.clientX / innerWidth - .5); look.y = (e.clientY / innerHeight - .5); }, { passive: true });
    var t0 = performance.now(), last = 0, acc = 0;
    function pose(t) {
      var bob = Math.sin(t * 1.4) * .07;
      root.position.y = bob; root.rotation.y = -.55 + look.x * .5; root.rotation.x = .12 + look.y * .15;
      body.rotation.z = Math.sin(t * 1.4 + 1) * .06;
      tail.rotation.z = Math.sin(t * 4) * .32;
      flips.forEach(function (f, k) { f.rotation.x = (k ? 1 : -1) * Math.sin(t * 3) * .25; });
      // まばたき
      blinkT -= 1 / 30; var bl = blinkT < 0 && blinkT > -.12 ? .12 : 1; if (blinkT < -.12) blinkT = 2.5 + Math.random() * 3;
      eyes.forEach(function (e) { e.scale.y = bl; });
      // ジャンプ（くるっと一回転）
      if (jumpT >= 0) {
        jumpT += 1 / 30; var u = jumpT / 1.3;
        if (u >= 1) { jumpT = -1; body.rotation.y = 0; body.position.y = 0; }
        else { body.position.y = Math.sin(u * Math.PI) * .55; body.rotation.z += (u * Math.PI * 2); }
      }
      bubs.forEach(function (m) { var k = ((t * .5 + m.userData.o) % 4.4) / 4.4; m.position.set(1.15 + Math.sin(k * 9 + m.userData.o) * .06, .1 + k * 1.3, .1); m.scale.setScalar(.6 + k * .6); m.material.opacity = .5 * (1 - k); });
      shadow.material.opacity = .18 - (body.position.y + bob) * .1;
    }
    function frame(now) {
      requestAnimationFrame(frame);
      if (!S.visible()) { last = now; return; }
      acc += now - (last || now); last = now; if (acc < FPS) return; acc = 0;
      var t = (now - t0) / 1000;
      if (jumpReq && jumpT < 0) { jumpReq = false; jumpT = 0; }
      if (t > nextJump && jumpT < 0) { jumpT = 0; nextJump = t + 9 + Math.random() * 8; }
      pose(t); S.r.render(sc, S.cam);
    }
    if (calm) { pose(0); S.r.render(sc, S.cam); var hit = dol && dol.querySelector('.r-iruka-hit'); if (hit) hit.addEventListener('click', function () { S.r.render(sc, S.cam); }); }
    else requestAnimationFrame(frame);
  }

  /* ---------- はじめる：ページが表示し終わって、手がすいたとき ---------- */
  function start() {
    makeDolphinBox();
    var u = document.querySelector('.r-ufo');
    var idle = window.requestIdleCallback || function (f) { setTimeout(f, 300); };
    idle(function () {
      if (!glOK()) { if (u) u.remove(); if (dol) dol.classList.add('emoji'); return; }
      loadThree(function (ok) {
        if (!ok) { if (u) u.remove(); if (dol) dol.classList.add('emoji'); return; }
        try { if (u) { ufo(u); u.classList.add('on'); } } catch (e) { if (u) u.remove(); }
        try { if (dol) { var h = document.createElement('div'); h.className = 'r-iruka-3d'; dol.insertBefore(h, dol.firstChild); dolphin(h); dol.classList.add('on'); } } catch (e) { if (dol) dol.classList.add('emoji'); }
      });
    }, { timeout: 2500 });
  }
  if (document.readyState === 'complete') start(); else window.addEventListener('load', start);
})();
