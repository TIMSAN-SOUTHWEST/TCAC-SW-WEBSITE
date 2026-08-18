# TCAC'26 — Commands Reference

All commands assume you're starting from the project root:
```
c:\Users\DELL\Desktop\Projects\web-app\TCAC-SW-WEBSITE\
```

---

## First-Time Setup

### Step 1 — Create Database (one-time only)

You have PostgreSQL 18 installed locally on Windows (port 5432). Open PowerShell **as Administrator** and run:

```powershell
# Creates the database user that the backend will connect as
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -c "CREATE USER tcac_user WITH PASSWORD 'tcac_password';"

# Grants the user permission to create databases (needed for Prisma shadow DB during migrations)
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -c "ALTER USER tcac_user CREATEDB;"

# Creates the project database owned by our user
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -c "CREATE DATABASE tcac_db OWNER tcac_user;"

# Gives the user full access to the database
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -c "GRANT ALL PRIVILEGES ON DATABASE tcac_db TO tcac_user;"
```

Password when prompted: `postgres`

### Step 2 — Install Backend Dependencies & Run Migrations

```powershell
# Navigate to the backend directory
cd backend

# Install all backend Node.js packages
npm install

# Generates the Prisma Client (TypeScript types for database queries)
npx prisma generate

# Creates all database tables based on the Prisma schema
npx prisma migrate dev --name init
```

### Step 3 — Install Frontend Dependencies

Open a second terminal:

```powershell
# Navigate to the frontend directory
cd frontend

# Install all frontend Node.js packages
npm install
```

---

## Daily Development

### Verify your database is running
```powershell
# To verify it's running:
Get-Service postgresql*

# If it ever shows "Stopped", start it with (Admin PowerShell):
Start-Service postgresql-x64-18
```

### Start Backend (Terminal 1)

```powershell
# Navigate to the backend directory
cd backend

# Starts NestJS in development mode with hot-reload (auto-restarts on code changes)
npm run start:dev
```

### Start Frontend (Terminal 2)

```powershell
# Navigate to the frontend directory
cd frontend

# Starts Next.js in development mode with hot-reload
npm run dev
```

### Access Points

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:4500/api |
| Health Check | http://localhost:4500/api |
| Swagger API Docs | http://localhost:4500/api/docs |
| Prisma Studio (DB GUI) | Run `npx prisma studio` in backend folder |

---

## Database Commands

All run from the `backend` folder:

```powershell
# Navigate to backend
cd backend

# Regenerates the Prisma Client after any schema.prisma changes
npx prisma generate

# Creates a new migration file and applies it to the database (use during development)
npx prisma migrate dev --name describe_your_change

# Applies pending migrations without creating new ones (use in production/CI)
npx prisma migrate deploy

# Drops all data and recreates the database from scratch (DESTRUCTIVE - development only)
npx prisma migrate reset

# Opens a browser-based GUI to view and edit database records
npx prisma studio

# Shows which migrations have been applied and which are pending
npx prisma migrate status

# Auto-formats the schema.prisma file for consistency
npx prisma format
```

### Direct PostgreSQL access

```powershell
# Opens an interactive PostgreSQL shell connected to the project database
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U tcac_user -h localhost -d tcac_db
```

Password: `tcac_password`

---

## Backend Commands

```powershell
# Navigate to backend
cd backend

# Starts the server in watch mode — auto-restarts when you save files
npm run start:dev

# Starts the server in watch mode with Node.js debugger attached (for breakpoints in VS Code)
npm run start:debug

# Compiles TypeScript to JavaScript in the dist/ folder (for production)
npm run build

# Runs the compiled production build (must run npm run build first)
npm run start:prod

# Checks code for style issues and potential errors
npm run lint

# Auto-formats all TypeScript files with Prettier
npm run format

# Runs all unit tests once
npm run test
```

---

## Frontend Commands

```powershell
# Navigate to frontend
cd frontend

# Starts Next.js development server with hot-reload on port 3000
npm run dev

# Creates an optimized production build (outputs to .next/ folder)
npm run build

# Serves the production build locally (must run npm run build first)
npm run start

# Checks code for linting errors
npm run lint
```

---

## Docker (Full Stack — via WSL)

For production-like deployment, you can run everything in Docker. Open WSL terminal:

