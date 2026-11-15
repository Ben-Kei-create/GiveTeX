/* GiveTex Apps — ライト／ダーク切り替え（選択はこのブラウザに保存） */
(function () {
  var KEY = 'givetex-apps-theme';
  var root = document.documentElement;
  function systemDark() { return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches; }
  function current() { return root.getAttribute('data-theme') || (systemDark() ? 'dark' : 'light'); }
  function label(btn) {
    var dark = current() === 'dark';
    btn.setAttribute('aria-label', dark ? 'ライトモードに切り替え' : 'ダークモードに切り替え');
    btn.setAttribute('aria-pressed', dark ? 'true' : 'false');
    btn.title = dark ? 'ライトモード' : 'ダークモード';
  }
  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.querySelector('.ax-theme');
    if (!btn) return;
    label(btn);
    btn.addEventListener('click', function () {
      var next = current() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem(KEY, next); } catch (e) {}
      var meta = document.querySelector('meta[name=theme-color]');
      if (meta) meta.setAttribute('content', next === 'dark' ? '#000000' : '#ffffff');
      label(btn);
    });
    if (window.matchMedia) {
      var mq = window.matchMedia('(prefers-color-scheme: dark)');
      var onChange = function () { if (!root.getAttribute('data-theme')) label(btn); };
      if (mq.addEventListener) mq.addEventListener('change', onChange);
    }
  });
})();
