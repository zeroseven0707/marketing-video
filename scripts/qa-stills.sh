#!/bin/sh
# Render still QA: ID:frame ... -> renders/qa/ID-fN.png, lalu gabung jadi lembar kontak renders/qa/sheet.png
set -e
mkdir -p renders/qa
files=""
for pair in "$@"; do
  id=${pair%%:*}; f=${pair##*:}
  npx remotion still "$id" "renders/qa/$id-f$f.png" --frame="$f" --scale=0.4 --log=error >/dev/null
  files="$files renders/qa/$id-f$f.png"
done
python3 scripts/qa-sheet.py renders/qa/sheet.png $files
echo "renders/qa/sheet.png"
