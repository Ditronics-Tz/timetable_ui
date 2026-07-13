# Domain mapping — UI language ↔ backend models

The UI uses university admin language. The backend uses slightly different names. **Use this table when wiring forms and labels.**

---

## Entity names

| Frontend label / route | Backend model | API path segment | Notes |
|------------------------|---------------|------------------|--------|
| Department | **Faculty** | `/faculties` | Same concept: academic unit |
| Program | **Course** | `/courses` | Degree program under a faculty |
| Module | **Module** | `/modules` | Unit of study under a course |
| Class | **Class** | `/classes` | Cohort (e.g. BIT Y2 Group A) |
| Room | **Room** | `/rooms` | Teaching space |
| Staff | **Staff** | `/staff` | Lecturers (separate from User accounts) |
| User / Admin | **User** | `/users`, auth | Login accounts only |
| Allocation | **staff_modules** (M2M) | staff/modules endpoints | Staff teaching which modules |
| General subject | **Subject** | `/subjects` | Cross-course subjects |
| Timetable | **Timetable** | `/timetable` | One scheduled slot |

---

## Field mapping by screen

### Departments → Faculty

| Frontend form field | Backend field |
|---------------------|---------------|
| departmentName | `name` |
| departmentDescription | `description` |
| hodName | `hod_name` |
| hodPhone | `hod_phone` |
| hodEmail | `hod_email` |

### Programs → Course

| Frontend | Backend |
|----------|---------|
| Program Name | `name` |
| Department select | `faculty_id` |
| NTA Level / level | `level` |

### Modules → Module

| Frontend | Backend |
|----------|---------|
| module_name | `name` |
| module_code | `code` |
| module_type | `type` (`core` / `elective` / `general_subject`) |
| credit_value | `credit_hours` |
| semester | `semester` |
| nta_level | `nta_level` |
| program select | `course_id` (omit/null for general_subject) |
| requires lab | `requires_lab` |

### Classes → Class

| Frontend | Backend |
|----------|---------|
| className | `name` |
| program | `course_id` |
| capacity | `number_of_students` |
| Year of Study | `year` (1–6) |
| Academic year | `academic_year` (e.g. 2024/25) |

### Rooms → Room

| Frontend | Backend |
|----------|---------|
| room_name | `name` |
| capacity | `capacity` |
| room_type / building / room_no / description | inside `features` JSON |
| sticky | `sticky` |
| allowed courses | `allowed_courses` JSON |

### Staff → Staff

| Frontend | Backend |
|----------|---------|
| name | `name` |
| email | `email` |
| department | `faculty_id` |
| rfidId | `rfid_id` |
| phoneNumber | `phone_number` |
| staffType | `staff_type` |
| staffTitle | `title` |
| max hours | `max_hours` |
| day-offs / preferred start | `preferences` JSON |

Preferences shape:

```json
{
  "unavailable_days": ["saturday"],
  "preferred_start": "08:00"
}
```

### Auth register

| Frontend | Backend |
|----------|---------|
| firstName | `first_name` |
| lastName | `last_name` |
| email | `email` |
| password | `password` |

---

## Hierarchy

```
Faculty
  └── Course (program)
        ├── Module (core/elective)
        └── Class (year, students)
Staff ──belongs to── Faculty
Staff ──M2M── Module
Room (standalone + constraints)
Subject (general, cross-cutting)
Timetable slot:
  Class + (Module XOR Subject) + Staff + Room + Day + Start + End
```

### Data entry order

1. Faculties (departments)  
2. Courses (programs)  
3. Modules under courses  
4. Classes under courses  
5. Rooms  
6. Staff under faculties  
7. Assign staff to modules  
8. Generate or manually create timetable  

---

## Enumerations

**Module type:** `core`, `elective`, `general_subject`  
**Weekday:** `monday` … `sunday`  
**User role:** `user`, `administrator`, `super_admin`
