/* ドパ読！の本えらびコンシェルジュ
   「いまの気分・知りたいこと」から、96冊の中の3冊を AI（さくらのAI Engine）がえらぶ。
   AI が使えないとき（上限・失敗）は、ページの本の書名から、ことばの近いものをえらぶ */
(function () {
  'use strict';
  var box = document.getElementById('concierge'); if (!box) return;
  var form = box.querySelector('.cg-form'), inp = form.querySelector('input'), out = box.querySelector('.cg-out'), busy = false;
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  /* ページにある本のカードから、一覧を作る（AI が使えないときに使う） */
  var CARDS = Array.prototype.map.call(document.querySelectorAll('a.kb[href^="/books/B0"]'), function (a) {
    var img = a.querySelector('img'), sec = a.closest('section'), h = sec && sec.querySelector('h2');
    return { u: a.getAttribute('href'), t: (a.querySelector('b') || {}).textContent || '', s: (a.querySelector('small, p') || {}).textContent || '', c: img ? img.getAttribute('src') : '', g: h ? h.firstChild.textContent.replace(/^\S+\s/, '').trim() : '' };
  });
  function show(picks, note) {
    out.innerHTML = '';
    if (note) out.appendChild(el('p', 'cg-note', note));
    var g = el('div', 'cg-picks');
    picks.forEach(function (p, i) {
      var a = el('a', 'cg-card'); a.href = p.u; a.style.animationDelay = (i * .12) + 's';
      var im = el('img'); im.src = p.c; im.alt = ''; im.width = 96; im.height = 144; im.loading = 'lazy'; a.appendChild(im);
      var tx = el('span', 'cg-tx'); tx.appendChild(el('small', null, p.g || ''));
      tx.appendChild(el('b', null, p.t)); if (p.why) tx.appendChild(el('span', 'cg-why', p.why)); a.appendChild(tx); g.appendChild(a);
    });
    out.appendChild(g);
  }
  function local(q) {
    var n = q.normalize('NFKC').toLowerCase(), words = n.split(/[\s、。・/／]+|の|が|を|に|な|て|る|た|い$/).filter(function (w) { return w.length >= 2; });
    var MAP = [[/元気|げんき|勇気|前向|はげ/, ['人物', '名作']], [/こわ|怖|ホラー|呪|墓|ふしぎ|不思議/, ['歴史', '神話']], [/宇宙|科学|星|物理|自然/, ['科学']], [/心|こころ|哲学|倫理|心理|悩/, ['心理']], [/子ども|こども|子供|やさし/, ['神話', '名作']], [/天才|偉人|画家|人生/, ['人物']], [/笑|わら|おもしろ|コメディ/, ['名作']]];
    var pref = []; MAP.forEach(function (m) { if (m[0].test(n)) pref = pref.concat(m[1]); });
    var scored = CARDS.map(function (c) { var tt = (c.t + ' ' + c.s).toLowerCase(), sc = 0; words.forEach(function (w) { if (tt.indexOf(w) >= 0) sc += 3; }); pref.forEach(function (g) { if (c.g.indexOf(g) >= 0) sc += 1; }); return { c: c, sc: sc + Math.random() * .5 }; });
    scored.sort(function (a, b) { return b.sc - a.sc; });
    return scored.slice(0, 3).map(function (x) { return x.c; });
  }
  function run(q) {
    if (busy) return; busy = true; out.innerHTML = ''; out.appendChild(el('p', 'cg-wait', '本だなをさがしています…'));
    try { if (window.gtag) gtag('event', 'books_concierge'); } catch (e) {}
    fetch('/api/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mode: 'books', q: q }) })
      .then(function (r) { return r.json(); })
      .then(function (j) { if (j && j.ok && j.picks && j.picks.length) show(j.picks, '「' + q + '」なら、この3冊はどう？'); else throw 0; })
      ['catch'](function () { show(local(q), '「' + q + '」に近そうな本をえらんだよ。'); })
      .then(function () { busy = false; });
  }
  form.addEventListener('submit', function (e) { e.preventDefault(); var q = inp.value.trim(); if (q.length >= 2) run(q); else inp.focus(); });
  Array.prototype.forEach.call(box.querySelectorAll('.cg-tags button'), function (b) { b.addEventListener('click', function () { inp.value = b.textContent; run(b.textContent); }); });
})();
