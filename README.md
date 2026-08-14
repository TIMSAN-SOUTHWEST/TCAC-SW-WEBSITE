<p align="center">
  <img src="frontend/public/images/timsan-logo.png" alt="TCAC'26 Logo" width="80" />
</p>

<h1 align="center">TCAC'26</h1>

<p align="center">
  <strong>TIMSAN Camp and Conference 2026 — Event Management System</strong>
</p>

<p align="center">
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#project-structure">Project Structure</a> •
  <a href="#api-documentation">API Docs</a> •
  <a href="#deployment">Deployment</a>
</p>

---

## Overview

TCAC'26 is a full-stack web application for managing TIMSAN Southwest's annual Camp and Conference. It handles participant registration, multi-role authentication, payment tracking, camp schedule management, content publishing, and administrative operations.

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | Next.js (Pages Router) | 14.2 |
| **UI** | Chakra UI + Tailwind CSS | 2.10 / 3.4 |
| **State** | Redux Toolkit + next-redux-wrapper | 2.5 / 8.1 |
| **Backend** | NestJS (TypeScript) | 11.x |
| **Database** | PostgreSQL | 18 |
| **ORM** | Prisma | 6.x |
| **Auth** | JWT + Passport.js | — |
| **Docs** | Swagger / OpenAPI | Auto-generated |
| **Container** | Docker + Docker Compose | — |

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 20
- **PostgreSQL** 16+ (local or Docker)
- **npm** ≥ 10

### 1. Clone and install

```bash
git clone <repository-url>
cd TCAC-SW-WEBSITE

# Install backend
cd backend && npm install

# Install frontend
cd ../frontend && npm install
```

### 2. Environment setup

**Backend** — create `backend/.env`:

```env
DATABASE_URL=postgresql://tcac_user:tcac_password@localhost:5432/tcac_db?schema=public
JWT_SECRET_KEY=your_secret_key_here
PORT=4500
BACKEND_URL=http://localhost:4500
FRONTEND_URL=http://localhost:3000
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
NODE_ENV=development
```

**Frontend** — create `frontend/.env`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4500/api
```

### 3. Database setup

```bash
cd backend

# Generate Prisma Client
npx prisma generate

# Run migrations (creates all tables)
npx prisma migrate dev --name init
```

### 4. Start development servers

```bash
# Terminal 1 — Backend (port 4500)
cd backend && npm run start:dev

# Terminal 2 — Frontend (port 3000)
cd frontend && npm run dev
```

### 5. Access

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:4500/api |
| Swagger Docs | http://localhost:4500/api/docs |
| Prisma Studio | `npx prisma studio` (backend folder) |

---

## Project Structure

```
TCAC-SW-WEBSITE/
├── backend/                     NestJS REST API
│   ├── prisma/
│   │   └── schema.prisma        Database schema (12 models)
│   ├── src/
│   │   ├── main.ts              Entry point + Swagger setup
│   │   ├── app.module.ts        Root module
│   │   ├── common/              Shared interceptors
│   │   ├── prisma/              Database service
│   │   └── modules/
│   │       ├── auth/            JWT auth (3 roles)
│   │       ├── users/           User CRUD + approval
│   │       ├── admins/          Admin CRUD + approval
│   │       ├── payments/        Payment management
│   │       ├── posts/           CMS content
│   │       ├── activities/      Camp activities
│   │       ├── days/            Camp days
│   │       ├── meals/           Meal schedules
│   │       ├── notifications/   System notifications
│   │       ├── slips/           Unique slip codes
│   │       ├── settings/        Portal config
│   │       ├── upload/          File uploads
│   │       └── mail/            Email (nodemailer)
│   ├── Dockerfile
│   └── package.json
│
├── frontend/                    Next.js client app
│   ├── public/                  Static assets
│   ├── src/
│   │   ├── pages/               File-based routing
│   │   ├── components/          React components
│   │   ├── store/               Redux slices
│   │   ├── layouts/             Page layouts
│   │   ├── themes/              Chakra UI theme
│   │   ├── styles/              Global CSS
│   │   └── utils/               API client + helpers
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml           Full-stack Docker config
├── ARCHITECTURE.md              Detailed technical docs
├── COMMANDS.md                  All CLI commands reference
└── README.md
```

---

## Roles and Access

| Role | Description | Key Permissions |
|------|-------------|----------------|
| **User** | Event participant | Register, view schedule, make payments, generate slip |
| **Admin** | Event organizer | Approve users, manage content/meals/activities/payments |
| **Super Admin** | System administrator | All admin permissions + manage admins, settings, payment requests |

Admin sub-functions: `admin`, `reg_team_lead`, `health_team_lead`

---

## API Documentation

Interactive API documentation is auto-generated and available at:

```
http://localhost:4500/api/docs
```

### Endpoint groups

| Module | Base Path | Description |
|--------|-----------|-------------|
| Auth | `/api/auth/*` | Login, register, password reset (all roles) |
| Users | `/api/users` | User management |
| Admins | `/api/admins` | Admin management |
| Payments | `/api/payments` | Payments, approvals, deadlines |
| Posts | `/api/posts` | Content management |
| Activities | `/api/activities` | Camp activities |
| Days | `/api/days` | Camp days |
| Meals | `/api/meals` | Meal schedules |
| Notifications | `/api/notifications` | System notifications |
| Slips | `/api/slips` | Slip code generation |
| Settings | `/api/settings` | Portal configuration |
| Upload | `/api/upload` | File uploads |

---

## Scripts

### Backend (`cd backend`)

| Script | Description |
|--------|-------------|
| `npm run start:dev` | Start with hot-reload |
| `npm run build` | Compile TypeScript |
| `npm run start:prod` | Run compiled build |
| `npm run lint` | ESLint check + fix |
| `npm run test` | Run unit tests |
| `npx prisma studio` | Visual database editor |
| `npx prisma migrate dev` | Create + apply migration |

### Frontend (`cd frontend`)

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server (port 3000) |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint check |

---

## Deployment

### Docker (recommended)

Requires Docker via WSL on Windows:

```bash
# Build and start all services
docker compose up --build -d

# Apply database migrations
docker compose exec backend npx prisma migrate deploy

# Stop
docker compose down
```

This starts three containers:
- **postgres** — PostgreSQL 16 database
- **backend** — NestJS API on port 4500
- **frontend** — Next.js on port 3000

### Manual

1. Provision a PostgreSQL database
2. Set `DATABASE_URL` in backend environment
3. Run `npx prisma migrate deploy` in backend
4. Build and start backend: `npm run build && npm run start:prod`
5. Build and start frontend: `npm run build && npm run start`

---

## Contributing

1. Create a feature branch from `main`
2. Make changes following the existing code style
3. Run `npm run lint` in both frontend and backend
4. Test your changes locally
5. Submit a pull request

---

## Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** — Detailed technical architecture, database schema, auth flow, business logic
- **[COMMANDS.md](./COMMANDS.md)** — Complete CLI commands reference with explanations
- **[GIT-WORKFLOW.md](./GIT-WORKFLOW.md)** — Git branching strategy and team collaboration guide

---

## License

Private — TIMSAN Southwest Zone.
