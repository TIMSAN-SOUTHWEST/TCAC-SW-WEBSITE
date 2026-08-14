# TCAC'26 — Architecture & Technical Report

## 1. Project Overview

**TCAC'26** (TIMSAN Camp and Conference 2026) is a full-stack event management system for the TIMSAN Southwest zone. It handles participant registration, multi-role authentication, payment tracking, camp schedule management, content publishing, and administrative operations.

---

## 2. Migration Summary

### Before: Monolithic Architecture

The original application was a single **Next.js 14** monolith using the Pages Router. Both frontend UI and backend API logic lived in the same codebase.

| Aspect | Original |
|--------|----------|
| Framework | Next.js 14 (Pages Router) |
| Backend | Next.js API Routes (`/pages/api/*`) |
| Database | MongoDB Atlas (cloud) |
| ORM | Mongoose |
| Auth | JWT (custom implementation in API routes) |
| File Upload | Vercel Blob Storage |
| Deployment | Vercel |

**Problems with the monolith:**
- Backend logic tightly coupled to frontend deployment
- No separation of concerns between API and UI
- MongoDB schema limitations for relational data (payments referencing users)
- No Swagger/API documentation
- Couldn't scale backend independently

### After: Separated Frontend + Backend

| Aspect | Frontend | Backend |
|--------|----------|---------|
| Framework | Next.js 14.2 (Pages Router) | NestJS 11 |
| Language | JavaScript (ES6+) | TypeScript |
| Database | — | PostgreSQL 16 |
| ORM | — | Prisma 6 |
| Auth | Token storage + interceptor | JWT + Passport.js |
| File Upload | Sends to backend | Local/Cloud storage |
| Containerization | Docker (multi-stage) | Docker (multi-stage) |
| API Docs | — | Swagger (auto-generated) |

---

## 3. Project Structure

```
TCAC-SW-WEBSITE/
├── frontend/                    # Next.js client application
│   ├── public/                  # Static assets (images, icons)
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── auth/            # Login/Register/Reset forms + withAuth HOC
│   │   │   ├── dashboard/       # Dashboard UI (user, admin, super-admin)
│   │   │   ├── landingPage/     # Public-facing components
│   │   │   └── ErrorBoundary.js # Global error boundary
│   │   ├── layouts/             # Page layout wrappers
│   │   │   ├── auth/            # Auth page layouts
│   │   │   └── dashboard/       # Dashboard layout
│   │   ├── pages/               # Next.js Pages Router
│   │   │   ├── [role]/dashboard/# Dynamic role-based dashboard
│   │   │   ├── login/[role].js  # Dynamic login page
│   │   │   ├── register/[role].js
│   │   │   ├── reset-password/[role].js
│   │   │   ├── admin/           # Admin preview pages
│   │   │   ├── _app.js          # App wrapper (providers)
│   │   │   └── index.js         # Landing page
│   │   ├── store/               # Redux Toolkit store
│   │   │   ├── index.js         # Store configuration
│   │   │   └── slices/          # Auth + action slices
│   │   ├── styles/              # CSS (globals, modules)
│   │   ├── themes/              # Chakra UI theme configuration
│   │   └── utils/
│   │       ├── api.js           # Axios instance (backend connection)
│   │       └── sanitizePost.js  # Post content sanitizer
│   ├── Dockerfile
│   ├── next.config.mjs
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/                     # NestJS API application
│   ├── prisma/
│   │   └── schema.prisma        # Database schema (all models)
│   ├── src/
│   │   ├── main.ts              # Application entry point
│   │   ├── app.module.ts        # Root module (imports all feature modules)
│   │   ├── prisma/              # Prisma service (database connection)
│   │   └── modules/
│   │       ├── auth/            # Authentication (JWT, Guards, Strategy)
│   │       ├── users/           # User CRUD + approval
│   │       ├── admins/          # Admin CRUD + approval
│   │       ├── super-admins/    # Super admin module
│   │       ├── payments/        # Payment submission, approval, deadlines
│   │       ├── posts/           # CMS content management
│   │       ├── activities/      # Camp activities CRUD
│   │       ├── days/            # Camp days CRUD
│   │       ├── meals/           # Meal schedule CRUD
│   │       ├── notifications/   # Notification CRUD
│   │       ├── slips/           # Unique slip code generation
│   │       ├── settings/        # Portal settings (registration, payments)
│   │       ├── upload/          # File upload handling
│   │       └── mail/            # Email service (nodemailer)
│   ├── Dockerfile
│   ├── nest-cli.json
│   ├── tsconfig.json
│   └── package.json
│
├── docker-compose.yml           # Production: all services together
├── docker-compose.dev.yml       # Development: PostgreSQL only
├── .env.docker                  # Docker environment variables
├── package.json                 # Root convenience scripts
└── README.md                    # Setup instructions
```

