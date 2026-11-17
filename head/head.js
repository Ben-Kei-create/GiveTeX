(function () {
  var list = document.getElementById("tl");
  var cnt = document.getElementById("tw-count");
  var posts = window.HEAD_POSTS || [];
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function when(d) {
    // "2026-11-17 21:31" → "2026年11月17日 21:31"
    var m = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}:\d{2})$/.exec(d);
    if (!m) return d;
    return Number(m[1]) + "年" + Number(m[2]) + "月" + Number(m[3]) + "日 " + m[4];
  }
  list.innerHTML = posts.map(function (p) {
    return '<div class="tweet"><div class="ava">G</div><div class="bd">' +
      '<div class="hd"><b>ぎぶてくすの中の人</b> <span class="un">givetex</span></div>' +
      '<p class="tx">' + esc(p.t) + '</p>' +
      '<div class="mt">' + when(p.d) + ' · 頭の中から送信</div>' +
      '</div></div>';
  }).join("");
  if (cnt) cnt.textContent = posts.length;
})();
