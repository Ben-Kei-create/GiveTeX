/* さくらのAI Engine（OpenAI と同じ形の API）を呼ぶ共通部品
   - 鍵は Vercel の環境変数 SAKURA_AI_TOKEN（リポジトリやチャットには書かない）
   - モデルは SAKURA_AI_MODEL（なければ preview/GLM-5.3-Flash）。使えなかったら SAKURA_AI_MODEL_FALLBACK（なければ gpt-oss-120b）
   - 無料の枠（月3,000回）を超えないように、サイト全体で「1日 AI_DAY 回・1か月 AI_MONTH 回」まで（Upstash で数える）
   - 同じ質問はしばらくキャッシュして、回数を使わない
   - 鍵がない・上限・失敗・時間切れのときは null を返す（呼ぶ側は、今までの動きにもどす） */
const L = require('./_lib');
const BASE = (process.env.SAKURA_AI_BASE || 'https://api.ai.sakura.ad.jp').replace(/\/$/, '');
const TOKEN = process.env.SAKURA_AI_TOKEN || '';
const MODEL = process.env.SAKURA_AI_MODEL || 'preview/GLM-5.3-Flash';
const MODEL2 = process.env.SAKURA_AI_MODEL_FALLBACK || 'gpt-oss-120b';
const DAY_MAX = +process.env.AI_DAY || 85, MONTH_MAX = +process.env.AI_MONTH || 2700;

function enabled() { return !!TOKEN; }
function month() { return L.jstDay().slice(0, 7); }

/* サイト全体の残り回数を1つ使う（使えなければ false） */
async function spend(n) {
  n = n || 1;
  if (!L.hasKV()) return true; // ローカル確認用
  const d = 'ai:day:' + L.jstDay(), m = 'ai:mon:' + month();
  const out = await L.kv([['INCRBY', d, String(n)], ['EXPIRE', d, String(3 * 86400), 'NX'], ['INCRBY', m, String(n)], ['EXPIRE', m, String(40 * 86400), 'NX']]);
  return out[0] <= DAY_MAX && out[2] <= MONTH_MAX;
}

/* モデルごとの「考える処理」の指定：gpt-oss は none を受けつけない（400 になる）ので low。ほかは none をためして、だめなら指定なし */
function effortFor(model) { return /^gpt-oss/.test(model) ? 'low' : 'none'; }
async function call(model, messages, opt, ms, effort) {
  const ac = new AbortController(), timer = setTimeout(() => ac.abort(), ms);
  try {
    // 考える途中の文も max_tokens に数えられるので、上限は多めにして、答えはこちらで短く切る（無料枠は回数で数えるので、多めでも回数は同じ）
    const body = { model: model, messages: messages, max_tokens: Math.max(opt.max || 400, 1200), temperature: opt.temp == null ? .7 : opt.temp, stream: false };
    if (effort) body.reasoning_effort = effort;
    const r = await fetch(BASE + '/v1/chat/completions', {
      method: 'POST', signal: ac.signal,
      headers: { 'Authorization': 'Bearer ' + TOKEN, 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(body)
    });
    const text = await r.text();
    if (!r.ok) return { err: r.status, text: text.slice(0, 200) };
    const j = JSON.parse(text), c = j.choices && j.choices[0] && j.choices[0].message;
    let s = c && (typeof c.content === 'string' ? c.content : Array.isArray(c.content) ? c.content.map(x => x.text || '').join('') : '');
    s = String(s || '').replace(/<think>[\s\S]*?<\/think>/g, '').trim(); // 考えている途中の文が混ざったら消す
    return s ? { text: s } : { err: 'empty' };
  } catch (e) { return { err: e.name === 'AbortError' ? 'timeout' : 'net' }; }
  finally { clearTimeout(timer); }
}
/* 1つのモデルで：考える処理の指定つき → 400 なら指定なしで、もう1回 */
async function tryModel(model, messages, opt, ms) {
  let r = await call(model, messages, opt, ms, effortFor(model));
  if (r.err === 400) r = await call(model, messages, opt, ms, null);
  return r;
}
let goodModel = null; // 使えたモデルを、しばらく覚えておく（むだな失敗で回数を使わないように）

/* チャット。opt: { max, temp, ms, cacheKey, cacheSec, cost }。返り値は文字列 or null */
async function chat(messages, opt) {
  opt = opt || {};
  if (!enabled()) return null;
  if (opt.cacheKey && L.hasKV()) { const [hit] = await L.kv([['GET', 'ai:c:' + opt.cacheKey]]); if (hit) return hit; }
  if (!(await spend(opt.cost || 1))) return null;
  const ms = opt.ms || 12000;
  if (!goodModel && L.hasKV()) { const [gm] = await L.kv([['GET', 'ai:model']]); if (gm) goodModel = gm; }
  const order = Array.from(new Set([goodModel, MODEL, MODEL2].filter(Boolean)));
  let r = { err: 'none' };
  for (const m of order) {
    r = await tryModel(m, messages, opt, ms);
    if (!r.err) { if (m !== goodModel) { goodModel = m; if (L.hasKV()) await L.kv([['SET', 'ai:model', m, 'EX', '86400']]); } break; }
    if (r.err === 'timeout' || r.err === 429 || r.err === 401) break; // 時間切れ・回数オーバー・鍵ちがいは、ほかのモデルでも同じ
  }
  if (r.err || !r.text) { console.warn('ai error', r.err, r.text || ''); return null; }
  if (opt.cacheKey && L.hasKV()) await L.kv([['SET', 'ai:c:' + opt.cacheKey, r.text, 'EX', String(opt.cacheSec || 7 * 86400)]]);
  return r.text;
}

/* 荒らしの見張り：「ng」か「ok」。AI が使えないときは null（今までのチェックだけで通す） */
async function moderate(text) {
  if (!enabled()) return null;
  const out = await chat([
    { role: 'system', content: 'あなたは日本語の掲示板の見張り役です。投稿が「他人への悪口・差別・脅し・性的な内容・個人情報（電話番号・住所・本名の暴露）・宣伝や詐欺」にあたるなら ng、そうでなければ ok とだけ答えてください。映画の辛口の感想や、作品への批判は ok です。' },
    { role: 'user', content: String(text).slice(0, 1200) }
  ], { max: 5, temp: 0, ms: 8000 });
  if (!out) return null;
  return /^\s*ng/i.test(out) ? 'ng' : 'ok';
}

module.exports = { enabled, chat, moderate };
