#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
ASSETS_DIR="$ROOT_DIR/app/src/main/assets"
FLAGS_DIR="$ASSETS_DIR/flags"

mkdir -p "$FLAGS_DIR"

echo "Scarico elenco codici -> countries.json"
curl -s https://flagcdn.com/en/codes.json -o /tmp/codes.json

if ! command -v jq >/dev/null 2>&1; then
  echo "jq non trovato. Installalo (es: sudo apt-get install jq)" >&2
  exit 1
fi

jq -r 'to_entries | map({code:.key, name_en:.value})' /tmp/codes.json > "$ASSETS_DIR/countries.json"

echo "Scarico bandiere PNG 320px..."
count=0
while read -r code; do
  url="https://flagcdn.com/w320/${code}.png"
  out="$FLAGS_DIR/${code}.png"
  if curl -fsSL "$url" -o "$out"; then
    count=$((count+1))
    printf "."
  else
    echo "\nMancata: $code" >&2
  fi
done < <(jq -r '.[].code' "$ASSETS_DIR/countries.json")

echo "\nFatto. Bandiere scaricate: $count"

