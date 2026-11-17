/* 頭の中ブース（昔の Twitter 再現）の投稿 API
   GET  /api/head?tk=1    投稿用の合言葉
   GET  /api/head?off=0   動的つぶやき一覧（新しい順に30件）。静的な過去つぶやきは head/posts.js 側。
   POST /api/head  {act:"post", mode:"admin"|"guest", text, pass?, name?, dk?, tk}
                   {act:"report", id} / {act:"delete", id, dk}
   管理人パスワードは平文を置かず、環境変数 HEAD_ADMIN_HASH（パスワードの SHA-256 hex）と照合する。
   ゲスト投稿は名前任意（なければ「ゲスト」）。3人の通報で自動で非表示。 */
'use strict';
const crypto = require('crypto');
const L = require('./_lib');
const MAX = 200, PAGE = 30, HIDE_AT = 3;

function pub(p, reps) {
  if (!p) return null;
  const hidden = p.who === 'guest' && (reps || 0) >= HIDE_AT;
  return { id: p.id, at: p.at, who: p.who, name: hidden ? '' : p.name, text: hidden ? '' : p.text, hidden: hidden };
}
function adminOk(pass) {
  const want = String(process.env.HEAD_ADMIN_HASH || '').trim().toLowerCase();
  if (!/^[a-f0-9]{64}$/.test(want)) return 'unset';
  const got = Buffer.from(L.sha(String(pass || '')), 'utf8');
  const exp = Buffer.from(want, 'utf8');
  return got.length === exp.length && crypto.timingSafeEqual(got, exp);
}

