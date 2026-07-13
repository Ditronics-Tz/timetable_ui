# E2E smoke checklist (Phase 10)

Automated Playwright/Cypress is optional when browsers/Docker are unavailable.
Run this manually against `docker compose up` or the three-terminal local stack.

1. Health: `GET /api/health` → `db=up`, `redis=up` (or note degraded if services down).
2. Register user → land on `/verify-email` (no auto-login).
3. Confirm `role=user` cannot open `/rooms/add` (insufficient permissions).
4. Login `admin@example.com` / `password`.
5. Create 2 departments, 3 programs, 5 modules, 3 classes, 4 rooms, 6 staff.
6. Allocations: assign staff to modules.
7. Timetable Preview dry-run for a class → schedule or clear unsat reasons.
8. Commit generate → Preview grid shows slots.
9. Manual entry conflict → 409 message in UI.
10. Edit course/module/room via manage screens → lists reflect changes.
11. Logout → protected routes redirect to login; `auth` cleared from localStorage.

## Playwright happy path (when Playwright + stack available)

```bash
# from repo root, with stack up:
# npx playwright install chromium
# npx playwright test e2e/smoke.spec.js
```

See `e2e/smoke.spec.js` for a minimal login → dashboard → departments add sketch.
Optional; not run in CI on hosts without Docker/browsers.

