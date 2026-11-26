/* 開発日記：タグ（[サイト]・[アプリ]…）でしぼりこむボタンと、件数
   日記は長いので、読みたい種類だけを出せるように。#tag=アプリ のようなリンクでも開ける */
(function () {
  'use strict';
  var es = Array.prototype.slice.call(document.querySelectorAll('.r-diary-entry')); if (es.length < 5) return;
  function tagOf(e) { var d = e.querySelector('.d'); var m = d && /\[([^\]]+)\]\s*$/.exec(d.textContent); return m ? m[1] : 'その他'; }
  var count = {}; es.forEach(function (e) { var t = tagOf(e); e.setAttribute('data-tag', t); count[t] = (count[t] || 0) + 1; });
  var tags = Object.keys(count).sort(function (a, b) { return count[b] - count[a]; });
  var box = document.createElement('p'); box.className = 'r-dtags'; box.setAttribute('role', 'group'); box.setAttribute('aria-label', '種類でしぼりこむ');
  var out = document.createElement('span'); out.className = 'r-dtags-n'; out.setAttribute('aria-live', 'polite');
  function set(t) {
    var n = 0;
    es.forEach(function (e) { var on = !t || e.getAttribute('data-tag') === t; e.hidden = !on; if (on) n++; });
    // 月の見出しも、中身がなければかくす
    Array.prototype.forEach.call(document.querySelectorAll('.win-b h2.r-h'), function (h) {
      var el = h.nextElementSibling, any = false; while (el && el.tagName !== 'H2' && !(el.tagName === 'A' && el.id)) { if (el.classList && el.classList.contains('r-diary-entry') && !el.hidden) any = true; el = el.nextElementSibling; }
      h.hidden = !any;
    });
    Array.prototype.forEach.call(box.querySelectorAll('button'), function (b) { b.setAttribute('aria-pressed', (b.getAttribute('data-t') || '') === (t || '') ? 'true' : 'false'); });
    var sl = box.querySelector('select'); if (sl) sl.value = t && !box.querySelector('button[data-t="' + t.replace(/"/g, '') + '"]') ? t : '';
    out.textContent = (t ? '［' + t + '］' : 'ぜんぶ') + ' ' + n + ' 件';
    try { history.replaceState(null, '', t ? '#tag=' + encodeURIComponent(t) : location.pathname); } catch (x) {}
  }
  function btn(label, t) { var b = document.createElement('button'); b.type = 'button'; b.className = 'r-btn'; b.textContent = label; b.setAttribute('data-t', t || ''); b.addEventListener('click', function () { set(t); try { if (window.gtag) gtag('event', 'diary_tag', { tag: t || 'all' }); } catch (x) {} }); box.appendChild(b); }
  // ボタンは、件数の多い上位8種類だけ（ほかは「そのほか」の中から選べる）
  btn('ぜんぶ', ''); tags.slice(0, 8).forEach(function (t) { btn(t + '（' + count[t] + '）', t); });
  var rest = tags.slice(8);
  if (rest.length) {
    var sel = document.createElement('select'); sel.className = 'r-dtags-more'; sel.setAttribute('aria-label', 'そのほかの種類');
    var o0 = document.createElement('option'); o0.value = ''; o0.textContent = 'そのほか…'; sel.appendChild(o0);
    rest.forEach(function (t) { var o = document.createElement('option'); o.value = t; o.textContent = t + '（' + count[t] + '）'; sel.appendChild(o); });
    sel.addEventListener('change', function () { if (sel.value) set(sel.value); });
    box.appendChild(sel);
  }
  box.appendChild(out);
  var jump = document.querySelector('.r-jump'); (jump || es[0]).parentNode.insertBefore(box, jump ? jump.nextSibling : es[0]);
  var m = /#tag=([^&]+)/.exec(location.hash); set(m ? decodeURIComponent(m[1]) : '');
})();
