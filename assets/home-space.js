/* ホームの「うしろの宇宙」と「ひみつの入口」（Three.js）
   1) うしろの宇宙：星がゆらーり回り、流れ星がシュン、ロケットが飛んでいき、UFO がふわふわ。
      ロケットと UFO は、タップ・クリックすると煙を出しながら落ちて、向きを変えて逃げていく
   2) ひみつの入口（窓の裏にかくれている 階段・扉・土管）：3D の見た目にして、さわると手ごたえ
      （ぷにっとへこむ・ぶるっとふるえる・音）。押すと、扉はひらき、土管はしずみ、階段はおりてから移動
   - Three.js は home3d.js と同じもの（cdnjs・改ざん防止チェックつき）。WebGL がないときは、いままでの絵のまま
   - 画面の外・タブを離れているあいだは止める。1秒30コマまで。動きを減らす設定の人には、宇宙は出さない */
(function () {
  'use strict';
  if (location.pathname !== '/' || window.__gtSpace) return; window.__gtSpace = true;
  var THREE_URL = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
  var THREE_SRI = 'sha512-dLxUelApnYxpLt6K2iomGngnHO83iUvZytA3YjDUCjT0HDOHKXnVYdf3hU4JjM8uEhxf9nD1/ey98U3t2vZ0qQ==';
  var calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var FPS = 1000 / 30;
  function loadThree(cb) {
    if (window.THREE) return cb(true);
    var ex = document.querySelector('script[src="' + THREE_URL + '"]');
    if (ex) { var t = setInterval(function () { if (window.THREE) { clearInterval(t); cb(true); } }, 100); setTimeout(function () { clearInterval(t); if (!window.THREE) cb(false); }, 15000); return; }
    var s = document.createElement('script'); s.src = THREE_URL; s.integrity = THREE_SRI; s.crossOrigin = 'anonymous'; s.referrerPolicy = 'no-referrer';
    s.onload = function () { cb(!!window.THREE); }; s.onerror = function () { cb(false); }; document.head.appendChild(s);
  }
  function glOK() { try { var c = document.createElement('canvas'); return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl'))); } catch (e) { return false; } }
  function soundOn() { try { return localStorage.getItem('gt-click') !== 'off'; } catch (e) { return true; } }
  var AC = null;
  function ac() { if (!AC) { var C = window.AudioContext || window.webkitAudioContext; if (!C) return null; AC = new C(); } if (AC.state === 'suspended') AC.resume(); return AC; }
  function buzz(ms) { try { if (navigator.vibrate) navigator.vibrate(ms); } catch (e) {} }
  /* 小さな効果音（音 OFF のときは鳴らさない） */
  function sfx(kind) {
    if (!soundOn()) return; var a = ac(); if (!a) return; var t = a.currentTime + .01;
    function tone(f0, f1, dur, type, vol, at) { var o = a.createOscillator(), g = a.createGain(); o.type = type; o.frequency.setValueAtTime(f0, t + (at || 0)); o.frequency.exponentialRampToValueAtTime(f1, t + (at || 0) + dur);
      g.gain.setValueAtTime(0, t + (at || 0)); g.gain.linearRampToValueAtTime(vol, t + (at || 0) + .01); g.gain.exponentialRampToValueAtTime(.0001, t + (at || 0) + dur); o.connect(g); g.connect(a.destination); o.start(t + (at || 0)); o.stop(t + (at || 0) + dur + .02); }
    function noise(dur, f0, f1, vol, at) { var n = a.createBuffer(1, Math.floor(a.sampleRate * dur), a.sampleRate), d = n.getChannelData(0); for (var i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
      var s = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain(); s.buffer = n; f.type = 'bandpass'; f.frequency.setValueAtTime(f0, t + (at || 0)); f.frequency.exponentialRampToValueAtTime(f1, t + (at || 0) + dur); g.gain.value = vol; s.connect(f); f.connect(g); g.connect(a.destination); s.start(t + (at || 0)); }
    if (kind === 'press') tone(320, 180, .09, 'sine', .12);                 // ぷにっ
    else if (kind === 'door') { tone(180, 120, .35, 'sawtooth', .025); tone(140, 90, .3, 'triangle', .05, .12); }  // ギィ…
    else if (kind === 'pipe') { tone(900, 140, .55, 'square', .04); }      // ひゅるる（土管にすいこまれる）
    else if (kind === 'stairs') { [0, .12, .24, .36].forEach(function (d, i) { tone(260 - i * 30, 200 - i * 30, .07, 'triangle', .07, d); }); } // コツコツ
    else if (kind === 'hit') { noise(.25, 1800, 300, .25); tone(700, 120, .9, 'square', .03, .05); } // ボン → ひゅるる
  }

  /* ===================================================================
     1) うしろの宇宙
     =================================================================== */
  function space() {
    var T = window.THREE, host = document.createElement('div'); host.className = 'r-sky'; host.setAttribute('aria-hidden', 'true'); document.body.insertBefore(host, document.body.firstChild);
    var r = new T.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    r.setPixelRatio(Math.min(1.5, window.devicePixelRatio || 1)); r.setClearColor(0x000000, 0); host.appendChild(r.domElement);
    var sc = new T.Scene(), cam = new T.PerspectiveCamera(50, 1, .1, 400); cam.position.set(0, 0, 30);
    var W = 1, H = 1; // z=0 の面で、画面の幅・高さ（ワールド単位）
    function size() { var w = innerWidth, h = innerHeight; r.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); H = 2 * Math.tan(cam.fov * Math.PI / 360) * cam.position.z; W = H * cam.aspect; }
    size(); window.addEventListener('resize', size);
    sc.add(new T.HemisphereLight(0xcfe0ff, 0x221133, .8)); var key = new T.DirectionalLight(0xffffff, .9); key.position.set(5, 8, 10); sc.add(key);
    var rim = new T.DirectionalLight(0x88aaff, .5); rim.position.set(-6, -3, -4); sc.add(rim);
    function std(c, ro, me, ex) { var m = new T.MeshStandardMaterial({ color: c, roughness: ro == null ? .45 : ro, metalness: me || 0 }); if (ex) for (var k in ex) m[k] = ex[k]; return m; }
    // ふんわり光る丸い絵（星・煙・星雲に使う）
    function glowTex(inner, outer) { var c = document.createElement('canvas'); c.width = c.height = 64; var g = c.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, inner); gr.addColorStop(.35, outer); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return new T.CanvasTexture(c); }
    var TEX = { star: glowTex('rgba(255,255,255,1)', 'rgba(200,220,255,.35)'), smoke: glowTex('rgba(120,120,130,.9)', 'rgba(70,70,80,.35)'), fire: glowTex('rgba(255,250,210,1)', 'rgba(255,140,40,.6)'), neb1: glowTex('rgba(150,80,255,.55)', 'rgba(90,40,200,.18)'), neb2: glowTex('rgba(40,200,220,.45)', 'rgba(20,90,160,.15)') };

    // 星（奥行きのある3層）：ゆらーりと回る
    var stars = new T.Group(); sc.add(stars);
    [[520, 60, .9], [260, 40, 1.4], [90, 25, 2.1]].forEach(function (L) {
      var g = new T.BufferGeometry(), n = L[0], p = new Float32Array(n * 3), col = new Float32Array(n * 3);
      for (var i = 0; i < n; i++) { p[i * 3] = (Math.random() - .5) * 140; p[i * 3 + 1] = (Math.random() - .5) * 90; p[i * 3 + 2] = -L[1] + Math.random() * 10;
        var tint = Math.random(); col[i * 3] = tint < .2 ? 1 : .85 + Math.random() * .15; col[i * 3 + 1] = .85 + Math.random() * .15; col[i * 3 + 2] = tint > .8 ? 1 : .9 + Math.random() * .1; }
      g.setAttribute('position', new T.BufferAttribute(p, 3)); g.setAttribute('color', new T.BufferAttribute(col, 3));
      stars.add(new T.Points(g, new T.PointsMaterial({ size: L[2] * .35, map: TEX.star, vertexColors: true, transparent: true, depthWrite: false, blending: T.AdditiveBlending, opacity: .9 })));
    });
    // 星雲（大きくて、うすく光る雲）
    var nebs = [[TEX.neb1, -28, 12, -70, 70], [TEX.neb2, 30, -14, -80, 80], [TEX.neb1, 22, 20, -90, 60]].map(function (n) { var s = new T.Sprite(new T.SpriteMaterial({ map: n[0], transparent: true, depthWrite: false, blending: T.AdditiveBlending, opacity: .55 })); s.position.set(n[1], n[2], n[3]); s.scale.set(n[4], n[4] * .7, 1); sc.add(s); return s; });

    // 流れ星（光るしっぽ）
    var streakTex = (function () { var c = document.createElement('canvas'); c.width = 128; c.height = 8; var g = c.getContext('2d'), gr = g.createLinearGradient(0, 0, 128, 0); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(.85, 'rgba(200,230,255,.9)'); gr.addColorStop(1, 'rgba(255,255,255,1)'); g.fillStyle = gr; g.fillRect(0, 2, 128, 4); return new T.CanvasTexture(c); })();
    var meteors = [];
    function meteor() {
      var m = new T.Mesh(new T.PlaneGeometry(9, .14), new T.MeshBasicMaterial({ map: streakTex, transparent: true, depthWrite: false, blending: T.AdditiveBlending }));
      var ang = -.35 - Math.random() * .5, sp = 55 + Math.random() * 35; m.rotation.z = ang;
      m.position.set(-W / 2 + Math.random() * W * .9, H / 2 * (.2 + Math.random() * .8), -6 - Math.random() * 10);
      m.userData = { vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, life: 0, max: .9 + Math.random() * .5 }; sc.add(m); meteors.push(m);
    }

    // 煙のつぶ（ロケットのけむり・やられたときの黒い煙）
    var puffs = [];
    function puff(pos, dark, big) {
      var s = new T.Sprite(new T.SpriteMaterial({ map: dark ? TEX.smoke : TEX.fire, transparent: true, depthWrite: false, opacity: dark ? .75 : .8, blending: dark ? T.NormalBlending : T.AdditiveBlending }));
      s.position.copy(pos); s.position.x += (Math.random() - .5) * .3; s.position.y += (Math.random() - .5) * .3;
      var k = (big ? 1.4 : .7) * (.7 + Math.random() * .6); s.scale.set(k, k, 1); s.userData = { life: 0, max: dark ? 1.6 : .45, grow: dark ? 1.8 : .5, vy: dark ? .6 : 0 }; sc.add(s); puffs.push(s);
      if (puffs.length > 160) { var o = puffs.shift(); sc.remove(o); o.material.dispose(); }
    }

    // ロケット
    var rocket = new T.Group(); sc.add(rocket);
    (function () {
      var white = std(0xf4f4f7, .35, .2), red = std(0xe8344e, .4, .1), metal = std(0x9aa3b5, .3, .8);
      var body = new T.Mesh(new T.CylinderGeometry(.55, .6, 2.4, 24), white); rocket.add(body);
      var nose = new T.Mesh(new T.ConeGeometry(.55, 1.2, 24), red); nose.position.y = 1.8; rocket.add(nose);
      var win = new T.Mesh(new T.SphereGeometry(.26, 18, 12), std(0x6fd3ff, .1, .3, { emissive: new T.Color(0x1a6fa0), emissiveIntensity: .6 })); win.scale.z = .5; win.position.set(0, .5, .5); rocket.add(win);
      var ring = new T.Mesh(new T.TorusGeometry(.27, .05, 8, 20), metal); ring.position.set(0, .5, .52); rocket.add(ring);
      var noz = new T.Mesh(new T.CylinderGeometry(.35, .5, .4, 20), metal); noz.position.y = -1.4; rocket.add(noz);
      for (var k = 0; k < 3; k++) { var sh = new T.Shape(); sh.moveTo(0, 0); sh.lineTo(.75, -.55); sh.lineTo(.75, -1.05); sh.lineTo(0, -.6); sh.lineTo(0, 0);
        var f = new T.Mesh(new T.ExtrudeGeometry(sh, { depth: .07, bevelEnabled: false }), red); var pv = new T.Group(); pv.rotation.y = k * Math.PI * 2 / 3; f.position.set(.5, -.45, -.035); pv.add(f); rocket.add(pv); }
      var flame = new T.Mesh(new T.ConeGeometry(.32, 1.1, 16, 1, true), new T.MeshBasicMaterial({ color: 0xffb347, transparent: true, opacity: .85, blending: T.AdditiveBlending, depthWrite: false })); flame.rotation.x = Math.PI; flame.position.y = -2.05; rocket.add(flame); rocket.userData.flame = flame;
    })();
    rocket.scale.setScalar(.75);

    // UFO
    var ufo = new T.Group(); sc.add(ufo);
    (function () {
      var P = [[0, .35], [1.1, .3], [2.0, .12], [2.2, 0], [2.0, -.12], [1.2, -.32], [.5, -.42], [0, -.44]].map(function (p) { return new T.Vector2(p[0], p[1]); });
      var hull = new T.Mesh(new T.LatheGeometry(P, 40), std(0xb8c2d6, .25, .85)); ufo.add(hull);
      var band = new T.Mesh(new T.TorusGeometry(2.05, .07, 8, 48), std(0x5b6478, .3, .9)); band.rotation.x = Math.PI / 2; ufo.add(band);
      var dome = new T.Mesh(new T.SphereGeometry(.95, 28, 16, 0, Math.PI * 2, 0, Math.PI / 2), new T.MeshPhysicalMaterial({ color: 0x9ef0ff, roughness: .05, transmission: 0, transparent: true, opacity: .6, clearcoat: 1 })); dome.position.y = .3; ufo.add(dome);
      var alien = new T.Mesh(new T.SphereGeometry(.38, 16, 12), std(0x7dff8a, .5)); alien.position.y = .55; ufo.add(alien);
      [-1, 1].forEach(function (s) { var e = new T.Mesh(new T.SphereGeometry(.09, 10, 8), std(0x111111, .2)); e.position.set(s * .14, .62, .32); ufo.add(e); });
      var lights = []; for (var i = 0; i < 10; i++) { var a = i / 10 * Math.PI * 2, l = new T.Mesh(new T.SphereGeometry(.11, 10, 8), new T.MeshBasicMaterial({ color: [0xffe34a, 0xff4fd8, 0x4af3ff][i % 3] })); l.position.set(Math.cos(a) * 1.75, -.08, Math.sin(a) * 1.75); ufo.add(l); lights.push(l); }
      ufo.userData.lights = lights;
      var beam = new T.Mesh(new T.ConeGeometry(1.6, 4.5, 24, 1, true), new T.MeshBasicMaterial({ color: 0xbaffd8, transparent: true, opacity: 0, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide })); beam.position.y = -2.6; ufo.add(beam); ufo.userData.beam = beam;
    })();
    ufo.scale.setScalar(.6);

    /* 動き：ふつう → タップされたら「やられ」 → しばらくして立てなおす */
    var R = { st: 'wait', t: 0, wait: 3, p: new T.Vector3(), v: new T.Vector3(), spin: 0 };
    var U = { st: 'fly', t: 0, base: new T.Vector3(), v: new T.Vector3(), phase: Math.random() * 6, spin: 0 };
    function launchRocket() { // 下のはしから、ななめ上へ
      var left = Math.random() < .5; R.p.set(left ? -W / 2 - 3 : W / 2 + 3, -H / 2 + Math.random() * H * .3, -4);
      var ang = left ? .45 + Math.random() * .4 : Math.PI - .45 - Math.random() * .4, sp = 6 + Math.random() * 2;
      R.v.set(Math.cos(ang) * sp, Math.sin(ang) * sp, 0); R.st = 'fly'; R.t = 0; rocket.visible = true;
    }
    function resetUfo() { U.base.set((Math.random() - .5) * W * .6, H * (.12 + Math.random() * .22), -8); U.v.set(0, 0, 0); U.st = 'fly'; U.t = 0; ufo.visible = true; ufo.rotation.set(0, 0, 0); }
    resetUfo(); rocket.visible = false;

    var tmp = new T.Vector3();
    function step(dt, time) {
      stars.rotation.z += dt * .006; stars.rotation.y = Math.sin(time * .05) * .04; // ゆらーり
      nebs.forEach(function (n, i) { n.material.opacity = .45 + Math.sin(time * .2 + i * 2) * .12; n.position.x += Math.sin(time * .03 + i) * dt * .3; });
      // 流れ星
      if (Math.random() < dt * .35) meteor();
      for (var i = meteors.length - 1; i >= 0; i--) { var m = meteors[i], d = m.userData; d.life += dt; m.position.x += d.vx * dt; m.position.y += d.vy * dt; m.material.opacity = Math.sin(Math.min(1, d.life / d.max) * Math.PI);
        if (d.life > d.max) { sc.remove(m); m.geometry.dispose(); m.material.dispose(); meteors.splice(i, 1); } }
      // ロケット
      R.t += dt;
      if (R.st === 'wait') { if (R.t > R.wait) launchRocket(); }
      else {
        if (R.st === 'fly') { rocket.userData.flame.scale.y = .8 + Math.random() * .5; rocket.userData.flame.visible = true; if (Math.random() < .7) { tmp.set(0, -2.3, 0); rocket.localToWorld(tmp); puff(tmp, false); } }
        else if (R.st === 'hit') { R.v.y -= 9 * dt; R.spin += dt * 9; rocket.userData.flame.visible = false; if (Math.random() < .9) { tmp.set(0, 0, 0); rocket.localToWorld(tmp); puff(tmp, true, true); }
          if (R.t > 1.6) { R.st = 'fly'; R.t = 0; var ang = Math.random() * Math.PI * .8 + Math.PI * .1, sp = 9; R.v.set(Math.cos(ang) * sp * (Math.random() < .5 ? -1 : 1), Math.abs(Math.sin(ang)) * sp, 0); R.spin = 0; } }
        R.p.addScaledVector(R.v, dt); rocket.position.copy(R.p);
        var dir = Math.atan2(R.v.y, R.v.x) - Math.PI / 2; rocket.rotation.set(0, R.st === 'hit' ? R.spin * .3 : time * 1.5, dir + (R.st === 'hit' ? R.spin : 0));
        if (Math.abs(R.p.x) > W / 2 + 6 || R.p.y > H / 2 + 6 || R.p.y < -H / 2 - 8) { R.st = 'wait'; R.t = 0; R.wait = 6 + Math.random() * 10; rocket.visible = false; }
      }
      // UFO
      U.t += dt; ufo.userData.lights.forEach(function (l, i) { l.visible = ((Math.floor(time * 6) + i) % 3) !== 0; });
      if (U.st === 'fly') {
        var x = U.base.x + Math.sin(time * .23 + U.phase) * W * .3, y = U.base.y + Math.sin(time * .41 + U.phase) * H * .08 + Math.sin(time * 1.7) * .25;
        ufo.position.set(x, y, U.base.z); ufo.rotation.y += dt * 1.2; ufo.rotation.z = Math.cos(time * .23 + U.phase) * .15; ufo.rotation.x = Math.sin(time * 1.3) * .06;
        var bm = ufo.userData.beam.material; bm.opacity = Math.max(0, Math.sin(time * .35 + U.phase) - .75) * .9; // ときどきビーム
      } else if (U.st === 'hit') {
        U.v.y -= 6 * dt; ufo.position.addScaledVector(U.v, dt); ufo.rotation.z += dt * (U.v.x > 0 ? -5 : 5); ufo.rotation.y += dt * 8; ufo.userData.beam.material.opacity = 0;
        if (Math.random() < .9) puff(ufo.position, true, true);
        if (U.t > 1.5) { U.st = 'recover'; U.t = 0; U.v.set((Math.random() - .5) * 10, 7, 0); }
      } else if (U.st === 'recover') {
        ufo.position.addScaledVector(U.v, dt); U.v.multiplyScalar(.985); ufo.rotation.z *= .92; ufo.rotation.y += dt * 4; if (Math.random() < .3) puff(ufo.position, true, false);
        if (U.t > 2.2) { U.base.set(ufo.position.x - Math.sin(time * .23 + U.phase) * W * .3, ufo.position.y - Math.sin(time * .41 + U.phase) * H * .08, U.base.z); U.st = 'fly'; }
        if (Math.abs(ufo.position.x) > W / 2 + 5 || ufo.position.y < -H / 2 - 5 || ufo.position.y > H / 2 + 5) { ufo.visible = false; U.st = 'gone'; U.t = 0; }
      } else if (U.st === 'gone') { if (U.t > 4) resetUfo(); }
      // 煙
      for (var j = puffs.length - 1; j >= 0; j--) { var s = puffs[j], q = s.userData; q.life += dt; var k = q.life / q.max; s.material.opacity = (1 - k) * (q.grow > 1 ? .7 : .8); s.scale.multiplyScalar(1 + dt * q.grow); s.position.y += q.vy * dt;
        if (k >= 1) { sc.remove(s); s.material.dispose(); puffs.splice(j, 1); } }
      // スクロールに合わせて、少しだけ奥の星がずれる（奥行き）
      cam.position.y = -scrollY * .0025; cam.position.x += ((px * 1.2) - cam.position.x) * .05; cam.lookAt(cam.position.x * .5, cam.position.y, 0);
    }
    var px = 0; document.addEventListener('pointermove', function (e) { px = e.clientX / innerWidth - .5; }, { passive: true });

    /* タップ・クリック：ロケット・UFO の近くなら「やられ」 */
    var BLOCK = '.win, a, button, input, textarea, select, label, .r-logo, .r-news, .r-nav, .r-sub, .r-iruka, .r-ufo, .r-toolwin, .ms-win, dialog, .bnr-wall, .r-foot p, .wl-wrap, .r-fixbtn, .gtm';
    function screenOf(obj) { tmp.copy(obj.position); tmp.project(cam); return { x: (tmp.x + 1) / 2 * innerWidth, y: (1 - tmp.y) / 2 * innerHeight }; }
    document.addEventListener('pointerdown', function (e) {
      if (e.target.closest && e.target.closest(BLOCK)) return;
      var hitR = rocket.visible && R.st === 'fly' && (function () { var s = screenOf(rocket); return Math.hypot(s.x - e.clientX, s.y - e.clientY) < 85; })();
      var hitU = ufo.visible && U.st === 'fly' && (function () { var s = screenOf(ufo); return Math.hypot(s.x - e.clientX, s.y - e.clientY) < 95; })();
      if (hitR) { R.st = 'hit'; R.t = 0; R.v.x *= .4; R.v.y = 3; sfx('hit'); buzz([20, 40, 20]); for (var i = 0; i < 6; i++) puff(rocket.position, true, true); }
      if (hitU) { U.st = 'hit'; U.t = 0; U.v.set((Math.random() - .5) * 6, 2.5, 0); sfx('hit'); buzz([20, 40, 20]); for (var j = 0; j < 6; j++) puff(ufo.position, true, true); }
      if (hitR || hitU) try { if (window.gtag) gtag('event', 'space_hit', { what: hitR ? 'rocket' : 'ufo' }); } catch (x) {}
    }, { passive: true });

    window.__gtSpaceInfo = function () { return { rocket: rocket.visible ? screenOf(rocket) : null, ufo: ufo.visible ? screenOf(ufo) : null, st: [R.st, U.st] }; }; // 確認用
    var last = 0, acc = 0, t0 = performance.now();
    (function frame(now) {
      requestAnimationFrame(frame);
      if (document.hidden) { last = now; return; }
      var dt = Math.min(.05, (now - (last || now)) / 1000); acc += now - (last || now); last = now;
      if (acc < FPS) return; var d2 = Math.min(.1, acc / 1000); acc = 0;
      step(d2, (now - t0) / 1000); r.render(sc, cam);
    })(t0);
    host.classList.add('on');
  }

  /* ===================================================================
     2) ひみつの入口（階段・扉・土管）を 3D の絵にして、さわったときの手ごたえ
     =================================================================== */
  function entrances() {
    var bts = Array.prototype.slice.call(document.querySelectorAll('.secret-bt')); if (!bts.length) return;
    var T = window.THREE, S = 168;
    var r = new T.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true }); r.setPixelRatio(1); r.setSize(S, S, false); r.setClearColor(0x000000, 0);
    function shot(build, camPos, look) {
      var sc = new T.Scene(), cam = new T.PerspectiveCamera(32, 1, .1, 50); cam.position.set(camPos[0], camPos[1], camPos[2]); cam.lookAt(look[0], look[1], look[2]);
      sc.add(new T.HemisphereLight(0xeaf2ff, 0x2a2030, .75)); var k = new T.DirectionalLight(0xffffff, .95); k.position.set(3, 6, 5); sc.add(k); var f = new T.DirectionalLight(0xffd9b0, .35); f.position.set(-4, 2, 3); sc.add(f);
      build(sc); r.render(sc, cam); var url = r.domElement.toDataURL('image/png');
      sc.traverse(function (o) { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); }); return url;
    }
    function std(c, ro, me, ex) { var m = new T.MeshStandardMaterial({ color: c, roughness: ro == null ? .6 : ro, metalness: me || 0 }); if (ex) for (var k in ex) m[k] = ex[k]; return m; }
    function box(sc, w, h, d, m, x, y, z, ry) { var o = new T.Mesh(new T.BoxGeometry(w, h, d), m); o.position.set(x, y, z); if (ry) o.rotation.y = ry; sc.add(o); return o; }
    // 階段：石のふちの中を、下へおりていく
    function stairs(sc) {
      // 石の地面に四角い穴があいていて、その中を段がおりていく
      var slab = std(0x6d6878, .9), slabTop = std(0x8a8596, .85), edge = std(0xc8c2b4, .7), wall = std(0x2e2a38, .95), stepA = std(0xc4bfcc, .75), stepB = std(0x9e98a8, .8);
      var HW = 1.05, HD = 1.1, OUT = 1.5, TH = 3.2; // 穴の半分の幅・奥行き、地面の大きさ、厚み
      box(sc, OUT * 2, TH, OUT - HD, slab, 0, -TH / 2, HD + (OUT - HD) / 2); box(sc, OUT * 2, TH, OUT - HD, slab, 0, -TH / 2, -HD - (OUT - HD) / 2);
      box(sc, OUT - HW, TH, HD * 2, slab, -HW - (OUT - HW) / 2, -TH / 2, 0); box(sc, OUT - HW, TH, HD * 2, slab, HW + (OUT - HW) / 2, -TH / 2, 0);
      box(sc, OUT * 2, .02, OUT * 2, slabTop, 0, .001, 0).visible = false;
      // 穴のふちの、明るい石
      box(sc, HW * 2 + .3, .12, .15, edge, 0, .06, HD + .075); box(sc, HW * 2 + .3, .12, .15, edge, 0, .06, -HD - .075); box(sc, .15, .12, HD * 2, edge, -HW - .075, .06, 0); box(sc, .15, .12, HD * 2, edge, HW + .075, .06, 0);
      box(sc, HW * 2, TH, .05, wall, 0, -TH / 2, -HD + .03);
      for (var i = 0; i < 6; i++) { var y = -.22 - i * .4, z = HD - .2 - i * .36;
        box(sc, HW * 2 - .02, .4, .4, i % 2 ? stepB : stepA, 0, y, z); box(sc, HW * 2 - .02, .03, .05, edge, 0, y + .2, z + .19); }
      var glow = new T.PointLight(0xffc46b, 2.2, 5); glow.position.set(0, -2.4, -.7); sc.add(glow); // 地下からもれる光
    }
    // 扉：石のわくに、木の扉。open で少しひらいて、中から光
    function door(open) {
      return function (sc) {
        var wood = std(0x7a4525, .55), wood2 = std(0x5d3319, .6), frame = std(0x8e8a96, .85), gold = std(0xf2c14e, .25, .9);
        box(sc, 2.3, .3, .5, frame, 0, 3.2, 0); box(sc, .3, 3.3, .5, frame, -1.0, 1.5, 0); box(sc, .3, 3.3, .5, frame, 1.0, 1.5, 0); box(sc, 2.6, .2, 1.2, frame, 0, -.18, .2);
        var light = new T.Mesh(new T.PlaneGeometry(1.7, 3.1), new T.MeshBasicMaterial({ color: open ? 0xd9b8ff : 0x120a18 })); light.position.set(0, 1.5, -.12); sc.add(light);
        var hinge = new T.Group(); hinge.position.set(-.85, 0, .02); hinge.rotation.y = open ? -1.05 : 0; sc.add(hinge);
        var d = new T.Mesh(new T.BoxGeometry(1.7, 3.1, .16), wood); d.position.set(.85, 1.5, 0); hinge.add(d);
        [[.85, 2.35], [.85, .75]].forEach(function (p) { var pnl = new T.Mesh(new T.BoxGeometry(1.2, 1.15, .06), wood2); pnl.position.set(p[0], p[1], .1); hinge.add(pnl); });
        var knob = new T.Mesh(new T.SphereGeometry(.11, 14, 10), gold); knob.position.set(1.45, 1.45, .16); hinge.add(knob);
        if (open) { var pl = new T.PointLight(0xc58bff, 1.6, 6); pl.position.set(0, 1.5, 1.2); sc.add(pl); }
      };
    }
    // 土管：みどりの筒と、ふち
    function pipe(sc) {
      var g = std(0x2db32d, .32, .05), g2 = std(0x37c837, .3, .05), hi = std(0x8dff8d, .3);
      var body = new T.Mesh(new T.CylinderGeometry(1, 1, 2.2, 36), g); body.position.y = -.2; sc.add(body);
      var lip = new T.Mesh(new T.CylinderGeometry(1.25, 1.25, .6, 36), g2); lip.position.y = 1.15; sc.add(lip);
      var hole = new T.Mesh(new T.CircleGeometry(1.02, 36), new T.MeshBasicMaterial({ color: 0x041204 })); hole.rotation.x = -Math.PI / 2; hole.position.y = 1.46; sc.add(hole);
      var shine = new T.Mesh(new T.BoxGeometry(.12, 2.0, .05), hi); shine.position.set(-.55, -.2, .82); shine.rotation.y = -.6; sc.add(shine);
      var shine2 = new T.Mesh(new T.BoxGeometry(.12, .45, .05), hi); shine2.position.set(-.7, 1.15, 1.02); shine2.rotation.y = -.6; sc.add(shine2);
    }
    var IMG = {
      stairs: [shot(stairs, [.8, 4.6, 3.9], [0, -.8, -.1])],
      door: [shot(door(false), [2.2, 2.3, 6.2], [0, 1.4, 0]), shot(door(true), [2.2, 2.3, 6.2], [0, 1.4, 0])],
      pipe: [shot(pipe, [2.6, 2.6, 5.2], [0, .3, 0])]
    };
    r.dispose();
    bts.forEach(function (a) {
      var lab = a.getAttribute('aria-label') || '', kind = /階段/.test(lab) ? 'stairs' : /ドア|扉/.test(lab) ? 'door' : /土管/.test(lab) ? 'pipe' : null; if (!kind) return;
      var svg = a.querySelector('svg'), name = lab.replace(/^ひみつ：/, '');
      var im = document.createElement('img'); im.src = IMG[kind][0]; im.alt = ''; im.width = 84; im.height = 84; im.className = 'sb3-img'; im.draggable = false;
      var cap = document.createElement('span'); cap.className = 'sb3-cap'; cap.textContent = name;
      a.textContent = ''; a.appendChild(im); a.appendChild(cap); a.classList.add('sb3', 'sb3-' + kind);
      // さわる：マウスなら少しかたむく。押すとへこんで、はなすと、ぽよん
      a.addEventListener('pointermove', function (e) { if (e.pointerType !== 'mouse') return; var b = a.getBoundingClientRect(), x = (e.clientX - b.left) / b.width - .5, y = (e.clientY - b.top) / b.height - .5; im.style.transform = 'perspective(300px) rotateY(' + (x * 22).toFixed(1) + 'deg) rotateX(' + (-y * 18).toFixed(1) + 'deg) translateY(-3px)'; });
      a.addEventListener('pointerleave', function () { im.style.transform = ''; a.classList.remove('push'); });
      a.addEventListener('pointerdown', function () { a.classList.remove('boing'); a.classList.add('push'); sfx('press'); buzz(12); });
      a.addEventListener('pointerup', function () { a.classList.remove('push'); void a.offsetWidth; a.classList.add('boing'); });
      a.addEventListener('click', function (e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey) return; e.preventDefault(); if (a.classList.contains('going')) return;
        a.classList.add('going', 'go-' + kind); sfx(kind); buzz(kind === 'pipe' ? [30, 30, 60] : [15, 30, 15]);
        if (kind === 'door') im.src = IMG.door[1];
        var href = a.href; setTimeout(function () { location.href = href; }, calm ? 120 : 720);
      });
    });
    document.documentElement.classList.add('sb3-on');
  }

  function start() {
    var idle = window.requestIdleCallback || function (f) { setTimeout(f, 400); };
    idle(function () {
      if (!glOK()) return;
      loadThree(function (ok) {
        if (!ok) return;
        try { entrances(); } catch (e) { console.warn(e); }
        if (!calm) try { space(); } catch (e) { console.warn(e); }
      });
    }, { timeout: 3000 });
  }
  if (document.readyState === 'complete') start(); else window.addEventListener('load', start);
})();
