# Troth Academy — GitHub and Vercel prototype guide

> **Prototype only.** The application is designed to demonstrate screens, roles and learning workflows. It is **not** connected to production data and is **not** a durable learning management system.

## What this package changes

- Keeps the original Angular client, Express routes, catalog, course player, assessment and admin screens.
- Excludes generated `dist/`, Angular cache, logs, node_modules and secret files from the repository.
- Adds `vercel.json` to build the frontend + backend from a single repository.
- Adds `api/index.mjs` to run the existing Express APIs as a Vercel Function.
- Adds an **optional Render Free** single-server deployment (`render.yaml`, `server/src/preview-server.ts`) for an actual zero-cost preview instead of Vercel Hobby. State still resets when the server sleeps/restarts.
- Sets Node.js 24.x in the root package for Angular 22 compatibility.
- Does **not** replace in-memory data with MongoDB, add real accounts or change business workflows.

## 1 — Create a private GitHub repository

1. Extract this ZIP. Open the extracted **Troth-Academy-GitHub-Vercel-Prototype** directory.
2. In GitHub, create a new **private** repository, for example `troth-academy-prototype`. Do not initialize with a README or license.
3. From a terminal **inside the extracted directory**, run:

```sh
git init
git branch -M main
git add .
git commit -m "Initial Troth Academy prototype"
git remote add origin https://github.com/YOUR-ACCOUNT/troth-academy-prototype.git
git push -u origin main
```

Replace `YOUR-ACCOUNT` with your actual GitHub username or organization. GitHub authentication / repository access must be set up on your device. A ZIP file uploaded as a single file to GitHub will **not** automatically become an extracted project.

## 2 — Deploy to Vercel (subject to the plan restriction below)

1. Open https://vercel.com/new and select **Import Git Repository**.
2. Select the private GitHub repository above.
3. Set **Root Directory** to the repository root (`./`). Set **Framework Preset** to `Other` (or use the repository's `vercel.json` configuration).
4. Keep these settings, which are already in `vercel.json`:
   - **Install:** `npm ci --prefix client && npm ci --prefix server`
   - **Build:** `npm run build --prefix server && npm run build --prefix client`
   - **Output Directory:** `client/dist/client/browser`
   - **Node.js:** 24.x
5. Under **Environment Variables**, create `JWT_SECRET` with a different long random string (at least 32 characters). For example, generate one locally:

```sh
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

6. Click **Deploy**. The first deployment is not verified by this package—inspect the build and function logs if Vercel reports an error.
7. Open the assigned HTTPS URL. Test `/`, `/login`, and `/api/v1/health` before the learning workflow.

`CLIENT_ORIGIN` is optional for the same-origin Vercel preview; the adapter uses `VERCEL_URL` when available. **Do not set `MONGO_URI`** expecting persistence: the repository does not have MongoDB-backed repositories yet.

### Important Vercel plan restriction

Vercel's **Hobby** ($0) plan is restricted to *personal, non-commercial* use. A company-owned Troth Academy preview being reviewed for business development may qualify as commercial usage even with no revenue or real customers. Use a permitted Vercel plan (for example, Pro) or select another hosting provider whose free tier explicitly permits your use case. Do not assume that "only a prototype" creates an exemption.

References: https://vercel.com/docs/plans/hobby and https://vercel.com/docs/limits/fair-use-guidelines

## 3 — Zero-cost alternative: Render Free (recommended for the company preview)

Vercel Hobby is restricted to personal noncommercial use. **Render Free** offers a free Node/Express web service intended for testing/preview use; its terms and quotas should still be checked for your specific organization.

This repository includes `render.yaml` to run **both** the existing Express API and the compiled Angular UI on one Node service. Unlike Vercel functions, one running instance normally shares one in-memory dataset until it sleeps/restarts.

1. Push this same repository to GitHub.
2. Go to https://dashboard.render.com/ and connect GitHub.
3. Choose **New > Blueprint** and select the repository's `render.yaml` (or choose **New > Web Service** and enter the build/start commands from that YAML).
4. Confirm **plan: Free**. The YAML generates `JWT_SECRET` for you.
5. Deploy and open its `onrender.com` URL. Verify `/api/v1/health`, then the landing and login pages.

**Limitations:** Render's free web service spins down after 15 minutes of inactivity and may take approximately a minute to start again. All in-memory changes reset after sleep/restart/redeploy; it is not a production learning system. Review usage limits and potential overage billing rules. References: https://render.com/docs/free and https://render.com/docs/blueprint-spec.

## 4 — Reviewer demonstration sequence

1. **Landing** → see welcome, featured courses, public overview.
2. **Login** → use one of the built-in demonstration roles shown on the login page. The fixed password is shown there and is only for fake accounts.
3. **Learner dashboard** → review assigned/mandatory courses, recommendations, progress and certificates.
4. **Browse / Academies** → search by academy, product, difficulty and topic.
5. **Course details** → inspect syllabus, choose Enroll/Start.
6. **Course player** → inspect video, text, SOP and lesson completion controls.
7. **My Learning** → enrolled, saved and completed views.
8. **Assessment / Certification** → complete lessons, attempt a 5-question sample quiz and inspect certificate/verification flow.
9. **Manager / Franchise owner** → use role demo accounts and inspect their team view.
10. **Admin** → use admin demo account and inspect course creation/publishing, assignments, users, reports and audit logs.

### Expected demo limitations

- **No persistence**: all state is seeded in memory when each Vercel Function instance starts. Enrollments, progress, notes, certificates, quiz attempts and admin changes can reset unpredictably or diverge between instances. A login may need repeating when refresh-token storage resets.
- **No real MongoDB storage**: schemas exist but routes still use the in-memory `Store`.
- **Sample media**: many courses have outline/tutorial content; external YouTube links may fail to embed or may be unrelated.
- **Simple assessments**: 5 automatically generated curriculum questions, not a secure question bank or real certification exam.
- **Certificates**: print-to-PDF only, not a dedicated PDF generation service. Do not use demo certificates as actual qualification evidence.
- **Fixed demo accounts**: never use this project for real employee information or release with sample credentials as a live application.
- **Frontend token handling**: the access token is stored in localStorage; assess security for production use.
- **Build/test validation**: the uploaded ZIP includes historical compiled files, but the new Vercel deployment was not executed in this environment. Run the project's test suites in a supported Node 24 environment before treating it as verified.

## 5 — Local development (for Troth developers)

Install Node 24.x and npm, then inside the repository root:

```sh
npm install
npm ci --prefix client
npm ci --prefix server
npm run dev
```

Open http://localhost:4200. The API runs at http://localhost:3000/api/v1, with Angular's dev proxy handling `/api` requests. Local API runs with the original development-only fallback secret; use environment secrets for any hosted deployment.

Run tests and build:

```sh
npm test
npm run build
```

## 6 — Production implementation checklist

- Implement authenticated accounts, password reset / SSO and secrets management.
- Replace in-memory arrays and refresh-token map with actual persistent repositories (MongoDB / PostgreSQL + appropriate token store).
- Add real course upload, media hosting/access controls, content editor, question bank and verified assessments.
- Secure YouTube/video URLs and review bypassed Angular resource URL sanitization.
- Add certificate validation, issuance policies, real PDF rendering and expiry workflows.
- Add role-based administrative safeguards and audit durability, accessibility checks, testing and monitoring.
- Resolve seeded sample names, emails, deadlines and placeholder business metrics.
- Prepare security, privacy, backup, retention and infrastructure documentation.

See `PROJECT_INSPECTION.md` for the source-code audit and feature inventory.
