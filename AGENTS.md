# findedd.cn Project Rules

## Project

findedd.cn is a Next.js website for a pixel-art world burger atlas, a pixel ingredient library, and an interactive burger kitchen.

Keep the product focused on:

- world burger atlas
- pixel ingredient library
- interactive burger builder
- retro fast-food menu styling
- playful, readable Chinese copy
- mobile-friendly browsing

## Hard Limits

Use only free, long-term tools and local or open-source workflows.

Do not use Figma MCP, v0, 21st.dev, Chromatic, paid SaaS tools, paid design systems, paid component marketplaces, or paid AI design services.

Do not:

- work directly on `main`; create a focused branch
- rewrite the whole application for a scoped request
- modify secrets or environment variables
- add an external backend unless explicitly requested
- add unnecessary dependencies
- hard-code large static datasets inside page components
- replace the visual identity with generic SaaS, admin dashboard, glassmorphism, or unrelated gradients
- revert or overwrite unrelated user changes

## Allowed Tools

- shadcn/ui and Radix UI as accessible primitives, restyled for findedd.cn
- Tailwind CSS or the existing CSS system
- Playwright or local browser automation for interaction and responsive QA
- Chrome DevTools for browser inspection and performance diagnosis
- Storybook for local component previews
- BackstopJS for local visual regression
- Lighthouse CI for local performance, accessibility, best-practices, and SEO checks
- local skills under `.agents/skills`

Before adding a dependency, verify that existing dependencies cannot solve the problem, that the package is maintained, and that normal long-term local use is free.

## Visual Identity

The site should feel like a pixel burger world and a retro fast-food menu:

- cream paper backgrounds
- tomato-red primary actions
- cheese-yellow highlights
- bun-gold surfaces
- lettuce-green success states
- beef-brown text and borders
- crisp pixel borders
- restrained sticker-like shadows
- clear pixel sprites and food illustrations

Prioritize readable Chinese text. Reserve pixel fonts for decorative labels, numbers, and short accents. Avoid bland gray cards, pure-white empty layouts, random purple or blue technology gradients, tiny low-contrast text, crowded grids, and excessive glass effects.

## UI Rules

Before implementing UI:

1. Inspect relevant components, data, and styles.
2. State the current problems and the files likely to change.
3. Propose a small, scoped plan.
4. Preserve business logic unless the request explicitly changes it.
5. Reuse existing components and tokens where practical.
6. Keep static data in `src/data` or the existing data layer.
7. Keep page components focused on layout and composition.

Maintain a clear card hierarchy: visual, name, category or region, flavor tags, short description, then action.

For UI work, check these viewports:

- `390x844`
- `768x1024`
- `1440x900`

Prevent horizontal scrolling, clipped burger sprites, overlapping controls, unreadable labels, and undersized mobile targets.

## Burger Data Rules

A valid burger needs:

- a base such as a bun, lettuce wrap, bagel, muffin, tortilla, toast, or bread
- a main body such as beef, chicken, fish, seafood, mushroom, bean patty, veggie patty, egg, or a cheese-heavy base
- moisture from sauce, melted cheese, egg yolk, relish, mayo, yogurt sauce, or a creamy spread
- freshness or acidity from lettuce, tomato, onion, pickle, slaw, herbs, kimchi, salsa, cucumber, or a similar ingredient

Never create random ingredient piles. Every world burger needs a clear cultural and flavor reason. Ingredient IDs must exist in the canonical ingredient dataset, and equivalent ingredients must not be duplicated under different IDs.

## Workflow

For each task:

1. Read the relevant files and current git state.
2. Route the task through `.agents/skills/findedd-workflow/SKILL.md`.
3. Audit before editing; for review-only requests, stop after findings and recommendations.
4. Keep changes within one page, component, data concern, or infrastructure concern unless the user asks for broader work.
5. Explain planned file changes before editing.
6. Implement the smallest complete change.
7. Run the real project checks from `package.json`: `npm run lint` and `npm run build`.
8. For UI changes, verify `390x844`, `768x1024`, and `1440x900` when browser tooling is available.
9. Summarize changed files, outcome, checks, and remaining risks.

Do not install optional quality tooling automatically. Audit first, show the proposed commands and files, and wait for explicit approval.

## Current Commands

- `npm run dev`
- `npm run lint`
- `npm run build`
- `npm run start`

