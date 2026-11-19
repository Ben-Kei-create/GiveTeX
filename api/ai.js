/* AI の窓口（さくらのAI Engine）。POST /api/ai { mode, q }
   mode:
     guide … ホームのイルカに質問 → サイトの案内（リンクつき・短く）
     books … ドパ読！の本えらび → 96冊の中から3冊（理由つき）
     fumi  … スタンプブースの fumi の返事（ルールにない話しかけのときだけ）
   - 同じサイトからだけ・1人1日の回数・サイト全体の1日の回数を制限（_ai.js でも月の上限を数える）
   - AI が使えないとき（鍵なし・上限・失敗）は { ok:false, fallback:true } を返す → 画面側は今までの動きにもどす
   - 入力も出力も保存しない（同じ質問の答えだけ、短い間キャッシュする） */
const L = require('./_lib');
const AI = require('./_ai');
const CTX = require('./_ai_context');
const LINKSET = new Set(CTX.links);
const BOOK = {}; CTX.books.forEach(b => { BOOK[b.a] = b; });

function norm(s) { return String(s || '').normalize('NFKC').toLowerCase().replace(/\s+/g, ' ').trim(); }

/* 答えの中のリンクは、このサイトの中のページだけ残す（ほかは文字だけにする） */
function safeLinks(s) {
  return String(s).replace(/\[([^\]]{1,40})\]\(([^)\s]{1,120})\)/g, (m, label, url) => {
    const u = url.replace(/^https?:\/\/(www\.)?givetex\.org/, '');
    return u.startsWith('/') && LINKSET.has(u.split('#')[0]) ? '[' + label + '](' + u + ')' : label;
  }).replace(/https?:\/\/\S+/g, '');
}
function shortText(s, max) { s = String(s || '').replace(/\r/g, '').replace(/\n{3,}/g, '\n\n').trim(); return Array.from(s).length > max ? Array.from(s).slice(0, max).join('') + '…' : s; }

async function guide(q) {
  const sys = 'あなたは「GiveTex」というホームページの右下に住んでいる、やさしいイルカの案内係です。\n' +
    '下の「サイトの案内書き」だけを使って、来た人の質問に日本語で答えてください。\n' +
    '- 120文字以内、です・ます調ではなく、やわらかい話し言葉で（「〜だよ」「〜してみて」）。\n' +
    '- 関係するページがあれば、[ページの名前](/パス) の形でリンクを1〜2個つける。パスは案内書きにあるものだけ。\n' +
    '- 案内書きにないことは「わからない」と正直に言い、作り話をしない。個人的なこと（管理人の本名・住所など）には答えない。\n' +
    '- 危ないこと・人を傷つけることには答えない。\n\n【サイトの案内書き】\n' + CTX.site;
  const out = await AI.chat([{ role: 'system', content: sys }, { role: 'user', content: q }], { max: 260, temp: .6, cacheKey: 'g:' + L.sha(norm(q)).slice(0, 24), cacheSec: 3 * 86400 });
  return out && { text: shortText(safeLinks(out), 160) };
}

async function books(q) {
  const list = CTX.books.map(b => b.a + '｜' + b.g + '｜' + b.t + (b.s && b.t.indexOf(b.s) < 0 ? '：' + b.s : '')).join('\n');
  const sys = 'あなたは電子書籍シリーズ「ドパ読！（30秒で読む）」の本えらび係です。\n' +
    '来た人の「いまの気分・知りたいこと」に合う本を、下の一覧の中から3冊えらんでください。一覧にない本は、ぜったいに出さないでください。\n' +
    '答えは JSON だけで、ほかの文は書かないでください。形：{"picks":[{"a":"ASIN","why":"40文字以内のおすすめの理由（やわらかい話し言葉）"}]}\n\n【一覧（ASIN｜ジャンル｜書名）】\n' + list;
  const out = await AI.chat([{ role: 'system', content: sys }, { role: 'user', content: q }], { max: 420, temp: .5, cacheKey: 'b:' + L.sha(norm(q)).slice(0, 24), cacheSec: 3 * 86400 });
  if (!out) return null;
  let picks = [];
  try { const j = JSON.parse((out.match(/\{[\s\S]*\}/) || ['{}'])[0]); picks = (j.picks || []).filter(p => p && BOOK[p.a]).slice(0, 3); } catch (e) { picks = []; }
  if (!picks.length) { // JSON で返ってこなかったときは、文の中の ASIN をひろう
    const seen = {}; (out.match(/B0[A-Z0-9]{8}/g) || []).forEach(a => { if (BOOK[a] && !seen[a] && picks.length < 3) { seen[a] = 1; picks.push({ a: a, why: '' }); } });
  }
  if (!picks.length) return null;
  return { picks: picks.map(p => ({ a: p.a, t: BOOK[p.a].t, g: BOOK[p.a].g, c: BOOK[p.a].c, why: shortText(String(p.why || '').replace(/https?:\/\/\S+/g, ''), 50), u: '/books/' + p.a + '.html' })) };
}

async function fumi(q, hist) {
  const sys = 'あなたは「GiveTex スタンプ部」のチャットにいる fumi です。LINE スタンプをつくっている、明るくてやさしい人です。\n' +
    '- LINE のトークのように、60文字以内で短く、話し言葉で返事をする。絵文字は0〜1個。\n' +
    '- サイトの話題なら、下の案内書きをもとに [ページの名前](/パス) のリンクを1個までつけてよい。\n' +
    '- 個人的なこと（本名・住所・連絡先など）は聞かないし、答えない。危ないこと・人を傷つけることには乗らない。作り話はしない。\n\n【サイトの案内書き】\n' + CTX.site;
  const msgs = [{ role: 'system', content: sys }];
  (Array.isArray(hist) ? hist.slice(-4) : []).forEach(h => { if (h && (h.r === 'me' || h.r === 'fumi') && typeof h.t === 'string') msgs.push({ role: h.r === 'me' ? 'user' : 'assistant', content: L.clean(h.t, 120, true) }); });
  msgs.push({ role: 'user', content: q });
  const out = await AI.chat(msgs, { max: 160, temp: .8 });
  return out && { text: shortText(safeLinks(out), 90) };
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return L.send(res, 405, { ok: false });
  if (!L.sameOrigin(req)) return L.send(res, 403, { ok: false });
  if (!AI.enabled()) return L.send(res, 200, { ok: false, fallback: true });
  let b; try { b = await L.readJson(req, 4000); } catch (e) { return L.send(res, 400, { ok: false }); }
  const mode = String(b.mode || ''), q = L.clean(b.q, mode === 'books' ? 120 : 200, true);
  if (!/^(guide|books|fumi)$/.test(mode) || !q || Array.from(q).length < 2) return L.send(res, 400, { ok: false, error: 'もう少しくわしく書いてね。' });
  if (L.looksSpam(q)) return L.send(res, 200, { ok: false, fallback: true });
  const ip = L.ipKey(req);
  const per = { guide: 12, books: 6, fumi: 25 }[mode];
  if (!(await L.limit([['ai1:' + ip, 1, 3], ['aid:' + mode + ':' + ip, per, 86400]]))) return L.send(res, 200, { ok: false, fallback: true, limited: true });
  let out = null;
  try { out = mode === 'guide' ? await guide(q) : mode === 'books' ? await books(q) : await fumi(q, b.h); } catch (e) { console.warn('ai', e && e.message); }
  if (!out) return L.send(res, 200, { ok: false, fallback: true });
  out.ok = true; L.send(res, 200, out);
};
