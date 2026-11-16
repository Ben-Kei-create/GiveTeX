/* 百物語のろうそく（どろんブースの雰囲気づくり）
   100本のろうそくをタップで1本ずつ吹き消す。消すたびに、ひとことだけ「話」が出る。
   消した本数はこの端末だけに覚えておく（localStorage: doron-hyaku）。こわい画像や大きな音は出さない */
(function () {
  'use strict';
  var box = document.getElementById('hyaku'); if (!box) return;
  var grid = box.querySelector('.hyaku-grid'), st = box.querySelector('.hyaku-st'), say = box.querySelector('.hyaku-say'), reset = box.querySelector('.hyaku-reset');
  var N = 100, out = [];
  try { out = JSON.parse(localStorage.getItem('doron-hyaku') || '[]') || []; } catch (e) {}
  out = out.filter(function (n) { return n >= 0 && n < N; });
  var LINES = ['階段が、昨日より一段多い。', '留守番電話に、自分の声が入っていた。', '三人で撮ったのに、影は四つあった。', '終電のあと、もう一本だけ電車が来た。', '鏡の中のわたしが、先に目をそらした。',
    '押し入れの奥から、ノックが返ってきた。', '誰もいない二階で、椅子を引く音がした。', '「おかえり」と言われた。一人暮らしなのに。', '写真の端の人が、毎年すこしずつ近づいている。', '夜中の公園で、ブランコがひとつだけ揺れていた。',
    'エレベーターが、押していない階で開いた。', '名前を呼ばれて振り向いた。廊下は行き止まりだった。', '濡れた足あとが、ふとんの前で終わっている。', '隣の部屋は、もう十年も空き部屋だという。', 'トンネルを抜けたら、後ろの席が一人ふえていた。',
    '古いアルバムに、知らない兄弟が写っていた。', '非通知の電話は、いつも午前二時四分にかかってくる。', '数えたら、ろうそくは一本多かった。', '雨の日だけ、窓の外に傘を差した人が立つ。', '「もういいかい」と聞こえた。かくれんぼは、していない。'];
  function save() { try { localStorage.setItem('doron-hyaku', JSON.stringify(out)); } catch (e) {} }
  function paint() {
    var left = N - out.length;
    st.textContent = left > 0 ? 'のこり ' + left + ' 本' : '百本、すべて消えました。';
    box.style.setProperty('--dark', (out.length / N * .55).toFixed(3));
    reset.hidden = out.length === 0;
  }
  function finale() {
    var v = document.createElement('div'); v.className = 'hyaku-end'; v.setAttribute('role', 'status');
    v.innerHTML = '<p>……</p>'; document.body.appendChild(v);
    requestAnimationFrame(function () { v.classList.add('in'); });
    setTimeout(function () { v.firstChild.textContent = '百話、語り終えました。'; }, 1800);
    setTimeout(function () { v.firstChild.textContent = 'なにも、起きませんでした。'; }, 4200);
    setTimeout(function () { v.firstChild.textContent = '……ほんとうに？'; }, 6600);
    function close() { v.classList.remove('in'); setTimeout(function () { v.remove(); }, 900); }
    setTimeout(close, 9200); v.addEventListener('click', close);
    try { if (window.gtag) gtag('event', 'hyaku_complete'); } catch (e) {}
  }
  for (var i = 0; i < N; i++) (function (i) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'hyaku-c'; b.innerHTML = '<i aria-hidden="true"></i>';
    b.style.setProperty('--d', (-(i * 37 % 23) / 10) + 's');
    function label() { b.setAttribute('aria-label', (i + 1) + '本目のろうそく' + (b.classList.contains('off') ? '（消えている）' : '（灯っている。押すと吹き消す）')); }
    if (out.indexOf(i) >= 0) { b.classList.add('off'); b.disabled = true; }
    label();
    b.addEventListener('click', function () {
      if (b.classList.contains('off')) return;
      b.classList.add('off', 'puff'); b.disabled = true; out.push(i); save(); label(); paint();
      say.textContent = '第' + out.length + '話　' + LINES[(out.length * 7 + i) % LINES.length];
      say.classList.remove('in'); void say.offsetWidth; say.classList.add('in');
      try { if (navigator.vibrate) navigator.vibrate(6); } catch (e) {}
      if (out.length === N) setTimeout(finale, 700);
    });
    grid.appendChild(b);
  })(i);
  reset.addEventListener('click', function () {
    out = []; save(); say.textContent = '';
    Array.prototype.forEach.call(grid.children, function (b, k) { b.classList.remove('off', 'puff'); b.disabled = false; b.setAttribute('aria-label', (k + 1) + '本目のろうそく（灯っている。押すと吹き消す）'); });
    paint();
  });
  paint();
})();
