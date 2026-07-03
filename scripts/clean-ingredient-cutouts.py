from __future__ import annotations

import argparse
from collections import deque
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_ASSET_DIR = ROOT / "public" / "assets" / "ingredients" / "xlsx"


def is_light_neutral(r: int, g: int, b: int) -> bool:
    hi = max(r, g, b)
    lo = min(r, g, b)
    spread = hi - lo

    return (lo >= 226 and spread <= 34) or (lo >= 242 and spread <= 52)


def is_background_pixel(pixel: tuple[int, int, int, int]) -> bool:
    r, g, b, a = pixel
    if a <= 12:
        return True

    return is_light_neutral(r, g, b)


def mark_background(pixels: list[tuple[int, int, int, int]], width: int, height: int) -> set[int]:
    seen: set[int] = set()
    queue: deque[int] = deque()

    def add_if_background(index: int) -> None:
        if index in seen:
            return
        if is_background_pixel(pixels[index]):
            seen.add(index)
            queue.append(index)

    for x in range(width):
        add_if_background(x)
        add_if_background((height - 1) * width + x)

    for y in range(height):
        add_if_background(y * width)
        add_if_background(y * width + width - 1)

    while queue:
        index = queue.popleft()
        x = index % width
        y = index // width

        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if nx < 0 or nx >= width or ny < 0 or ny >= height:
                continue
            next_index = ny * width + nx
            if next_index in seen:
                continue
            if is_background_pixel(pixels[next_index]):
                seen.add(next_index)
                queue.append(next_index)

    return seen


def clean_image(path: Path) -> bool:
    image = Image.open(path).convert("RGBA")
    width, height = image.size
    source = image.load()
    pixels = [source[x, y] for y in range(height) for x in range(width)]
    original = pixels.copy()

    background = mark_background(pixels, width, height)

    for index in background:
        r, g, b, _a = pixels[index]
        pixels[index] = (r, g, b, 0)

    for index, (r, g, b, a) in enumerate(pixels):
        if 0 < a <= 10:
            a = 0
            pixels[index] = (r, g, b, a)

    if pixels == original:
        return False

    cleaned = Image.new("RGBA", image.size)
    cleaned.putdata(pixels)
    cleaned.save(path, optimize=True)
    return True


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dir", default=str(DEFAULT_ASSET_DIR), help="Directory containing ingredient PNGs.")
    args = parser.parse_args()

    asset_dir = Path(args.dir)
    changed = 0
    total = 0
    for path in sorted(asset_dir.glob("*.png")):
        total += 1
        if clean_image(path):
            changed += 1

    print(f"Cleaned {changed} of {total} PNG files in {asset_dir}")


if __name__ == "__main__":
    main()
