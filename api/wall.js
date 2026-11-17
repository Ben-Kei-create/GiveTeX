/* 落書きの壁（特設ステージ・階段の下）— チョークと消しゴム
   GET  /api/wall?tk=1     描画用の合言葉
   GET  /api/wall?off=0    ストローク一覧（古い順、off 以降を最大500件）
   POST /api/wall {act:"stroke", kind:"chalk"|"erase", color, pts:[[x,y]...], tk}
   ルール：チョークは消えない。消しゴムはチョークを消すが、汚れ（dirt）が必ず残る。
   ストロークは KV のリスト wl:ops に時系列で保存し、クライアントが再生して描く。 */
'use strict';
const L = require('./_lib');
const W = 960, H = 540, MAXOPS = 4000, PAGE = 500;
const COLORS = ['#ffffff', '#ffd7e8', '#ffe066', '#a8e6ff'];

function validPts(pts) {
  if (!Array.isArray(pts) || pts.length < 1 || pts.length > 400) return null;
  const out = [];
  for (const p of pts) {
    if (!Array.isArray(p) || p.length !== 2) return null;
    const x = Math.round(+p[0]), y = Math.round(+p[1]);
    if (!(x >= -20 && x <= W + 20 && y >= -20 && y <= H + 20)) return null;
    out.push([x, y]);
  }
  return out;
}

module.exports = async function handler(req, res) {
  try {
    if (!L.hasKV()) return L.send(res, 503, { ok: false, error: 'not_configured' });
    const url = new URL(req.url, 'http://x');
    if (req.method === 'GET') {
      if (url.searchParams.get('tk')) return L.send(res, 200, { ok: true, tk: L.issueToken() });
      const off = Math.min(Math.max(parseInt(url.searchParams.get('off'), 10) || 0, 0), MAXOPS);
      const [raw, total] = await L.kv([['LRANGE', 'wl:ops', String(off), String(off + PAGE - 1)], ['LLEN', 'wl:ops']]);
      const ops = (raw || []).map(s => { try { return JSON.parse(s); } catch (e) { return null; } }).filter(Boolean);
      return L.send(res, 200, { ok: true, total: total || 0, off: off, ops: ops }, 'no-store');
    }
    if (req.method !== 'POST') { res.setHeader('Allow', 'GET, POST'); return L.send(res, 405, { ok: false }); }
    if (!L.sameOrigin(req)) return L.send(res, 403, { ok: false, error: 'origin' });
    const b = await L.readJson(req, 32768), ip = L.ipKey(req);
    if (b.act !== 'stroke') return L.send(res, 400, { ok: false, error: 'bad_act' });
    if (!L.checkToken(b.tk)) return L.send(res, 400, { ok: false, error: 'ページを開き直してから、もう一度どうぞ。' });
    const kind = b.kind === 'erase' ? 'erase' : 'chalk';
    const pts = validPts(b.pts);
    if (!pts) return L.send(res, 400, { ok: false, error: '描画データが変です。' });
    const color = kind === 'chalk' && COLORS.indexOf(b.color) >= 0 ? b.color : '#ffffff';
    if (!(await L.limit([['w15:' + ip, 1, 1], ['wh:' + ip, 180, 3600], ['wd:' + ip, 1200, 86400], ['wall:' + L.jstDay(), 6000, 86400]])))
      return L.send(res, 429, { ok: false, error: '少し休んでから描いてね。' });
    const op = { k: kind === 'chalk' ? 'c' : 'e', c: color, p: pts };
    const [len] = await L.kv([['RPUSH', 'wl:ops', JSON.stringify(op)], ['LLEN', 'wl:ops']]);
    if (len > MAXOPS) await L.kv([['LTRIM', 'wl:ops', String(len - MAXOPS), '-1']]);
    return L.send(res, 200, { ok: true, total: len });
  } catch (e) {
    L.send(res, e.status || 500, { ok: false, error: e.status ? 'もう一度ためしてね。' : 'サーバーで問題が起きました。' });
  }
};
