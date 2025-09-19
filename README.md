# Muhasebe - Admin Panel MVP

A minimal accounting/management application with role-based admin panel for MVP iteration.

## Features

### Backend (Express.js)
- **Authentication System**: JWT-based authentication with bcrypt password hashing
- **Role-Based Access Control**: User and admin roles with middleware protection
- **Database Schema**: PostgreSQL with users, tickets, and plans tables
- **API Endpoints**:
  - `/api/auth/login` - User authentication
  - `/api/auth/register` - User registration
  - `/api/auth/me` - Get current user info
  - `/api/admin/users` - List all users (admin only)
  - `/api/admin/tickets` - List all tickets with user details (admin only)
  - `/api/admin/tickets/:id` - Update ticket status (admin only)
  - `/api/admin/plans` - Create, update, delete plans (admin only)
  - `/api/plans` - List plans (public)

### Frontend (React + Vite)
- **Authentication State Management**: Automatic token validation and user state
- **Role-Based Navigation**: Admin panel access only for admin users
- **Admin Panel Features**:
  - User management with role visualization
  - Ticket management with status updates
  - Plan management with creation/editing
  - Real-time success/error feedback

## Setup Instructions

### Prerequisites
- Node.js 18+ 
- PostgreSQL 13+ (or Docker)
- npm

### 1. Database Setup

#### Option A: Using Docker (Recommended)
```bash
docker run --name muhasebe-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=muhasebe_test \
  -p 5432:5432 \
  -d postgres:13
```

#### Option B: Local PostgreSQL
Create a database named `muhasebe_test` with user `postgres`.

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your database settings and admin credentials
# Required variables:
# DATABASE_HOST=localhost
# DATABASE_PORT=5432
# DATABASE_USER=postgres
# DATABASE_PASSWORD=postgres
# DATABASE_NAME=muhasebe_test
# JWT_SECRET=your-super-secret-jwt-key-change-in-production
# ADMIN_EMAIL=admin@muhasebe.com
# ADMIN_PASS=admin123

# Run database migrations
node scripts/migrate.js

# (Optional) Seed sample data
node scripts/seedData.js

# Start the backend server
npm start
```

The backend will be running on `http://localhost:3000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be running on `http://localhost:3001`

## Admin Panel Usage

### Creating Admin User
The admin user is automatically created when you start the backend with `ADMIN_EMAIL` and `ADMIN_PASS` environment variables set.

**Default Admin Credentials:**
- Email: `admin@muhasebe.com`
- Password: `admin123`

### Accessing Admin Panel
1. Navigate to `http://localhost:3001`
2. Login with admin credentials
3. Click the "Admin" button in the navigation
4. You'll see three main sections:

#### Users Management
- View all registered users
- See user roles (admin/user) with color-coded badges
- User information: ID, name, email, role

#### Tickets Management  
- View all support tickets with user details
- Change ticket status: Open → In Progress → Closed
- See ticket information: ID, title, user email, current status

#### Plans Management
- View all subscription plans
- Create new plans with name, price, and speed
- See plan information: ID, name, price, speed, creation date

## Admin Panel Endpoint

The admin panel is accessible at `http://localhost:3001` after logging in with admin credentials. The admin user is automatically created via environment variables `ADMIN_EMAIL` and `ADMIN_PASS`.

## Development Notes

This is a **Proof of Concept (PoC)** implementation focused on core admin functionality. Production hardening items are out of scope for this MVP.

## Project Structure

```
muhasebe/
├── backend/           # Express.js API server
│   ├── src/          # Source code
│   ├── scripts/      # Database migrations & seeding
│   └── sql/          # SQL schema files
└── frontend/         # React frontend
    └── src/          # React components
```
