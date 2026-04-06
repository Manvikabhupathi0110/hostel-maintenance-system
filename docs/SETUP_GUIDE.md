# 🚀 Complete Setup Guide - Hostel Maintenance System

## Prerequisites

Make sure you have installed:
- **Docker Desktop** - [Download](https://www.docker.com/products/docker-desktop)
- **Git** - [Download](https://git-scm.com/)
- **Node.js 18+** - [Download](https://nodejs.org/) (Optional, if running without Docker)

---

## Option 1: Setup with Docker (Recommended - Easiest)

### Step 1: Clone the Repository

```bash
git clone https://github.com/Manvikabhupathi0110/hostel-maintenance-system.git
cd hostel-maintenance-system
```

### Step 2: Configure Environment Variables

```bash
cp .env.example .env
```

Open `.env` and update the values as needed:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=hostel_maintenance

PORT=5000
NODE_ENV=development

JWT_SECRET=change_this_to_a_long_random_string
JWT_EXPIRE=7d

VITE_API_BASE_URL=http://localhost:5000
```

### Step 3: Start All Services

```bash
docker-compose up -d
```

This command will:
1. Pull the PostgreSQL 15 image
2. Build the backend Docker image
3. Build the frontend Docker image
4. Start all three containers
5. Run the database schema automatically

### Step 4: Seed the Database (Optional)

```bash
docker-compose exec backend npm run seed
```

This populates the database with sample users, hostels, rooms, and complaints.

### Step 5: Access the Application

| Service | URL |
|---------|-----|
| 🌐 Frontend | http://localhost:3000 |
| 🔧 Backend API | http://localhost:5000 |
| ❤️ Health Check | http://localhost:5000/health |

### Stopping the Application

```bash
docker-compose down          # Stop containers
docker-compose down -v       # Stop containers AND delete data volumes
```

---

## Option 2: Manual Setup (Without Docker)

### Prerequisites
- Node.js 18+
- PostgreSQL 15

### Step 1: Clone the Repository

```bash
git clone https://github.com/Manvikabhupathi0110/hostel-maintenance-system.git
cd hostel-maintenance-system
```

### Step 2: Set Up the Database

```sql
-- Connect to PostgreSQL as a superuser
psql -U postgres

-- Create the database
CREATE DATABASE hostel_maintenance;
\q
```

### Step 3: Configure Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your local database credentials

npm install
npm run migrate    # Creates tables from schema.sql
npm run seed       # Inserts sample data (optional)
```

### Step 4: Start the Backend

```bash
npm run dev        # Development with auto-reload
# or
npm start          # Production
```

Backend will be available at `http://localhost:5000`.

### Step 5: Configure & Start the Frontend

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend/` directory:
```env
VITE_API_BASE_URL=http://localhost:5000
```

```bash
npm run dev        # Development server
```

Frontend will be available at `http://localhost:5173`.

---

## Default Credentials (After Seeding)

| Role | Email | Password |
|------|-------|----------|
| Student | student@test.com | password123 |
| Electrician | electrician@test.com | password123 |
| Warden | warden@test.com | password123 |
| Admin | admin@test.com | password123 |

---

## Running Tests

```bash
cd backend
npm test
```

---

## Troubleshooting

### Docker container fails to start
- Ensure Docker Desktop is running.
- Check port conflicts: make sure ports `3000`, `5000`, and `5432` are not in use.
- View container logs: `docker-compose logs backend`

### Database connection error
- Verify the `DB_*` environment variables in `.env` match the PostgreSQL configuration.
- If using Docker, the `DB_HOST` should be `postgres` (the Docker service name), not `localhost`.

### Frontend cannot reach the API
- Ensure `VITE_API_BASE_URL` is set correctly.
- Check CORS settings in `backend/src/server.js` — the `origin` must match the frontend URL.

### File uploads not working
- The `backend/uploads/` directory must exist and be writable.
- Docker mounts this directory via the volume defined in `docker-compose.yml`.
- Manually create it if missing: `mkdir -p backend/uploads`

### JWT errors after restart
- If `JWT_SECRET` changes, all existing tokens are invalidated. Users must log in again.
