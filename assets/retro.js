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
  /* 本物のアクセスカウンター（/api/counter）。1回の訪問（タブ）につき1度だけ数える。
     サーバーに届かないときは、このブラウザでの訪問回数を出す */
  var els = document.querySelectorAll ? document.querySelectorAll("span.r-counter") : [];
  if (!els.length) return;
  function show(n, label) {
    var s = String(n); while (s.length < 6) s = "0" + s;
    for (var i = 0; i < els.length; i++) {
      var h = ""; for (var j = 0; j < s.length; j++) h += "<b>" + s.charAt(j) + "</b>";
      els[i].innerHTML = h;
    }
    var lab = document.getElementById("r-count-label"); if (lab && label) lab.innerHTML = label;
    var kiri = document.getElementById("r-kiri");
    if (kiri && n > 0 && (n % 100 === 0 || /^(\d)\1+$/.test(String(n)) || n === 1234 || n === 12345)) {
      kiri.innerHTML = "<blink>★キリ番 " + n + " ゲット！おめでとう！★</blink><br>記念にお問い合わせから報告してね";
    }
  }
  function local() {
    var n = 1; try { n = parseInt(localStorage.getItem("givetex_visits") || "0", 10) + 1; localStorage.setItem("givetex_visits", String(n)); } catch (e) {}
    show(n, "回目の訪問です");
  }
  var counted = false; try { counted = sessionStorage.getItem("givetex_counted") === "1"; } catch (e) {}
  if (!window.fetch) return local();
  fetch("/api/counter", counted ? { cache: "no-store" } : { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" })
    .then(function (r) { return r.json(); })
    .then(function (j) {
      if (!j || !j.ok) return local();
      try { sessionStorage.setItem("givetex_counted", "1"); } catch (e) {}
      show(j.n, "人目のお客さまです");
    })["catch"](local);
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
/* ウインドウの「_」でたたむ（青いバーだけ）、「□」で元にもどす、「×」で閉じる（ページを開き直すと元にもどる） */
function rWin(btn) {
  var w = btn.parentNode.parentNode, min = btn.className.indexOf("bt-max") < 0;
  if (btn.className.indexOf("bt-x") >= 0) { w.className += " gone"; return false; }
  if (min) { if (w.className.indexOf(" closed") < 0) w.className += " closed"; }
  else w.className = w.className.replace(" closed", "");
  btn.setAttribute("aria-pressed", "true"); setTimeout(function () { btn.removeAttribute("aria-pressed"); }, 150);
  return false;
}
document.addEventListener("click", function (e) {
  var b = e.target && e.target.closest && e.target.closest(".win-t .bt-min, .win-t .bt-max, .win-t .bt-x");
  if (b) { e.preventDefault(); rWin(b); }
});

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

/* 「戻る」でページに帰ってきたときも、閉じたウインドウを元にもどす */
window.addEventListener("pageshow", function (e) {
  if (!e.persisted) return;
  var ws = document.querySelectorAll(".win.gone");
  for (var i = 0; i < ws.length; i++) ws[i].className = ws[i].className.replace(/ gone/g, "");
});

/* ---- Windows 95 っぽさ：さわった窓だけタイトルが青、ほかは灰色。タイトルをダブルクリックでたたむ ---- */
(function () {
  function win(el) { while (el && el !== document) { if (el.className && (" " + el.className + " ").indexOf(" win ") >= 0) return el; el = el.parentNode; } return null; }
  document.addEventListener("mousedown", function (e) {
    var w = win(e.target), all = document.querySelectorAll(".win");
    if (!w) return;
    for (var i = 0; i < all.length; i++) {
      all[i].className = all[i].className.replace(/ (active|inactive)/g, "") + (all[i] === w ? " active" : " inactive");
    }
  });
  document.addEventListener("dblclick", function (e) {
    var t = e.target.closest && e.target.closest(".win-t");
    if (!t || e.target.closest(".bt")) return;
    var w = t.parentNode;
    if (w.className.indexOf(" closed") >= 0) w.className = w.className.replace(" closed", ""); else w.className += " closed";
    if (window.getSelection) getSelection().removeAllRanges();
  });
})();
