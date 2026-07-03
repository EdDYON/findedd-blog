---
name: findedd-workflow
description: Orchestrate findedd.cn engineering, visual, content, data, review, and tooling tasks through a scoped audit-plan-implement-verify workflow. Use for any task in the findedd-blog repository, especially requests involving pages, components, burger or ingredient data, visual QA, dependencies, deployment preparation, or PR review.
---

# Findedd Workflow

## Route The Task

Load only the specialist skills needed for the request:

- UI page or visual review: `findedd-visual-director`
- One component polish pass: `pixel-ui-polisher`
- Any UI verification: `responsive-qa`
- Burger recipes, ingredient IDs, or filtering logic: `burger-data-guardian`
- Dependencies, MCP, test tools, or external services: `free-tooling-guardian`

Combine skills when the task crosses concerns. A `/cook` redesign normally uses the visual director, responsive QA, and burger data guardian. A dependency-only request normally uses only the free tooling guardian.

## Execute The Workflow

1. Read `AGENTS.md`, `package.json`, git status, and the files directly involved.
2. Separate user changes from task changes. Never revert unrelated work.
3. Classify the request as audit-only, implementation, data, tooling, or review.
4. State the current issue, scope, and files likely to change.
5. For audit-only or option-selection requests, stop before editing. Otherwise continue after the short plan without unnecessary confirmation.
6. Create or use a focused branch. Do not work directly on `main`.
7. Implement the smallest complete change using existing project patterns.
8. Preserve business logic unless the request explicitly changes behavior.
9. Run `npm run lint` and `npm run build` after code or configuration changes.
10. For UI changes, run responsive QA at `390x844`, `768x1024`, and `1440x900` when browser tooling is available.
11. Report changed files, user-visible outcome, checks, and remaining risk.

## Scope Gates

- One task should normally touch one page, one component, one data concern, or one tooling concern.
- Do not turn a component polish request into a page rewrite.
- Do not add dependencies for one-off styling.
- Do not install Storybook, BackstopJS, Lighthouse CI, or other optional tooling without explicit approval after an audit.
- Do not deploy, approve visual baselines, change secrets, or add a backend unless explicitly requested.

## Review Mode

When asked to audit, review, or inspect:

1. Do not edit.
2. Lead with concrete findings ordered by severity.
3. Include affected files or pages.
4. Give the smallest recommended next task.
5. State what should remain unchanged.

