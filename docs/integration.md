# Integration — what must match so frontend and backend work together

This is the **most important doc** for continuing work. Backend and frontend were built in parallel; several contracts do not line up yet.

---

## Priority fixes (do these first)

### 1. API base path mismatch

| | Value |
|-|--------|
| Frontend (`Authservice.js`) | `http://localhost:8080/api/v1` |
| Backend routes | `http://localhost:8080/api` |

**Fix (frontend):**

```js
// preferred: env
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
```

Add `timetable_ui/.env`:

```env
REACT_APP_API_URL=http://localhost:8080/api
```

Also fix protected paths:

| Frontend today | Correct backend path |
|----------------|----------------------|
| `GET ${API_URL}/profile` | `GET /api/protected/profile` |
| `PUT ${API_URL}/users/:id` | `PUT /api/protected/users/:id` |
| Timetable resources | All under `/api/protected/timetable/...` |

---

### 2. CORS is missing on backend

Browser React (`localhost:3000`) calling API (`localhost:8080`) needs CORS.

**Backend must allow** (dev):

- Origin: `http://localhost:3000`
- Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH
- Headers: `Authorization`, `Content-Type`, `X-CSRF-Token`
- Credentials: true (if using cookies)

Without this, login from the UI fails even if paths are correct.

---

### 3. CSRF blocks SPA POSTs by default

Backend: `CSRF_ENABLED=true` by default → POST/PUT/DELETE need `X-CSRF-Token`.

Frontend does **not** send CSRF tokens.

**Dev options (pick one):**

A. **Simplest for local SPA:** in backend `.env`

```env
CSRF_ENABLED=false
```

B. **Production-like:** GET a public endpoint that sets CSRF cookie/header, store token, attach `X-CSRF-Token` on every mutation.

Also: CSRF skip list currently only `/api/health` and `/api/metrics` — auth POSTs are **not** skipped when CSRF is on.

---

### 4. Register → immediate login will fail

Backend creates users **inactive** until email OTP verification.

Frontend `Register.js` does register then `authService.login` → backend returns **403** “Account is not active”.

**Fix options:**

1. After register, route to a **Verify Email** page (`POST /api/auth/verify-email`), then login.  
2. Or for local dev only, seed admin and skip public registration.  
3. Or backend policy change: auto-activate in `ENV=development` (product decision).

---

### 5. Error response key

| Backend | Frontend often reads |
|---------|----------------------|
| `error` | `error.response.data.message` |

**Fix:** helper like:

```js
const msg =
  error.response?.data?.error ||
  error.response?.data?.message ||
  error.message;
```

---

### 6. Auth token shape in localStorage

Login response:

```json
{ "message": "...", "token": "...", "user": { ... } }
```

Authservice stores **entire** response as `user` and reads `user.token` — that works.

But code that expects `user.email` at top level is wrong; real user is at `user.user.email` after storage, or restructure storage:

```js
localStorage.setItem('user', JSON.stringify({
  token: response.data.token,
  ...response.data.user
}));
```

---

### 7. Role required for admin UI

All timetable CRUD is **admin / super_admin**.

Default seed:

- `admin@example.com` / `password` → `super_admin` ✅

Public registered users get `role=user` and **cannot** call timetable APIs (403).

Frontend should:

- After login, check `user.role`
- Hide admin nav or show “insufficient permissions”
- Prefer logging in with the seed super admin for development

---

### 8. Domain & payload alignment

See [domain-mapping.md](./domain-mapping.md). Summary:

- Department → Faculty (`/faculties`)
- Program → Course (`/courses` + `faculty_id`)
- Drop or postpone FE-only fields (HOD, RFID, NTA, building, module code) unless you extend Go models
- Send snake_case JSON keys matching Go `json` tags

---

### 9. Wire services (FE still console.log only)

Only `Authservice.js` talks to the network. Needed modules:

```
src/services/
  api.js              # axios instance + baseURL + interceptors
  authService.js
  facultyService.js   # departments
  courseService.js    # programs
  moduleService.js
  classService.js
  roomService.js
  staffService.js
  timetableService.js
```

Each should use the same axios instance with Bearer token.

---

### 10. Backend gaps that block full UI

| UI feature | Backend gap |
|------------|-------------|
| Module allocation screens | No assign staff↔module endpoints |
| General subjects management | Subject model exists, no routes |
| Edit program/module/class/room | Missing PUT on several resources |
| Academic year / semester filters | Not in domain model |
| Preview “types” fetch | Endpoints don’t exist |

Either **simplify UI** to match current API, or **extend API** before polishing those screens.

---

## Alignment checklist

Use this as a sprint board:

### Backend

- [ ] Add CORS for frontend origin  
- [ ] Decide CSRF: disable for SPA JWT dev **or** document token flow  
- [ ] Confirm `.env` exists (app fatals without it)  
- [ ] PostgreSQL database `SACAS` (or match `DATABASE_URL`) created  
- [ ] Redis running  
- [ ] (Optional) Staff–module assign endpoints  
- [ ] (Optional) Subject CRUD routes  
- [ ] (Optional) PUT for course/module/class/room  

### Frontend

- [ ] `REACT_APP_API_URL=http://localhost:8080/api`  
- [ ] Fix Authservice paths (`/protected/...`)  
- [ ] Shared axios client + error helper  
- [ ] Auth route guards  
- [ ] Role-aware UI (admin only)  
- [ ] Verify-email flow after register  
- [ ] Faculty service + Department pages  
- [ ] Course service + Program pages  
- [ ] Module / Class / Room / Staff services + forms with correct fields  
- [ ] Timetable generate + load by class/staff  
- [ ] Dashboard stats from real counts  

### Smoke test (end-to-end)

1. Start Postgres, Redis, backend, frontend.  
2. Login as `admin@example.com` / `password`.  
3. Create faculty → course → module → class → room → staff.  
4. `POST /generate` with that `class_id` (or use UI once wired).  
5. `GET /timetable/class/:id` shows slots.  
6. Logout clears token; protected calls return 401.

---

## Recommended “first coding tasks” (order)

1. Backend: CORS + `CSRF_ENABLED=false` for local.  
2. Frontend: env base URL + axios instance + fix Authservice paths.  
3. Frontend: protect routes + show role.  
4. Frontend: Faculty CRUD UI wired (simplest full cycle).  
5. Cascade Course → Module → Class → Room → Staff.  
6. Timetable generate + preview from real data.  
7. Then allocation + model extensions.

When these match, the two apps “vifenane” and you can ship features instead of fighting glue code.