---

## 4. Backend Architecture (NestJS)

### 4.1 Framework & Patterns

- **NestJS 11** — TypeScript, modular architecture, dependency injection
- **Pattern**: Controller → Service → Prisma (Repository pattern via Prisma)
- **Validation**: `class-validator` + `class-transformer` with global `ValidationPipe`
- **Documentation**: Swagger/OpenAPI auto-generated at `/api/docs`

### 4.2 Database & ORM

- **PostgreSQL 16** — Relational database
- **Prisma 6** — Type-safe ORM with migration system

**Why PostgreSQL over MongoDB:**
- Payment → User relationships are naturally relational
- Registration status workflows benefit from ACID transactions
- Reporting queries (aggregations, joins) are more efficient
- Prisma provides type safety and migration versioning

### 4.3 Database Schema (12 models)

| Model | Purpose |
|-------|---------|
| User | Participants (students, alumni, children, non-timsanites) |
| Admin | Administrators with sub-functions (admin, reg_team_lead, health_team_lead) |
| SuperAdmin | Super administrators with full access |
| Payment | Payment records linked to users |
| Post | CMS content with multiple post types |
| Activity | Camp activities per day |
| Day | Camp days |
| Meal | Meal schedules per day |
| Notification | System notifications |
| Slip | Unique 16-digit slip codes per user |
| Settings | Portal configuration (registration open/closed, payment deadlines) |
| ResetCode | Temporary password reset codes (TTL-based) |

### 4.4 Authentication System

- **Strategy**: JWT (JSON Web Tokens) via `@nestjs/passport` + `passport-jwt`
- **Token Expiry**: 1 hour
- **Three role levels**: `user`, `admin`, `super_admin`
- **Guards**: `JwtAuthGuard` (authentication) + `RolesGuard` (authorization)
- **Password hashing**: bcryptjs with salt rounds of 12

### 4.5 API Endpoints

| Module | Base Path | Auth Required |
|--------|-----------|---------------|
| Auth — User | `POST /api/auth/user/*` | No |
| Auth — Admin | `POST /api/auth/admin/*` | No |
| Auth — Super Admin | `POST /api/auth/super-admin/*` | No |
| Users | `/api/users` | Admin/SuperAdmin |
| Admins | `/api/admins` | SuperAdmin |
| Payments | `/api/payments` | Varies |
| Posts | `/api/posts` | Admin/SuperAdmin (write), Public (read published) |
| Activities | `/api/activities` | Admin/SuperAdmin (write), Public (read) |
| Days | `/api/days` | Admin/SuperAdmin (write), Public (read) |
| Meals | `/api/meals` | Admin/SuperAdmin (write), Public (read) |
| Notifications | `/api/notifications` | Admin/SuperAdmin (write), Public (read) |
| Slips | `/api/slips` | Authenticated |
| Settings | `/api/settings` | Admin/SuperAdmin (write), Public (check-registration) |
| Upload | `PUT /api/upload` | Authenticated |

### 4.6 Key Backend Libraries

| Library | Version | Purpose |
|---------|---------|---------|
| @nestjs/core | 11.x | Framework core |
| @prisma/client | 6.x | Database ORM client |
| @nestjs/jwt | 11.x | JWT token generation/verification |
| @nestjs/passport | 11.x | Authentication middleware |
| passport-jwt | 4.x | JWT strategy for Passport |
| bcryptjs | 3.x | Password hashing |
| nodemailer | 7.x | Email sending (password resets) |
| class-validator | 0.14.x | Request DTO validation |
| @nestjs/swagger | 11.x | Auto-generated API documentation |

---

## 5. Frontend Architecture (Next.js)

### 5.1 Framework & Routing

- **Next.js 14.2** — Pages Router (not App Router)
- **React 18.3** — Latest React 18 stable
- **Routing**: File-based with dynamic segments (`[role].js`, `[role]/dashboard`)
- **SSG**: Landing page uses `getStaticProps` with ISR (revalidates every hour)

### 5.2 State Management

- **Redux Toolkit** — Global state for authentication and entity management
- **next-redux-wrapper** — SSR hydration bridge between server and client Redux state
- **5 slices**:
  - `userAuth` — User login/register/reset state + token
  - `adminAuth` — Admin login/register state + token
  - `superAdminAuth` — Super admin login state + token
  - `userActions` — Fetch/approve/reject users
  - `adminActions` — Fetch/approve/reject admins

