---
name: pixel-ui-polisher
description: Polish one findedd.cn UI component such as BurgerCard, IngredientCard, PixelButton, FlavorTag, navigation, BurgerBuildStage, or a kitchen control. Use for tightly scoped component improvements where business logic and data models must remain unchanged.
---

# Pixel UI Polisher

## Keep The Scope Small

Focus on one component or one tightly related component group. Do not rewrite unrelated pages, alter data models, or introduce a dependency for styling.

## Polish The Component

1. Inspect the component, its callers, styles, states, and current mobile behavior.
2. Identify problems in hierarchy, spacing, color, image sizing, interaction, focus, and reuse.
3. State the small plan and affected files.
4. Improve the component without changing its business behavior.
5. Use crisp borders, warm food colors, readable type, stable dimensions, and restrained sticker shadows.
6. Add playful hover and active feedback without noisy motion or layout shift.
7. Preserve accessibility, keyboard focus, disabled states, empty states, and long-text behavior.
8. Update its Storybook story only if Storybook already exists.
9. Verify mobile behavior and run `npm run lint` plus `npm run build`.

## Reject Scope Creep

- Do not redesign the whole page to fix one card.
- Do not change filtering, recipe, or selection logic unless explicitly requested.
- Do not introduce generic SaaS styling.
- Do not add paid services or new packages for a one-off visual effect.

