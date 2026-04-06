# 🏗️ System Architecture — Hostel Maintenance System

## Overview

The Hostel Maintenance System is a three-tier web application:

```
┌─────────────────────────────────────────┐
│              Browser Client             │
│    React 18 + Vite + Tailwind CSS       │
│         Zustand state management        │
└────────────────┬────────────────────────┘
                 │ HTTPS / REST API (Axios)
┌────────────────▼────────────────────────┐
│             Backend API Server          │
│       Node.js + Express.js (PORT 5000)  │
│   JWT Auth │ Multer Uploads │ Rate Limit│
└────────────────┬────────────────────────┘
                 │ pg (node-postgres)
┌────────────────▼────────────────────────┐
│           PostgreSQL 15 Database        │
│          (PORT 5432 - Docker)           │
└─────────────────────────────────────────┘
```

All three services run in separate Docker containers orchestrated by `docker-compose.yml`.

---

## Backend Architecture

### Layer Pattern

```
HTTP Request
  └── Router (src/routes/)
        └── Middleware (auth, validation, upload)
              └── Controller (src/controllers/)
                    └── Service (src/services/)
                          └── Model (src/models/)
                                └── PostgreSQL Pool (src/config/database.js)
```

### Directory Structure

```
backend/src/
├── config/
│   ├── database.js     # PostgreSQL connection pool (pg)
│   └── jwt.js          # JWT secret and expiry config
├── controllers/        # HTTP request/response handlers
│   ├── authController.js
│   ├── complaintController.js
│   ├── slotController.js
│   ├── electricianController.js
│   ├── workRecordController.js
│   ├── ratingController.js
│   └── analyticsController.js
├── services/           # Business logic layer
│   ├── authService.js          # Registration, login, JWT helpers
│   ├── complaintService.js     # Complaint CRUD + slot generation trigger
│   ├── slotService.js          # Smart scheduling with hostel constraints
│   ├── electricianService.js   # Profile, availability, rating refresh
│   └── workRecordService.js    # Work record creation + cascading updates
├── models/             # Raw SQL query layer
│   ├── User.js
│   ├── Complaint.js
│   ├── Slot.js
│   ├── Electrician.js
│   ├── WorkRecord.js
│   ├── Rating.js
│   ├── Hostel.js
│   └── Room.js
├── routes/             # Express routers
├── middlewares/
│   ├── authMiddleware.js       # JWT verification + role guard
│   ├── errorHandler.js         # Global error handler
│   ├── uploadMiddleware.js     # Multer configuration
│   └── validationMiddleware.js # express-validator helpers
├── database/
│   ├── schema.sql      # Full DDL with constraints
│   ├── seed.js         # Sample data population
│   └── migrate.js      # Migration runner
└── utils/
    ├── constants.js    # Shared enums and config values
    ├── helpers.js      # Date, formatting, pagination helpers
    └── validators.js   # Reusable validation functions
```

---

## Database Schema

```
users
 ├── id (PK)
 ├── name, email (UNIQUE), phone, password_hash
 ├── role: student | electrician | warden | admin
 └── status: active | inactive | suspended

electricians
 ├── id (PK)
 ├── user_id (FK → users.id, UNIQUE)
 ├── experience_years, specialization, bio, certificates
 ├── availability_status: available | busy | on_leave
 └── total_jobs, completed_jobs, average_rating, total_earnings

hostels
 ├── id (PK)
 ├── name, hostel_type (boys | girls)
 ├── warden_id (FK → users.id)
 └── total_rooms, location

rooms
 ├── id (PK)
 ├── hostel_id (FK → hostels.id)
 └── room_number, floor, capacity, occupants

complaints
 ├── id (PK)
 ├── student_id (FK → users.id)
 ├── room_id (FK → rooms.id)
 ├── hostel_id (FK → hostels.id)
 ├── issue_description, category, priority, issue_photo_url
 └── status: pending | assigned | in_progress | completed | cancelled

slots
 ├── id (PK)
 ├── complaint_id (FK → complaints.id)
 ├── hostel_id (FK → hostels.id)
 ├── room_id (FK → rooms.id)
 ├── electrician_id (FK → electricians.id, nullable)
 ├── slot_date, slot_start_time, slot_end_time
 └── status: available | booked | in_progress | completed | cancelled

work_records
 ├── id (PK)
 ├── slot_id (FK → slots.id)
 ├── complaint_id (FK → complaints.id)
 ├── electrician_id (FK → electricians.id)
 ├── work_description, materials_used, time_spent_minutes
 └── before_photo_url, after_photo_url

ratings
 ├── id (PK)
 ├── work_record_id (FK → work_records.id, UNIQUE)
 ├── student_id (FK → users.id)
 ├── electrician_id (FK → electricians.id)
 ├── rating (1–5)
 └── review
```

