# Frontend DECISIONS

## Part 1 — App shell overlap (2026-07-13)

**Root cause:** Sidebar (`.sidebar` in `Navbar.css`) is `position: fixed; width: 240px` with no matching offset on the app shell’s main column. `App.css` is empty, so `.main-content` starts at `left: 0` and paints under the sidebar. Legacy page CSS files inconsistently add `margin-left: 250px` / `280px`, which still mismatches the 240px rail and breaks on mobile.

**Fix:** CSS Grid app shell (`--sidebar-width` token). Sidebar is an in-flow grid column (`sticky` within the column), not a floating fixed layer that steals space. Legacy `margin-left: 250px` offsets are neutralized so content is not double-offset.

## Part 2 — Post-create navigation

**Root cause:** Add-form `handleSubmit` handlers call `create()` then only set a local success message and clear the form — no `navigate()` to the entity list route.

**Fix:** On success, toast + `navigate('/<entity>/view')`. Optional “Save and add another” stays on the form. Errors keep field values and show `extractApiError` inline.
