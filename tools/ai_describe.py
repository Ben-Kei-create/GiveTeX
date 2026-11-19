#!/usr/bin/env python3
"""写真から、説明文と alt（画像の説明）の下書きを作る（管理人用。サイトには載らない道具）
さくらのAI Engine の、画像がわかるモデルを使う。

使い方：
  SAKURA_AI_TOKEN=（発行したトークン） python3 tools/ai_describe.py ramen/img/r05.webp museum/img/x.jpg
  オプション：
    --kind ramen|museum|any   … 書き方の種類（ラーメンの食券向け／美術館の額向け／ふつう）。ふつうは any
    --model モデル名          … 省略時は SAKURA_AI_MODEL か preview/GLM-5.3-Flash
出力：画像ごとに「text（説明文）」と「alt（画像の説明）」の下書き。そのまま貼らずに、見なおしてから使う。

- 店名・場所・人の名前は、写真にはっきり書いてあるもの以外は書かせない（推測させない）
- 人が写っていたら、その人のことは書かずに「人物が写っています（掲載前に確認）」と知らせる
- トークンはこのファイルにもリポジトリにも書かない。月の無料枠を使うので、1回に送るのは10枚まで
"""
import base64, io, json, os, pathlib, sys, urllib.request

BASE = os.environ.get('SAKURA_AI_BASE', 'https://api.ai.sakura.ad.jp').rstrip('/')
TOKEN = os.environ.get('SAKURA_AI_TOKEN', '')
PROMPT = {
    'ramen': 'ラーメンの写真です。サイトの「食券」に載せる、見たまんまの説明を書いてください。味の感想や点数は書かない（食べた人が書くので）。',
    'museum': '美術館で撮った写真です。額の横に貼る、落ちついた短い説明を書いてください。作品名や作者は、写真に文字ではっきり写っているときだけ書く。',
    'any': 'サイトに載せる写真です。見たまんまの短い説明を書いてください。',
}

def image_url(path):
    data = pathlib.Path(path).read_bytes(); mime = 'image/jpeg'
    try:  # Pillow があれば、送る前に小さくする（回数は同じでも、速くなる）
        from PIL import Image
        im = Image.open(io.BytesIO(data)).convert('RGB'); im.thumbnail((1024, 1024))
        buf = io.BytesIO(); im.save(buf, 'JPEG', quality=82); data = buf.getvalue()
    except Exception:
        ext = pathlib.Path(path).suffix.lower()
        mime = {'.png': 'image/png', '.webp': 'image/webp', '.gif': 'image/gif'}.get(ext, 'image/jpeg')
    return 'data:' + mime + ';base64,' + base64.b64encode(data).decode()

def ask(path, kind, model):
    sys_prompt = ('あなたはホームページの編集を手伝う人です。' + PROMPT[kind] +
                  '\n- 店名・地名・人名は、写真に文字ではっきり写っているものだけ。推測で書かない。'
                  '\n- 人が写っていたら、その人の見た目は書かず、"person": true にする。'
                  '\n答えは JSON だけ：{"text":"説明文（60〜90文字・やわらかい言い方）","alt":"画像の説明（40文字以内）","person":false}')
    body = {'model': model, 'max_tokens': 400, 'temperature': .3, 'reasoning_effort': 'none', 'messages': [
        {'role': 'system', 'content': sys_prompt},
        {'role': 'user', 'content': [{'type': 'text', 'text': 'この写真について書いてください。'}, {'type': 'image_url', 'image_url': {'url': image_url(path)}}]}]}
    req = urllib.request.Request(BASE + '/v1/chat/completions', data=json.dumps(body).encode(), method='POST',
                                 headers={'Authorization': 'Bearer ' + TOKEN, 'Content-Type': 'application/json'})
    with urllib.request.urlopen(req, timeout=60) as r: j = json.load(r)
    s = j['choices'][0]['message']['content'] or ''
    try: return json.loads(s[s.index('{'): s.rindex('}') + 1])
    except Exception: return {'text': s.strip(), 'alt': '', 'person': None}

def main(argv):
    if not TOKEN: sys.exit('SAKURA_AI_TOKEN がありません（発行したトークンを、コマンドの前に入れて実行してください）')
    kind, model, files = 'any', os.environ.get('SAKURA_AI_MODEL', 'preview/GLM-5.3-Flash'), []
    it = iter(argv)
    for a in it:
        if a == '--kind': kind = next(it)
        elif a == '--model': model = next(it)
        else: files.append(a)
    if kind not in PROMPT: sys.exit('--kind は ramen / museum / any のどれか')
    if not files: sys.exit(__doc__)
    if len(files) > 10: sys.exit('1回に送るのは10枚までにしてください（無料の回数を守るため）')
    for f in files:
        try: r = ask(f, kind, model)
        except Exception as e: r = {'error': str(e)[:200]}
        print('■', f); print(json.dumps(r, ensure_ascii=False, indent=1))
        if r.get('person'): print('  ⚠ 人物が写っています。載せる前に、写っている人の許可や、外すかどうかを確認してください。')

if __name__ == '__main__':
    main(sys.argv[1:])
