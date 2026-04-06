# 📡 API Documentation — Hostel Maintenance System

Base URL: `http://localhost:5000/api`

All protected endpoints require the header:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## 🔑 Authentication — `/api/auth`

### POST `/api/auth/register`
Register a new user.

**Request Body**
```json
{
  "name": "Alice Smith",
  "email": "alice@example.com",
  "password": "secret123",
  "role": "student",
  "phone": "9876543210"
}
```
`role` must be one of: `student`, `electrician`, `warden`, `admin`

**Response `201`**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "id": 1,
    "name": "Alice Smith",
    "email": "alice@example.com",
    "role": "student",
    "token": "<JWT>"
  }
}
```

---

### POST `/api/auth/login`
Authenticate and obtain a JWT.

**Request Body**
```json
{ "email": "alice@example.com", "password": "secret123" }
```

**Response `200`**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "<JWT>",
    "user": { "id": 1, "name": "Alice Smith", "role": "student" }
  }
}
```

---

### POST `/api/auth/refresh`
Refresh an existing JWT.

**Request Body**
```json
{ "token": "<existing_JWT>" }
```

**Response `200`**
```json
{ "success": true, "data": { "token": "<new_JWT>" } }
```

---

### POST `/api/auth/logout`
Logout (client should discard the token).

**Response `200`**
```json
{ "success": true, "message": "Logout successful" }
```

---

## 📋 Complaints — `/api/complaints`

### POST `/api/complaints` *(student)*
Create a new complaint. Accepts `multipart/form-data` for optional photo upload.

**Fields**
| Field | Type | Required |
|-------|------|----------|
| `room_id` | integer | ✅ |
| `hostel_id` | integer | ✅ |
| `issue_description` | string | ✅ |
| `category` | string | ❌ (lighting/fan/switch/wiring/appliance/general) |
| `priority` | string | ❌ (low/medium/high/urgent) |
| `issue_photo` | file | ❌ |

**Response `201`**
```json
{
  "success": true,
  "data": { "id": 5, "status": "pending", ... }
}
```

---

### GET `/api/complaints/student/my-complaints` *(student)*
List all complaints filed by the authenticated student.

---

### GET `/api/complaints/:id` *(authenticated)*
Get full details of a single complaint.

---

### GET `/api/complaints/hostel/:hostel_id` *(warden/admin)*
List all complaints for a hostel. Supports query params: `status`, `category`, `priority`.

---

### PATCH `/api/complaints/:id/status` *(warden/admin)*
Update complaint status.

**Request Body**
```json
{ "status": "in_progress" }
```
Valid statuses: `pending`, `assigned`, `in_progress`, `completed`, `cancelled`

---

## 🗓️ Slots — `/api/slots`

### GET `/api/slots/available`
List available (unbooked) slots.

Query params: `hostel_id`, `date`

---

### POST `/api/slots/book` *(warden/admin)*
Assign an electrician to a slot. Enforces the single-hostel-per-day constraint.

**Request Body**
```json
{ "slot_id": 12, "electrician_id": 3 }
```

**Response `200`**
```json
{ "success": true, "data": { "id": 12, "electrician_id": 3, "status": "booked" } }
```

**Error — conflict**
```json
{ "success": false, "message": "Electrician already assigned to Hostel B on this date. Cannot assign to multiple hostels." }
```

---

### POST `/api/slots/auto-assign` *(warden/admin)*
Automatically assign the best available electrician to a slot.

**Request Body**
```json
{ "slot_id": 12 }
```

---

### GET `/api/slots/:id` *(authenticated)*
Get details of a slot.

---

### GET `/api/slots/:id/electricians` *(warden/admin)*
List electricians available for a given slot (respects hostel constraint).

---

### PATCH `/api/slots/:id/status` *(authenticated)*
Update slot status (`available`, `booked`, `in_progress`, `completed`, `cancelled`).

---

## ⚡ Electricians — `/api/electricians`

### GET `/api/electricians`
List all electricians. Query params: `availability_status`, `specialization`.

### GET `/api/electricians/me` *(electrician)*
Get the authenticated electrician's own profile.

### GET `/api/electricians/me/stats` *(electrician)*
Get job statistics for the authenticated electrician.

### GET `/api/electricians/:id`
Get a specific electrician's public profile.

### PUT `/api/electricians/me/profile` *(electrician)*
Update the authenticated electrician's profile (bio, specialization, experience, certificates).

### PATCH `/api/electricians/:id/availability` *(electrician/warden/admin)*
Set availability status (`available`, `busy`, `on_leave`).

---

## 🔧 Work Records — `/api/work-records`

### POST `/api/work-records` *(electrician)*
Upload a completed work record. Accepts `multipart/form-data`.

**Fields**
| Field | Type | Required |
|-------|------|----------|
| `slot_id` | integer | ✅ |
| `complaint_id` | integer | ✅ |
| `work_description` | string | ✅ |
| `materials_used` | string | ❌ |
| `time_spent_minutes` | integer | ❌ |
| `before_photo` | file | ❌ |
| `after_photo` | file | ❌ |

### GET `/api/work-records/me` *(electrician)*
List the authenticated electrician's work records.

### GET `/api/work-records/:id`
Get details of a work record.

### GET `/api/work-records/complaint/:complaint_id`
Get the work record for a complaint.

### PATCH `/api/work-records/:id` *(electrician)*
Update a work record.

---

## ⭐ Ratings — `/api/ratings`

### POST `/api/ratings` *(student)*
Submit a rating for a completed work record.

**Request Body**
```json
{
  "work_record_id": 7,
  "electrician_id": 3,
  "rating": 5,
  "review": "Very professional and fast repair!"
}
```
`rating` must be 1–5.

### GET `/api/ratings/:id`
Get a specific rating.

### GET `/api/ratings/electrician/:electrician_id`
List all ratings for an electrician.

---

## 📊 Analytics — `/api/analytics`

All analytics endpoints require `warden` or `admin` role.

### GET `/api/analytics/stats`
Overall system statistics (total complaints, completion rate, avg rating, etc.).

### GET `/api/analytics/complaints/by-category`
Complaint counts grouped by category.

### GET `/api/analytics/complaints/by-status`
Complaint counts grouped by status.

### GET `/api/analytics/complaints/trends`
Monthly complaint trend for the past 12 months.

### GET `/api/analytics/electricians/top`
Top-performing electricians ranked by rating and completed jobs.

### GET `/api/analytics/hostels`
Per-hostel complaint and completion statistics.

---

## ❗ Error Responses

All errors follow the same format:
```json
{
  "success": false,
  "message": "Human-readable error description"
}
```

| HTTP Status | Meaning |
|-------------|---------|
| 400 | Validation error or bad request |
| 401 | Missing or invalid JWT |
| 403 | Insufficient permissions |
| 404 | Resource not found |
| 409 | Conflict (e.g. duplicate email) |
| 429 | Rate limit exceeded |
| 500 | Internal server error |
