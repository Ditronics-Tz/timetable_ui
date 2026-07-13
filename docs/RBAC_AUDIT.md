# Frontend RBAC (see also backend `docs/RBAC_AUDIT.md`)

## Role source of truth

`getRole()` reads **JWT claim `role`** first, then falls back to `user.role` in `localStorage`.  
`setAuth` overwrites `user.role` from the token so UI cannot drift from the signed claim.

## Nav filter

`Navbar` renders admin sections only when `isAdmin()` is true  
(`administrator` | `super_admin`).

## Route guards

| Path pattern | Guard |
|--------------|--------|
| `/dashboard`, `/settings` | `RequireAuth` |
| `/timetable`, `/preview`, rooms/classes/modules/staff/programs/departments/allocations/* | `RequireAuth` + `RequireRole` admin+ |

## Tests

- `src/lib/auth.test.js` — JWT overrides stale role, user is not admin  
- `src/components/RequireRole.test.jsx` — user blocked, super_admin allowed, spoofed user blob denied  
