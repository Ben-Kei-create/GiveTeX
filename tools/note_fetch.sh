#!/bin/bash
# note（benkein）の記事一覧と本文を取得する。usage: tools/note_fetch.sh <保存先ディレクトリ>
# 1リクエストずつ、間隔をあけて取得します（note に負荷をかけないため）。
set -e
OUT="${1:?保存先ディレクトリを指定してください}"; mkdir -p "$OUT/list" "$OUT/body"
for pg in $(seq 1 200); do
  curl -sS "https://note.com/api/v2/creators/benkein/contents?kind=note&page=$pg" -o "$OUT/list/p$pg.json"
  python3 -I -c "import json,sys;sys.exit(0 if json.load(open('$OUT/list/p$pg.json'))['data']['isLastPage'] else 1)" && break
  sleep 1.2
done
python3 -I - "$OUT" <<'PY'
import json,glob,sys
out=sys.argv[1]; seen={}
for f in glob.glob(out+'/list/p*.json'):
    for x in json.load(open(f))['data']['contents']:
        seen[x['key']]=dict(key=x['key'],title=x['name'],date=x['publishAt'],price=x.get('price'),url=x.get('noteUrl'),desc=x.get('description'),eyecatch=x.get('eyecatch'),tags=[])
json.dump(list(seen.values()),open(out+'/index.json','w'),ensure_ascii=False)
open(out+'/keys.txt','w').write('\n'.join(seen))
print('articles',len(seen))
PY
while read k; do
  [ -s "$OUT/body/$k.json" ] && continue
  curl -sS --max-time 30 "https://note.com/api/v3/notes/$k" -o "$OUT/body/$k.json"; sleep 1.1
done < "$OUT/keys.txt"
echo "done: $(ls "$OUT/body" | wc -l) bodies"