### 5.3 API Communication

- **Centralized Axios instance** (`src/utils/api.js`)
- Base URL configured via `NEXT_PUBLIC_API_URL` environment variable
- **Request interceptor**: Automatically attaches JWT token from storage
- **Response interceptor**: Clears auth state on 401 responses
- **Token storage**:
  - Users → `sessionStorage` (clears on tab close)
  - Admins/SuperAdmins → `localStorage` (persists)

### 5.4 UI Framework & Styling

| System | Usage |
|--------|-------|
| **Chakra UI v2** | Primary UI component library (buttons, modals, forms, layout) |
| **Tailwind CSS v3** | Utility classes for quick layout adjustments |
| **CSS Modules** | Component-scoped styles (dashboard sections) |
| **Ant Design** | `Empty` state component, `Spin` loader |

**Theme**: Custom green/gray color scheme defined in `src/themes/theme.js` with Sora/Montserrat fonts.

### 5.5 Key Frontend Libraries

| Library | Version | Purpose |
|---------|---------|---------|
| next | 14.2.22 | React framework |
| react | 18.3.1 | UI library |
| @chakra-ui/react | 2.10.4 | Component library |
| framer-motion | 11.15.0 | Animation (required by Chakra) |
| @reduxjs/toolkit | 2.5.0 | State management |
| react-redux | 9.2.0 | React-Redux bindings |
| next-redux-wrapper | 8.1.0 | SSR Redux hydration |
| axios | 1.7.9 | HTTP client |
| antd | 5.22.7 | Empty/Spin components |
| react-slick | 0.30.3 | Carousel/slider |
| react-select | 5.9.0 | Advanced select dropdowns |
| react-icons | 5.4.0 | Icon library |
| xlsx | 0.18.5 | Excel export (admin downloads) |
| html2pdf.js | 0.10.3 | PDF generation (payment slips) |
| react-copy-to-clipboard | 5.1.0 | Clipboard copy for bank details |
| naija-state-local-government | 1.1.2 | Nigerian states/LGAs data |

### 5.6 Code Splitting

Dashboard components are **lazy-loaded** using `next/dynamic` with `{ ssr: false }`. This means:
- User dashboard doesn't download admin code
- Admin dashboard doesn't download super-admin code
- Each role only loads what it needs

### 5.7 Error Handling

- **ErrorBoundary** component wraps the entire app in `_app.js`
- Catches rendering errors and shows a recovery UI
- API errors handled per-component with Chakra `useToast` notifications

---

## 6. Authentication Flow

```
User enters credentials
        │
        ▼
Frontend dispatches loginUser/loginAdmin/loginSuperAdmin thunk
        │
        ▼
api.post('/auth/{role}/login', { emailOrID, password })
        │
        ▼
Backend verifies credentials, returns JWT + user data
        │
        ▼
Frontend stores token (sessionStorage/localStorage)
        │
        ▼
api.js interceptor attaches token to all subsequent requests
        │
        ▼
Backend JwtAuthGuard validates token on protected routes
        │
        ▼
RolesGuard checks if user's role matches required roles
```

---

## 7. Multi-Role System

| Role | Access Level | Dashboard Features |
|------|-------------|-------------------|
| **User** | Own data only | View schedule, meals, activities, payment history, generate slip |
| **Admin** (admin) | Manage users + content | Approve/reject users, manage posts, meals, activities, days, payments, slips |
| **Admin** (reg_team_lead) | User registration | View/manage registered users, meal schedule |
| **Admin** (health_team_lead) | Health operations | Daily schedule, meal schedule |
| **Super Admin** | Full system access | All admin features + manage admins, settings, payment requests |

---

## 8. Business Logic

### User Registration
1. User submits multi-step form (personal info → medical → CAC details → payment → password)
2. Backend checks if portal is open (via Settings)
3. Generates unique user ID: `TCAC'26-{CATEGORY}-{HOUSE}{COUNTER}` (houses rotate: ABU, UMR, UTH, ALI)
4. Calculates balance based on camp type, category, and pricing tier
5. Creates initial payment record if amount > 0

### Payment Pricing

| Category | Camp Only | Conference Only | Camp + Conference |
|----------|-----------|-----------------|-------------------|
| Student (standard) | ₦7,000 | ₦35,000 | ₦42,000 |
| Student (early-bird) | ₦6,000 | ₦30,000 | ₦36,000 |
| Alumnus (standard) | ₦10,000 | ₦35,000 | ₦50,000 |
| Alumnus (early-bird) | ₦8,000 | ₦30,000 | ₦44,000 |
| Child (standard) | ₦4,000 | — | — |
| Child (early-bird) | ₦3,000 | — | — |

