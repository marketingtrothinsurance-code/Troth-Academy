import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import { ok, route } from './lib/http.js';
import { authenticate, errorHandler, notFound } from './middleware.js';
import { authRoutes } from './routes/auth.js';
import { catalogRoutes } from './routes/catalog.js';
import { learningRoutes } from './routes/learning.js';
import { adminRoutes } from './routes/admin.js';
import type { Store } from './store.js';

export interface AppOptions { secret: string; clientOrigin: string; rateLimit?: boolean }

export const createApp = (store: Store, opts: AppOptions) => {
  const app = express();
  app.set('trust proxy', 1);
  app.use(helmet());
  app.use(cors({ origin: opts.clientOrigin, credentials: true }));
  app.use(express.json({ limit: '1mb' }));
  app.use(cookieParser());
  const api = express.Router();
  const authMw = authenticate(store, opts.secret);
  if (opts.rateLimit !== false) api.use('/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 50, standardHeaders: 'draft-8' }));

  api.get('/health', (_req, res) => ok(res, { status: 'healthy', database: mongoose.connection.readyState === 1 ? 'mongodb' : 'memory' }));
  api.use('/auth', authRoutes(store, opts.secret, authMw));

  // Public credential verification: only exposes what a verifier needs.
  api.get('/certificates/:id/verify', route((req, res) => {
    const cert = store.certificates.find(c => c.id === req.params['id']);
    if (!cert) return res.status(404).json({ success: false, message: 'Certificate not found', errors: [] });
    const user = store.users.find(u => u.id === cert.userId)!;
    const expired = !!cert.expiresAt && new Date(cert.expiresAt) < new Date();
    return ok(res, { valid: !expired, id: cert.id, title: cert.title, level: cert.level, learnerName: `${user.firstName} ${user.lastName}`, issuedAt: cert.issuedAt, expiresAt: cert.expiresAt ?? null });
  }));

  // Public showcase for the landing page: published courses only, no learner data.
  api.get('/public/overview', route((_req, res) => {
    const published = store.courses.filter(c => c.status === 'PUBLISHED');
    return ok(res, {
      totals: { courses: published.length, academies: new Set(published.map(c => c.academy)).size, lessons: published.reduce((n, c) => n + c.sections.reduce((m, s) => m + s.lessons.length, 0), 0) },
      featured: [...published].sort((a, b) => b.learners - a.learners).slice(0, 6).map(c => ({ id: c.id, slug: c.slug, title: c.title, shortDescription: c.shortDescription, academy: c.academy, category: c.category,
        instructor: c.instructor, difficulty: c.difficulty, duration: c.duration, certificate: c.certificate, required: c.required ?? false, lessons: c.sections.reduce((n, s) => n + s.lessons.length, 0) }))
    });
  }));

  api.use(authMw);
  api.get('/me', route((req, res) => {
    const u = store.users.find(x => x.id === req.user!.id)!;
    return ok(res, { id: u.id, firstName: u.firstName, lastName: u.lastName, email: u.email, roles: u.roles, permissions: req.user!.permissions });
  }));
  api.use(catalogRoutes(store));
  api.use(learningRoutes(store));
  api.use(adminRoutes(store));
  app.use('/api/v1', api);
  app.use(notFound);
  app.use(errorHandler);
  return app;
};
