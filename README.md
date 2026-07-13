# SACAS Timetable UI

React admin SPA for the SACAS timetable system.

**Repo:** https://github.com/Ditronics-Tz/timetable_ui  
**Backend (separate):** https://github.com/Ditronics-Tz/Sacas-backend

## Stack

- React 19 + Vite 6 + React Router 7
- Tailwind + Radix UI + Axios + Vitest

## Quick start

```bash
cp .env.example .env
# VITE_API_URL=http://localhost:8080/api
npm install
npm run dev
```

App: `http://localhost:5173`  
Requires backend API running (see backend repo).

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite dev server |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview production build |
| `npm test` | Vitest |

### Docker (UI only)

```bash
docker build --build-arg VITE_API_URL=http://localhost:8080/api -t sacas-ui .
docker run -p 3000:80 sacas-ui
```

## Docs (this repo only)

| File | Topic |
|------|--------|
| [docs/frontend.md](./docs/frontend.md) | Routes, structure, services |
| [docs/domain-mapping.md](./docs/domain-mapping.md) | Department→Faculty, Program→Course |
| [docs/integration.md](./docs/integration.md) | How UI talks to API |
| [docs/setup.md](./docs/setup.md) | Local setup with backend |
| [docs/DEPENDENCY_AUDIT.md](./docs/DEPENDENCY_AUDIT.md) | npm audit / Vite migration |
| [e2e/smoke.md](./e2e/smoke.md) | Manual E2E checklist |

## Env

```env
VITE_API_URL=http://localhost:8080/api
```

Never commit `.env` (only `.env.example`).
