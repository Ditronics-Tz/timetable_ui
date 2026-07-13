# Local setup — run backend + frontend + solver

## Prerequisites

| Tool | Version / notes |
|------|------------------|
| Go | 1.20+ (module says 1.23) |
| Node.js | 18+ (Vite) |
| npm | preferred |
| Python | 3.11+ (solver local) |
| PostgreSQL | local or Docker |
| Redis | local or Docker |
| Docker Compose | optional full stack |

---

## One-command stack (Docker)

From repo root:

```bash
docker compose up --build
```

Services:

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8080/api/health |
| Solver | http://localhost:8090/health |
| Postgres | localhost:5432 |
| Redis | localhost:6379 |

Default admin: `admin@example.com` / `password` (`super_admin`).

---

## Manual local (no Docker)

### 1. PostgreSQL + Redis

```sql
CREATE DATABASE "SACAS";
```

```bash
docker run -d --name sacas-redis -p 6379:6379 redis:7
# or local Redis
```

### 2. Backend

```bash
cd Sacas-backend
copy .env.example .env    # Windows
# set CSRF_ENABLED=false, CORS_ALLOWED_ORIGINS, DATABASE_URL, SOLVER_URL
go mod tidy
go run ./cmd/api
```

CORS preflight check (PowerShell):

```powershell
curl.exe -i -X OPTIONS http://localhost:8080/api/health `
  -H "Origin: http://localhost:5173" `
  -H "Access-Control-Request-Method: GET"
```

Expect `204` with `Access-Control-Allow-Origin` and related headers.

### CSRF (when `CSRF_ENABLED=true`)

SPA flow:

1. On load, frontend calls `GET /api/csrf` (issues Redis-backed token + `X-CSRF-Token` header + `csrf_token` cookie).
2. Every mutating request sends **`X-CSRF-Token` header** (cookie alone is rejected).
3. If a `csrf_token` cookie is present, the header must match it (double-submit).

```powershell
# Bootstrap
$r = Invoke-WebRequest http://localhost:8080/api/csrf -SessionVariable s
$token = $r.Headers['X-CSRF-Token']
# Mutate with header
Invoke-RestMethod -Method POST -Uri http://localhost:8080/api/auth/login `
  -WebSession $s -ContentType application/json `
  -Headers @{ 'X-CSRF-Token' = $token } `
  -Body '{"email":"admin@example.com","password":"password"}'
```

Local SPA dev: keep `CSRF_ENABLED=false` unless testing the full flow.

Health:

```powershell
Invoke-RestMethod http://localhost:8080/api/health
```

### 3. Solver (Option A)

```bash
cd solver-service
python -m venv .venv
.\.venv\Scripts\activate   # Windows
pip install -r requirements.txt
$env:PYTHONPATH="."
uvicorn app.main:app --host 0.0.0.0 --port 8090
pytest -q
```

### 4. Frontend (Vite)

```bash
cd timetable_ui
copy .env.example .env
npm install
npm run dev
```

Open http://localhost:5173.

```bash
npm test
npm run build
npm run preview
```

---

## Suggested three-terminal workflow

| Terminal | Command |
|----------|---------|
| 1 | `cd Sacas-backend && go run ./cmd/api` |
| 2 | `cd solver-service && uvicorn app.main:app --port 8090` |
| 3 | `cd timetable_ui && npm run dev` |

---

## Common failures

| Symptom | Likely cause |
|---------|----------------|
| CORS error | Origin not in `CORS_ALLOWED_ORIGINS` |
| 403 CSRF | `CSRF_ENABLED=true` without token — set false for SPA dev |
| Login 403 inactive | Verify email first |
| Timetable 403 | Need admin role |
| Solver timeout / greedy | `SOLVER_URL` down; check `engine` in generate response |
| Docker backend no .env | Env vars come from compose — OK |

---

## Tests

```bash
# Backend
cd Sacas-backend && go test ./... && go vet ./...

# Frontend
cd timetable_ui && npm test

# Solver
cd solver-service && pytest -q
```
