/* Gakko ブース — 先生と生徒の道具箱
   ・上のスイッチで「先生」「生徒」を切りかえると、道具と教材が入れかわる（#sensei / #seito でも開ける）
   ・道具はぜんぶブラウザの中だけで動く。入れた名前は保存も送信もしない（記録するのは、ドリルのベスト記録などの数字だけ）
   ・教材は socafe/free.js（教材プリント PDF）と bookmarks/downloads.js（学習キット）から */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  function btn(text, cls, fn) { var b = el('button', 'gk-btn' + (cls ? ' ' + cls : ''), text); b.type = 'button'; if (fn) b.addEventListener('click', fn); return b; }
  function rnd(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem('gk-' + k); localStorage.setItem('gk-' + k, v); } catch (e) { return null; } }
  var calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function ga(n, p) { try { if (window.gtag) gtag('event', n, p || {}); } catch (e) {} }
  function toast(m, ic) { if (window.GTUI) GTUI.toast(m, { icon: ic || '✓' }); }

  /* ---------- 音（サイトの音がオンのとき） ---------- */
  var AC = null;
  function soundOn() { try { return localStorage.getItem('gt-click') !== 'off'; } catch (e) { return true; } }
  function beep(f, d, v, type, at) {
    if (!soundOn()) return;
    try {
      AC = AC || new (window.AudioContext || window.webkitAudioContext)();
      var o = AC.createOscillator(), g = AC.createGain(), t = AC.currentTime + (at || 0);
      o.type = type || 'sine'; o.frequency.setValueAtTime(f, t);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v || .12, t + .01); g.gain.exponentialRampToValueAtTime(.0001, t + d);
      o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t + d + .05);
    } catch (e) {}
  }
  function chime() { [[659, 0], [523, .45], [587, .9], [392, 1.35]].forEach(function (n) { beep(n[0], .9, .16, 'sine', n[1]); }); } // 学校のチャイム風（オリジナルの4音）
  function ok() { beep(880, .12, .1, 'triangle'); beep(1320, .18, .08, 'triangle', .08); }
  function ng() { beep(196, .25, .1, 'square'); }

  /* ---------- 名簿（番号 または 名前） ---------- */
  function roster(box) {
    var wrap = el('div');
    var r1 = el('div', 'gk-row'), seg = el('div', 'gk-seg'), mode = 'num';
    var bNum = el('button', null, '出席番号で'), bName = el('button', null, '名前を入れる');
    [bNum, bName].forEach(function (b, i) { b.type = 'button'; b.setAttribute('aria-pressed', i ? 'false' : 'true'); seg.appendChild(b); });
    r1.appendChild(seg); wrap.appendChild(r1);
    var r2 = el('div', 'gk-row'), lab = el('label', null, '人数'), n = el('input', 'gk-in'); n.type = 'number'; n.min = 2; n.max = 60; n.value = store('n') || 35; n.id = 'gk-n' + Math.random().toString(36).slice(2, 6); lab.htmlFor = n.id;
    r2.appendChild(lab); r2.appendChild(n); r2.appendChild(el('span', 'gk-hint', '1番〜' + n.value + '番')); wrap.appendChild(r2);
    n.addEventListener('input', function () { r2.lastChild.textContent = '1番〜' + (n.value || 0) + '番'; store('n', n.value); });
    var ta = el('textarea', 'gk-ta'); ta.placeholder = '1行に1人ずつ（例：あおい / そうた / ゆい …）\nここに入れた名前は、この画面の中だけで使います。保存も送信もしません。'; ta.setAttribute('aria-label', '名前（1行に1人）'); ta.hidden = true; wrap.appendChild(ta);
    function set(m) { mode = m; bNum.setAttribute('aria-pressed', m === 'num' ? 'true' : 'false'); bName.setAttribute('aria-pressed', m === 'name' ? 'true' : 'false'); r2.hidden = m !== 'num'; ta.hidden = m !== 'name'; if (m === 'name') ta.focus(); }
    bNum.addEventListener('click', function () { set('num'); }); bName.addEventListener('click', function () { set('name'); });
    box.appendChild(wrap);
    return function () {
      if (mode === 'name') return ta.value.split(/\n|、|,/).map(function (s) { return s.trim(); }).filter(Boolean);
      var k = Math.max(0, Math.min(60, parseInt(n.value, 10) || 0)), a = []; for (var i = 1; i <= k; i++) a.push(i + '番'); return a;
    };
  }

  /* ---------- 先生の道具 ---------- */
  function toolPick(body) {
    var get = roster(body), wheel = el('div', 'gk-wheel'), name = el('b', null, '？'); wheel.appendChild(name); wheel.setAttribute('aria-live', 'polite');
    var r = el('div', 'gk-row'), skip = el('input'); skip.type = 'checkbox'; skip.checked = true; skip.id = 'gk-skip';
    var sl = el('label', null, ' 一度当たった人は、次から外す'); sl.htmlFor = 'gk-skip'; sl.style.fontWeight = '500'; r.appendChild(skip); r.appendChild(sl);
    var done = [], doneBox = el('div', 'gk-done'), busy = false;
    var go = btn('🎯 指名する', null, function () {
      if (busy) return; var all = get(); var pool = skip.checked ? all.filter(function (x) { return done.indexOf(x) < 0; }) : all;
      if (!pool.length) { name.textContent = all.length ? 'みんな当たりました！' : '名簿が空です'; return; }
      busy = true; wheel.classList.remove('hit'); var win = pool[rnd(0, pool.length - 1)], steps = calm ? 1 : 22, k = 0;
      (function spin() {
        k++; name.textContent = k < steps ? all[rnd(0, all.length - 1)] : win; beep(500 + (k % 4) * 80, .04, .05, 'triangle');
        if (k < steps) setTimeout(spin, 30 + k * k * .55);
        else { busy = false; wheel.classList.add('hit'); ok(); done.push(win); var s = el('span', null, win); doneBox.appendChild(s); if (window.GTVfx) GTVfx.fire(wheel, 'kira'); }
      })();
    });
    var reset = btn('リセット', 'sub', function () { done = []; doneBox.textContent = ''; name.textContent = '？'; wheel.classList.remove('hit'); });
    var act = el('div', 'gk-row'); act.appendChild(go); act.appendChild(reset);
    body.appendChild(r); body.appendChild(wheel); body.appendChild(act); body.appendChild(doneBox);
  }

  function toolGroups(body) {
    var get = roster(body), r = el('div', 'gk-row'), lab = el('label', null, '班の数'), k = el('input', 'gk-in'); k.type = 'number'; k.min = 2; k.max = 20; k.value = store('g') || 6; k.id = 'gk-k'; lab.htmlFor = 'gk-k';
    r.appendChild(lab); r.appendChild(k); r.appendChild(btn('🎲 班をつくる', null, make)); body.appendChild(r);
    var out = el('div', 'gk-groups gk-out'); body.appendChild(out);
    function make() {
      var all = shuffle(get()), g = Math.max(2, Math.min(20, parseInt(k.value, 10) || 2)); store('g', g); out.textContent = '';
      if (!all.length) { out.textContent = '名簿が空です'; return; }
      var gs = []; for (var i = 0; i < g; i++) gs.push([]); all.forEach(function (x, i) { gs[i % g].push(x); });
      gs.forEach(function (m, i) { if (!m.length) return; var c = el('div', 'gk-group'); c.style.animationDelay = (i * .05) + 's'; c.appendChild(el('h3', null, (i + 1) + '班（' + m.length + '人）')); var ul = el('ul'); m.forEach(function (x) { ul.appendChild(el('li', null, x)); }); c.appendChild(ul); out.appendChild(c); });
      beep(660, .08, .08, 'triangle'); beep(990, .12, .07, 'triangle', .07);
    }
  }

  function timer(body, opt) {
    var wrap = el('div', 'gk-timer'), clock = el('div', 'gk-clock', '00:00'), ring = el('div', 'gk-ring'), bar = el('i'); ring.appendChild(bar);
    clock.setAttribute('role', 'timer'); clock.setAttribute('aria-live', 'off');
    var seg = el('div', 'gk-seg'), total = opt.presets[0] * 60, left = total, t = null, end = 0, phase = 0;
    opt.presets.forEach(function (m, i) { var b = el('button', null, opt.labels ? opt.labels[i] : m + '分'); b.type = 'button'; b.setAttribute('aria-pressed', i ? 'false' : 'true');
      b.addEventListener('click', function () { $$('button', seg).forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); }); stop(); phase = i; total = left = m * 60; paint(); }); seg.appendChild(b); });
    var r1 = el('div', 'gk-row'); r1.appendChild(seg); wrap.appendChild(r1); wrap.appendChild(clock); wrap.appendChild(ring);
    var start = btn('▶ スタート', null, function () { if (t) pause(); else run(); });
    var r2 = el('div', 'gk-row'); r2.appendChild(start); r2.appendChild(btn('↺ もどす', 'sub', function () { stop(); left = total; paint(); }));
    if (opt.full) r2.appendChild(btn('⛶ 大きく', 'sub', function () { var d = $('#gk-sheet'); d.classList.toggle('full'); this.textContent = d.classList.contains('full') ? '⛶ もとの大きさ' : '⛶ 大きく'; }));
    wrap.appendChild(r2);
    if (opt.note) wrap.appendChild(el('p', 'gk-hint', opt.note));
    function fmt(s) { s = Math.max(0, Math.ceil(s)); return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); }
    function paint() { clock.textContent = fmt(left); bar.style.transform = 'scaleX(' + (total ? left / total : 0) + ')'; document.title = (t ? '⏱ ' + fmt(left) + ' | ' : '') + 'Gakko ブース | GiveTex'; }
    function run() { if (left <= 0) left = total; wrap.classList.remove('end'); end = Date.now() + left * 1000; start.textContent = '⏸ 一時停止'; t = setInterval(tickT, 200); beep(880, .08, .06); paint(); }
    function pause() { clearInterval(t); t = null; start.textContent = '▶ つづける'; paint(); }
    function stop() { clearInterval(t); t = null; start.textContent = '▶ スタート'; wrap.classList.remove('end'); document.title = 'Gakko ブース | GiveTex'; }
    function tickT() { left = (end - Date.now()) / 1000; if (left <= 0) { left = 0; stop(); paint(); wrap.classList.add('end'); chime(); if (opt.done) opt.done(phase); } else paint(); }
    paint(); body.appendChild(wrap);
    return { stop: stop };
  }
  function toolTimer(body) { return timer(body, { presets: [1, 3, 5, 10, 15, 20], full: true, note: '「大きく」でプロジェクターや電子黒板に映せます。時間になると、チャイムが鳴ります（音はサイトの音の設定にしたがいます）。' }); }

  /* 計算の問題を作る（先生のプリントと、生徒のドリルで共通） */
  var KINDS = [
    ['kuku', '九九', function () { var a = rnd(1, 9), b = rnd(1, 9); return [a + ' × ' + b, a * b]; }],
    ['add', '2けたのたし算', function () { var a = rnd(10, 99), b = rnd(10, 99); return [a + ' + ' + b, a + b]; }],
    ['sub', '2けたのひき算', function () { var a = rnd(20, 99), b = rnd(10, a); return [a + ' − ' + b, a - b]; }],
    ['div', 'わり算（わりきれる）', function () { var b = rnd(2, 9), q = rnd(2, 12); return [(b * q) + ' ÷ ' + b, q]; }],
    ['pm', '正負の数', function () {
      var a = rnd(-9, 9) || 4, b = rnd(-9, 9) || -3, op = ['+', '−', '×'][rnd(0, 2)], v = op === '+' ? a + b : op === '−' ? a - b : a * b;
      function f(x) { return x < 0 ? '(−' + (-x) + ')' : '(+' + x + ')'; } return [f(a) + ' ' + op + ' ' + f(b), v]; }],
    ['eq', '一次方程式', function () {
      var x = rnd(-9, 9), a = rnd(2, 9) * (Math.random() < .25 ? -1 : 1), b = rnd(-12, 12), c = a * x + b;
      var s = (a === -1 ? '−' : a < 0 ? '−' + (-a) : a) + 'x' + (b ? (b < 0 ? ' − ' + (-b) : ' + ' + b) : '') + ' = ' + (c < 0 ? '−' + (-c) : c);
      return [s, x]; }]
  ];
  function kind(id) { for (var i = 0; i < KINDS.length; i++) if (KINDS[i][0] === id) return KINDS[i]; return KINDS[0]; }
  function neg(v) { return v < 0 ? '−' + (-v) : String(v); }

  function toolPrint(body) {
    var r = el('div', 'gk-row'), lab = el('label', null, '問題の種類'), sel = el('select', 'gk-sel'); sel.id = 'gk-kind'; lab.htmlFor = 'gk-kind';
    KINDS.forEach(function (k) { var o = el('option', null, k[1]); o.value = k[0]; sel.appendChild(o); }); sel.value = store('pk') || 'kuku';
    var nl = el('label', null, '問題数'), n = el('select', 'gk-sel'); n.id = 'gk-pn'; nl.htmlFor = 'gk-pn'; [10, 20, 30].forEach(function (v) { var o = el('option', null, v + '問'); o.value = v; n.appendChild(o); }); n.value = 20;
    r.appendChild(lab); r.appendChild(sel); r.appendChild(nl); r.appendChild(n); body.appendChild(r);
    var prev = el('div', 'gk-sheetprev'), list = el('ol', 'gk-probs'); prev.appendChild(list);
    var act = el('div', 'gk-row'); act.appendChild(btn('🔄 問題を作りなおす', 'sub', make)); act.appendChild(btn('🖨 印刷する（答えつき）', null, print));
    body.appendChild(act); body.appendChild(prev); body.appendChild(el('p', 'gk-hint', '印刷すると、1枚目が問題、2枚目が答えになります。毎回ちがう問題が出ます。'));
    var cur = [];
    function make() { store('pk', sel.value); var k = kind(sel.value), seen = {}; cur = []; var guard = 0; while (cur.length < +n.value && guard++ < 500) { var p = k[2](); if (seen[p[0]]) continue; seen[p[0]] = 1; cur.push(p); } list.textContent = ''; cur.forEach(function (p) { list.appendChild(el('li', null, p[0] + (sel.value === 'eq' ? '' : ' ='))); }); }
    function print() {
      var k = kind(sel.value), pr = $('#gk-print'); pr.textContent = '';
      [false, true].forEach(function (ans) {
        var pg = el('div', 'page'); pg.appendChild(el('h1', null, k[1] + '（' + cur.length + '問）' + (ans ? '　こたえ' : ''))); pg.appendChild(el('p', 'nm', '　　年　　組　　番　名前＿＿＿＿＿＿＿＿＿＿　　　点数　　／' + cur.length));
        var ol = el('ol', 'gk-probs'); cur.forEach(function (p) { ol.appendChild(el('li', null, p[0] + (sel.value === 'eq' ? '' : ' =') + (ans ? (sel.value === 'eq' ? '　x = ' : ' ') + neg(p[1]) : ''))); }); pg.appendChild(ol); pr.appendChild(pg);
      });
      ga('gakko_print', { kind: sel.value }); window.print();
    }
    sel.addEventListener('change', make); n.addEventListener('change', make); make();
  }

  function toolSeats(body) {
    var r = el('div', 'gk-row');
    function num(label, key, def, min, max) { var l = el('label', null, label), i = el('input', 'gk-in'); i.type = 'number'; i.min = min; i.max = max; i.value = store(key) || def; i.id = 'gk-' + key; l.htmlFor = i.id; i.addEventListener('change', function () { store(key, i.value); }); r.appendChild(l); r.appendChild(i); return i; }
    var rows = num('たて', 'sr', 6, 1, 10), cols = num('よこ', 'sc', 6, 1, 10), n = num('人数', 'n', 35, 1, 100);
    body.appendChild(r);
    var act = el('div', 'gk-row'); act.appendChild(btn('🎲 席をきめる', null, make)); act.appendChild(btn('🖨 印刷', 'sub', function () { var pr = $('#gk-print'); pr.textContent = ''; var pg = el('div', 'page'); pg.appendChild(el('h1', null, '座席表')); pg.appendChild(grid.cloneNode(true)); pr.appendChild(pg); window.print(); }));
    body.appendChild(act);
    var grid = el('div', 'gk-seats'); body.appendChild(grid); body.appendChild(el('p', 'gk-hint', '番号は出席番号です。人数が席より少ないときは、うしろの席があきます。'));
    function make() {
      var R = Math.max(1, Math.min(10, +rows.value || 1)), C = Math.max(1, Math.min(10, +cols.value || 1)), N = Math.max(1, Math.min(R * C, +n.value || 1));
      var a = []; for (var i = 1; i <= N; i++) a.push(i); a = shuffle(a); while (a.length < R * C) a.push(0);
      // あき席は、うしろの列にまとめる
      var filled = a.filter(Boolean), cells = []; for (var j = 0; j < R * C; j++) cells.push(j < filled.length ? filled[j] : 0);
      grid.textContent = ''; grid.style.gridTemplateColumns = 'repeat(' + C + ',1fr)'; grid.appendChild(el('div', 'gk-board', '黒板（前）'));
      cells.forEach(function (v, k) { var s = el('div', 'gk-seat' + (v ? '' : ' empty'), v ? String(v) : '—'); s.style.animationDelay = (k * .012) + 's'; grid.appendChild(s); });
      beep(520, .08, .08, 'triangle'); beep(780, .1, .07, 'triangle', .08);
    }
    make();
  }

  /* ---------- 生徒の道具 ---------- */
  function toolDrill(body) {
    var r = el('div', 'gk-row'), seg = el('div', 'gk-seg'), cur = store('dk') || 'kuku';
    KINDS.forEach(function (k) { var b = el('button', null, k[1]); b.type = 'button'; b.setAttribute('aria-pressed', k[0] === cur ? 'true' : 'false'); b.addEventListener('click', function () { cur = k[0]; store('dk', cur); $$('button', seg).forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); }); intro(); }); seg.appendChild(b); });
    r.appendChild(seg); body.appendChild(r);
    var stage = el('div', 'gk-quiz'); body.appendChild(stage);
    function best() { return +(store('best-' + cur) || 0); }
    function intro() {
      stage.textContent = ''; var b = best();
      stage.appendChild(el('p', 'gk-q', kind(cur)[1])).appendChild(el('small', null, '10問を、どれだけ速く解けるか。まちがえると +5秒。' + (b ? '　ベスト：' + (b / 1000).toFixed(1) + '秒' : '')));
      stage.appendChild(btn('▶ スタート', null, play));
    }
    function play() {
      var Q = [], seen = {}; while (Q.length < 10) { var p = kind(cur)[2](); if (!seen[p[0]]) { seen[p[0]] = 1; Q.push(p); } }
      var i = 0, miss = 0, t0 = Date.now(); stage.textContent = '';
      var bar = el('div', 'gk-bar'), bi = el('i'); bar.appendChild(bi); var qn = el('p', 'gk-qn'), q = el('p', 'gk-q'), form = el('form', 'gk-ans'), inp = el('input', 'gk-in');
      inp.type = 'text'; inp.inputMode = 'numeric'; inp.autocomplete = 'off'; inp.setAttribute('aria-label', 'こたえ');
      form.appendChild(inp); form.appendChild(btn('OK')); form.lastChild.type = 'submit';
      [bar, qn, q, form].forEach(function (x) { stage.appendChild(x); }); stage.appendChild(el('p', 'gk-hint', cur === 'pm' || cur === 'eq' ? 'マイナスは「-」で入力（例：-3）。' : ''));
      function show() { bi.style.width = (i * 10) + '%'; qn.textContent = 'Q' + (i + 1) + ' / 10'; q.textContent = Q[i][0] + (cur === 'eq' ? '　x = ?' : ' = ?'); inp.value = ''; inp.focus(); }
      form.addEventListener('submit', function (e) {
        e.preventDefault(); var v = parseInt(inp.value.replace('−', '-'), 10); if (isNaN(v)) return;
        if (v === Q[i][1]) { ok(); var f = el('div', 'gk-flash'); document.body.appendChild(f); setTimeout(function () { f.parentNode && f.parentNode.removeChild(f); }, 500); i++; if (i >= 10) return finish(); show(); }
        else { ng(); miss++; inp.style.animation = 'none'; void inp.offsetWidth; inp.style.animation = 'gk-shake .35s'; inp.select(); }
      });
      function finish() {
        var ms = Date.now() - t0 + miss * 5000, b = best(), nb = !b || ms < b; if (nb) store('best-' + cur, ms);
        stage.textContent = ''; var res = el('div', 'gk-result'); res.appendChild(el('b', null, (ms / 1000).toFixed(1) + '秒'));
        res.appendChild(el('p', null, (nb ? '🎉 ベスト更新！' : 'ベスト ' + (b / 1000).toFixed(1) + '秒') + '　まちがい ' + miss + '回'));
        res.appendChild(btn('もう一回', null, play)); stage.appendChild(res); chime(); if (nb && window.GTVfx) GTVfx.fire(res.firstChild, 'win');
        ga('gakko_drill', { kind: cur, sec: Math.round(ms / 1000) });
      }
      show();
    }
    intro();
  }

  var ELEMENTS = [['H', '水素'], ['He', 'ヘリウム'], ['Li', 'リチウム'], ['Be', 'ベリリウム'], ['B', 'ホウ素'], ['C', '炭素'], ['N', '窒素'], ['O', '酸素'], ['F', 'フッ素'], ['Ne', 'ネオン'],
    ['Na', 'ナトリウム'], ['Mg', 'マグネシウム'], ['Al', 'アルミニウム'], ['Si', 'ケイ素'], ['P', 'リン'], ['S', '硫黄'], ['Cl', '塩素'], ['Ar', 'アルゴン'], ['K', 'カリウム'], ['Ca', 'カルシウム'],
    ['Fe', '鉄'], ['Cu', '銅'], ['Zn', '亜鉛'], ['Ag', '銀'], ['Au', '金'], ['I', 'ヨウ素'], ['Ba', 'バリウム'], ['Mn', 'マンガン'], ['Pb', '鉛'], ['Hg', '水銀']];
  var CAPITALS = [['北海道', '札幌市'], ['岩手県', '盛岡市'], ['宮城県', '仙台市'], ['茨城県', '水戸市'], ['栃木県', '宇都宮市'], ['群馬県', '前橋市'], ['神奈川県', '横浜市'], ['石川県', '金沢市'], ['山梨県', '甲府市'],
    ['愛知県', '名古屋市'], ['三重県', '津市'], ['滋賀県', '大津市'], ['兵庫県', '神戸市'], ['島根県', '松江市'], ['香川県', '高松市'], ['愛媛県', '松山市'], ['沖縄県', '那覇市']];
  var WORDS = [['school', '学校'], ['teacher', '先生'], ['student', '生徒'], ['friend', '友だち'], ['family', '家族'], ['morning', '朝'], ['evening', '夕方'], ['library', '図書館'], ['desk', '机'], ['window', '窓'],
    ['music', '音楽'], ['science', '理科'], ['math', '数学'], ['history', '歴史'], ['homework', '宿題'], ['breakfast', '朝食'], ['lunch', '昼食'], ['dinner', '夕食'], ['weather', '天気'], ['season', '季節'],
    ['spring', '春'], ['summer', '夏'], ['autumn', '秋'], ['winter', '冬'], ['river', '川'], ['mountain', '山'], ['station', '駅'], ['hospital', '病院'], ['bridge', '橋'], ['picture', '絵・写真'],
    ['language', '言語'], ['country', '国'], ['city', '都市'], ['village', '村'], ['answer', '答え'], ['question', '質問'], ['practice', '練習する'], ['remember', '覚えている'], ['forget', '忘れる'], ['understand', '理解する']];

  /* 4択クイズ（元素・県庁所在地・英単語で共通） */
  function quiz(body, cfg) {
    var r = el('div', 'gk-row'), seg = el('div', 'gk-seg'), dir = 0;
    cfg.dirs.forEach(function (d, i) { var b = el('button', null, d); b.type = 'button'; b.setAttribute('aria-pressed', i ? 'false' : 'true'); b.addEventListener('click', function () { dir = i; $$('button', seg).forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); }); play(); }); seg.appendChild(b); });
    r.appendChild(seg); body.appendChild(r);
    var stage = el('div', 'gk-quiz'); body.appendChild(stage);
    function play() {
      var N = Math.min(10, cfg.data.length), Q = shuffle(cfg.data).slice(0, N), i = 0, score = 0, lock = false; stage.textContent = '';
      var bar = el('div', 'gk-bar'), bi = el('i'); bar.appendChild(bi); var qn = el('p', 'gk-qn'), q = el('p', 'gk-q'), ch = el('div', 'gk-choices'); [bar, qn, q, ch].forEach(function (x) { stage.appendChild(x); });
      function show() {
        lock = false; bi.style.width = (i * 100 / N) + '%'; qn.textContent = 'Q' + (i + 1) + ' / ' + N;
        var it = Q[i], ask = it[dir], ans = it[1 - dir]; q.textContent = ask; q.appendChild(el('small', null, cfg.ask[dir]));
        var opts = shuffle([ans].concat(shuffle(cfg.data.filter(function (x) { return x !== it; })).slice(0, 3).map(function (x) { return x[1 - dir]; })));
        ch.textContent = ''; opts.forEach(function (o) { var b = el('button', null, o); b.type = 'button'; b.addEventListener('click', function () {
          if (lock) return; lock = true;
          if (o === ans) { b.classList.add('ok'); score++; ok(); } else { b.classList.add('ng'); ng(); $$('button', ch).forEach(function (x) { if (x.textContent === ans) x.classList.add('ok'); }); }
          setTimeout(function () { i++; if (i < N) show(); else end(); }, o === ans ? 550 : 1300);
        }); ch.appendChild(b); });
      }
      function end() {
        var key = 'q-' + cfg.id, b = +(store(key) || 0); if (score > b) store(key, score);
        stage.textContent = ''; var res = el('div', 'gk-result'); res.appendChild(el('b', null, score + ' / ' + N));
        res.appendChild(el('p', null, score === N ? '💯 全問正解！' : score >= N * .7 ? 'いいかんじ！ もう少しで満点' : 'くりかえすと、ちゃんと覚えられます')); res.appendChild(btn('もう一回', null, play)); stage.appendChild(res);
        if (score === N) { chime(); if (window.GTVfx) GTVfx.fire(res.firstChild, 'win'); }
        ga('gakko_quiz', { id: cfg.id, score: score });
      }
      show();
    }
    play();
  }

  function toolStudy(body) {
    var cnt = el('p', 'gk-hint'); var day = new Date().toISOString().slice(0, 10);
    function paintC() { var d = store('pomo-day') === day ? +(store('pomo') || 0) : 0; cnt.textContent = '今日の集中：🍅 × ' + d + '　（25分集中して、5分休む。これを1回と数えます）'; }
    timer(body, { presets: [25, 5, 15], labels: ['集中 25分', '休けい 5分', '長い休けい 15分'], note: '', done: function (ph) { if (ph === 0) { var d = store('pomo-day') === day ? +(store('pomo') || 0) : 0; store('pomo-day', day); store('pomo', d + 1); paintC(); toast('おつかれさま！ 5分休けいしよう', '🍅'); } } });
    body.appendChild(cnt); paintC();
  }

  var TOOLS = {
    sensei: [
      ['pick', '🎯', '指名ルーレット', '出席番号か名前から、ランダムに1人。一度当たった人は外せます。', toolPick],
      ['groups', '🧩', '班分けメーカー', '人数と班の数を決めるだけ。ボタン1つで、なるべく同じ人数に分けます。', toolGroups],
      ['timer', '⏱', '授業タイマー', '1分〜20分。大きく映せて、終わるとチャイムが鳴ります。', toolTimer],
      ['print', '🖨', '計算プリントメーカー', '九九・正負の数・一次方程式など。毎回ちがう問題を、答えつきで印刷。', toolPrint],
      ['seats', '🪑', '席がえくじ', 'たて×よこの席に、出席番号をランダムに。座席表を印刷できます。', toolSeats]
    ],
    seito: [
      ['drill', '⚡', '計算タイムアタック', '10問を解くタイムを計ります。九九から一次方程式まで。ベスト記録つき。', toolDrill],
      ['elem', '⚗️', '元素記号クイズ', 'H は？ 鉄は？ よく出る30の元素を、記号⇄名前の4択で。', function (b) { quiz(b, { id: 'elem', data: ELEMENTS, dirs: ['記号 → 名前', '名前 → 記号'], ask: ['この元素の名前は？', 'この元素の記号は？'] }); }],
      ['ken', '🗾', '県庁所在地クイズ', '県の名前と、県庁所在地の名前がちがう17の県（道）だけを出題。', function (b) { quiz(b, { id: 'ken', data: CAPITALS, dirs: ['県 → 県庁所在地', '県庁所在地 → 県'], ask: ['県庁所在地は？', 'どこの県庁所在地？'] }); }],
      ['eng', '🔤', '英単語クイズ', '中学1〜2年でよく出る40語。英語⇄日本語の4択。', function (b) { quiz(b, { id: 'eng', data: WORDS, dirs: ['英語 → 日本語', '日本語 → 英語'], ask: ['日本語の意味は？', '英語では？'] }); }],
      ['pomo', '🍅', '勉強タイマー', '25分集中して5分休む「ポモドーロ」。今日がんばった回数を数えます。', toolStudy]
    ]
  };

  /* ---------- 教材と読みもの ---------- */
  function resources(role) {
    var list = [];
    var study = (window.SOCAFE_FREE || []).filter(function (x) { return x.cat === 'study'; });
    study.forEach(function (x) { list.push(['📄', x.title, (x.desc || '').slice(0, 60) + '（PDF・' + (x.n || '') + (x.n ? 'ページ' : '') + '）', '/socafe/dl/' + x.file]); });
    if (role === 'sensei') {
      (window.DOWNLOADS || []).forEach(function (x) { list.push(['🗂', x.title, x.desc.slice(0, 60) + '…（zip）', '/downloads/' + x.file]); });
      list.push(['☕', '素カフェ', '授業プリントやスライドに使える、バナー・アイコン・枠の素材（無料）', '/socafe/']);
    } else {
      list.push(['📚', 'ドパ読！', '神話・名作・偉人・科学・歴史を「30秒で読む」Kindle シリーズ', '/books/']);
      list.push(['📱', '学習アプリ', '漢検・化学・物理・AWS・Linux…毎日のスキマ時間に', '/apps/']);
      list.push(['🎮', 'ボードゲーム', '将棋・囲碁・チェスなど9種。CPU と対戦して考える力を', '/game/board/']);
    }
    return list;
  }

  /* ---------- 画面 ---------- */
  var sheet = $('#gk-sheet'), sbody = $('#gk-sheet-body'), cur = null, curRole = 'sensei';
  function openTool(t) {
    if (cur && cur.stop) cur.stop(); sbody.textContent = ''; sheet.classList.remove('full');
    $('#gk-sheet-h').textContent = t[2]; $('.gk-sheet-ic').textContent = t[1];
    cur = t[4](sbody) || null;
    if (sheet.showModal) { if (!sheet.open) sheet.showModal(); } else sheet.setAttribute('open', '');
    try { history.replaceState(null, '', '#' + curRole + '-' + t[0]); } catch (e) {}
    ga('gakko_tool', { tool: t[0] });
  }
  function closeTool() { if (cur && cur.stop) cur.stop(); cur = null; if (sheet.close) sheet.close(); else sheet.removeAttribute('open'); sheet.classList.remove('full'); try { history.replaceState(null, '', '#' + curRole); } catch (e) {} }
  $('.gk-x').addEventListener('click', closeTool);
  sheet.addEventListener('click', function (e) { if (e.target === sheet) closeTool(); });
  sheet.addEventListener('close', function () { if (cur && cur.stop) cur.stop(); cur = null; document.title = 'Gakko ブース（先生と生徒の道具箱） | GiveTex'; });

  function render(role, first) {
    curRole = role; document.body.setAttribute('data-role', role); store('role', role);
    $$('.gk-role button').forEach(function (b) { b.setAttribute('aria-selected', b.getAttribute('data-role') === role ? 'true' : 'false'); });
    $('#gk-panel').setAttribute('aria-labelledby', 'tab-' + role);
    $('meta[name=theme-color]').setAttribute('content', role === 'sensei' ? '#2f6b4f' : '#e8791a');
    $('#gk-tools-note').textContent = role === 'sensei' ? '授業の「ちょっと困った」を、ボタン1つで。' : '5分あれば、1つ解ける。記録はこの端末に残ります。';
    $('#gk-res-note').textContent = role === 'sensei' ? '印刷・配布OKのプリントと、授業の題材になるキット' : '教科書のとなりに、もう1冊';
    var box = $('#gk-tools'); box.textContent = '';
    TOOLS[role].forEach(function (t) {
      var b = el('button', 'gk-tool'); b.type = 'button'; b.setAttribute('data-tool', t[0]);
      b.appendChild(el('span', 'ic', t[1])); b.appendChild(el('b', null, t[2])); b.appendChild(el('span', null, t[3])); b.appendChild(el('span', 'go', 'OPEN →'));
      b.addEventListener('click', function () { openTool(t); }); box.appendChild(b);
    });
    var rb = $('#gk-res'); rb.textContent = '';
    resources(role).forEach(function (x) { var a = el('a', 'gk-r'); a.href = x[3]; if (/\.(pdf|zip)$/.test(x[3])) { a.target = '_blank'; a.rel = 'noopener'; } a.appendChild(el('span', 'ic', x[0])); a.appendChild(el('b', null, x[1])); a.appendChild(el('small', null, x[2])); rb.appendChild(a); });
    if (!first) try { history.replaceState(null, '', '#' + role); } catch (e) {}
  }
  $$('.gk-role button').forEach(function (b) {
    b.addEventListener('click', function () { var r = b.getAttribute('data-role'); if (r === curRole) return; beep(r === 'sensei' ? 520 : 780, .08, .06, 'triangle'); render(r); ga('gakko_role', { role: r }); });
    b.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { var o = $('.gk-role button[data-role=' + (curRole === 'sensei' ? 'seito' : 'sensei') + ']'); o.focus(); o.click(); } });
  });

  function boot() {
    var h = location.hash.replace('#', '').split('-'), role = h[0] === 'seito' || h[0] === 'sensei' ? h[0] : (store('role') || 'sensei');
    render(role, true);
    if (h[1]) TOOLS[role].forEach(function (t) { if (t[0] === h[1]) openTool(t); });
  }
  boot(); // defer なので、教材の一覧（free.js など）はもう読みこまれている
})();
