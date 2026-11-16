/* ホームの起動画面（昔のゲーム機っぽい、オリジナルの演出）
   - そのタブで最初にホームを開いたときだけ。2回目からは出ない（sessionStorage）
   - タップ・クリック・キーで飛ばせる。動きを減らす設定の人には出さない
   - ?boot を付けると毎回見られる（確認用） */
(function () {
  'use strict';
  var force = /[?&]boot\b/.test(location.search);
  try {
    if (!force) {
      if (navigator.webdriver) return;
      if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      if (sessionStorage.getItem('gt-booted')) return;
    }
    sessionStorage.setItem('gt-booted', '1');
  } catch (e) { if (!force) return; }

  var root = document.documentElement;
  root.classList.add('gt-booting');
  var css = document.createElement('style');
  css.textContent =
    'html.gt-booting{overflow:hidden}html.gt-booting::before{content:"";position:fixed;inset:0;background:#000;z-index:2147483646}' +
    '.gtb{position:fixed;inset:0;z-index:2147483647;background:#000;display:grid;place-items:center;overflow:hidden;cursor:pointer;-webkit-tap-highlight-color:transparent;transition:opacity .45s ease}' +
    '.gtb.out{opacity:0;pointer-events:none}' +
    '.gtb-sky{position:absolute;inset:0;opacity:0;background:radial-gradient(ellipse at 50% 55%,#1b2a7a 0%,#0a0f3a 45%,#000 80%);animation:gtbSky 1.4s .55s ease forwards}' +
    '.gtb-sky::after{content:"";position:absolute;inset:0;background-image:radial-gradient(1px 1px at 12% 22%,#fff,transparent),radial-gradient(1px 1px at 78% 18%,#fff,transparent),radial-gradient(1.5px 1.5px at 30% 75%,#ffe9a8,transparent),radial-gradient(1px 1px at 88% 64%,#fff,transparent),radial-gradient(1px 1px at 55% 12%,#cfe,transparent),radial-gradient(1px 1px at 8% 60%,#fff,transparent),radial-gradient(1.5px 1.5px at 66% 86%,#fff,transparent),radial-gradient(1px 1px at 42% 40%,#fff,transparent);opacity:.8}' +
    '.gtb-line{position:absolute;left:50%;top:50%;width:0;height:2px;background:#fff;box-shadow:0 0 18px 4px rgba(255,255,255,.8);transform:translate(-50%,-50%);animation:gtbLine .6s ease-out forwards}' +
    '.gtb-in{position:relative;text-align:center;perspective:700px}' +
    '.gtb-g{width:min(34vw,150px);height:min(34vw,150px);image-rendering:pixelated;opacity:0;transform:rotateY(540deg) scale(.2);filter:drop-shadow(0 0 0 rgba(255,210,80,0));animation:gtbG 1.25s .75s cubic-bezier(.2,.8,.25,1) forwards;border-radius:18%}' +
    '.gtb-flash{position:absolute;inset:0;background:#fff;opacity:0;animation:gtbFlash .5s 1.95s ease-out forwards;pointer-events:none}' +
    '.gtb-t{margin:18px 0 0;font:400 clamp(40px,11vw,76px)/1 "VT323","DotGothic16",monospace;letter-spacing:.12em;color:#ffd84a;text-shadow:0 0 12px rgba(255,200,60,.7),3px 3px 0 #7a4b00}' +
    '.gtb-t span{display:inline-block;opacity:0;transform:translateY(12px);animation:gtbCh .25s ease forwards}' +
    '.gtb-s{margin:10px 0 0;font:14px/1.6 "DotGothic16",sans-serif;color:#dfe6ff;letter-spacing:.25em;opacity:0;animation:gtbFade .5s 2.55s forwards}' +
    '.gtb-c{position:absolute;bottom:calc(22px + env(safe-area-inset-bottom));left:0;right:0;text-align:center;font:11px/1.6 "DotGothic16",monospace;color:#8f97c7;letter-spacing:.2em;opacity:0;animation:gtbFade .6s 2.7s forwards}' +
    '.gtb-skip{position:absolute;top:calc(14px + env(safe-area-inset-top));right:16px;font:11px "DotGothic16",monospace;color:#6c74a8;letter-spacing:.15em;opacity:0;animation:gtbFade .4s .3s forwards}' +
    '@keyframes gtbLine{0%{width:0;height:2px;opacity:1}60%{width:100vw;height:2px;opacity:1}100%{width:100vw;height:100vh;opacity:0}}' +
    '@keyframes gtbSky{to{opacity:1}}' +
    '@keyframes gtbG{0%{opacity:0;transform:rotateY(540deg) scale(.2)}60%{opacity:1}85%{transform:rotateY(-12deg) scale(1.06)}100%{opacity:1;transform:rotateY(0) scale(1);filter:drop-shadow(0 0 22px rgba(255,210,80,.75))}}' +
    '@keyframes gtbFlash{0%{opacity:.85}100%{opacity:0}}' +
    '@keyframes gtbCh{to{opacity:1;transform:none}}' +
    '@keyframes gtbFade{to{opacity:1}}';
  document.head.appendChild(css);

  var done = false, box;
  function finish(fast) {
    if (done) return; done = true;
    if (!box) { root.classList.remove('gt-booting'); return; }
    box.classList.add('out'); root.classList.remove('gt-booting');
    setTimeout(function () { if (box && box.parentNode) box.parentNode.removeChild(box); if (css.parentNode) css.parentNode.removeChild(css); }, fast ? 300 : 500);
  }
  function build() {
    box = document.createElement('div'); box.className = 'gtb'; box.setAttribute('role', 'presentation'); box.setAttribute('aria-hidden', 'true');
    box.innerHTML = '<div class="gtb-sky"></div><div class="gtb-line"></div><div class="gtb-in"><img class="gtb-g" src="/assets/icon/icon-512.png" alt=""><div class="gtb-flash"></div><p class="gtb-t"></p><p class="gtb-s">GIVE教育！　教育 × IT</p></div><p class="gtb-c">© 2026 GiveTex</p><p class="gtb-skip">TAP TO SKIP ▶</p>';
    var t = box.querySelector('.gtb-t');
    'GiveTex'.split('').forEach(function (c, i) { var s = document.createElement('span'); s.textContent = c; s.style.animationDelay = (2.05 + i * 0.07) + 's'; t.appendChild(s); });
    document.body.appendChild(box);
    box.addEventListener('click', function () { finish(true); });
    document.addEventListener('keydown', function () { finish(true); }, { once: true });
    box.addEventListener('touchstart', function () { finish(true); }, { passive: true, once: true });
    setTimeout(function () { finish(false); }, 3900);
    try { if (window.gtag) window.gtag('event', 'boot_screen'); } catch (e) {}
  }
  setTimeout(function () { finish(true); }, 6000); // 何かあっても必ず消える
  if (document.body) build(); else document.addEventListener('DOMContentLoaded', build);
})();
