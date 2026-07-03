---
name: responsive-qa
description: Verify findedd.cn interfaces after UI changes at mobile, tablet, and desktop sizes using available browser automation or inspection tools. Use after any layout, component, navigation, filter, kitchen, burger-stage, or visual interaction change, and for visual audits that must not alter business logic.
---

# Responsive QA

## Test Matrix

Check:

- `390x844`
- `768x1024`
- `1440x900`

Check the changed route first, then related core routes when the shared layout or navigation changed. Common routes are `/`, `/cook`, `/burgers`, `/ingredients`, and `/random` when they exist.

## Inspect The Experience

Look for:

- horizontal scrolling
- clipped or blank burger and ingredient sprites
- overlapping controls or text
- crowded cards and broken grids
- unreadable Chinese copy
- tiny mobile targets
- unusable filters, drawers, and dialogs
- sticky elements covering content
- unclear primary actions
- missing loading, empty, and disabled states
- keyboard focus or interaction failures
- console errors and obvious performance regressions

Exercise the changed interaction, including selection, cancellation, empty state, long content, and full state where relevant.

## Report Or Verify

For an audit-only request, do not edit. Report route, viewport, issue, severity, recommended fix, and likely files. End with the five highest-priority issues and the smallest next task.

After implementation, report pass or fail for each viewport and interaction. If browser tooling is unavailable, state that limitation rather than claiming visual verification.

