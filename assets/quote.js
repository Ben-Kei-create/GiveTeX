/* 今日のひとこと（毎日かわる名言）。日本時間の日付で決まるので、その日はだれが見ても同じ一言 */
(function () {
  'use strict';
  var Q = [
    ['天才とは、1%のひらめきと99%の努力である。', 'エジソン'],
    ['千里の道も一歩から。', '老子'],
    ['学びて思わざれば則ち罔し、思いて学ばざれば則ち殆し。', '孔子'],
    ['知は力なり。', 'フランシス・ベーコン'],
    ['我思う、ゆえに我あり。', 'デカルト'],
    ['為せば成る、為さねば成らぬ何事も。', '上杉鷹山'],
    ['失敗ではない。うまくいかない方法を見つけただけだ。', 'エジソン'],
    ['少年よ、大志を抱け。', 'クラーク博士'],
    ['人間は考える葦である。', 'パスカル'],
    ['今日できることを、明日に延ばすな。', 'フランクリン'],
    ['時は金なり。', 'フランクリン'],
    ['汝自身を知れ。', '古代ギリシャの格言'],
    ['継続は力なり。', 'ことわざ'],
    ['好きこそ物の上手なれ。', 'ことわざ'],
    ['石の上にも三年。', 'ことわざ'],
    ['七転び八起き。', 'ことわざ'],
    ['急がば回れ。', 'ことわざ'],
    ['天は人の上に人を造らず、人の下に人を造らず。', '福沢諭吉'],
    ['志を立てて、以て万事の源と為す。', '吉田松陰'],
    ['過ちて改めざる、是を過ちという。', '孔子'],
    ['故きを温ねて新しきを知る。', '孔子'],
    ['ローマは一日にして成らず。', 'ことわざ'],
    ['シンプルさは、究極の洗練である。', 'レオナルド・ダ・ヴィンチ'],
    ['人生は短く、芸術は長し。', 'ヒポクラテス'],
    ['之を知る者は之を好む者に如かず、之を好む者は之を楽しむ者に如かず。', '孔子'],
    ['雨垂れ石を穿つ。', 'ことわざ'],
    ['一期一会。', '茶の湯のことば'],
    ['塵も積もれば山となる。', 'ことわざ'],
    ['案ずるより産むが易し。', 'ことわざ'],
    ['習うより慣れろ。', 'ことわざ'],
    ['百聞は一見に如かず。', '漢書'],
    ['明日死ぬかのように生きよ。永遠に生きるかのように学べ。', 'ガンジー'],
    ['知ることより、考えることが大切だ。', 'ことわざ'],
    ['桃栗三年柿八年。', 'ことわざ'],
    ['笑う門には福来る。', 'ことわざ'],
    ['実るほど頭を垂れる稲穂かな。', 'ことわざ'],
    ['失敗は成功のもと。', 'ことわざ'],
    ['二兎を追う者は一兎をも得ず。', 'ことわざ'],
    ['井の中の蛙、大海を知らず。されど空の青さを知る。', 'ことわざ'],
    ['旅は道連れ、世は情け。', 'ことわざ']
  ];
  function today() { var d = new Date(Date.now() + 9 * 3600e3); return Math.floor(d.getTime() / 864e5); }
  function style() {
    if (document.getElementById('dq-style')) return;
    var st = document.createElement('style'); st.id = 'dq-style';
    st.textContent = '.daily-quote .dq-label{display:inline-block;margin-right:.6em;padding:0 .5em;border:1px solid currentColor;border-radius:3px;font-size:.85em;opacity:.8}.daily-quote .dq-who{margin-left:.6em;opacity:.75;white-space:nowrap}';
    document.head.appendChild(st);
  }
  function fill() {
    style();
    var q = Q[today() % Q.length];
    var els = document.querySelectorAll('.daily-quote');
    for (var i = 0; i < els.length; i++) {
      els[i].textContent = '';
      var a = document.createElement('span'); a.className = 'dq-label'; a.textContent = '今日のひとこと';
      var b = document.createElement('span'); b.className = 'dq-text'; b.textContent = '「' + q[0] + '」';
      var c = document.createElement('span'); c.className = 'dq-who'; c.textContent = '― ' + q[1];
      els[i].appendChild(a); els[i].appendChild(b); els[i].appendChild(c);
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fill); else fill();
})();
