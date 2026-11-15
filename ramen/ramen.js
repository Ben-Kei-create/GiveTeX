/* ラーメンブース — スクロールで麺がのびる */
(function () {
  'use strict';
  var P = ((window.RAMEN || {}).posts || []).slice().sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); });
  function $(s) { return document.querySelector(s); }
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  var calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 食券 ---------- */
  var box = $('#tickets');
  if (!P.length) {
    var t = el('article', 'ticket empty'); var h = el('div', 'head'); h.appendChild(el('b', null, '食券')); h.appendChild(el('span', null, 'No.0000')); t.appendChild(h);
    t.appendChild(el('h3', null, 'まだ一杯も記録していません')); t.appendChild(el('p', null, '食べたラーメンを、ここに食券として並べていきます。\nスクロールして、麺だけでもすすっていってください。'));
    box.appendChild(t);
  } else P.forEach(function (p, i) {
    var t = el('article', 'ticket'); var h = el('div', 'head'); h.appendChild(el('b', null, '食券 No.' + String(P.length - i).padStart(4, '0')));
    h.appendChild(el('span', null, String(p.date).replace(/-/g, '.') + (p.area ? '　' + p.area : ''))); t.appendChild(h);
    t.appendChild(el('h3', null, p.shop || '')); if (p.menu) t.appendChild(el('p', 'menu', p.menu));
    if (p.img) { var im = el('img'); im.src = p.img; im.alt = (p.menu || p.shop || '') + 'の写真'; im.loading = 'lazy'; t.appendChild(im); }
    if (p.text) t.appendChild(el('p', null, p.text));
    if (p.score) {
      var sc = el('div', 'score');
      [['men', '麺'], ['soup', 'スープ'], ['gu', '具']].forEach(function (k) {
        if (p.score[k[0]] == null) return; sc.appendChild(el('span', null, k[1])); var d = el('span'); d.setAttribute('aria-label', k[1] + ' ' + p.score[k[0]] + '/5');
        for (var j = 1; j <= 5; j++) d.appendChild(el('i', j <= p.score[k[0]] ? 'on' : '')); sc.appendChild(d);
      });
      t.appendChild(sc);
    }
    if (p.url) { var a = el('a', null, 'お店のページ ↗'); a.href = p.url; a.target = '_blank'; a.rel = 'noopener'; t.appendChild(a); }
    box.appendChild(t);
  });

  /* ---------- 麺 ---------- */
  var NS = 'http://www.w3.org/2000/svg';
  var svg = $('.noodles'), chop = $('.chopsticks'), meterB = $('.meter b'), bowl = $('.bowl');
  var strands = [], startY = 0, endY = 0, mid = null;
  var DEFS = [{ off: -16, amp: 34, per: 170, ph: 0, w: 11 }, { off: 0, amp: 46, per: 210, ph: 1.7, w: 12 }, { off: 16, amp: 30, per: 150, ph: 3.1, w: 11 }];
  function build() {
    var docH = document.documentElement.scrollHeight, W = document.documentElement.clientWidth;
    var br = bowl.getBoundingClientRect(); startY = br.top + scrollY + br.height * 0.42; var cx = br.left + br.width / 2;
    endY = docH - 30;
    svg.setAttribute('width', W); svg.setAttribute('height', docH); svg.setAttribute('viewBox', '0 0 ' + W + ' ' + docH); svg.style.height = docH + 'px';
    svg.innerHTML = ''; strands = [];
    DEFS.forEach(function (d, k) {
      var pts = [], cum = [0], y = startY, x0 = cx + d.off, amp = Math.min(d.amp, W * 0.12);
      for (; y <= endY; y += 4) { var ramp = Math.min(1, (y - startY) / 140); pts.push([x0 + Math.sin((y - startY) / d.per * Math.PI * 2 + d.ph) * amp * ramp, y]); }
      for (var i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
      var dstr = 'M' + pts.map(function (p) { return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' L');
      var under = document.createElementNS(NS, 'path'); under.setAttribute('d', dstr); under.setAttribute('stroke', '#c99428'); under.setAttribute('stroke-width', d.w + 4);
      var top = document.createElementNS(NS, 'path'); top.setAttribute('d', dstr); top.setAttribute('stroke', k === 1 ? '#f6d77a' : '#f1cb63'); top.setAttribute('stroke-width', d.w);
      var hl = document.createElementNS(NS, 'path'); hl.setAttribute('d', dstr); hl.setAttribute('stroke', 'rgba(255,255,255,.55)'); hl.setAttribute('stroke-width', 2.5); hl.setAttribute('transform', 'translate(-2,-1)');
      [under, top, hl].forEach(function (p) { p.style.strokeDasharray = cum[cum.length - 1] + ' ' + (cum[cum.length - 1] + 10); svg.appendChild(p); });
      var s = { pts: pts, cum: cum, total: cum[cum.length - 1], paths: [under, top, hl] }; strands.push(s); if (k === 1) mid = s;
    });
    update();
  }
  function lenAtY(s, y) { var i = Math.max(0, Math.min(s.pts.length - 1, Math.round((y - startY) / 4))); return { len: s.cum[i], pt: s.pts[i] }; }
  var maxLen = 0, finished = false;
  function update() {
    if (!mid) return;
    var atBottom = innerHeight + scrollY >= document.documentElement.scrollHeight - 6;
    var target = (calm || atBottom) ? endY : Math.min(endY, scrollY + innerHeight * 0.72);
    strands.forEach(function (s) { var r = lenAtY(s, target); s.paths.forEach(function (p) { p.style.strokeDashoffset = (s.total - r.len); }); });
    var r = lenAtY(mid, target);
    chop.style.left = r.pt[0] + 'px'; chop.style.top = r.pt[1] + 'px';
    var m = (r.len * 3) / 1000; maxLen = Math.max(maxLen, m);   // 1px = 3mm くらいの見立て
    meterB.textContent = m.toFixed(2) + 'm';
    if (!finished && atBottom) { finished = true; $('.done').classList.add('show'); try { if (window.gtag) window.gtag('event', 'ramen_kanshoku'); } catch (e) {} }
  }
  var raf = 0;
  window.addEventListener('scroll', function () { if (!raf) raf = requestAnimationFrame(function () { raf = 0; update(); }); }, { passive: true });
  var rt = 0; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(build, 150); });
  window.addEventListener('load', build);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(build);
  build();
  $('.done button').addEventListener('click', function () {
    var b = this; b.textContent = '替え玉 入りまーす！';
    setTimeout(function () { window.scrollTo({ top: 0, behavior: calm ? 'auto' : 'smooth' }); b.textContent = '替え玉する'; finished = false; $('.done').classList.remove('show'); }, 600);
  });
})();
