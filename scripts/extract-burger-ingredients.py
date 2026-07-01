from __future__ import annotations

import json
import re
from collections import deque
from dataclasses import dataclass
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter


ROOT = Path(__file__).resolve().parents[1]

TEXT_PATH = Path(
    r"C:\Users\25773\.codex\attachments\a42fd8f4-fe97-456a-a46f-3342a0eb8560\pasted-text.txt"
)

SOURCE_IMAGES = [
    Path(r"E:\ggdownload\ChatGPT Image 2026年7月1日 10_03_26 (1).png"),
    Path(r"E:\ggdownload\ChatGPT Image 2026年7月1日 10_03_28 (2).png"),
    Path(r"E:\ggdownload\ChatGPT Image 2026年7月1日 10_03_28 (3).png"),
    Path(r"E:\ggdownload\ChatGPT Image 2026年7月1日 10_03_29 (4).png"),
    Path(r"E:\ggdownload\ChatGPT Image 2026年7月1日 10_03_29 (5).png"),
    Path(r"E:\ggdownload\ChatGPT Image 2026年7月1日 10_03_30 (6).png"),
    Path(r"E:\ggdownload\ChatGPT Image 2026年7月1日 10_03_30 (7).png"),
    Path(r"E:\ggdownload\ChatGPT Image 2026年7月1日 10_03_31 (8).png"),
    Path(r"E:\ggdownload\ChatGPT Image 2026年7月1日 10_03_31 (9).png"),
]

SHEET_CATEGORY = {
    1: "常用食材",
    2: "面包胚与底座",
    3: "主体蛋白与肉类",
    4: "芝士、鸡蛋与奶香配料",
    5: "叶菜、香草与清爽层",
    6: "蔬菜、酸黄瓜、辣椒与洋葱",
    7: "特色加料与创意配件",
    8: "经典酱料",
    9: "特色酱料、香料与收尾调味",
}

OVERVIEW_NAMES = [
    "芝麻汉堡胚",
    "布里欧修胚",
    "原味汉堡胚",
    "椒盐卷饼胚",
    "黑炭胚",
    "全麦多谷物胚",
    "芝麻汉堡胚",
    "布里欧修胚",
    "原味汉堡胚",
    "椒盐卷饼胚",
    "黑炭胚",
    "全麦多谷物胚",
    "烤纹牛肉饼",
    "手打厚牛肉饼",
    "烤鸡肉饼",
    "脆皮炸鸡排",
    "面包糠鱼排",
    "蔬菜素饼",
    "培根条",
    "烤火腿片",
    "煎蛋",
    "美式芝士片",
    "瑞士芝士",
    "胡椒杰克芝士",
    "白切达",
    "卷叶生菜",
    "冰山生菜",
    "罗马生菜",
    "芝麻菜",
    "菠菜叶",
    "卷心菜沙拉丝",
    "番茄片",
    "深色番茄片",
    "红洋葱圈",
    "白洋葱圈",
    "酸黄瓜片",
    "酸黄瓜条",
    "墨西哥辣椒圈",
    "白蘑菇片",
    "炒蘑菇",
    "牛油果片",
    "菠萝圈",
    "烤红椒条",
    "香蕉椒圈",
    "炸洋葱丝",
    "炸洋葱圈",
    "卷心菜沙拉",
    "酸黄瓜酱 / Relish",
    "番茄酱",
    "黄芥末酱",
    "蛋黄酱",
    "辣味奶酪抹酱",
    "汉堡酱",
    "烧烤酱",
    "司拉差辣酱",
    "青酱 / Pesto",
    "牧场酱",
]


@dataclass
class TextItem:
    name: str
    description: str
    category: str


def parse_text_items() -> tuple[list[TextItem], dict[str, list[TextItem]], dict[str, TextItem]]:
    text = TEXT_PATH.read_text(encoding="utf-8")
    items: list[TextItem] = []
    by_category: dict[str, list[TextItem]] = {}
    by_name: dict[str, TextItem] = {}
    category = ""
    in_table = False

    for raw_line in text.splitlines():
        line = raw_line.strip()
        if not line:
            continue
        if line == "可以放在网站里的分类说明":
            break
        section = re.match(r"^\d+\.\s*(.+)$", line)
        if section:
            category = section.group(1).strip()
            in_table = False
            by_category.setdefault(category, [])
            continue
        if line in {"食材\t介绍", "酱料\t介绍"}:
            in_table = True
            continue
        if in_table and "\t" in line:
            name, description = [part.strip() for part in line.split("\t", 1)]
            item = TextItem(name=name, description=description, category=category)
            items.append(item)
            by_category.setdefault(category, []).append(item)
            by_name.setdefault(name, item)

    return items, by_category, by_name


