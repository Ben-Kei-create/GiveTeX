/* C-Log Web「みんなの C-Log」— 匿名の感想掲示板
   GET  /api/board?off=0        一覧（新しい順に30件）
   GET  /api/board?tk=1         投稿用の合言葉
   POST /api/board  {act:"post"|"like"|"report"|"delete", ...}
   管理人も含めて、みんな同じ「名無しの映画好き」。ID は日ごとに変わる（2ちゃんねる式）。
   3人から通報されると自動で非表示。書いた本人は削除キーで消せる。 */
'use strict';
const L = require('./_lib');
const MAX_POSTS = 1000, PAGE = 30, HIDE_AT = 3;
const POSTER = /^https:\/\/image\.tmdb\.org\/t\/p\/w\d{2,3}\/[\w-]+\.(jpg|png)$/;

function pub(p, likes, reps) {
  if (!p) return null;
  const hidden = (reps || 0) >= HIDE_AT;
  return { id: p.id, at: p.at, uid: p.uid, r: p.r || 0, likes: likes || 0, hidden: hidden,
    t: hidden ? '' : p.t, b: hidden ? '' : p.b, tm: hidden ? 0 : (p.tm || 0), poster: hidden ? '' : (p.poster || '') };
}

async function list(req, res, url) {
  const off = Math.min(Math.max(parseInt(url.searchParams.get('off'), 10) || 0, 0), MAX_POSTS);
  const [ids, total] = await L.kv([['LRANGE', 'b:list', String(off), String(off + PAGE - 1)], ['LLEN', 'b:list']]);
  let items = [];
  if (ids && ids.length) {
    const [raw, likes, reps] = await L.kv([['MGET'].concat(ids.map(i => 'b:p:' + i)), ['HMGET', 'b:likes'].concat(ids), ['HMGET', 'b:reps'].concat(ids)]);
    items = ids.map((id, k) => { let p = null; try { p = JSON.parse(raw[k]); } catch (e) {} return pub(p, +likes[k] || 0, +reps[k] || 0); }).filter(Boolean);
  }
  L.send(res, 200, { ok: true, total: total || 0, off: off, items: items }, 'public, s-maxage=15, stale-while-revalidate=60');
}

async function post(req, res, b) {
  if (b.website) return L.send(res, 200, { ok: true, items: [] }); // ロボットよけ（何もしない）
  if (!L.checkToken(b.tk)) return L.send(res, 400, { ok: false, error: 'ページを開き直してから、もう一度送ってください。' });
  const t = L.clean(b.t, 60, true), body = L.clean(b.b, 800, false);
  if (!t) return L.send(res, 400, { ok: false, error: '映画のタイトルを1〜60文字で入れてください。' });
  if (!body || Array.from(body).length < 5) return L.send(res, 400, { ok: false, error: '感想を5〜800文字で書いてください。' });
  const spam = L.looksSpam(t + '\n' + body); if (spam) return L.send(res, 400, { ok: false, error: spam });
  const r = Math.min(Math.max(parseInt(b.r, 10) || 0, 0), 5);
  const tm = Math.min(Math.max(parseInt(b.tm, 10) || 0, 0), 99999999);
  const poster = POSTER.test(String(b.poster || '')) ? String(b.poster) : '';
  const dk = String(b.dk || ''); if (!/^[a-f0-9]{32}$/.test(dk)) return L.send(res, 400, { ok: false, error: 'ページを開き直してから、もう一度送ってください。' });
  const ip = L.ipKey(req);
  if (!(await L.limit([['bp30:' + ip, 1, 30], ['bph:' + ip, 8, 3600], ['bpd:' + ip, 20, 86400], ['bpall:' + L.jstDay(), 500, 86400]])))
    return L.send(res, 429, { ok: false, error: '連続投稿はできません。少し時間をおいてから書いてください。' });
  const dup = L.sha(body.replace(/\s/g, ''));
  const [fresh] = await L.kv([['SET', 'b:dup:' + dup, '1', 'NX', 'EX', '86400']]);
  if (fresh !== 'OK') return L.send(res, 409, { ok: false, error: '同じ内容の感想は、もう書きこまれています。' });
  const [id] = await L.kv([['INCR', 'b:seq']]);
  const p = { id: id, at: Date.now(), uid: L.dailyId(req), t: L.mask(t), b: L.mask(body), r: r, tm: tm, poster: poster, dk: L.sha(dk) };
  const [, len] = await L.kv([['SET', 'b:p:' + id, JSON.stringify(p)], ['LPUSH', 'b:list', String(id)]]);
  if (len > MAX_POSTS) { // 古いものから片づける
    const old = await L.kv([['RPOP', 'b:list', String(len - MAX_POSTS)]]);
    const gone = [].concat(old[0] || []);
    if (gone.length) await L.kv(gone.map(g => ['DEL', 'b:p:' + g, 'b:lk:' + g, 'b:rp:' + g]).concat([['HDEL', 'b:likes'].concat(gone), ['HDEL', 'b:reps'].concat(gone)]));
  }
  await L.notify('みんなの C-Log に感想がとどきました', '映画：' + p.t + (p.r ? '（★' + p.r + '）' : '') + '\n\n' + p.b + '\n\nhttps://www.givetex.org/movie/#board');
  L.send(res, 200, { ok: true, item: pub(p, 0, 0) });
}

