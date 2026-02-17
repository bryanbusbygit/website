#!/usr/bin/env bash
set -euo pipefail

OUTPUT_DIR="assets/gallery-gifs"
TMP_DIR="$(mktemp -d)"
SOURCE_HTML=""

FPS=10
WIDTH=320

cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

ensure_dependency() {
  local bin="$1"
  local brew_pkg="$2"
  if command -v "$bin" >/dev/null 2>&1; then
    return 0
  fi

  if ! command -v brew >/dev/null 2>&1; then
    echo "Missing dependency: ${bin} (Homebrew not found to install ${brew_pkg})" >&2
    exit 1
  fi

  echo "Installing missing dependency: ${brew_pkg}"
  brew install "$brew_pkg"
}

if [[ -f "index.html" ]]; then
  SOURCE_HTML="index.html"
elif [[ -f "index2.html" ]]; then
  SOURCE_HTML="index2.html"
else
  echo "Could not find index2.html or index.html" >&2
  exit 1
fi

ensure_dependency "yt-dlp" "yt-dlp"
ensure_dependency "ffmpeg" "ffmpeg"

mkdir -p "$OUTPUT_DIR"

urls=()
while IFS= read -r url; do
  urls+=("$url")
done < <(
  grep 'class="gallery-link"' "$SOURCE_HTML" \
    | sed -E 's/.*href="([^"]+)".*/\1/' \
    | head -n 12
)

if (( ${#urls[@]} != 12 )); then
  echo "Expected 12 gallery links in ${SOURCE_HTML}, found ${#urls[@]}" >&2
  exit 1
fi

# Explicit replacement requested for clip 9.
urls[8]="https://www.youtube.com/watch?v=H4M6hB0jPo8"

for idx in "${!urls[@]}"; do
  clip_number=$((idx + 1))
  clip_id="$(printf "%02d" "$clip_number")"
  start_seconds=15
  duration=15

  # Per-clip timing overrides requested by user.
  case "$clip_number" in
    1)
      start_seconds=44
      duration=10
      ;;
    2)
      start_seconds=9
      duration=11
      ;;
    3)
      start_seconds=0
      duration=2
      ;;
    4)
      start_seconds=160
      duration=6
      ;;
    5)
      start_seconds=20
      duration=15
      ;;
    7)
      start_seconds=60
      duration=12
      ;;
    8)
      start_seconds=18
      duration=9
      ;;
    9)
      start_seconds=157
      duration=10.5
      ;;
    11)
      start_seconds=1.7
      duration=1.3
      ;;
    12)
      start_seconds=0
      duration=10
      ;;
  esac

  url="${urls[$idx]}"
  input_template="${TMP_DIR}/clip-${clip_id}.%(ext)s"
  output_gif="${OUTPUT_DIR}/clip-${clip_id}.gif"
  palette="${TMP_DIR}/palette-${clip_id}.png"

  rm -f "${TMP_DIR}/clip-${clip_id}".* "$palette"

  echo "Downloading clip-${clip_id} from ${url}"
  yt-dlp \
    --no-playlist \
    --quiet \
    --no-warnings \
    -S "res:480" \
    -f "bv*+ba/b" \
    --output "$input_template" \
    "$url"

  input_video="$(find "$TMP_DIR" -maxdepth 1 -type f -name "clip-${clip_id}.*" | head -n 1)"
  if [[ -z "$input_video" ]]; then
    echo "Unable to find downloaded file for clip-${clip_id}" >&2
    exit 1
  fi

  echo "Encoding ${output_gif} (start=${start_seconds}s, duration=${duration}s)"
  ffmpeg \
    -v error \
    -y \
    -ss "$start_seconds" \
    -t "$duration" \
    -i "$input_video" \
    -vf "fps=${FPS},scale=${WIDTH}:-2:flags=lanczos,format=rgb24,palettegen=stats_mode=diff" \
    "$palette"

  ffmpeg \
    -v error \
    -y \
    -ss "$start_seconds" \
    -t "$duration" \
    -i "$input_video" \
    -i "$palette" \
    -lavfi "fps=${FPS},scale=${WIDTH}:-2:flags=lanczos,format=rgb24[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=5" \
    "$output_gif"

  echo "Wrote ${output_gif}"
done

echo "Regenerated all gallery GIFs."
