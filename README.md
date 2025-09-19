# Muhasebe System

A simple accounting system with customer management and admin panel.

## Features

- Customer CRUD operations
- JWT-based authentication system
- Role-based access control (admin/user)
- Admin panel for managing users, tickets, and plans
- React frontend with admin interface

## Setup

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Update .env with your database credentials
npm start
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Database Setup

The system requires PostgreSQL. Run the SQL migrations in order:

1. `backend/sql/001_init.sql` - Initial customer table
2. `backend/sql/002_auth_tables.sql` - Authentication tables (users, tickets, plans)

### Admin User Creation

Set environment variables in `.env`:

```
ADMIN_EMAIL=admin@example.com
ADMIN_PASS=adminpassword
```

Then run the seeder:

```bash
cd backend
node scripts/seed-admin.js
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/me` - Get current user info

### Admin Endpoints (requires admin role)
- `GET /api/admin/users` - List all users
- `GET /api/admin/tickets` - List all tickets with user info
- `PATCH /api/admin/tickets/:id` - Update ticket status
- `POST /api/admin/plans` - Create new plan
- `PUT /api/admin/plans/:id` - Update plan
- `DELETE /api/admin/plans/:id` - Delete plan

### Public Endpoints
- `GET /api/plans` - List all plans
- Customer CRUD endpoints under `/customers`

## Admin Panel

Access the admin panel by logging in with admin credentials. The admin panel allows you to:

- View all users and their roles
- Manage support tickets and update their status (open/in_progress/closed)
- Create, update, and delete subscription plans
- Monitor system activity

Demo credentials:
- Email: admin@example.com
- Password: adminpassword

## Architecture

- **Backend**: Node.js + Express + PostgreSQL
- **Frontend**: React + Vite
- **Authentication**: JWT tokens with bcrypt password hashing
- **Authorization**: Role-based middleware (admin/user roles)

This is a Proof of Concept (PoC) implementation focused on core admin functionality. Production hardening is out of scope.