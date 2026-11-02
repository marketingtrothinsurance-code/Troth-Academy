import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createApp } from './app.js';
import { createStore } from './store.js';

/* eslint-disable @typescript-eslint/no-explicit-any -- response bodies are asserted loosely in tests */
let server: Server;
let base: string;
beforeAll(async () => {
  const app = createApp(await createStore(), { secret: 'test-secret', clientOrigin: 'http://localhost:4200', rateLimit: false });
  server = app.listen(0);
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}/api/v1`;
});
afterAll(() => { server.close(); });

const call = async (path: string, opts: { method?: string; token?: string; body?: unknown; cookie?: string } = {}) => {
  const res = await fetch(base + path, {
    method: opts.method ?? 'GET',
    headers: { 'content-type': 'application/json', ...(opts.token ? { authorization: `Bearer ${opts.token}` } : {}), ...(opts.cookie ? { cookie: opts.cookie } : {}) },
    body: opts.body ? JSON.stringify(opts.body) : undefined
  });
  const isJson = (res.headers.get('content-type') ?? '').includes('json');
  return { status: res.status, res, json: isJson ? await res.json() as any : null, text: isJson ? '' : await res.text() };
};
const login = async (email: string, password = 'Troth@123') => {
  const r = await call('/auth/login', { method: 'POST', body: { email, password } });
  return { token: r.json?.data?.accessToken as string, cookie: (r.res.headers.get('set-cookie') ?? '').split(';')[0]!, r };
};

describe('auth', () => {
  it('logs in, rejects bad credentials and validates input', async () => {
    expect((await login('saurabh@troth.in')).token).toBeTruthy();
    expect((await login('saurabh@troth.in', 'Wrong@1234')).r.status).toBe(401);
    expect((await call('/auth/login', { method: 'POST', body: { email: 'nope', password: 'x' } })).status).toBe(400);
  });
  it('locks the account after repeated failures', async () => {
    for (let i = 0; i < 5; i++) await login('other.franchise@troth.in', 'Wrong@1234');
    expect((await login('other.franchise@troth.in')).r.status).toBe(429);
  });
  it('rotates refresh tokens so a used token cannot be replayed', async () => {
    const { cookie } = await login('trainer@troth.in');
    expect((await call('/auth/refresh', { method: 'POST', cookie })).status).toBe(200);
    expect((await call('/auth/refresh', { method: 'POST', cookie })).status).toBe(401);
  });
  it('requires a token for protected routes', async () => {
    expect((await call('/courses')).status).toBe(401);
  });
});

describe('RBAC', () => {
  it('blocks learners from admin actions and allows admins', async () => {
    const { token } = await login('saurabh@troth.in');
    expect((await call('/users', { token })).status).toBe(403);
    expect((await call('/audit-logs', { token })).status).toBe(403);
    expect((await call('/courses', { method: 'POST', token, body: {} })).status).toBe(403);
    const admin = (await login('admin@troth.in')).token;
    expect((await call('/users', { token: admin })).status).toBe(200);
  });
});

describe('Flow 1: admin creates, publishes, assigns; learner sees it', () => {
  it('works end to end and hides drafts from learners', async () => {
    const admin = (await login('academy@troth.in')).token;
    const created = await call('/courses', {
      method: 'POST', token: admin,
      body: {
        title: 'Claims Escalations', shortDescription: 'How to escalate a stuck claim.', academy: 'Insurance', category: 'Claims', instructor: 'Ananya Mehta',
        difficulty: 'Beginner', certificate: true, sections: [{ title: 'Basics', lessons: [{ title: 'Escalation ladder', duration: 10, type: 'video' }] }]
      }
    });
    expect(created.status).toBe(201);
    const id = created.json.data.id as string;
    const learner = (await login('saurabh@troth.in')).token;
    expect((await call(`/courses/${id}`, { token: learner })).status).toBe(404);
    expect((await call(`/courses/${id}/publish`, { method: 'POST', token: admin })).status).toBe(200);
    const assigned = await call('/assignments', { method: 'POST', token: admin, body: { courseId: id, userIds: ['u1'], dueDate: '2026-12-01' } });
    expect(assigned.json.data.assigned).toBe(1);
    const learning = await call('/users/me/learning', { token: learner });
    expect(learning.json.data.some((e: any) => e.courseId === id)).toBe(true);
    const logs = await call('/audit-logs', { token: admin });
    expect(logs.json.data.items.some((a: any) => a.activity === 'COURSE_PUBLISH')).toBe(true);
  });
  it('refuses to publish a course with no lessons', async () => {
    const admin = (await login('academy@troth.in')).token;
    const c = await call('/courses', {
      method: 'POST', token: admin,
      body: { title: 'Empty Course', shortDescription: 'Nothing here yet at all.', academy: 'Sales', category: 'Sales', instructor: 'Rohan Kapoor', difficulty: 'Beginner' }
    });
    expect((await call(`/courses/${c.json.data.id}/publish`, { method: 'POST', token: admin })).status).toBe(422);
  });
});

describe('Flows 2-4: progress, completion and certificate', () => {
  it('requires course completion and a passing assessment before issuing a verifiable certificate', async () => {
    const { token } = await login('saurabh@troth.in');
    const course = (await call('/courses/claims-basics', { token })).json.data;
    expect((await call(`/courses/${course.id}/enroll`, { method: 'POST', token })).status).toBe(200);
    const lessons = course.sections.flatMap((s: any) => s.lessons);
    const first = lessons[0];
    const low = await call(`/lessons/${first.id}/progress`, { method: 'POST', token, body: { courseId: course.id, watchedSeconds: 60, durationSeconds: first.duration * 60 } });
    expect(low.json.data.progress).toBe(0);
    expect(low.json.data.lessonStatus).toBe('IN_PROGRESS');
    expect((await call(`/courses/${course.id}/assessment/submit`, { method: 'POST', token, body: { answers: [0, 0, 0, 0, 0] } })).status).toBe(409);
    let last: any;
    for (const l of lessons) {
      last = await call(`/lessons/${l.id}/progress`, { method: 'POST', token, body: { courseId: course.id, watchedSeconds: l.duration * 60, durationSeconds: l.duration * 60, completed: true } });
    }
    expect(last.json.data.progress).toBe(100);
    expect(last.json.data.certificate).toBeNull();
    const assessment = await call(`/courses/${course.id}/assessment`, { token });
    expect(assessment.json.data.eligible).toBe(true);
    expect(assessment.json.data.questions).toHaveLength(5);
    expect(assessment.json.data.questions[0].correctIndex).toBeUndefined();
    const failed = await call(`/courses/${course.id}/assessment/submit`, { method: 'POST', token, body: { answers: [1, 1, 1, 1, 1] } });
    expect(failed.json.data.passed).toBe(false);
    expect(failed.json.data.certificate).toBeNull();
    const passed = await call(`/courses/${course.id}/assessment/submit`, { method: 'POST', token, body: { answers: [0, 0, 0, 0, 0] } });
    expect(passed.json.data.passed).toBe(true);
    const cert = passed.json.data.certificate;
    expect(cert.id).toMatch(/^TA-/);
    expect(cert.assessmentScore).toBe(100);
    const verified = await call(`/certificates/${cert.id}/verify`);
    expect(verified.json.data.valid).toBe(true);
    expect(verified.json.data.learnerName).toBe('Saurabh Sharma');
    expect((await call('/certificates/TA-NOPE/verify')).status).toBe(404);
  });
  it('rejects progress for a course the learner has not joined, and bad payloads', async () => {
    const { token } = await login('saurabh@troth.in');
    const c = (await call('/courses/health-insurance-fundamentals', { token })).json.data;
    expect((await call('/lessons/x/progress', { method: 'POST', token, body: { courseId: c.id, watchedSeconds: 1, durationSeconds: 10 } })).status).toBe(404);
    expect((await call('/lessons/x/progress', { method: 'POST', token, body: { courseId: c.id, watchedSeconds: -1, durationSeconds: 0 } })).status).toBe(400);
  });
  it('derives dashboard stats from real data', async () => {
    const { token } = await login('saurabh@troth.in');
    const d = (await call('/dashboard', { token })).json.data;
    expect(d.stats.completed).toBeGreaterThanOrEqual(1);
    expect(d.requiredTraining.some((t: any) => t.dueDate)).toBe(true);
  });
});

describe('Flows 5-7: manager, franchise, reports', () => {
  it('shows a manager only their direct reports', async () => {
    const { token } = await login('manager@troth.in');
    const team = (await call('/team', { token })).json.data;
    expect(team.members.map((m: any) => m.email)).toEqual(['saurabh@troth.in']);
  });
  it('shows a franchise owner only their own franchise', async () => {
    const { token } = await login('franchise.owner@troth.in');
    const emails = (await call('/franchise/learners', { token })).json.data.members.map((m: any) => m.email);
    expect(emails).toEqual(['franchise.staff@troth.in']);
  });
  it('prevents a manager assigning outside their team', async () => {
    const { token } = await login('manager@troth.in');
    const c = (await call('/courses/claims-basics', { token })).json.data;
    expect((await call('/assignments', { method: 'POST', token, body: { courseId: c.id, userIds: ['u8'] } })).status).toBe(403);
  });
  it('produces a course-completion report as JSON and CSV, for authorised roles only', async () => {
    const admin = (await login('admin@troth.in')).token;
    expect((await call('/reports/course-completion', { token: admin })).json.data.length).toBeGreaterThan(0);
    expect((await call('/reports/course-completion?format=csv', { token: admin })).text).toContain('Completion %');
    expect((await call('/reports/course-completion', { token: (await login('saurabh@troth.in')).token })).status).toBe(403);
  });
});

describe('catalog', () => {
  it('filters, sorts and paginates', async () => {
    const { token } = await login('saurabh@troth.in');
    const r = (await call('/courses?academy=Insurance&sort=az&limit=2&page=1', { token })).json.data;
    expect(r.items.length).toBeLessThanOrEqual(2);
    expect(r.items.every((c: any) => c.academy === 'Insurance')).toBe(true);
    expect(r.pagination.total).toBeGreaterThanOrEqual(3);
    const slugs = (await call('/courses?search=objection', { token })).json.data.items.map((c: any) => c.slug);
    expect(slugs).toContain('objection-handling');
  });
  it('supports bookmarks and notes', async () => {
    const { token } = await login('saurabh@troth.in');
    const c = (await call('/courses/crm-basics', { token })).json.data;
    await call(`/bookmarks/${c.id}`, { method: 'PUT', token });
    expect((await call('/bookmarks', { token })).json.data.some((x: any) => x.id === c.id)).toBe(true);
    await call(`/bookmarks/${c.id}`, { method: 'DELETE', token });
    expect((await call('/bookmarks', { token })).json.data.some((x: any) => x.id === c.id)).toBe(false);
    const lesson = c.sections[0].lessons[0].id;
    expect((await call(`/courses/${c.id}/notes`, { method: 'POST', token, body: { lessonId: lesson, text: 'Remember the daily view', timestamp: 42 } })).status).toBe(201);
    expect((await call(`/courses/${c.id}/notes?lessonId=${lesson}`, { token })).json.data).toHaveLength(1);
  });
});
