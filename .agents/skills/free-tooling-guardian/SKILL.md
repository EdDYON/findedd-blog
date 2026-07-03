---
name: free-tooling-guardian
description: Audit, install, configure, or recommend tooling for findedd.cn while enforcing free, local, open-source, and maintainable choices. Use for dependencies, MCP servers, Storybook, BackstopJS, Lighthouse CI, component libraries, analytics, visual testing, or any external service proposal.
---

# Free Tooling Guardian

## Allow

- shadcn/ui
- Radix UI
- Tailwind CSS or existing CSS
- Playwright MCP or local Playwright
- Chrome DevTools MCP
- Storybook for local previews
- BackstopJS for local visual regression
- Lighthouse CI for local quality checks
- local scripts and local Codex skills
- maintained open-source npm packages used normally within the project

## Reject

- Figma MCP
- v0
- 21st.dev
- Chromatic
- Percy
- paid UI kits or component marketplaces
- paid analytics, visual testing, AI design, or image-generation workflows
- anything requiring an ongoing paid quota or long-term third-party account binding

## Evaluate A Tool

1. Inspect `package.json`, existing configuration, and current project capabilities.
2. Explain the concrete gap the tool would fill.
3. Confirm normal long-term local use is free and open-source where possible.
4. Check whether an existing dependency or a small local script solves the gap.
5. Prefer small, maintained packages with limited permissions.
6. Show install commands, scripts, configuration files, and risks before installation.
7. Wait for explicit approval before installing optional quality tooling.
8. Never modify secrets or global Codex configuration without explicit approval.
9. Keep MCP configuration project-level in `.codex/config.toml`.

Do not add a dependency for one-off styling or a task that existing browser and build tools can verify.