module.exports = async function handler(req, res) {
  try {
    if (!L.hasKV()) return L.send(res, 503, { ok: false, error: 'not_configured' });
    const url = new URL(req.url, 'http://x');
    if (req.method === 'GET') {
      if (url.searchParams.get('tk')) return L.send(res, 200, { ok: true, tk: L.issueToken() });
      const off = Math.min(Math.max(parseInt(url.searchParams.get('off'), 10) || 0, 0), MAX);
      const [ids, total] = await L.kv([['LRANGE', 'hd:list', String(off), String(off + PAGE - 1)], ['LLEN', 'hd:list']]);
      let items = [];
      if (ids && ids.length) {
        const [raw, reps] = await L.kv([['MGET'].concat(ids.map(i => 'hd:p:' + i)), ['HMGET', 'hd:reps'].concat(ids)]);
        items = ids.map((id, k) => { let p = null; try { p = JSON.parse(raw[k]); } catch (e) {} return pub(p, +reps[k] || 0); }).filter(Boolean);
      }
      return L.send(res, 200, { ok: true, total: total || 0, off: off, items: items }, 'public, s-maxage=15, stale-while-revalidate=60');
    }
    if (req.method !== 'POST') { res.setHeader('Allow', 'GET, POST'); return L.send(res, 405, { ok: false }); }
    if (!L.sameOrigin(req)) return L.send(res, 403, { ok: false, error: 'origin' });
    const b = await L.readJson(req, 6144), ip = L.ipKey(req);

    if (b.act === 'post') {
      if (b.website) return L.send(res, 200, { ok: true });
      if (!L.checkToken(b.tk)) return L.send(res, 400, { ok: false, error: 'ページを開き直してから、もう一度つぶやいてください。' });
      const text = L.clean(b.text, 140, false);
      if (!text || Array.from(text).length < 1) return L.send(res, 400, { ok: false, error: 'つぶやきを書いてね（140文字まで）。' });
      const mode = b.mode === 'admin' ? 'admin' : 'guest';
      let who = 'guest', name = 'ゲスト', dkHash = '';
      if (mode === 'admin') {
        const ok = adminOk(b.pass);
        if (ok === 'unset') return L.send(res, 400, { ok: false, error: 'admin_unset', message: '管理人パスワードがまだ設定されていません。ページの ?setup で設定方法が出ます。' });
        if (!ok) return L.send(res, 403, { ok: false, error: 'パスワードがちがいます。' });
        who = 'admin'; name = 'ぎぶてくすの中の人';
        if (!(await L.limit([['ha:' + ip, 30, 3600]]))) return L.send(res, 429, { ok: false, error: '少し時間をおいてね。' });
      } else {
        const nm = L.clean(b.name, 20, true);
        if (nm === null) return L.send(res, 400, { ok: false, error: 'ゲスト名は20文字までです。' });
        name = L.mask(nm || 'ゲスト');
        const spam = L.looksSpam([name, text].join('\n')); if (spam) return L.send(res, 400, { ok: false, error: spam });
        const dk = String(b.dk || ''); if (!/^[a-f0-9]{32}$/.test(dk)) return L.send(res, 400, { ok: false, error: 'ページを開き直してから、もう一度つぶやいてください。' });
        dkHash = L.sha(dk);
        if (!(await L.limit([['hg30:' + ip, 1, 30], ['hgh:' + ip, 10, 3600], ['hgd:' + ip, 30, 86400]])))
          return L.send(res, 429, { ok: false, error: '続けてつぶやけません。少し時間をおいてね。' });
      }
      const [id] = await L.kv([['INCR', 'hd:seq']]);
      const p = { id: id, at: Date.now(), who: who, name: name, text: L.mask(text), dk: dkHash };
      const [, len] = await L.kv([['SET', 'hd:p:' + id, JSON.stringify(p)], ['LPUSH', 'hd:list', String(id)]]);
      if (len > MAX) { const old = await L.kv([['RPOP', 'hd:list', String(len - MAX)]]); const gone = [].concat(old[0] || []); if (gone.length) await L.kv(gone.map(g => ['DEL', 'hd:p:' + g, 'hd:rp:' + g]).concat([['HDEL', 'hd:reps'].concat(gone)])); }
      if (who === 'guest') await L.notify('頭の中ブースにゲストのつぶやき', name + '\n\n' + p.text + '\n\nhttps://www.givetex.org/head/');
      return L.send(res, 200, { ok: true, item: pub(p, 0) });
    }
    const id = parseInt(b.id, 10); if (!(id > 0)) return L.send(res, 400, { ok: false, error: 'bad_id' });
    if (b.act === 'report') {
      if (!(await L.limit([['hv:' + ip, 40, 3600]]))) return L.send(res, 429, { ok: false, error: '少し時間をおいてね。' });
      const [raw] = await L.kv([['GET', 'hd:p:' + id]]); let p = null; try { p = JSON.parse(raw); } catch (e) {}
      if (!p) return L.send(res, 404, { ok: false, error: '見つかりません。' });
      if (p.who !== 'guest') return L.send(res, 400, { ok: false, error: '管理人のつぶやきは通報できません。' });
      const [added] = await L.kv([['SADD', 'hd:rp:' + id, ip]]);
      const [n] = added === 1 ? await L.kv([['HINCRBY', 'hd:reps', String(id), '1']]) : await L.kv([['HGET', 'hd:reps', String(id)]]);
      return L.send(res, 200, { ok: true, n: +n || 0, already: added !== 1, hidden: (+n || 0) >= HIDE_AT });
    }
    if (b.act === 'delete') {
      const dk = String(b.dk || ''); if (!/^[a-f0-9]{32}$/.test(dk)) return L.send(res, 400, { ok: false });
      if (!(await L.limit([['hdel:' + ip, 20, 3600]]))) return L.send(res, 429, { ok: false, error: '少し時間をおいてね。' });
      const [raw] = await L.kv([['GET', 'hd:p:' + id]]); let p = null; try { p = JSON.parse(raw); } catch (e) {}
      if (!p) return L.send(res, 404, { ok: false, error: '見つかりません。' });
      if (!p.dk || p.dk !== L.sha(dk)) return L.send(res, 403, { ok: false, error: '自分のつぶやきだけ消せます。' });
      await L.kv([['DEL', 'hd:p:' + id, 'hd:rp:' + id], ['LREM', 'hd:list', '0', String(id)], ['HDEL', 'hd:reps', String(id)]]);
      return L.send(res, 200, { ok: true, id: id });
    }
    L.send(res, 400, { ok: false, error: 'bad_act' });
  } catch (e) {
    L.send(res, e.status || 500, { ok: false, error: e.status ? 'もう一度ためしてね。' : 'サーバーで問題が起きました。' });
  }
};