def is_background_like(rgb: np.ndarray) -> np.ndarray:
    arr = rgb.astype(np.int16)
    max_c = arr.max(axis=2)
    min_c = arr.min(axis=2)
    saturation = max_c - min_c
    brightness = arr.mean(axis=2)

    # The generated sheets use a grey/white checkerboard. Pixel-art highlights
    # are also pale, so we only classify broad neutral pixels as background.
    return (saturation <= 10) & (brightness >= 176)


def trim_alpha(rgba: Image.Image) -> Image.Image:
    alpha = rgba.getchannel("A")
    bbox = alpha.getbbox()
    if bbox is None:
        return rgba
    pad = 2
    left = max(0, bbox[0] - pad)
    top = max(0, bbox[1] - pad)
    right = min(rgba.width, bbox[2] + pad)
    bottom = min(rgba.height, bbox[3] + pad)
    return rgba.crop((left, top, right, bottom))


def transparent_crop(source: Image.Image, bbox: tuple[int, int, int, int]) -> Image.Image:
    crop = source.crop(bbox).convert("RGBA")
    rgb = np.array(crop.convert("RGB"))
    bg_like = is_background_like(rgb)
    h, w = bg_like.shape

    # Keep tiny internal white highlights, but remove large checkerboard regions
    # and holes inside ring-shaped ingredients.
    transparent = np.zeros((h, w), dtype=bool)
    seen = np.zeros((h, w), dtype=bool)
    queue: deque[tuple[int, int]] = deque()

    def add_if_bg(y: int, x: int) -> None:
        if 0 <= y < h and 0 <= x < w and bg_like[y, x] and not seen[y, x]:
            seen[y, x] = True
            queue.append((y, x))

    for x in range(w):
        add_if_bg(0, x)
        add_if_bg(h - 1, x)
    for y in range(h):
        add_if_bg(y, 0)
        add_if_bg(y, w - 1)

    while queue:
        y, x = queue.popleft()
        transparent[y, x] = True
        add_if_bg(y - 1, x)
        add_if_bg(y + 1, x)
        add_if_bg(y, x - 1)
        add_if_bg(y, x + 1)

    # Remove bigger isolated checkerboard islands inside holes, while preserving
    # small sparkle highlights and sesame-like pale pixels.
    seen_internal = transparent.copy()
    for y0 in range(h):
        for x0 in range(w):
            if seen_internal[y0, x0] or not bg_like[y0, x0]:
                continue
            pixels: list[tuple[int, int]] = []
            queue.append((y0, x0))
            seen_internal[y0, x0] = True
            while queue:
                y, x = queue.popleft()
                pixels.append((y, x))
                for ny, nx in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)):
                    if 0 <= ny < h and 0 <= nx < w and bg_like[ny, nx] and not seen_internal[ny, nx]:
                        seen_internal[ny, nx] = True
                        queue.append((ny, nx))
            if len(pixels) >= 60:
                for y, x in pixels:
                    transparent[y, x] = True

    rgba = np.array(crop)
    rgba[:, :, 3] = np.where(transparent, 0, rgba[:, :, 3])
    return trim_alpha(Image.fromarray(rgba, "RGBA"))


def find_segments(image: Image.Image) -> list[tuple[int, int, int, int, int, int]]:
    rgb = np.array(image.convert("RGB"))
    foreground = (~is_background_like(rgb)).astype(np.uint8) * 255

    # Find rows with only light dilation, otherwise nearby rows on dense sheets
    # collapse into one giant crop. We connect fragments more strongly only
    # inside each row when finding columns.
    row_mask_image = Image.fromarray(foreground, "L").filter(ImageFilter.MaxFilter(3))
    row_mask = np.array(row_mask_image) > 0

    row_active = row_mask.sum(axis=1) > 24
    row_bands: list[tuple[int, int]] = []
    start = None
    for y, active in enumerate(row_active):
        if active and start is None:
            start = y
        elif not active and start is not None:
            if y - start >= 18:
                row_bands.append((start, y))
            start = None
    if start is not None and image.height - start >= 18:
        row_bands.append((start, image.height))

    segments: list[tuple[int, int, int, int, int, int]] = []
    for row_number, (top, bottom) in enumerate(row_bands, start=1):
        connected_row = Image.fromarray(foreground[top:bottom], "L").filter(ImageFilter.MaxFilter(1))
        col_mask = np.array(connected_row) > 0
        col_active = col_mask.sum(axis=0) > 10
        col_bands: list[tuple[int, int]] = []
        start = None
        for x, active in enumerate(col_active):
            if active and start is None:
                start = x
            elif not active and start is not None:
                if x - start >= 18:
                    col_bands.append((start, x))
                start = None
        if start is not None and image.width - start >= 18:
            col_bands.append((start, image.width))

        for column_number, (left, right) in enumerate(col_bands, start=1):
            pad = 4
            bbox = (
                max(0, left - pad),
                max(0, top - pad),
                min(image.width, right + pad),
                min(image.height, bottom + pad),
            )
            if bbox[2] - bbox[0] >= 24 and bbox[3] - bbox[1] >= 24:
                segments.append((*bbox, row_number, column_number))

    return segments


