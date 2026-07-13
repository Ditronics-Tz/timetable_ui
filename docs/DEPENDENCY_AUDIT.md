# Frontend dependency audit (Phase 8)

## Before (CRA / react-scripts 5)

| Finding | Package | Severity | Remediation |
|---------|---------|----------|-------------|
| Unmaintained toolchain | `react-scripts@5.0.1` | High (transitive) | **Removed** — migrate to Vite 6 |
| webpack-dev-server / postcss / svgo issues | CRA transitive | High/Critical historically | Eliminated with CRA removal |
| `@craco/craco` | unused path risk | Medium | **Removed** |
| `@tremor/react` | unused in wired screens | Low | **Removed** to shrink surface |
| `@shadcn/ui` CLI package | not runtime | Low | **Removed** from package.json |
| `web-vitals` | optional | Low | **Removed** (not required) |

## After

- Build: **Vite 6** + `@vitejs/plugin-react`
- Test: **Vitest 3** + Testing Library + jsdom
- Env: `VITE_API_URL` (was `REACT_APP_API_URL`)
- Scripts: `dev` / `build` / `preview` / `test`

### Audit command

```bash
cd timetable_ui
npm install
npm audit --audit-level=high
```

**After `npm audit fix` (this session):** `npm audit --audit-level=high` → **0 vulnerabilities**.

### Choice: Vitest over Jest

Documented in `DECISIONS.md` — Vitest is Vite-native, least churn, same RTL API.
