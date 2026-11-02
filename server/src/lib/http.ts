import type { NextFunction, Request, Response } from 'express';

export class AppError extends Error {
  constructor(public status: number, message: string, public errors: unknown[] = []) { super(message); }
}
export const ok = (res: Response, data: unknown, message = 'Request completed successfully', status = 200) =>
  res.status(status).json({ success: true, message, data });

export interface AuthedRequest extends Request { user?: { id: string; roles: string[]; permissions: string[] } }
type Handler = (req: AuthedRequest, res: Response, next: NextFunction) => unknown;
export const route = (fn: Handler) => (req: AuthedRequest, res: Response, next: NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export const paginate = <T>(items: T[], pageRaw: unknown, limitRaw: unknown, defaultLimit = 12, maxLimit = 50) => {
  const page = Math.max(1, Number(pageRaw) || 1);
  const limit = Math.min(maxLimit, Math.max(1, Number(limitRaw) || defaultLimit));
  return { items: items.slice((page - 1) * limit, page * limit), pagination: { page, limit, total: items.length, pages: Math.ceil(items.length / limit) } };
};
