# 🏢 Smart Hostel Maintenance & Repair Management System

A full-stack web application for managing electrical maintenance complaints in residential hostels, featuring smart scheduling, electrician portfolios, and fraud prevention through photo documentation.

## 🎯 Features

### For Students
- Register electrical appliance damage complaints with photo evidence
- View complaint status in real-time
- Book repair slots at convenient times
- Rate electricians after work completion
- View repair history and documentation

### For Electricians
- View assigned complaints and time slots
- Upload before/after repair photos as proof of work
- Maintain a professional portfolio with ratings
- Manage availability calendar
- Track performance statistics and earnings

### For Wardens / Admins
- Monitor all complaints and repair progress
- Manage electrician portfolios and availability
- View performance analytics and reports
- Hostel-wise statistics and trends

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS |
| State Management | Zustand |
| Backend | Node.js + Express.js |
| Database | PostgreSQL 15 |
| Authentication | JWT (JSON Web Tokens) |
| File Uploads | Multer |
| Containerization | Docker + Docker Compose |

## 🚀 Quick Start

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Git](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/Manvikabhupathi0110/hostel-maintenance-system.git
cd hostel-maintenance-system
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env to change passwords and secrets if desired
```

### 3. Start All Services

```bash
docker-compose up -d
```

### 4. Access the Application

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000 |
| Health Check | http://localhost:5000/health |

## 🗂️ Project Structure

```
hostel-maintenance-system/
├── backend/
│   ├── src/
│   │   ├── config/          # DB & JWT config
│   │   ├── controllers/     # Request handlers
│   │   ├── database/        # Schema, migrations, seed
│   │   ├── middlewares/     # Auth, validation, uploads
│   │   ├── models/          # Database queries
│   │   ├── routes/          # Express routes
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Helpers & constants
│   │   └── server.js        # Entry point
│   └── tests/               # Jest test suites
├── frontend/
│   └── src/
│       ├── components/      # Reusable UI components
│       ├── pages/           # Page components by role
│       ├── services/        # API client (Axios)
│       ├── store/           # Zustand state stores
│       ├── styles/          # Global CSS + Tailwind
│       └── utils/           # Helpers & validators
├── docs/
│   ├── API_DOCS.md          # API endpoint reference
│   ├── ARCHITECHTURE.md     # System architecture
│   └── SETUP_GUIDE.md       # Detailed setup guide
└── docker-compose.yml
```

## 🔐 Default Test Credentials

After running `docker-compose up -d` the database is seeded with sample data:

| Role | Email | Password |
|------|-------|----------|
| Student | student@test.com | password123 |
| Electrician | electrician@test.com | password123 |
| Warden | warden@test.com | password123 |
| Admin | admin@test.com | password123 |

## 🧠 Smart Scheduling

The system enforces the following scheduling constraint:

> **An electrician cannot be assigned to two different hostels on the same day.**

This prevents overloading electricians and ensures focused attention per hostel. The slot service (`backend/src/services/slotService.js`) checks for cross-hostel conflicts before any assignment.

## 📡 API Overview

Base URL: `http://localhost:5000/api`

| Prefix | Description |
|--------|-------------|
| `/auth` | Register, login, token refresh |
| `/complaints` | Create and manage repair complaints |
| `/slots` | Slot generation, booking, and assignment |
| `/electricians` | Electrician profiles and availability |
| `/work-records` | Upload work completion photos |
| `/ratings` | Rate electricians after repair |
| `/analytics` | Stats and performance metrics |

See [API_DOCS.md](./docs/API_DOCS.md) for the full endpoint reference.

## 🧪 Running Tests

```bash
# Backend tests (requires Node.js installed)
cd backend
npm install
npm test
```

## 📚 Documentation

- [Setup Guide](./docs/SETUP_GUIDE.md) — detailed installation and configuration
- [API Documentation](./docs/API_DOCS.md) — all endpoints with request/response examples
- [Architecture](./docs/ARCHITECHTURE.md) — system design and component overview

## 📄 License

MIT License — see [LICENSE](./LICENSE) for details.
