# SACAS documentation

University timetable system: Go API + React (Vite) UI + OR-Tools solver.

| Doc | Purpose |
|-----|---------|
| [setup.md](./setup.md) | Local + Docker runbook |
| [api-contract.md](./api-contract.md) | HTTP API (source of truth) |
| [domain-mapping.md](./domain-mapping.md) | UI labels ↔ backend models |
| [solver-contract.md](./solver-contract.md) | Python solver request/response |
| [DEPENDENCY_AUDIT.md](./DEPENDENCY_AUDIT.md) | Phase 8 frontend audit |
| [backend.md](./backend.md) | Backend architecture notes |
| [frontend.md](./frontend.md) | Frontend notes |
| [integration.md](./integration.md) | Integration glue |

Root `DECISIONS.md` records judgment calls across phases.

## Quick start

```bash
# Full stack
docker compose up --build

# Or manual: Postgres + Redis + backend + solver + Vite UI
# See setup.md
```

**Seed admin:** `admin@example.com` / `password` (`super_admin`)
