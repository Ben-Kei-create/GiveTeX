// GiveTex のアイコン（SVG → PNG）。usage: node tools/make_icon.js <出力フォルダ> a   → icon-a.png（角丸・まわり透明）と icon-a-full.png（四角いっぱい・iOS 用）。色は a=藍〜紫（採用）／b=紺〜青／c=紫〜ピンク
const { chromium } = require('playwright'); const fs = require('fs');
function svg(v, full) {
  const R = full ? 0 : 230;
  const P = { a: ['#141a5c', '#3d2bd4', '#8b3dff'], b: ['#0b1030', '#16307a', '#2f7bff'], c: ['#1b0f3a', '#6a1fd1', '#ff4fa3'] }[v];
  // G：太い円弧＋中の横棒。開いたところに、きらっと光る星（教育の「ひらめき」）
  const cx = 512, cy = 520, r = 262, sw = 150;
  const a0 = -42 * Math.PI / 180, a1 = 0; // 右上（開いた口）→ ぐるっと左回り → 右の真ん中
  const p0 = [cx + r * Math.cos(a0), cy + r * Math.sin(a0)], p1 = [cx + r * Math.cos(a1), cy + r * Math.sin(a1)];
  const arc = `M ${p0[0]} ${p0[1]} A ${r} ${r} 0 1 0 ${p1[0]} ${p1[1]}`;
  const bar = `M ${p1[0]} ${p1[1]} L ${cx + 40} ${cy}`;
  const star = (x, y, s) => `M ${x} ${y - s} C ${x + s * .14} ${y - s * .14} ${x + s * .14} ${y - s * .14} ${x + s} ${y} C ${x + s * .14} ${y + s * .14} ${x + s * .14} ${y + s * .14} ${x} ${y + s} C ${x - s * .14} ${y + s * .14} ${x - s * .14} ${y + s * .14} ${x - s} ${y} C ${x - s * .14} ${y - s * .14} ${x - s * .14} ${y - s * .14} ${x} ${y - s} Z`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
<defs>
 <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${P[0]}"/><stop offset=".55" stop-color="${P[1]}"/><stop offset="1" stop-color="${P[2]}"/></linearGradient>
 <radialGradient id="hi" cx=".28" cy=".18" r=".75"><stop offset="0" stop-color="#fff" stop-opacity=".28"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/></radialGradient>
 <radialGradient id="lo" cx=".8" cy="1" r=".7"><stop offset="0" stop-color="#000" stop-opacity=".32"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
 <linearGradient id="gold" gradientUnits="userSpaceOnUse" x1="250" y1="250" x2="780" y2="800"><stop offset="0" stop-color="#fff4cf"/><stop offset=".38" stop-color="#ffd25e"/><stop offset=".75" stop-color="#ffab2e"/><stop offset="1" stop-color="#ff7d3a"/></linearGradient>
 <filter id="sh" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="26" stdDeviation="28" flood-color="#0a0630" flood-opacity=".55"/></filter>
 <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14"/></filter>
 <clipPath id="sq"><rect width="1024" height="1024" rx="${R}"/></clipPath>
</defs>
<g clip-path="url(#sq)">
 <rect width="1024" height="1024" fill="url(#bg)"/>
 <rect width="1024" height="1024" fill="url(#lo)"/>
 <circle cx="760" cy="230" r="300" fill="#fff" opacity=".05"/>
 <rect width="1024" height="1024" fill="url(#hi)"/>
 <g filter="url(#sh)">
  <path d="${arc}" fill="none" stroke="url(#gold)" stroke-width="${sw}" stroke-linecap="round"/>
  <path d="${bar}" fill="none" stroke="url(#gold)" stroke-width="${sw}" stroke-linecap="round"/>
 </g>
 <path d="${arc}" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="10" stroke-linecap="round" transform="translate(-6 -10) scale(1)" style="mix-blend-mode:screen"/>
 <g transform="translate(0 0)"><path d="${star(p0[0] + 108, p0[1] - 96, 74)}" fill="#fff" filter="url(#glow)" opacity=".8"/><path d="${star(p0[0] + 108, p0[1] - 96, 64)}" fill="#fffbe8"/></g>
 <rect x="0" y="0" width="1024" height="1024" rx="${R}" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="6"/>
</g></svg>`;
}
(async () => {
  const out = process.argv[2], vs = (process.argv[3] || 'a,b,c').split(','), b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1024, height: 1024 } });
  for (const v of vs) for (const full of [false, true]) {
    const s = svg(v, full); fs.writeFileSync(`${out}/icon-${v}${full ? '-full' : ''}.svg`, s);
    await p.setContent(`<html><body style="margin:0;background:transparent">${s}</body></html>`); await p.screenshot({ path: `${out}/icon-${v}${full ? '-full' : ''}.png`, omitBackground: true, clip: { x: 0, y: 0, width: 1024, height: 1024 } });
  }
  await b.close();
})();
