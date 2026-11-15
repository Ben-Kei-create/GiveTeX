/* ブックマークブース — ターミナル */
(function () {
  'use strict';
  var DIRS = window.BOOKMARKS || [];
  var out = document.getElementById('out'), input = document.getElementById('cmd'), screen = document.querySelector('.tm-screen');
  var cwd = null, last = [], hist = [], hi = 0;
  var TOTAL = DIRS.reduce(function (n, d) { return n + d.items.length; }, 0);
  function span(cls, t) { var s = document.createElement('span'); if (cls) s.className = cls; s.textContent = t; return s; }
  function line() { var l = document.createElement('div'); l.className = 'l'; for (var i = 0; i < arguments.length; i++) { var a = arguments[i]; l.appendChild(typeof a === 'string' ? document.createTextNode(a) : a); } out.appendChild(l); return l; }
  function bottom() { window.scrollTo(0, document.body.scrollHeight); }
  function psText() { return 'guest@givetex:~/backstage' + (cwd ? '/' + cwd.id : '') + '$'; }
  function setPs() { document.querySelector('.prompt label').innerHTML = ''; var l = document.querySelector('.prompt label'); var h = span('host', 'guest@givetex'); l.appendChild(h); l.appendChild(span('', ':')); l.appendChild(span('c', '~/backstage' + (cwd ? '/' + cwd.id : ''))); l.appendChild(span('', '$')); l.className = 'ps'; }
  function echo(cmd) { line(span('ps', psText() + ' '), cmd); }
  function find(name) { name = (name || '').replace(/\/$/, '').toLowerCase(); for (var i = 0; i < DIRS.length; i++) if (DIRS[i].id === name) return DIRS[i]; return null; }
  function dirLine(d) {
    var s = span('dir', 'drwxr-xr-x  ' + d.id + '/'); s.tabIndex = 0; s.setAttribute('role', 'button');
    s.addEventListener('click', function () { run('cd ' + d.id); });
    s.addEventListener('keydown', function (e) { if (e.key === 'Enter') run('cd ' + d.id); });
    line(s, span('d', '  ' + String(d.items.length).padStart(3) + ' links  # ' + d.name));
  }
  function items(list) {
    last = list;
    list.forEach(function (it, k) {
      var row = document.createElement('div'); row.className = 'l item';
      row.appendChild(span('n', '[' + (k + 1) + ']'));
      var a = document.createElement('a'); a.href = /^https?:\/\//.test(it.u) ? it.u : '#'; a.target = '_blank'; a.rel = 'noopener'; a.className = 'lnk';
      a.appendChild(document.createTextNode(it.t + ' ')); a.appendChild(span('h', '(' + it.h + ')'));
      var w = document.createElement('span'); w.appendChild(a); row.appendChild(w); out.appendChild(row);
    });
  }
  var C = {
    help: function () {
      line(span('a', 'つかえるコマンド：'));
      [['ls [dir]', 'ディレクトリ／リンクの一覧'], ['cd <dir>', 'ディレクトリに移動（cd .. でもどる）'], ['tree', 'ぜんぶ表示'], ['grep <ことば>', 'タイトル・URLから検索'],
       ['open <番号>', '直前の一覧の番号のリンクを開く'], ['random', 'ランダムに1つおすすめ'], ['github', '作者の GitHub のざっくり概要'], ['whoami', 'ここはどこ？'], ['clear', '画面をきれいに'], ['exit', 'GiveTex にもどる']]
        .forEach(function (x) { line('  ', span('g', x[0].padEnd(14)), span('d', x[1])); });
      line(span('d', 'ヒント：ディレクトリやリンクはクリックでも開けます。Tab で補完、↑↓ で履歴。'));
    },
    ls: function (a) {
      var d = a ? find(a) : cwd;
      if (a && !d) return line(span('r', 'ls: ' + a + ': そのディレクトリはありません'));
      if (!d) { line(span('d', 'total ' + TOTAL)); DIRS.forEach(dirLine); return; }
      line(span('a', '# ' + d.name), span('d', '  (' + d.items.length + ')')); items(d.items);
    },
    cd: function (a) {
      if (!a || a === '~' || a === '..' || a === '/') { cwd = null; setPs(); return; }
      var d = find(a); if (!d) return line(span('r', 'cd: ' + a + ': そのディレクトリはありません'));
      cwd = d; setPs(); C.ls();
    },
    tree: function () {
      line(span('c', '.'));
      DIRS.forEach(function (d, i) { var lastD = i === DIRS.length - 1; line(span('d', lastD ? '└── ' : '├── '), span('dir', d.id + '/'), span('d', '  # ' + d.name + '（' + d.items.length + '）')); });
    },
    grep: function (a) {
      if (!a) return line(span('r', 'grep: さがすことばを入れてください（例：grep java）'));
      var q = a.toLowerCase(), hit = [];
      DIRS.forEach(function (d) { d.items.forEach(function (it) { if ((it.t + ' ' + it.u).toLowerCase().indexOf(q) >= 0) hit.push(it); }); });
      line(span('d', hit.length + ' 件ヒット')); items(hit);
    },
    open: function (a) {
      var n = parseInt(a, 10), it = last[n - 1];
      if (!it) return line(span('r', 'open: 番号 ' + (a || '') + ' は直前の一覧にありません'));
      line(span('g', '→ ' + it.t + ' を開きます')); window.open(it.u, '_blank', 'noopener');
    },
    random: function () {
      var all = []; DIRS.forEach(function (d) { all = all.concat(d.items); });
      var it = all[Math.floor(Math.random() * all.length)]; line(span('p', '🎲 きょうのおすすめ：')); items([it]);
    },
    whoami: function () { line('guest'); line(span('d', 'ここは GiveTex の裏側。作者がブックマークしてきた公開サイトの置き場所です（' + TOTAL + '件）。')); },
    clear: function () { out.innerHTML = ''; },
    exit: function () { line(span('d', 'logout')); setTimeout(function () { location.href = '/'; }, 400); },
    sudo: function () { line(span('r', 'guest は sudoers に入っていません。この件は報告されます。')); line(span('d', '……うそです。')); },
    rm: function () { line(span('r', 'rm: 読み取り専用のファイルシステムです')); },
    github: function () {
      var G = window.GITHUB; if (!G) return line(span('r', 'github: データがありません'));
      var gh = document.createElement('a'); gh.href = G.url; gh.target = '_blank'; gh.rel = 'noopener'; gh.className = 'lnk'; gh.textContent = G.url;
      line(span('a', '$ gh profile ' + G.user)); line('  ', gh);
      line(span('d', '  公開リポジトリ ' + G.total + ' 個 / ' + G.since + '年〜 / ' + G.updated + ' 時点'));
      line(span('a', '# つかってきた言語（リポジトリの数）'));
      var max = G.langs[0][1];
      G.langs.forEach(function (l) { line('  ', span('c', l[0].padEnd(11)), span('g', '█'.repeat(Math.max(1, Math.round(l[1] / max * 24)))), span('d', ' ' + l[1])); });
      line(span('a', '# git log --oneline（年ごと）'));
      G.years.slice().reverse().forEach(function (y) { line('  ', span('p', y[0]), span('d', ' (' + String(y[1]).padStart(2) + ') '), y[2]); });
      line(span('a', '# 代表的なリポジトリ（クリックで GitHub へ）'));
      items(G.highlights.map(function (h) { return { t: h[0] + ' — ' + h[2], u: G.url + '/' + encodeURIComponent(h[0]), h: h[1] }; }));
      line(span('d', 'open <番号> でも開けます。ぜんぶ見るなら → '), (function () { var a = gh.cloneNode(true); return a; })());
    },
    pwd: function () { line('/home/guest/backstage' + (cwd ? '/' + cwd.id : '')); }
  };
  function run(raw) {
    var t = String(raw || '').trim(); echo(t);
    if (!t) { bottom(); return; }
    hist.push(t); hi = hist.length;
    var m = t.split(/\s+/), c = m[0].toLowerCase(), arg = m.slice(1).join(' ');
    if (C[c]) C[c](arg); else line(span('r', c + ': コマンドが見つかりません'), span('d', '（help で一覧）'));
    try { if (window.gtag && C[c]) window.gtag('event', 'bookmarks_cmd', { cmd: c }); } catch (e) {}
    bottom();
  }
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { run(input.value); input.value = ''; }
    else if (e.key === 'ArrowUp') { e.preventDefault(); if (hi > 0) input.value = hist[--hi]; }
    else if (e.key === 'ArrowDown') { e.preventDefault(); if (hi < hist.length - 1) input.value = hist[++hi]; else { hi = hist.length; input.value = ''; } }
    else if (e.key === 'Tab') {
      e.preventDefault(); var m = input.value.split(' ');
      if (m.length === 2) { var hit = DIRS.filter(function (d) { return d.id.indexOf(m[1]) === 0; }); if (hit.length === 1) input.value = m[0] + ' ' + hit[0].id; }
      else if (m.length === 1) { var cs = Object.keys(C).filter(function (k) { return k.indexOf(m[0]) === 0; }); if (cs.length === 1) input.value = cs[0] + ' '; }
    }
  });
  screen.addEventListener('click', function (e) { if (!e.target.closest('a,.dir,button') && !getSelection().toString()) input.focus({ preventScroll: true }); });
  Array.prototype.forEach.call(document.querySelectorAll('.quick button'), function (b) { b.addEventListener('click', function () { run(b.getAttribute('data-cmd')); }); });

  /* 起動 */
  var BOOT = [['d', 'GiveTex backstage terminal v1.0'], ['d', '[ OK ] mounting /backstage ...'], ['d', '[ OK ] loading bookmarks ... ' + TOTAL + ' links'], ['d', '[ OK ] removing personal stuff ... done'], ['g', 'ようこそ、サイトの裏側へ。help でコマンド一覧。']];
  var calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var seen = false; try { seen = sessionStorage.getItem('bm-boot') === '1'; sessionStorage.setItem('bm-boot', '1'); } catch (e) {}
  var art = document.createElement('pre'); art.className = 'ascii glow'; art.setAttribute('aria-hidden', 'true');
  art.textContent = ' ____             _        _                   \n| __ )  __ _  ___| | _____| |_ __ _  __ _  ___ \n|  _ \\ / _` |/ __| |/ / __| __/ _` |/ _` |/ _ \\\n| |_) | (_| | (__|   <\\__ \\ || (_| | (_| |  __/\n|____/ \\__,_|\\___|_|\\_\\___/\\__\\__,_|\\__, |\\___|\n                                    |___/      ';
  function finish() {
    setPs();
    var G = window.GITHUB;
    if (G) { var b = span('dir', '[ github ] ' + G.user + ' — 公開リポジトリ ' + G.total + ' 個（' + G.since + '〜）→ 概要を見る'); b.tabIndex = 0; b.setAttribute('role', 'button');
      b.addEventListener('click', function () { run('github'); }); b.addEventListener('keydown', function (e) { if (e.key === 'Enter') run('github'); }); line(b); }
    run('ls'); input.focus({ preventScroll: true });
  }
  out.appendChild(art);
  if (calm || seen) { BOOT.forEach(function (b) { line(span(b[0], b[1])); }); finish(); return; }
  var k = 0, skip = false;
  function next() { if (skip) return; if (k < BOOT.length) { line(span(BOOT[k][0], BOOT[k][1])); k++; setTimeout(next, 260); } else finish(); }
  function skipAll() { if (skip || k >= BOOT.length) return; skip = true; for (; k < BOOT.length; k++) line(span(BOOT[k][0], BOOT[k][1])); finish(); }
  document.addEventListener('keydown', skipAll, { once: true }); document.addEventListener('pointerdown', skipAll, { once: true });
  next();
})();
