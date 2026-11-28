/* ブースの「作画（さくが）エフェクト」— 押したときに、アニメの見せ場のような煙・衝撃・キラッ・描き文字（ドン！ポン！カチッ…）が出る
   エフェクトの描画は sakuga-vfx（MIT ライセンス・© 2026 Justin Finkelman）の core を使う：/assets/vendor/sakuga-vfx/
   - ホームと 90年代風のページでは使わない（ホームは変えない方針）
   - 対象のボタンがあるページでだけ、手がすいたときに core（約40KB）を読みこむ
   - 動きを減らす設定の人には出さない（core が判断する）
   - ブースごとに色をかえる（どろんは暗い紫、ラーメンは赤、映画は金…）
   ほかの場所からは window.GTVfx.fire(要素, 'don' | 'pon' | 'kachi' | 'shu' | 'zuza' | 'puff' | 'kira' | 'win') で呼べる */
(function () {
  'use strict';
  if (window.GTVfx) return;
  var path = location.pathname;
  if (path === '/' || document.querySelector('.r-head')) return; // ホーム・90年代風のページは対象外
  var CORE = '/assets/vendor/sakuga-vfx/core.js?v=1';

  /* ブースごとの「どこを押したら、どの演出」 */
  var RULES = [
    [/^\/game\//, [['.start', 'don'], ['.gcard', 'pon'], ['.tabs button', 'puff'], ['#restart', 'shu']]],
    [/^\/socafe\//, [['.sc-dl', 'kachi'], ['.sc-open', 'pon'], ['.sc-tabs button', 'puff'], ['.sc-sounds button', 'kira'], ['.sc-buy', 'pon']]],
    [/^\/gakko\//, [['.gk-role button', 'pon'], ['.gk-tool', 'pon'], ['.gk-seg button', 'puff'], ['.gk-btn', 'kachi']]],
    [/^\/movie\//, [['#bf-send', 'don'], ['.wt-tabs button', 'zuza'], ['.wt-filter button', 'puff'], ['.hl-nav', 'shu'], ['.hl .btn-y', 'pon'], ['.bf-stars button, .bf-stars [role=radio]', 'kira']]],
    [/^\/museum\//, [['.mu-coll-more button', 'shu'], ['.mu-filter button', 'puff']]],
    [/^\/ramen\//, [['.rm-filter button', 'puff'], ['.done button', 'don']]],
    [/^\/books\//, [['.cg-form .btn', 'pon'], ['.cg-tags button', 'puff'], ['.chip', 'puff']]],
    [/^\/doron\//, [['.tab, [role=tab]', 'puff']]],
    [/^\/stamp\//, [['.st-send', 'pon']]],
    [/^\/note\//, [['.nb-more button', 'kachi'], ['.nb-chip', 'puff']]],
    [/^\/apps\//, [['.cat, .chip, [role=tab]', 'puff']]],
    [/^\/(stage|hiphop|head)\//, [['button', 'pon']]]
  ];
  var rules = []; RULES.forEach(function (r) { if (r[0].test(path)) rules = rules.concat(r[1]); });
  if (!rules.length) return;

  /* ブースの色（core の P を、そのブースの雰囲気に） */
  var THEME = [
    [/^\/doron\//, { fill: '#2a1f3d', shade: '#5c3d8a', line: '#b28dff', accent: '#ff3b6b', ink: '#120b1d', sfx: ['#f3e6ff', '#120b1d'] }],
    [/^\/ramen\//, { fill: '#fffaf0', shade: '#ffd27a', line: '#d7261e', accent: '#ff8a00', ink: '#2a1a12', sfx: ['#d7261e', '#fffaf0'] }],
    [/^\/movie\//, { fill: '#fffaf0', shade: '#ffd133', line: '#1c1b19', accent: '#ff6a3d', ink: '#1c1b19', sfx: ['#1c1b19', '#ffd133'] }],
    [/^\/gakko\//, { fill: '#ffffff', shade: '#fff6a8', line: '#2f6b4f', accent: '#e8791a', ink: '#23302a', sfx: ['#2f6b4f', '#ffffff'] }],
    [/^\/socafe\//, { fill: '#fffaf1', shade: '#e9c98f', line: '#5a3b26', accent: '#2f8f5b', ink: '#3b2a20', sfx: ['#3b2a20', '#fffaf1'] }],
    [/^\/game\//, { fill: '#ffffff', shade: '#7df9ff', line: '#ff4fd8', accent: '#ffd23f', ink: '#120a24', sfx: ['#120a24', '#ffd23f'] }],
    [/^\/museum\//, { fill: '#fbfaf6', shade: '#e3d3a8', line: '#8a6f3c', accent: '#b89a5e', ink: '#2b2a27', sfx: ['#2b2a27', '#fbfaf6'] }],
    [/^\/stamp\//, { fill: '#ffffff', shade: '#bff5d3', line: '#06c755', accent: '#ffcf33', ink: '#1d3a2a', sfx: ['#06c755', '#ffffff'] }]
  ];
  function theme(fx) { THEME.forEach(function (t) { if (t[0].test(path)) { var P = fx.P; for (var k in t[1]) P[k] = t[1][k]; } }); }

  var ready = false, waiting = [];
  function load(cb) {
    if (window.SakugaFX) { if (!ready) { ready = true; theme(window.SakugaFX); } return cb(window.SakugaFX); }
    waiting.push(cb); if (waiting.length > 1) return;
    var s = document.createElement('script'); s.src = CORE; s.async = true;
    s.onload = function () { if (!window.SakugaFX) return; ready = true; theme(window.SakugaFX); var w = waiting; waiting = []; w.forEach(function (f) { f(window.SakugaFX); }); };
    document.head.appendChild(s);
  }

  /* 演出 */
  function fire(el, kind) {
    if (!el || !el.getBoundingClientRect) return;
    load(function (F) {
      if (F.calm) return;
      var p = F.at(el), x = p.x, y = p.y, w = Math.max(30, p.w), h = Math.max(20, p.h);
      if (kind === 'don' || kind === 'win') {
        F.burst(x, y, { r: Math.min(90, w * .55 + 20), spikes: 13 });
        F.shards(x, y - h * .3, { n: 7, speed: 210 });
        F.puff(x - w * .45, y + h * .3, { n: 3, size: 12, vx: -30 }); F.puff(x + w * .45, y + h * .3, { n: 3, size: 12, vx: 30 });
        F.sfx('don', x + w * .35, y - h * .9 - 10, { size: 58 });
        if (kind === 'win') { F.kira(x - w * .4, y - h, { r: 11 }); F.kira(x + w * .45, y - h * .2, { r: 9 }); F.ring(x, y + h * .6, { rx: w * .7, ry: 12 }); }
      } else if (kind === 'pon') {
        F.ring(x, y, { rx: Math.min(60, w * .5 + 10), ry: Math.min(24, h * .5 + 6) });
        F.puff(x, y - h * .2, { n: 4, size: 10 });
        F.sfx('pon', x + w * .4, y - h * .8 - 6, { size: 44, rot: .12 });
      } else if (kind === 'kachi') {
        F.kira(x + w * .42, y - h * .35, { r: 12 }); F.lines(x, y, { n: 6, dir: -Math.PI / 2, len: 30, spread: w * .4 });
        F.sfx('kachi', x - w * .3, y - h * .9 - 6, { size: 44, rot: -.18 });
      } else if (kind === 'shu') {
        F.slash(x, y, { len: Math.min(160, w + 40), ang: -.35, thick: 12 });
        F.sfx('shu', x + w * .3, y - h - 6, { size: 42 });
      } else if (kind === 'zuza') {
        F.puff(x - w * .4, y + h * .4, { n: 5, size: 10, vx: -40, vy: -6 }); F.lines(x, y, { n: 5, dir: Math.PI, len: 30, spread: h });
        F.sfx('zuza', x, y - h * .9 - 6, { size: 40, dots: true, edge: F.P.ink });
      } else if (kind === 'kira') {
        F.kira(x, y - h * .3, { r: 10 }); F.kira(x + w * .3, y + h * .2, { r: 7 });
      } else { // puff
        F.puff(x, y + h * .45, { n: 4, size: 9, vy: -14 });
      }
    });
  }

  /* 押したとき（ボタンの「決定」の瞬間＝指をはなしたとき） */
  document.addEventListener('click', function (e) {
    if (!e.target || !e.target.closest) return;
    for (var i = 0; i < rules.length; i++) { var el = e.target.closest(rules[i][0]); if (el && !el.disabled) { fire(el, rules[i][1]); return; } }
  }, true);
  /* 対象のボタンがあれば、手がすいたときに先に読みこんでおく（最初の1回から間にあうように） */
  function warm() { if (rules.some(function (r) { return document.querySelector(r[0]); })) load(function () {}); }
  var idle = window.requestIdleCallback || function (f) { setTimeout(f, 1200); };
  if (document.readyState === 'complete') idle(warm, { timeout: 3000 }); else window.addEventListener('load', function () { idle(warm, { timeout: 3000 }); });

  window.GTVfx = { fire: fire };
})();
