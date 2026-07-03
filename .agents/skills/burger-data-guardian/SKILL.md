---
name: burger-data-guardian
description: Add, validate, or review findedd.cn burger recipes, ingredient records, ingredient IDs, filtering, kitchen selection logic, and world burger content. Use whenever work touches burger composition, ingredient data consistency, recipe generation, cultural flavor logic, or data-driven burger pages.
---

# Burger Data Guardian

## Validate Every Burger

Require:

- a base: bun, lettuce wrap, bagel, muffin, tortilla, toast, or bread
- a main body: beef, chicken, fish, seafood, mushroom, bean patty, veggie patty, egg, or cheese-heavy base
- moisture: sauce, melted cheese, egg yolk, relish, mayo, yogurt sauce, or creamy spread
- freshness or acidity: lettuce, tomato, onion, pickle, slaw, herbs, kimchi, salsa, cucumber, or similar

Never create a random ingredient pile. Every recipe needs a concise explanation of why the flavors work together.

## Preserve Data Integrity

1. Read the canonical ingredient and burger datasets before editing.
2. Reuse existing ingredient IDs exactly.
3. Report missing, duplicate, or equivalent IDs instead of silently inventing aliases.
4. Keep data typed and reusable outside page components.
5. Keep image or sprite references aligned with the canonical ingredient record.
6. Add a validation function when the dataset is large enough that manual consistency checks are fragile.
7. Run lint and build after edits.

## Cultural Flavor Guide

- American: beef, cheese, pickles, mustard, ketchup, bacon, or BBQ
- Japanese: teriyaki, mayo, cabbage, chicken, or beef
- Korean: kimchi, gochujang mayo, fried chicken, or beef
- Mexican: jalapeno, guacamole, salsa, or pepper jack
- German: pretzel bun, sauerkraut, mustard, sausage, or beef
- Italian: tomato, basil, mozzarella, or pesto
- French: brioche, brie, blue cheese, or caramelized onion
- Indian: curry, mint yogurt, cilantro, onion, spicy chicken, or veggie patty
- Middle Eastern: falafel, tahini, pickles, or herbs
- British: fried fish, tartar sauce, lettuce, or pickles

Treat this as a coherence guide, not a rigid recipe generator. Explain deviations clearly.

