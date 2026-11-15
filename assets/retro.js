/* ============================================================
   GiveTex Home Page  -  retro.js
   なつかしの JavaScript 置き場です。ご自由にどうぞ。
   ============================================================ */

/* ---- あいさつ（時間帯で変わるやつ） ---- */
function rGreeting() {
  var h = new Date().getHours();
  if (h < 5)  return "こんばんは！ 夜ふかしさんですね";
  if (h < 11) return "おはようございます！";
  if (h < 18) return "こんにちは！";
  return "こんばんは！";
}

/* ---- アクセスカウンター（あなたがこのページに来た回数） ---- */
function rCounter() {
  var n = 1, k = "givetex_visits";
  try {
    n = parseInt(window.localStorage.getItem(k) || "0", 10) + 1;
    window.localStorage.setItem(k, String(n));
  } catch (e) { n = 1; }
  var s = String(n);
  while (s.length < 6) s = "0" + s;
  var els = document.getElementsByTagName("span");
  for (var i = 0; i < els.length; i++) {
    if (els[i].className.indexOf("r-counter") >= 0) {
      var html = "";
      for (var j = 0; j < s.length; j++) html += "<b>" + s.charAt(j) + "</b>";
      els[i].innerHTML = html;
    }
  }
  var kiri = document.getElementById("r-kiri");
  if (kiri && (n % 100 === 0 || /^(\d)\1+$/.test(String(n)))) {
    kiri.innerHTML = "<blink>★キリ番 " + n + " ゲット！おめでとう！★</blink>";
  }
}

/* ---- 時計 ---- */
function rClock() {
  var el = document.getElementById("r-clock");
  if (!el) return;
  var d = new Date();
  var w = ["日", "月", "火", "水", "木", "金", "土"][d.getDay()];
  function z(x) { return (x < 10 ? "0" : "") + x; }
  el.innerHTML = d.getFullYear() + "/" + z(d.getMonth() + 1) + "/" + z(d.getDate()) + "(" + w + ")<br>" +
    z(d.getHours()) + ":" + z(d.getMinutes()) + ":" + z(d.getSeconds());
  setTimeout(rClock, 1000);
}

/* ---- ウィンドウの「_」ボタンでたたむ ---- */
function rWin(btn) {
  var w = btn.parentNode.parentNode;
  if (w.className.indexOf("closed") >= 0) {
    w.className = w.className.replace(" closed", "");
    btn.innerHTML = "_";
  } else {
    w.className += " closed";
    btn.innerHTML = "□";
  }
  return false;
}

/* ---- マウスのキラキラ ---- */
var rLast = 0;
function rSparkle(e) {
  var now = new Date().getTime();
  if (now - rLast < 45) return;
  rLast = now;
  var s = document.createElement("span");
  var c = ["#ffff00", "#ff66ff", "#66ffff", "#ffffff", "#99ff66"];
  s.className = "r-spark";
  s.innerHTML = Math.random() < 0.5 ? "✦" : "★";
  s.style.left = (e.clientX + 6) + "px";
  s.style.top = (e.clientY + 6) + "px";
  s.style.color = c[Math.floor(Math.random() * c.length)];
  document.body.appendChild(s);
  setTimeout(function () { if (s.parentNode) s.parentNode.removeChild(s); }, 800);
}

window.onload = function () {
  rCounter();
  rClock();
  var calm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var touch = window.matchMedia && window.matchMedia("(hover: none)").matches;
  if (!calm && !touch) document.onmousemove = rSparkle;
  if (calm) {
    var mq = document.getElementsByTagName("marquee");
    for (var i = 0; i < mq.length; i++) { if (mq[i].stop) mq[i].stop(); }
  }
};
