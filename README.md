# SACAS Timetable UI

React admin SPA for the **SACAS** university timetable system.

| | |
|--|--|
| **Repo** | https://github.com/Ditronics-Tz/timetable_ui |
| **Backend (separate)** | https://github.com/Ditronics-Tz/Sacas-backend |
| **Dev URL** | http://localhost:5173 |

## Stack

- **React 19** · **Vite 6** · **React Router 7**
- **Tailwind** · **Radix UI** · **Lucide** · **Axios** · **Vitest**
- App shell: **CSS Grid** sidebar + main (collapse on desktop, drawer on mobile)

---

## Quick start (Windows)

### 1. Start backend first

```powershell
cd ..\Sacas-backend
go run .
```

API: http://localhost:8080

### 2. Frontend

```powershell
cd timetable_ui
copy .env.example .env
# VITE_API_URL=http://localhost:8080/api

npm install
npm run dev
```

Open **http://localhost:5173** (hard refresh after updates: Ctrl+Shift+R).

---

## Demo login

Passwords all: **`password`** (seeded by backend)

| Email | Role | UI |
|-------|------|-----|
| `admin@example.com` | super_admin | Full admin nav |
| `coordinator@sacas.local` | administrator | Full admin nav |
| `lecturer@sacas.local` | user | Dashboard + Settings only |

Backend file: `Sacas-backend/DEMO_ACCOUNTS.txt`

---

## RBAC (frontend)

- **JWT claim `role` is source of truth** (`getRole()` / `isAdmin()`).
- Admin routes wrapped in `RequireAuth` + `RequireRole` (`administrator` \| `super_admin`).
- Non-admin direct URL → **Insufficient permissions** screen (not blank).
- Sidebar hides Timetable / Rooms / Staff / … for `role=user`.
- Backend still enforces 403 on APIs — UI hide is not the security boundary.

Details: **[docs/RBAC_AUDIT.md](./docs/RBAC_AUDIT.md)**

---

## Features / UX notes

| Area | Behavior |
|------|----------|
| App shell | Grid layout — content not under sidebar |
| After create | Navigates to entity **view** list; **Save and add another** optional |
| `/timetable` | **Generate** + **Preview dry-run** only (no manual entry form) |
| Weekly grid | `/preview` |
| Domain labels | Department → Faculty, Program → Course ([domain-mapping](./docs/domain-mapping.md)) |

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` / `npm start` | Vite dev (**5173**) |
| `npm run build` | Production → `dist/` |
| `npm run preview` | Preview production build |
| `npm test` | Vitest |

### Env

```env
VITE_API_URL=http://localhost:8080/api
```

- Dev: optional proxy `/api` → backend (`vite.config.js`) if unset.
- Production build: set `VITE_API_URL` at build time.
- Never commit `.env`.

### Docker (UI only)

```powershell
docker build --build-arg VITE_API_URL=http://localhost:8080/api -t sacas-ui .
docker run -p 3000:80 sacas-ui
```

---

## Layout

```
src/
  App.js                 # routes + guards
  components/
    Layout.js            # app shell
    Navbar.js            # role-aware sidebar
    PageHeader.jsx
    Toast.jsx
    RequireAuth.jsx / RequireRole.jsx
  views/                 # pages (no manual timetable form)
  services/              # API clients
  styles/tokens.css shell.css
  lib/auth.js            # JWT role helpers
```

---

## Docs index

| File | Topic |
|------|--------|
| [DECISIONS.md](./DECISIONS.md) | Shell + nav decisions |
| [docs/RBAC_AUDIT.md](./docs/RBAC_AUDIT.md) | FE RBAC |
| [docs/frontend.md](./docs/frontend.md) | Routes / structure |
| [docs/domain-mapping.md](./docs/domain-mapping.md) | UI ↔ API names |
| [docs/integration.md](./docs/integration.md) | FE/BE alignment |
| [docs/setup.md](./docs/setup.md) | Setup |
| [docs/DEPENDENCY_AUDIT.md](./docs/DEPENDENCY_AUDIT.md) | Vite / audit |
| [e2e/smoke.md](./e2e/smoke.md) | Manual smoke checklist |

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| CORS / network | Backend up? `CORS_ALLOWED_ORIGINS` includes `http://localhost:5173`? |
| Admin pages blocked | Use admin account, not `lecturer@…` |
| Clipped layout | Hard refresh; latest `shell.css` |
| 401 on lists | Re-login |
| Build env | Set `VITE_API_URL` before `npm run build` |
