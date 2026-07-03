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


def find_components(pixels: list[tuple[int, int, int, int]], width: int, height: int) -> list[dict[str, object]]:
    seen = [False] * (width * height)
    components: list[dict[str, object]] = []

    for start, pixel in enumerate(pixels):
        if seen[start] or pixel[3] <= 12:
            continue

        stack = [start]
        seen[start] = True
        members: list[int] = []
        min_x = width
        min_y = height
        max_x = 0
        max_y = 0
        alpha_total = 0

        while stack:
            index = stack.pop()
            x = index % width
            y = index // width
            _r, _g, _b, alpha = pixels[index]

            members.append(index)
            alpha_total += alpha
            min_x = min(min_x, x)
            min_y = min(min_y, y)
            max_x = max(max_x, x + 1)
            max_y = max(max_y, y + 1)

            for nx in (x - 1, x, x + 1):
                for ny in (y - 1, y, y + 1):
                    if nx < 0 or nx >= width or ny < 0 or ny >= height or (nx == x and ny == y):
                        continue
                    next_index = ny * width + nx
                    if seen[next_index] or pixels[next_index][3] <= 12:
                        continue
                    seen[next_index] = True
                    stack.append(next_index)

        components.append(
            {
                "members": members,
                "area": len(members),
                "bbox": (min_x, min_y, max_x, max_y),
                "alpha": alpha_total / len(members),
            }
        )

    return components


def expanded_bbox(bbox: tuple[int, int, int, int], amount: int, width: int, height: int) -> tuple[int, int, int, int]:
    x1, y1, x2, y2 = bbox
    return (
        max(0, x1 - amount),
        max(0, y1 - amount),
        min(width, x2 + amount),
        min(height, y2 + amount),
    )


def bbox_contains(outer: tuple[int, int, int, int], inner: tuple[int, int, int, int]) -> bool:
    ox1, oy1, ox2, oy2 = outer
    ix1, iy1, ix2, iy2 = inner
    return ox1 <= ix1 and oy1 <= iy1 and ox2 >= ix2 and oy2 >= iy2


def union_bbox(boxes: list[tuple[int, int, int, int]]) -> tuple[int, int, int, int]:
    return (
        min(box[0] for box in boxes),
        min(box[1] for box in boxes),
        max(box[2] for box in boxes),
        max(box[3] for box in boxes),
    )


def remove_artifact_components(pixels: list[tuple[int, int, int, int]], width: int, height: int) -> None:
    components = find_components(pixels, width, height)
    if len(components) <= 1:
        return

    largest_area = max(int(component["area"]) for component in components)
    significant = [
        component
        for component in components
        if int(component["area"]) >= max(120, largest_area * 0.12)
    ]
    body_bbox = union_bbox([component["bbox"] for component in significant] or [max(components, key=lambda item: int(item["area"]))["bbox"]])
    loose_body = expanded_bbox(body_bbox, 10, width, height)

    for component in components:
        area = int(component["area"])
        bbox = component["bbox"]
        x1, y1, x2, y2 = bbox
        component_width = x2 - x1
        component_height = y2 - y1
        touches_edge = x1 == 0 or y1 == 0 or x2 == width or y2 == height
        is_thin_line = component_height <= 7 and component_width >= 16
        is_tiny = area <= 18
        outside_body = not bbox_contains(loose_body, bbox)
        above_body = y2 <= body_bbox[1] + 2
        below_body = y1 >= body_bbox[3] - 2

        should_remove = False
        if is_thin_line and area < largest_area * 0.18:
            should_remove = True
        elif touches_edge and area < largest_area * 0.16:
            should_remove = True
        elif outside_body and area < largest_area * 0.16:
            should_remove = True
        elif (above_body or below_body) and area < largest_area * 0.12:
            should_remove = True
        elif is_tiny and outside_body:
            should_remove = True

        if not should_remove:
            continue

        for index in component["members"]:
            r, g, b, _a = pixels[index]
            pixels[index] = (r, g, b, 0)


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

    remove_artifact_components(pixels, width, height)

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
