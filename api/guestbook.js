/* ゲストブック（足あと帳）— 90年代ホームページの定番
   GET  /api/guestbook?off=0   一覧（新しい順に20件）
   GET  /api/guestbook?tk=1    書きこみ用の合言葉
   POST /api/guestbook  {act:"post"|"report"|"delete", ...}
   おなまえは自由（なければ「名無しさん」）。日替わり ID つき。3人の通報で自動で非表示。書いた本人は削除キーで消せる。 */
'use strict';
const L = require('./_lib');
const MAX = 500, PAGE = 20, HIDE_AT = 3;
const MOODS = ['(^^)', '(*^_^*)', '(^o^)/', '(T_T)', '(-_-;)', 'ヽ(´▽`)ノ', '(゜o゜)', 'm(_ _)m'];

function pub(p, reps) {
  if (!p) return null;
  const hidden = (reps || 0) >= HIDE_AT;
  return { id: p.id, at: p.at, uid: p.uid, name: hidden ? '' : p.name, mood: hidden ? '' : p.mood, msg: hidden ? '' : p.msg, from: hidden ? '' : (p.from || ''), hidden: hidden };
}

module.exports = async function handler(req, res) {
  try {
    if (!L.hasKV()) return L.send(res, 503, { ok: false, error: 'not_configured' });
    const url = new URL(req.url, 'http://x');
    if (req.method === 'GET') {
      if (url.searchParams.get('tk')) return L.send(res, 200, { ok: true, tk: L.issueToken(), moods: MOODS });
      const off = Math.min(Math.max(parseInt(url.searchParams.get('off'), 10) || 0, 0), MAX);
      const [ids, total] = await L.kv([['LRANGE', 'gb:list', String(off), String(off + PAGE - 1)], ['LLEN', 'gb:list']]);
      let items = [];
      if (ids && ids.length) {
        const [raw, reps] = await L.kv([['MGET'].concat(ids.map(i => 'gb:p:' + i)), ['HMGET', 'gb:reps'].concat(ids)]);
        items = ids.map((id, k) => { let p = null; try { p = JSON.parse(raw[k]); } catch (e) {} return pub(p, +reps[k] || 0); }).filter(Boolean);
      }
      return L.send(res, 200, { ok: true, total: total || 0, off: off, items: items }, 'public, s-maxage=15, stale-while-revalidate=60');
    }
    if (req.method !== 'POST') { res.setHeader('Allow', 'GET, POST'); return L.send(res, 405, { ok: false }); }
    if (!L.sameOrigin(req)) return L.send(res, 403, { ok: false, error: 'origin' });
    const b = await L.readJson(req, 6144), ip = L.ipKey(req);

    if (b.act === 'post') {
      if (b.website) return L.send(res, 200, { ok: true });
      if (!L.checkToken(b.tk)) return L.send(res, 400, { ok: false, error: 'ページを開き直してから、もう一度書いてください。' });
      const name = L.clean(b.name, 20, true), msg = L.clean(b.msg, 400, false), from = L.clean(b.from, 20, true);
      if (name === null) return L.send(res, 400, { ok: false, error: 'おなまえは20文字までです。' });
      if (from === null) return L.send(res, 400, { ok: false, error: '「どこから？」は20文字までです。' });
      if (!msg || Array.from(msg).length < 2) return L.send(res, 400, { ok: false, error: 'メッセージを2〜400文字で書いてね。' });
      const spam = L.looksSpam([name, from, msg].join('\n')); if (spam) return L.send(res, 400, { ok: false, error: spam });
      const dk = String(b.dk || ''); if (!/^[a-f0-9]{32}$/.test(dk)) return L.send(res, 400, { ok: false, error: 'ページを開き直してから、もう一度書いてください。' });
      if (!(await L.limit([['gp30:' + ip, 1, 30], ['gph:' + ip, 6, 3600], ['gpd:' + ip, 15, 86400], ['gpall:' + L.jstDay(), 300, 86400]])))
        return L.send(res, 429, { ok: false, error: '続けて書きこめません。少し時間をおいてね。' });
      const [fresh] = await L.kv([['SET', 'gb:dup:' + L.sha(msg.replace(/\s/g, '')), '1', 'NX', 'EX', '86400']]);
      if (fresh !== 'OK') return L.send(res, 409, { ok: false, error: '同じメッセージは、もう書きこまれています。' });
      const [id] = await L.kv([['INCR', 'gb:seq']]);
      const p = { id: id, at: Date.now(), uid: L.dailyId(req), name: L.mask(name || '名無しさん'), mood: MOODS.indexOf(b.mood) >= 0 ? b.mood : '', msg: L.mask(msg), from: L.mask(from || ''), dk: L.sha(dk) };
      const [, len] = await L.kv([['SET', 'gb:p:' + id, JSON.stringify(p)], ['LPUSH', 'gb:list', String(id)]]);
      if (len > MAX) { const old = await L.kv([['RPOP', 'gb:list', String(len - MAX)]]); const gone = [].concat(old[0] || []); if (gone.length) await L.kv(gone.map(g => ['DEL', 'gb:p:' + g, 'gb:rp:' + g]).concat([['HDEL', 'gb:reps'].concat(gone)])); }
      return L.send(res, 200, { ok: true, item: pub(p, 0) });
    }
    const id = parseInt(b.id, 10); if (!(id > 0)) return L.send(res, 400, { ok: false, error: 'bad_id' });
    if (b.act === 'report') {
      if (!(await L.limit([['gv:' + ip, 40, 3600]]))) return L.send(res, 429, { ok: false, error: '少し時間をおいてね。' });
      const [ex] = await L.kv([['EXISTS', 'gb:p:' + id]]); if (!ex) return L.send(res, 404, { ok: false, error: '見つかりません。' });
      const [added] = await L.kv([['SADD', 'gb:rp:' + id, ip]]);
      const [n] = added === 1 ? await L.kv([['HINCRBY', 'gb:reps', String(id), '1']]) : await L.kv([['HGET', 'gb:reps', String(id)]]);
      return L.send(res, 200, { ok: true, n: +n || 0, already: added !== 1, hidden: (+n || 0) >= HIDE_AT });
    }
    if (b.act === 'delete') {
      const dk = String(b.dk || ''); if (!/^[a-f0-9]{32}$/.test(dk)) return L.send(res, 400, { ok: false });
      if (!(await L.limit([['gd:' + ip, 20, 3600]]))) return L.send(res, 429, { ok: false, error: '少し時間をおいてね。' });
      const [raw] = await L.kv([['GET', 'gb:p:' + id]]); let p = null; try { p = JSON.parse(raw); } catch (e) {}
      if (!p) return L.send(res, 404, { ok: false, error: '見つかりません。' });
      if (p.dk !== L.sha(dk)) return L.send(res, 403, { ok: false, error: '自分の書きこみだけ消せます。' });
      await L.kv([['DEL', 'gb:p:' + id, 'gb:rp:' + id], ['LREM', 'gb:list', '0', String(id)], ['HDEL', 'gb:reps', String(id)]]);
      return L.send(res, 200, { ok: true, id: id });
    }
    L.send(res, 400, { ok: false, error: 'bad_act' });
  } catch (e) {
    L.send(res, e.status || 500, { ok: false, error: e.status ? 'もう一度ためしてね。' : 'サーバーで問題が起きました。' });
  }
};