### Payment Deadline Enforcement
- Admin sets a payment deadline in Settings
- After deadline, users with outstanding balance are blocked from dashboard access
- Users can request payment access (pending admin approval)

---

## 9. Docker & Deployment

### Container Architecture

```
┌─────────────────────────────────────────┐
│            docker-compose.yml            │
├─────────────┬───────────┬───────────────┤
│  frontend   │  backend  │   postgres    │
│  (Next.js)  │  (NestJS) │  (PostgreSQL) │
│  Port 3000  │ Port 4500 │  Port 5432   │
└─────────────┴───────────┴───────────────┘
```

### Dockerfiles

**Frontend** (multi-stage):
1. `deps` → Install node_modules
2. `builder` → Build Next.js (standalone output)
3. `production` → Run with minimal Node.js image

**Backend** (multi-stage):
1. `builder` → Install deps, generate Prisma, compile TypeScript
2. `production` → Run compiled JS with production deps only

### Running (via WSL on Windows)

```bash
# Full stack
docker compose up --build -d
docker compose exec backend npx prisma migrate deploy

# Development (just database)
docker compose -f docker-compose.dev.yml up -d
cd backend && npm run start:dev
cd frontend && npm run dev
```

---

## 10. Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| DATABASE_URL | PostgreSQL connection string |
| JWT_SECRET_KEY | Secret for JWT signing |
| PORT | Server port (default: 4000) |
| BACKEND_URL | Public URL of backend |
| FRONTEND_URL | Frontend URL (for CORS) |
| EMAIL_USER | Gmail address for sending emails |
| EMAIL_PASS | Gmail app password |
| NODE_ENV | development / production |

### Frontend (`frontend/.env`)

| Variable | Description |
|----------|-------------|
| NEXT_PUBLIC_API_URL | Backend API base URL (e.g., `http://localhost:4000/api`) |

---

## 11. Development Workflow

### Backend

```bash
cd backend
npm install
npx prisma generate          # Generate Prisma Client
npx prisma migrate dev       # Run migrations
npm run start:dev            # Start with hot-reload
```

- API docs available at `http://localhost:4500/api/docs`
- Database GUI via `npx prisma studio`

### Frontend

```bash
cd frontend
npm install
npm run dev                  # Start with hot-reload on port 3000
```

### Adding a New Feature (Backend)

1. Update `prisma/schema.prisma` if new database fields needed
2. Run `npx prisma migrate dev --name describe_change`
3. Create module: `src/modules/{feature}/{feature}.module.ts`
4. Create service: `src/modules/{feature}/{feature}.service.ts`
5. Create controller: `src/modules/{feature}/{feature}.controller.ts`
6. Register module in `app.module.ts`

### Adding a New Feature (Frontend)

1. Create component in appropriate directory under `src/components/`
2. If it needs API data, use `api.get()/api.post()` from `@/utils/api`
3. If it needs global state, add to relevant Redux slice
4. If it's a dashboard feature, add to `DBSelectedCompRenderer.js` and the sidebar

---

## 12. Security Considerations

- JWT tokens expire after 1 hour
- Passwords hashed with bcryptjs (12 salt rounds)
- Input validated on backend with class-validator (whitelist mode strips unknown fields)
- CORS restricted to frontend URL
- File uploads validated by size and type
- Reset codes expire after 15 minutes with max 5 attempts
- No sensitive data logged to console in production
- Docker runs as non-root user in production containers

---

## 13. Known Limitations & Future Improvements

| Area | Current State | Recommended Improvement |
|------|--------------|------------------------|
| UI Library | Chakra UI v2 (React 18 only) | Migrate to Chakra v3 when stable |
| Styling | Mixed (Chakra + Tailwind + CSS Modules) | Consolidate to Chakra-only |
| Auth forms | Some duplication across roles | Extract shared `AuthForm` component |
| Sidebar | Duplicated per role | Extract generic `Sidebar` with config |
| TypeScript | Backend only | Add TypeScript to frontend |
| Testing | None | Add Jest + React Testing Library |
| File Upload | Local storage in Docker | Integrate S3/Cloudinary for production |
| Email | Gmail SMTP | Use dedicated email service (SendGrid, etc.) |
| Monitoring | None | Add health checks, logging (Winston), APM |

---

