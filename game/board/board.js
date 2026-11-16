/* ボードゲーム（CPU対戦）の入れもの。ゲームは選ばれたときだけ読みこむ */
(function () {
  'use strict';
  var GAMES = [
    ['shogi', '将棋', '日本の将棋。持ち駒・成りあり', 'JAPAN'], ['go', '囲碁（9路）', '小さな碁盤で陣地あらそい', 'JAPAN'], ['mahjong', '麻雀（2人打ち）', 'CPUと1対1。ツモかロンであがり', 'JAPAN'],
    ['chess', 'チェス', '世界の定番。キャスリングもあり', 'WORLD'], ['reversi', 'リバーシ', 'はさんでひっくり返す', 'WORLD'], ['gomoku', '五目ならべ', '先に5つならべたら勝ち', 'JAPAN'],
    ['connect4', '四目ならべ', '下から積んで4つそろえる', 'WORLD'], ['checkers', 'チェッカー', 'ななめにとびこえて取る', 'WORLD'], ['mancala', 'マンカラ', 'アフリカ生まれの種まきゲーム', 'WORLD']
  ];
  window.BG = window.BG || {};
  var list = document.getElementById('games'), play = document.getElementById('play'), title = document.getElementById('g-title'), stage = document.getElementById('stage'),
      status = document.getElementById('status'), lv = document.getElementById('level'), side = document.getElementById('side'), rules = document.getElementById('rules'), cur = null, inst = null;
  var ui = {
    status: function (t, cls) { status.textContent = t; status.className = 'status' + (cls ? ' ' + cls : ''); },
    level: function () { return +lv.value; },
    side: function () { return side.value; },
    later: function (fn, ms) { return setTimeout(fn, ms || 280); },
    ga: function (n, p) { try { if (window.gtag) gtag('event', n, p || {}); } catch (e) {} }
  };
  GAMES.forEach(function (g) {
    var a = document.createElement('a'); a.className = 'gcard'; a.href = '?g=' + g[0]; a.setAttribute('data-g', g[0]);
    var t = document.createElement('span'); t.className = 'tag'; t.textContent = g[3]; a.appendChild(t);
    var b = document.createElement('b'); b.textContent = g[1]; a.appendChild(b); var s = document.createElement('small'); s.textContent = g[2]; a.appendChild(s);
    a.addEventListener('click', function (e) { e.preventDefault(); open(g[0], true); });
    list.appendChild(a);
  });
  function load(key, cb) {
    if (window.BG[key]) return cb();
    var s = document.createElement('script'); s.src = '/game/board/' + key + '.js?v=1'; s.onload = cb; s.onerror = function () { ui.status('読みこめませんでした。通信をたしかめてね。', 'lose'); }; document.head.appendChild(s);
  }
  function open(key, push) {
    var g = GAMES.filter(function (x) { return x[0] === key; })[0]; if (!g) return;
    cur = key; title.textContent = g[1]; play.hidden = false; stage.textContent = ''; ui.status('じゅんび中…');
    Array.prototype.forEach.call(list.children, function (a) { a.setAttribute('aria-current', a.getAttribute('data-g') === key ? 'true' : 'false'); });
    if (push && history.pushState) history.pushState(null, '', '?g=' + key);
    load(key, function () {
      var E = window.BG[key]; side.hidden = !E.sides; if (E.sides) { side.innerHTML = ''; E.sides.forEach(function (s, i) { var o = document.createElement('option'); o.value = s[0]; o.textContent = s[1]; side.appendChild(o); }); }
      rules.innerHTML = ''; var sm = document.createElement('summary'); sm.textContent = 'あそびかた'; rules.appendChild(sm); var p = document.createElement('p'); p.textContent = E.rules || ''; rules.appendChild(p);
      start(); play.scrollIntoView({ behavior: 'smooth', block: 'start' });
      ui.ga('board_game_open', { game: key });
    });
  }
  function start() { if (!cur) return; if (inst && inst.destroy) inst.destroy(); stage.textContent = ''; inst = window.BG[cur].mount(stage, ui); }
  document.getElementById('restart').addEventListener('click', start);
  lv.addEventListener('change', start); side.addEventListener('change', start);
  addEventListener('popstate', function () { var k = new URLSearchParams(location.search).get('g'); if (k) open(k, false); });
  var k0 = new URLSearchParams(location.search).get('g'); if (k0) open(k0, false);
})();
