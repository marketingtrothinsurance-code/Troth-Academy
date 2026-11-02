# Troth Academy

Enterprise learning portal built with Angular, Express, Node.js and MongoDB.

## Run locally

```bash
npm run install:all
npm install
npm run dev
```

Open `http://localhost:4200`. The API runs at `http://localhost:3000/api/v1`.

The application uses in-memory seed data when `server/.env` has no `MONGO_URI`, so the full learner flow works immediately. Copy `server/.env.example` to `server/.env` and add MongoDB credentials to persist data.

Demo login: `saurabh@troth.in` / `Troth@123`

## Implemented scope

- JWT login, refresh tokens, password hashing and permission middleware
- Academy/category/course APIs with filtering and pagination
- Enrollment and actual progress updates
- Learner dashboard, course discovery, details, player and My Learning
- Responsive learner shell, global search, notifications and profile menu
- MongoDB schemas/indexes plus in-memory development adapter

Advanced assessment, certification issuance, admin authoring and reporting are intentionally left for later phases from the master brief.

## Demo accounts (password `Troth@123`)

| Role | Email |
|---|---|
| Learner (Troth Employee) | saurabh@troth.in |
| Super Admin | admin@troth.in |
| Academy Admin | academy@troth.in |
| Trainer | trainer@troth.in |
| Manager | manager@troth.in |
| Franchise Owner | franchise.owner@troth.in |

## Status by phase

Done: auth (access + rotating refresh tokens, lockout), RBAC with permissions separate from roles, academies, categories, courses (CRUD, publish, archive, versioning), listing with filters/sort/pagination, course detail, player with server-verified progress (80% watch rule), enrolment, My Learning, bookmarks, notes, certificates with public verification, manager and franchise views, assignments, completion report (JSON/CSV), audit log, notifications.

Not yet built: quiz engine, question bank, formal assessments, learning paths, gamification/leaderboard, discussions, content library, drag-and-drop course builder, PDF generation (certificates use print-to-PDF), MongoDB repositories (models exist in `server/src/models.ts`; the API currently runs on the in-memory store in `server/src/store.ts`), AI Trainer.

## Tests

`npm test` runs the server (16 API tests) and client suites. Note: Angular's test runner cannot discover specs when the project path contains parentheses (for example `... (1)\Desktop\...`). Move or copy the project to a path without `(` `)` to run client tests.
