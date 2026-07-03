---
name: findedd-visual-director
description: Design or review findedd.cn pages, components, colors, spacing, burger cards, ingredient cards, kitchen interactions, and pixel-food UI. Use whenever a request changes or evaluates the site's visual hierarchy, layout, copy presentation, interaction styling, or brand consistency.
---

# Findedd Visual Director

## Preserve The Identity

Build a pixel burger atlas and retro fast-food menu, not a generic SaaS product.

Use:

- cream paper backgrounds
- tomato-red primary actions
- cheese-yellow highlights
- bun-gold surfaces
- lettuce-green success states
- beef-brown text and borders
- crisp pixel borders and food sprites
- restrained sticker-like shadows
- playful but readable Chinese copy

Avoid gray dashboards, glassmorphism, random gradients, purple or blue technology palettes, bland cards, crowded layouts, and tiny low-contrast text.

## Direct The Change

1. Inspect the target page, component, data source, and nearby style rules.
2. Identify hierarchy, spacing, color, image treatment, interaction, and responsive problems.
3. State a small visual plan and the files likely to change.
4. Reuse existing tokens and components before introducing new ones.
5. Use shadcn/ui or Radix UI only as accessible primitives and restyle them for findedd.cn.
6. Preserve business logic unless the request explicitly changes behavior.
7. Keep large static data out of page components.
8. Pair implementation with `responsive-qa`.

## Check The Result

- Give food imagery a stable, clear display region.
- Keep the hierarchy visual, name, tags, short copy, then action.
- Make the main action obvious without making every control loud.
- Use pixel type only for short decorative accents; keep Chinese body text easy to read.
- Keep mobile targets thumb-friendly.
- Prevent clipping, overlap, accidental horizontal scrolling, and dense card walls.
- Run `npm run lint` and `npm run build`.