---

## Smart Scheduling Algorithm

When a warden assigns an electrician to a slot, `SlotService.assignElectricianToSlot()` performs two checks:

1. **Cross-hostel conflict**: If the electrician already has a booking at a *different* hostel on the same date, the assignment is rejected.
2. **Time overlap**: If the electrician has a booking at the *same* hostel at an overlapping time window, the assignment is rejected.

This guarantees that each electrician works at most one hostel per day and has no time conflicts.

```
assignElectricianToSlot(slot_id, electrician_id)
  │
  ├── Query: does electrician have slot in DIFFERENT hostel on same date?
  │     └── YES → throw "Cannot assign to multiple hostels"
  │
  ├── Query: does electrician have OVERLAPPING slot in same hostel?
  │     └── YES → throw "Overlapping slot"
  │
  └── Assign electrician → UPDATE slots SET electrician_id = ...
```

---

## Authentication Flow

```
Client                     Backend
  │                           │
  ├── POST /api/auth/login ──►│
  │                           │ bcryptjs.compare(password, hash)
  │                           │ jwt.sign({ id, role, email })
  │◄── { token, user } ───────│
  │                           │
  ├── GET /api/... ───────────►│
  │   Authorization: Bearer <token>
  │                           │ jwt.verify(token, secret)
  │                           │ req.user = decoded payload
  │◄── 200 response ──────────│
```

Token expiry defaults to **7 days** (configurable via `JWT_EXPIRE` env var).

---

## File Upload Flow

Complaints and work records support photo uploads via `multipart/form-data`:

```
Client sends FormData
  └── Multer middleware (uploadMiddleware.js)
        ├── Validates file type (jpeg/png/webp/gif)
        ├── Enforces 5 MB size limit
        └── Saves file to backend/uploads/<timestamp>-<original_name>

Controller stores relative URL in database
  └── Served as static files via Express: /uploads/<filename>
```

---

## Frontend Architecture

```
frontend/src/
├── App.jsx             # Root router with role-based protected routes
├── main.jsx            # React entry point
├── components/         # Shared UI components
│   ├── Layout.jsx          # Page shell with Navigation
│   ├── Navigation.jsx      # Role-aware nav bar
│   ├── ProtectedRoute.jsx  # JWT + role check before rendering page
│   ├── ComplaintCard.jsx   # Complaint summary card
│   ├── SlotCard.jsx        # Slot detail card
│   ├── ElectricianCard.jsx # Electrician profile card
│   ├── LoadingSpinner.jsx  # Animated loading indicator
│   ├── Modal.jsx           # Generic modal wrapper
│   └── Alert.jsx           # Dismissible alert banner
├── pages/
│   ├── Login.jsx / Register.jsx
│   ├── StudentDashboard.jsx / NewComplaint.jsx / MyComplaints.jsx
│   ├── ComplaintDetail.jsx / MySlots.jsx / RateElectrician.jsx
│   ├── ElectricianDashboard.jsx / Assignments.jsx
│   ├── ElectricianProfile.jsx / UploadWorkRecord.jsx
│   ├── WardenDashboard.jsx / AllComplaints.jsx
│   ├── ElectriciansList.jsx / Analytics.jsx
│   └── SlotBooking.jsx     # Slot booking flow (standalone)
├── services/
│   └── api.js          # Axios instance + all endpoint wrappers
├── store/
│   ├── authStore.js        # Zustand: user + JWT token
│   ├── complaintStore.js   # Zustand: complaint list cache
│   └── slotStore.js        # Zustand: slot list cache
└── utils/
    ├── constants.js    # Role names, status labels, colour maps
    ├── helpers.js      # Date formatting, truncation, debounce
    └── validators.js   # Form validation helpers
```

---

## Security Measures

| Threat | Mitigation |
|--------|-----------|
| Brute-force login | `express-rate-limit` — 20 auth requests / 15 min per IP |
| Unauthorised API access | JWT verification middleware on all protected routes |
| Role escalation | `roleMiddleware` checks user role before sensitive operations |
| SQL injection | All queries use parameterised `pg` prepared statements |
| Oversized uploads | Multer `limits.fileSize = 5 MB` |
| XSS via uploads | Only image MIME types accepted; files served as static assets |
| CORS abuse | `cors()` configured to allow only the frontend origin |

---

## Docker Compose Services

| Service | Image | Port | Description |
|---------|-------|------|-------------|
| `postgres` | postgres:15-alpine | 5432 | Primary database |
| `backend` | Custom Node.js build | 5000 | REST API server |
| `frontend` | Custom Vite build | 3000→5173 | React SPA |

The `backend` service waits for `postgres` to pass a health check before starting, preventing connection errors during cold start.
