# Frontend — timetable_ui

**Package:** `timetable_ui`  
**Default dev URL:** `http://localhost:3000`  
**Bootstrap:** Create React App (`react-scripts`)  
**Router:** `react-router-dom` v7  
**HTTP client:** Axios (only used in Auth service today)  
**UI:** Tailwind CSS + Radix primitives + Lucide icons + Recharts

---

## Directory structure

```
timetable_ui/
├── public/                 # Static HTML, icons
├── src/
│   ├── App.js              # Route table
│   ├── index.js            # React root
│   ├── components/         # Layout, Navbar, shared UI
│   │   └── ui/             # Button, Input, Select, Dialog, …
│   ├── views/              # Page-level screens
│   │   └── Auth/           # Login, Register
│   ├── services/
│   │   └── Authservice.js  # Only API client so far
│   ├── styles/             # Per-page CSS
│   ├── assets/             # Icons/images for nav
│   └── lib/utils.js        # cn() class merge helper
├── package.json
├── tailwind.config.js
└── docker-compose.yml      # nginx-proxy-manager (deploy helper, not app)
```

---

## Routes (`App.js`)

### Public

| Path | Component |
|------|-----------|
| `/`, `/login` | `Login` |
| `/register` | `Register` |

### App shell (Navbar + nested routes)

| Path | Screen | Backend entity |
|------|--------|----------------|
| `/dashboard` | Dashboard | stats (not wired) |
| `/timetable` | Timetable generator | Timetable generate |
| `/preview` | Preview1 | Timetable view |
| `/rooms/add`, `/view`, `/manage` | Rooms | Room |
| `/classes/add`, `/view`, `/manage` | Classes | Class |
| `/modules/add`, `/view`, `/manage` | Modules | Module |
| `/staff/add`, `/view`, `/manage` | Staff | Staff |
| `/programs/add`, `/view`, `/manage` | Programs | Course |
| `/departments/add`, `/view`, `/manage` | Departments | Faculty |
| `/allocations/view`, `/allocations/module` | Allocations | staff_modules (no API yet) |
| `/settings` | Settings | users / profile |

**Note:** There is **no route guard**. Anyone can open `/dashboard` without logging in. Navbar logout only clears `localStorage` and redirects.

---

## Auth service (`src/services/Authservice.js`)

Current base URL (hardcoded):

```js
const API_URL = 'http://localhost:8080/api/v1';  // WRONG vs backend `/api`
```

| Method | Calls | Backend reality |
|--------|-------|-----------------|
| `register` | `POST …/auth/register` | Path wrong prefix (`v1`); body fields OK (`first_name`, …) |
| `login` | `POST …/auth/login` | Same prefix issue; stores whole response in `localStorage` as `user` if `token` present |
| `logout` | `POST …/auth/logout` | Prefix issue |
| `getProfile` | `GET …/profile` | Backend: `GET /api/protected/profile` |
| `updateProfile` | `PUT …/users/:id` | Backend: `PUT /api/protected/users/:id` (admin) |

Interceptors:

- Attach `Authorization: Bearer <token>` from `localStorage.user.token`
- On `401`, logout and redirect to `/login`

Login/Register UI:

- Login: email + password → `authService.login` → navigate `/dashboard`
- Register: maps camelCase form → snake_case API body → register → **auto login** (will fail if email not verified / inactive — backend design)

Error UI reads `error.response?.data?.message`, but backend returns `"error"` key more often than `"message"`.

---

## Page implementation status

| Area | UI | API wired | Notes |
|------|----|-----------|--------|
| Login / Register | Yes | Partial | Wrong base path; register→login flow vs verify-email |
| Dashboard | Yes | No | Hardcoded zeros / empty charts |
| Rooms add/view/manage | Yes | No | Form fields differ from backend Room model |
| Classes | Yes | No | Uses “program” label; backend needs `course_id`, `year`, `number_of_students` |
| Modules | Yes | No | Extra FE fields: code, semester, NTA level |
| Staff | Yes | No | Extra FE: RFID, phone, title, type; BE: name, email, faculty_id, max_hours |
| Programs | Yes | No | = backend Course (`name`, `faculty_id`) |
| Departments | Yes | No | = backend Faculty; FE has HOD fields BE does not |
| Timetable generate | Yes | No | Simulated progress only |
| Preview | Partial | No | Fetches non-existent `/api/...` relative paths |
| Module allocations | Placeholder | No | “Coming soon” |
| Settings | Yes | No | Local UI only |

Most submit handlers only `console.log(formData)`.

---

## UI stack notes

- Tailwind + CSS files under `src/styles/` (mixed approach).
- Radix-based components in `src/components/ui/` (shadcn-style).
- Framer Motion on auth pages.
- No global state library (Redux/Zustand); auth is localStorage + singleton service.
- No `.env` / `REACT_APP_API_URL` yet — URL is hardcoded.

---

## Scripts

```bash
cd timetable_ui
npm install   # or yarn
npm start     # http://localhost:3000
npm run build
npm test
```

---

## Recommended frontend work order (after integration fixes)

1. Fix API base URL + env config + CORS/CSRF alignment (see [integration.md](./integration.md)).
2. Add route protection (`isAuthenticated` + admin role check).
3. Create service modules: `facultyService`, `courseService`, `moduleService`, `classService`, `roomService`, `staffService`, `timetableService`.
4. Wire list pages (view/manage) to GET endpoints with pagination (`limit`/`offset`).
5. Wire add forms to POST with **backend field names** (see [domain-mapping.md](./domain-mapping.md)).
6. Wire timetable generate + class/staff timetable views.
7. Build allocation UI once backend exposes staff–module assign APIs (or add those APIs).
