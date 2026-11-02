import { randomUUID } from 'node:crypto';
import type { Request } from 'express';
import { permissionsFor } from './rbac.js';
import type { Store } from '../store.js';
import type { PublicUser, User } from '../types.js';

export const publicUser = (u: User): PublicUser => {
  const { passwordHash: _p, failedLogins: _f, lockedUntil: _l, ...rest } = u;
  return { ...rest, permissions: permissionsFor(u.roles) };
};

export const audit = (store: Store, req: Request, userId: string, activity: string, entity: string, entityId?: string, previous?: unknown, next?: unknown) => {
  store.auditLogs.unshift({ id: randomUUID(), userId, activity, entity, entityId, timestamp: new Date().toISOString(), ip: req.ip, device: req.headers['user-agent'], previous, next });
  if (store.auditLogs.length > 5000) store.auditLogs.length = 5000;
};
