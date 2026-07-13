# SACAS Timetable UI

React admin SPA for the **SACAS** university timetable system.

| | |
|--|--|
| **Repo** | https://github.com/Ditronics-Tz/timetable_ui |
| **Backend (separate)** | https://github.com/Ditronics-Tz/Sacas-backend |
| **Dev URL** | http://localhost:5173 |

## Stack

- **React 19** · **Vite 6** · **React Router 7**
- **Tailwind CSS** · **Radix UI** · **Lucide** · **Axios** · **Vitest**
- App shell: CSS Grid sidebar + main (collapsible desktop / drawer mobile)

---

## Quick start (Windows)

### 1. Backend must be running

In the backend repo:

```powershell
cd ..\Sacas-backend
go run .
```

API: http://localhost:8080

### 2. Frontend

```powershell
cd timetable_ui
copy .env.example .env
# Ensure:
# VITE_API_URL=http://localhost:8080/api

npm install
npm run dev
```

Open **http://localhost:5173**

---

## Demo login

Use accounts seeded by the backend (password for all: **`password`**):

| Email | Role |
|-------|------|
| `admin@example.com` | super_admin (full access) |
| `coordinator@sacas.local` | administrator (timetable admin) |
| `lecturer@sacas.local` | user (no admin screens) |

Details: backend `DEMO_ACCOUNTS.txt`.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` / `npm start` | Vite dev server (port **5173**) |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Serve production build |
| `npm test` | Vitest unit tests |

### Env

```env
VITE_API_URL=http://localhost:8080/api
```

- In **dev**, if unset, Vite proxies `/api` → `http://localhost:8080` (see `vite.config.js`).
- In **production build**, `VITE_API_URL` must be set at build time.
- Never commit `.env` — only `.env.example`.

### Docker (UI only)

```powershell
docker build --build-arg VITE_API_URL=http://localhost:8080/api -t sacas-ui .
docker run -p 3000:80 sacas-ui
```

---

## App structure (UI)

```
src/
  App.js                 # routes + auth guards
  components/
    Layout.js            # app shell (grid)
    Navbar.js            # sidebar nav
    PageHeader.jsx       # title + breadcrumbs
    Toast.jsx            # success/error toasts
    RequireAuth.jsx
    RequireRole.jsx
    ui/                  # Radix/shadcn-style primitives
  views/                 # pages (Dashboard, Add/View/Manage, Auth, …)
  services/              # axios API clients
  styles/
    tokens.css           # design tokens
    shell.css            # shell + sidebar layout
  lib/                   # auth helpers, apiError
```

### UX notes (current)

- **Shell:** sidebar does not overlap main content (grid reserves width).
- **After create:** add forms navigate to the entity **view/list** page; **Save and add another** stays on the form.
- **Roles:** timetable admin routes require `administrator` / `super_admin`.

Domain names in the UI map to backend models:

| UI label | Backend |
|----------|---------|
| Department | Faculty |
| Program | Course |
| Module / Class / Room / Staff | same |

See [docs/domain-mapping.md](./docs/domain-mapping.md).

---

## Docs (this repo)

| File | Topic |
|------|--------|
| [DECISIONS.md](./DECISIONS.md) | Shell overlap root cause, nav decisions |
| [docs/frontend.md](./docs/frontend.md) | Routes & structure |
| [docs/domain-mapping.md](./docs/domain-mapping.md) | UI ↔ API field mapping |
| [docs/integration.md](./docs/integration.md) | FE/BE alignment |
| [docs/setup.md](./docs/setup.md) | Setup notes |
| [docs/DEPENDENCY_AUDIT.md](./docs/DEPENDENCY_AUDIT.md) | Vite / audit notes |
| [e2e/smoke.md](./e2e/smoke.md) | Manual smoke checklist |

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| CORS / network errors | Backend running? `CORS_ALLOWED_ORIGINS` includes `http://localhost:5173`? |
| Login works, admin pages blocked | Use `admin@…` or `coordinator@…` (not `lecturer@…`) |
| Blank / clipped layout | Hard refresh (Ctrl+Shift+R); ensure latest `shell.css` loaded |
| API 401 on lists | Token expired — log in again |
| Build fails on env | Set `VITE_API_URL` before `npm run build` |
