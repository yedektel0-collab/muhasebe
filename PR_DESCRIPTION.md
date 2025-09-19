# Init MVP monorepo: backend (Express+SQLite) + frontend (React+Vite) + Docker PoC

## Summary

This PR introduces a monorepo scaffold with `/backend` and `/frontend` directories:

**Backend Features:**
- Node.js + Express + SQLite with endpoints: /api/signup, /api/login, /api/me, /api/plans, /api/tickets
- Admin seeder using ADMIN_EMAIL/ADMIN_PASS from .env
- JWT-based authentication
- Basic user and ticket management

**Frontend Features:**
- React + Vite minimal app with login/signup functionality
- Dashboard stub that lists plans
- Token-based authentication integration

**Infrastructure:**
- docker-compose.yml for development environment
- .env.example with configuration template
- README.md for quickstart documentation

**Note:** This is a PoC scaffold; production hardening is out of scope for this PR. The implementation focuses on demonstrating the basic architecture and functionality of the MVP monorepo structure.

## Changes from main

- Monorepo scaffold with `/backend` and `/frontend` directories
- Backend: Node.js + Express + SQLite with endpoints: /api/signup, /api/login, /api/me, /api/plans, /api/tickets. Admin seeder using ADMIN_EMAIL/ADMIN_PASS from .env
- Frontend: React + Vite minimal app with login/signup and a dashboard stub that lists plans
- docker-compose.yml, .env.example, and README.md for quickstart documentation