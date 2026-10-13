# DIT-133 visual QA route audit

Audit basis: `src/App.js`, view component source, and shared UI primitives on the DIT-133 branch from `master` (`f9c676b`). This is a source-level audit; it does not claim authenticated, data-backed browser screenshots.

## Registered routes

| Route | View | Access |
| --- | --- | --- |
| `/` | Login | Public |
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/verify-email` | VerifyEmail | Public |
| `/forgot-password` | ForgotPassword | Public |
| `/reset-password` | ResetPassword | Public |
| `/dashboard` | Dashboard | Authenticated |
| `/settings` | Settings | Authenticated |
| `/preview` | Preview1 | Administrator, super admin |
| `/my-timetable` | Preview1 (legacy alias) | Authenticated |
| `/timetable` | Timetable | Administrator, super admin |
| `/rooms/add` | AddRooms | Administrator, super admin |
| `/rooms/view` | ViewRooms | Administrator, super admin |
| `/rooms/manage` | ManageRooms | Administrator, super admin |
| `/classes/add` | AddClass | Administrator, super admin |
| `/classes/view` | ViewClass | Administrator, super admin |
| `/classes/manage` | ManageClass | Administrator, super admin |
| `/manage-classes` | ManageClass (legacy alias) | Administrator, super admin |
| `/modules/add` | AddModule | Administrator, super admin |
| `/modules/view` | ViewModule | Administrator, super admin |
| `/modules/manage` | ManageModule | Administrator, super admin |
| `/subjects/add` | AddSubject | Administrator, super admin |
| `/subjects/view` | ViewSubjects | Administrator, super admin |
| `/subjects/manage` | ManageSubjects | Administrator, super admin |
| `/staff/add` | AddStaff | Administrator, super admin |
| `/staff/view` | ViewStaff | Administrator, super admin |
| `/staff/manage` | ManageStaff | Administrator, super admin |
| `/programs/add` | AddProgram | Administrator, super admin |
| `/programs/view` | ViewProgram | Administrator, super admin |
| `/programs/manage` | ManageProgram | Administrator, super admin |
| `/departments/add` | AddDepartment | Administrator, super admin |
| `/departments/view` | ViewDepartment | Administrator, super admin |
| `/departments/manage` | ManageDepartment | Administrator, super admin |
| `/allocations/view` | ViewAllocations | Administrator, super admin |
| `/allocations/module` | ModuleAllocations | Administrator, super admin |
| `/*` | AppShell fallback for unmatched authenticated paths | Authenticated |

## Inconsistencies found

1. **View page hierarchy and spacing:** `ViewClass`, `ViewRooms`, `ViewStaff`, `ViewModule`, `ViewProgram`, and `ViewDepartment` do not follow the Add page `PageHeader` plus `space-y-4` wrapper pattern. The department view also uses inconsistent naming (`ViewDepartments` import mapped to `ViewDepartment.js`). Tracked for DIT-138.
2. **Manage page hierarchy and spacing:** `ManageClass`, `ManageRooms`, `ManageStaff`, `ManageModule`, `ManageProgram`, `ManageDepartment`, and `ManageSubjects` use a raw `p-6` root and lack the common page header/breadcrumb hierarchy. Tracked for DIT-139; Subjects should be included in its final checklist.
3. **Timetable preview hierarchy:** `Preview1` uses a raw heading and `p-6` wrapper instead of the common page header/breadcrumb pattern. Tracked for DIT-140.
4. **Table implementation:** All seven Manage pages and seven entity View pages import `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, and `TableCell` from shared `src/components/ui/table.jsx`; none uses raw HTML table markup. DIT-147 adds one responsive `DataTable` frame across these screens and the allocations view.
5. **State presentation:** The list hook previously started with `loading=false`, briefly showing an empty page before its first request. Manage and View tables now share loading, retryable error, and empty states; allocation pages distinguish option loading, request failure, unselected data, and genuinely empty results; AddClass/AddModule/AddProgram/AddStaff now show dependency loading, retry, and empty states.
6. **Coverage limitation:** The acceptance criterion asks for a screenshot of every route. This audit records all routes and source-level findings, but authenticated route screenshots require a connected browser session and seeded data; no screenshot evidence is claimed here.

## Verification notes

- Route inventory is taken from every `<Route>` declaration in `src/App.js`.
- Shared table import check: all seven `Manage*.js` pages use the same table primitives and `DataTable` frame; all seven entity `View*.js` tables and the allocations table use that same frame as well.
- State check: list-page requests begin in loading state, errors have a retry path, and a successful empty response has an explicit message.
- Form dependency check: the four Add forms that fetch Programs or Faculties disable dependent controls until their options are available and allow retry after failures.
- The DIT-133 branch uses `master` as its base. Page-header and state corrections are isolated into their separately requested issue branches.
