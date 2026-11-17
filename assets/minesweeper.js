/* マインスイーパー（昔の Windows 版の完全再現をめざす）
   お助けツールの右下の 😌 から開く。window.GT_openMinesweeper() で起動。
   - 初級 9×9/10、中級 16×16/40、上級 30×16/99
   - 最初のクリックは必ず安全（まわりも開く）／右クリックで 🚩→？→なし
   - 数字の両クリック（コード）対応、タイマーと残り地雷カウンターは LED 表示
   - ベストタイムは localStorage に保存 */
(function () {
  'use strict';
  var LEVELS = {
    easy: { label: '初級', cols: 9, rows: 9, mines: 10, cell: 28 },
    mid: { label: '中級', cols: 16, rows: 16, mines: 40, cell: 26 },
    hard: { label: '上級', cols: 30, rows: 16, mines: 99, cell: 23 }
  };
  var NUMCOLOR = ['', '#0000ff', '#007b00', '#ff0000', '#00007b', '#7b0000', '#007b7b', '#000000', '#7b7b7b'];
  var win = null, els = null, G = null, lv = 'easy', timerId = null, flagMode = false;

  var CSS = [
    '.ms-win{position:fixed;z-index:9002;right:10px;bottom:calc(58px + env(safe-area-inset-bottom));margin:0;max-width:calc(100vw - 20px)}',
    '.ms-body{background:#c0c0c0;padding:8px;font-family:"DotGothic16",sans-serif}',
    '.ms-menu{display:flex;gap:3px;flex-wrap:wrap;margin-bottom:8px;align-items:center}',
    '.ms-menu button{font:12px/1 "DotGothic16",sans-serif;background:#c0c0c0;border:0;padding:6px 9px;cursor:pointer;box-shadow:inset -1px -1px #0a0a0a,inset 1px 1px #fff,inset -2px -2px #808080,inset 2px 2px #dfdfdf}',
    '.ms-menu button[aria-pressed="true"]{background:#000080;color:#fff;box-shadow:inset 1px 1px #0a0a0a,inset -1px -1px #fff}',
    '.ms-menu .ms-best{margin-left:auto;font-size:11px;color:#333}',
    '.ms-panel{display:flex;justify-content:space-between;align-items:center;background:#c0c0c0;padding:6px 8px;margin-bottom:8px;box-shadow:inset 1px 1px #808080,inset -1px -1px #fff,inset 2px 2px #404040,inset -2px -2px #dfdfdf}',
    '.ms-lcd{background:#000;color:#f00;font:bold 22px/1 "Courier New",monospace;letter-spacing:2px;padding:3px 4px 1px;min-width:56px;text-align:center}',
    '.ms-face{width:40px;height:40px;font-size:24px;line-height:1;background:#c0c0c0;border:0;cursor:pointer;box-shadow:inset -1px -1px #0a0a0a,inset 1px 1px #fff,inset -2px -2px #808080,inset 2px 2px #dfdfdf;padding:0}',
    '.ms-face:active{box-shadow:inset 1px 1px #0a0a0a,inset -1px -1px #fff}',
    '.ms-boardwrap{overflow:auto;max-width:calc(100vw - 52px);box-shadow:inset 2px 2px #808080,inset -2px -2px #fff;padding:0;background:#c0c0c0}',
    '.ms-board{display:grid;user-select:none;-webkit-user-select:none}',
    '.ms-cell{border:0;padding:0;margin:0;background:#c0c0c0;font:bold 15px/1 "MS Gothic",monospace;cursor:pointer;box-shadow:inset 2px 2px #fff,inset -2px -2px #7b7b7b;display:flex;align-items:center;justify-content:center;touch-action:none}',
    '.ms-cell.open{box-shadow:inset 1px 1px #9a9a9a;cursor:default}',
    '.ms-cell.boom{background:#f00}',
    '.ms-foot{font-size:11px;color:#333;margin-top:7px;line-height:1.7}'
  ].join('\n');

  function lcd(n) { n = Math.max(-99, Math.min(999, n)); var s = String(Math.abs(n)); while (s.length < 3) s = '0' + s; return (n < 0 ? '-' : '') + s.slice(-3); }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

  function newGame() {
    var L = LEVELS[lv];
    G = { cols: L.cols, rows: L.rows, mines: L.mines, mine: [], num: [], open: [], flag: [], started: false, over: false, won: false, openCount: 0, flagCount: 0, time: 0, boomIdx: -1 };
    for (var i = 0; i < L.cols * L.rows; i++) { G.mine.push(false); G.num.push(0); G.open.push(false); G.flag.push(0); }
    stopTimer(); paint(); paintMeta();
  }
  function idx(x, y) { return y * G.cols + x; }
  function inside(x, y) { return x >= 0 && y >= 0 && x < G.cols && y < G.rows; }
  function neighbors(i) { var x = i % G.cols, y = Math.floor(i / G.cols), r = []; for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) { if (!dx && !dy) continue; if (inside(x + dx, y + dy)) r.push(idx(x + dx, y + dy)); } return r; }

  function placeMines(safeIdx) {
    var ban = {}; ban[safeIdx] = true; neighbors(safeIdx).forEach(function (n) { ban[n] = true; });
    var pool = []; for (var i = 0; i < G.cols * G.rows; i++) if (!ban[i]) pool.push(i);
    for (var m = 0; m < G.mines; m++) { var k = Math.floor(Math.random() * pool.length); G.mine[pool[k]] = true; pool.splice(k, 1); }
    for (var j = 0; j < G.cols * G.rows; j++) if (!G.mine[j]) G.num[j] = neighbors(j).filter(function (n) { return G.mine[n]; }).length;
  }
  function startTimer() { stopTimer(); timerId = setInterval(function () { if (G.time < 999) { G.time++; els.time.textContent = lcd(G.time); } }, 1000); }
  function stopTimer() { if (timerId) { clearInterval(timerId); timerId = null; } }

  function reveal(i) {
    if (G.open[i] || G.flag[i] === 1 || G.over) return;
    if (!G.started) { placeMines(i); G.started = true; startTimer(); }
    if (G.mine[i]) { G.over = true; G.boomIdx = i; stopTimer(); setFace('😵'); revealAll(); paint(); return; }
    var stack = [i];
    while (stack.length) {
      var c = stack.pop();
      if (G.open[c] || G.flag[c] === 1 || G.mine[c]) continue;
      G.open[c] = true; G.openCount++;
      if (G.num[c] === 0) neighbors(c).forEach(function (n) { if (!G.open[n]) stack.push(n); });
    }
    checkWin(); paint();
  }
  function chord(i) {
    if (!G.open[i] || G.num[i] === 0 || G.over) return;
    var ns = neighbors(i), flags = ns.filter(function (n) { return G.flag[n] === 1; }).length;
    if (flags !== G.num[i]) return;
    ns.forEach(function (n) { if (!G.open[n] && G.flag[n] !== 1) reveal(n); });
  }
  function cycleFlag(i) {
    if (G.open[i] || G.over) return;
    G.flag[i] = (G.flag[i] + 1) % 3; // 0なし → 1旗 → 2？ → 0
    G.flagCount = G.flag.reduce(function (a, f) { return a + (f === 1 ? 1 : 0); }, 0);
    paintCell(i); paintMeta();
  }
  function checkWin() {
    if (G.openCount === G.cols * G.rows - G.mines && !G.over) {
      G.over = true; G.won = true; stopTimer(); setFace('😎');
      for (var i = 0; i < G.mine.length; i++) if (G.mine[i] && G.flag[i] !== 1) { G.flag[i] = 1; }
      G.flagCount = G.mines;
      var best = parseInt(store('gt-ms-best-' + lv) || '0', 10);
      if (!best || G.time < best) { store('gt-ms-best-' + lv, String(G.time)); }
      paintMeta();
    }
  }
  function revealAll() { for (var i = 0; i < G.mine.length; i++) if (G.mine[i] && G.flag[i] !== 1) G.open[i] = true; }
  function setFace(f) { els.face.textContent = f; }
  function paintMeta() {
    els.mines.textContent = lcd(G.mines - G.flagCount);
    els.time.textContent = lcd(G.time);
    var best = store('gt-ms-best-' + lv);
    els.best.textContent = best ? 'ベスト ' + best + '秒（' + LEVELS[lv].label + '）' : '';
    Array.prototype.forEach.call(els.lvBtns, function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-lv') === lv ? 'true' : 'false'); });
  }
  function cellContent(i) {
    if (!G.open[i]) {
      if (G.over && G.mine[i] && G.flag[i] === 1) return '💣'; // 正しい旗はそのまま
      if (G.flag[i] === 1) return G.over && !G.mine[i] ? '✕' : '🚩';
      if (G.flag[i] === 2) return '<span style="color:#0000c8">？</span>';
      return '';
    }
    if (G.mine[i]) return '💣';
    if (G.num[i] > 0) return '<span style="color:' + NUMCOLOR[G.num[i]] + '">' + G.num[i] + '</span>';
    return '';
  }
  function paintCell(i) {
    var c = els.cells[i]; if (!c) return;
    c.className = 'ms-cell' + (G.open[i] ? ' open' : '') + (i === G.boomIdx ? ' boom' : '');
    c.innerHTML = cellContent(i);
  }
  function paint() {
    var L = LEVELS[lv];
    els.board.style.gridTemplateColumns = 'repeat(' + G.cols + ', ' + L.cell + 'px)';
    if (els.cells.length !== G.cols * G.rows) {
      els.board.innerHTML = ''; els.cells = [];
      for (var i = 0; i < G.cols * G.rows; i++) {
        var b = document.createElement('button'); b.type = 'button'; b.className = 'ms-cell'; b.setAttribute('data-i', i);
        b.style.width = L.cell + 'px'; b.style.height = L.cell + 'px';
        b.setAttribute('aria-label', 'マス ' + (i + 1));
        els.board.appendChild(b); els.cells.push(b);
      }
    }
    for (var j = 0; j < els.cells.length; j++) paintCell(j);
    setFace(G.over ? (G.won ? '😎' : '😵') : '😌');
  }

  function build() {
    var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    var w = document.createElement('div'); w.className = 'win ms-win'; w.setAttribute('role', 'dialog'); w.setAttribute('aria-label', 'マインスイーパー');
    w.innerHTML = '<div class="win-t"><span class="ico">💣</span><span class="ttl">マインスイーパー</span><button class="bt ms-x" type="button" aria-label="とじる">×</button></div>' +
      '<div class="ms-body">' +
      '<div class="ms-menu"><button type="button" data-lv="easy" aria-pressed="true">初級</button><button type="button" data-lv="mid" aria-pressed="false">中級</button><button type="button" data-lv="hard" aria-pressed="false">上級</button>' +
      '<button type="button" class="ms-flagmode" aria-pressed="false">🚩 旗モード</button><span class="ms-best"></span></div>' +
      '<div class="ms-panel"><div class="ms-lcd ms-mines">010</div><button type="button" class="ms-face" aria-label="はじめから">😌</button><div class="ms-lcd ms-time">000</div></div>' +
      '<div class="ms-boardwrap"><div class="ms-board"></div></div>' +
      '<p class="ms-foot">左クリック：開く／右クリック：旗（🚩→？→なし）／開いた数字をクリック：まわりの旗が合っていれば残りを開く<br>スマホは長押しでも旗。旗モード中はタップで旗になります。</p>' +
      '</div>';
    document.body.appendChild(w);
    els = {
      mines: w.querySelector('.ms-mines'), time: w.querySelector('.ms-time'), face: w.querySelector('.ms-face'),
      board: w.querySelector('.ms-board'), best: w.querySelector('.ms-best'),
      lvBtns: w.querySelectorAll('[data-lv]'), cells: []
    };
    w.querySelector('.ms-x').addEventListener('click', function () { w.hidden = true; stopTimer(); });
    els.face.addEventListener('click', function () { newGame(); });
    Array.prototype.forEach.call(els.lvBtns, function (b) { b.addEventListener('click', function () { lv = b.getAttribute('data-lv'); newGame(); }); });
    var fm = w.querySelector('.ms-flagmode');
    fm.addEventListener('click', function () { flagMode = !flagMode; fm.setAttribute('aria-pressed', flagMode ? 'true' : 'false'); });

    var pressTimer = null, longPressed = false;
    els.board.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    els.board.addEventListener('pointerdown', function (e) {
      var c = e.target.closest && e.target.closest('.ms-cell'); if (!c || G.over) return;
      var i = +c.getAttribute('data-i');
      setFace('😮');
      longPressed = false;
      if (e.pointerType !== 'mouse') {
        pressTimer = setTimeout(function () { longPressed = true; cycleFlag(i); setFace('😌'); }, 450);
      }
      if (e.button === 2) { cycleFlag(i); }
    });
    els.board.addEventListener('pointerup', function (e) {
      if (pressTimer) { clearTimeout(pressTimer); pressTimer = null; }
      var c = e.target.closest && e.target.closest('.ms-cell');
      setFace(G.over ? (G.won ? '😎' : '😵') : '😌');
      if (!c || G.over || longPressed) return;
      var i = +c.getAttribute('data-i');
      if (e.button === 2) return;
      if (flagMode && e.pointerType !== 'mouse') { cycleFlag(i); return; }
      if (G.open[i]) chord(i); else reveal(i);
    });
    els.board.addEventListener('pointerleave', function () { if (!G || !G.over) setFace('😌'); });
    return w;
  }

  window.GT_openMinesweeper = function () {
    if (!win) { win = build(); newGame(); }
    win.hidden = !win.hidden;
    if (!win.hidden && G && !G.over && G.started && !timerId) startTimer();
    if (win.hidden) stopTimer();
  };
})();