async function vote(req, res, b, kind) {
  const id = parseInt(b.id, 10); if (!(id > 0)) return L.send(res, 400, { ok: false, error: 'bad_id' });
  const ip = L.ipKey(req);
  if (!(await L.limit([['bv:' + ip, 60, 3600]]))) return L.send(res, 429, { ok: false, error: '少し時間をおいてください。' });
  const [exists] = await L.kv([['EXISTS', 'b:p:' + id]]);
  if (!exists) return L.send(res, 404, { ok: false, error: 'その感想は見つかりません。' });
  const set = kind === 'like' ? 'b:lk:' + id : 'b:rp:' + id, hash = kind === 'like' ? 'b:likes' : 'b:reps';
  const [added] = await L.kv([['SADD', set, ip]]);
  let n;
  if (added === 1) [n] = await L.kv([['HINCRBY', hash, String(id), '1']]);
  else [n] = await L.kv([['HGET', hash, String(id)]]);
  L.send(res, 200, { ok: true, id: id, n: +n || 0, already: added !== 1, hidden: kind === 'report' && (+n || 0) >= HIDE_AT });
}

async function del(req, res, b) {
  const id = parseInt(b.id, 10), dk = String(b.dk || '');
  if (!(id > 0) || !/^[a-f0-9]{32}$/.test(dk)) return L.send(res, 400, { ok: false, error: 'bad_request' });
  if (!(await L.limit([['bd:' + L.ipKey(req), 20, 3600]]))) return L.send(res, 429, { ok: false, error: '少し時間をおいてください。' });
  const [raw] = await L.kv([['GET', 'b:p:' + id]]);
  let p = null; try { p = JSON.parse(raw); } catch (e) {}
  if (!p) return L.send(res, 404, { ok: false, error: 'その感想は見つかりません。' });
  if (p.dk !== L.sha(dk)) return L.send(res, 403, { ok: false, error: '自分で書いた感想だけ消せます。' });
  await L.kv([['DEL', 'b:p:' + id, 'b:lk:' + id, 'b:rp:' + id], ['LREM', 'b:list', '0', String(id)], ['HDEL', 'b:likes', String(id)], ['HDEL', 'b:reps', String(id)]]);
  L.send(res, 200, { ok: true, id: id });
}

module.exports = async function handler(req, res) {
  try {
    const url = new URL(req.url, 'http://x');
    if (!L.hasKV()) return L.send(res, 503, { ok: false, error: 'not_configured' });
    if (req.method === 'GET') {
      if (url.searchParams.get('tk')) return L.send(res, 200, { ok: true, tk: L.issueToken() });
      return await list(req, res, url);
    }
    if (req.method !== 'POST') { res.setHeader('Allow', 'GET, POST'); return L.send(res, 405, { ok: false, error: 'method' }); }
    if (!L.sameOrigin(req)) return L.send(res, 403, { ok: false, error: 'origin' });
    const b = await L.readJson(req, 8192);
    if (b.act === 'post') return await post(req, res, b);
    if (b.act === 'like' || b.act === 'report') return await vote(req, res, b, b.act);
    if (b.act === 'delete') return await del(req, res, b);
    L.send(res, 400, { ok: false, error: 'bad_act' });
  } catch (e) {
    L.send(res, e.status || 500, { ok: false, error: e.status ? e.message : 'サーバーで問題が起きました。時間をおいて試してください。' });
  }
};
