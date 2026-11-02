# Troth Academy — inspection of supplied source archive

**Scope:** Source tree from uploaded `Troth Academy.zip`, excluding historical build/cache artifacts. This is a static code review, not a live production test.

## Architecture

| Subproject | Source | Description |
| --- | --- | --- |
| Client | `client/src/app/` | Angular 22, TypeScript 6, SCSS, standalone route components, Angular HttpClient |
| Server | `server/src/` | Node/Express 5 REST API with Zod validation, Helmet, CORS, rate limiting |
| Auth | `server/src/routes/auth.ts`, `client/src/app/core/` | Password hashing (bcrypt), JWT bearer tokens, rotating refresh cookies, RBAC |
| Data | `server/src/store.ts`, `seed.ts`, `data.ts` | Seeded, mutable in-memory collections; not durable |
| Intended database | `server/src/models.ts` | Mongoose schemas; not connected to the route repository |
| Tests | `server/src/*.test.ts`, `client/src/app/app.spec.ts` | API and route tests exist; were not executed in this audit |
| Deployment | `vercel.json`, `api/index.mjs` | Added for Vercel demonstration; not verified live |
| Free alternative | `render.yaml`, `server/src/preview-server.ts` | Single-server demo on Render Free; not verified live |

## Application routes / screen inventory

| Route | Screen | Access |
| --- | --- | --- |
| `/` | Marketing / welcome landing + featured courses | Guest |
| `/login` | Demo role login | Guest or signed-in redirect |
| `/dashboard` | Personalized training dashboard | Authenticated |
| `/mandatory-courses` | Mandatory course catalog | Authenticated |
| `/courses` | Browsable/searchable course catalog | Authenticated |
| `/courses/:slug` | Course details and enrollment | Authenticated |
| `/learn/:slug` | Video / SOP / quiz-topic player + tracking | Authenticated |
| `/my-learning` | My enrollments, saved courses, completed courses | Authenticated |
| `/academies` | Academy overview | Authenticated |
| `/assessments` | Generated quiz assessment experience | Authenticated |
| `/certifications` | Issued certificates / print flow | Authenticated |
| `/verify` and `/verify/:id` | Certificate verification | Public |
| `/team` | Manager or franchise-team overview | Role permission |
| `/admin` | Course and user operations, assignments, reports, audit | Admin permission |

## Implemented API areas

- Public catalog summary and certificate verification.
- JWT login / refresh / logout, account and permission checks.
- Academy/category/course discovery, filter, pagination; CRUD, publish and archive for permitted roles.
- Enrollments, server-side progress updates, dashboard, saved items, learner notes and notifications.
- Assessment eligibility and fixed 5-question curriculum-derived quiz scoring (70% threshold).
- Certificates, manager/franchise team views, assignments, completion reports and audit log.

## Seed content

- 85 courses generated from the existing `data.ts` arrays (79) plus 6 courses in `seed.ts`.
- 8 seeded users, of which 6 have selectable role examples on the login page.
- 8 academy labels: Foundation, Insurance, Finance, Wealth, Sales, Operations, Troth One, Compliance.
- 42+ image/media files in `client/public`, approximately 30 MB total.
- Course lessons often use generated topic outlines, and not all lessons have playable media.

## Findings, in priority order

### Critical for real use

1. **Memory-only data:** `server/src/store.ts` builds arrays on startup. Vercel scales functions independently; a mutation is not durable. Even supplying `MONGO_URI` does not fix this; `server/src/server.ts` confirms the repositories are still in memory.
2. **Hosted preview cannot be static-only:** Angular calls `/api/v1/*` for even the public home statistics and login. Deploying only `client/` without API breaks primary flows.
3. **Exposed sample accounts:** Demo emails and one shared password are in `client/src/app/features/login/login.ts` and `server/src/seed.ts`. Safe only for strictly synthetic data and appropriately limited access.
4. **Commercial hosting restriction:** Vercel Hobby is for personal, noncommercial use; company previews should use a permitted plan or alternative service.

### Important for developer handoff

5. **Stale project README:** Its early-scope section says assessments were left for later, but code currently implements assessment screens and a deterministic 5-question quiz; this distinction should be updated in formal requirements.
6. **Authentication lifecycle:** Access tokens are saved in localStorage; refresh token IDs live in the in-memory map. After instance recycle, refresh/logout behavior can be inconsistent.
7. **Content maturity:** Many lessons are placeholders and video IDs are external. Completion tracking cannot prove users watched a third-party iframe to a prescribed threshold the same way a controlled native video can.
8. **Safety of external URLs:** `client/src/app/shared/safe-resource.pipe.ts` bypasses Angular resource URL security checks. Implement allowlisting/validation before accepting administrator-entered URLs in real deployment.
9. **Operational readiness:** No durable activity history, durable reporting, file upload backend, secure exam item bank, or real PDF signing mechanism.
10. **Distribution hygiene:** The original ZIP contains ~30 MB of precompiled frontend, ~5.7 MB of Angular cache and logs. This prepared ZIP excludes those files and retains the required static assets.

### Good foundations already present

- Clear frontend/backend separation, typed models, lazy-loaded route screens.
- API validation, basic role authorization, password hashing, JWT cookies, audit operations and tests.
- Several demonstration roles enable distinct designer/developer walkthroughs.
- Screens and source code are a useful UI/UX reference for a full new implementation.

## Validation performed

- Extracted and inventoried the archive, inspected the application and API routing, auth, seed/store, admin, progress and assessment logic.
- Parsed project configurations and examined the historical Angular build output.
- Counted course arrays by importing the prebuilt data module.
- Searched the archive for obvious local secret files. No non-example `.env` or private key file was found. This is **not** a comprehensive security audit.
- Checked the syntax of the added deployment config and API entrypoint.
- **Not performed:** npm dependency installation, Angular build, API unit tests, browser end-to-end test or live Vercel/Render deployment. Passing the first live deployment is not guaranteed.

## Review recommendation

Give Troth's developers this repository and `DEPLOYMENT_GUIDE.md` as a **functional design reference**, not as a database- or security-ready enterprise architecture. Preserve the screens and workflows in phase 1; make architecture and persistence decisions before onboarding real staff.
