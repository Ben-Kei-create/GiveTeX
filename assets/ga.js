/* GiveTex — アクセス解析（Google アナリティクス 4）
   ・全ページの閲覧数
   ・外部リンクのクリック（note への移動は note_click として区別）
   ・note ブースで記事を最後まで読んだか（note_read_complete） */
(function () {
  'use strict';
  var ID = 'G-RJ2BPF1RLV';
  window.dataLayer = window.dataLayer || [];
  // すでにページ内で GA が設定されている場合（古い記事）は読み込みを重ねない
  var already = typeof window.gtag === 'function';
  if (!already) {
    window.gtag = function () { window.dataLayer.push(arguments); };
    var s = document.createElement('script');
    s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID;
    document.head.appendChild(s);
    window.gtag('js', new Date());
    window.gtag('config', ID);
  }
  function send(name, params) { try { window.gtag('event', name, params); } catch (e) {} }

  // note ブースの記事か（slug）
  function noteSlug() {
    var a = document.querySelector('.nb-article');
    return a ? a.getAttribute('data-slug') : '';
  }
  // クリックされた場所の名前
  function placeOf(a) {
    var map = [['.nb-origin', 'article_origin'], ['.nb-paid', 'paid_continue'], ['.nb-teaser', 'teaser_continue'],
               ['.nb-more', 'related'], ['.nb-follow', 'follow'], ['[data-note-profile]', 'booth_profile'],
               ['.nb-prose', 'in_article']];
    for (var i = 0; i < map.length; i++) { if (a.closest(map[i][0])) return map[i][1]; }
    return 'other';
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var url;
    try { url = new URL(a.href, location.href); } catch (err) { return; }
    if (url.host === location.host) return;
    var params = { link_url: url.href, link_domain: url.host, transport_type: 'beacon' };
    if (/(^|\.)note\.com$/.test(url.host)) {
      params.placement = placeOf(a);
      params.article = noteSlug();
      send('note_click', params);
    } else {
      send('outbound_click', params);
    }
  }, true);

  // 記事を最後まで読んだ（本文の終わりが画面に入った）
  document.addEventListener('DOMContentLoaded', function () {
    var end = document.querySelector('.nb-end');
    if (!end || document.querySelector('.nb-teaser') || !('IntersectionObserver' in window)) return;
    var done = false;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (x) {
        if (x.isIntersecting && !done) { done = true; send('note_read_complete', { article: noteSlug() }); io.disconnect(); }
      });
    });
    io.observe(end);
  });
})();