def make_item_for_sprite(
    sheet: int,
    sprite_index: int,
    by_category: dict[str, list[TextItem]],
    by_name: dict[str, TextItem],
) -> TextItem:
    if sheet == 1 and sprite_index <= len(OVERVIEW_NAMES):
        name = OVERVIEW_NAMES[sprite_index - 1]
        if name in by_name:
            item = by_name[name]
            return TextItem(name=item.name, description=item.description, category="常用食材")
        return TextItem(name=name, description="常用汉堡像素素材，可用于厨房组装和图鉴展示。", category="常用食材")

    category = SHEET_CATEGORY[sheet]
    category_items = by_category.get(category, [])
    if sprite_index <= len(category_items):
        return category_items[sprite_index - 1]

    return TextItem(
        name=f"{category}素材 {sprite_index:02d}",
        description="备用像素素材，适合后续扩展汉堡配方或作为装饰贴图。",
        category=category,
    )


def write_ts_file(records: list[dict[str, object]]) -> None:
    data_dir = ROOT / "src" / "data"
    data_dir.mkdir(parents=True, exist_ok=True)
    ts_path = data_dir / "pixelIngredients.ts"
    payload = json.dumps(records, ensure_ascii=False, indent=2)
    ts_path.write_text(
        "export type PixelIngredient = {\n"
        "  id: string\n"
        "  name: string\n"
        "  description: string\n"
        "  category: string\n"
        "  image: string\n"
        "  sheet: number\n"
        "  row: number\n"
        "  column: number\n"
        "  index: number\n"
        "}\n\n"
        f"export const pixelIngredients: PixelIngredient[] = {payload}\n",
        encoding="utf-8",
    )


def main() -> None:
    _, by_category, by_name = parse_text_items()

    pixel_dir = ROOT / "public" / "assets" / "ingredients" / "pixel"
    pixel_dir.mkdir(parents=True, exist_ok=True)

    for old in pixel_dir.glob("*.png"):
        old.unlink()

    records: list[dict[str, object]] = []
    global_index = 1

    for sheet, source_path in enumerate(SOURCE_IMAGES, start=1):
        if not source_path.exists():
            raise FileNotFoundError(source_path)

        image = Image.open(source_path).convert("RGBA")
        segments = find_segments(image)
        for sprite_index, segment in enumerate(segments, start=1):
            left, top, right, bottom, row, column = segment
            item = make_item_for_sprite(sheet, sprite_index, by_category, by_name)
            filename = f"ingredient-{global_index:03d}-s{sheet:02d}-r{row:02d}-c{column:02d}.png"
            crop = transparent_crop(image, (left, top, right, bottom))
            alpha = np.array(crop.getchannel("A"))
            visible = np.argwhere(alpha > 0)
            if visible.size == 0:
                continue
            visible_height = int(visible[:, 0].max() - visible[:, 0].min() + 1)
            visible_width = int(visible[:, 1].max() - visible[:, 1].min() + 1)
            opaque_pixels = int((alpha > 0).sum())
            if visible_width < 28 or visible_height < 18 or opaque_pixels < 520:
                continue
            crop.save(pixel_dir / filename, optimize=True)
            records.append(
                {
                    "id": f"ingredient-{global_index:03d}",
                    "name": item.name,
                    "description": item.description,
                    "category": item.category,
                    "image": f"/assets/ingredients/pixel/{filename}",
                    "sheet": sheet,
                    "row": row,
                    "column": column,
                    "index": sprite_index,
                }
            )
            global_index += 1

        print(f"sheet {sheet:02d}: {len(segments)} sprites")

    write_ts_file(records)
    print(f"total: {len(records)} sprites")


if __name__ == "__main__":
    main()