```bash
# Navigate to the project in WSL's view of Windows filesystem
cd /mnt/c/Users/DELL/Desktop/Projects/web-app/TCAC-SW-WEBSITE

# Builds Docker images for frontend and backend, then starts all 3 containers (postgres + backend + frontend)
docker compose up --build -d

#After the first docker compose up --build -d, you only need to start the containers with:
docker compose up -d

# Streams live logs from all containers (Ctrl+C to stop watching)
docker compose logs -f

#Restart containers
docker compose restart

# Stops all containers but keeps the data volumes
docker compose down

# Stops all containers AND deletes database data (fresh start)
docker compose down -v
```

Note: The docker-compose.yml uses its own PostgreSQL container (separate from your local install).

---

## Common Workflows

### After pulling new code from git:

```powershell
# Install any new backend dependencies
cd backend
npm install

# Regenerate Prisma Client in case schema changed
npx prisma generate

# Apply any new database migrations
npx prisma migrate dev

# Install any new frontend dependencies
cd ..\frontend
npm install
```

### After changing the Prisma schema (adding/modifying database tables):

```powershell
cd backend

# Creates a migration file for your changes and applies it to the database
npx prisma migrate dev --name what_you_changed
```

### Killing a stuck port:

```powershell
# Find which process is using port 4500
netstat -ano | findstr :4500

# Kill that process by its PID (replace <PID> with the actual number)
Stop-Process -Id <PID> -Force
```

---

## Environment Files

### Backend (`backend/.env`)

```env
DATABASE_URL=postgresql://tcac_user:tcac_password@localhost:5432/tcac_db?schema=public
JWT_SECRET_KEY=28cd870cc473bd9f13235afcc8161c261b7403d710726eb93d0bb44f220a154eea8ab2d5874c702366661444f66774f0f75a5ebe7632b7103a604c0fd5a715c4
PORT=4500
BACKEND_URL=http://localhost:4500
FRONTEND_URL=http://localhost:3000
EMAIL_USER=timsansouthwestzone2025@gmail.com
EMAIL_PASS=jiibomsigimlpein
NODE_ENV=development
```

### Frontend (`frontend/.env`)

```env
NEXT_PUBLIC_API_URL=http://localhost:4500/api
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 4500 in use | `netstat -ano \| findstr :4500` then `Stop-Process -Id <PID> -Force` |
| Port 3000 in use | `netstat -ano \| findstr :3000` then `Stop-Process -Id <PID> -Force` |
| Prisma "cannot reach database" | Ensure PostgreSQL service is running: check Services app or `Get-Service postgresql*` |
| Prisma "permission denied shadow db" | Run: `& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -c "ALTER USER tcac_user CREATEDB;"` |
| Prisma Client not generated | Run `npx prisma generate` in backend folder |
| CORS error in browser | Check `FRONTEND_URL` in backend `.env` matches your frontend URL |
| 401 Unauthorized | Token expired — log out and log in again |
| Backend crashes on start | Check if database is accessible: `npx prisma migrate status` |
| PostgreSQL password forgotten | See "Resetting PostgreSQL Password" section below |

### Resetting PostgreSQL Password

```powershell
# 1. Edit pg_hba.conf (as Admin) — change 'scram-sha-256' to 'trust' for localhost lines
notepad "C:\Program Files\PostgreSQL\18\data\pg_hba.conf"

# 2. Restart the PostgreSQL service to apply changes (requires Admin PowerShell)
Restart-Service postgresql-x64-18

# 3. Reset the password (no password prompt because of 'trust' mode)
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -c "ALTER USER postgres WITH PASSWORD 'postgres';"

# 4. Revert pg_hba.conf back to 'scram-sha-256' (IMPORTANT for security)
notepad "C:\Program Files\PostgreSQL\18\data\pg_hba.conf"

# 5. Restart service again to enforce password auth
Restart-Service postgresql-x64-18
```


---

## Frontend Auth Routes

### User

| Page | URL |
|------|-----|
| Login | http://localhost:3000/login/user |
| Register | http://localhost:3000/register/user |
| Reset Password | http://localhost:3000/reset-password/user |
| Dashboard | http://localhost:3000/user/dashboard |

### Admin

| Page | URL |
|------|-----|
| Login | http://localhost:3000/login/admin |
| Register | http://localhost:3000/register/admin |
| Reset Password | http://localhost:3000/reset-password/admin |
| Dashboard | http://localhost:3000/admin/dashboard |

### Super Admin

| Page | URL |
|------|-----|
| Login | http://localhost:3000/login/super-admin |
| Register | http://localhost:3000/register/super-admin |
| Reset Password | http://localhost:3000/reset-password/super-admin |
| Dashboard | http://localhost:3000/super-admin/dashboard |

### Public

| Page | URL |
|------|-----|
| Landing Page | http://localhost:3000 |
